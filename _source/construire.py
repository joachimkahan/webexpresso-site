#!/usr/bin/env python3
"""construire.py : assemble les pages du site WebExpresso.

Usage (depuis le dossier du site) :
    py -3 -B _source/construire.py            écrit les pages à la racine du site
    py -3 -B _source/construire.py --verifier  n'écrit rien ; échoue si une page publiée n'est plus à jour

Chaque page de `_source/pages/` commence par un commentaire d'en-tête :
    <!--
    titre: Formules et prix
    description: Une phrase pour les moteurs de recherche.
    menu: formules          (entrée du menu à marquer comme page courante ; facultatif)
    classe: page-formules   (classe posée sur <body> ; facultatif)
    -->
Le reste est le contenu de <main>. Deux écritures sont remplacées, dans les pages comme dans le gabarit :
    {{inclure:nom}}   le contenu de `_source/morceaux/nom.html` (dessins, bandeau final...) ;
    {{racine}}        le chemin vers la racine du site (vide pour les pages françaises).
Les pages publiées ne se retouchent jamais à la main : on modifie `_source/`, puis on reconstruit.
"""
import hashlib
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

SOURCE = Path(__file__).resolve().parent
SITE = SOURCE.parent
EN_TETE = re.compile(r"\A\s*<!--(.*?)-->", re.S)
INCLURE = re.compile(r"\{\{inclure:([a-z0-9-]+)\}\}")
AVIS = "<!-- Page produite par _source/construire.py : modifier _source/, puis reconstruire. -->\n"


def inclure(texte: str, profondeur: int = 0) -> str:
    """Remplace chaque {{inclure:nom}} par le morceau du même nom (un morceau peut en inclure un autre)."""
    if profondeur > 5:
        raise SystemExit("ERREUR : morceaux inclus en boucle")

    def morceau(m):
        fichier = SOURCE / "morceaux" / f"{m.group(1)}.html"
        if not fichier.exists():
            raise SystemExit(f"ERREUR : morceau introuvable : {fichier.name}")
        return inclure(fichier.read_text(encoding="utf-8").strip(), profondeur + 1)

    return INCLURE.sub(morceau, texte)


def empreinte(*fichiers: Path) -> str:
    """Empreinte courte des feuilles de style et du script : l'adresse change quand leur contenu change."""
    h = hashlib.sha256()
    for f in fichiers:
        h.update(f.read_bytes())
    return h.hexdigest()[:8]


def lire_page(fichier: Path) -> tuple[dict, str]:
    texte = fichier.read_text(encoding="utf-8")
    m = EN_TETE.match(texte)
    if not m:
        raise SystemExit(f"ERREUR : {fichier.name} n'a pas de commentaire d'en-tête (titre, description)")
    meta = {}
    for ligne in m.group(1).strip().splitlines():
        if ":" in ligne:
            cle, valeur = ligne.split(":", 1)
            meta[cle.strip()] = valeur.strip()
    for cle in ("titre", "description"):
        if not meta.get(cle):
            raise SystemExit(f"ERREUR : {fichier.name} : « {cle} » manque dans l'en-tête")
    return meta, texte[m.end():].strip()


def construire() -> dict[str, str]:
    gabarit = inclure((SOURCE / "gabarit.html").read_text(encoding="utf-8"))
    version = empreinte(SITE / "css" / "site.css", SITE / "css" / "fonts.css", SITE / "js" / "site.js")
    pages = {}
    for fichier in sorted((SOURCE / "pages").glob("*.html")):
        meta, contenu = lire_page(fichier)
        titre = meta["titre"] if meta.get("titre-seul") == "oui" else f"{meta['titre']} | WebExpresso"
        html = gabarit.replace("{{contenu}}", inclure(contenu))
        html = re.sub(r"\{\{courant:([a-z-]+)\}\}", lambda m: ' aria-current="page"' if m.group(1) == meta.get("menu") else "", html)
        for cle, valeur in (("titre", titre), ("description", meta["description"]), ("classe", meta.get("classe", "")),
                            ("fichier", fichier.name), ("version", version), ("racine", "")):
            html = html.replace("{{" + cle + "}}", valeur)
        reste = re.findall(r"\{\{[^}]+\}\}", html)
        if reste:
            raise SystemExit(f"ERREUR : {fichier.name} : écriture non remplacée : {', '.join(sorted(set(reste)))}")
        pages[fichier.name] = html.replace("<!DOCTYPE html>\n", "<!DOCTYPE html>\n" + AVIS, 1)
    return pages


def main() -> int:
    pages = construire()
    if "--verifier" in sys.argv:
        perimees = [nom for nom, html in pages.items()
                    if not (SITE / nom).exists() or (SITE / nom).read_text(encoding="utf-8") != html]
        if perimees:
            print("Pages à reconstruire : " + ", ".join(perimees))
            return 1
        print(f"{len(pages)} pages à jour.")
        return 0
    for nom, html in pages.items():
        (SITE / nom).write_text(html, encoding="utf-8", newline="\n")
    print(f"{len(pages)} pages écrites : " + ", ".join(pages))
    return 0


if __name__ == "__main__":
    sys.exit(main())
