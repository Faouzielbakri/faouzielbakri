from bs4 import BeautifulSoup
import re

with open("public/proposals/Proposal_AI_Concierge_WhatsApp_MVP_Marrakech (1).html", "r", encoding="utf-8") as f:
    orig = f.read()

with open("scripts/fr_sheet_inner.html", "r", encoding="utf-8") as f:
    fr = f.read()

soup_en = BeautifulSoup(orig, "html.parser")
en_sheet = soup_en.find("div", class_="sheet")

soup_fr = BeautifulSoup(fr, "html.parser")

# Wrap each table in en_sheet and fr_sheet in <div class="table-wrap">
for t in en_sheet.find_all("table"):
    if not t.parent or "table-wrap" not in t.parent.get("class", []):
        wrap = soup_en.new_tag("div", attrs={"class": "table-wrap"})
        t.wrap(wrap)

for t in soup_fr.find_all("table"):
    if not t.parent or "table-wrap" not in t.parent.get("class", []):
        wrap = soup_fr.new_tag("div", attrs={"class": "table-wrap"})
        t.wrap(wrap)

en_tables_wrapped = len(en_sheet.find_all(class_="table-wrap"))
fr_tables_wrapped = len(soup_fr.find_all(class_="table-wrap"))

print(f"EN table-wrap: {en_tables_wrapped} | FR table-wrap: {fr_tables_wrapped}")
