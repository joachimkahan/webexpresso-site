/**
 * FEATURE-CONFIG.JS — Matrice des Capacités & Spécification des Offres
 * ============================================================
 * [REFERENCE] Ce fichier décrit les fonctionnalités du Template Maître
 * et guide la génération manuelle des offres Essentiel et Autonome.
 *
 * ⚠️ Ne constitue pas une protection de sécurité en soi : pour l'offre
 * Essentiel, les fichiers et blocs incompatibles doivent être supprimés
 * physiquement selon les règles documentées ici.
 * ============================================================
 */

const FEATURE_CONFIG = {

    // ── Définition des Offres ───────────────────────────────────────
    offers: {
        essentiel: {
            name: "Offre Essentiel",
            description: "Site vitrine autonome avec contenu local statique, sans administration ni Firebase.",
            adminEnabled: false,
            firebaseEnabled: false,
            contentSource: "local"
        },
        autonome: {
            name: "Offre Autonome",
            description: "Site vitrine complet avec espace d'administration sécurisé par PIN et stockage Firestore.",
            adminEnabled: true,
            firebaseEnabled: true,
            contentSource: "firestore"
        }
    },

    // ── Matrice Détaillée des Fonctionnalités ───────────────────────
    features: {
        adminDashboard: {
            name: "Tableau de bord d'administration (CRUD)",
            essentiel: false,
            autonome: true,
            associatedFiles: [
                "admin.html",
                "css/admin.css",
                "js/admin.js",
                "js/admin/admin-auth.js",
                "js/admin/admin-dashboard.js"
            ],
            associatedRoutes: ["admin.html", "#admin-login-modal"],
            removalRule: "Supprimer physiquement les fichiers 'admin.html', 'css/admin.css', 'js/admin.js', le dossier 'js/admin/' et les balises [AUTONOME_ONLY] dans index.html et app.js"
        },

        firebaseIntegration: {
            name: "Intégration Firebase Firestore",
            essentiel: false,
            autonome: true,
            associatedFiles: [
                "js/integrations/firebase/firebase-client.js",
                "js/integrations/firebase/content-repository.js"
            ],
            sdkDependencies: [
                "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js",
                "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"
            ],
            removalRule: "Supprimer physiquement le dossier 'js/integrations/firebase/' et les balises CDN Firebase dans index.html"
        },

        authentication: {
            name: "Authentification PIN Administrateur",
            essentiel: false,
            autonome: true,
            mechanism: "Code PIN 8 chiffres (localStorage / sessionStorage)",
            removalRule: "Supprimer la modale de connexion PIN et les méthodes admin dans routes.js"
        },

        dynamicContent: {
            name: "Contenu dynamique administrable",
            essentiel: false,
            autonome: true,
            provider: "DataStore (Firestore)",
            fallbackProvider: "DEFAULT_CONTENT"
        },

        localContent: {
            name: "Contenu statique local",
            essentiel: true,
            autonome: true,
            provider: "DEFAULT_CONTENT (default-content.js)"
        },

        contactForm: {
            name: "Formulaire de contact AJAX / FormSubmit",
            essentiel: true,
            autonome: true,
            service: "FormSubmit.co"
        },

        testimonials: {
            name: "Avis Clients & Témoignages (5 étoiles)",
            essentiel: true,
            autonome: true
        },

        faq: {
            name: "Foire Aux Questions (Accordéon)",
            essentiel: true,
            autonome: true
        },

        process: {
            name: "Processus & Méthode en étapes",
            essentiel: true,
            autonome: true
        },

        practicalInfo: {
            name: "Informations Pratiques, Horaires & Zone",
            essentiel: true,
            autonome: true
        },

        partners: {
            name: "Logos Partenaires & Références Clients",
            essentiel: true,
            autonome: true
        },

        quickContactFab: {
            name: "Bouton d'action rapide / Appel Mobile / WhatsApp",
            essentiel: true,
            autonome: true
        },

        timeline: {
            name: "Parcours Chronologique & Savoir-Faire (CAND-04)",
            essentiel: true,
            autonome: true
        },

        i18n: {
            name: "Support Bilingue FR/EN (CAND-02)",
            essentiel: true,
            autonome: true
        },

        glowSlider: {
            name: "Comparateur Avant / Après interactif",
            essentiel: true,
            autonome: true
        },

        editorialTabs: {
            name: "Galerie par onglets thématiques / Looks",
            essentiel: true,
            autonome: true
        },

        customCursor: {
            name: "Curseur personnalisé pour desktop",
            essentiel: false,
            autonome: false
        },

        pageVoile: {
            name: "Transition de page fluide",
            essentiel: true,
            autonome: true
        }
    },

    isFeatureEnabled: function (featureName) {
        if (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.sections && SITE_CONFIG.sections.active) {
            if (SITE_CONFIG.sections.active[featureName] !== undefined) {
                return !!SITE_CONFIG.sections.active[featureName];
            }
        }
        return true;
    }

};

// Export global pour le navigateur
if (typeof window !== 'undefined') {
    window.FEATURE_CONFIG = FEATURE_CONFIG;
}

