/**
 * ROUTES.JS — Gestionnaire centralisé des Routes & Navigation
 * ============================================================
 * [PROTECTED] Sépare le routage public du routage administratif.
 *
 * Rôle :
 * - Gérer les ancres publiques et la navigation fluide
 * - Isoler les routes d'administration [AUTONOME_ONLY]
 * ============================================================
 */

(function () {
    'use strict';

    window.AppRoutes = {
        /**
         * Définition des routes et ancres publiques
         */
        publicRoutes: [
            { id: 'accueil',         anchor: '#accueil',         label: 'Accueil',          sectionKey: 'hero' },
            { id: 'apropos',         anchor: '#apropos',         label: 'À propos',         sectionKey: 'about' },
            { id: 'methode',         anchor: '#methode',         label: 'Méthode',          sectionKey: 'process' },
            { id: 'looks',           anchor: '#looks',           label: 'Portfolio',        sectionKey: 'looks' },
            { id: 'prestations',     anchor: '#prestations',     label: 'Prestations',      sectionKey: 'prestations' },
            { id: 'temoignages',     anchor: '#temoignages',     label: 'Avis',             sectionKey: 'testimonials' },
            { id: 'faq',             anchor: '#faq',             label: 'FAQ',              sectionKey: 'faq' },
            { id: 'infos-pratiques', anchor: '#infos-pratiques', label: 'Infos Pratiques',  sectionKey: 'practicalInfo' },
            { id: 'contact',         anchor: '#contact',         label: 'Contact',          sectionKey: 'contact' }
        ],

        /**
         * Défilement fluide vers une ancre publique
         * @param {string} anchor (ex: '#contact')
         */
        navigateToAnchor: function (anchor) {
            if (!anchor || !anchor.startsWith('#')) return;
            const targetEl = document.querySelector(anchor);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
                // Met à jour l'URL sans recharger
                if (history.pushState) {
                    history.pushState(null, null, anchor);
                }
            }
        },

        // ─────────────────────────────────────────────────────────
        // [AUTONOME_ONLY_START]
        // ─────────────────────────────────────────────────────────
        /**
         * Définition des routes administratives
         */
        adminRoutes: {
            dashboard: 'admin.html',
            modalAuth: '#admin-login-modal'
        },

        /**
         * Vérifie si l'administrateur est authentifié dans la session
         * @returns {boolean}
         */
        isAdminAuthenticated: function () {
            return sessionStorage.getItem('isAdminAuthenticated') === 'true';
        },

        /**
         * Récupère le mot de passe attendu depuis la configuration ou le stockage
         * @returns {string}
         */
        getExpectedAdminPin: function () {
            if (typeof SITE_CONFIG !== 'undefined') {
                const storageKey = SITE_CONFIG.adminPasswordStorageKey || SITE_CONFIG.adminPinStorageKey || 'admin_password_v1';
                const customPass = localStorage.getItem(storageKey);
                if (customPass && customPass.trim().length > 0) return customPass.trim();
                if (SITE_CONFIG.adminPasswordDefault) return SITE_CONFIG.adminPasswordDefault;
                if (SITE_CONFIG.adminPinDefault) return SITE_CONFIG.adminPinDefault;
            }
            return 'Admin@2026!';
        },

        /**
         * Tente l'authentification avec un mot de passe
         * Accepte le mot de passe actif (personnalisé) ou le secours technique ("Admin@2026!")
         * @param {string} enteredPassword
         * @returns {boolean}
         */
        authenticateAdmin: function (enteredPassword) {
            const expected = this.getExpectedAdminPin();
            const cleanEntered = (enteredPassword || '').trim();
            if (cleanEntered === expected || cleanEntered === 'Admin@2026!') {
                sessionStorage.setItem('isAdminAuthenticated', 'true');
                return true;
            }
            return false;
        },

        /**
         * Déconnecte l'administrateur
         */
        logoutAdmin: function () {
            sessionStorage.removeItem('isAdminAuthenticated');
            window.location.href = 'index.html';
        },

        /**
         * Bascule afficher/masquer pour le modal public
         */
        toggleModalPassword: function () {
            const input = document.getElementById('client-admin-password');
            const btn = document.getElementById('client-toggle-password');
            if (!input) return;
            if (input.type === 'password') {
                input.type = 'text';
                if (btn) btn.textContent = '🙈';
            } else {
                input.type = 'password';
                if (btn) btn.textContent = '👁️';
            }
        },

        /**
         * Traite la soumission du modal public
         */
        handleModalSubmit: function (event) {
            if (event) event.preventDefault();
            const input = document.getElementById('client-admin-password');
            const entered = input ? input.value.trim() : '';

            if (this.authenticateAdmin(entered)) {
                window.location.href = 'admin.html';
            } else {
                const form = document.getElementById('client-admin-login-form');
                if (form) {
                    form.animate([
                        { transform: 'translateX(0)' },
                        { transform: 'translateX(-6px)' },
                        { transform: 'translateX(6px)' },
                        { transform: 'translateX(-4px)' },
                        { transform: 'translateX(4px)' },
                        { transform: 'translateX(0)' }
                    ], { duration: 400, easing: 'ease-in-out' });
                }
                alert('Mot de passe incorrect.');
                if (input) {
                    input.value = '';
                    input.focus();
                }
            }
        }
        // [AUTONOME_ONLY_END]
    };

    console.log('[AppRoutes] Gestionnaire de routes initialisé.');
})();
