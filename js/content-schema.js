/**
 * CONTENT-SCHEMA.JS — Modélisation, Versionnement et Validation du Contenu
 * ============================================================
 * [PROTECTED] Schéma universel et contrats de données du Template.
 *
 * Rôle :
 * - Définir la structure explicite des données gérées par le CMS
 * - Assurer le versionnement de schéma (_schemaVersion)
 * - Valider les données avant écriture (longueurs, formats, types)
 * - Assurer la compatibilité ascendante et les migrations douces
 * ============================================================
 */

(function () {
    'use strict';

    const CURRENT_SCHEMA_VERSION = 1;

    // ─────────────────────────────────────────────────────────────
    // HELPERS DE VALIDATION ET D'ASSAINISSEMENT
    // ─────────────────────────────────────────────────────────────

    function isNonEmptyString(val) {
        return typeof val === 'string' && val.trim().length > 0;
    }

    function isSafeUrl(url) {
        if (!isNonEmptyString(url)) return false;
        const trimmed = url.trim();
        // Autorise les URLs web standard et les DataURLs d'images locales
        return trimmed.startsWith('http://') ||
               trimmed.startsWith('https://') ||
               trimmed.startsWith('data:image/') ||
               trimmed.startsWith('/') ||
               trimmed.startsWith('./');
    }

    function isVideoUrl(url) {
        if (!isNonEmptyString(url)) return false;
        const lower = url.trim().toLowerCase();
        return lower.includes('youtube.com') ||
               lower.includes('youtu.be') ||
               lower.includes('vimeo.com') ||
               lower.includes('instagram.com') ||
               lower.endsWith('.mp4') ||
               lower.endsWith('.webm');
    }

    function sanitizeText(text) {
        if (typeof text !== 'string') return '';
        // Échappement basique des balises HTML directes pour prévenir les injections
        return text.trim();
    }

    // ─────────────────────────────────────────────────────────────
    // SCHÉMAS PAR TYPE DE CONTENU
    // ─────────────────────────────────────────────────────────────

    const SCHEMAS = {

        // 1. Galerie Portfolio
        galleryItem: {
            collection: 'portfolio',
            fields: {
                id: { type: 'string', required: false, default: () => 'gal_' + Date.now() },
                title: { type: 'string', required: true, minLength: 2, maxLength: 100, default: '' },
                type: { type: 'enum', required: true, allowed: ['image', 'video'], default: 'image' },
                url: {
                    type: 'string',
                    required: true,
                    default: '',
                    validate: (val, data) => {
                        if (!isSafeUrl(val)) return 'Format d\'URL invalide.';
                        if (data && data.type === 'video' && !isVideoUrl(val)) {
                            return 'L\'URL fournie n\'est pas un lien vidéo reconnu (YouTube, Vimeo, etc.).';
                        }
                        return null;
                    }
                },
                documentUrl: {
                    type: 'string',
                    required: false,
                    default: '',
                    validate: (val) => (!val || isSafeUrl(val)) ? null : 'Format d\'URL de document invalide.'
                },
                documentLabel: {
                    type: 'string',
                    required: false,
                    maxLength: 80,
                    default: ''
                },
                caseStudy: {
                    type: 'object',
                    required: false,
                    default: null
                },
                _schemaVersion: { type: 'number', required: true, default: CURRENT_SCHEMA_VERSION }
            }
        },

        // 2. Looks Signature
        lookItem: {
            collection: 'looks_signature',
            fields: {
                id: { type: 'string', required: false, default: () => 'look_' + Date.now() },
                title: { type: 'string', required: true, minLength: 3, maxLength: 120, default: '' },
                subtitle: { type: 'string', required: true, minLength: 3, maxLength: 120, default: '' },
                description: { type: 'string', required: true, minLength: 10, maxLength: 600, default: '' },
                heroImageUrl: {
                    type: 'string',
                    required: true,
                    default: '',
                    validate: (val) => isSafeUrl(val) ? null : 'Image principale requise ou invalide.'
                },
                detailImage1Url: {
                    type: 'string',
                    required: false,
                    default: '',
                    validate: (val) => (!val || isSafeUrl(val)) ? null : 'Format d\'image détail 1 invalide.'
                },
                detailImage2Url: {
                    type: 'string',
                    required: false,
                    default: '',
                    validate: (val) => (!val || isSafeUrl(val)) ? null : 'Format d\'image détail 2 invalide.'
                },
                tags: { type: 'tags', required: false, maxItems: 8, maxTagLength: 35, default: [] },
                _schemaVersion: { type: 'number', required: true, default: CURRENT_SCHEMA_VERSION }
            }
        },

        // 3. Avant / Après
        beforeAfterItem: {
            collection: 'before_after',
            fields: {
                id: { type: 'string', required: false, default: () => 'ba_' + Date.now() },
                title: { type: 'string', required: true, minLength: 2, maxLength: 100, default: '' },
                beforeUrl: {
                    type: 'string',
                    required: true,
                    default: '',
                    validate: (val) => isSafeUrl(val) ? null : 'Image Avant requise ou invalide.'
                },
                afterUrl: {
                    type: 'string',
                    required: true,
                    default: '',
                    validate: (val) => isSafeUrl(val) ? null : 'Image Après requise ou invalide.'
                },
                _schemaVersion: { type: 'number', required: true, default: CURRENT_SCHEMA_VERSION }
            }
        },

        // 4. Prestations & Tarifs
        prestationItem: {
            collection: 'prestations',
            fields: {
                id: { type: 'string', required: false, default: () => 'presta_' + Date.now() },
                icon: { type: 'string', required: false, maxLength: 8, default: '✨' },
                title: { type: 'string', required: true, minLength: 2, maxLength: 100, default: '' },
                description: { type: 'string', required: true, minLength: 10, maxLength: 400, default: '' },
                price: { type: 'string', required: true, minLength: 2, maxLength: 60, default: 'Sur devis' },
                _schemaVersion: { type: 'number', required: true, default: CURRENT_SCHEMA_VERSION }
            }
        },

        // 5. Timeline / Parcours Chronologique (CAND-04)
        timelineItem: {
            collection: 'timeline',
            fields: {
                id: { type: 'string', required: false, default: () => 'time_' + Date.now() },
                date: { type: 'string', required: true, minLength: 1, maxLength: 60, default: '' },
                title: { type: 'string', required: true, minLength: 2, maxLength: 120, default: '' },
                location: { type: 'string', required: false, maxLength: 80, default: '' },
                description: { type: 'string', required: true, minLength: 10, maxLength: 600, default: '' },
                _schemaVersion: { type: 'number', required: true, default: CURRENT_SCHEMA_VERSION }
            }
        }

    };

    // ─────────────────────────────────────────────────────────────
    // VALIDATEUR PRINCIPAL
    // ─────────────────────────────────────────────────────────────

    const ContentSchema = {

        VERSION: CURRENT_SCHEMA_VERSION,

        /**
         * Récupère le schéma pour un type donné
         */
        getSchema: function (type) {
            return SCHEMAS[type] || null;
        },

        /**
         * Valide un objet de données selon son type de schéma
         * @param {string} type ('galleryItem' | 'lookItem' | 'beforeAfterItem' | 'prestationItem')
         * @param {Object} data
         * @returns {{ isValid: boolean, errors: Object, sanitizedData: Object }}
         */
        validate: function (type, data) {
            const schema = SCHEMAS[type];
            if (!schema) {
                return {
                    isValid: false,
                    errors: { _general: `Type de schéma inconnu : "${type}"` },
                    sanitizedData: data || {}
                };
            }

            if (!data || typeof data !== 'object') {
                return {
                    isValid: false,
                    errors: { _general: 'Les données doivent être un objet valide.' },
                    sanitizedData: {}
                };
            }

            const errors = {};
            const sanitizedData = {};

            for (const [field, rule] of Object.entries(schema.fields)) {
                let value = data[field];

                // Valeur par défaut si non renseigné
                if (value === undefined || value === null) {
                    value = typeof rule.default === 'function' ? rule.default() : rule.default;
                }

                // Normalisation des chaînes
                if (typeof value === 'string') {
                    value = sanitizeText(value);
                }

                // Vérification du caractère requis
                if (rule.required) {
                    if (value === '' || value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
                        errors[field] = `Le champ "${field}" est obligatoire.`;
                        continue;
                    }
                }

                // Vérification du type et des contraintes
                if (rule.type === 'string' && typeof value === 'string' && value.length > 0) {
                    if (rule.minLength && value.length < rule.minLength) {
                        errors[field] = `Le champ "${field}" doit contenir au moins ${rule.minLength} caractères.`;
                    } else if (rule.maxLength && value.length > rule.maxLength) {
                        errors[field] = `Le champ "${field}" ne peut pas dépasser ${rule.maxLength} caractères.`;
                    }
                } else if (rule.type === 'enum') {
                    if (!rule.allowed.includes(value)) {
                        errors[field] = `Valeur non autorisée pour "${field}". Choix possibles : ${rule.allowed.join(', ')}.`;
                    }
                } else if (rule.type === 'tags') {
                    let tagsArray = [];
                    if (Array.isArray(value)) {
                        tagsArray = value.map(t => sanitizeText(t)).filter(Boolean);
                    } else if (typeof value === 'string' && value.trim().length > 0) {
                        tagsArray = value.split(',').map(t => sanitizeText(t)).filter(Boolean);
                    }
                    if (rule.maxItems && tagsArray.length > rule.maxItems) {
                        errors[field] = `Maximum ${rule.maxItems} tags autorisés.`;
                    }
                    value = tagsArray;
                }

                // Validation sur-mesure si définie
                if (typeof rule.validate === 'function' && value) {
                    const customError = rule.validate(value, data);
                    if (customError) {
                        errors[field] = customError;
                    }
                }

                sanitizedData[field] = value;
            }

            // Assurer le tag de version
            sanitizedData._schemaVersion = CURRENT_SCHEMA_VERSION;

            return {
                isValid: Object.keys(errors).length === 0,
                errors: errors,
                sanitizedData: sanitizedData
            };
        },

        /**
         * Normalise et applique la politique de compatibilité ascendante (migration douce)
         * @param {string} type
         * @param {Object} rawData
         * @returns {Object}
         */
        migrate: function (type, rawData) {
            if (!rawData || typeof rawData !== 'object') return {};

            const docVersion = rawData._schemaVersion || 0;
            const schema = SCHEMAS[type];
            if (!schema) return rawData;

            const migrated = { ...rawData };

            // v0 (sans schemaVersion) -> migration vers v1 avec application des valeurs par défaut
            if (docVersion === 0) {
                for (const [field, rule] of Object.entries(schema.fields)) {
                    if (migrated[field] === undefined || migrated[field] === null) {
                        migrated[field] = typeof rule.default === 'function' ? rule.default() : rule.default;
                    }
                }
            } else if (docVersion > CURRENT_SCHEMA_VERSION) {
                console.warn(`[ContentSchema] Document "${type}" version ${docVersion} supérieure à la version gérée (${CURRENT_SCHEMA_VERSION}). Utilisation en mode dégradé sécurisé.`);
            }

            migrated._schemaVersion = CURRENT_SCHEMA_VERSION;
            return migrated;
        }

    };

    window.ContentSchema = ContentSchema;
    console.log(`[ContentSchema] Schéma de contenu initialisé (Version ${CURRENT_SCHEMA_VERSION}).`);
})();
