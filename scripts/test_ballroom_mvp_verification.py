from bs4 import BeautifulSoup
import re
import os

with open("public/proposals/ballroom-mvp.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

en_sheet = soup.find("div", class_="sheet lang-en")
fr_sheet = soup.find("div", class_="sheet lang-fr")

assert en_sheet is not None, "Missing .sheet.lang-en"
assert fr_sheet is not None, "Missing .sheet.lang-fr"

print("1. Checking language switch markup and CSS...")
assert soup.find("div", class_="lang-switch-wrap") is not None
assert soup.find("button", id="btn-en") is not None
assert soup.find("button", id="btn-fr") is not None
assert "html[data-lang=\"en\"] .sheet.lang-fr" in html
assert "html[data-lang=\"fr\"] .sheet.lang-en" in html

print("2. Checking TOC in French...")
toc_fr = fr_sheet.find("nav", class_="toc")
assert toc_fr is not None
toc_fr_links = toc_fr.find_all("a")
assert len(toc_fr_links) == 17, f"Expected 17 TOC links in FR, got {len(toc_fr_links)}"
for a in toc_fr_links:
    assert a["href"].startswith("#") and a["href"].endswith("-fr"), f"Invalid FR TOC href: {a['href']}"
    assert any(w in a.text for w in ["Ce à quoi", "Synthèse", "recrutez", "projet", "Architecture", "code", "données", "contient", "Planning", "Budget", "amortir", "exploitation", "risques", "personnelles", "Livrables", "Hypothèses", "trouvé"]), f"Suspicious TOC text: {a.text}"

print("3. Checking Section 6.2 in French...")
sec6_fr = fr_sheet.find("section", id="data-fr")
assert sec6_fr is not None
states_fr = sec6_fr.find("div", class_="states")
assert states_fr is not None
states_text = states_fr.text.strip()
assert "à traiter" in states_text and "envoyé" in states_text and "en attente" in states_text and "terminé" in states_text, f"Unexpected states text: {states_text}"
ul_62 = states_fr.find_next_sibling("ul")
assert ul_62 is not None
lis_62 = ul_62.find_all("li")
assert len(lis_62) == 3, f"Expected 3 lis in 6.2, got {len(lis_62)}"
assert "Indisponible" in lis_62[0].text
assert "Annulé" in lis_62[1].text
assert "Terminé" in lis_62[2].text

print("4. Checking Section 10 (ROI) in French...")
sec10_fr = fr_sheet.find("section", id="roi-fr")
assert sec10_fr is not None
bignum_fr = sec10_fr.find("div", class_="bignum")
assert bignum_fr is not None and "170 $" in bignum_fr.text
bigpair_fr = sec10_fr.find("div", class_="bigpair")
assert bigpair_fr is not None
n_divs = bigpair_fr.find_all("div", class_="n")
c_divs = bigpair_fr.find_all("div", class_="c")
assert len(n_divs) == 2 and len(c_divs) == 2
assert "54 réservations" in n_divs[0].text
assert "10 scans" in n_divs[1].text

# Table in section 10
table_10 = sec10_fr.find("table")
assert table_10 is not None
rows_10 = table_10.find("tbody").find_all("tr")
assert len(rows_10) == 4, f"Expected 4 scenario rows, got {len(rows_10)}"
assert "Calme" in rows_10[0].text and "380 $" in rows_10[0].text
assert "Cible pilote" in rows_10[1].text and "1 140 $" in rows_10[1].text
assert "Forte dynamique" in rows_10[2].text and "2 250 $" in rows_10[2].text
assert "À l'échelle" in rows_10[3].text and "5 180 $" in rows_10[3].text

# Callouts in section 10
callouts_10 = sec10_fr.find_all("div", class_="callout")
assert len(callouts_10) == 2, f"Expected 2 callouts in Section 10, got {len(callouts_10)}"
assert "La deuxième ville" in callouts_10[0].text
assert "scénario calme" in callouts_10[1].text

print("5. Checking Section 11 (Running Costs) in French...")
sec11_fr = fr_sheet.find("section", id="running-fr")
assert sec11_fr is not None
tables_11 = sec11_fr.find_all("table")
assert len(tables_11) == 2, f"Expected 2 tables in Section 11, got {len(tables_11)}"
# Main table
main_rows = tables_11[0].find("tbody").find_all("tr")
assert len(main_rows) == 6, f"Expected 6 rows in Section 11 main table, got {len(main_rows)}"
assert "Hetzner" in main_rows[0].text and "15 – 35 $" in main_rows[0].text
assert "360dialog" in main_rows[1].text and "118 $" in main_rows[1].text
assert "Frais de messagerie Meta" in main_rows[2].text and "25 – 60 $" in main_rows[2].text
assert "Total estimé au volume du pilote" in main_rows[5].text and "175 – 260 $" in main_rows[5].text

# 11.1 table
model_rows = tables_11[1].find("tbody").find_all("tr")
assert len(model_rows) == 4, f"Expected 4 rows in 11.1 table, got {len(model_rows)}"
assert "100" in model_rows[0].text and "5 – 12 $" in model_rows[0].text and "2 – 4 $" in model_rows[0].text
assert "300" in model_rows[1].text and "15 – 35 $" in model_rows[1].text and "5 – 12 $" in model_rows[1].text
assert "600" in model_rows[2].text and "30 – 70 $" in model_rows[2].text and "10 – 25 $" in model_rows[2].text
assert "1 000" in model_rows[3].text and "50 – 115 $" in model_rows[3].text and "18 – 40 $" in model_rows[3].text

# Callout in section 11
callouts_11 = sec11_fr.find_all("div", class_="callout")
assert len(callouts_11) == 1, f"Expected 1 callout in Section 11, got {len(callouts_11)}"
assert "1er octobre 2026" in callouts_11[0].text

print("6. Checking route.ts exists and references ballroom-mvp.html...")
with open("src/app/proposals/ballroom-mvp/route.ts", "r", encoding="utf-8") as f:
    route_code = f.read()
assert "ballroom-mvp.html" in route_code
assert "force-static" in route_code

print("7. Checking mobile responsiveness markup and table wrapping...")
en_tables = en_sheet.find_all("table")
fr_tables = fr_sheet.find_all("table")
assert len(en_tables) == 13, f"Expected 13 EN tables, got {len(en_tables)}"
assert len(fr_tables) == 13, f"Expected 13 FR tables, got {len(fr_tables)}"
for i, t in enumerate(en_tables):
    assert t.parent and "table-wrap" in t.parent.get("class", []), f"EN table {i} not wrapped in .table-wrap"
for i, t in enumerate(fr_tables):
    assert t.parent and "table-wrap" in t.parent.get("class", []), f"FR table {i} not wrapped in .table-wrap"

assert ".table-wrap" in html
assert "@media (max-width: 640px)" in html
assert "overflow-x: hidden" in html
assert "min-width: 760px" in html  # Table 10 spacious column width
assert "min-width: 600px" in html  # Standard tables spacious column width

print("8. Checking print button and PDF export support...")
assert soup.find("button", id="btn-print") is not None
assert soup.find("span", id="print-label") is not None
assert soup.find("div", class_="print-pill-wrap") is not None
assert soup.find("div", class_="lang-switch-wrap") is not None
assert soup.find("div", class_="header-controls") is not None
assert soup.find("span", class_="label-full") is not None
assert soup.find("span", class_="label-short") is not None
assert "clusterMount" in html
assert ".scrolled" in html
assert "window.print()" in html
assert "@media print" in html

print("9. Checking contact & signoff links (email & WhatsApp)...")
for lang in ["en", "fr"]:
    sheet = soup.find("div", f"sheet lang-{lang}")
    meta_a = sheet.find("div", class_="meta").find_all("a")
    hrefs = [a["href"] for a in meta_a]
    assert any("mailto:faouzielbakri@gmail.com" in h for h in hrefs), f"Missing email in {lang} meta"
    assert any("wa.me/212632323856" in h for h in hrefs), f"Missing whatsapp in {lang} meta"
    assert any("faouzielbakri.com" in h for h in hrefs), f"Missing website in {lang} meta"
    signoff_a = sheet.find("div", class_="signoff").find_all("a")
    s_hrefs = [a["href"] for a in signoff_a]
    assert any("mailto:faouzielbakri@gmail.com" in h for h in s_hrefs), f"Missing email in {lang} signoff"
    assert any("wa.me/212632323856" in h for h in s_hrefs), f"Missing whatsapp in {lang} signoff"

print("10. Checking native share button, robots noindex, and OpenGraph tags...")
assert soup.find("button", id="btn-share") is not None
assert soup.find("div", class_="share-pill-wrap") is not None
assert soup.find("span", class_="share-label-full") is not None
assert soup.find("span", class_="share-label-short") is not None
assert soup.find("div", id="share-toast") is not None
assert soup.find("span", id="toast-text") is not None

# Robots meta tags
robots_meta = soup.find("meta", attrs={"name": "robots"})
assert robots_meta is not None and "noindex" in robots_meta.get("content", "")
assert "nofollow" in robots_meta.get("content", "")
assert "noarchive" in robots_meta.get("content", "")
assert "nosnippet" in robots_meta.get("content", "")

googlebot_meta = soup.find("meta", attrs={"name": "googlebot"})
assert googlebot_meta is not None and "noindex" in googlebot_meta.get("content", "")

# OpenGraph tags
og_title = soup.find("meta", property="og:title")
assert og_title is not None and len(og_title.get("content", "")) > 10
og_image = soup.find("meta", property="og:image")
assert og_image is not None and og_image.get("content", "").endswith("/og/ballroom-mvp.png")
og_desc = soup.find("meta", property="og:description")
assert og_desc is not None and len(og_desc.get("content", "")) > 20
og_url = soup.find("meta", property="og:url")
assert og_url is not None and "proposals/ballroom-mvp" in og_url.get("content", "")

# Twitter Card tags
tw_card = soup.find("meta", attrs={"name": "twitter:card"})
assert tw_card is not None and tw_card.get("content", "") == "summary_large_image"
tw_image = soup.find("meta", attrs={"name": "twitter:image"})
assert tw_image is not None and tw_image.get("content", "").endswith("/og/ballroom-mvp.png")

# Verify OG image file exists on disk
assert os.path.exists("public/og/ballroom-mvp.png")
assert os.path.getsize("public/og/ballroom-mvp.png") > 10000

# Verify X-Robots-Tag in route.ts
assert "X-Robots-Tag" in route_code
assert "noindex" in route_code

# Verify Share JS logic
assert "navigator.share" in html
assert "copyToClipboard" in html
assert "navigator.clipboard.writeText" in html

print("11. Checking reading progress, voice note, ROI simulator, action deck, quick jump & print isolation...")
# 1. Reading progress
assert soup.find("div", id="reading-progress") is not None
assert "handleReadingProgress" in html or "reading-progress" in html

# 2. Reading time in meta
for lang in ["en", "fr"]:
    sh = soup.find("div", f"sheet lang-{lang}")
    meta_text = sh.find("div", class_="meta").text
    assert "7 min" in meta_text and "17 sections" in meta_text

# 3. Section 0: Chat replay toolbar and voice note removal
assert soup.find("button", id="btn-replay-en") is not None
assert soup.find("button", id="btn-replay-fr") is not None
assert soup.find("div", class_="replay-info") is not None
assert soup.find("div", class_="voice-note-mockup") is None  # Audio note player removed as requested

# 4. Section 10: ROI simulator
sim_en = soup.find("div", id="roi-sim-en")
sim_fr = soup.find("div", id="roi-sim-fr")
assert sim_en is not None and sim_fr is not None
assert sim_en.find("input", id="sim-riads-en") is not None
assert sim_en.find("input", id="sim-scans-en") is not None
assert sim_en.find("input", id="sim-margin-en") is not None
assert sim_fr.find("input", id="sim-riads-fr") is not None
assert sim_fr.find("input", id="sim-scans-fr") is not None
assert sim_fr.find("input", id="sim-margin-fr") is not None
assert "setupRoiSimulator" in html

# 5. Bottom Action Deck
deck_en = soup.find("div", id="action-deck-en")
deck_fr = soup.find("div", id="action-deck-fr")
assert deck_en is not None and deck_fr is not None
wa_en = deck_en.find("a", class_="btn-deck-primary")
wa_fr = deck_fr.find("a", class_="btn-deck-primary")
assert wa_en is not None and "wa.me/212632323856" in wa_en["href"]
assert wa_fr is not None and "wa.me/212632323856" in wa_fr["href"]
assert "Ballroom" in wa_en["href"] and "Ballroom" in wa_fr["href"]
mail_en = deck_en.find("a", class_="btn-deck-secondary")
mail_fr = deck_fr.find("a", class_="btn-deck-secondary")
assert "mailto:faouzielbakri@gmail.com" in mail_en["href"]
assert "mailto:faouzielbakri@gmail.com" in mail_fr["href"]

# 6. Quick Jump Navigator
assert soup.find("button", id="btn-jump") is not None
assert soup.find("div", id="jump-dropdown") is not None
jump_items = soup.find_all("a", class_="jump-item")
assert len(jump_items) >= 8

# 7. Desktop Keyboard Shortcuts in JS
assert "keydown" in html
assert 'key === "p"' in html
assert 'key === "l"' in html
assert 'key === "s"' in html
assert 'key === "t"' in html
assert 'key === "j"' in html

# 8. Currency hints
cur_spans = soup.find_all("span", class_="has-cur")
assert len(cur_spans) >= 8
for span in cur_spans[:4]:
    assert span.get("data-cur-mad") is not None

# 9. Strict Print Isolation: All interactive elements MUST be hidden in print
print_block = html[html.find("@media print"):]
assert "#reading-progress" in print_block
assert ".chat-replay-bar" in print_block
assert ".action-dock" in print_block
assert ".roi-simulator" in print_block
assert ".action-deck" in print_block
assert ".jump-dropdown" in print_block
assert ".audio-brief-card" in print_block
assert ".has-cur::after" in print_block
assert "display: none !important" in print_block

# 10. Executive Audio Briefing Player
print("12. Checking Executive Audio Briefing Player in EN and FR...")
card_en = soup.find("div", id="audio-card-en")
card_fr = soup.find("div", id="audio-card-fr")
assert card_en is not None, "Missing audio-card-en"
assert card_fr is not None, "Missing audio-card-fr"

# Check within respective sheets
assert en_sheet.find("div", id="audio-card-en") is not None
assert fr_sheet.find("div", id="audio-card-fr") is not None

# Audio elements & sources
audio_en = card_en.find("audio", id="audio-player-en")
audio_fr = card_fr.find("audio", id="audio-player-fr")
assert audio_en is not None and audio_fr is not None
assert "Marrakech_WhatsApp_AI_Concierge_Technical_Blueprint.m4a" in audio_en["src"]
assert "Concierge_IA_WhatsApp_pour_riads_de_Marrakech.m4a" in audio_fr["src"]

# Controls
assert card_en.find("button", id="audio-play-btn-en") is not None
assert card_fr.find("button", id="audio-play-btn-fr") is not None
assert card_en.find("button", id="audio-speed-btn-en") is not None
assert card_fr.find("button", id="audio-speed-btn-fr") is not None
assert card_en.find("div", id="audio-waveform-en") is not None
assert card_fr.find("div", id="audio-waveform-fr") is not None
assert card_en.find("path", class_="wave-unplayed") is not None
assert card_en.find("path", class_="wave-played") is not None
assert card_en.find("div", id="wave-dot-en") is not None
assert card_fr.find("div", id="wave-dot-fr") is not None

# Chapters
chaps_en = card_en.find_all("button", class_="chapter-jump-btn")
chaps_fr = card_fr.find_all("button", class_="chapter-jump-btn")
assert len(chaps_en) == 5, f"Expected 5 chapters in EN, got {len(chaps_en)}"
assert len(chaps_fr) == 5, f"Expected 5 chapters in FR, got {len(chaps_fr)}"

for b in chaps_en:
    assert b.get("data-seek") is not None
for b in chaps_fr:
    assert b.get("data-seek") is not None

# Script initialization
assert "setupAudioPlayer" in html

print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")


