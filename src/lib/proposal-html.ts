import { promises as fs } from "fs";
import path from "path";

/**
 * Proposals are hand-built HTML files in public/proposals. This serves one,
 * with a small reader script added before </body> that tells the dashboard
 * when it was opened, how long it was actually read (time with the tab in
 * view), how far down, which sections were seen, and which buttons were
 * pressed. Same cookieless intake as the rest of the site; the owner's
 * browsers are ignored there.
 */
const READER = `
<script>
(function () {
  var path = location.pathname.replace(/\\.html$/, "");
  function send(name, props) {
    try {
      var body = JSON.stringify({ name: name, path: path, props: props });
      if (!(navigator.sendBeacon && navigator.sendBeacon("/api/e", body))) {
        fetch("/api/e", { method: "POST", body: body, keepalive: true });
      }
    } catch (e) {}
  }
  send("proposal_open", { lang: document.documentElement.getAttribute("data-lang") || document.documentElement.lang || "" });

  var active = 0, last = Date.now(), visible = !document.hidden, depth = 0, sent = 0;
  function tick() { var now = Date.now(); if (visible) active += now - last; last = now; }
  function flush() {
    tick();
    var seconds = Math.round(active / 1000);
    if (seconds - sent < 3) return;
    sent = seconds;
    send("proposal_time", { seconds: seconds, depth: depth });
  }
  setInterval(tick, 1000);
  setInterval(flush, 20000);
  document.addEventListener("visibilitychange", function () { tick(); visible = !document.hidden; if (!visible) flush(); });
  window.addEventListener("pagehide", flush);
  window.addEventListener("scroll", function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0) depth = Math.max(depth, Math.min(100, Math.round((window.scrollY / max) * 100)));
  }, { passive: true });

  var seen = {};
  function once(kind, id) {
    var key = kind + ":" + id;
    if (seen[key]) return;
    seen[key] = 1;
    send("proposal_action", { kind: kind, id: id });
  }
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) once("section", entry.target.id.replace(/-fr$/, ""));
      });
    }, { threshold: 0.35 });
    document.querySelectorAll("section[id]").forEach(function (s) { observer.observe(s); });
  }
  document.addEventListener("click", function (event) {
    var el = event.target && event.target.closest ? event.target.closest("a,button") : null;
    if (!el) return;
    var href = el.getAttribute("href") || "";
    if (el.id === "btn-share") once("share", "share");
    else if (el.id === "btn-print") once("print", "print");
    else if (href.indexOf("#action-deck") === 0) once("approve", "approve");
    else if (href.indexOf("wa.me") > -1 || href.indexOf("whatsapp") > -1) once("whatsapp", "whatsapp");
    else if (href.indexOf("mailto:") === 0) once("email", "email");
    else if (el.getAttribute("data-lang")) once("language", el.getAttribute("data-lang"));
  });
})();
</script>`;

export async function proposalResponse(file: string) {
  const html = await fs.readFile(path.join(process.cwd(), "public", "proposals", file), "utf-8");
  const at = html.lastIndexOf("</body>");
  const body = at === -1 ? html + READER : html.slice(0, at) + READER + html.slice(at);
  return new Response(body, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
