"""Télécharge une fois les polices du site vitrine et écrit css/fonts.css (hébergement local, aucune requête à un tiers à la visite)."""
import hashlib, re, sys, urllib.request
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
SITE = Path(sys.argv[1])
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
FAMILLES = [
    ("Besley", "https://fonts.googleapis.com/css2?family=Besley:ital,wght@0,400..900;1,400..900&display=swap"),
    ("Andika", "https://fonts.googleapis.com/css2?family=Andika:ital,wght@0,400;0,700;1,400&display=swap"),
    ("Kalam", "https://fonts.googleapis.com/css2?family=Kalam:wght@400&display=swap"),
]
def lire(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30).read()
(SITE / "fonts").mkdir(exist_ok=True)
faces = []
for famille, url in FAMILLES:
    css = lire(url).decode("utf-8")
    slug = re.sub(r"[^a-z0-9]+", "-", famille.lower()).strip("-")
    for sous, corps in re.findall(r"/\*\s*([\w-]+)\s*\*/\s*@font-face\s*\{(.*?)\}", css, re.S):
        if sous not in ("latin", "latin-ext"):
            continue
        style = re.search(r"font-style:\s*(\w+)", corps).group(1)
        graisse = re.search(r"font-weight:\s*([\d ]+)", corps).group(1).strip()
        src = re.search(r"url\((https://[^)]+)\)", corps).group(1)
        plage = re.search(r"unicode-range:\s*([^;]+);", corps).group(1).strip()
        nom = f"{slug}-{style}-{graisse.replace(" ", "-")}-{sous}-{hashlib.sha256(src.encode()).hexdigest()[:8]}.woff2"
        cible = SITE / "fonts" / nom
        if not cible.exists():
            cible.write_bytes(lire(src))
        faces.append(f"/* {famille} {style} {graisse}, {sous} */\n@font-face {{\n    font-family: '{famille}';\n    font-style: {style};\n"
                     f"    font-weight: {graisse};\n    font-display: swap;\n    src: url('../fonts/{nom}') format('woff2');\n    unicode-range: {plage};\n}}")
        print(f"{nom:70s} {cible.stat().st_size//1024:4d} Ko  {style} {graisse}")
entete = "/* fonts.css : polices du site WebExpresso, hébergées avec le site (aucune requête à un tiers).\n   Besley, Andika et Kalam : licence SIL Open Font. */\n\n"
(SITE / "css" / "fonts.css").write_text(entete + "\n\n".join(faces) + "\n", encoding="utf-8")
