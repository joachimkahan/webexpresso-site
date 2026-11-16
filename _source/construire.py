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
Le reste est le contenu de <main>. Trois écritures sont remplacées, dans les pages comme dans le gabarit :
    {{inclure:nom}}   le contenu de `_source/morceaux/nom.html` (dessins, bandeau final...) ;
    {{racine}}        le chemin vers la racine du site (vide pour les pages françaises, `../` pour les pages anglaises) ;
    {{autre}}         l'adresse de la même page dans l'autre langue (l'accueil de l'autre langue si elle n'y existe pas).
Dans le gabarit, {{ajouts}} devient le lien vers `css/ajouts.css` quand il existe des feuilles `_source/ajouts-*.css`
(styles d'un chantier en cours, rassemblés par la construction), et rien sinon.

Version anglaise : les pages de `_source/pages-en/` sont publiées dans `en/`, sous le même nom de fichier que la page
française, avec le gabarit `gabarit-en.html`. Un morceau de `_source/morceaux-en/` remplace celui du même nom.
Dans une page anglaise, un lien vers une autre page s'écrit sans préfixe (`formules.html`) ; `{{racine}}` ne précède
que ce qui est commun aux deux langues (`{{racine}}assets/…`, `{{racine}}questionnaire/en/index.html`).
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
# (code de langue, dossier des pages, gabarit, dossier publié, chemin vers la racine)
LANGUES = (("fr", "pages", "gabarit.html", "", ""), ("en", "pages-en", "gabarit-en.html", "en/", "../"))
LIEN_AJOUTS = '    <link rel="stylesheet" href="{{racine}}css/ajouts.css?v={{version}}">\n'
AVIS = "<!-- Page produite par _source/construire.py : modifier _source/, puis reconstruire. -->\n"


def inclure(texte: str, langue: str = "fr", profondeur: int = 0) -> str:
    """Remplace chaque {{inclure:nom}} par le morceau du même nom (un morceau peut en inclure un autre)."""
    if profondeur > 5:
        raise SystemExit("ERREUR : morceaux inclus en boucle")

    def morceau(m):
        fichier = SOURCE / f"morceaux-{langue}" / f"{m.group(1)}.html"
        if not fichier.exists():
            fichier = SOURCE / "morceaux" / f"{m.group(1)}.html"
        if not fichier.exists():
            raise SystemExit(f"ERREUR : morceau introuvable : {fichier.name}")
        return inclure(fichier.read_text(encoding="utf-8").strip(), langue, profondeur + 1)

    return INCLURE.sub(morceau, texte)


def empreinte(*fichiers: Path) -> str:
    """Empreinte courte des feuilles de style et du script : l'adresse change quand leur contenu change.

    Les fins de ligne sont ramenées à LF : Git peut les réécrire en CRLF sur le disque (changement de branche),
    et l'empreinte ne doit pas changer pour autant."""
    h = hashlib.sha256()
    for f in fichiers:
        h.update(f.read_bytes().replace(b"\r\n", b"\n"))
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
    """Rend les pages à publier : chemin depuis la racine du site (`formules.html`, `en/formules.html`) et contenu."""
    version = empreinte(SITE / "css" / "site.css", SITE / "css" / "fonts.css", SITE / "js" / "site.js", *sorted(SOURCE.glob("ajouts-*.css")))
    noms = {langue: {f.name for f in (SOURCE / dossier).glob("*.html")} for langue, dossier, *_ in LANGUES}
    lien_ajouts = LIEN_AJOUTS if any(SOURCE.glob("ajouts-*.css")) else ""
    pages = {}
    for langue, dossier, nom_gabarit, publie, racine in LANGUES:
        if not noms[langue]:
            continue
        autre_langue = "en" if langue == "fr" else "fr"
        vers_autre = "en/" if langue == "fr" else "../"
        gabarit = inclure((SOURCE / nom_gabarit).read_text(encoding="utf-8"), langue)
        for fichier in sorted((SOURCE / dossier).glob("*.html")):
            meta, contenu = lire_page(fichier)
            titre = meta["titre"] if meta.get("titre-seul") == "oui" else f"{meta['titre']} | WebExpresso"
            autre = vers_autre + (fichier.name if fichier.name in noms[autre_langue] else "index.html")
            html = gabarit.replace("{{ajouts}}", lien_ajouts).replace("{{contenu}}", inclure(contenu, langue))
            html = re.sub(r"\{\{courant:([a-z-]+)\}\}", lambda m: ' aria-current="page"' if m.group(1) == meta.get("menu") else "", html)
            for cle, valeur in (("titre", titre), ("description", meta["description"]), ("classe", meta.get("classe", "")),
                                ("fichier", fichier.name), ("version", version), ("autre", autre), ("racine", racine)):
                html = html.replace("{{" + cle + "}}", valeur)
            reste = re.findall(r"\{\{[^}]+\}\}", html)
            if reste:
                raise SystemExit(f"ERREUR : {dossier}/{fichier.name} : écriture non remplacée : {', '.join(sorted(set(reste)))}")
            pages[publie + fichier.name] = html.replace("<!DOCTYPE html>\n", "<!DOCTYPE html>\n" + AVIS, 1)
    return pages


def ajouts() -> str:
    """Rassemble les feuilles `_source/ajouts-*.css` (styles en cours de travail, une par chantier) en une seule."""
    tete = "/* ajouts.css : produit par _source/construire.py depuis _source/ajouts-*.css. Ne pas modifier à la main. */\n"
    feuilles = sorted(SOURCE.glob("ajouts-*.css"))
    return tete + "\n".join(f"/* {f.name} */\n{f.read_text(encoding='utf-8').strip()}\n" for f in feuilles)


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
    feuille = SITE / "css" / "ajouts.css"
    if any(SOURCE.glob("ajouts-*.css")):
        feuille.write_text(ajouts(), encoding="utf-8", newline="\n")
    elif feuille.exists():
        feuille.unlink()
    for nom, html in pages.items():
        (SITE / nom).parent.mkdir(exist_ok=True)
        (SITE / nom).write_text(html, encoding="utf-8", newline="\n")
    print(f"{len(pages)} pages écrites : " + ", ".join(pages))
    return 0


if __name__ == "__main__":
    sys.exit(main())
