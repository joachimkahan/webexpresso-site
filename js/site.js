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

    // Mouvement d'ambiance (fumée des tasses, téléphérique, coches, feuille, soleil, gestes des étapes ; tampon et trait de craie joués une fois) : sans ce script, les dessins sont complets et immobiles.
    var dessins = document.querySelectorAll('.planche-anime, .picto--tasse');
    // Gestes des étapes (clé, calendrier, ticket) : un cycle commun, un seul geste à la fois ; ils jouent ou s'arrêtent tous ensemble.
    var gestes = document.querySelectorAll(':is(.etape, .pas) :is(.picto--cle, .picto--calendrier, .picto--ticket)');
    // Joués une fois (tampon « Recommandée »), quand l'élément est bien entré dans l'écran.
    var unefois = document.querySelectorAll('.tampon');
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

        if (gestes.length) {
            var vus = new Set();
            var observateurGestes = new IntersectionObserver(function (entrees) {
                entrees.forEach(function (entree) {
                    if (entree.isIntersecting) vus.add(entree.target); else vus.delete(entree.target);
                });
                Array.prototype.forEach.call(gestes, function (geste) { geste.classList.toggle('en-vue', vus.size > 0); });
            });
            Array.prototype.forEach.call(gestes, function (geste) { observateurGestes.observe(geste); });
        }

        // Tant que ce drapeau manque (sans script), les mouvements joués une fois ne cachent rien : l'état final est affiché.
        document.documentElement.classList.add('anime-pret');
        if (unefois.length) {
            var observateurUneFois = new IntersectionObserver(function (entrees) {
                entrees.forEach(function (entree) {
                    if (!entree.isIntersecting) return;
                    entree.target.classList.add('en-vue');
                    observateurUneFois.unobserve(entree.target);
                });
            }, { rootMargin: '0px 0px -18% 0px' });
            Array.prototype.forEach.call(unefois, function (element) { observateurUneFois.observe(element); });
        }
    }

    // Le bouton n'apparaît que s'il y a quelque chose à arrêter.
    if (bouton && !reduit && (dessins.length || gestes.length)) {
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
