import json

# Load units
with open("scratch_units.json", "r", encoding="utf-8") as f:
    units = json.load(f)

print(f"Loaded {len(units)} units.")
