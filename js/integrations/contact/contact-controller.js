/**
 * CONTACT-CONTROLLER.JS — Contrôleur UI du Formulaire de Contact
 * ============================================================
 * [PROTECTED] Gestionnaire d'événements et d'affichage du formulaire.
 *
 * Rôle :
 * - Initialiser le formulaire et ses options de services
 * - Intercepter l'événement submit et exécuter la validation
 * - Empêcher la double soumission (désactivation du bouton)
 * - Afficher les retours utilisateurs (bannières de statut accessibles)
 *
 * ⚠️ 0 couplage avec Firebase, 0 secret.
 * ============================================================
 */

(function () {
    'use strict';

    let isSubmitting = false;

    /**
     * Nettoie les messages d'erreur et de statut de l'interface
     * @param {HTMLFormElement} form
     */
    function clearFormStatus(form) {
        // Supprime les bannières existantes
        const existingBanners = form.querySelectorAll('.form-status-banner');
        existingBanners.forEach(b => b.remove());

        // Supprime les messages d'erreur de champ
        const fieldErrors = form.querySelectorAll('.field-error-message');
        fieldErrors.forEach(e => e.remove());

        // Retire les classes d'erreur sur les inputs
        const errorInputs = form.querySelectorAll('.input-error');
        errorInputs.forEach(i => i.classList.remove('input-error'));
    }

    /**
     * Affiche une bannière de statut au-dessus du formulaire
     * @param {HTMLFormElement} form
     * @param {'success' | 'error'} type
     * @param {string} message
     */
    function showStatusBanner(form, type, message) {
        clearFormStatus(form);

        const banner = document.createElement('div');
        banner.className = `form-status-banner banner-${type}`;
        banner.setAttribute('role', type === 'error' ? 'alert' : 'status');
        banner.textContent = message;

        form.insertBefore(banner, form.firstChild);

        // Faire défiler doucement vers le message si nécessaire
        banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Affiche une erreur sous un champ spécifique
     * @param {HTMLElement} inputEl
     * @param {string} errorMessage
     */
    function showFieldError(inputEl, errorMessage) {
        if (!inputEl) return;
        inputEl.classList.add('input-error');

        const errorEl = document.createElement('span');
        errorEl.className = 'field-error-message';
        errorEl.setAttribute('role', 'alert');
        errorEl.textContent = errorMessage;

        const parentGroup = inputEl.closest('.form-group') || inputEl.parentElement;
        if (parentGroup) {
            parentGroup.appendChild(errorEl);
        }
    }

    /**
     * Initialise le contrôleur du formulaire de contact
     */
    function initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const submitBtn = document.getElementById('contact-submit');
        const originalBtnText = submitBtn ? submitBtn.textContent : 'Envoyer le message';

        // 1. Peuplement dynamique des prestations
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            let servicesList = [];
            if (typeof SITE_CONFIG !== 'undefined' && Array.isArray(SITE_CONFIG.contactServices) && SITE_CONFIG.contactServices.length > 0) {
                servicesList = SITE_CONFIG.contactServices;
            } else if (typeof DEFAULT_CONTENT !== 'undefined' && Array.isArray(DEFAULT_CONTENT.contact?.services)) {
                servicesList = DEFAULT_CONTENT.contact.services;
            }

            if (servicesList.length > 0) {
                serviceSelect.innerHTML = '<option value="" disabled selected>Sélectionnez une prestation</option>';
                servicesList.forEach(srv => {
                    const opt = document.createElement('option');
                    opt.value = srv.value;
                    opt.textContent = srv.label;
                    serviceSelect.appendChild(opt);
                });
            }
        }

        // 2. Gestion de la soumission du formulaire
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (isSubmitting) return;

            clearFormStatus(form);

            // Récupération des valeurs
            const formData = {
                name: document.getElementById('name')?.value || '',
                email: document.getElementById('email')?.value || '',
                service: document.getElementById('service')?.value || '',
                message: document.getElementById('message')?.value || '',
                _honey: form.querySelector('input[name="_honey"]')?.value || '',
                _subject: document.getElementById('contact-subject')?.value || 'Nouveau message depuis le site web !'
            };

            // Validation via ContactValidation
            if (window.ContactValidation && typeof window.ContactValidation.validate === 'function') {
                const validationResult = window.ContactValidation.validate(formData);

                if (!validationResult.isValid) {
                    if (validationResult.isSpam) {
                        // Rejet silencieux du spam
                        console.warn('[ContactController] Soumission bloquée par le filtre antispam honeypot.');
                        showStatusBanner(form, 'error', 'Une erreur est survenue lors de l\'envoi.');
                        return;
                    }

                    // Affichage des erreurs par champ
                    let firstInvalidInput = null;
                    Object.entries(validationResult.errors).forEach(([fieldId, errorMsg]) => {
                        const inputEl = document.getElementById(fieldId);
                        if (inputEl) {
                            showFieldError(inputEl, errorMsg);
                            if (!firstInvalidInput) firstInvalidInput = inputEl;
                        }
                    });

                    if (firstInvalidInput) {
                        firstInvalidInput.focus();
                    }
                    return;
                }
            }

            // Démarrage de l'envoi
            isSubmitting = true;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Envoi en cours...';
            }

            // Détermination de l'email destinataire
            let targetEmail = '';
            if (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.contactEmail) {
                targetEmail = SITE_CONFIG.contactEmail;
            } else if (typeof DEFAULT_CONTENT !== 'undefined' && DEFAULT_CONTENT.contact?.email) {
                targetEmail = DEFAULT_CONTENT.contact.email;
            }

            // Appel du service réseau ContactService
            let result = { success: false, message: 'Service temporairement indisponible.' };
            if (window.ContactService && typeof window.ContactService.send === 'function') {
                result = await window.ContactService.send(formData, targetEmail);
            }

            // Traitement de la réponse
            if (result.success) {
                showStatusBanner(form, 'success', result.message);
                form.reset();
            } else {
                showStatusBanner(form, 'error', result.message);
            }

            // Rétablissement de l'état du bouton
            isSubmitting = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });

        console.log('[ContactController] Contrôleur de formulaire de contact attaché.');
    }

    // Exposition sur window.ContactController
    window.ContactController = {
        init: initContactForm
    };

})();
