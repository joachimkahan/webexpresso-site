#!/usr/bin/env python3
"""controler.py : contrôle les pages publiées du site WebExpresso.

Usage (depuis le dossier du site) :
    py -3 -B _source/controler.py                  contrôle courant
    py -3 -B _source/controler.py --mise-en-ligne  en plus, refuse tout emplacement encore « à fournir »

Ce qui est vérifié, page par page :
  - la page publiée est à jour par rapport à `_source/` ;
  - un seul titre de premier niveau, un titre d'onglet et une description de longueur raisonnable ;
  - chaque lien interne mène à un fichier qui existe, et chaque ancre à un identifiant présent ;
  - chaque image existe, porte largeur, hauteur et texte de remplacement ;
  - aucun attribut `style`, aucun script écrit dans la page ;
  - aucun mot que le visiteur ne doit pas lire (voir `_source/LISEZMOI.md`), aucune flèche, aucun tiret long ;
  - les montants en euros sont ceux de la fiche des offres ;
  - la phrase « Vous gardez toujours votre site si vous arrêtez. » est sur chaque page.
Le script ne modifie rien. Il sort avec le code 1 s'il trouve une erreur.
"""
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

sys.dont_write_bytecode = True
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

SOURCE = Path(__file__).resolve().parent
SITE = SOURCE.parent
sys.path.insert(0, str(SOURCE))
import construire  # noqa: E402  (même dossier)

PAGES_LEGALES = {"mentions-legales.html", "confidentialite.html", "conditions.html", "garanties.html", "accessibilite.html"}
PROMESSE = "Vous gardez toujours votre site si vous arrêtez."
LIGNE_500 = "Vous préférez l'espace pro dès le départ, sans abonnement ? Possible, sur demande : 500 €."
# Montants de la fiche des offres (.agents/rules/offres-et-tarifs.md) et leurs calculs : 3 × 30 = 90, 3 × 50 = 150.
MONTANTS = {0, 10, 15, 20, 30, 35, 50, 90, 150, 200, 250, 290, 400, 500}
# Mots que le visiteur ne doit lire nulle part, puis mots réservés à certaines pages.
INTERDITS_PARTOUT = ("template", "socle", "responsive", "déployé", "déployer", "copie figée", "↗", "→", " — ", "✓", "★")
RESERVES = {
    "SAV": set(),                                              # « dépannage », « petits travaux »
    "GitHub": PAGES_LEGALES | {"formules.html"},
    "Stripe": PAGES_LEGALES | {"formules.html"},
    "Netlify": PAGES_LEGALES,
    "Firebase": PAGES_LEGALES,
}
SIGLES_ADMIS = {"SIRET", "SIREN", "RGPD", "CNIL", "LCEN", "RGAA", "WCAG", "HTML", "CNPM", "MÉDIATION", "CONSOMMATION"}
EMOJI = re.compile("[\U0001F300-\U0001FAFF☀-➿]")


class Lecture(HTMLParser):
    """Relève d'une page ce que le contrôle regarde : titres, liens, images, identifiants, texte visible."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.titre = ""
        self.description = ""
        self.h1 = 0
        self.liens: list[str] = []
        self.images: list[dict[str, str | None]] = []
        self.identifiants: set[str] = set()
        self.styles = 0
        self.scripts_ecrits = 0
        self.a_fournir = 0
        self.texte: list[str] = []
        self._pile: list[str] = []

    def handle_starttag(self, balise: str, attributs: list[tuple[str, str | None]]) -> None:
        a = dict(attributs)
        if balise not in ("meta", "link", "img", "br", "input", "source", "path", "circle"):
            self._pile.append(balise)
        if "id" in a and a["id"]:
            self.identifiants.add(a["id"])
        if "style" in a:
            self.styles += 1
        if "data-a-fournir" in a:
            self.a_fournir += 1
        if balise == "h1":
            self.h1 += 1
        elif balise == "meta" and a.get("name") == "description":
            self.description = a.get("content") or ""
        elif balise == "a" and a.get("href"):
            self.liens.append(a["href"])
        elif balise == "img":
            self.images.append(a)
        elif balise == "script" and not a.get("src"):
            self._pile[-1] = "script-ecrit"

    def handle_endtag(self, balise: str) -> None:
        for i in range(len(self._pile) - 1, -1, -1):
            if self._pile[i] in (balise, "script-ecrit" if balise == "script" else balise):
                del self._pile[i:]
                break

    def handle_data(self, donnees: str) -> None:
        if not donnees.strip():
            return
        dans = self._pile[-1] if self._pile else ""
        if dans == "title":
            self.titre += donnees
        elif dans == "script-ecrit":
            self.scripts_ecrits += 1
        elif dans not in ("style", "script"):
            self.texte.append(donnees)


def lire(page: Path) -> Lecture:
    lecture = Lecture()
    lecture.feed(page.read_text(encoding="utf-8"))
    return lecture


def controler_page(nom: str, lectures: dict[str, Lecture]) -> tuple[list[str], list[str]]:
    """Rend (erreurs, remarques) pour une page publiée."""
    l = lectures[nom]
    erreurs: list[str] = []
    remarques: list[str] = []
    texte = " ".join(" ".join(l.texte).split())
    legale = nom in PAGES_LEGALES

    if l.h1 != 1:
        erreurs.append(f"{l.h1} titre(s) de premier niveau au lieu d'un seul")
    if not 10 <= len(l.titre) <= 70:
        erreurs.append(f"titre d'onglet de {len(l.titre)} caractères (10 à 70 attendus)")
    if not 70 <= len(l.description) <= 175:
        erreurs.append(f"description de {len(l.description)} caractères (70 à 175 attendus)")
    if l.styles:
        erreurs.append(f"{l.styles} attribut(s) style écrit(s) dans la page")
    if l.scripts_ecrits:
        erreurs.append("un script est écrit dans la page")

    for lien in dict.fromkeys(l.liens):  # chaque adresse une seule fois
        if re.match(r"(https?:|mailto:|tel:)", lien):
            continue
        chemin, _, ancre = lien.partition("#")
        cible = nom if not chemin else chemin
        fichier = (SITE / cible).resolve()
        if not fichier.is_file():
            erreurs.append(f"lien sans cible : {lien}")
        elif ancre and cible in lectures and ancre not in lectures[cible].identifiants:
            erreurs.append(f"ancre introuvable : {lien}")

    for image in l.images:
        src = image.get("src") or ""
        if not (SITE / src).is_file():
            erreurs.append(f"image introuvable : {src}")
        if not image.get("width") or not image.get("height"):
            erreurs.append(f"image sans largeur ou hauteur : {src}")
        if "alt" not in image:
            erreurs.append(f"image sans texte de remplacement : {src}")

    for mot in INTERDITS_PARTOUT:
        if mot.lower() in texte.lower():
            erreurs.append(f"mot ou signe à ne pas montrer : « {mot.strip()} »")
    for mot, pages_admises in RESERVES.items():
        if re.search(rf"\b{re.escape(mot)}\b", texte) and nom not in pages_admises:
            erreurs.append(f"« {mot} » n'a pas sa place sur cette page")
    if EMOJI.search(texte):
        erreurs.append("un émoji ou un symbole décoratif est présent")
    capitales = {m for m in re.findall(r"\b[A-ZÀ-ÖØ-Þ]{4,}\b", texte)} - SIGLES_ADMIS
    if capitales and not legale:
        erreurs.append("mot(s) tout en capitales : " + ", ".join(sorted(capitales)))

    for brut in re.findall(r"(\d[\d   ]*)\s*€", texte):
        montant = int(re.sub(r"\D", "", brut.split()[-1] if brut.split() else brut) or 0)
        if montant not in MONTANTS:
            erreurs.append(f"montant absent de la fiche des offres : {montant} €")

    if PROMESSE not in texte:
        erreurs.append(f"la phrase « {PROMESSE} » manque")
    if "500" in texte and not legale and LIGNE_500 not in texte.replace(" ", " "):
        erreurs.append("l'offre à 500 € n'est pas citée mot pour mot")
    if l.a_fournir or "Photo à venir" in texte:
        remarques.append("emplacement(s) encore à fournir par l'opérateur (prénoms, photos)")
    return erreurs, remarques


def main() -> int:
    strict = "--mise-en-ligne" in sys.argv
    attendues = construire.construire()
    lectures: dict[str, Lecture] = {}
    total = 0
    for nom, html in attendues.items():
        page = SITE / nom
        if not page.is_file() or page.read_text(encoding="utf-8") != html:
            print(f"ÉCHEC  {nom} : page publiée absente ou plus à jour (relancer _source/construire.py)")
            total += 1
            continue
        lectures[nom] = lire(page)
    for nom in lectures:
        erreurs, remarques = controler_page(nom, lectures)
        if strict:
            erreurs += remarques
            remarques = []
        total += len(erreurs)
        etat = "ÉCHEC" if erreurs else "ok   "
        print(f"{etat}  {nom}" + ("" if erreurs or not remarques else f"  ({remarques[0]})"))
        for e in erreurs:
            print(f"         - {e}")
    print(f"\n{len(lectures)} page(s) contrôlée(s), {total} erreur(s).")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
