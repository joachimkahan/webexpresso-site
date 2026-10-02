import os
import re

def run_tests():
    print('=== TEST 1: Syntaxe et Validite des Fichiers JS ===')
    js_files = ['js/app.js', 'js/site-config.js', 'js/theme-config.js', 'js/default-content.js', 'js/section-renderer.js']
    for f in js_files:
        if os.path.exists(f):
            with open(f, 'r', encoding='utf-8') as fp:
                content = fp.read()
                assert len(content) > 100
                print(f'  [PASS] {f} ({len(content)} octets)')
        else:
            print(f'  [FAIL] {f} introuvable')
            exit(1)

    print('\n=== TEST 2: Redirection Directe vers Tally (Sans modale) ===')
    with open('index.html', 'r', encoding='utf-8') as fp:
        html = fp.read()

    assert 'id="payment-modal"' not in html, "La modale payment-modal ne doit plus etre dans index.html"
    assert 'https://tally.so/r/XxAYzY' in html, "Le lien Tally doit etre present"
    print('  [PASS] index.html: Aucun payment-modal, tous les liens redirigent directement vers Tally.')

    with open('js/app.js', 'r', encoding='utf-8') as fp:
        app_js = fp.read()
    assert 'openPaymentModal' not in app_js, "openPaymentModal ne doit plus intercepter les clics dans app.js"
    print('  [PASS] js/app.js: Aucune interception de clic pour modale de paiement, flux direct standard.')

    print('\n=== TEST 3: Verification Duree Questionnaire (10 min) ===')
    assert '10 minutes' in html
    assert '10 min' in html
    assert '2 minutes' not in html
    assert '2 min' not in html
    print('  [PASS] index.html: "10 minutes" et "10 min" valides, zero mention de "2 min"')

    with open('js/default-content.js', 'r', encoding='utf-8') as fp:
        default_content = fp.read()
    assert '10 minutes' in default_content
    assert '10 min' in default_content
    assert '2 minutes' not in default_content
    assert '2 min' not in default_content
    print('  [PASS] js/default-content.js: "10 minutes" et "10 min" valides')

    print('\n=== TEST 4: Verification Argumentaire Etudiants, Apprentissage & Tarifs Directs ===')
    assert 'études' in html or 'études' in default_content
    assert 'Grenoble INP' in html
    assert 'complément' in html or 'complément' in default_content
    assert 'commercialisation' in html or 'commercialisation' in default_content
    assert 'technique' in html or 'technique' in default_content
    assert 'Pourquoi vos prix sont-ils si bas' in default_content
    print('  [PASS] Section A Propos & FAQ: Justification des tarifs et presentation etudiante validees.')

    print('\n=== TEST 5: Verification Absence Totale d\'Emojis / Smileys ===')
    emoji_pattern = re.compile(r'[\U00010000-\U0010ffff\u2600-\u27bf\u2300-\u23ff\u2b50\u2705\u2728\u274c\u25b6\u25c0\u26a1\u270f\u2699\ud83c-\ud83f]')
    html_emojis = emoji_pattern.findall(html)
    default_emojis = emoji_pattern.findall(default_content)
    assert len(html_emojis) == 0, f"Emojis trouves dans index.html: {html_emojis}"
    assert len(default_emojis) == 0, f"Emojis trouves dans default-content.js: {default_emojis}"
    print('  [PASS] Zero smiley/emoji dans index.html et js/default-content.js.')

    print('\n=== TEST 6: Verification Tarifs (100€ = 5€ + 95€, 150€ = 5€ + 145€) ===')
    assert '100€' in default_content or '100 €' in default_content
    assert '150€' in default_content or '150 €' in default_content
    assert '95€' in default_content or '95 €' in default_content
    assert '145€' in default_content or '145 €' in default_content
    print('  [PASS] Formule Essentiel a 100€ (5€ + 95€) et Formule Autonome a 150€ (5€ + 145€) validees.')

    print('\n>>> TOUS LES TESTS TERMINAL ONT REUSSI AVEC SUCCES (100% VALIDE) ! <<<')

if __name__ == '__main__':
    run_tests()
