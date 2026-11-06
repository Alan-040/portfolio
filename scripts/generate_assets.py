import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WIDTH = 1600
HEIGHT = 1000

# Fonts
FONT_BOLD_PATH = "C:/Windows/Fonts/arialbd.ttf"
FONT_REG_PATH = "C:/Windows/Fonts/arial.ttf"
FONT_SEGOE_BOLD = "C:/Windows/Fonts/segoeuib.ttf"
FONT_CONSOLAS = "C:/Windows/Fonts/consola.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def create_sundown_mockup(is_placeholder=False):
    # Sundown Studio Mockup: Off-white editorial background, huge bold type SPACES THAT INSPIRE, red fluid ambient glow
    im = Image.new("RGB", (WIDTH, HEIGHT), "#EFEAE3")
    draw = ImageDraw.Draw(im)

    # Ambient red glow on bottom right
    # Create radial gradient glow
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    cx, cy = int(WIDTH * 0.85), int(HEIGHT * 0.85)
    max_r = int(WIDTH * 0.5)
    for r in range(max_r, 0, -8):
        alpha = int(140 * (1.0 - (r / max_r) ** 1.6))
        # Orange-red #FE3211 -> (254, 50, 17)
        glow_draw.ellipse(
            (cx - r, cy - r, cx + r, cy + r),
            fill=(254, 50, 17, alpha)
        )
    glow = glow.filter(ImageFilter.GaussianBlur(radius=50))
    im.paste(glow, (0, 0), glow)

    # Re-obtain draw object on merged image
    draw = ImageDraw.Draw(im)

    # Top Navigation Bar
    nav_font = get_font(FONT_SEGOE_BOLD, 28)
    sub_font = get_font(FONT_REG_PATH, 22)
    mono_font = get_font(FONT_CONSOLAS, 20)

    # Logo
    draw.text((80, 60), "Sundown Studio", fill="#111111", font=nav_font)
    
    # Nav links
    nav_items = ["Work", "Studio", "Contact"]
    x_offset = WIDTH - 380
    for item in nav_items:
        draw.text((x_offset, 64), item, fill="#333333", font=sub_font)
        x_offset += 100

    # Top divider
    draw.line([(80, 115), (WIDTH - 80, 115)], fill="#DDD6CC", width=2)

    # Massive Editorial Display Typography: SPACES THAT INSPIRE
    huge_font = get_font(FONT_BOLD_PATH, 140)
    lines = ["SPACES", "THAT", "INSPIRE"]
    y_text = 240
    for line in lines:
        draw.text((80, y_text), line, fill="#0B0B0C", font=huge_font)
        y_text += 135

    # Editorial Subheading & Supporting Statement
    desc_font = get_font(FONT_REG_PATH, 32)
    desc_text = "An editorial space for creators and visionaries."
    draw.text((80, y_text + 40), desc_text, fill="#3A3936", font=desc_font)

    desc_detail = "Multi-disciplinary studio focused on creating unique, end-to-end spaces and experiences."
    detail_font = get_font(FONT_REG_PATH, 24)
    draw.text((80, y_text + 95), desc_detail, fill="#66645E", font=detail_font)

    # Bottom status / project metadata
    draw.text((80, HEIGHT - 80), "EDITORIAL WEBSITE • MOTION DESIGN • 2026", fill="#77746C", font=mono_font)
    draw.text((WIDTH - 280, HEIGHT - 80), "sundownstudio.com", fill="#77746C", font=mono_font)

    if is_placeholder:
        # Overlay clearly identifiable placeholder badge
        badge_w, badge_h = 700, 60
        bx = (WIDTH - badge_w) // 2
        by = 50
        badge_im = Image.new("RGBA", (badge_w, badge_h), (20, 20, 24, 230))
        b_draw = ImageDraw.Draw(badge_im)
        b_font = get_font(FONT_CONSOLAS, 20)
        b_draw.rectangle([(0, 0), (badge_w - 1, badge_h - 1)], outline=(254, 50, 17, 255), width=2)
        b_draw.text((25, 18), "PLACEHOLDER • REPLACE WITH LIVE SUNDOWN SCREENSHOT", fill="#FFFFFF", font=b_font)
        im.paste(badge_im, (bx, by), badge_im)

    return im

def create_portfolio_mockup(is_placeholder=False):
    # Personal portfolio Mockup: Pure dark mode, minimalist bold type, project rows
    im = Image.new("RGB", (WIDTH, HEIGHT), "#0A0B0E")
    draw = ImageDraw.Draw(im)

    # Top Navigation Bar
    nav_font = get_font(FONT_SEGOE_BOLD, 26)
    sub_font = get_font(FONT_REG_PATH, 22)
    mono_font = get_font(FONT_CONSOLAS, 20)

    draw.text((80, 60), "PORTFOLIO", fill="#FFFFFF", font=nav_font)
    draw.text((WIDTH - 260, 62), "SELECTED WORKS 2026", fill="#666A78", font=mono_font)

    # Top subtle line
    draw.line([(80, 115), (WIDTH - 80, 115)], fill="#1E2028", width=1)

    # Huge Centered/Asymmetric Bold Display Headline: PRODUCT DESIGNER
    huge_font = get_font(FONT_BOLD_PATH, 130)
    lines = ["PRODUCT", "DESIGNER"]
    y_text = 250
    for line in lines:
        draw.text((80, y_text), line, fill="#F0F2F8", font=huge_font)
        y_text += 135

    # Subheading
    sub_headline = get_font(FONT_REG_PATH, 32)
    draw.text((80, y_text + 30), "Crafting high-fidelity interfaces and fluid digital experiences.", fill="#8B90A0", font=sub_headline)

    # Project List Showcase Rows
    row_y = y_text + 110
    row_font_title = get_font(FONT_SEGOE_BOLD, 26)
    row_font_meta = get_font(FONT_CONSOLAS, 20)

    rows = [
        ("01 / FINTECH DASHBOARD", "Design & Frontend", "2026"),
        ("02 / EDITORIAL STUDIO", "Creative Direction", "2025"),
    ]

    for title, role, yr in rows:
        draw.line([(80, row_y), (WIDTH - 80, row_y)], fill="#1C1E26", width=1)
        draw.text((80, row_y + 18), title, fill="#FFFFFF", font=row_font_title)
        draw.text((WIDTH - 450, row_y + 22), role, fill="#666A78", font=row_font_meta)
        draw.text((WIDTH - 150, row_y + 22), yr, fill="#A0A5B5", font=row_font_meta)
        row_y += 65

    draw.line([(80, row_y), (WIDTH - 80, row_y)], fill="#1C1E26", width=1)

    if is_placeholder:
        badge_w, badge_h = 700, 60
        bx = (WIDTH - badge_w) // 2
        by = 50
        badge_im = Image.new("RGBA", (badge_w, badge_h), (20, 20, 24, 230))
        b_draw = ImageDraw.Draw(badge_im)
        b_font = get_font(FONT_CONSOLAS, 20)
        b_draw.rectangle([(0, 0), (badge_w - 1, badge_h - 1)], outline=(0, 208, 156, 255), width=2)
        b_draw.text((25, 18), "PLACEHOLDER • REPLACE WITH LIVE PORTFOLIO SCREENSHOT", fill="#FFFFFF", font=b_font)
        im.paste(badge_im, (bx, by), badge_im)

    return im

def create_zerodha_mockup(is_placeholder=False):
    # Zerodha P&L Landing Page Mockup: Dark fintech dashboard, emerald green indicators, charts
    im = Image.new("RGB", (WIDTH, HEIGHT), "#0D1117")
    draw = ImageDraw.Draw(im)

    # Header Bar
    nav_font = get_font(FONT_SEGOE_BOLD, 26)
    mono_font = get_font(FONT_CONSOLAS, 20)
    draw.text((80, 60), "pnl.page", fill="#00D09C", font=nav_font)
    draw.text((210, 64), "•  TAX & P&L FOR ZERODHA", fill="#7D8590", font=mono_font)

    # Badge Pill: LIVE ANALYTICS
    badge_w, badge_h = 170, 36
    draw.rounded_rectangle([(WIDTH - 250, 56), (WIDTH - 80, 56 + badge_h)], radius=18, fill="#0E2D24", outline="#00D09C", width=1)
    draw.text((WIDTH - 225, 64), "● LIVE STATUS", fill="#00D09C", font=get_font(FONT_CONSOLAS, 17))

    # Top line
    draw.line([(80, 115), (WIDTH - 80, 115)], fill="#21262D", width=1)

    # Big Headline: Track Zerodha P&L
    headline_font = get_font(FONT_BOLD_PATH, 90)
    draw.text((80, 160), "Track Zerodha P&L", fill="#FFFFFF", font=headline_font)

    # Subheading
    sub_font = get_font(FONT_REG_PATH, 28)
    draw.text((80, 275), "Connect your demat account, analyze returns, and generate tax-ready reports.", fill="#8B949E", font=sub_font)

    # Metric Cards Row
    card_w = 420
    card_h = 160
    cards_data = [
        ("Realized P&L", "+ ₹ 4,82,450", "#00D09C", "+18.4% this FY"),
        ("Charges & Taxes", "- ₹ 32,180", "#E05A47", "Brokerage + STT"),
        ("Net Taxable Profit", "+ ₹ 4,50,270", "#00D09C", "Verified for ITR-3"),
    ]

    for idx, (lbl, val, val_col, note) in enumerate(cards_data):
        cx = 80 + idx * (card_w + 40)
        cy = 350
        draw.rounded_rectangle([(cx, cy), (cx + card_w, cy + card_h)], radius=12, fill="#161B22", outline="#30363D", width=1)
        draw.text((cx + 25, cy + 20), lbl, fill="#8B949E", font=get_font(FONT_REG_PATH, 22))
        draw.text((cx + 25, cy + 55), val, fill=val_col, font=get_font(FONT_BOLD_PATH, 42))
        draw.text((cx + 25, cy + 115), note, fill="#7D8590", font=mono_font)

    # Bar Chart Visualizer Area
    chart_y = 560
    chart_h = 320
    draw.rounded_rectangle([(80, chart_y), (WIDTH - 80, chart_y + chart_h)], radius=14, fill="#13171F", outline="#21262D", width=1)
    draw.text((115, chart_y + 25), "MONTHLY PROFIT / LOSS DISTRIBUTION (₹)", fill="#8B949E", font=mono_font)

    # Draw 12 bars (April - March)
    bar_months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
    bar_heights = [60, 110, 85, 140, 95, 160, 120, 175, 90, 150, 130, 190]
    bar_w = 55
    start_x = 130
    spacing = (WIDTH - 260) / 12

    baseline_y = chart_y + chart_h - 60
    draw.line([(100, baseline_y), (WIDTH - 100, baseline_y)], fill="#30363D", width=1)

    for i, (m, h) in enumerate(zip(bar_months, bar_heights)):
        bx = int(start_x + i * spacing)
        top_y = baseline_y - h
        # Bar with emerald gradient / rounded top
        draw.rounded_rectangle([(bx, top_y), (bx + bar_w, baseline_y)], radius=6, fill="#00D09C")
        draw.text((bx + 10, baseline_y + 15), m, fill="#7D8590", font=mono_font)

    if is_placeholder:
        badge_w, badge_h = 700, 60
        bx = (WIDTH - badge_w) // 2
        by = 50
        badge_im = Image.new("RGBA", (badge_w, badge_h), (20, 20, 24, 230))
        b_draw = ImageDraw.Draw(badge_im)
        b_font = get_font(FONT_CONSOLAS, 20)
        b_draw.rectangle([(0, 0), (badge_w - 1, badge_h - 1)], outline=(0, 208, 156, 255), width=2)
        b_draw.text((25, 18), "PLACEHOLDER • REPLACE WITH LIVE ZERODHA SCREENSHOT", fill="#FFFFFF", font=b_font)
        im.paste(badge_im, (bx, by), badge_im)

    return im

def create_generic_placeholder():
    im = Image.new("RGB", (WIDTH, HEIGHT), "#12141A")
    draw = ImageDraw.Draw(im)

    # Diagonal grid lines
    mono_font = get_font(FONT_CONSOLAS, 24)
    huge_font = get_font(FONT_BOLD_PATH, 60)

    # Border
    draw.rectangle([(20, 20), (WIDTH - 20, HEIGHT - 20)], outline="#2B2F3E", width=2)

    # Center box
    center_text = "PROJECT SCREENSHOT PLACEHOLDER"
    draw.text((WIDTH // 2 - 440, HEIGHT // 2 - 80), center_text, fill="#FFFFFF", font=huge_font)
    
    sub = "Aspect Ratio: 16:10  •  Recommended Resolution: 1600 × 1000 WebP"
    draw.text((WIDTH // 2 - 380, HEIGHT // 2 + 10), sub, fill="#7A8196", font=mono_font)

    instruct = "Drop your project screenshot into public/images/ to replace this card."
    draw.text((WIDTH // 2 - 380, HEIGHT // 2 + 55), instruct, fill="#00D09C", font=mono_font)

    return im

def generate_all():
    print("Generating high-resolution project mockups & placeholders...")
    
    # 1. Primary Mockups (WebP + PNG)
    sundown = create_sundown_mockup(is_placeholder=False)
    sundown.save("public/images/sundown-mockup.webp", "WEBP", quality=95, method=6)
    sundown.save("public/images/sundown-mockup.png", "PNG", optimize=True)
    print("Saved sundown-mockup.webp and .png (1600x1000)")

    portfolio = create_portfolio_mockup(is_placeholder=False)
    portfolio.save("public/images/portfolio-mockup.webp", "WEBP", quality=95, method=6)
    portfolio.save("public/images/portfolio-mockup.png", "PNG", optimize=True)
    print("Saved portfolio-mockup.webp and .png (1600x1000)")

    zerodha = create_zerodha_mockup(is_placeholder=False)
    zerodha.save("public/images/zerodha-mockup.webp", "WEBP", quality=95, method=6)
    zerodha.save("public/images/zerodha-mockup.png", "PNG", optimize=True)
    print("Saved zerodha-mockup.webp and .png (1600x1000)")

    # 2. Clearly Identifiable Placeholders
    sundown_ph = create_sundown_mockup(is_placeholder=True)
    sundown_ph.save("public/images/placeholders/placeholder-sundown.webp", "WEBP", quality=90)
    
    portfolio_ph = create_portfolio_mockup(is_placeholder=True)
    portfolio_ph.save("public/images/placeholders/placeholder-portfolio.webp", "WEBP", quality=90)

    zerodha_ph = create_zerodha_mockup(is_placeholder=True)
    zerodha_ph.save("public/images/placeholders/placeholder-zerodha.webp", "WEBP", quality=90)

    generic_ph = create_generic_placeholder()
    generic_ph.save("public/images/placeholders/placeholder-generic-16-10.webp", "WEBP", quality=90)
    print("Saved all 4 placeholders in public/images/placeholders/")

    # 3. Create WebP version of original portrait for comparison in asset inventory
    try:
        profile_orig = Image.open("public/images/profile-original.png")
        profile_orig.save("public/images/profile-original.webp", "WEBP", quality=92, method=6)
        print("Generated profile-original.webp for asset inventory comparison.")
    except Exception as e:
        print("Failed to convert profile-original:", e)

if __name__ == "__main__":
    generate_all()

