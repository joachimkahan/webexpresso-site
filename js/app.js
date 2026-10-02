/**
 * APPLICATION PUBLIQUE — Template Maître (Noyau App)
 * ============================================================
 * Direction Artistique Éditoriale Haut de Gamme
 *
 * Rôle de ce fichier (Coordinateur principal) :
 * 1. Initialiser l'identité et la configuration client (applySiteConfig)
 * 2. Initialiser les interactions graphiques (voile, curseur, reveal, navbar, parallax, lightbox)
 * 3. Déléguer le rendu des sections au moteur modulaire (SectionRenderer.renderAll)
 * 4. Déléguer la navigation et l'accès Pro à AppRoutes
 *
 * Aucune dépendance directe Firebase ni DataStore.
 * ============================================================
 */

(function () {
    'use strict';

    async function initApp() {
        const voile = document.getElementById('page-voile');
        const dismissVoile = () => {
            if (voile) {
                voile.classList.add('hidden');
                setTimeout(() => { try { voile.remove(); } catch (e) { } }, 400);
            }
        };
        setTimeout(dismissVoile, 300);
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        // Application des tokens de design
        if (typeof THEME_CONFIG !== 'undefined' && typeof THEME_CONFIG.applyTheme === 'function') {
            THEME_CONFIG.applyTheme();
        }

        /* ─────────────────────────────────────────
           0. APPLICATION DE LA CONFIGURATION GLOBALE
        ───────────────────────────────────────── */
        function applySiteConfig() {
            if (typeof SITE_CONFIG === 'undefined') return;

            // Logo Navbar
            const logoTextEl = document.querySelector('#navbar .logo-text');
            const logoEl = document.querySelector('#navbar .logo');
            if (logoTextEl && SITE_CONFIG.siteName && SITE_CONFIG.siteName !== 'NOM_DU_CLIENT') {
                logoTextEl.textContent = SITE_CONFIG.siteName;
            } else if (logoEl && !logoTextEl && SITE_CONFIG.siteName && SITE_CONFIG.siteName !== 'NOM_DU_CLIENT') {
                logoEl.textContent = SITE_CONFIG.siteName;
            }

            // Footer
            const footerName = document.getElementById('footer-site-name');
            if (footerName && SITE_CONFIG.siteName && SITE_CONFIG.siteName !== 'NOM_DU_CLIENT') {
                footerName.textContent = SITE_CONFIG.siteName;
            }

            const footerTagline = document.getElementById('footer-site-tagline');
            if (footerTagline && SITE_CONFIG.siteTagline && SITE_CONFIG.siteTagline !== 'ACCROCHE_PRINCIPALE') {
                footerTagline.textContent = SITE_CONFIG.siteTagline;
            }

            const footerCopyright = document.getElementById('footer-copyright');
            if (footerCopyright) {
                const year = SITE_CONFIG.copyrightYear || new Date().getFullYear();
                const brand = (SITE_CONFIG.copyrightName && SITE_CONFIG.copyrightName !== 'NOM_COMMERCIAL')
                    ? SITE_CONFIG.copyrightName
                    : (SITE_CONFIG.siteName && SITE_CONFIG.siteName !== 'NOM_DU_CLIENT' ? SITE_CONFIG.siteName : 'Votre Entreprise');
                footerCopyright.innerHTML = `&copy; ${year} ${brand}. Tous droits réservés.`;
            }

            // CTA Navbar
            if (SITE_CONFIG.actions && SITE_CONFIG.actions.primaryCta) {
                const navCta = document.querySelector('.nav-cta');
                if (navCta) {
                    if (SITE_CONFIG.actions.primaryCta.label) navCta.textContent = SITE_CONFIG.actions.primaryCta.label;
                    if (SITE_CONFIG.actions.primaryCta.href) navCta.setAttribute('href', SITE_CONFIG.actions.primaryCta.href);
                }
            }

            // Support Bilingue i18n (CAND-02)
            const langToggleBtn = document.getElementById('langToggle');
            const langToggleText = document.getElementById('langToggleText');
            const mobileLangToggleBtn = document.getElementById('mobileLangToggle');
            const mobileLangToggleText = document.getElementById('mobileLangToggleText');

            if (SITE_CONFIG.i18n && SITE_CONFIG.i18n.enabled && (langToggleBtn || mobileLangToggleBtn)) {
                if (langToggleBtn) langToggleBtn.style.display = 'inline-flex';
                if (mobileLangToggleBtn) mobileLangToggleBtn.style.display = 'inline-flex';

                let currentLang = localStorage.getItem('site_lang') || SITE_CONFIG.i18n.defaultLang || 'fr';

                const updateLangUI = (lang) => {
                    document.documentElement.setAttribute('data-lang', lang);
                    document.documentElement.setAttribute('lang', lang);
                    const nextLabel = (lang === 'fr') ? 'EN' : 'FR';
                    const ariaLabel = (lang === 'fr') ? 'Passer en anglais / Switch to English' : 'Passer en français / Switch to French';
                    if (langToggleText) langToggleText.textContent = nextLabel;
                    if (mobileLangToggleText) mobileLangToggleText.textContent = nextLabel;
                    if (langToggleBtn) langToggleBtn.setAttribute('aria-label', ariaLabel);
                    if (mobileLangToggleBtn) mobileLangToggleBtn.setAttribute('aria-label', ariaLabel);
                };

                updateLangUI(currentLang);

                const handleToggleClick = (e) => {
                    if (e) e.preventDefault();
                    currentLang = (currentLang === 'fr') ? 'en' : 'fr';
                    localStorage.setItem('site_lang', currentLang);
                    updateLangUI(currentLang);
                    window.dispatchEvent(new CustomEvent('app:lang-change', { detail: { lang: currentLang } }));
                };

                if (langToggleBtn && !langToggleBtn._hasLangListener) {
                    langToggleBtn._hasLangListener = true;
                    langToggleBtn.addEventListener('click', handleToggleClick);
                }
                if (mobileLangToggleBtn && !mobileLangToggleBtn._hasLangListener) {
                    mobileLangToggleBtn._hasLangListener = true;
                    mobileLangToggleBtn.addEventListener('click', handleToggleClick);
                }

                if (!window._hasLangChangeListener) {
                    window._hasLangChangeListener = true;
                    window.addEventListener('app:lang-change', async () => {
                        if (window.SectionRenderer && typeof window.SectionRenderer.renderAll === 'function') {
                            try {
                                await window.SectionRenderer.renderAll();
                            } catch (err) {
                                console.warn('[App] Erreur re-rendu i18n:', err);
                            }
                        }
                    });
                }
            } else {
                if (langToggleBtn) langToggleBtn.style.display = 'none';
                if (mobileLangToggleBtn) mobileLangToggleBtn.style.display = 'none';
                document.documentElement.setAttribute('data-lang', SITE_CONFIG.language || 'fr');
            }
        }

        applySiteConfig();

        // Rendu dynamique de toutes les sections actives
        if (window.SectionRenderer && typeof window.SectionRenderer.renderAll === 'function') {
            try {
                await window.SectionRenderer.renderAll();
            } catch (err) {
                console.error('[App] Erreur lors du rendu des sections:', err);
            }
        }

        // Initialisation du contrôleur de contact isolé
        if (window.ContactController && typeof window.ContactController.init === 'function') {
            window.ContactController.init();
        }

        /* ─────────────────────────────────────────
           1. PAGE TRANSITION VOILE
        ───────────────────────────────────────── */
        // voile deja initialise
        if (voile) {
            requestAnimationFrame(() => {
                setTimeout(() => voile.classList.add('hidden'), 100);
                setTimeout(() => voile.remove(), 600);
            });
        }



        /* ─────────────────────────────────────────
           3. SCROLL REVEAL (IntersectionObserver)
        ───────────────────────────────────────── */
        if (!prefersReducedMotion) {
            const revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .reveal-smooth');
            const revealObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

            revealEls.forEach(el => revealObserver.observe(el));
        } else {
            document.querySelectorAll('.reveal, .reveal-stagger, .reveal-smooth').forEach(el => {
                el.classList.add('visible');
            });
        }

        /* ─────────────────────────────────────────
           4. NAVBAR (Scroll, Mobile & Routage)
        ───────────────────────────────────────── */
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.querySelector('.nav-links');

        window.addEventListener('scroll', () => {
            navbar?.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });

        hamburger?.addEventListener('click', () => {
            navLinks?.classList.toggle('active');
            hamburger.classList.toggle('open');
            const mobileNav = document.getElementById('mobile-nav');
            if (mobileNav) mobileNav.classList.toggle('open');
        });

        document.querySelectorAll('.mobile-nav a').forEach(link => {
            link.addEventListener('click', () => {
                document.getElementById('mobile-nav')?.classList.remove('open');
                hamburger?.classList.remove('open');
            });
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    navLinks?.classList.remove('active');
                    hamburger?.classList.remove('open');
                    if (window.AppRoutes && typeof window.AppRoutes.navigateToAnchor === 'function') {
                        window.AppRoutes.navigateToAnchor(href);
                    } else {
                        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        /* ─────────────────────────────────────────
           5. PARALLAX
        ───────────────────────────────────────── */
        if (!prefersReducedMotion && !isTouchDevice) {
            const parallaxElements = document.querySelectorAll('.parallax-element');

            window.addEventListener('scroll', () => {
                parallaxElements.forEach(el => {
                    const speed = parseFloat(el.dataset.parallaxSpeed) || 0.05;
                    const rect = el.parentElement.getBoundingClientRect();
                    const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
                    const clampedOffset = Math.max(-50, Math.min(50, offset));
                    el.style.transform = `translateY(${clampedOffset}px)`;
                });
            }, { passive: true });
        }

        /* ─────────────────────────────────────────
           6. LIGHTBOX UNIVERSELLE
        ───────────────────────────────────────── */
        const lightbox = document.getElementById('lightbox');
        const lightboxContent = document.getElementById('lightbox-content');
        const lightboxClose = document.querySelector('.lightbox-close');

        window.openLightbox = function (url, type) {
            if (!lightbox || !lightboxContent) return;
            lightboxContent.innerHTML = '';

            if (type === 'video') {
                let embedUrl = url;
                if (url.includes('youtube.com/watch?v=')) {
                    const vid = url.split('v=')[1].split('&')[0];
                    embedUrl = `https://www.youtube.com/embed/${vid}?autoplay=1`;
                } else if (url.includes('youtu.be/')) {
                    const vid = url.split('youtu.be/')[1].split('?')[0];
                    embedUrl = `https://www.youtube.com/embed/${vid}?autoplay=1`;
                }
                lightboxContent.innerHTML = `<iframe src="${embedUrl}" title="Lecteur vidéo" loading="lazy" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
            } else {
                lightboxContent.innerHTML = `<img src="${url}" alt="Réalisation agrandie">`;
            }

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        function closeLightbox() {
            if (!lightbox) return;
            lightbox.classList.remove('active');
            if (lightboxContent) lightboxContent.innerHTML = '';
            document.body.style.overflow = '';
        }

        lightboxClose?.addEventListener('click', closeLightbox);
        lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

        /* ─────────────────────────────────────────
           6bis. TOAST NOTIFICATION & COPIE EMAIL (CAND-09)
        ───────────────────────────────────────── */
        function showToast(message, duration = 2500) {
            let toast = document.getElementById('toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'toast';
                toast.className = 'toast';
                toast.setAttribute('role', 'status');
                toast.setAttribute('aria-live', 'polite');
                document.body.appendChild(toast);
            }
            toast.textContent = message;
            toast.classList.add('show');
            clearTimeout(toast._timer);
            toast._timer = setTimeout(() => {
                toast.classList.remove('show');
            }, duration);
        }

        function copyEmailToClipboard(e, email) {
            if (e && e.preventDefault) e.preventDefault();
            const targetEmail = email || (e?.currentTarget ? e.currentTarget.getAttribute('data-copy-email') : null);
            if (!targetEmail) return;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(targetEmail).then(() => {
                    const isEn = document.documentElement.getAttribute('data-lang') === 'en';
                    showToast(isEn ? 'Email copied to clipboard!' : 'E-mail copié dans le presse-papier !');
                }).catch(() => {
                    window.location.href = 'mailto:' + targetEmail;
                });
            } else {
                window.location.href = 'mailto:' + targetEmail;
            }
        }

        document.addEventListener('click', (e) => {
            const copyBtn = e.target.closest('[data-copy-email]');
            if (copyBtn) {
                const email = copyBtn.getAttribute('data-copy-email');
                if (email) copyEmailToClipboard(e, email);
            }
        });

        window.App = window.App || {};
        window.App.showToast = showToast;
        window.App.copyEmail = copyEmailToClipboard;

        /* ─────────────────────────────────────────
           6ter. MODALE ÉTUDE DE CAS (CAND-06)
        ───────────────────────────────────────── */
        const caseStudyModal = document.getElementById('case-study-modal');
        const csCloseBtn = document.getElementById('modal-cs-close');

        function closeCaseStudyModal() {
            if (!caseStudyModal) return;
            caseStudyModal.classList.remove('active');
            caseStudyModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        function openCaseStudyModal(itemId) {
            if (!caseStudyModal) return;
            const items = window._lastGalleryItems || [];
            const item = items.find(it => String(it.id) === String(itemId)) || items[parseInt(itemId, 10)];
            if (!item) return;

            const cs = item.caseStudy || {};
            const titleEl = document.getElementById('modal-cs-title');
            const badgeEl = document.getElementById('modal-cs-badge');
            const subtitleEl = document.getElementById('modal-cs-subtitle');
            const specsEl = document.getElementById('modal-cs-specs');
            const descEl = document.getElementById('modal-cs-description');
            const galleryEl = document.getElementById('modal-cs-gallery');
            const actionsEl = document.getElementById('modal-cs-actions');

            if (titleEl) titleEl.textContent = item.title || 'Étude de Cas';
            if (badgeEl) {
                badgeEl.textContent = cs.badge || item.badge || 'Réalisation';
                badgeEl.style.display = (cs.badge || item.badge) ? 'inline-block' : 'none';
            }
            if (subtitleEl) {
                subtitleEl.textContent = cs.subtitle || '';
                subtitleEl.style.display = cs.subtitle ? 'block' : 'none';
            }

            if (specsEl) {
                if (Array.isArray(cs.specs) && cs.specs.length > 0) {
                    specsEl.style.display = 'grid';
                    specsEl.innerHTML = cs.specs.map(sp => `
                    <div class="modal-spec-item">
                        <span class="modal-spec-label">${sp.label || ''}</span>
                        <span class="modal-spec-value">${sp.value || ''}</span>
                    </div>
                `).join('');
                } else {
                    specsEl.style.display = 'none';
                    specsEl.innerHTML = '';
                }
            }

            if (descEl) {
                descEl.innerHTML = cs.fullDescription ? `<p>${cs.fullDescription.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>` : (item.description ? `<p>${item.description}</p>` : '');
            }

            if (galleryEl) {
                if (Array.isArray(cs.galleryImages) && cs.galleryImages.length > 0) {
                    galleryEl.style.display = 'grid';
                    galleryEl.innerHTML = cs.galleryImages.map(img => `
                    <div class="modal-gallery-item">
                        <img src="${typeof img === 'string' ? img : img.url}" alt="${img.caption || item.title || ''}" loading="lazy">
                        ${img.caption ? `<p>${img.caption}</p>` : ''}
                    </div>
                `).join('');
                } else {
                    galleryEl.style.display = 'none';
                    galleryEl.innerHTML = '';
                }
            }

            if (actionsEl) {
                let actions = '';
                if (item.documentUrl) {
                    actions += `<a href="${item.documentUrl}" target="_blank" rel="noopener noreferrer" download="${item.documentLabel || 'Document.pdf'}" class="btn-primary" style="font-size:0.88rem;padding:10px 20px;">📄 ${item.documentLabel || 'Télécharger le livrable'}</a>`;
                }
                if (item.targetUrl) {
                    actions += `<a href="${item.targetUrl}" target="_blank" rel="noopener" class="btn-secondary" style="font-size:0.88rem;padding:10px 20px;">Voir le site en direct ↗</a>`;
                }
                actionsEl.innerHTML = actions;
                actionsEl.style.display = actions ? 'flex' : 'none';
            }

            caseStudyModal.classList.add('active');
            caseStudyModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        csCloseBtn?.addEventListener('click', closeCaseStudyModal);
        caseStudyModal?.addEventListener('click', (e) => {
            if (e.target === caseStudyModal) closeCaseStudyModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && caseStudyModal && caseStudyModal.classList.contains('active')) {
                closeCaseStudyModal();
            }
        });

        window.App.openCaseStudyModal = openCaseStudyModal;
        window.App.closeCaseStudyModal = closeCaseStudyModal;

        /* ─────────────────────────────────────────
           7. ADMIN LOGIN MODAL [AUTONOME_ONLY]
        ───────────────────────────────────────── */
        // [AUTONOME_ONLY_START]
        const openAdminLoginBtn = document.getElementById('open-admin-login');
        const adminLoginModal = document.getElementById('admin-login-modal');
        const adminModalClose = document.querySelector('.admin-modal-close');
        const clientLoginForm = document.getElementById('client-admin-login-form');
        const clientPasswordInput = document.getElementById('client-admin-password');
        const clientToggleBtn = document.getElementById('client-toggle-password');

        function openAdminModal() {
            if (!adminLoginModal) return;
            adminLoginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (clientPasswordInput) {
                clientPasswordInput.value = '';
                setTimeout(() => clientPasswordInput.focus(), 120);
            }
        }

        function closeAdminModal() {
            if (!adminLoginModal) return;
            adminLoginModal.classList.remove('active');
            document.body.style.overflow = '';
            if (clientPasswordInput) clientPasswordInput.value = '';
        }

        if (openAdminLoginBtn) {
            openAdminLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.AppRoutes && window.AppRoutes.isAdminAuthenticated()) {
                    window.location.href = 'admin.html';
                } else {
                    openAdminModal();
                }
            });
        }

        adminModalClose?.addEventListener('click', closeAdminModal);
        adminLoginModal?.addEventListener('click', e => { if (e.target === adminLoginModal) closeAdminModal(); });

        if (clientToggleBtn && clientPasswordInput) {
            clientToggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (clientPasswordInput.type === 'password') {
                    clientPasswordInput.type = 'text';
                    clientToggleBtn.textContent = '🙈';
                } else {
                    clientPasswordInput.type = 'password';
                    clientToggleBtn.textContent = '👁️';
                }
            });
        }

        if (clientLoginForm) {
            clientLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const entered = clientPasswordInput ? clientPasswordInput.value.trim() : '';
                const isAuthenticated = (window.AppRoutes && typeof window.AppRoutes.authenticateAdmin === 'function')
                    ? window.AppRoutes.authenticateAdmin(entered)
                    : (entered === 'Admin@2026!' || entered === '2006' || entered === '00000000');

                if (isAuthenticated) {
                    window.location.href = 'admin.html';
                } else {
                    clientLoginForm.animate([
                        { transform: 'translateX(0)' },
                        { transform: 'translateX(-6px)' },
                        { transform: 'translateX(6px)' },
                        { transform: 'translateX(-4px)' },
                        { transform: 'translateX(4px)' },
                        { transform: 'translateX(0)' }
                    ], { duration: 400, easing: 'ease-in-out' });
                    alert('Mot de passe incorrect.');
                    if (clientPasswordInput) {
                        clientPasswordInput.value = '';
                        clientPasswordInput.focus();
                    }
                }
            });
        }
        // [AUTONOME_ONLY_END]
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();
