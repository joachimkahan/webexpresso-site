/**
 * CONTENT-ADAPTER.JS — Adaptateur Universel & Normalisateur de Contenu
 * ============================================================
 * [PROTECTED] Interface d'accès et de normalisation des données.
 *
 * Rôle :
 * - Normaliser les données quelle que soit leur source (local, Firebase, ou fallback)
 * - Garantir la conformité stricte au modèle de données universel
 * - Effectuer des transformations non-mutatives (immutabilité)
 * - Fournir des valeurs de repli sûres pour tout champ absent
 *
 * ⚠️ Aucune dépendance directe Firebase ni JSX.
 * ============================================================
 */

(function () {
    'use strict';

    // Image placeholder neutre de haute qualité (Unsplash)
    const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';

    // ─────────────────────────────────────────────────────────────
    // FONCTIONS DE NORMALISATION NON-MUTATIVES (PUR HELPERS)
    // ─────────────────────────────────────────────────────────────

    /**
     * Nettoie et sécurise une chaîne de caractères
     */
    function safeString(val, fallback = '') {
        if (typeof val === 'string') return val.trim();
        if (typeof val === 'number') return String(val);
        return fallback;
    }

    /**
     * Normalise un élément de la galerie
     */
    function normalizeGalleryItem(rawItem, index) {
        if (!rawItem || typeof rawItem !== 'object') return null;
        const item = (window.ContentSchema && typeof window.ContentSchema.migrate === 'function')
            ? window.ContentSchema.migrate('galleryItem', rawItem)
            : rawItem;

        const rawUrl = safeString(item.url, PLACEHOLDER_IMG);
        const isVideo = (item.type === 'video') ||
            rawUrl.includes('youtube.com') ||
            rawUrl.includes('youtu.be') ||
            rawUrl.includes('vimeo.com');

        return {
            id: safeString(item.id, `gal-${index + 1}`),
            title: safeString(item.title, `Réalisation ${index + 1}`),
            description: safeString(item.description, ''),
            badge: safeString(item.badge, ''),
            displayUrl: safeString(item.displayUrl, ''),
            targetUrl: safeString(item.targetUrl, ''),
            documentUrl: safeString(item.documentUrl, ''),
            documentLabel: safeString(item.documentLabel, ''),
            caseStudy: (item.caseStudy && typeof item.caseStudy === 'object') ? item.caseStudy : null,
            tags: Array.isArray(item.tags) ? item.tags.map(t => safeString(t)).filter(Boolean) : [],
            url: rawUrl,
            type: isVideo ? 'video' : 'image',
            _schemaVersion: item._schemaVersion || 2
        };
    }

    /**
     * Normalise un Look Signature
     */
    function normalizeLookItem(rawItem, index) {
        if (!rawItem || typeof rawItem !== 'object') return null;
        const item = (window.ContentSchema && typeof window.ContentSchema.migrate === 'function')
            ? window.ContentSchema.migrate('lookItem', rawItem)
            : rawItem;

        // Normalisation des tags (support array ou string séparée par virgules)
        let tagsArray = [];
        if (Array.isArray(item.tags)) {
            tagsArray = item.tags.map(t => safeString(t)).filter(Boolean);
        } else if (typeof item.tags === 'string' && item.tags.trim().length > 0) {
            tagsArray = item.tags.split(',').map(t => t.trim()).filter(Boolean);
        }

        return {
            id: safeString(item.id, `look-${index + 1}`),
            title: safeString(item.title, `Création N°${index + 1}`),
            subtitle: safeString(item.subtitle, `Sélection N°0${index + 1}`),
            description: safeString(item.description, 'Prestation et réalisation de haute qualité.'),
            heroImageUrl: safeString(item.heroImageUrl, PLACEHOLDER_IMG),
            detailImage1Url: safeString(item.detailImage1Url, ''),
            detailImage2Url: safeString(item.detailImage2Url, ''),
            tags: tagsArray.length > 0 ? tagsArray.join(', ') : '',
            tagsList: tagsArray,
            _schemaVersion: item._schemaVersion || 1
        };
    }

    /**
     * Normalise un comparateur Avant / Après
     */
    function normalizeBeforeAfterItem(rawItem, index) {
        if (!rawItem || typeof rawItem !== 'object') return null;
        const item = (window.ContentSchema && typeof window.ContentSchema.migrate === 'function')
            ? window.ContentSchema.migrate('beforeAfterItem', rawItem)
            : rawItem;

        return {
            id: safeString(item.id, `ba-${index + 1}`),
            title: safeString(item.title, `Transformation ${index + 1}`),
            beforeUrl: safeString(item.beforeUrl, PLACEHOLDER_IMG),
            afterUrl: safeString(item.afterUrl, PLACEHOLDER_IMG),
            _schemaVersion: item._schemaVersion || 1
        };
    }

    /**
     * Normalise une Prestation
     */
    function normalizePrestationItem(rawItem, index) {
        if (!rawItem || typeof rawItem !== 'object') return null;
        const item = (window.ContentSchema && typeof window.ContentSchema.migrate === 'function')
            ? window.ContentSchema.migrate('prestationItem', rawItem)
            : rawItem;

        return {
            id: safeString(item.id, `presta-${index + 1}`),
            icon: safeString(item.icon, '✨'),
            title: safeString(item.title, `Prestation ${index + 1}`),
            description: safeString(item.description, 'Détail de la prestation sur-mesure.'),
            price: safeString(item.price, 'Sur devis'),
            badge: safeString(item.badge, ''),
            features: Array.isArray(item.features) ? item.features.map(f => safeString(f)).filter(Boolean) : [],
            ctaUrl: safeString(item.ctaUrl, ''),
            ctaText: safeString(item.ctaText, ''),
            _schemaVersion: item._schemaVersion || 2
        };
    }

    /**
     * Normalise un jalon de la Timeline (CAND-04)
     */
    function normalizeTimelineItem(rawItem, index) {
        if (!rawItem || typeof rawItem !== 'object') return null;
        return {
            id: safeString(rawItem.id, `time-${index + 1}`),
            date: safeString(rawItem.date, ''),
            title: safeString(rawItem.title, `Jalon ${index + 1}`),
            location: safeString(rawItem.location, ''),
            description: safeString(rawItem.description, ''),
            _schemaVersion: rawItem._schemaVersion || 1
        };
    }

    // ─────────────────────────────────────────────────────────────
    // OBJET GLOBAL SITECONTENT
    // ─────────────────────────────────────────────────────────────
    function getRepository() {
        if (typeof ContentRepository !== 'undefined') return ContentRepository;
        if (typeof DataStore !== 'undefined') return DataStore;
        return null;
    }

    window.SiteContent = {

        /**
         * Récupère la galerie normalisée
         * @returns {Promise<Array>}
         */
        getGallery: async function () {
            const repo = getRepository();
            if (repo && typeof repo.getGallery === 'function') {
                try {
                    const res = await repo.getGallery();
                    if (Array.isArray(res)) {
                        return res.map((item, idx) => normalizeGalleryItem(item, idx)).filter(Boolean);
                    }
                } catch (err) {
                    console.warn('[SiteContent] Erreur Repository.getGallery, repli sur DEFAULT_CONTENT:', err);
                }
            }

            const rawList = (typeof DEFAULT_CONTENT !== 'undefined' && Array.isArray(DEFAULT_CONTENT.gallery))
                ? DEFAULT_CONTENT.gallery
                : [];
            return rawList.map((item, idx) => normalizeGalleryItem(item, idx)).filter(Boolean);
        },

        /**
         * Récupère les looks signature normalisés
         * @returns {Promise<Array>}
         */
        getLooks: async function () {
            const repo = getRepository();
            if (repo && typeof repo.getLooks === 'function') {
                try {
                    const res = await repo.getLooks();
                    if (Array.isArray(res)) {
                        return res.map((item, idx) => normalizeLookItem(item, idx)).filter(Boolean);
                    }
                } catch (err) {
                    console.warn('[SiteContent] Erreur Repository.getLooks, repli sur DEFAULT_CONTENT:', err);
                }
            }

            const rawList = (typeof DEFAULT_CONTENT !== 'undefined' && Array.isArray(DEFAULT_CONTENT.looks))
                ? DEFAULT_CONTENT.looks
                : [];
            return rawList.map((item, idx) => normalizeLookItem(item, idx)).filter(Boolean);
        },

        /**
         * Récupère les transformations avant/après normalisées
         * @returns {Promise<Array>}
         */
        getBeforeAfter: async function () {
            const repo = getRepository();
            if (repo && typeof repo.getBeforeAfter === 'function') {
                try {
                    const res = await repo.getBeforeAfter();
                    if (Array.isArray(res)) {
                        return res.map((item, idx) => normalizeBeforeAfterItem(item, idx)).filter(Boolean);
                    }
                } catch (err) {
                    console.warn('[SiteContent] Erreur Repository.getBeforeAfter, repli sur DEFAULT_CONTENT:', err);
                }
            }

            const rawList = (typeof DEFAULT_CONTENT !== 'undefined' && Array.isArray(DEFAULT_CONTENT.beforeAfter))
                ? DEFAULT_CONTENT.beforeAfter
                : [];
            return rawList.map((item, idx) => normalizeBeforeAfterItem(item, idx)).filter(Boolean);
        },

        /**
         * Récupère les prestations normalisées
         * @returns {Promise<Array>}
         */
        getPrestations: async function () {
            const repo = getRepository();
            if (repo && typeof repo.getPrestations === 'function') {
                try {
                    const res = await repo.getPrestations();
                    if (Array.isArray(res)) {
                        return res.map((item, idx) => normalizePrestationItem(item, idx)).filter(Boolean);
                    }
                } catch (err) {
                    console.warn('[SiteContent] Erreur Repository.getPrestations, repli sur DEFAULT_CONTENT:', err);
                }
            }

            const rawList = (typeof DEFAULT_CONTENT !== 'undefined' && Array.isArray(DEFAULT_CONTENT.prestations))
                ? DEFAULT_CONTENT.prestations
                : [];
            return rawList.map((item, idx) => normalizePrestationItem(item, idx)).filter(Boolean);
        },

        /**
         * Récupère les jalons de la timeline normalisés (CAND-04)
         * @returns {Promise<Array>}
         */
        getTimeline: async function () {
            const repo = getRepository();
            if (repo && typeof repo.getTimeline === 'function') {
                try {
                    const res = await repo.getTimeline();
                    if (Array.isArray(res)) {
                        return res.map((item, idx) => normalizeTimelineItem(item, idx)).filter(Boolean);
                    }
                } catch (err) {
                    console.warn('[SiteContent] Erreur Repository.getTimeline, repli sur DEFAULT_CONTENT:', err);
                }
            }

            const rawList = (typeof DEFAULT_CONTENT !== 'undefined' && Array.isArray(DEFAULT_CONTENT.timeline))
                ? DEFAULT_CONTENT.timeline
                : [];
            return rawList.map((item, idx) => normalizeTimelineItem(item, idx)).filter(Boolean);
        },

        /**
         * Récupère l'arbre de contenu complet et normalisé (Interface Unique Phase 5)
         * @returns {Promise<Object>}
         */
        getFullContent: async function () {
            const base = (typeof DEFAULT_CONTENT !== 'undefined') ? DEFAULT_CONTENT : {};
            const cfg = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG : {};

            const repo = (typeof ContentRepository !== 'undefined') ? ContentRepository : null;

            const [gallery, looks, beforeAfter, prestations, timeline, partners, process, testimonials, faq, practicalInfo] = await Promise.all([
                this.getGallery(),
                this.getLooks(),
                this.getBeforeAfter(),
                this.getPrestations(),
                this.getTimeline(),
                (repo && typeof repo.getPartners === 'function') ? repo.getPartners() : (Array.isArray(base.partners) ? base.partners : []),
                (repo && typeof repo.getProcess === 'function') ? repo.getProcess() : (base.process || null),
                (repo && typeof repo.getTestimonials === 'function') ? repo.getTestimonials() : (Array.isArray(base.testimonials) ? base.testimonials : []),
                (repo && typeof repo.getFaq === 'function') ? repo.getFaq() : (Array.isArray(base.faq) ? base.faq : []),
                (repo && typeof repo.getPracticalInfo === 'function') ? repo.getPracticalInfo() : (base.practicalInfo || null)
            ]);

            // Normalisation de l'identité
            const identity = {
                name: (cfg.siteName && cfg.siteName !== 'NOM_DU_CLIENT') ? cfg.siteName : (base.identity?.name || 'Votre Entreprise'),
                tagline: (cfg.siteTagline && cfg.siteTagline !== 'ACCROCHE_PRINCIPALE') ? cfg.siteTagline : (base.identity?.tagline || 'Excellence & Savoir-Faire'),
                activity: (cfg.siteActivity && cfg.siteActivity !== 'ACTIVITÉ_DU_CLIENT') ? cfg.siteActivity : (base.identity?.activity || 'Services Professionnels'),
                city: (cfg.siteCity && cfg.siteCity !== 'VILLE') ? cfg.siteCity : (base.identity?.city || '')
            };

            // Normalisation Meta
            const meta = {
                title: base.meta?.title || `${identity.name} | ${identity.activity}`,
                description: base.meta?.description || `Découvrez les prestations et réalisations de ${identity.name}.`,
                lang: base.meta?.lang || 'fr'
            };

            // Normalisation Hero
            const hero = {
                eyebrow: base.hero?.eyebrow || `${identity.activity}${identity.city ? ` · ${identity.city}` : ''}`,
                titleHtml: base.hero?.titleHtml || "L'Excellence & Le Savoir-Faire<br><em>au service de vos projets</em>",
                description: base.hero?.description || "Prestations sur-mesure et accompagnement d'exception pour vos exigences.",
                ctaText: base.hero?.ctaText || (cfg.actions?.primaryCta?.label || "Nous contacter"),
                ctaLink: base.hero?.ctaLink || (cfg.actions?.primaryCta?.href || "#contact"),
                imageUrl: base.hero?.imageUrl || PLACEHOLDER_IMG
            };

            // Normalisation About
            const about = {
                eyebrow: base.about?.eyebrow || "À propos",
                titleHtml: base.about?.titleHtml || "L'Exigence et la Passion<br>au cœur de chaque réalisation",
                paragraphs: Array.isArray(base.about?.paragraphs) ? [...base.about.paragraphs] : [safeString(base.about?.paragraphs, "Nous mettons notre expertise et notre rigueur au service de vos attentes pour un résultat durable et soigné.")],
                quote: base.about?.quote || "La qualité sans compromis et l'écoute attentive au service de chaque projet.",
                signature: (cfg.siteName && cfg.siteName !== 'NOM_DU_CLIENT') ? `${cfg.siteName}.` : (base.about?.signature || `${identity.name}.`),
                imageUrl: base.about?.imageUrl || PLACEHOLDER_IMG
            };

            // Normalisation Contact
            const contact = {
                email: (cfg.contactEmail && cfg.contactEmail !== 'EMAIL_CLIENT') ? cfg.contactEmail : (base.contact?.email || ''),
                redirectUrl: (cfg.contactRedirectUrl && cfg.contactRedirectUrl !== 'https://URL_SITE') ? cfg.contactRedirectUrl : (window.location.origin + window.location.pathname + '#contact'),
                subject: `Nouveau message depuis le site ${identity.name} !`,
                services: (Array.isArray(cfg.contactServices) && cfg.contactServices.length > 0)
                    ? [...cfg.contactServices]
                    : (Array.isArray(base.contact?.services) ? [...base.contact.services] : [])
            };

            // Normalisation Footer
            const footer = {
                brand: identity.name,
                tagline: identity.tagline || base.footer?.tagline || '',
                copyrightYear: cfg.copyrightYear || base.footer?.copyrightYear || new Date().getFullYear(),
                copyrightName: (cfg.copyrightName && cfg.copyrightName !== 'NOM_COMMERCIAL') ? cfg.copyrightName : identity.name
            };

            return {
                meta,
                identity,
                hero,
                ticker: base.ticker || null,
                about,
                banner: base.banner || null,
                partners,
                process,
                looks,
                gallery,
                beforeAfter,
                prestations,
                timeline,
                testimonials,
                faq,
                practicalInfo,
                contact,
                footer,
                legal: cfg.legal || base.legal || null
            };
        }
    };

    console.log('[SiteContent] Adaptateur universel et normalisateur de contenu initialisé.');
})();
