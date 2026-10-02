/**
 * CONTACT-SERVICE.JS — Service d'Envoi Réseau du Formulaire
 * ============================================================
 * [PROTECTED] Encapsulation du fournisseur d'envoi (FormSubmit.co).
 *
 * Rôle :
 * - Effectuer la requête réseau asynchrone sécurisée vers le fournisseur
 * - Gérer les délais d'attente (timeout 10s via AbortController)
 * - Traiter les erreurs réseau de manière résiliente
 *
 * ⚠️ 0 dépendance Firebase, 0 secret, 0 journalisation de données personnelles.
 * ============================================================
 */

(function () {
    'use strict';

    const TIMEOUT_MS = 10000; // 10 secondes de timeout réseau

    /**
     * Envoie la charge utile du message vers le fournisseur FormSubmit
     * @param {Object} payload - { name, email, service, message, _subject, _next }
     * @param {string} destinationEmail - Email configuré du client
     * @returns {Promise<{ success: boolean, message: string }>}
     */
    async function sendMessage(payload, destinationEmail) {
        if (!destinationEmail || destinationEmail === 'EMAIL_CLIENT' || destinationEmail.includes('EMAIL_DESTINATAIRE')) {
            console.warn('[ContactService] L\'adresse email du destinataire n\'est pas encore configurée dans site-config.js.');
            return {
                success: false,
                message: 'Le service de contact est en cours de configuration. Veuillez réessayer ultérieurement.'
            };
        }

        const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(destinationEmail)}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: payload.name,
                    email: payload.email,
                    service: payload.service,
                    message: payload.message,
                    _subject: payload._subject || 'Nouveau message depuis votre site web !',
                    _template: 'box',
                    _captcha: 'false'
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json().catch(() => ({}));
                return {
                    success: true,
                    message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
                };
            } else {
                console.warn('[ContactService] Réponse non-200 du fournisseur FormSubmit:', response.status);
                return {
                    success: false,
                    message: 'Une erreur est survenue lors de l\'envoi. Veuillez vérifier vos informations ou réessayer.'
                };
            }
        } catch (err) {
            clearTimeout(timeoutId);

            if (err.name === 'AbortError') {
                console.warn('[ContactService] Délai d\'attente dépassé (timeout 10s).');
                return {
                    success: false,
                    message: 'Le délai d\'attente a été dépassé. Veuillez vérifier votre connexion internet et réessayer.'
                };
            }

            console.warn('[ContactService] Erreur réseau lors de la soumission AJAX:', err.message);
            return {
                success: false,
                message: 'Impossible de joindre le serveur d\'envoi. Veuillez réessayer dans quelques instants.'
            };
        }
    }

    // Exposition sur window.ContactService
    window.ContactService = {
        send: sendMessage
    };

    console.log('[ContactService] Service d\'envoi de messages initialisé.');
})();
