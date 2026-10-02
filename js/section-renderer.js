/**
 * SECTION-RENDERER.JS — Registre & Moteur de rendu dynamique des Sections
 * ============================================================
 * [PROTECTED] Moteur d'affichage des sections publiques.
 *
 * Rôle :
 * - Piloter l'activation et l'ordre d'affichage des sections publiques
 * - Synchroniser automatiquement les liens de navigation (Navbar)
 * - Rendre chaque composant via les données de SiteContent
 * - Gérer les sections inconnues, désactivées ou sans données sans planter
 * ============================================================
 */

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────────
    // 1. REGISTRE DES FONCTIONS DE RENDU DE SECTION
    // ─────────────────────────────────────────────────────────────

    /**
     * Rendu de la section Hero
     */
    async function renderHero(isActive) {
        const heroEl = document.getElementById('accueil');
        if (!heroEl) return;

        if (!isActive) {
            heroEl.style.display = 'none';
            return;
        }
        const globalSiteConfig = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG : (typeof window !== 'undefined' ? window.SITE_CONFIG : null);
        const heroVariant = globalSiteConfig?.variants?.hero || 'cinematic-full';
        if (heroVariant === 'editorial-split') {
            heroEl.classList.add('hero-split');
        } else {
            heroEl.classList.remove('hero-split');
        }

        if (window.SiteContent && typeof window.SiteContent.getFullContent === 'function') {
            try {
                const content = await window.SiteContent.getFullContent();
                if (content && content.hero) {
                    const eyebrowEl = heroEl.querySelector('.hero-eyebrow');
                    if (eyebrowEl) {
                        if (content.hero.eyebrow) {
                            eyebrowEl.textContent = content.hero.eyebrow;
                            eyebrowEl.style.display = '';
                        } else {
                            eyebrowEl.style.display = 'none';
                        }
                    }

                    const titleEl = heroEl.querySelector('h1');
                    if (titleEl && content.hero.titleHtml) {
                        titleEl.innerHTML = content.hero.titleHtml;
                    }

                    const descEl = heroEl.querySelector('.hero-description');
                    if (descEl && content.hero.description) descEl.textContent = content.hero.description;

                    const imgEl = heroEl.querySelector('.hero-media img');
                    if (imgEl && content.hero.imageUrl) {
                        imgEl.src = content.hero.imageUrl;
                        imgEl.alt = content.hero.eyebrow || 'Visuel principal';
                    }

                    const ctaEl = heroEl.querySelector('#hero-cta');
                    if (ctaEl) {
                        const globalSiteConfig = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG : (typeof window !== 'undefined' ? window.SITE_CONFIG : null);
                        if (content.hero.ctaHtml) {
                            ctaEl.innerHTML = content.hero.ctaHtml;
                        } else if (content.hero.ctaText && !ctaEl.querySelector('.btn-price-badge')) {
                            ctaEl.innerHTML = `<span>${content.hero.ctaText}</span> <span class="btn-arrow-icon">↗</span>`;
                        }
                        if (globalSiteConfig?.actions?.primaryCta?.href) ctaEl.setAttribute('href', globalSiteConfig.actions.primaryCta.href);
                    }

                    // ── [CAND-03] Multi-CTA Hero avec Téléchargement Direct ──
                    const secCta = content.hero.secondaryCta;
                    let secCtaEl = heroEl.querySelector('#hero-secondary-cta');
                    if (secCta && secCta.enabled !== false && secCta.url) {
                        if (!secCtaEl) {
                            secCtaEl = document.createElement('a');
                            secCtaEl.id = 'hero-secondary-cta';
                            secCtaEl.className = 'btn-secondary btn-download';
                            if (ctaEl && ctaEl.parentNode) {
                                if (!ctaEl.parentNode.classList.contains('hero-cta-group')) {
                                    const group = document.createElement('div');
                                    group.className = 'hero-cta-group';
                                    ctaEl.parentNode.insertBefore(group, ctaEl);
                                    group.appendChild(ctaEl);
                                }
                                ctaEl.parentNode.appendChild(secCtaEl);
                            }
                        }
                        secCtaEl.style.display = 'inline-flex';
                        secCtaEl.setAttribute('href', secCta.url);
                        secCtaEl.innerHTML = `
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:6px;">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            <span>${secCta.text || 'Télécharger le document'}</span>
                        `;
                        if (secCta.isDownload) {
                            secCtaEl.setAttribute('download', secCta.filename || '');
                        } else {
                            secCtaEl.removeAttribute('download');
                        }
                        if (secCta.url.startsWith('http') || secCta.url.endsWith('.pdf')) {
                            secCtaEl.setAttribute('target', '_blank');
                            secCtaEl.setAttribute('rel', 'noopener noreferrer');
                        }
                    } else if (secCtaEl) {
                        secCtaEl.style.display = 'none';
                    }
                }
            } catch (err) {
                console.warn('[SectionRenderer] Erreur rendu dynamique Hero:', err);
            }
        }
    }

    /**
     * Rendu de la section À Propos
     */
    async function renderAbout(isActive) {
        const aboutEl = document.getElementById('apropos');
        if (!aboutEl) return;

        if (!isActive) {
            aboutEl.style.display = 'none';
            return;
        }
        aboutEl.style.display = '';

        if (window.SiteContent && typeof window.SiteContent.getFullContent === 'function') {
            try {
                const content = await window.SiteContent.getFullContent();
                if (content && content.about) {
                    const h2El = aboutEl.querySelector('h2');
                    if (h2El && content.about.titleHtml) h2El.innerHTML = content.about.titleHtml;

                    const sigEl = aboutEl.querySelector('.about-signature');
                    if (sigEl && content.about.signature) sigEl.textContent = content.about.signature;

                    const imgEl = aboutEl.querySelector('.about-image img');
                    if (imgEl && content.about.imageUrl) {
                        imgEl.src = content.about.imageUrl;
                        imgEl.alt = content.about.title || 'À propos';
                    }
                }
            } catch (err) {
                console.warn('[SectionRenderer] Erreur rendu dynamique About:', err);
            }
        }
    }

    /**
     * Rendu des Looks Signature (Onglets)
     */
    async function renderLooks(isActive) {
        const looksSection = document.getElementById('looks');
        const tabsContainer = document.getElementById('looks-tabs');
        const panelsContainer = document.getElementById('looks-panels');
        if (!looksSection) return;

        if (!isActive) {
            looksSection.style.display = 'none';
            if (tabsContainer) tabsContainer.style.display = 'none';
            if (panelsContainer) panelsContainer.style.display = 'none';
            return;
        }
        looksSection.style.display = '';

        let looks = [];
        if (window.SiteContent && typeof window.SiteContent.getLooks === 'function') {
            try {
                looks = await window.SiteContent.getLooks();
            } catch (err) {
                console.error('[SectionRenderer] Erreur looks:', err);
            }
        }

        if (!Array.isArray(looks) || looks.length === 0) {
            if (panelsContainer) panelsContainer.innerHTML = '<p style="text-align:center; color:var(--color-text-muted, var(--texte-secondaire));">Aucun look disponible actuellement.</p>';
            if (tabsContainer) tabsContainer.innerHTML = '';
            return;
        }

        if (tabsContainer) {
            tabsContainer.innerHTML = looks.map((look, i) => {
                const label = (look.subtitle && look.subtitle.includes('—')) ? (look.subtitle.split('—')[1] ? look.subtitle.split('—')[1].trim() : look.subtitle) : (look.subtitle || look.title || 'Look');
                return `<button class="looks-tab ${i === 0 ? 'active' : ''}" data-tab="${look.id}" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}">${label}</button>`;
            }).join('');
        }

        if (panelsContainer) {
            panelsContainer.innerHTML = looks.map((look, i) => {
                const tagsHtml = (function () {
                    let tl = [];
                    if (Array.isArray(look.tags)) tl = look.tags;
                    else if (typeof look.tags === 'string' && look.tags.trim()) tl = look.tags.split(',').map(t => t.trim()).filter(Boolean);
                    return tl.map(tag => `<span class="look-tag">${tag}</span>`).join('');
                })();

                const detail1 = look.detailImage1Url ? `<img src="${look.detailImage1Url}" alt="Détail 1" loading="lazy">` : '';
                const detail2 = look.detailImage2Url ? `<img src="${look.detailImage2Url}" alt="Détail 2" loading="lazy">` : '';
                const detailGrid = (detail1 || detail2) ? `<div class="look-detail-grid">${detail1}${detail2}</div>` : '';

                return `
                <div class="look-panel ${i === 0 ? 'active' : ''}" data-panel="${look.id}" role="tabpanel">
                    <div class="look-card">
                        <img class="look-hero-image"
                             src="${look.heroImageUrl}"
                             alt="${look.title || 'Look'}"
                             loading="lazy">
                        <span class="look-card-eyebrow">${look.subtitle || ''}</span>
                        <h2>${look.title || ''}</h2>
                        <p class="look-card-description">${look.description || ''}</p>
                        ${detailGrid}
                        <div class="look-tags">${tagsHtml}</div>
                    </div>
                </div>`;
            }).join('');

            // Événements onglets
            const tabs = tabsContainer?.querySelectorAll('.looks-tab') || [];
            const panels = panelsContainer.querySelectorAll('.look-panel');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetPanel = tab.dataset.tab;
                    tabs.forEach(t => {
                        t.classList.remove('active');
                        t.setAttribute('aria-selected', 'false');
                    });
                    tab.classList.add('active');
                    tab.setAttribute('aria-selected', 'true');

                    panels.forEach(p => p.classList.remove('active'));
                    const panel = panelsContainer.querySelector(`.look-panel[data-panel="${targetPanel}"]`);
                    if (panel) panel.classList.add('active');
                });
            });
        }
    }

    /**
     * Rendu du Comparateur Avant / Après
     */
    async function renderBeforeAfter(isActive) {
        const section = document.getElementById('glow-slider-section');
        const container = document.getElementById('ba-sliders-container');
        const nav = document.getElementById('ba-nav');
        if (!section) return;

        if (!isActive) {
            section.style.display = 'none';
            return;
        }
        section.style.display = '';

        if (!container) return;

        let items = [];
        if (window.SiteContent && typeof window.SiteContent.getBeforeAfter === 'function') {
            try {
                items = await window.SiteContent.getBeforeAfter();
            } catch (err) {
                console.error('[SectionRenderer] Erreur avant/après:', err);
            }
        }

        if (!Array.isArray(items) || items.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:var(--color-text-muted, var(--texte-secondaire));">Aucune transformation disponible actuellement.</p>';
            if (nav) nav.style.display = 'none';
            return;
        }

        container.innerHTML = items.map((item, i) => `
            <div class="ba-slide ${i === 0 ? 'active' : ''}" data-ba-index="${i}">
                <div class="ba-slide-title">${item.title || 'Transformation'}</div>
                <div class="glow-slider-wrapper" data-slider-id="${i}">
                    <div class="glow-slider-before">
                        <img src="${item.beforeUrl}" alt="Avant — ${item.title || ''}" loading="lazy">
                    </div>
                    <div class="glow-slider-after" data-after-id="${i}">
                        <img src="${item.afterUrl}" alt="Après — ${item.title || ''}" loading="lazy">
                    </div>
                    <div class="glow-slider-handle" data-handle-id="${i}">
                        <div class="glow-slider-handle-knob"></div>
                    </div>
                    <span class="glow-slider-label left">Avant</span>
                    <span class="glow-slider-label right">Après</span>
                </div>
            </div>
        `).join('');

        if (items.length > 1 && nav) {
            nav.style.display = 'flex';
            nav.innerHTML = items.map((item, i) => `
                <button class="ba-dot ${i === 0 ? 'active' : ''}" data-ba-dot="${i}" aria-label="Transformation ${i + 1}">${item.title || `Option ${i + 1}`}</button>
            `).join('');

            const dots = nav.querySelectorAll('.ba-dot');
            const slides = container.querySelectorAll('.ba-slide');

            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const idx = parseInt(dot.dataset.baDot, 10);
                    slides.forEach(s => s.classList.remove('active'));
                    dots.forEach(d => d.classList.remove('active'));
                    slides[idx]?.classList.add('active');
                    dots[idx]?.classList.add('active');

                    const afterEl = slides[idx]?.querySelector('[data-after-id]');
                    const handleEl = slides[idx]?.querySelector('[data-handle-id]');
                    if (afterEl && handleEl) {
                        afterEl.style.clipPath = 'inset(0 50% 0 0)';
                        handleEl.style.left = '50%';
                    }
                });
            });
        }

        // Configuration interactive du slider
        const allSliders = container.querySelectorAll('.glow-slider-wrapper');
        allSliders.forEach(slider => {
            const afterEl = slider.querySelector('[data-after-id]');
            const handleEl = slider.querySelector('[data-handle-id]');
            const labelLeft = slider.querySelector('.glow-slider-label.left');
            const labelRight = slider.querySelector('.glow-slider-label.right');

            if (!afterEl || !handleEl) return;

            let isDragging = false;
            let labelTimeout = null;

            function updateSlider(percentage) {
                percentage = Math.max(5, Math.min(95, percentage));
                afterEl.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
                handleEl.style.left = percentage + '%';
            }

            function getPercentage(clientX) {
                const rect = slider.getBoundingClientRect();
                return ((clientX - rect.left) / rect.width) * 100;
            }

            function fadeLabels() {
                if (labelTimeout) clearTimeout(labelTimeout);
                labelLeft?.classList.remove('faded');
                labelRight?.classList.remove('faded');
                labelTimeout = setTimeout(() => {
                    labelLeft?.classList.add('faded');
                    labelRight?.classList.add('faded');
                }, 2000);
            }

            slider.addEventListener('mousedown', (e) => {
                isDragging = true;
                updateSlider(getPercentage(e.clientX));
                fadeLabels();
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                updateSlider(getPercentage(e.clientX));
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            slider.addEventListener('touchstart', (e) => {
                isDragging = true;
                updateSlider(getPercentage(e.touches[0].clientX));
                fadeLabels();
            }, { passive: true });

            slider.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                updateSlider(getPercentage(e.touches[0].clientX));
                e.preventDefault();
            }, { passive: false });

            slider.addEventListener('touchend', () => {
                isDragging = false;
            });

            updateSlider(50);
        });
    }

    /**
     * Rendu de la Galerie Portfolio
     */
    async function renderGallery(isActive) {
        const gallerySection = document.getElementById('gallery') || document.querySelector('.portfolio-dynamic');
        const grid = document.getElementById('gallery-grid');
        if (!gallerySection && !grid) return;

        if (!isActive) {
            if (gallerySection) gallerySection.style.display = 'none';
            return;
        }
        if (gallerySection) gallerySection.style.display = '';

        if (!grid) return;

        let items = [];
        if (window.SiteContent && typeof window.SiteContent.getGallery === 'function') {
            try {
                items = await window.SiteContent.getGallery();
            } catch (err) {
                console.error('[SectionRenderer] Erreur galerie:', err);
            }
        }

        if (!Array.isArray(items) || items.length === 0) {
            grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--color-text-muted, var(--texte-secondaire));">Le portfolio est en cours de mise à jour.</p>';
            return;
        }

        // ── [CAND-05] Support de la variante Bento Grid ──
        const globalSiteConfig = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG : (typeof window !== 'undefined' ? window.SITE_CONFIG : null);
        const galleryVariant = globalSiteConfig?.variants?.gallery || 'grid';
        if (galleryVariant === 'bento') {
            grid.classList.add('bento-grid');
        } else {
            grid.classList.remove('bento-grid');
        }

        window._lastGalleryItems = items;

        grid.innerHTML = items.map((item, i) => {
            const isVideo = item.type === 'video';
            const hasTargetUrl = Boolean(item.targetUrl);
            const hasCaseStudy = Boolean(item.caseStudy && item.caseStudy.enabled !== false);
            const hasDocument = Boolean(item.documentUrl);
            let thumbUrl = item.url;

            if (isVideo) {
                if (item.url.includes('youtube.com/watch?v=')) {
                    const vid = item.url.includes('v=') ? item.url.split('v=')[1].split('&')[0] : (item.url.includes('youtu.be/') ? item.url.split('youtu.be/')[1].split('?')[0] : (item.url.includes('embed/') ? item.url.split('embed/')[1].split('?')[0] : ''));
                    thumbUrl = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
                } else if (item.url.includes('youtu.be/')) {
                    const vid = item.url.split('youtu.be/')[1].split('?')[0];
                    thumbUrl = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
                } else {
                    thumbUrl = 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=800&q=80';
                }
            }

            const badgeHtml = item.badge ? `<span class="portfolio-badge">${item.badge}</span>` : (isVideo ? '<span class="video-badge">Vidéo</span>' : '');
            const tagsHtml = Array.isArray(item.tags) ? `<div class="portfolio-tags">${item.tags.map(t => `<span class="portfolio-tag">${t}</span>`).join('')}</div>` : '';

            // ── [CAND-06 & CAND-07] Boutons d'Action enrichis ──
            const ctaBtn = hasTargetUrl
                ? `<a href="${item.targetUrl}" target="_blank" rel="noopener" class="btn-view-live" onclick="event.stopPropagation();"><span class="lang-fr">Tester le site en direct ↗</span><span class="lang-en">Test live demo ↗</span></a>`
                : '';
            const caseStudyBtn = hasCaseStudy
                ? `<button type="button" class="btn-case-study" onclick="event.stopPropagation(); window.App?.openCaseStudyModal('${item.id || i}');"><span><span class="lang-fr">Étude de cas ↗</span><span class="lang-en">Case study ↗</span></span></button>`
                : '';
            const docBtn = hasDocument
                ? `<a href="${item.documentUrl}" target="_blank" rel="noopener noreferrer" download="${item.documentLabel || 'Document.pdf'}" class="btn-doc-download" onclick="event.stopPropagation();"><span>${item.documentLabel || 'Livrable PDF'}</span></a>`
                : '';

            const actionsHtml = (ctaBtn || caseStudyBtn || docBtn)
                ? `<div class="gallery-card-actions">${ctaBtn}${caseStudyBtn}${docBtn}</div>`
                : '';

            let clickAction = '';
            if (hasCaseStudy) {
                clickAction = `window.App?.openCaseStudyModal('${item.id || i}')`;
            } else if (hasTargetUrl) {
                clickAction = `window.open('${item.targetUrl}', '_blank', 'noopener')`;
            } else {
                clickAction = `openLightbox('${item.url}', '${item.type}')`;
            }

            // N'afficher la barre de navigateur mockup que pour les projets Web avec URL cible
            const showBrowserBar = Boolean(item.displayUrl || hasTargetUrl || galleryVariant === 'browser-mockup');

            const mockupBarHtml = showBrowserBar ? `
                <div class="browser-mockup-bar">
                    <div class="browser-dots">
                        <span class="dot red"></span>
                        <span class="dot yellow"></span>
                        <span class="dot green"></span>
                    </div>
                    <span class="browser-url-bar">${item.displayUrl || (hasTargetUrl ? item.targetUrl.replace('https://', '').replace('/', '') : '')}</span>
                    ${badgeHtml}
                </div>` : '';

            const floatingBadgeHtml = (!showBrowserBar && badgeHtml) ? `
                <div class="gallery-badge-floating">${badgeHtml}</div>` : '';

            const delay = Math.min(i * 0.1, 0.6);

            return `
            <div class="gallery-item-card ${showBrowserBar ? 'browser-card' : 'classic-card'}"
                 style="opacity:1; transform:translateY(0); transition: opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s var(--ease-smooth)"
                 onclick="${clickAction}">
                ${mockupBarHtml}
                <div class="gallery-img-container">
                    <img src="${thumbUrl}" alt="${item.title || 'Réalisation'}" loading="lazy">
                    ${floatingBadgeHtml}
                </div>
                <div class="gallery-card-content">
                    <h3 class="gallery-card-title">${item.title || 'Projet'}</h3>
                    ${item.description ? `<p class="gallery-card-desc">${item.description}</p>` : ''}
                    ${tagsHtml}
                    ${actionsHtml}
                </div>
            </div>`;
        }).join('');
    }

    /**
     * Rendu des Prestations & Tarifs
     */
    async function renderPrestations(isActive) {
        const section = document.getElementById('prestations');
        const grid = document.getElementById('services-grid');
        if (!section) return;

        if (!isActive) {
            section.style.display = 'none';
            return;
        }
        section.style.display = '';

        if (!grid) return;

        let items = [];
        if (window.SiteContent && typeof window.SiteContent.getPrestations === 'function') {
            try {
                items = await window.SiteContent.getPrestations();
            } catch (err) {
                console.error('[SectionRenderer] Erreur prestations:', err);
            }
        }

        if (!Array.isArray(items) || items.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted, var(--texte-secondaire));">Les prestations sont en cours de mise à jour.</p>';
            return;
        }

        const globalSiteConfig = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG : (typeof window !== 'undefined' ? window.SITE_CONFIG : null);
        const prestaVariant = globalSiteConfig?.variants?.prestations || 'pricing-cards';
        const isGlobalExpertise = prestaVariant === 'cards-expertise';

        if (prestaVariant === 'menu-list') {
            grid.className = 'services-menu-list';
            grid.innerHTML = items.map((item, i) => {
                const delay = Math.min(i * 0.1, 0.5);
                return `
                <div class="menu-list-item reveal" style="animation-delay:${delay}s">
                    <div class="menu-list-header">
                        <span class="menu-list-title">${item.icon ? `${item.icon} ` : ''}${item.title || ''}</span>
                        <span class="menu-list-leader"></span>
                        <span class="menu-list-price">${item.price || ''}</span>
                    </div>
                    ${item.description ? `<p class="menu-list-desc">${item.description}</p>` : ''}
                    ${Array.isArray(item.features) && item.features.length > 0 ? `
                        <div class="menu-list-features">${item.features.map(f => `<span class="menu-feature-pill">✦ ${f}</span>`).join('')}</div>
                    ` : ''}
                </div>`;
            }).join('');
            return;
        }

        grid.className = 'services-grid reveal-stagger';

        grid.innerHTML = items.map((item, i) => {
            const delay = Math.min(i * 0.1, 0.5);
            const isCardExpertise = isGlobalExpertise || item.variant === 'cards-expertise' || Boolean(item.skills && !item.price);
            const badgeHtml = item.badge ? `<div class="pricing-badge">${item.badge}</div>` : '';
            const isFeatured = item.badge ? 'featured-pricing' : '';

            // Features ou Skills list
            let featuresHtml = '';
            if (Array.isArray(item.skills) && item.skills.length > 0) {
                featuresHtml = `<ul class="pricing-features expertise-skills-list">${item.skills.map(s => `<li><span class="check-icon">✓</span><span>${s}</span></li>`).join('')}</ul>`;
            } else if (Array.isArray(item.features) && item.features.length > 0) {
                featuresHtml = `<ul class="pricing-features">${item.features.map(f => `<li><span class="check-icon">✓</span><span>${f}</span></li>`).join('')}</ul>`;
            }

            // Price splitting (masqué si variante expertise)
            let pricingBoxHtml = '';
            if (!isCardExpertise && item.price) {
                let rawPrice = item.price;
                let mainPrice = rawPrice;
                let subPrice = '';
                if (rawPrice.includes('(')) {
                    const parts = rawPrice.split('(');
                    mainPrice = parts[0].trim();
                    subPrice = parts[1].replace(')', '').trim();
                }
                pricingBoxHtml = `
                    <div class="pricing-box">
                        <div class="price-main">${mainPrice}</div>
                        ${subPrice ? `<div class="price-sub">${subPrice}</div>` : ''}
                    </div>
                `;
            }

            const ctaHref = item.ctaUrl || (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.actions && SITE_CONFIG.actions.primaryCta ? SITE_CONFIG.actions.primaryCta.url : '') || '#contact';
            const defaultCtaLabel = isCardExpertise ? 'Demander une étude' : (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.actions && SITE_CONFIG.actions.primaryCta ? SITE_CONFIG.actions.primaryCta.label : 'Nous contacter');

            let iconHtml = '';
            if (item.id === 'offre-essentiel' || (item.icon && item.icon.includes('⚡'))) {
                iconHtml = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>';
            } else if (item.id === 'offre-autonome' || (item.icon && item.icon.includes('🚀'))) {
                iconHtml = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
            } else if (item.icon && !item.icon.match(/[\u2600-\u27bf\u{1f300}-\u{1f6ff}]/u)) {
                iconHtml = item.icon;
            } else {
                iconHtml = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';
            }

            return `
            <div class="service-card ${isFeatured} ${isCardExpertise ? 'expertise-card' : ''}" style="opacity:1; transform:translateY(0); transition: opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s var(--ease-smooth)">
                ${badgeHtml}
                <div class="service-icon">${iconHtml}</div>
                <h3 class="service-name">${item.title || ''}</h3>
                <p class="service-desc">${item.description || ''}</p>
                ${pricingBoxHtml}
                ${featuresHtml}
                <a href="${ctaHref}" ${ctaHref.startsWith('#') ? '' : 'target="_blank" rel="noopener"'} class="btn-primary btn-pricing">
                    ${item.ctaText || defaultCtaLabel}
                </a>
            </div>`;
        }).join('');
    }

    /**
     * Rendu des Logos Partenaires
     */
    async function renderPartners(isActive) {
        const section = document.getElementById('partenaires');
        const grid = document.getElementById('partners-grid');
        if (!section) return;
        if (!isActive) {
            section.style.display = 'none';
            return;
        }

        let partners = [];
        if (window.SiteContent && typeof window.SiteContent.getFullContent === 'function') {
            try {
                const content = await window.SiteContent.getFullContent();
                partners = content.partners || [];
            } catch (err) {
                console.warn('[SectionRenderer] Erreur partners:', err);
            }
        }
        if ((!Array.isArray(partners) || partners.length === 0) && typeof DEFAULT_CONTENT !== 'undefined' && Array.isArray(DEFAULT_CONTENT.partners)) {
            partners = DEFAULT_CONTENT.partners;
        }

        if (!Array.isArray(partners) || partners.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = '';

        const globalSiteConfig = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG : (typeof window !== 'undefined' ? window.SITE_CONFIG : null);
        const partnerVariant = globalSiteConfig?.variants?.partners || (partners.some(p => p.imageUrl || p.category) ? 'brand-showcase' : 'logo-cloud');

        if (grid) {
            grid.className = `partners-grid ${partnerVariant === 'logo-cloud' ? 'logo-cloud-grid' : 'brand-showcase-grid'} reveal-stagger`;
            grid.innerHTML = partners.map(p => {
                if (partnerVariant === 'logo-cloud' || (p.logoUrl && !p.imageUrl)) {
                    return `
                    <div class="partner-item partner-logo">
                        <img src="${p.logoUrl || p.imageUrl}" alt="${p.name || 'Partenaire'}" loading="lazy">
                    </div>`;
                }
                const subtitle = p.description || p.category || (
                    p.name.toLowerCase().includes('murphy') ? 'Soins Haute Performance Sans Sulfates' :
                        p.name.toLowerCase().includes('tokio') ? 'Protocole Réparateur Japonais' :
                            p.name.toLowerCase().includes('davines') ? 'Formules Botaniques & Éco-Conçues' : 'Maison d\'Excellence'
                );
                const imgHtml = p.imageUrl ? `
                    <div class="partner-card-img">
                        <img src="${p.imageUrl}" alt="${p.name || 'Marque'}" loading="lazy">
                    </div>` : '';

                return `
                <div class="partner-item partner-card ${p.imageUrl ? 'has-image' : ''}">
                    ${imgHtml}
                    <div class="partner-card-body">
                        <span class="partner-brand-name">${p.name || ''}</span>
                        ${subtitle ? `<span class="partner-brand-sub">${subtitle}</span>` : ''}
                    </div>
                </div>`;
            }).join('');
        }
    }

    /**
     * Rendu du Processus & Méthode en étapes
     */
    async function renderProcess(isActive) {
        const section = document.getElementById('methode');
        const grid = document.getElementById('process-grid');
        if (!section) return;

        if (!isActive) {
            section.style.display = 'none';
            return;
        }

        let processData = null;
        if (window.SiteContent && typeof window.SiteContent.getFullContent === 'function') {
            try {
                const content = await window.SiteContent.getFullContent();
                processData = content.process;
            } catch (err) {
                console.warn('[SectionRenderer] Erreur process:', err);
            }
        }

        if (!processData && typeof DEFAULT_CONTENT !== 'undefined') {
            processData = DEFAULT_CONTENT.process;
        }

        if (!processData || !Array.isArray(processData.steps) || processData.steps.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = '';

        const eyebrowEl = section.querySelector('.section-eyebrow');
        if (eyebrowEl && processData.eyebrow) eyebrowEl.textContent = processData.eyebrow;

        const titleEl = section.querySelector('h2');
        if (titleEl && processData.titleHtml) titleEl.innerHTML = processData.titleHtml;

        if (grid) {
            grid.innerHTML = processData.steps.map((step, i) => `
                <div class="process-card">
                    <div class="process-number">${step.number || '0' + (i + 1)}</div>
                    <h3 class="process-title">${step.title || ''}</h3>
                    <p class="process-desc">${step.description || ''}</p>
                </div>
            `).join('');
        }
    }

    /**
     * Rendu des Témoignages Clients
     */
    async function renderTestimonials(isActive) {
        const section = document.getElementById('temoignages');
        const grid = document.getElementById('testimonials-grid');
        if (!section) return;
        if (!isActive) {
            section.style.display = 'none';
            return;
        }

        let items = [];
        if (window.SiteContent && typeof window.SiteContent.getFullContent === 'function') {
            try {
                const content = await window.SiteContent.getFullContent();
                items = content.testimonials || [];
            } catch (err) {
                console.warn('[SectionRenderer] Erreur testimonials:', err);
            }
        }
        if ((!Array.isArray(items) || items.length === 0) && typeof DEFAULT_CONTENT !== 'undefined' && Array.isArray(DEFAULT_CONTENT.testimonials)) {
            items = DEFAULT_CONTENT.testimonials;
        }

        if (!Array.isArray(items) || items.length === 0) {
            section.style.display = 'none';
            return;
        }

        const globalSiteConfig = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG : (typeof window !== 'undefined' ? window.SITE_CONFIG : null);
        const testiVariant = globalSiteConfig?.variants?.testimonials || 'cards-grid';

        if (testiVariant === 'quote-editorial' && items.length > 0) {
            const first = items[0];
            const rating = Math.max(1, Math.min(5, parseInt(first.rating, 10) || 5));
            const stars = '★'.repeat(rating);
            grid.className = 'testimonials-quote-editorial';
            grid.innerHTML = `
                <div class="quote-editorial-box reveal">
                    <div class="stars-rating" style="justify-content:center; margin-bottom:var(--space-md);">${stars}</div>
                    <blockquote class="quote-editorial-text">“${first.text || ''}”</blockquote>
                    <div class="quote-editorial-author">
                        <span class="author-name">${first.author || ''}</span>
                        ${first.role ? `<span class="author-role"> — ${first.role}</span>` : ''}
                    </div>
                </div>
            `;
            return;
        }

        grid.className = 'testimonials-grid reveal-stagger';

        if (grid) {
            grid.innerHTML = items.map((item, i) => {
                const rating = Math.max(1, Math.min(5, parseInt(item.rating, 10) || 5));
                const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
                const initials = (item.author || 'C').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

                return `
                <div class="testimonial-card reveal" style="animation-delay:${i * 0.1}s">
                    <div class="testimonial-header">
                        <div class="stars-rating">${stars}</div>
                        <span class="verified-badge"><span class="badge-check">✓</span> Avis Vérifié</span>
                    </div>
                    <div class="testimonial-quote">“${item.text || ''}”</div>
                    <div class="testimonial-author-box">
                        <div class="author-avatar">${initials}</div>
                        <div class="author-info">
                            <div class="author-name" style="font-weight:600; color:var(--texte-principal, var(--color-text-main));">${item.author || 'Client'}</div>
                            <div class="author-role" style="font-size:0.85rem; color:var(--color-text-muted, var(--texte-secondaire));">${item.role || ''}${item.date ? ` · ${item.date}` : ''}</div>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }
    }

    /**
     * Rendu de la FAQ Accordéon
     */
    async function renderFaq(isActive) {
        const section = document.getElementById('faq');
        const container = document.getElementById('faq-accordion');
        if (!section) return;

        if (!isActive) {
            section.style.display = 'none';
            return;
        }

        let faqList = [];
        if (window.SiteContent && typeof window.SiteContent.getFullContent === 'function') {
            try {
                const content = await window.SiteContent.getFullContent();
                faqList = content.faq || [];
            } catch (err) {
                console.warn('[SectionRenderer] Erreur FAQ:', err);
            }
        }

        if ((!Array.isArray(faqList) || faqList.length === 0) && typeof DEFAULT_CONTENT !== 'undefined' && Array.isArray(DEFAULT_CONTENT.faq)) {
            faqList = DEFAULT_CONTENT.faq;
        }

        if (!Array.isArray(faqList) || faqList.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = '';
        if (container) {
            container.innerHTML = faqList.map((item, i) => `
                <details class="faq-item" ${i === 0 ? 'open' : ''}>
                    <summary class="faq-question">
                        <span>${item.question || ''}</span>
                        <span class="faq-icon" aria-hidden="true">+</span>
                    </summary>
                    <div class="faq-answer">
                        <p>${item.answer || ''}</p>
                    </div>
                </details>
            `).join('');
        }
    }

    /**
     * Rendu des Informations Pratiques
     */
    async function renderPracticalInfo(isActive) {
        const section = document.getElementById('infos-pratiques');
        if (!section) return;
        if (!isActive) {
            section.style.display = 'none';
            return;
        }

        let info = null;
        if (window.SiteContent && typeof window.SiteContent.getFullContent === 'function') {
            try {
                const content = await window.SiteContent.getFullContent();
                info = content.practicalInfo || null;
            } catch (err) {
                console.warn('[SectionRenderer] Erreur practicalInfo:', err);
            }
        }
        if (!info && typeof DEFAULT_CONTENT !== 'undefined') {
            info = DEFAULT_CONTENT.practicalInfo || null;
        }

        if (!info) {
            section.style.display = 'none';
            return;
        }

        section.style.display = '';

        // Horaires
        const hoursContainer = document.getElementById('hours-list');
        if (hoursContainer && Array.isArray(info.hours)) {
            hoursContainer.innerHTML = info.hours.map(h => `
                <div class="hour-row" style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px dashed var(--color-border); font-size:0.95rem;">
                    <span style="font-weight:600; color:var(--color-text-main);">${h.days}</span>
                    <span style="color:var(--color-primary); font-weight:500;">${h.times}</span>
                </div>
            `).join('');
        }

        // Zones / Communes
        const areasContainer = document.getElementById('areas-badges');
        if (areasContainer && Array.isArray(info.areas)) {
            areasContainer.innerHTML = info.areas.map(area => `
                <span class="area-badge" style="display:inline-block; margin:4px; padding:4px 12px; background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-pill); font-size:0.85rem; color:var(--color-text-main);">${area}</span>
            `).join('');
        }

        // Adresse & Téléphone
        const addressEl = document.getElementById('info-address');
        if (addressEl && info.address) {
            addressEl.textContent = info.address;
        }

        const phoneEl = document.getElementById('info-phone');
        if (phoneEl && info.phone) {
            phoneEl.textContent = info.phone;
            phoneEl.href = `tel:${info.phone.replace(/\s+/g, '')}`;
        }
    }

    /**
     * Rendu du Ticker Défilant Dynamique (Marquee Peps)
     */
    async function renderTicker(isActive) {
        const tickerEl = document.querySelector('.ticker-banner');
        if (!tickerEl) return;

        if (!isActive) {
            tickerEl.style.display = 'none';
            return;
        }
        tickerEl.style.display = '';

        let tickerData = null;
        if (window.SiteContent && typeof window.SiteContent.getFullContent === 'function') {
            try {
                const content = await window.SiteContent.getFullContent();
                if (content && content.ticker) {
                    tickerData = content.ticker;
                }
            } catch (err) {
                console.warn('[SectionRenderer] Erreur lecture ticker:', err);
            }
        }
        if (!tickerData && typeof DEFAULT_CONTENT !== 'undefined' && DEFAULT_CONTENT.ticker) {
            tickerData = DEFAULT_CONTENT.ticker;
        }

        if (tickerData && Array.isArray(tickerData.items) && tickerData.items.length > 0) {
            const trackEl = tickerEl.querySelector('.ticker-track');
            if (trackEl) {
                const itemsHtml = tickerData.items.map(it => {
                    const cleanText = it.replace(/^[✦•\s]+/, '').trim();
                    return `<span>${cleanText}</span><span class="bullet">•</span>`;
                }).join('');

                trackEl.innerHTML = `
                    <div class="ticker-content" id="ticker-content-primary">${itemsHtml}</div>
                    <div class="ticker-content" id="ticker-content-secondary" aria-hidden="true">${itemsHtml}</div>
                `;
            }
        }
    }

    /**
     * Rendu des Bannières Cinémagraphes de Transition
     */
    async function renderBanner(isActive) {
        const banners = document.querySelectorAll('.cine-banner');
        if (!banners.length) return;

        if (!isActive) {
            banners.forEach(b => b.style.display = 'none');
            return;
        }
        banners.forEach(b => b.style.display = '');

        let bannerData = null;
        if (window.SiteContent && typeof window.SiteContent.getFullContent === 'function') {
            try {
                const content = await window.SiteContent.getFullContent();
                if (content && content.banner) {
                    bannerData = content.banner;
                }
            } catch (err) {
                console.warn('[SectionRenderer] Erreur rendu dynamique Banner:', err);
            }
        }
        if (!bannerData && typeof DEFAULT_CONTENT !== 'undefined' && DEFAULT_CONTENT.banner) {
            bannerData = DEFAULT_CONTENT.banner;
        }

        if (bannerData) {
            // Bannière 1 (Primaire)
            const banner1 = banners[0];
            if (banner1 && bannerData.imageUrl) {
                const img1 = banner1.querySelector('img');
                if (img1) {
                    img1.src = bannerData.imageUrl;
                    if (bannerData.alt) img1.alt = bannerData.alt;
                }
                const eyebrow1 = banner1.querySelector('.cine-banner-eyebrow');
                if (eyebrow1 && bannerData.eyebrow) eyebrow1.textContent = bannerData.eyebrow;
                const quote1 = banner1.querySelector('.cine-banner-quote');
                if (quote1 && bannerData.quote) quote1.textContent = bannerData.quote;
                const author1 = banner1.querySelector('.cine-banner-author');
                if (author1 && bannerData.author) author1.textContent = bannerData.author;
            }

            // Bannière 2 (Secondaire / Réassurance) si présente
            const banner2 = banners[1];
            const secondaryData = bannerData.secondary || null;
            if (banner2 && secondaryData && secondaryData.imageUrl) {
                const img2 = banner2.querySelector('img');
                if (img2) {
                    img2.src = secondaryData.imageUrl;
                    if (secondaryData.alt) img2.alt = secondaryData.alt;
                }
                const eyebrow2 = banner2.querySelector('.cine-banner-eyebrow');
                if (eyebrow2 && secondaryData.eyebrow) eyebrow2.textContent = secondaryData.eyebrow;
                const quote2 = banner2.querySelector('.cine-banner-quote');
                if (quote2 && secondaryData.quote) quote2.textContent = secondaryData.quote;
                const author2 = banner2.querySelector('.cine-banner-author');
                if (author2 && secondaryData.author) author2.textContent = secondaryData.author;
            }
        }
    }

    /**
     * Rendu de la section Contact & Formulaire
     */
    async function renderContact(isActive) {
        const contactSection = document.getElementById('contact');
        if (!contactSection) return;

        if (!isActive) {
            contactSection.style.display = 'none';
            return;
        }
        contactSection.style.display = '';
    }

    /**
     * Rendu de la Timeline / Parcours Chronologique (CAND-04)
     */
    async function renderTimeline(isActive) {
        const section = document.getElementById('parcours');
        const container = document.getElementById('timeline-container');
        if (!section) return;

        if (!isActive) {
            section.style.display = 'none';
            return;
        }
        section.style.display = '';

        if (!container) return;

        let items = [];
        if (window.SiteContent && typeof window.SiteContent.getTimeline === 'function') {
            try {
                items = await window.SiteContent.getTimeline();
            } catch (err) {
                console.error('[SectionRenderer] Erreur timeline:', err);
            }
        } else if (typeof DEFAULT_CONTENT !== 'undefined' && Array.isArray(DEFAULT_CONTENT.timeline)) {
            items = DEFAULT_CONTENT.timeline;
        }

        if (!Array.isArray(items) || items.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--color-text-muted, var(--texte-secondaire));">Aucun jalon chronologique renseigné.</p>';
            return;
        }

        container.innerHTML = `
            <div class="timeline">
                ${items.map((item, i) => `
                    <div class="timeline-item reveal" style="animation-delay:${i * 0.1}s">
                        <div class="timeline-dot"></div>
                        <div class="timeline-date">${item.date || ''}</div>
                        <div class="timeline-content">
                            <h3>${item.title || ''}</h3>
                            ${item.location ? `<p class="timeline-location">${item.location}</p>` : ''}
                            <p class="timeline-desc">${item.description || ''}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ─────────────────────────────────────────────────────────────
    // 2. REGISTRE EXPLICITE
    // ─────────────────────────────────────────────────────────────
    const SECTION_REGISTRY = {
        'hero': renderHero,
        'ticker': renderTicker,
        'banner': renderBanner,
        'about': renderAbout,
        'partners': renderPartners,
        'process': renderProcess,
        'looks': renderLooks,
        'gallery': renderGallery,
        'beforeAfter': renderBeforeAfter,
        'prestations': renderPrestations,
        'timeline': renderTimeline,
        'testimonials': renderTestimonials,
        'faq': renderFaq,
        'practicalInfo': renderPracticalInfo,
        'contact': renderContact
    };

    const SECTION_NAV_MAP = {
        'hero': '#accueil',
        'about': '#apropos',
        'process': '#methode',
        'looks': '#looks',
        'gallery': '#gallery',
        'beforeAfter': '#glow-slider-section',
        'prestations': '#prestations',
        'timeline': '#parcours',
        'testimonials': '#temoignages',
        'faq': '#faq',
        'practicalInfo': '#infos-pratiques',
        'contact': '#contact'
    };

    /**
     * Rendu dynamique des métadonnées (<title> et <meta description>)
     */
    async function renderMeta() {
        if (window.SiteContent && typeof window.SiteContent.getFullContent === 'function') {
            try {
                const content = await window.SiteContent.getFullContent();
                if (content && content.meta) {
                    if (content.meta.title) {
                        document.title = content.meta.title;
                    }
                    if (content.meta.description) {
                        const descEl = document.querySelector('meta[name="description"]');
                        if (descEl) {
                            descEl.setAttribute('content', content.meta.description);
                        }
                    }
                }
            } catch (e) {
                console.warn('[SectionRenderer] Erreur renderMeta:', e);
            }
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 3. MOTEUR PRINCIPAL DU SECTIONRENDERER
    // ─────────────────────────────────────────────────────────────
    window.SectionRenderer = {
        registry: SECTION_REGISTRY,

        async renderAll(customSectionsConfig) {
            await renderMeta();

            const globalSiteConfig = (typeof SITE_CONFIG !== 'undefined') ? SITE_CONFIG : (typeof window !== 'undefined' ? window.SITE_CONFIG : null);
            const sectionsConfig = customSectionsConfig ||
                (globalSiteConfig && globalSiteConfig.sections) ||
                null;

            if (!sectionsConfig || !Array.isArray(sectionsConfig.order)) {
                return;
            }

            const { order, active = {} } = sectionsConfig;

            // 1. Masquer systématiquement toutes les sections de SECTION_REGISTRY inactives ou omises d'order
            for (const sectionKey of Object.keys(SECTION_REGISTRY)) {
                const isOrdered = order.includes(sectionKey);
                const isActive = isOrdered && (active[sectionKey] !== false);
                if (!isActive) {
                    const renderFn = SECTION_REGISTRY[sectionKey];
                    if (typeof renderFn === 'function') {
                        try { await renderFn(false); } catch (e) { }
                    }
                }
            }

            // 2. Rendre les sections ordonnées et actives
            for (const sectionKey of order) {
                const isActive = active[sectionKey] !== false;
                if (isActive) {
                    const renderFn = SECTION_REGISTRY[sectionKey];
                    if (typeof renderFn === 'function') {
                        try {
                            await renderFn(true);
                        } catch (err) {
                            console.error(`[SectionRenderer] Erreur lors du rendu de '${sectionKey}':`, err);
                        }
                    }
                }
            }

            this.syncNavbar(order, active);
        },

        syncNavbar(order, active) {
            const navLinksContainer = document.querySelector('.nav-links');
            if (!navLinksContainer) return;

            const links = navLinksContainer.querySelectorAll('a[href^="#"]');
            const activeAnchors = new Set();

            order.forEach(sectionKey => {
                if (active[sectionKey] !== false && SECTION_NAV_MAP[sectionKey]) {
                    activeAnchors.add(SECTION_NAV_MAP[sectionKey]);
                }
            });

            links.forEach(link => {
                const anchor = link.getAttribute('href');
                const parentLi = link.closest('li');
                const target = parentLi || link;

                if (anchor === '#accueil' || activeAnchors.has(anchor)) {
                    target.style.display = '';
                } else {
                    target.style.display = 'none';
                }
            });
        }
    };

    // Auto-initialisation au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (window.SectionRenderer && typeof window.SectionRenderer.renderAll === 'function') {
                window.SectionRenderer.renderAll();
            }
        });
    } else {
        if (window.SectionRenderer && typeof window.SectionRenderer.renderAll === 'function') {
            window.SectionRenderer.renderAll();
        }
    }
})();
