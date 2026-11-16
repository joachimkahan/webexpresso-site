// site.js : petits gestes du site WebExpresso. Le site fonctionne en entier sans ce script.
(function () {
    'use strict';

    // Menu du téléphone : il se referme à la touche Échap et quand on touche en dehors.
    var menu = document.querySelector('.menu-mobile');
    if (menu) {
        document.addEventListener('keydown', function (evenement) {
            if (evenement.key === 'Escape' && menu.open) {
                menu.open = false;
                menu.querySelector('summary').focus();
            }
        });
        document.addEventListener('click', function (evenement) {
            if (menu.open && !menu.contains(evenement.target)) menu.open = false;
        });
    }

    // iPhone : un écouteur de toucher (passif) suffit à faire jouer l'enfoncement des boutons (:active).
    document.addEventListener('touchstart', function () {}, { passive: true });

    // Mouvement d'ambiance (fumée des tasses, téléphérique, coches, feuille) : sans ce script, les dessins sont complets et immobiles.
    var dessins = document.querySelectorAll('.planche-anime, .picto--tasse');
    var bouton = document.querySelector('[data-ambiance]');
    var CLE = 'wx-animations-arretees';
    var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function lireChoix() {
        try { return window.localStorage.getItem(CLE) === '1'; } catch (e) { return false; }
    }
    function ecrireChoix(arretees) {
        try {
            if (arretees) window.localStorage.setItem(CLE, '1');
            else window.localStorage.removeItem(CLE);
        } catch (e) { /* stockage indisponible : le choix ne sera pas gardé */ }
    }
    function appliquer(arretees) {
        document.documentElement.classList.toggle('ambiance-coupee', arretees);
        if (bouton) {
            bouton.setAttribute('aria-pressed', arretees ? 'true' : 'false');
            bouton.textContent = bouton.getAttribute(arretees ? 'data-relancer' : 'data-arreter');
        }
    }

    appliquer(lireChoix());   // le choix gardé s'applique dès le chargement, avant que le moindre dessin ne soit lancé

    // Un dessin ne bouge que lorsqu'il est à l'écran : la classe en-vue lève la pause posée par la feuille de style.
    if (!reduit && dessins.length && 'IntersectionObserver' in window) {
        var observateur = new IntersectionObserver(function (entrees) {
            entrees.forEach(function (entree) { entree.target.classList.toggle('en-vue', entree.isIntersecting); });
        });
        Array.prototype.forEach.call(dessins, function (dessin) { observateur.observe(dessin); });
    }

    // Le bouton n'apparaît que s'il y a quelque chose à arrêter.
    if (bouton && !reduit && dessins.length) {
        bouton.hidden = false;
        bouton.addEventListener('click', function () {
            var arretees = !document.documentElement.classList.contains('ambiance-coupee');
            appliquer(arretees);
            ecrireChoix(arretees);
        });
    }

    // Questions : une question ouverte par un lien direct (questions.html#…) se déplie d'elle-même.
    function ouvrirCible() {
        var cible = location.hash && document.getElementById(location.hash.slice(1));
        if (cible && cible.tagName === 'DETAILS') cible.open = true;
    }
    window.addEventListener('hashchange', ouvrirCible);
    ouvrirCible();
})();
