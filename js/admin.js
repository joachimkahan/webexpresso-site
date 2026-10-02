/**
 * ADMIN.JS — Point d'Entrée du Module d'Administration
 * ============================================================
 * [PROTECTED / AUTONOME_ONLY] Chef d'orchestre de l'espace Pro.
 *
 * Rôle :
 * - Initialiser le module d'authentification par mot de passe (AdminAuth)
 * - Initialiser le contrôleur de gestion des contenus (AdminDashboard)
 * - Connecter le cycle de vie de la session au chargement des données
 *
 * ⚠️ Supprimé physiquement dans l'offre Essentiel.
 * ============================================================
 */

(function () {
    'use strict';

    function initAdmin() {
        if (typeof AdminAuth === 'undefined' || typeof AdminDashboard === 'undefined') {
            console.error('[Admin] Erreur critique : Sous-modules Admin non chargés.');
            return;
        }

        // Initialiser le dashboard CRUD
        AdminDashboard.init();

        // Initialiser l'authentification et connecter le chargement des collections
        AdminAuth.init({
            onLoginSuccess: () => {
                AdminDashboard.loadAll();
            },
            onLogout: () => {
                console.log('[Admin] Déconnexion effectuée.');
            }
        });

        console.log('[Admin] Module d\'administration prêt et connecté.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdmin);
    } else {
        initAdmin();
    }
})();
