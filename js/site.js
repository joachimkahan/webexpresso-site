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

    // Questions : une question ouverte par un lien direct (questions.html#…) se déplie d'elle-même.
    function ouvrirCible() {
        var cible = location.hash && document.getElementById(location.hash.slice(1));
        if (cible && cible.tagName === 'DETAILS') cible.open = true;
    }
    window.addEventListener('hashchange', ouvrirCible);
    ouvrirCible();
})();
