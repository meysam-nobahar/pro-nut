#!/usr/bin/env python3
"""Cut pack shots out of their white backgrounds for use on coloured banners.

Background and floor shadow are found by flood-filling from the image border.
Those pixels become black with alpha taken from their darkness, so shadows stay
soft on any colour and edges stay anti-aliased.

Usage (from the site folder): python scripts/build_cutouts.py
Output: public/banners/packs/<name>.webp
"""
import json
from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

SITE = Path(__file__).resolve().parent.parent
IMAGES = SITE.parent / "royalnutrition_export" / "images"
OUT = SITE / "public" / "banners" / "packs"

# name: (source file, brightness above which a border-connected pixel counts as background)
PACKS = {
    "whey": ("whey-protein-chocolate/01_RN_Whey-770x1024.png", None),
    "multivitamin": ("multivitamin/01_MULTIVITAMIN-1024x643.png", None),
    "royal-mass": ("royal-mass-2/01_royal-mass-1024x683.jpg", 150),
    "eaa": ("eaa/01_EAA-250g-Sour-Cherry-CURBE-310x76_060522-768x768.png", 110),
    "citrulline": ("citruline-250-g/01_CITRULINE-250g-Peach-Ice-Tea-CURBE-310x76_060522-2-768x768.png", 110),
    "bcaa-liquid": ("royal-bcaa-liquid/01_ROYAL-BCAA-LIQUID-_Lemon-FLAVOUR_500-ML_060522-768x768.png", 165),
    "weiler": ("weiller/01_WEILER-1024x955.jpg", 150),
    "collagen": ("collagen-2250/01_COLLAGEN-2250-90-Capsules-000-215x100x37.5-768x768.png", 110),
    "creatine": ("creatine-natur/01_RN_Creatine-1024x862.png", None),
    "gaba": ("gaba/01_GABA-1600-90-Capsules-CURBE-205x80_060522-1-768x768.png", 110),
    "carnitine-liquid": ("royal-carnitine-liquid/01_ROYAL-CARNITINE-LIQUID_Wild-Berries-FLAVOUR_500-ML-768x768.png", 165),
    "ala": ("ala/01_ALA-150-90-Capsules-205x80-2022-768x768.png", 110),
}


def cut(path, threshold):
    im = Image.open(path).convert("RGBA")
    if threshold is None:
        return im
    w, h = im.size
    src = im.load()
    bright = [[False] * h for _ in range(w)]
    for x in range(w):
        for y in range(h):
            r, g, b, a = src[x, y]
            neutral = max(r, g, b) - min(r, g, b) < 28
            bright[x][y] = a == 0 or (neutral and (r + g + b) / 3 >= threshold)
    seen = [[False] * h for _ in range(w)]
    queue = deque()
    for x in range(w):
        queue.extend([(x, 0), (x, h - 1)])
    for y in range(h):
        queue.extend([(0, y), (w - 1, y)])
    while queue:
        x, y = queue.popleft()
        if not (0 <= x < w and 0 <= y < h) or seen[x][y] or not bright[x][y]:
            continue
        seen[x][y] = True
        queue.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    # Grow one pixel so the anti-aliased rim of the pack is softened too.
    out = im.copy()
    px = out.load()
    for x in range(w):
        for y in range(h):
            edge = seen[x][y] or any(
                0 <= x + dx < w and 0 <= y + dy < h and seen[x + dx][y + dy]
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))
            )
            if edge:
                r, g, b, _ = src[x, y]
                px[x, y] = (0, 0, 0, 255 - (r + g + b) // 3)
    return out


def fade_shadow(img):
    """Fade the floor shadow out near the pack so it never ends in a hard edge."""
    alpha = img.getchannel("A")
    left, top, right, bottom = alpha.point(lambda v: 255 if v > 170 else 0).getbbox()
    grow = round(max(right - left, bottom - top) * 0.035)
    keep = Image.new("L", img.size, 0)
    ImageDraw.Draw(keep).rectangle((left - grow, top - grow, right + grow, bottom + grow), fill=255)
    keep = keep.filter(ImageFilter.GaussianBlur(grow * 0.55))
    img.putalpha(ImageChops.multiply(alpha, keep))
    return img


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    sizes = {}
    for name, (rel, threshold) in PACKS.items():
        img = fade_shadow(cut(IMAGES / rel, threshold))
        img = img.crop(img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
        img.save(OUT / f"{name}.webp", "WEBP", quality=90, method=6)
        sizes[name] = img.size
        print(name, img.size)
    (SITE / "src" / "data" / "packs.json").write_text(json.dumps(sizes, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
