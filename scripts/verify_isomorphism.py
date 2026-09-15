from bs4 import BeautifulSoup
import re

with open("public/proposals/Proposal_AI_Concierge_WhatsApp_MVP_Marrakech (1).html", "r", encoding="utf-8") as f:
    orig_html = f.read()

with open("scripts/fr_sheet_inner.html", "r", encoding="utf-8") as f:
    fr_html = f.read()

soup_en = BeautifulSoup(orig_html, "html.parser")
soup_fr = BeautifulSoup(fr_html, "html.parser")

en_sheet = soup_en.find("div", class_="sheet")
fr_sheet = soup_fr

en_secs = [("cover", en_sheet.find("header", class_="cover"))] + [(s.get("id"), s) for s in en_sheet.find_all("section")]
fr_secs = [("cover", fr_sheet.find("header", class_="cover"))] + [(s.get("id"), s) for s in fr_sheet.find_all("section")]

print(f"EN sections: {len(en_secs)} | FR sections: {len(fr_secs)}")

errors = []
for (en_id, en_el), (fr_id, fr_el) in zip(en_secs, fr_secs):
    expected_fr_id = "cover" if en_id == "cover" else f"{en_id}-fr"
    if fr_id != expected_fr_id:
        errors.append(f"Section ID mismatch: EN '{en_id}' vs FR '{fr_id}' (expected '{expected_fr_id}')")
    
    # Check counts of key elements
    for tag in ["p", "h2", "h3", "table", "ul", "ol", "li"]:
        en_count = len(en_el.find_all(tag))
        fr_count = len(fr_el.find_all(tag))
        if en_count != fr_count:
            errors.append(f"[{en_id}] <{tag}> count mismatch: EN={en_count}, FR={fr_count}")
            
    for cls in ["callout", "bignum", "bigpair", "states", "n", "c", "thread", "turn", "bubble", "note"]:
        en_count = len(en_el.find_all(class_=cls))
        fr_count = len(fr_el.find_all(class_=cls))
        if en_count != fr_count:
            errors.append(f"[{en_id}] class '.{cls}' count mismatch: EN={en_count}, FR={fr_count}")

    # Check table rows & cells
    en_tables = en_el.find_all("table")
    fr_tables = fr_el.find_all("table")
    for t_idx, (et, ft) in enumerate(zip(en_tables, fr_tables)):
        en_rows = len(et.find_all("tr"))
        fr_rows = len(ft.find_all("tr"))
        if en_rows != fr_rows:
            errors.append(f"[{en_id}] Table {t_idx} <tr> count mismatch: EN={en_rows}, FR={fr_rows}")
        en_cells = len(et.find_all(["td", "th"]))
        fr_cells = len(ft.find_all(["td", "th"]))
        if en_cells != fr_cells:
            errors.append(f"[{en_id}] Table {t_idx} cell count mismatch: EN={en_cells}, FR={fr_cells}")

if errors:
    print(f"FAILED with {len(errors)} errors:")
    for e in errors:
        print(" -", e)
else:
    print("SUCCESS: 100% ISOMORPHISM ACHIEVED ACROSS ALL SECTIONS!")
