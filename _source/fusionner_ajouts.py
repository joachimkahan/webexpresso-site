#!/usr/bin/env python3
"""fusionner_ajouts.py : verse les feuilles `_source/ajouts-*.css` dans `css/site.css`, puis les supprime.

Usage (depuis le dossier du site) :
    py -3 -B _source/fusionner_ajouts.py

Une feuille d'ajouts porte les styles d'un chantier en cours (voir `_source/LISEZMOI.md`). Quand le chantier est relu
et accepté, ses règles rejoignent la section « Décor des pages, passages entre sections, survols » de `css/site.css`,
juste avant la section « Impression », dans l'ordre alphabétique des fichiers : c'est l'ordre dans lequel la
construction les rassemblait déjà, donc la cascade ne change pas. Relancer ensuite `_source/construire.py`, qui retire
de lui-même la feuille d'appoint `css/ajouts.css` et son lien.
"""
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

SOURCE = Path(__file__).resolve().parent
FEUILLE = SOURCE.parent / "css" / "site.css"
REPERE = re.compile(r"/\* ─+ \d+\. Impression ─+ \*/")


def main() -> int:
    ajouts = sorted(SOURCE.glob("ajouts-*.css"))
    if not ajouts:
        print("Aucune feuille d'ajouts à fusionner.")
        return 0
    texte = FEUILLE.read_text(encoding="utf-8")
    reperes = REPERE.findall(texte)
    if len(reperes) != 1:
        print(f"ERREUR : repère de la section « Impression » introuvable ou en double ({len(reperes)}).")
        return 1
    bloc = "".join(f"/* ── {f.stem.removeprefix('ajouts-')} ── */\n{f.read_text(encoding='utf-8').strip()}\n\n" for f in ajouts)
    FEUILLE.write_text(texte.replace(reperes[0], bloc + reperes[0]), encoding="utf-8", newline="\n")
    for f in ajouts:
        f.unlink()
    print("Fusionné dans css/site.css : " + ", ".join(f.name for f in ajouts) + ". Relancer _source/construire.py.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
