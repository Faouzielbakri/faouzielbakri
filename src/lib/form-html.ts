import { promises as fs } from "fs";
import path from "path";

/**
 * Serves a form from content/forms/<slug>.html with a small bridge script
 * added before the form's own scripts run. The bridge sends answers to
 * /api/forms/<slug> in three ways, so most forms need no edits:
 *
 * 1. Forms exported from a Claude artifact call `window.claude.use("db")` and
 *    `window.claude.use("user")`. The bridge stands in for both: a
 *    `db.doc(...).set({ answers, summary })` becomes a send here.
 * 2. Any `<form data-collect>` is sent on submit, every named field included.
 * 3. Hand-written pages can call `window.sendFormResponse(answers, summary)`.
 *
 * Nothing typed should be lost:
 * - Every form on the page autosaves a draft to the server a few seconds after
 *   the last change, and once more when the page is hidden or closed
 *   (`data-no-autosave` on a form turns this off).
 * - A send that fails (offline, timeout, server down) is kept in the browser
 *   and retried when the connection returns or the page is opened again.
 * - Sends run one at a time, so a double tap cannot race itself.
 *
 * The respondent id is random and kept in the browser: one row per browser,
 * updated by later drafts and sends.
 */
const bridge = (slug: string) => `
<script>
(function () {
  var endpoint = "/api/forms/${slug}";
  var PENDING = "form-pending:${slug}";
  var memory = {};
  // Autosave state: the form with unsaved changes, its timer, and the answers last saved.
  var dirty = null, timer = null, draftKey = "";
  function store(key, value) {
    try {
      if (value === undefined) localStorage.removeItem(key); else localStorage.setItem(key, value);
    } catch (e) { if (value === undefined) delete memory[key]; else memory[key] = value; }
  }
  function load(key) {
    try { var v = localStorage.getItem(key); if (v !== null) return v; } catch (e) {}
    return memory[key] || null;
  }
  function respondent() {
    var id = load("form-respondent");
    if (!id) {
      id = (window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(16) + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)).replace(/[^A-Za-z0-9]/g, "").slice(0, 64);
      store("form-respondent", id);
    }
    return id;
  }

  function post(payload, timeout) {
    var controller = window.AbortController ? new AbortController() : null;
    var stop = controller ? setTimeout(function () { controller.abort(); }, timeout) : null;
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined,
    }).then(function (res) {
      if (stop) clearTimeout(stop);
      if (!res.ok) throw new Error("Not saved (" + res.status + ")");
      return res.json();
    }, function (error) { if (stop) clearTimeout(stop); throw error; });
  }

  // One request at a time: a second send waits for the first to finish.
  var queue = Promise.resolve();
  function enqueue(job) {
    var next = queue.then(job, job);
    queue = next.then(function () {}, function () {});
    return next;
  }

  function send(answers, summary) {
    var payload = { respondent: respondent(), kind: "sent", answers: answers || {}, summary: summary || undefined };
    // Kept until the server confirms, so a failed send is retried later.
    store(PENDING, JSON.stringify(payload));
    return enqueue(function () {
      return post(payload, 15000).then(function (result) {
        if (load(PENDING) === JSON.stringify(payload)) store(PENDING, undefined);
        draftKey = JSON.stringify(payload.answers);
        return result;
      });
    });
  }
  window.sendFormResponse = send;

  function retryPending() {
    var raw = load(PENDING);
    if (!raw) return;
    enqueue(function () {
      return post(JSON.parse(raw), 15000).then(function () {
        if (load(PENDING) === raw) store(PENDING, undefined);
      });
    }).catch(function () {});
  }
  window.addEventListener("online", retryPending);
  setTimeout(retryPending, 1500);

  /* ── Autosaved drafts ─────────────────────────────────────────────── */

  function collect(form) {
    var out = {};
    Array.prototype.forEach.call(form.querySelectorAll("[name]"), function (el) {
      var name = el.name;
      if (!name || el.disabled || el.type === "file" || el.type === "submit" || el.type === "button") return;
      if (el.type === "checkbox") {
        if (!Array.isArray(out[name])) out[name] = [];
        if (el.checked) out[name].push(el.value);
      } else if (el.type === "radio") {
        if (!(name in out)) out[name] = "";
        if (el.checked) out[name] = el.value;
      } else if (!(name in out)) {
        out[name] = String(el.value || "").trim();
      }
    });
    return out;
  }
  function anyFilled(answers) {
    return Object.keys(answers).some(function (k) {
      var v = answers[k];
      return Array.isArray(v) ? v.length > 0 : !!v;
    });
  }

  function saveDraft(form, beacon) {
    if (timer) { clearTimeout(timer); timer = null; }
    if (!form) return;
    var answers = collect(form);
    var key = JSON.stringify(answers);
    if (key === draftKey || !anyFilled(answers)) return;
    var body = JSON.stringify({ respondent: respondent(), kind: "draft", answers: answers });
    dirty = null;
    if (beacon && navigator.sendBeacon && body.length < 60000 && navigator.sendBeacon(endpoint, body)) {
      draftKey = key;
      return;
    }
    enqueue(function () {
      return post(JSON.parse(body), 10000).then(function () { draftKey = key; });
    }).catch(function () { dirty = form; });
  }
  function changed(event) {
    var form = event.target && event.target.form;
    if (!form || form.hasAttribute("data-no-autosave")) return;
    dirty = form;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () { saveDraft(form, false); }, 3000);
  }
  document.addEventListener("input", changed, true);
  document.addEventListener("change", changed, true);
  document.addEventListener("visibilitychange", function () { if (document.hidden && dirty) saveDraft(dirty, true); });
  window.addEventListener("pagehide", function () { if (dirty) saveDraft(dirty, true); });

  /* ── Stand-in for a Claude artifact's storage ─────────────────────── */

  if (!window.claude) {
    var write = function (data) { return send((data && data.answers) || data || {}, data && data.summary); };
    var db = { doc: function () { return { set: write, update: write }; } };
    var user = { id: function () { return Promise.resolve(respondent()); } };
    window.claude = {
      use: function (name) {
        if (name === "db") return Promise.resolve(db);
        if (name === "user") return Promise.resolve(user);
        return Promise.reject(new Error("Not available here: " + name));
      },
    };
  }

  /* ── Plain forms marked data-collect ──────────────────────────────── */

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form || !form.hasAttribute || !form.hasAttribute("data-collect")) return;
    event.preventDefault();
    var button = form.querySelector("[type=submit]");
    if (button) button.disabled = true;
    send(collect(form))
      .then(function () { form.setAttribute("data-sent", ""); form.dispatchEvent(new CustomEvent("form-sent")); })
      .catch(function () { form.dispatchEvent(new CustomEvent("form-failed")); })
      .then(function () { if (button) button.disabled = false; });
  }, true);
})();
</script>`;

export async function formResponse(slug: string) {
  let html: string;
  try {
    html = await fs.readFile(path.join(process.cwd(), "content", "forms", `${slug}.html`), "utf-8");
  } catch {
    return new Response("Not found", { status: 404 });
  }
  // Before the first script, so the form's own code finds window.claude ready.
  const firstScript = html.search(/<script[\s>]/i);
  const at = firstScript === -1 ? html.lastIndexOf("</body>") : firstScript;
  const body = at === -1 ? html + bridge(slug) : html.slice(0, at) + bridge(slug) + html.slice(at);
  return new Response(body, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
