import json
from bs4 import BeautifulSoup

# 1. Load all parts of translations
all_fr = {}
for i in range(1, 6):
    with open(f"scripts/i18n_data/part{i}.json", "r", encoding="utf-8") as f:
        all_fr.update(json.load(f))

print(f"Loaded {len(all_fr)} French translations.")

# 2. Load original English HTML
with open("public/proposals/Proposal_AI_Concierge_WhatsApp_MVP_Marrakech (1).html", "r", encoding="utf-8") as f:
    orig_html = f.read()

soup = BeautifulSoup(orig_html, "html.parser")
sheet = soup.find("div", class_="sheet")

# 3. Tag each element with data-i18n matching scratch_units
with open("scratch_units.json", "r", encoding="utf-8") as f:
    units = json.load(f)

unit_map = {u["key"]: u["html"] for u in units}

# Traverse in exact same order
tagged_count = 0
for sec in [soup.find("header", class_="cover")] + soup.find_all("section"):
    sid = sec.get("id") or "cover"
    idx = 0
    for el in sec.find_all(True):
        is_unit = False
        if el.name in ["h1", "h2", "h3", "h4", "th", "td", "li"]:
            is_unit = True
        elif el.name == "p" and not el.find_parent("li"):
            is_unit = True
        elif el.name == "div" and any(c in el.get("class", []) for c in ["brandline", "note", "price-line", "state"]):
            is_unit = True
        elif el.name == "div" and "bubble" in el.get("class", []):
            is_unit = True
        elif el.name == "div" and el.parent and "meta" in el.parent.get("class", []):
            is_unit = True
        
        if is_unit:
            key = f"{sid}_{idx}"
            el["data-i18n"] = key
            idx += 1
            tagged_count += 1

print(f"Tagged {tagged_count} elements with data-i18n.")

# 4. Inject CSS for language switch
switch_css = """
/* Language switch component */
.lang-switch-wrap {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 9999;
}
.lang-switch {
  display: inline-flex;
  align-items: center;
  background: rgba(253, 253, 252, 0.94);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--rule);
  border-radius: 9999px;
  padding: 3px;
  box-shadow: 0 4px 18px rgba(16, 30, 46, 0.09);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 500;
}
.lang-btn {
  background: transparent;
  border: none;
  color: var(--muted);
  padding: 5px 14px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  outline: none;
}
.lang-btn:hover {
  color: var(--ink);
}
.lang-btn.active {
  background: var(--ink);
  color: #fff;
  font-weight: 600;
}
@media print {
  .lang-switch-wrap {
    display: none !important;
  }
}
@media (max-width: 640px) {
  .lang-switch-wrap {
    top: 12px;
    right: 14px;
  }
  .lang-btn {
    padding: 4px 11px;
    font-size: 12px;
  }
}
"""

style_tag = soup.find("style")
if style_tag:
    style_tag.append(switch_css)

# 5. Insert Switch HTML into body at top
switch_html = BeautifulSoup("""
<div class="lang-switch-wrap" role="region" aria-label="Language selector">
  <div class="lang-switch" role="group">
    <button type="button" class="lang-btn active" data-set-lang="en" id="btn-en" aria-label="Switch to English">EN</button>
    <button type="button" class="lang-btn" data-set-lang="fr" id="btn-fr" aria-label="Passer en Français">FR</button>
  </div>
</div>
""", "html.parser")

soup.body.insert(0, switch_html)

# 6. Inject i18n JavaScript at end of body
i18n_json_str = json.dumps(all_fr, ensure_ascii=False)

js_script = f"""
<script>
(function() {{
  const i18n_fr = {i18n_json_str};
  const i18n_en = {{}};

  // Store original English strings
  document.querySelectorAll('[data-i18n]').forEach(function(el) {{
    var k = el.getAttribute('data-i18n');
    i18n_en[k] = el.innerHTML;
  }});

  function setLanguage(lang) {{
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
    
    var dict = lang === 'fr' ? i18n_fr : i18n_en;
    
    document.querySelectorAll('[data-i18n]').forEach(function(el) {{
      var k = el.getAttribute('data-i18n');
      if (dict && dict[k] !== undefined) {{
        el.innerHTML = dict[k];
      }}
    }});

    // Update active button state
    var btnEn = document.getElementById('btn-en');
    var btnFr = document.getElementById('btn-fr');
    if (btnEn && btnFr) {{
      if (lang === 'fr') {{
        btnFr.classList.add('active');
        btnEn.classList.remove('active');
      }} else {{
        btnEn.classList.add('active');
        btnFr.classList.remove('active');
      }}
    }}

    // Update title
    if (lang === 'fr') {{
      document.title = "Concierge IA sur WhatsApp — Proposition Technique & Financière · Pilote Marrakech";
    }} else {{
      document.title = "AI Concierge on WhatsApp — Technical & Financial Proposal · Marrakech Pilot";
    }}

    // Persist language choice
    try {{
      localStorage.setItem('ballroom_proposal_lang', lang);
      var url = new URL(window.location.href);
      if (lang === 'fr') {{
        url.searchParams.set('lang', 'fr');
      }} else {{
        url.searchParams.delete('lang');
      }}
      window.history.replaceState({{}}, '', url.toString());
    }} catch(e) {{}}
  }}

  // Attach button click listeners
  document.querySelectorAll('[data-set-lang]').forEach(function(btn) {{
    btn.addEventListener('click', function() {{
      var targetLang = btn.getAttribute('data-set-lang');
      setLanguage(targetLang);
    }});
  }});

  // Determine initial language: URL param > localStorage > 'en' default
  var initialLang = 'en';
  try {{
    var params = new URLSearchParams(window.location.search);
    var qLang = params.get('lang');
    if (qLang === 'fr' || qLang === 'en') {{
      initialLang = qLang;
    }} else {{
      var saved = localStorage.getItem('ballroom_proposal_lang');
      if (saved === 'fr' || saved === 'en') {{
        initialLang = saved;
      }}
    }}
  }} catch(e) {{}}

  if (initialLang === 'fr') {{
    setLanguage('fr');
  }}
}})();
</script>
"""

script_soup = BeautifulSoup(js_script, "html.parser")
soup.body.append(script_soup)

# Save result
final_html = str(soup)
out_path1 = "public/proposals/ballroom-mvp.html"
out_path2 = "public/proposals/concierge-whatsapp-mvp.html"

with open(out_path1, "w", encoding="utf-8") as f:
    f.write(final_html)

with open(out_path2, "w", encoding="utf-8") as f:
    f.write(final_html)

print(f"Successfully compiled {out_path1} and {out_path2} ({len(final_html)} bytes)")
