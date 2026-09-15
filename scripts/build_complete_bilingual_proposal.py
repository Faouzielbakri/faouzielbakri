import re

# 1. Read original English source of truth
orig_path = "public/proposals/Proposal_AI_Concierge_WhatsApp_MVP_Marrakech (1).html"
with open(orig_path, "r", encoding="utf-8") as f:
    orig_content = f.read()

# Extract styles
style_match = re.search(r"<style>(.*?)</style>", orig_content, re.DOTALL)
original_style = style_match.group(1).strip() if style_match else ""

# Extract English sheet inner content
sheet_match = re.search(r'<div class="sheet">(.*?)</div>\s*</body>', orig_content, re.DOTALL)
if not sheet_match:
    raise ValueError("Could not extract sheet from original HTML")

en_sheet_inner = sheet_match.group(1).strip()

# 2. Read French sheet inner content
with open("scripts/fr_sheet_inner.html", "r", encoding="utf-8") as f:
    fr_sheet_inner = f.read().strip()

# Wrap all <table> elements in <div class="table-wrap">...</div>
wrapped_en, count_en = re.subn(r"(<table\b[^>]*>.*?</table>)", r'<div class="table-wrap">\n\1\n</div>', en_sheet_inner, flags=re.DOTALL)
wrapped_fr, count_fr = re.subn(r"(<table\b[^>]*>.*?</table>)", r'<div class="table-wrap">\n\1\n</div>', fr_sheet_inner, flags=re.DOTALL)
print(f"Wrapped tables: EN={count_en}, FR={count_fr}")
en_sheet_inner = wrapped_en
fr_sheet_inner = wrapped_fr

# Contact & signoff interactive links (email and whatsapp)
contact_old = "<b>faouzielbakri.com · +212 6 32 32 38 56</b>"
contact_new = '<b><a href="https://faouzielbakri.com" target="_blank" rel="noopener">faouzielbakri.com</a> · <a href="mailto:faouzielbakri@gmail.com">faouzielbakri@gmail.com</a> · <a href="https://wa.me/212632323856" target="_blank" rel="noopener" title="WhatsApp">+212 6 32 32 38 56</a></b>'

signoff_old = '<a href="https://faouzielbakri.com">faouzielbakri.com</a> · +212 6 32 32 38 56'
signoff_new = '<a href="https://faouzielbakri.com" target="_blank" rel="noopener">faouzielbakri.com</a> · <a href="mailto:faouzielbakri@gmail.com">faouzielbakri@gmail.com</a> · <a href="https://wa.me/212632323856" target="_blank" rel="noopener" title="WhatsApp">+212 6 32 32 38 56</a>'

en_sheet_inner = en_sheet_inner.replace(contact_old, contact_new).replace(signoff_old, signoff_new)
fr_sheet_inner = fr_sheet_inner.replace(contact_old, contact_new).replace(signoff_old, signoff_new)

# Additional CSS for switcher, print button, bilingual toggle, and mobile responsiveness
additional_css = """
/* Responsive foundation: absolute containment of page width */
html, body {
  overflow-x: hidden;
  max-width: 100vw;
  position: relative;
}

/* Contact & Signoff Interactive Links on Screen */
.meta b a, .signoff a {
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid rgba(43, 71, 200, 0.35);
  transition: all 0.15s ease;
}
.meta b a:hover, .signoff a:hover {
  color: var(--indigo);
  border-bottom-color: var(--indigo);
}

/* Table wrapping: smooth horizontal scroll strictly contained inside wrapper (no whole-page blowout) */
.table-wrap {
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 14px 0 28px;
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 6px;
  padding: 4px 16px 10px;
  box-sizing: border-box;
  scrollbar-width: thin;
  scrollbar-color: var(--rule) transparent;
}
.table-wrap table {
  margin: 0;
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
}

/* 7-column ROI scenario table needs generous width so columns are never crowded */
#roi .table-wrap table,
#roi-fr .table-wrap table {
  min-width: 760px;
}

/* 2-column tables (Lot inclusion, budget options, SLA, risks) */
#scope .table-wrap table,
#scope-fr .table-wrap table,
#risks .table-wrap table,
#risks-fr .table-wrap table {
  min-width: 460px;
}

.table-wrap::-webkit-scrollbar {
  height: 6px;
}
.table-wrap::-webkit-scrollbar-track {
  background: var(--band);
  border-radius: 3px;
}
.table-wrap::-webkit-scrollbar-thumb {
  background: var(--rule);
  border-radius: 3px;
}
.table-wrap::-webkit-scrollbar-thumb:hover {
  background: var(--muted);
}

/* Floating controls: Two clean static pills next to each other with mounting animation */
.header-controls {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 9999;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  animation: clusterMount 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both;
  transition: top 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.header-controls.scrolled {
  top: 12px;
}

@keyframes clusterMount {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.share-pill-wrap,
.print-pill-wrap,
.lang-switch-wrap {
  display: inline-flex;
  align-items: center;
}

.share-btn,
.print-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(253, 253, 252, 0.94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--rule);
  border-radius: 999px;
  padding: 6px 15px;
  color: var(--muted);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(16, 30, 46, 0.08);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  line-height: 1.2;
}

.share-btn:hover,
.print-btn:hover {
  color: var(--ink);
  background: #fff;
  border-color: rgba(16, 30, 46, 0.25);
  box-shadow: 0 6px 20px rgba(16, 30, 46, 0.12);
}

.share-btn:active,
.print-btn:active {
  transform: scale(0.96);
}

.share-btn .share-icon,
.share-btn svg,
.print-btn .print-icon,
.print-btn svg {
  color: var(--indigo);
  transition: transform 0.15s ease;
  flex-shrink: 0;
}

.share-btn:hover .share-icon,
.share-btn:hover svg,
.print-btn:hover .print-icon,
.print-btn:hover svg {
  transform: translateY(-1px);
}

.lang-switch {
  display: inline-flex;
  background: rgba(253, 253, 252, 0.94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--rule);
  border-radius: 999px;
  padding: 3px;
  box-shadow: 0 4px 16px rgba(16, 30, 46, 0.08);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.lang-btn {
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--muted);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  padding: 5px 13px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1.2;
}

.lang-btn:hover {
  color: var(--ink);
}

.lang-btn.active {
  background: var(--ink);
  color: #fff;
  box-shadow: 0 1px 4px rgba(16, 30, 46, 0.15);
}

.label-short,
.share-label-short {
  display: none;
}

/* Scroll state elevation */
.header-controls.scrolled .share-btn,
.header-controls.scrolled .print-btn,
.header-controls.scrolled .lang-switch {
  background: rgba(253, 253, 252, 0.98);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-color: rgba(16, 30, 46, 0.18);
  box-shadow: 0 8px 28px rgba(16, 30, 46, 0.12), 0 1px 3px rgba(16, 30, 46, 0.06);
}

/* Toast Notification for Clipboard Copy */
.share-toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: #101E2E;
  color: #FFFFFF;
  padding: 9px 18px;
  border-radius: 999px;
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(16, 30, 46, 0.25);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
  z-index: 10000;
}

.share-toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.share-toast svg {
  color: #34D399;
  flex-shrink: 0;
}


/* Visibility rules based on data-lang attribute */
html[data-lang="en"] .sheet.lang-fr {
  display: none !important;
}
html[data-lang="fr"] .sheet.lang-en {
  display: none !important;
}

/* Mobile Responsiveness (< 640px) */
@media (max-width: 640px) {
  body {
    font-size: 16px;
    line-height: 1.6;
  }
  .sheet {
    padding: 0 18px 80px;
    max-width: 100%;
    overflow: hidden;
  }
  .cover {
    padding: 48px 0 36px;
  }
  .brandline {
    margin-bottom: 28px;
    padding-right: 140px;
    font-size: 13px;
  }
  .cover h1 {
    font-size: 32px;
    line-height: 1.15;
    letter-spacing: -0.02em;
    max-width: none;
    word-break: break-word;
  }
  .cover .sub {
    font-size: 16.5px;
    line-height: 1.45;
    margin-top: 14px;
    max-width: none;
  }
  .meta {
    gap: 18px 24px;
    margin-top: 32px;
    font-size: 13.5px;
  }
  .meta div {
    min-width: 135px;
  }
  .confidential {
    margin-top: 28px;
    font-size: 12.5px;
    padding-left: 12px;
  }
  section {
    padding-top: 38px;
  }
  h2 {
    font-size: 22px;
    line-height: 1.25;
  }
  h3 {
    font-size: 18px;
    line-height: 1.3;
  }
  .lead {
    font-size: 17.5px;
    line-height: 1.5;
  }
  .callout {
    padding: 16px 18px;
  }
  .rec {
    padding: 2px 0 2px 14px;
  }
  .states {
    font-size: 13px;
    line-height: 1.8;
    padding: 12px 14px;
    word-break: break-word;
  }
  .bignum {
    font-size: 32px;
  }
  .bigpair {
    margin: 20px 0 8px;
    padding: 16px 0;
  }
  .bigpair .n {
    font-size: 28px;
  }
  .table-wrap {
    margin: 10px 0 22px;
    padding: 4px 12px 10px;
    border-radius: 4px;
    box-shadow: inset -10px 0 10px -10px rgba(16, 30, 46, 0.2);
  }
  th, td {
    padding-right: 14px;
    font-size: 13px;
  }
  th {
    white-space: nowrap;
  }
  .signoff {
    margin-top: 48px;
    padding-top: 20px;
    font-size: 14px;
  }
  .signoff b {
    font-size: 16px;
  }
  .header-controls {
    top: 10px;
    right: 12px;
    gap: 6px;
  }
  .header-controls.scrolled {
    top: 8px;
  }
  .share-btn,
  .print-btn {
    padding: 5px 9px;
    font-size: 12px;
    gap: 4px;
  }
  .lang-switch {
    padding: 2px;
  }
  .share-label-full,
  .label-full {
    display: none;
  }
  .share-label-short,
  .label-short {
    display: inline;
    font-weight: 600;
  }
  .lang-btn {
    padding: 4px 8px;
    font-size: 12px;
  }
  .brandline {
    padding-right: 0;
  }
}

@media (max-width: 480px) {
  .price-line {
    flex-wrap: wrap;
    gap: 4px 16px;
    padding: 10px 0;
  }
}

@media print {
  .header-controls,
  .share-pill-wrap,
  .print-pill-wrap,
  .lang-switch-wrap,
  .share-toast {
    display: none !important;
  }
  .meta b a, .signoff a, a {
    color: var(--ink) !important;
    border: none !important;
    border-bottom: none !important;
    text-decoration: none !important;
  }
  .table-wrap {
    overflow: visible !important;
    max-width: none !important;
    width: 100% !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 6px 0 16px !important;
    background: transparent !important;
  }
  .table-wrap table {
    min-width: 0 !important;
    width: 100% !important;
  }
  th, td {
    padding: 6px 8px 6px 0 !important;
    font-size: 9.5pt !important;
  }
  html[data-lang="en"] .sheet.lang-fr {
    display: none !important;
  }
  html[data-lang="fr"] .sheet.lang-en {
    display: none !important;
  }
}
"""

combined_css = original_style + "\n" + additional_css

template = """<!DOCTYPE html>
<html lang="en" data-lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI Concierge on WhatsApp — Technical &amp; Financial Proposal · Marrakech Pilot</title>
<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
<meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet">

<!-- Open Graph / Social Media Cards -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Faouzi El Bakri">
<meta property="og:title" content="AI Concierge on WhatsApp — Technical &amp; Financial Proposal">
<meta property="og:description" content="Technical &amp; Financial Proposal for Marrakech Pilot · Autonomous guest interactions, PMS sync, and bilingual Arabic/French/English support.">
<meta property="og:image" content="https://faouzielbakri.com/og/ballroom-mvp.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="AI Concierge on WhatsApp Proposal · Marrakech Pilot">
<meta property="og:url" content="https://faouzielbakri.com/proposals/ballroom-mvp">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="AI Concierge on WhatsApp — Technical &amp; Financial Proposal">
<meta name="twitter:description" content="Technical &amp; Financial Proposal for Marrakech Pilot · Autonomous guest interactions, PMS sync, and bilingual Arabic/French/English support.">
<meta name="twitter:image" content="https://faouzielbakri.com/og/ballroom-mvp.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&display=swap" rel="stylesheet">
<style>
__COMBINED_CSS__
</style>
<script>
(function() {
  try {
    var params = new URLSearchParams(window.location.search);
    var lang = params.get("lang");
    if (lang !== "fr" && lang !== "en") {
      lang = localStorage.getItem("ballroom_proposal_lang") || "en";
    }
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang);
    if (lang === "fr") {
      document.title = "Concierge IA sur WhatsApp — Proposition Technique & Financière · Pilote Marrakech";
    }
  } catch(e) {}
})();
</script>
</head>
<body>

<div class="header-controls" id="header-controls">
  <!-- SHARE BUTTON -->
  <div class="share-pill-wrap" role="region" aria-label="Share controls">
    <button type="button" class="share-btn" id="btn-share" aria-label="Share proposal" title="Share proposal">
      <svg class="share-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
      <span class="share-label" id="share-label">
        <span class="share-label-full">Share</span>
        <span class="share-label-short">Share</span>
      </span>
    </button>
  </div>

  <!-- PRINT / PDF BUTTON -->
  <div class="print-pill-wrap" role="region" aria-label="Print controls">
    <button type="button" class="print-btn" id="btn-print" aria-label="Print or save as PDF" title="Print / PDF">
      <svg class="print-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
      <span class="print-label" id="print-label">
        <span class="label-full">Print / PDF</span>
        <span class="label-short">PDF</span>
      </span>
    </button>
  </div>

  <!-- LANGUAGE SELECTOR -->
  <div class="lang-switch-wrap" role="region" aria-label="Language selector">
    <div class="lang-switch" role="group" aria-label="Choose language">
      <button type="button" class="lang-btn" data-set-lang="en" id="btn-en" aria-label="Switch to English">EN</button>
      <button type="button" class="lang-btn" data-set-lang="fr" id="btn-fr" aria-label="Passer en Français">FR</button>
    </div>
  </div>
</div>

<!-- TOAST FOR CLIPBOARD COPY -->
<div class="share-toast" id="share-toast" role="status" aria-live="polite">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
  <span id="toast-text">Link copied to clipboard!</span>
</div>

<!-- ENGLISH VERSION -->
<div class="sheet lang-en">
__EN_SHEET_INNER__
</div>

<!-- FRENCH VERSION -->
<div class="sheet lang-fr">
__FR_SHEET_INNER__
</div>

<script>
(function() {
  var headerControls = document.getElementById("header-controls");

  // Scroll handler for elevation
  function handleScroll() {
    var isScrolled = window.scrollY > 30;
    if (headerControls) {
      if (isScrolled) headerControls.classList.add("scrolled");
      else headerControls.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  function updateSwitcherUI(lang) {
    var btnEn = document.getElementById("btn-en");
    var btnFr = document.getElementById("btn-fr");
    var printBtn = document.getElementById("btn-print");
    var labelFull = document.querySelector(".label-full");
    var shareBtn = document.getElementById("btn-share");
    var shareLabelFull = document.querySelector(".share-label-full");
    var shareLabelShort = document.querySelector(".share-label-short");

    if (btnEn && btnFr) {
      if (lang === "fr") {
        btnFr.classList.add("active");
        btnEn.classList.remove("active");
      } else {
        btnEn.classList.add("active");
        btnFr.classList.remove("active");
      }
    }
    if (labelFull) {
      labelFull.textContent = lang === "fr" ? "Imprimer / PDF" : "Print / PDF";
    }
    if (printBtn) {
      printBtn.setAttribute("aria-label", lang === "fr" ? "Imprimer ou enregistrer en PDF" : "Print or save as PDF");
      printBtn.setAttribute("title", lang === "fr" ? "Imprimer / PDF" : "Print / PDF");
    }
    if (shareLabelFull) {
      shareLabelFull.textContent = lang === "fr" ? "Partager" : "Share";
    }
    if (shareLabelShort) {
      shareLabelShort.textContent = lang === "fr" ? "Partager" : "Share";
    }
    if (shareBtn) {
      shareBtn.setAttribute("aria-label", lang === "fr" ? "Partager la proposition" : "Share proposal");
      shareBtn.setAttribute("title", lang === "fr" ? "Partager" : "Share");
    }
  }

  function setLanguage(lang, updateUrl) {
    if (lang !== "fr" && lang !== "en") lang = "en";
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang);
    updateSwitcherUI(lang);
    if (lang === "fr") {
      document.title = "Concierge IA sur WhatsApp — Proposition Technique & Financière · Pilote Marrakech";
    } else {
      document.title = "AI Concierge on WhatsApp — Technical & Financial Proposal · Marrakech Pilot";
    }
    try {
      localStorage.setItem("ballroom_proposal_lang", lang);
      if (updateUrl !== false) {
        var url = new URL(window.location.href);
        if (lang === "fr") {
          url.searchParams.set("lang", "fr");
        } else {
          url.searchParams.delete("lang");
        }
        window.history.replaceState({}, "", url.toString());
      }
    } catch(e) {}
  }

  var currentLang = document.documentElement.getAttribute("data-lang") || "en";
  setLanguage(currentLang, false);

  var btnPrint = document.getElementById("btn-print");
  if (btnPrint) {
    btnPrint.addEventListener("click", function() {
      window.print();
    });
  }

  var btnShare = document.getElementById("btn-share");
  var shareToast = document.getElementById("share-toast");
  var toastText = document.getElementById("toast-text");
  var toastTimeout = null;

  function showToast(msg) {
    if (!shareToast) return;
    if (toastText && msg) toastText.textContent = msg;
    shareToast.classList.add("show");
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function() {
      shareToast.classList.remove("show");
    }, 2800);
  }

  function fallbackCopy(url, lang) {
    var ta = document.createElement("textarea");
    ta.value = url;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      showToast(lang === "fr" ? "Lien copié dans le presse-papier !" : "Link copied to clipboard!");
    } catch(e) {
      showToast(lang === "fr" ? "Impossible de copier" : "Could not copy link");
    }
    document.body.removeChild(ta);
  }

  function copyToClipboard(url, lang) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function() {
        showToast(lang === "fr" ? "Lien copié dans le presse-papier !" : "Link copied to clipboard!");
      }).catch(function() {
        fallbackCopy(url, lang);
      });
    } else {
      fallbackCopy(url, lang);
    }
  }

  if (btnShare) {
    btnShare.addEventListener("click", function() {
      var lang = document.documentElement.getAttribute("data-lang") || "en";
      var title = lang === "fr"
        ? "Concierge IA sur WhatsApp — Proposition Technique & Financière"
        : "AI Concierge on WhatsApp — Technical & Financial Proposal";
      var text = lang === "fr"
        ? "Proposition Technique & Financière pour Pilote Marrakech · Faouzi El Bakri"
        : "Technical & Financial Proposal for Marrakech Pilot · Faouzi El Bakri";
      var url = window.location.href;

      if (navigator.share) {
        navigator.share({
          title: title,
          text: text,
          url: url
        }).catch(function(err) {
          if (err && err.name !== "AbortError") {
            copyToClipboard(url, lang);
          }
        });
      } else {
        copyToClipboard(url, lang);
      }
    });
  }

  document.querySelectorAll("[data-set-lang]").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var targetLang = btn.getAttribute("data-set-lang");
      setLanguage(targetLang, true);
    });
  });

  function handleHash() {
    var hash = window.location.hash;
    if (!hash) return;
    var lang = document.documentElement.getAttribute("data-lang") || "en";
    var cleanId = hash.replace(/^#/, "").replace(/-fr$/, "");
    var targetId = lang === "fr" ? cleanId + "-fr" : cleanId;
    var targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  }

  window.addEventListener("hashchange", handleHash);
})();
</script>
</body>
</html>
"""

final_html = template.replace("__COMBINED_CSS__", combined_css)
final_html = final_html.replace("__EN_SHEET_INNER__", en_sheet_inner)
final_html = final_html.replace("__FR_SHEET_INNER__", fr_sheet_inner)

dest_file = "public/proposals/ballroom-mvp.html"
with open(dest_file, "w", encoding="utf-8") as f:
    f.write(final_html)

dest_file2 = "public/proposals/concierge-whatsapp-mvp.html"
with open(dest_file2, "w", encoding="utf-8") as f:
    f.write(final_html)

print(f"Generated bilingual HTML saved to {dest_file} and {dest_file2}. Size: {len(final_html)} bytes.")
