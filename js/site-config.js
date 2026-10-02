/**
 * SITE-CONFIG.JS — Réglages Structurels & Généraux (WebExpresso Vitrine)
 * ============================================================
 * Version Template : 2.5.1
 * Thème : Bleu de Travail & Cuir Ambré — Option B
 * ============================================================
 */

const SITE_CONFIG = {
    projectId: "webexpresso-vitrine",
    offer: "essential",
    siteName: "WebExpresso",
    siteTagline: "Obtenez la démo de votre site en moins d'une semaine",
    templateVersion: "2.5.1",
    language: "fr",
    locale: "fr-FR",

    // ── Support Bilingue i18n ──
    i18n: {
        enabled: true,
        defaultLang: "fr",
        languages: ["fr", "en"]
    },

    // ── Pilotage Dynamique des Sections ──
    sections: {
        order: [
            'hero',
            'ticker',
            'process',
            'prestations',
            'gallery',
            'about',
            'banner',
            'faq',
            'contact'
        ],
        active: {
            hero: true,
            ticker: true,
            process: true,
            prestations: true,
            gallery: true,
            about: true,
            banner: true,
            faq: true,
            contact: true,
            looks: false,
            beforeAfter: false,
            testimonials: false,
            partners: false,
            practicalInfo: false,
            timeline: false
        }
    },

    // ── Variantes Métiers des Composants ──
    variants: {
        hero: "cinematic-full",
        gallery: "browser-mockup",
        prestations: "pricing-cards",
        testimonials: "cards-grid",
        partners: "logo-cloud"
    },

    // ── Actions & Boutons Principaux ──
    actions: {
        primaryCta: {
            label: "Obtenir ma démo pour 5€",
            href: "https://tally.so/r/XxAYzY"
        },
        phoneButton: {
            enabled: false,
            number: ""
        },
        whatsappButton: {
            enabled: false,
            number: "",
            message: "Bonjour, je souhaite des informations sur WebExpresso."
        },
        externalBooking: {
            enabled: true,
            url: "https://tally.so/r/XxAYzY"
        }
    },

    // ── Effets Visuels ──
    effects: {
        pageVoile: false,
        customCursor: false,
        scrollReveal: true
    },

    // ── Formulaire de Contact / Tunnel Tally ──
    contactForm: {
        email: "contact@webexpresso.fr",
        redirectUrl: "https://tally.so/r/XxAYzY",
        fields: ["name", "email", "service", "message"],
        services: [
            { value: "demo-5e", label: "Démo Personnalisée (5€ d'acompte)" },
            { value: "offre-essentiel", label: "Formule Essentiel (100€ — solde de 95€)" },
            { value: "offre-autonome", label: "Formule Autonome (150€ — solde de 145€)" }
        ]
    },

    // ── Conformité Légale & RGPD (LCEN, RGPD, CNIL, RGAA) ────────
    legal: {
        companyName: "WebExpresso",
        legalForm: "Collectif d'étudiants entrepreneurs (Grenoble INP & École de commerce)",
        capital: null,
        headquarters: "Grenoble, Isère (38000), France",
        rcsOrRm: "RCS Grenoble en cours d'attribution",
        siret: "SIRET en cours d'attribution",
        vatNumber: "TVA non applicable, art. 293 B du CGI",
        publishingDirector: "L'Équipe WebExpresso",
        contactEmail: "contact@webexpresso.fr",
        contactPhone: "Via formulaire en ligne ou email",
        dpoEmail: "contact@webexpresso.fr",
        host: {
            name: "Netlify Inc. / Datacenter sécurisé en Europe",
            address: "510 20th Street, Suite 500, San Francisco, CA 94107, USA (Certifié ISO 27001)",
            phone: "+1 844-463-8543",
            website: "https://www.netlify.com"
        },
        mediator: {
            name: "CNPM MÉDIATION CONSOMMATION",
            website: "https://www.cnpm-mediation-consommation.eu",
            address: "27 avenue de la Libération, 42400 Saint-Chamond"
        },
        cookies: {
            enabled: true,
            bannerVersion: "2026.1"
        },
        accessibility: {
            status: "partiellement_conforme"
        }
    },

    copyrightYear: 2026,
    copyrightName: "WebExpresso"
};


if (typeof window !== 'undefined') {
    window.SITE_CONFIG = SITE_CONFIG;
}
