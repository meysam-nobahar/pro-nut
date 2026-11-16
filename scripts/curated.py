"""Hand-curated catalogue decisions. Values here override the raw scrape."""

CATEGORIES = [
    {"slug": "protein-mass", "name": "Protein & Mass", "blurb": "Whey, gainer and protein-based amino tablets."},
    {"slug": "amino-recovery", "name": "Amino Acids & Recovery", "blurb": "BCAA, EAA and glutamine in powder, tablet and liquid form."},
    {"slug": "creatine-strength", "name": "Creatine & Strength", "blurb": "Creatine, beta alanine and HMB."},
    {"slug": "pre-workout-pump", "name": "Pre-Workout & Pump", "blurb": "Pre-workout blends, arginine, citrulline and taurine."},
    {"slug": "hormone-support", "name": "Hormone Support", "blurb": "Plant extracts, D-aspartic acid, zinc and GABA formulas."},
    {"slug": "weight-management", "name": "Weight Management", "blurb": "Carnitine, CLA and multi-ingredient formulas."},
    {"slug": "health-wellness", "name": "Health & Wellness", "blurb": "Daily vitamins, minerals and general support."},
]

PER = lambda *a: list(a)  # noqa: E731

PRODUCTS = [
    # --- Protein & Mass ---------------------------------------------------
    {"source": "whey-protein-chocolate", "slug": "whey-protein", "name": "Whey Protein", "category": "protein-mass", "form": "Powder",
     "size": "2000 g", "columns": PER("Per serving (30 g)", "Per 100 g"),
     "flavours": ["Chocolate", "Cappuccino", "Ice Cream Vanilla", "Sniker Cookie"],
     "image_labels": ["Chocolate", "Cappuccino", "Ice Cream Vanilla", "Sniker Cookie"],
     "highlights": ["22.5 g protein per serving", "Full amino acid profile", "4 flavours"]},
    {"source": "royal-mass-2", "slug": "royal-mass", "name": "Royal Mass", "category": "protein-mass", "form": "Powder",
     "size": "3628 g (8 lb)", "serving": "2 heaping scoops (100 g)", "columns": PER("Per 100 g"),
     "flavours": ["Triple Chocolate", "French Vanilla", "Creamy Strawberry", "Banana Split"],
     "body": ["Royal Nutrition Royal Mass is a gainer powder combining a carbohydrate matrix and a protein matrix with L-glutamine, creatine monohydrate, HMB, L-citrulline, BCAA and B vitamins. A 100 g serving provides 30 g of protein and 48.8 g of carbohydrates."],
     "highlights": ["30 g protein per serving", "333 kcal per serving", "4 flavours"],
     "ingredients": "Carbohydrate Matrix (dextrose monohydrate, maltodextrin, waxy maize starch), Protein Matrix (whey protein concentrate, skimmed milk powder), low fat cocoa powder (Triple Chocolate flavour), anti-caking agents (tricalcium phosphate, silicon dioxide), L-Glutamine, Creatine monohydrate, HMB (Calcium β-Hydroxy-β-Methyl Butyrate), L-Citrulline DL-malate, flavours, BCAA mix 4:1:1 (L-Leucine, L-Valine, L-Isoleucine), magnesium carbonate, L-Arginine Kyowa®, thickener (xanthan gum), colour (carmine, Creamy Strawberry flavour), taurine, sweeteners (sucralose, acesulfame potassium), zinc citrate trihydrate, Vitamin Matrix (nicotinamide (vit. B3), calcium D-pantothenate (vit. B5), thiamine mononitrate (vit. B1), riboflavin (vit. B2), pyridoxine hydrochloride (vit. B6))."},
    {"source": "amino-10000", "slug": "amino-10000", "name": "Amino 10000", "category": "protein-mass", "form": "Tablets",
     "size": "300 tablets (827.1 g)", "columns": PER("5 tablets", "15 tablets", "Per 100 g"),
     # The source says "Free from Dairy", which contradicts the whey base. Withheld until confirmed.
     "free_from": ["Yeast", "Gluten", "Wheat", "Soya", "Sugar", "Salt", "Preservatives", "Flavourings"],
     "highlights": ["10 g amino acids per 5 tablets", "Whey protein base", "Full amino acid profile"]},
    {"source": "amino-whey-2400", "slug": "amino-whey-2400", "name": "Amino Whey 2400", "category": "protein-mass", "form": "Tablets",
     "size": "480 tablets", "columns": PER("3 tablets", "9 tablets")},
    {"source": "aminoacid-whey-3600", "slug": "amino-whey-3600", "name": "Amino Whey 3600", "category": "protein-mass", "form": "Tablets",
     "size": "300 tablets", "columns": PER("3 tablets", "9 tablets")},
    {"source": "amino-beef-400-tablete", "slug": "amino-beef", "name": "Amino Beef", "category": "protein-mass", "form": "Tablets",
     "size": "400 tablets", "servings": "100", "columns": PER("4 tablets", "6 tablets")},

    # --- Amino Acids & Recovery -------------------------------------------
    {"source": "glutamine-powder", "slug": "glutamine-powder", "name": "Glutamine Powder", "category": "amino-recovery", "form": "Powder",
     "size": "300 g", "columns": PER("Per serving (4 g)", "Per 3 servings (12 g)", "Per 100 g"),
     "highlights": ["100% L-glutamine", "4 g per serving", "Unflavoured"]},
    {"source": "anabolic-glutamin", "slug": "anabolic-glutamine", "name": "Anabolic Glutamine", "category": "amino-recovery", "form": "Powder",
     "size": "255 g", "columns": PER("Per serving (7.5 g)", "Per 100 g"),
     "flavours": ["Cherry", "Mango"], "image_labels": ["Cherry", "Mango"],
     "body": ["Royal Nutrition Anabolic Glutamine contains 4 g of glutamine from five sources per serving, combined with an amino acid and plant extract matrix that includes BCAA 2:1:1."],
     "highlights": ["4 g glutamine matrix per serving", "1.5 g BCAA 2:1:1 per serving", "2 flavours"]},
    {"source": "bcaa-2-1-1", "slug": "bcaa-2-1-1", "name": "BCAA 2:1:1", "category": "amino-recovery", "form": "Tablets",
     "size": "180 tablets", "columns": PER("5 tablets"),
     "highlights": ["5000 mg BCAA per 5 tablets", "2:1:1 ratio"]},
    {"source": "strong-bcaa", "slug": "strong-bcaa", "name": "Strong BCAA", "category": "amino-recovery", "form": "Powder",
     "size": "300 g", "serving": "2 heaping scoops (10 g)", "columns": PER("Per serving (10 g)", "Per 100 g"),
     "flavours": ["Strawberry", "Orange"],
     "highlights": ["5 g BCAA per serving", "1 g glutamine per serving", "2 flavours"],
     # The source lists "Flavourings" and "Artificial Colour" as absent, yet the ingredients include both flavours and colours.
     "free_from": ["Yeast", "Gluten", "Wheat", "Soya", "Dairy", "Sugar", "Salt", "Preservatives"]},
    {"source": "royal-bcaa-liquid", "slug": "bcaa-liquid", "name": "BCAA Liquid", "category": "amino-recovery", "form": "Liquid",
     "size": "500 ml", "serving": "25 ml", "columns": PER("Per serving (25 ml)", "Per 100 ml"), "flavours": ["Lemon"],
     "highlights": ["5000 mg BCAA per serving", "Enriched with vitamin B6", "Lemon flavour"]},
    {"source": "eaa", "slug": "eaa", "name": "EAA", "category": "amino-recovery", "form": "Powder",
     "size": "250 g", "serving": "2/3 scoop (7 g)", "columns": PER("Per serving (7 g)", "Per 100 g"),
     "flavours": ["Sour Cherry", "Blueberry"], "image_labels": ["Sour Cherry", "Blueberry"],
     "highlights": ["8 essential amino acids", "5000 mg per serving", "2 flavours"]},

    # --- Creatine & Strength ----------------------------------------------
    {"source": "creatine-natur", "slug": "creatine-natur", "name": "Creatine Natur", "category": "creatine-strength", "form": "Powder",
     "size": "300 g", "columns": PER("Per serving (5 g)", "Per 100 g"),
     "highlights": ["100% creatine monohydrate", "5 g per serving", "Unflavoured"]},
    {"source": "anabolic-creatine", "slug": "anabolic-creatine", "name": "Anabolic Creatine 12", "category": "creatine-strength", "form": "Powder",
     "size": "255 g", "columns": PER("Per serving (7.5 g)", "Per 100 g"),
     "flavours": ["Pear", "Cola", "Blue Raspberry"], "image_labels": ["Pear", "Cola", "Blue Raspberry"],
     "body": ["Royal Nutrition Anabolic Creatine 12 is a multi-component formula with 12 types of creatine and an Anabolic Matrix of amino acids and plant extracts. Creatine increases physical performance in successive bursts of short-term, high-intensity exercise; the effect is obtained with a daily intake of 3 g."],
     "highlights": ["12 types of creatine", "5 g creatine matrix per serving", "3 flavours"]},
    {"source": "beta-alanine-1200", "slug": "beta-alanine-1200", "name": "Beta Alanine 1200", "category": "creatine-strength", "form": "Capsules",
     "size": "90 capsules", "columns": PER("2 capsules", "4 capsules"),
     "highlights": ["1200 mg per capsule", "Taken before training"]},
    {"source": "beta-alanine-powder", "slug": "beta-alanine-powder", "name": "Beta Alanine Powder", "category": "creatine-strength", "form": "Powder",
     "size": "300 g", "columns": PER("Per serving (3.5 g)", "Per 100 g"),
     "flavours": ["Melon", "Kiwi Lime"], "image_labels": ["Melon", "Kiwi Lime"],
     "highlights": ["3000 mg per serving", "Taken before training", "2 flavours"]},
    {"source": "hmb-strong", "slug": "hmb-strong", "name": "HMB Strong", "category": "creatine-strength", "form": "Capsules",
     "size": "90 capsules", "columns": PER("2 capsules", "4 capsules"),
     "body": ["Royal Nutrition HMB Strong supplements your diet with a high dose of HMB (beta-hydroxy beta-methylbutyrate), a compound the body makes from the amino acid leucine. Intended for athletes and physically active people."],
     "highlights": ["2200 mg HMB per 2 capsules", "For active people"]},

    # --- Pre-Workout & Pump -----------------------------------------------
    {"source": "weiller", "slug": "weiler", "name": "Weiler", "category": "pre-workout-pump", "form": "Powder",
     "size": "300 g", "serving": "1½ scoops (15 g)", "columns": PER("Per serving (15 g)", "Per 100 g"),
     "flavours": ["Blackberry & Raspberry-Lemonade", "Strawberry Ice Tea"],
     "body": ["Weiler is a pre-workout powder built from four complexes: Pump, Strength & Performance, Superior Energy, and Focus & Cognition. Each 15 g serving contains 200 mg of caffeine."],
     "highlights": ["4 active complexes", "200 mg caffeine per serving", "2 flavours"],
     "ingredients": "Pump Complex: L-Citrulline DL-Malate, L-Arginine Alpha Ketoglutarate 2:1, L-Arginine, Vitamin B3, Black pepper fruit extract (Piper Nigrum, 95% piperine), trisodium citrate, magnesium citrate, potassium chloride. Strength & Performance & Absorption Complex: Beta Alanine, Siberian Ginseng root extract (Eleutherococcus senticosus). Superior Energy Complex: Maltodextrin, L-Tyrosine, Vitamin B12. Focus & Cognition Complex: Anhydrous Caffeine, Taurine, L-Theanine."},
    {"source": "aakg", "slug": "aakg", "name": "AAKG 1200", "category": "pre-workout-pump", "form": "Capsules",
     "size": "120 capsules", "columns": PER("2 capsules"),
     "highlights": ["1200 mg per capsule", "2:1 arginine to AKG ratio"]},
    {"source": "arginine", "slug": "arginine", "name": "Arginine 1250", "category": "pre-workout-pump", "form": "Capsules",
     "size": "120 or 90 capsules", "columns": PER("2 capsules"),
     "highlights": ["1250 mg per capsule", "Pure crystalline L-arginine"]},
    {"source": "citruline-250-g", "slug": "citrulline", "name": "Citrulline", "category": "pre-workout-pump", "form": "Powder",
     "size": "250 g", "columns": PER("Per serving (7 g)", "Per 100 g"),
     "flavours": ["Peach Ice Tea", "Mango"], "image_labels": ["Peach Ice Tea", "Mango"],
     "highlights": ["5000 mg per serving", "Taken before training", "2 flavours"]},
    {"source": "taurine-1200", "slug": "taurine-1200", "name": "Taurine 1200", "category": "pre-workout-pump", "form": "Tablets",
     "size": "90 tablets", "columns": PER("1 tablet", "3 tablets"),
     "highlights": ["1200 mg per tablet", "Take 1 to 3 tablets daily"]},
    {"source": "royal-taurine", "slug": "taurine-powder", "name": "Taurine Powder", "category": "pre-workout-pump", "form": "Powder",
     "size": "250 g", "columns": PER("Per serving (3.5 g)", "Per 100 g"), "flavours": ["Green Apple"],
     "highlights": ["3000 mg per serving", "Green Apple flavour"]},

    # --- Hormone Support --------------------------------------------------
    {"source": "testo-buster", "slug": "testo-booster", "name": "Testo Booster", "category": "hormone-support", "form": "Capsules",
     "size": "90 capsules", "columns": PER("1 capsule", "2 capsules"),
     "body": ["Royal Nutrition Testo Booster is a food supplement based on D-aspartic acid and zinc, combined with cordyceps, avena sativa, maca, fenugreek, gynostemma and black pepper extracts. Zinc contributes to the maintenance of normal testosterone levels in the blood."],
     "highlights": ["8 key ingredients", "700 mg D-aspartic acid per capsule", "With zinc"]},
    {"source": "tribulus", "slug": "tribulus", "name": "Tribulus 1250", "category": "hormone-support", "form": "Capsules",
     "size": "90 capsules", "columns": PER("1 capsule", "2 capsules"),
     "body": ["Royal Nutrition Tribulus is formulated with Tribulus terrestris fruit extract, standardised to 90% saponins."],
     "highlights": ["1250 mg extract per capsule", "90% saponins"]},
    {"source": "d-bol", "slug": "d-bol", "name": "D Bol", "category": "hormone-support", "form": "Capsules",
     "size": "90 capsules", "serving": "2 capsules", "columns": PER("2 capsules"),
     "body": ["Royal Nutrition D Bol is a blend of tribulus, maca, cordyceps and fenugreek extracts with amino acids, magnesium, zinc and vitamin B6, intended for active men. Zinc contributes to the maintenance of normal testosterone levels and to normal protein synthesis. Vitamin B6 contributes to the regulation of hormonal activity."],
     "highlights": ["Tribulus, maca and fenugreek", "With zinc and vitamin B6", "Taken after training"]},
    {"source": "daa", "slug": "daa", "name": "DAA", "category": "hormone-support", "form": "Powder",
     "size": "150 g", "columns": PER("Per serving (3 g)", "Per 100 g"),
     "body": ["Royal Nutrition DAA is a food supplement containing 100% D-aspartic acid, supplied as an unflavoured powder."],
     "highlights": ["100% D-aspartic acid", "3 g per serving", "Unflavoured"]},
    {"source": "zma-gaba", "slug": "zma-gaba", "name": "ZMA & GABA", "category": "hormone-support", "form": "Capsules",
     "size": "90 capsules", "columns": PER("2 capsules"),
     "body": ["Royal Nutrition ZMA & GABA combines magnesium, zinc and vitamin B6 with GABA, piperine and melatonin. Taken before bedtime."],
     "highlights": ["Magnesium, zinc and vitamin B6", "150 mg GABA per serving", "Taken before bedtime"]},
    {"source": "gaba", "slug": "gaba", "name": "GABA 1600", "category": "hormone-support", "form": "Capsules",
     "size": "90 capsules", "columns": PER("2 capsules"),
     "highlights": ["800 mg GABA per capsule", "Take 2 capsules daily"]},

    # --- Weight Management ------------------------------------------------
    {"source": "t5", "slug": "t5-cut", "name": "T5 Cut", "category": "weight-management", "form": "Capsules",
     "size": "90 capsules", "columns": PER("1 capsule", "2 capsules"),
     "body": ["Royal Nutrition T5 Cut combines five active ingredients: green tea extract, garcinia cambogia extract, acetyl L-carnitine, anhydrous caffeine and chromium."],
     "highlights": ["5 active ingredients", "75 mg caffeine per capsule", "Contains chromium"]},
    {"source": "carnitine", "slug": "carnitine-1200", "name": "Carnitine 1200", "category": "weight-management", "form": "Capsules",
     "size": "120 or 90 capsules", "columns": PER("1 capsule", "2 capsules"),
     "body": ["Royal Nutrition Carnitine supplements your diet with L-carnitine, an amino acid derivative involved in transporting long-chain fatty acids across the cell membrane."],
     "highlights": ["1200 mg per capsule", "Morning and pre-training use"]},
    {"source": "royal-carnitine-liquid", "slug": "carnitine-liquid", "name": "Carnitine Liquid", "category": "weight-management", "form": "Liquid",
     "size": "500 ml", "serving": "25 ml", "columns": PER("Per serving (25 ml)", "Per 100 ml"), "flavours": ["Wild Berries"],
     "body": ["Royal Nutrition Carnitine Liquid delivers 2000 mg of L-carnitine in every 25 ml serving, in a Wild Berries flavour."],
     "highlights": ["2000 mg per serving", "20 servings per bottle", "Wild Berries flavour"]},
    {"source": "cla-sofgel", "slug": "cla-softgel", "name": "CLA Softgel 1000", "category": "weight-management", "form": "Capsules",
     "size": "90 softgels", "serving": "3 softgels", "columns": PER("1 softgel", "3 softgels"),
     "body": ["Royal Nutrition CLA supplements your diet with concentrated conjugated linoleic acid, an unsaturated fatty acid that occurs naturally in foods in limited quantities. Intended for athletes and people following a reduced-fat diet."],
     "highlights": ["1000 mg per softgel", "For reduced-fat diets"]},

    # --- Health & Wellness ------------------------------------------------
    {"source": "multivitamin", "slug": "multivitamin", "name": "Multivitamin", "category": "health-wellness", "form": "Capsules",
     "size": "60 capsules",
     "body": ["Royal Nutrition Multivitamin is a once-daily capsule supplying essential vitamins, including B vitamins and vitamins C, E, A and D3. Designed for active people."],
     "highlights": ["One capsule daily", "B vitamins and C, E, A, D3"]},
    {"source": "collagen-2250", "slug": "collagen-2250", "name": "Collagen 2250", "category": "health-wellness", "form": "Tablets",
     "size": "90 tablets", "columns": PER("3 tablets", "6 tablets", "2 tablets"),
     "body": ["Royal Nutrition Collagen tablets are based on hydrolyzed bovine collagen, a protein that provides amino acids. The formula also contains vitamin C, which contributes to normal collagen formation for the normal function of bones, cartilage and skin."],
     "highlights": ["Hydrolyzed bovine collagen", "With vitamin C"]},
    {"source": "liver-protect", "slug": "liver-protect", "name": "Liver Protect", "category": "health-wellness", "form": "Capsules",
     # Pack label reads 60 capsules; the source text says 90 capsules and 45 servings.
     "size": "60 capsules", "servings": None, "columns": PER("2 capsules"),
     "body": ["Royal Nutrition Liver Protect delivers milk thistle and turmeric extracts with choline, N-acetyl L-cysteine and vitamin E. Choline contributes to normal homocysteine metabolism and to the maintenance of normal liver function."],
     "highlights": ["Milk thistle extract", "With choline and turmeric", "Taken with a meal"]},
    {"source": "ala", "slug": "ala-150", "name": "ALA 150", "category": "health-wellness", "form": "Capsules",
     "size": "90 capsules", "columns": PER("1 capsule", "2 capsules"), "image_labels": ["Bottle", "Box"],
     "highlights": ["150 mg alpha-lipoic acid per capsule", "Take 1 to 2 capsules daily"]},
    {"source": "chronium-90-capsules", "merge": ["chromium-picolinate"], "slug": "chromium-picolinate", "name": "Chromium Picolinate", "category": "health-wellness", "form": "Capsules",
     "size": "90 capsules", "columns": PER("1 capsule"), "image_labels": ["Bottle", "Box"],
     "body": ["Royal Nutrition Chromium Picolinate capsules contain chromium as chromium picolinate. Chromium contributes to the maintenance of normal blood glucose levels."],
     "highlights": ["200 µg chromium per capsule", "Essential trace element", "One capsule daily"]},
]


def rows(*items):
    out = []
    for label, *values in items:
        indent = label.startswith("> ")
        out.append({"label": label.lstrip("> "), "indent": indent, "values": list(values)})
    return out


# Tables whose raw HTML merges cells; transcribed by hand from the source table.
MANUAL_TABLES = {
    "strong-bcaa": [{"title": None, "rows": rows(
        ("BCAA 2:1:1", "5000 mg", "50 g"), ("> L-Leucine", "2500 mg", "25 g"), ("> L-Valine", "1250 mg", "12.5 g"),
        ("> L-Isoleucine", "1250 mg", "12.5 g"), ("L-Glutamine", "1000 mg", "10 g"))}],
    "zma-gaba": [{"title": None, "rows": rows(
        ("Magnesium", "450 mg (120%*)"), ("GABA", "150 mg"), ("Zinc", "30 mg (300%*)"), ("Vitamin B6", "10.5 mg (750%*)"),
        ("Piperine", "5 mg"), ("Melatonin", "1 mg"))}],
    "testo-booster": [{"title": None, "rows": rows(
        ("D-Aspartic acid", "700 mg", "1400 mg"), ("Cordyceps mushrooms extract (10% polysaccharides)", "50 mg", "100 mg"),
        ("Avena Sativa 10:1 extract", "50 mg", "100 mg"), ("Maca root 2:1 extract", "50 mg", "100 mg"),
        ("Fenugreek seed extract (10% proteins)", "50 mg", "100 mg"), ("Gynostemma leaf extract (98% gypenosides)", "50 mg", "100 mg"),
        ("Black pepper fruit extract (95% piperine)", "3 mg", "6 mg"), ("Zinc", "5 mg (50% RDA*)", "10 mg (100% RDA*)"))}],
    "weiler": [{"title": None, "rows": rows(
        ("Energy", "201.5 kJ / 47.41 kcal", "1343.3 kJ / 316.0 kcal"), ("Protein as free amino acids", "10.49 g", "69.99 g"),
        ("Carbohydrate", "1.35 g", "9.0 g"), ("> of which sugars", "0.10 g", "0.67 g"), ("Fat", "0 g", "0 g"), ("> of which saturates", "0 g", "0 g"),
        ("Sodium", "0.12 g", "0.8 g"), ("Chloride", "0.082 g (10.24% RNV)", "0.547 g (68.3% RNV)"), ("Magnesium", "0.026 g (7.1% RNV)", "0.179 g (47.7% RNV)"),
        ("Pump Complex", "6830 mg", "45519 mg"), ("Strength & Performance Complex", "3300 mg", "21335 mg"),
        ("Superior Energy Complex", "1926 mg", "12834 mg"), ("Focus & Cognition Complex", "1400 mg", "9332 mg"))}],
    "royal-mass": [
        {"title": None, "rows": rows(
            ("Energy", "1413.4 kJ / 333.2 kcal"), ("Protein", "30 g"), ("Carbohydrates", "48.8 g"), ("> of which sugars", "38.8 g"),
            ("Total Fat", "1.7 g"), ("> of which saturated", "1 g"), ("Fiber", "1.5 g"), ("Sodium", "0.12 g"),
            ("Potassium", "420 mg (21%*)"), ("Phosphorus", "161 mg (23%*)"), ("Calcium", "156 mg (19.5%*)"), ("Magnesium", "295 mg (78.7%*)"), ("Zinc", "8.4 mg (84%*)"),
            ("L-Glutamine", "1800 mg"), ("Creatine monohydrate", "1200 mg"), ("HMB", "1200 mg"), ("L-Citrulline DL-Malate", "1200 mg"),
            ("BCAA mix 4:1:1", "900 mg"), ("> of which L-Leucine", "600 mg"), ("> L-Valine", "150 mg"), ("> L-Isoleucine", "150 mg"),
            ("L-Arginine Kyowa", "500 mg"), ("Taurine", "100 mg"),
            ("Niacin (Vitamin B3)", "6 mg (37.5%*)"), ("Pantothenic acid (Vitamin B5)", "2.4 mg (40%*)"), ("Thiamine (Vitamin B1)", "1 mg (90.9%*)"),
            ("Riboflavin (Vitamin B2)", "1 mg (71.42%*)"), ("Pyridoxine hydrochloride (Vitamin B6)", "1 mg (71.4%*)"))},
        {"title": "Amino acid profile", "rows": rows(
            ("Leucine", "3377 mg"), ("Isoleucine", "1681 mg"), ("Valine", "1635 mg"), ("Aspartic acid", "3071 mg"), ("Glutamic acid", "5150 mg"),
            ("Serine", "1407 mg"), ("Glycine", "602 mg"), ("Histidine", "660 mg"), ("Arginine", "908 mg"), ("Threonine", "1438 mg"), ("Alanine", "1309 mg"),
            ("Proline", "1663 mg"), ("Tyrosine", "1169 mg"), ("Methionine", "727 mg"), ("Cysteine", "790 mg"), ("Phenylalanine", "1154 mg"), ("Lysine", "2745 mg"), ("Tryptophan", "517 mg"))},
    ],
    # The published profile has 20 labels but only 19 values, so rows cannot be aligned safely.
    "amino-beef": [{"title": None, "rows": rows(
        ("Energy", "68 kJ / 16 kcal", "102 kJ / 24 kcal"), ("Protein", "4 g", "6 g"), ("Total amino acids", "4000 mg", "—"))}],
}

DROP_AMINO_PROFILE = {"amino-beef"}
