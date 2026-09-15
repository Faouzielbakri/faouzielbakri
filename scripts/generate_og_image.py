import os
from PIL import Image, ImageDraw, ImageFont

width = 1200
height = 630

# Create high-res canvas
img = Image.new("RGB", (width, height), color="#FBFBFA")
draw = ImageDraw.Draw(img)

# Try system fonts
def get_font(size, bold=False):
    font_paths = [
        "/System/Library/Fonts/SFPro-Bold.otf" if bold else "/System/Library/Fonts/SFPro-Regular.otf",
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

font_badge = get_font(18, bold=True)
font_title = get_font(52, bold=True)
font_sub = get_font(24, bold=False)
font_meta_label = get_font(16, bold=False)
font_meta_val = get_font(20, bold=True)
font_brand = get_font(18, bold=True)

# Outer card border
draw.rectangle([30, 30, width - 30, height - 30], outline="#E2DFD8", width=2)
draw.rectangle([34, 34, width - 34, height - 34], outline="#F0EEE8", width=1)

# Subtle background accent band at top
draw.rectangle([32, 32, width - 32, 110], fill="#F3F1EC")
draw.line([32, 110, width - 32, 110], fill="#E2DFD8", width=1)

# Badge: Ballroom MVP
draw.rounded_rectangle([60, 52, 290, 90], radius=8, fill="#101E2E")
draw.text((76, 61), "BALLROOM PROD · MVP", fill="#FFFFFF", font=font_badge)

# Location & Pilot tag
draw.text((315, 62), "Marrakech Pilot · Technical & Financial Proposal", fill="#64748B", font=font_brand)

# Green WhatsApp Live Indicator
draw.ellipse([width - 240, 62, width - 224, 78], fill="#25D366")
draw.text((width - 214, 61), "WhatsApp API", fill="#101E2E", font=font_badge)

# Main Title
draw.text((60, 160), "An AI Concierge that runs", fill="#101E2E", font=font_title)
draw.text((60, 226), "on WhatsApp.", fill="#2563EB", font=font_title)

# Subtitle / Summary paragraph
sub_lines = [
    "A complete, working pilot in Marrakech: travellers ask in plain language,",
    "verified suppliers answer on WhatsApp, and operators see and control everything."
]
y_text = 320
for line in sub_lines:
    draw.text((60, y_text), line, fill="#475569", font=font_sub)
    y_text += 36

# Metric highlights pill box
draw.rounded_rectangle([60, 420, width - 60, 500], radius=10, fill="#FFFFFF", outline="#E2DFD8", width=1)

# 3 columns inside metrics box
# Col 1: Timeline
draw.text((85, 434), "SCHEDULE", fill="#94A3B8", font=font_meta_label)
draw.text((85, 458), "6 Weeks to Live Pilot", fill="#101E2E", font=font_meta_val)

# Divider 1
draw.line([420, 432, 420, 488], fill="#E2DFD8", width=1)

# Col 2: Architecture
draw.text((450, 434), "ARCHITECTURE", fill="#94A3B8", font=font_meta_label)
draw.text((450, 458), "Next.js Backend + Postgres", fill="#101E2E", font=font_meta_val)

# Divider 2
draw.line([810, 432, 810, 488], fill="#E2DFD8", width=1)

# Col 3: Payoff
draw.text((840, 434), "PILOTE PAYOFF", fill="#94A3B8", font=font_meta_label)
draw.text((840, 458), "54 Bookings to Break Even", fill="#16A34A", font=font_meta_val)

# Bottom footer line
draw.line([60, 535, width - 60, 535], fill="#E2DFD8", width=1)

# Footer attribution
draw.text((60, 555), "Prepared by Faouzi El Bakri — AI Engineer & Full-Stack Developer", fill="#64748B", font=font_meta_label)
draw.text((width - 320, 555), "faouzielbakri.com/proposals/ballroom-mvp", fill="#94A3B8", font=font_meta_label)

os.makedirs("public/og", exist_ok=True)
out_path = "public/og/ballroom-mvp.png"
img.save(out_path, "PNG", optimize=True)
print(f"Generated {out_path} ({os.path.getsize(out_path)} bytes)")
