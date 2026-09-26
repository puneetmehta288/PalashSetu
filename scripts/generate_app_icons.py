import os
from PIL import Image, ImageDraw

def generate_icons():
    src_icon_path = r"C:\Users\HP\.gemini\antigravity\brain\fca50b31-b5e4-45a6-9f43-57a6eb240a56\.user_uploaded\media_1790446302489.png"
    mobile_dir = r"E:\hackathon\BhashaSetu\mobile"
    res_dir = os.path.join(mobile_dir, "android", "app", "src", "main", "res")
    public_dir = os.path.join(mobile_dir, "public")

    if not os.path.exists(src_icon_path):
        print(f"Error: Source icon not found at {src_icon_path}")
        return

    img = Image.open(src_icon_path).convert("RGBA")
    w, h = img.size
    print(f"Loaded master icon: {w}x{h}")

    # 1. Create full-bleed version for adaptive foreground
    # Top color: (24, 57, 112), Bottom color: (16, 40, 81)
    full_bleed = Image.new("RGBA", (w, h))
    draw = ImageDraw.Draw(full_bleed)
    for y in range(h):
        r = int(24 + (16 - 24) * (y / h))
        g = int(57 + (40 - 57) * (y / h))
        b = int(112 + (81 - 112) * (y / h))
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))
    full_bleed.alpha_composite(img)

    # 2. Create circular masked version for round icons
    round_master = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    mask = Image.new("L", (w, h), 0)
    mask_draw = ImageDraw.Draw(mask)
    # Circle diameter 1024
    mask_draw.ellipse([(0, 0), (w - 1, h - 1)], fill=255)
    round_master.paste(full_bleed, (0, 0), mask)

    # 3. Android mipmap densities
    densities = {
        "mdpi": {"legacy": 48, "fg": 108},
        "hdpi": {"legacy": 72, "fg": 162},
        "xhdpi": {"legacy": 96, "fg": 216},
        "xxhdpi": {"legacy": 144, "fg": 324},
        "xxxhdpi": {"legacy": 192, "fg": 432}
    }

    for dens, sizes in densities.items():
        folder = os.path.join(res_dir, f"mipmap-{dens}")
        os.makedirs(folder, exist_ok=True)

        leg_size = sizes["legacy"]
        fg_size = sizes["fg"]

        # ic_launcher.png (squircle)
        leg_icon = img.resize((leg_size, leg_size), Image.Resampling.LANCZOS)
        leg_icon.save(os.path.join(folder, "ic_launcher.png"), "PNG")

        # ic_launcher_round.png (round)
        rnd_icon = round_master.resize((leg_size, leg_size), Image.Resampling.LANCZOS)
        rnd_icon.save(os.path.join(folder, "ic_launcher_round.png"), "PNG")

        # ic_launcher_foreground.png (full bleed 108dp canvas)
        fg_icon = full_bleed.resize((fg_size, fg_size), Image.Resampling.LANCZOS)
        fg_icon.save(os.path.join(folder, "ic_launcher_foreground.png"), "PNG")

        print(f"Generated mipmap-{dens}: legacy={leg_size}x{leg_size}, fg={fg_size}x{fg_size}")

    # 4. Web / PWA Assets in public/
    os.makedirs(public_dir, exist_ok=True)
    img.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "icon.png"), "PNG")
    img.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "apple-touch-icon.png"), "PNG")
    img.resize((64, 64), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "favicon.png"), "PNG")
    img.resize((32, 32), Image.Resampling.LANCZOS).save(os.path.join(public_dir, "favicon-32x32.png"), "PNG")
    img.save(os.path.join(public_dir, "palash_logo.png"), "PNG")
    print("Generated Web/PWA public assets (favicon.png, icon.png, apple-touch-icon.png, palash_logo.png)")

    # 5. Splash screen generator helper
    def create_splash(target_w, target_h):
        splash = Image.new("RGBA", (target_w, target_h))
        sp_draw = ImageDraw.Draw(splash)
        for y in range(target_h):
            r = int(24 + (16 - 24) * (y / target_h))
            g = int(57 + (40 - 57) * (y / target_h))
            b = int(112 + (81 - 112) * (y / target_h))
            sp_draw.line([(0, y), (target_w, y)], fill=(r, g, b, 255))
        
        # Center the logo (scaled to ~35% of min dimension)
        logo_dim = int(min(target_w, target_h) * 0.40)
        scaled_logo = img.resize((logo_dim, logo_dim), Image.Resampling.LANCZOS)
        pos_x = (target_w - logo_dim) // 2
        pos_y = (target_h - logo_dim) // 2
        splash.alpha_composite(scaled_logo, (pos_x, pos_y))
        return splash.convert("RGB")

    splash_targets = [
        ("drawable", "splash.png", 480, 320),
        ("drawable-port-mdpi", "splash.png", 320, 480),
        ("drawable-port-hdpi", "splash.png", 480, 800),
        ("drawable-port-xhdpi", "splash.png", 720, 1280),
        ("drawable-port-xxhdpi", "splash.png", 960, 1600),
        ("drawable-port-xxxhdpi", "splash.png", 1280, 1920),
        ("drawable-land-mdpi", "splash.png", 480, 320),
        ("drawable-land-hdpi", "splash.png", 800, 480),
        ("drawable-land-xhdpi", "splash.png", 1280, 720),
        ("drawable-land-xxhdpi", "splash.png", 1600, 960),
        ("drawable-land-xxxhdpi", "splash.png", 1920, 1280),
    ]

    for folder_name, filename, sw, sh in splash_targets:
        folder_path = os.path.join(res_dir, folder_name)
        os.makedirs(folder_path, exist_ok=True)
        sp_img = create_splash(sw, sh)
        sp_img.save(os.path.join(folder_path, filename), "PNG")
        print(f"Generated splash: {folder_name}/{filename} ({sw}x{sh})")

if __name__ == "__main__":
    generate_icons()
