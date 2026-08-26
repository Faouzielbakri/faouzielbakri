/**
 * First-touch attribution for contact-form leads.
 *
 * A lead that says "project inquiry" is worth less than a lead that says
 * "project inquiry, arrived from LinkedIn, first landed on /work/fasl". This
 * captures the channel on the visitor's first page of the session and keeps it
 * until they actually write — which can be several pages later.
 *
 * First-touch, not last-touch: the interesting fact is what brought them to the
 * site, not which internal page they happened to be on when they clicked send.
 * Stored in sessionStorage, so it dies with the tab and never follows anyone
 * between visits.
 */

const KEY = "feb-attribution";

/** Query params worth keeping. Anything else on the URL is ignored. */
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/** Ad-click identifiers, which name the channel even when UTMs are missing. */
const CLICK_IDS = ["gclid", "fbclid", "msclkid", "ttclid", "li_fat_id"] as const;

export type Attribution = {
  /** Where the visit came from, resolved to something readable. */
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  /** Raw referring URL, when the browser gave us one. */
  referrer?: string;
  /** The first page of this visit. */
  landingPath?: string;
  /** ISO timestamp of that first page view. */
  firstSeen?: string;
  /** e.g. "gclid" — tells you it was a paid click even with no UTMs. */
  clickId?: string;
};

/** Hosts that mean "someone shared or posted a link", grouped by channel. */
const REFERRER_NAMES: [RegExp, string][] = [
  [/(^|\.)google\./, "Google"],
  [/(^|\.)bing\./, "Bing"],
  [/duckduckgo\./, "DuckDuckGo"],
  [/linkedin\.|lnkd\.in/, "LinkedIn"],
  [/github\./, "GitHub"],
  [/(^|\.)x\.com|twitter\./, "X"],
  [/facebook\.|fb\.me/, "Facebook"],
  [/instagram\./, "Instagram"],
  [/reddit\./, "Reddit"],
  [/news\.ycombinator\./, "Hacker News"],
  [/chatgpt\.com|openai\./, "ChatGPT"],
  [/claude\.ai|anthropic\./, "Claude"],
  [/perplexity\./, "Perplexity"],
  [/gemini\.google|bard\./, "Gemini"],
  [/upwork\./, "Upwork"],
  [/malt\.|fiverr\./, "Freelance marketplace"],
];

function nameReferrer(referrer: string): string | undefined {
  try {
    const host = new URL(referrer).hostname;
    for (const [pattern, name] of REFERRER_NAMES) {
      if (pattern.test(host)) return name;
    }
    return host.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

/**
 * Records the channel if this is the first page of the session. Safe to call on
 * every page; later calls never overwrite the first one.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {
      landingPath: window.location.pathname + window.location.search.slice(0, 200),
      firstSeen: new Date().toISOString(),
    };

    for (const key of UTM_KEYS) {
      const value = params.get(key)?.slice(0, 120);
      if (value) data[key.replace("utm_", "") as "source"] = value;
    }
    for (const id of CLICK_IDS) {
      if (params.get(id)) {
        data.clickId = id;
        break;
      }
    }

    const referrer = document.referrer;
    // Internal navigation isn't a referral.
    if (referrer && !referrer.startsWith(window.location.origin)) {
      data.referrer = referrer.slice(0, 300);
      // UTMs win when both exist; they're the deliberate label.
      if (!data.source) data.source = nameReferrer(referrer);
      if (!data.medium) data.medium = "referral";
    }
    if (!data.source) data.source = "Direct";

    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* private mode, storage disabled — attribution is a nice-to-have */
  }
}

/** What was captured on arrival, plus where they were when they wrote. */
export function readAttribution(): Attribution & { submittedFrom?: string } {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    const stored: Attribution = raw ? JSON.parse(raw) : {};
    return { ...stored, submittedFrom: window.location.pathname };
  } catch {
    return {};
  }
}
