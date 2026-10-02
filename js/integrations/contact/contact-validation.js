/**
 * CONTACT-VALIDATION.JS — Module de Validation & Antispam du Formulaire
 * ============================================================
 * [PROTECTED] Fonctions pures de validation côté client.
 *
 * Rôle :
 * - Valider la présence et le format de chaque champ requis
 * - Détecter les soumissions frauduleuses via le piège Honeypot
 * - Retourner des messages d'erreur clairs et contextualisés
 *
 * ⚠️ Aucune dépendance externe, aucun appel réseau, 0 secret.
 * ============================================================
 */

(function () {
    'use strict';

    // Regex conforme RFC 5322 simplifiée pour validation d'adresse email
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    /**
     * Valide les données saisies dans le formulaire de contact
     * @param {Object} data - Données du formulaire { name, email, service, message, _honey }
     * @returns {{ isValid: boolean, isSpam: boolean, errors: Object }}
     */
    function validateContactData(data) {
        const errors = {};
        let isSpam = false;

        if (!data || typeof data !== 'object') {
            return { isValid: false, isSpam: false, errors: { form: 'Données invalides.' } };
        }

        // 1. Détection Antispam Honeypot
        if (data._honey && String(data._honey).trim().length > 0) {
            isSpam = true;
            return { isValid: false, isSpam: true, errors: { _honey: 'Spam détecté.' } };
        }

        // 2. Validation du Nom
        const name = (typeof data.name === 'string') ? data.name.trim() : '';
        if (!name) {
            errors.name = 'Veuillez renseigner votre nom complet.';
        } else if (name.length < 2) {
            errors.name = 'Le nom doit comporter au moins 2 caractères.';
        } else if (name.length > 100) {
            errors.name = 'Le nom ne peut pas dépasser 100 caractères.';
        }

        // 3. Validation de l'Email
        const email = (typeof data.email === 'string') ? data.email.trim() : '';
        if (!email) {
            errors.email = 'Veuillez renseigner votre adresse email.';
        } else if (!EMAIL_REGEX.test(email)) {
            errors.email = 'Veuillez saisir une adresse email valide (ex: contact@exemple.com).';
        }

        // 4. Validation du Service / Prestation
        const service = (typeof data.service === 'string') ? data.service.trim() : '';
        if (!service) {
            errors.service = 'Veuillez sélectionner un type de prestation.';
        }

        // 5. Validation du Message
        const message = (typeof data.message === 'string') ? data.message.trim() : '';
        if (!message) {
            errors.message = 'Veuillez décrire votre projet ou poser votre question.';
        } else if (message.length < 5) {
            errors.message = 'Votre message doit comporter au moins 5 caractères.';
        } else if (message.length > 3000) {
            errors.message = 'Votre message ne peut pas dépasser 3 000 caractères.';
        }

        const isValid = Object.keys(errors).length === 0;

        return {
            isValid,
            isSpam,
            errors
        };
    }

    // Exposition sur window.ContactValidation
    window.ContactValidation = {
        validate: validateContactData
    };

    console.log('[ContactValidation] Module de validation du formulaire initialisé.');
})();
