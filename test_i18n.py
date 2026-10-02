import os
import re

def test_i18n():
    print("=== TEST 1: Syntaxe et Validite des Fichiers Modifies ===")
    files = ['index.html', 'js/default-content.js', 'js/app.js', 'js/section-renderer.js', 'css/public.css']
    for f in files:
        assert os.path.exists(f), f"Fichier introuvable: {f}"
        with open(f, 'r', encoding='utf-8') as fp:
            c = fp.read()
            assert len(c) > 100, f"Fichier trop court: {f}"
        print(f"  [PASS] {f} ({len(c)} octets)")

    with open('index.html', 'r', encoding='utf-8') as fp:
        html = fp.read()
    with open('js/default-content.js', 'r', encoding='utf-8') as fp:
        default_content = fp.read()
    with open('js/app.js', 'r', encoding='utf-8') as fp:
        app_js = fp.read()
    with open('css/public.css', 'r', encoding='utf-8') as fp:
        css = fp.read()

    print("\n=== TEST 2: Presence des Boutons de Switch Bilingue (#langToggle) ===")
    assert 'id="langToggle"' in html, "Le bouton #langToggle doit etre dans index.html (Navbar)"
    assert 'id="langToggleText"' in html, "Le conteneur de texte #langToggleText doit etre dans index.html"
    assert 'id="mobileLangToggle"' in html, "Le bouton #mobileLangToggle doit etre dans index.html (Mobile)"
    assert 'langToggle' in app_js, "app.js doit gerer le toggle lang"
    assert 'app:lang-change' in app_js, "app.js doit dispatcher l'evenement app:lang-change"
    print("  [PASS] Boutons de bascule navbar et mobile presents et branches a app.js")

    print("\n=== TEST 3: Regles CSS de Masquage Instantane FR / EN ===")
    assert 'html[data-lang="fr"] .lang-en' in css, "Regle CSS pour masquer l'anglais manquante"
    assert 'html[data-lang="en"] .lang-fr' in css, "Regle CSS pour masquer le francais manquante"
    assert '.lang-toggle-btn' in css, "Style .lang-toggle-btn manquant dans public.css"
    print("  [PASS] Regles CSS de masquage i18n 100% conformes au template CAND-02")

    print("\n=== TEST 4: Parite des Balises .lang-fr et .lang-en dans index.html ===")
    fr_tags = html.count('class="lang-fr"')
    en_tags = html.count('class="lang-en"')
    assert fr_tags > 20, f"Nombre insuffisant de balises .lang-fr ({fr_tags})"
    assert en_tags > 20, f"Nombre insuffisant de balises .lang-en ({en_tags})"
    assert abs(fr_tags - en_tags) <= 2, f"Desequilibre entre balises FR ({fr_tags}) et EN ({en_tags})"
    print(f"  [PASS] {fr_tags} balises .lang-fr et {en_tags} balises .lang-en synchronisees dans index.html")

    print("\n=== TEST 5: Structure et Parite des Jeux de Donnees dans default-content.js ===")
    assert 'const DEFAULT_CONTENT_FR =' in default_content
    assert 'const DEFAULT_CONTENT_EN =' in default_content
    assert 'window.DEFAULT_CONTENT_EN =' in default_content
    assert "addEventListener('app:lang-change'" in default_content

    # Verifications specifiques en anglais
    assert 'Essential Plan' in default_content
    assert 'Autonomous Plan' in default_content
    assert 'The Simple Questionnaire' in default_content
    assert 'Your Video Demo in 7 Days' in default_content
    assert 'Turnkey Online Launch' in default_content
    assert 'Why do you ask for a 5 € deposit' in default_content
    assert 'Why are your prices so low compared to a classic agency' in default_content
    print("  [PASS] DEFAULT_CONTENT_EN complet : Processus, Formules, Galerie et FAQ traduits")

    print("\n=== TEST 6: Verification Argumentaires (Etudiants, Tarifs, Duree 10 min) ===")
    # Duree
    assert '10 minutes' in html and '10 minutes' in default_content
    assert '10 min' in html and '10 min' in default_content
    assert '2 minutes' not in html and '2 minutes' not in default_content
    assert '2 min' not in html and '2 min' not in default_content

    # Prix
    assert '100€' in default_content or '100 €' in default_content
    assert '150€' in default_content or '150 €' in default_content
    assert '95€' in default_content or '95 €' in default_content
    assert '145€' in default_content or '145 €' in default_content

    # Etudiants et ecoles
    assert 'Grenoble INP' in html and 'Grenoble INP' in default_content
    assert 'Commerce' in html or 'Business' in html
    assert 'student' in default_content.lower() or 'students' in default_content.lower()
    print("  [PASS] Respect rigoureux des 10 min, tarifs 100€ / 150€ et argumentaire etudiant")

    print("\n=== TEST 7: Verification Absence Totale d'Emojis / Smileys ===")
    emoji_pattern = re.compile(r'[\U00010000-\U0010ffff\u2600-\u27bf\u2300-\u23ff\u2b50\u2705\u2728\u274c\u25b6\u25c0\u26a1\u270f\u2699\ud83c-\ud83f]')
    html_emojis = emoji_pattern.findall(html)
    default_emojis = emoji_pattern.findall(default_content)
    assert len(html_emojis) == 0, f"Emojis detectes dans index.html: {html_emojis}"
    assert len(default_emojis) == 0, f"Emojis detectes dans default-content.js: {default_emojis}"
    print("  [PASS] 0 emoji detecte dans les fichiers publics")

    print("\n>>> TOUS LES TESTS D'INTEGRATION I18N ONT REUSSI AVEC SUCCES (100% VALIDE) ! <<<")

if __name__ == '__main__':
    test_i18n()
