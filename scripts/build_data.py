#!/usr/bin/env python3
"""Turn the raw scrape into the site's clean catalogue data and web images.

Usage (from the site folder):  python scripts/build_data.py
Output: src/data/products.json, public/products/<slug>/*.webp

Everything curated by hand lives in curated.py. Anything needing the brand's
confirmation is listed in ../DATA_REVIEW.md.
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

sys.path.insert(0, str(Path(__file__).parent))
from curated import CATEGORIES, PRODUCTS, MANUAL_TABLES, DROP_AMINO_PROFILE  # noqa: E402
from parse_tables import raw_tables  # noqa: E402

SITE = Path(__file__).resolve().parent.parent
EXPORT = SITE.parent / "royalnutrition_export"
OUT_IMG = SITE / "public" / "products"
OUT_JSON = SITE / "src" / "data" / "products.json"

TYPOS = [
    ("Citruline", "Citrulline"), ("Strenght", "Strength"), ("peper", "pepper"), ("Peper", "Pepper"),
    ("cloride", "chloride"), ("sillicon", "silicon"), ("thickner", "thickener"), ("panthetonate", "pantothenate"),
    ("Scientifcally", "Scientifically"), ("powerfull", "powerful"), ("maintanance", "maintenance"),
    ("Perfomance", "Performance"), ("hydrolisate", "hydrolysate"), ("specific ration", "specific ratio"),
    ("there are metabolized", "they are metabolized"), ("heapping", "heaping"), ("3th", "3rd"),
    ("Lisine", "Lysine"), ("Phosphorous", "Phosphorus"), ("silimarin", "silymarin"), ("Melatonine", "Melatonin"),
    ("acesulfam ", "acesulfame "), ("It’s properties", "Its properties"), ("is Food supplement", "is a food supplement"), ("1 capsules", "1 capsule"), (" an take", " and take"),
    ("2 capsule ", "2 capsules "), ("Take daily 25 ml with 30 minutes", "Take 25 ml daily, 30 minutes"),
]

# Short benefit lines the source repeats that read as unauthorised health claims.
BLOCKED_HIGHLIGHTS = {
    "high anabolic value", "strong anabolic formula", "optimal testosterone levels", "enhanced libido",
    "muscle gain", "maximum strength", "maximize strength", "blood sugar support", "anti-catabolic",
    "stimulate the breakdown of fats", "weight management support", "reduce muscle soreness and cramps",
    "fights mineral deficiency", "accelerate recovery", "delays muscle fatigue",
    "supplement for muscle growth, vascularity & energy", "muscle mass support",
    "improve the way body stores and utilises energy", "improves athletic performance",
}


def fix(text):
    for a, b in TYPOS:
        text = text.replace(a, b)
    return re.sub(r"[ \t]+", " ", text).strip()


def clean_description(p, name):
    """Split the source description into body paragraphs and short highlights."""
    body, highlights = [], []
    for para in re.split(r"\n\s*\n", p["description"] or ""):
        para = para.strip()
        low = para.lower()
        if not para or low.startswith(("free from", "rda /", "on workout days", "on non-workout days")):
            continue
        # Title lines such as "ROYAL EAA" or "GABA 1600".
        if para.upper() == para and len(para) < 40:
            continue
        para = re.sub(r"ROYAL.s NUTRITION [A-Z0-9 .:&\-]*[A-Z0-9](?=[ ,–])", f"Royal Nutrition {name}", para)
        para = fix(para.replace(" it’s a", " is a").replace(" it’s an", " is an").replace(" tablets it’s", " tablets are"))
        para = para.replace(f"{name} –", f"{name} is").replace("a a ", "a ")
        if len(para) < 62 and "." not in para.rstrip("."):
            if para.lower().rstrip("!.") not in BLOCKED_HIGHLIGHTS:
                highlights.append(para.rstrip("!."))
        else:
            body.append(para)
    return body, highlights


def clean_notes(notes):
    out = {"footnotes": [], "warnings": [], "storage": []}
    for para in re.split(r"\n\s*\n", notes or ""):
        para = fix(para.strip().lstrip("* ").strip()) if not para.strip().startswith("*%") and not re.match(r"^\*+ ?(Essential|Branched)", para.strip()) else fix(para.strip())
        if not para:
            continue
        low = para.lower()
        if low.startswith("free from"):
            continue
        if low.startswith(("store ", "store in")):
            out["storage"].append(para)
        elif para.startswith("*"):
            para = para.split(" / ")[0]
            para = para.replace("*%NRV – nutrient reference values", "*% NRV: nutrient reference values")
            out["footnotes"].append(para)
        else:
            out["warnings"].append(para)
    return out


def free_from(notes, description):
    m = re.search(r"Free From ([^\n]+)", (notes or "") + "\n" + (description or ""), re.I)
    if not m:
        return []
    items = re.split(r",|&", m.group(1).rstrip(" .").strip())
    return [i.strip().rstrip(".") for i in items if i.strip()]


def english(label):
    return fix(re.split(r"\s*/\s*", label)[0]).strip()


def clean_value(v):
    v = re.sub(r"\s*%\s*\*?\s*RDA\s*/\s*RWS", "% RDA", v)
    v = re.sub(r"\s*%\s*RDA\s*/\s*RWS", "% RDA", v)
    v = re.sub(r"(\d)\s+%", r"\1%", v)
    v = re.sub(r"\s*kJ\s*/\s*", " kJ / ", v)
    return v.replace(" %", "%").strip()


def parse_table(p, slug, columns):
    """Align label and value lines from the raw table. Raises on any mismatch."""
    sections = [{"title": None, "rows": []}]
    for table in raw_tables(p["source_html"]):
        for row in table:
            first = row[0] if row else []
            if not first:
                continue
            joined = " ".join(first).lower()
            if joined.startswith(("nutrition information", "nutritional content", "content")):
                continue
            cells = [c for c in row[1:] if c]
            if not cells:
                if "amino acid profile" in joined:
                    sections.append({"title": "Amino acid profile", "rows": []})
                continue
            labels, skip = [], False
            for line in first:
                if skip:
                    skip = False
                    continue
                if line.rstrip().endswith("/"):
                    skip = True
                labels.append(line)
            for c in cells:
                if len(c) != len(labels):
                    raise ValueError(f"{slug}: {len(labels)} labels vs {len(c)} values in {labels[:2]}")
            is_profile = len(labels) >= 15
            if len(cells) != len(columns) and not is_profile:
                raise ValueError(f"{slug}: {len(cells)} value columns vs header {columns}")
            if is_profile and sections[-1]["title"] is None:
                if slug in DROP_AMINO_PROFILE:
                    continue
                sections.append({"title": "Amino acid profile", "rows": []})
            if is_profile and len(cells) < len(columns):
                # Profiles are often published for the first column only.
                sections[-1]["columns"] = columns[: len(cells)]
            for i, label in enumerate(labels):
                name = english(label)
                sections[-1]["rows"].append({
                    "label": name.lstrip("– ").strip(),
                    "indent": name.lower().startswith(("of which", "–")),
                    "values": [clean_value(c[i]) for c in cells],
                })
    return [s for s in sections if s["rows"]]


def normalise_image(src, dest, size=880, inner=0.84):
    """Place the pack on a white square at a consistent scale."""
    im = Image.open(src).convert("RGBA")
    white = Image.new("RGBA", im.size, (255, 255, 255, 255))
    white.alpha_composite(im)
    rgb = white.convert("RGB")
    mask = ImageChops.difference(rgb, Image.new("RGB", rgb.size, (255, 255, 255))).convert("L").point(lambda v: 255 if v > 70 else 0)
    left, top, right, bottom = mask.getbbox()
    w, h = right - left, bottom - top
    # Fade everything beyond the pack to white so floor shadows never reach the frame edge.
    grow = round(max(w, h) * 0.05)
    keep = Image.new("L", rgb.size, 0)
    ImageDraw.Draw(keep).rectangle((left - grow, top - grow, right + grow, bottom + grow), fill=255)
    keep = keep.filter(ImageFilter.GaussianBlur(grow * 0.6))
    rgb = Image.composite(rgb, Image.new("RGB", rgb.size, (255, 255, 255)), keep)
    scale = min(size * inner / w, size * inner / h)
    new = rgb.resize((round(rgb.width * scale), round(rgb.height * scale)), Image.LANCZOS)
    canvas = Image.new("RGB", (size, size), (255, 255, 255))
    x = round(size / 2 - (left + w / 2) * scale)
    y = round(size / 2 - (top + h / 2) * scale)
    canvas.paste(new, (x, y))
    dest.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dest, "WEBP", quality=84, method=6)
    canvas.resize((440, 440), Image.LANCZOS).save(dest.with_name(dest.stem + "-440.webp"), "WEBP", quality=80, method=6)


def main():
    raw = json.loads((EXPORT / "royalnutrition_products.json").read_text(encoding="utf-8"))
    src = {p["slug"]: p for p in raw["products"]}
    used, products, errors = set(), [], []

    for c in PRODUCTS:
        p = src[c["source"]]
        used.add(c["source"])
        used.update(c.get("merge", []))
        slug = c["slug"]

        body, highlights = clean_description(p, c["name"])
        ingredients = fix(p["ingredients"] or "")
        directions = [fix(x) for x in (p["directions"] or "").split("\n") if x.strip()]
        notes = clean_notes(p["notes"])
        if slug in MANUAL_TABLES:
            sections = MANUAL_TABLES[slug]
        elif c.get("columns"):
            try:
                sections = parse_table(p, slug, c["columns"])
            except ValueError as e:
                errors.append(str(e))
                sections = []
        else:
            sections = []

        images = []
        sources = [(src[s]["images"], s) for s in [c["source"], *c.get("merge", [])]]
        labels = c.get("image_labels", [])
        n = 0
        for imgs, _ in sources:
            for img in imgs:
                n += 1
                file = f"{n:02d}.webp"
                normalise_image(EXPORT / img["local_path"], OUT_IMG / slug / file)
                images.append({
                    "src": f"/products/{slug}/{file}",
                    "thumb": f"/products/{slug}/{n:02d}-440.webp",
                    "label": labels[n - 1] if n - 1 < len(labels) else None,
                })

        products.append({
            "slug": slug,
            "name": c["name"],
            "category": c["category"],
            "form": c["form"],
            "size": c.get("size"),
            "servingSize": fix(c.get("serving", p["serving_size"] or "")) or None,
            "servings": c.get("servings", p["servings_per_container"] or None),
            "flavours": c.get("flavours", []),
            "body": c.get("body", body),
            "highlights": c.get("highlights", highlights),
            "ingredients": c.get("ingredients", ingredients) or None,
            "directions": c.get("directions", directions),
            "freeFrom": c.get("free_from", free_from(p["notes"], p["description"])),
            "footnotes": notes["footnotes"],
            "warnings": c.get("warnings", notes["warnings"]),
            "storage": notes["storage"],
            "columns": c.get("columns", []),
            "nutrition": sections,
            "images": images,
        })

    missing = set(src) - used
    if missing:
        errors.append(f"not mapped: {missing}")
    if errors:
        print("\n".join(errors))
        sys.exit(1)

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps({"categories": CATEGORIES, "products": products}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(products)} products, {sum(len(p['images']) for p in products)} images")


if __name__ == "__main__":
    main()
