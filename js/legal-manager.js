/**
 * LEGAL-MANAGER.JS — Gestionnaire Juridique & Consentement Cookies RGPD (CNIL)
 * ==========================================================================
 * Conforme à la loi LCEN, RGPD (2016/679), Recommandations CNIL et RGAA.
 * Spécifiquement configuré pour WebExpresso (Création de Sites Vitrine Express).
 * ==========================================================================
 */

(function () {
    'use strict';

    const COOKIE_STORAGE_KEY = 'we_cookie_consent_v1';
    const CONSENT_DURATION_DAYS = 180; // 6 mois (recommandation CNIL)

    // Configuration légale WebExpresso
    function getLegalConfig() {
        const cfg = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.legal) ? SITE_CONFIG.legal : {};
        const identity = (typeof DEFAULT_CONTENT !== 'undefined' && DEFAULT_CONTENT.identity) ? DEFAULT_CONTENT.identity : {};
        const siteName = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.siteName) ? SITE_CONFIG.siteName : 'WebExpresso';

        return {
            companyName: cfg.companyName || siteName,
            legalForm: cfg.legalForm || 'Collectif d\'étudiants entrepreneurs (Grenoble INP & École de commerce) — Immatriculation professionnelle en cours d\'enregistrement',
            capital: cfg.capital || null,
            headquarters: cfg.headquarters || 'Grenoble, Isère (38000), France',
            rcsOrRm: cfg.rcsOrRm || 'RCS Grenoble en cours d\'attribution',
            siret: cfg.siret || 'SIRET en cours d\'attribution',
            vatNumber: cfg.vatNumber || 'TVA non applicable, art. 293 B du CGI',
            publishingDirector: cfg.publishingDirector || 'L\'Équipe WebExpresso (Joachim Kahan et associés)',
            contactEmail: cfg.contactEmail || 'contact@webexpresso.fr',
            contactPhone: cfg.contactPhone || 'Via le formulaire en ligne ou par email',
            dpoEmail: cfg.dpoEmail || 'contact@webexpresso.fr',
            host: {
                name: cfg.host?.name || 'Netlify Inc. / Datacenter sécurisé en Europe',
                address: cfg.host?.address || '510 20th Street, Suite 500, San Francisco, CA 94107, USA (Certifié ISO 27001)',
                phone: cfg.host?.phone || '+1 844-463-8543',
                website: cfg.host?.website || 'https://www.netlify.com'
            },
            mediator: {
                name: cfg.mediator?.name || 'CNPM MÉDIATION CONSOMMATION',
                website: cfg.mediator?.website || 'https://www.cnpm-mediation-consommation.eu',
                address: cfg.mediator?.address || '27 avenue de la Libération, 42400 Saint-Chamond'
            },
            cookies: {
                enabled: cfg.cookies?.enabled !== false,
                bannerVersion: cfg.cookies?.bannerVersion || '2026.1'
            },
            accessibility: {
                status: cfg.accessibility?.status || 'partiellement_conforme'
            }
        };
    }

    // ─────────────────────────────────────────────────────────────
    // 1. GESTION DES COOKIES (CNIL CONFORME)
    // ─────────────────────────────────────────────────────────────

    function getCookieConsent() {
        try {
            const raw = localStorage.getItem(COOKIE_STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            const now = new Date().getTime();
            const ageDays = (now - parsed.timestamp) / (1000 * 60 * 60 * 24);
            if (ageDays > CONSENT_DURATION_DAYS) {
                localStorage.removeItem(COOKIE_STORAGE_KEY);
                return null;
            }
            return parsed;
        } catch (e) {
            return null;
        }
    }

    function saveCookieConsent(preferences) {
        const consentData = {
            necessary: true,
            analytics: Boolean(preferences.analytics),
            multimedia: Boolean(preferences.multimedia),
            timestamp: new Date().getTime(),
            version: '2026.1'
        };
        try {
            localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(consentData));
        } catch (e) {
            console.warn('Impossible de sauvegarder le consentement cookie :', e);
        }

        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consentData }));
        hideCookieBanner();
        closeCookieModal();
    }

    function hideCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.setAttribute('aria-hidden', 'true');
            banner.classList.remove('active');
        }
    }

    function showCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.setAttribute('aria-hidden', 'false');
            banner.classList.add('active');
        }
    }

    window.openCookieSettings = function () {
        const modal = document.getElementById('cookie-settings-modal');
        if (!modal) return;
        const current = getCookieConsent() || { necessary: true, analytics: false, multimedia: false };
        const analyticsInput = document.getElementById('cookie-opt-analytics');
        const multimediaInput = document.getElementById('cookie-opt-multimedia');
        if (analyticsInput) analyticsInput.checked = Boolean(current.analytics);
        if (multimediaInput) multimediaInput.checked = Boolean(current.multimedia);
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    function closeCookieModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            if (!document.querySelector('#legal-modal.active')) {
                document.body.style.overflow = '';
            }
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. GESTION DE LA MODALE JURIDIQUE
    // ─────────────────────────────────────────────────────────────

    window.openLegalModal = function (tabId = 'mentions') {
        const modal = document.getElementById('legal-modal');
        if (!modal) return;

        populateLegalTexts();
        switchLegalTab(tabId);

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const closeBtn = modal.querySelector('.legal-modal-close');
        if (closeBtn) closeBtn.focus();
    };

    window.closeLegalModal = function () {
        const modal = document.getElementById('legal-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            if (!document.querySelector('#cookie-settings-modal.active')) {
                document.body.style.overflow = '';
            }
        }
    };

    function switchLegalTab(tabId) {
        const modal = document.getElementById('legal-modal');
        if (!modal) return;

        const tabBtns = modal.querySelectorAll('.legal-tab-btn');
        tabBtns.forEach(btn => {
            const isActive = btn.getAttribute('data-tab') === tabId;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        const panels = modal.querySelectorAll('.legal-panel');
        panels.forEach(panel => {
            const isActive = panel.id === `legal-panel-${tabId}`;
            panel.classList.toggle('active', isActive);
            panel.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 3. INJECTION DYNAMIQUE DES TEXTES LÉGAUX
    // ─────────────────────────────────────────────────────────────

    function populateLegalTexts() {
        const legal = getLegalConfig();

        // 1. Mentions Légales LCEN
        const elPublisher = document.getElementById('legal-info-publisher');
        if (elPublisher) {
            elPublisher.innerHTML = `
                <p><strong>Dénomination / Marque :</strong> ${legal.companyName}</p>
                <p><strong>Structure :</strong> ${legal.legalForm}</p>
                <p><strong>Siège & Localisation :</strong> ${legal.headquarters}</p>
                <p><strong>Immatriculation :</strong> ${legal.rcsOrRm}</p>
                <p><strong>Numéro SIRET :</strong> ${legal.siret}</p>
                <p><strong>TVA Intracommunautaire :</strong> ${legal.vatNumber}</p>
                <p><strong>Direction de la Publication :</strong> ${legal.publishingDirector}</p>
                <p><strong>Contact Électronique :</strong> <a href="mailto:${legal.contactEmail}">${legal.contactEmail}</a></p>
                <p><strong>Commande :</strong> questionnaire « Démarrer mon projet » gratuit sur ce site (transmis par FormSubmit) ; règlement de la formule retenue en ligne par Stripe après validation du récapitulatif.</p>
            `;
        }

        const elHost = document.getElementById('legal-info-host');
        if (elHost) {
            elHost.innerHTML = `
                <p><strong>Hébergeur de la Plateforme :</strong> ${legal.host.name}</p>
                <p><strong>Adresse de l'Hébergeur :</strong> ${legal.host.address}</p>
                <p><strong>Téléphone :</strong> ${legal.host.phone}</p>
                <p><strong>Site Officiel :</strong> <a href="${legal.host.website}" target="_blank" rel="noopener noreferrer">${legal.host.website}</a></p>
            `;
        }

        const elMediator = document.getElementById('legal-info-mediator');
        if (elMediator) {
            elMediator.innerHTML = `
                <p>Conformément à l'article L.612-1 du Code de la consommation, tout client consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d'un litige :</p>
                <p><strong>Médiateur Référent :</strong> ${legal.mediator.name}</p>
                <p><strong>Adresse Postale :</strong> ${legal.mediator.address}</p>
                <p><strong>Plateforme de saisine en ligne :</strong> <a href="${legal.mediator.website}" target="_blank" rel="noopener noreferrer">${legal.mediator.website}</a></p>
            `;
        }

        // 2. Politique de Confidentialité (RGPD)
        const elPrivacy = document.getElementById('legal-info-privacy');
        if (elPrivacy) {
            elPrivacy.innerHTML = `
                <p><strong>Responsable du Traitement :</strong> L'Équipe WebExpresso (représentée par la direction éditoriale).</p>
                <p><strong>Contact Référent Données Personnelles :</strong> <a href="mailto:${legal.dpoEmail}">${legal.dpoEmail}</a>.</p>
                <p><strong>Données Collectées :</strong> Nom, prénom, adresse électronique, numéro de téléphone éventuel, description de votre activité professionnelle, choix des couleurs, photographies et textes transmis volontairement lors du remplissage du questionnaire « Démarrer mon projet » ou par échange email.</p>
                <p><strong>Finalités du Traitement :</strong> Traitement de votre demande gratuite de création de site et des choix de formule (Essentiel 200 €, Autonome + évolutions 200 € + 30 €/mois, Autonome + accompagnement 250 € + 50 €/mois, ou offre sur demande à 500 €), gestion du questionnaire en ligne, conception du site et suivi de la facturation.</p>
                <p><strong>Bases Légales :</strong> Exécution de mesures précontractuelles et contractuelles (art. 6.1.b du RGPD) ainsi que votre consentement explicite donné lors de la soumission du formulaire.</p>
                <p><strong>Durée de Conservation :</strong> Les données des demandes n'aboutissant pas à une commande finale sont supprimées ou archivées sous 3 ans à compter du dernier échange. Les données de facturation et dossiers de livraison sont conservés 10 ans conformément aux obligations du Code de commerce.</p>
                <p><strong>Sécurité & Destinataires :</strong> Vos données sont traitées de manière strictement confidentielle et sécurisée (chiffrement TLS). Elles ne sont jamais revendues ni cédées à des tiers. Prestataires techniques : FormSubmit (transmission du questionnaire), Google (messagerie Gmail), Stripe (paiement sécurisé en ligne), GitHub / GitHub Pages et Firebase (hébergement et espace pro). Certains peuvent traiter les données hors de l'Union européenne ; le détail figure dans la partie « Vos données » du questionnaire.</p>
                <p><strong>Vos Droits :</strong> Vous bénéficiez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données personnelles. Vous pouvez faire valoir ces droits à tout moment en écrivant à <a href="mailto:${legal.dpoEmail}">${legal.dpoEmail}</a>.</p>
                <p>En cas de réclamation non résolue, vous disposez du droit légal d'introduire une plainte auprès de l'autorité compétente : la <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés — <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).</p>
            `;
        }

        // 3. CGU & Conditions Générales de Vente (Grille Tarifaire Novembre 2026 WebExpresso)
        const elCgu = document.getElementById('legal-info-cgu');
        if (elCgu) {
            elCgu.innerHTML = `
                <div class="sav-notice-box">
                    <p><strong>Validation juridique :</strong> Les clauses d'engagement minimum, de résiliation anticipée et d'acquisition de droits ci-dessous doivent être validées par un professionnel du droit dans des CGV écrites avant leur signature.</p>
                </div>

                <h4>1. Présentation de l'Offre & Tarifs (Novembre 2026)</h4>
                <p>Le questionnaire et l'aperçu personnalisé sont gratuits (aucun acompte préalable demandé avant commande). WebExpresso propose trois offres affichées et une offre sur demande :</p>
                <p>• <strong>Essentiel — 200 €, paiement unique :</strong> site vitrine fixe, sans espace privé d'administration.</p>
                <p>• <strong>Autonome + évolutions — 200 € + 30 €/mois, engagement de 3 mois minimum (soit 290 € au minimum : 200 + 3 × 30 €) :</strong> inclut l'espace pro privé et l'ajout de fonctionnalités à la demande par le développeur (2 petites demandes de moins de 30 min par mois, non reportables + 1 évolution plus importante par trimestre, délai cible de 5 à 10 jours ouvrés).</p>
                <p>• <strong>Autonome + accompagnement commercial/marketing — 250 € + 50 €/mois, engagement de 3 mois minimum (soit 400 € au minimum : 250 + 3 × 50 €) :</strong> inclut l'espace pro privé et un accompagnement réalisé par le commercial apporteur (1 point mensuel + 2 contenus/publications préparés par mois + mise à jour des offres sur le site ; aucune promesse de résultat commercial, de visibilité ou de classement).</p>
                <p>• <strong>Offre sur demande (hors vitrine) — Autonome avec espace pro à vie : 500 €, paiement unique, sans abonnement :</strong> inclut l'espace pro à vie ; l'hébergement (via GitHub Pages) et le nom de domaine restent au nom et à la charge du client.</p>

                <h4>2. Engagement Minimum, Résiliation & Reprise d'Abonnement</h4>
                <p>Le total de l'engagement minimum (<strong>290 €</strong> pour Autonome + évolutions, <strong>400 €</strong> pour Autonome + accompagnement) est affiché dans le récapitulatif avant paiement avec case à cocher d'acceptation.</p>
                <p>• <strong>Résiliation avant la fin des 3 mois minimum :</strong> les mensualités restantes de la période d'engagement initial de 3 mois restent dues.</p>
                <p>• <strong>Vous gardez toujours votre site si vous arrêtez :</strong> après la période minimale de 3 mois, le client peut arrêter l'abonnement à tout moment avec <strong>aucun frais d'annulation</strong>. Il conserve son site vitrine statique mais perd l'accès à l'espace pro (sauf acquisition à vie après 12 mois).</p>
                <p>• <strong>Acquisition de l'espace pro après 12 mois & reprise :</strong> après 12 mois cumulés d'abonnement, l'espace pro est acquis à vie, même si le client arrête l'abonnement. En cas de reprise d'abonnement après un arrêt, les mois déjà payés comptent pour atteindre ce seuil de 12 mois.</p>

                <h4>3. Propriété du Site & Périmètre Technique (« À vie »)</h4>
                <p>Le client conserve son site en toute circonstance en cas d'arrêt. Lorsque l'espace pro est acquis à vie (après 12 mois cumulés d'abonnement ou via la formule sur demande à 500 €), l'espace pro reste accessible sans abonnement mensuel ; l'hébergement du site (via GitHub Pages / GitHub) et le nom de domaine (~10–15 €/an) demeurent au nom et à la charge du client, et les évolutions techniques hors espace pro relèvent du SAV à la carte.</p>

                <h4>4. Droit de Rétractation & Prestations Personnalisées</h4>
                <p>Conformément à l'<strong>article L.221-28 3° du Code de la consommation</strong>, les prestations confectionnées selon les spécifications du client ou nettement personnalisées obéissent au régime légal applicable, sous réserve de validation des CGV définitives par un conseiller juridique.</p>
            `;
        }

        // 4. Accessibilité RGAA
        const elA11y = document.getElementById('legal-info-accessibility');
        if (elA11y) {
            const statusLabel = legal.accessibility.status === 'totalement_conforme' 
                ? 'Totalement conforme au RGAA' 
                : (legal.accessibility.status === 'partiellement_conforme' ? 'Partiellement conforme au RGAA' : 'Non conforme au RGAA');
            elA11y.innerHTML = `
                <p><strong>État de Conformité :</strong> ${statusLabel}.</p>
                <p>WebExpresso s'engage avec conviction à rendre ses interfaces numériques accessibles à tous les internautes, y compris aux personnes en situation de handicap, en application des normes du Référentiel Général d'Amélioration de l'Accessibilité (RGAA) et des standards internationaux WCAG 2.1 niveau AA.</p>
                <p>Ce site intègre notamment :</p>
                <p>• Des contrastes colorimétriques rigoureux conformes aux ratios WCAG AA (minimum 4.5:1 sur les textes et boutons d'action).<br>
                • Une navigation structurée avec repères ARIA, hiérarchie sémantique des titres (H1 à H4) et indicateurs visuels de focus clavier.<br>
                • Des alternatives textuelles sur les visuels et des boutons explicites dotés d'étiquettes d'accessibilité.<br>
                • Le respect des préférences système des utilisateurs (notamment le mode mouvement réduit <code>prefers-reduced-motion</code>).</p>
                <p>Si vous constatez un obstacle d'accessibilité numérique sur notre site, vous pouvez nous contacter directement à <a href="mailto:${legal.contactEmail}">${legal.contactEmail}</a> pour bénéficier d'une assistance ou d'un format accessible alternatif.</p>
            `;
        }

        // 5. Garanties & Service Après-Vente (SAV)
        const elSav = document.getElementById('legal-info-sav');
        if (elSav) {
            elSav.innerHTML = `
                <div class="lang-fr">
                    <h4>1. Objet & Périmètre du Service Après-Vente</h4>
                    <p>Ce document de référence définit les garanties et interventions applicables une fois le site internet livré et mis en ligne. WebExpresso s'engage à assurer un accompagnement technique réactif, pérenne et transparent : vous gardez toujours votre site si vous arrêtez un abonnement, sans frais d'annulation après l'engagement minimum de 3 mois.</p>

                    <div class="sav-notice-box">
                        <p><strong>Règle d'or WebExpresso — Le Diagnostic est TOUJOURS gratuit (0 €) :</strong> Avant toute qualification, chiffrage ou intervention, un diagnostic technique complet est réalisé sans aucun frais, quel que soit le verdict final.</p>
                    </div>

                    <h4>2. Tableau Récapitulatif du Périmètre & des Tarifs SAV</h4>
                    <div class="sav-table-container">
                        <table class="sav-table">
                            <thead>
                                <tr>
                                    <th>Cas de figure</th>
                                    <th>Statut & Tarif</th>
                                    <th>Modalités & Justification</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Bug technique de template (dans l'année)</strong></td>
                                    <td><span class="sav-badge-free">Gratuit (0 €)</span></td>
                                    <td>Garantie incluse dans nos formules (Essentiel 200 €, Autonome + évolutions 200 € + 30 €/mois, Autonome + accompagnement 250 € + 50 €/mois, Sur demande 500 €). Présomption par défaut en cas de doute technique.</td>
                                </tr>
                                <tr>
                                    <td><strong>Ajout de fonctionnalités (Autonome + évolutions)</strong></td>
                                    <td><span class="sav-badge-free">Inclus dans l'abonnement</span></td>
                                    <td>2 petites demandes par mois (&lt; 30 min, non reportables) + 1 évolution plus importante par trimestre ; délai cible de 5 à 10 jours ouvrés (devis remisé abonné au-delà).</td>
                                </tr>
                                <tr>
                                    <td><strong>Bug technique de template (après 1 an)</strong></td>
                                    <td><span class="sav-badge-paid">20 € (petite retouche) / 20 €/h</span></td>
                                    <td>Tarif accessible calculé au temps réel passé pour assurer la pérennité de votre site dans la durée.</td>
                                </tr>
                                <tr>
                                    <td><strong>Faute technique WebExpresso (config GitHub, espace pro, routage)</strong></td>
                                    <td><span class="sav-badge-free">Gratuit (cause traçable)</span></td>
                                    <td>Responsabilité WebExpresso dès lors qu'une cause traçable imputable à WebExpresso est identifiée au diagnostic (hébergement GitHub Pages et nom de domaine restent au nom et à la charge du client).</td>
                                </tr>
                                <tr>
                                    <td><strong>Diagnostic préalable (tous cas confondus)</strong></td>
                                    <td><span class="sav-badge-free">Toujours gratuit (0 €)</span></td>
                                    <td>Condition d'entrée systématique avant toute décision, devis ou intervention technique.</td>
                                </tr>
                                <tr>
                                    <td><strong>Contenu mal appliqué (calage initial sous 30 jours)</strong></td>
                                    <td><span class="sav-badge-free">Gratuit (0 €)</span></td>
                                    <td>Continuité du tour de révision post-livraison pour caler parfaitement vos textes, logos et photos initiaux.</td>
                                </tr>
                                <tr>
                                    <td><strong>Modification de texte / ajout d'image (hors espace pro actif)</strong></td>
                                    <td><span class="sav-badge-paid">Forfait 20 €</span></td>
                                    <td>Forfait simple et rapide pour un site Essentiel ou après arrêt de l'abonnement avant 12 mois. <em>(Autonome avec espace pro actif ou acquis après 12 mois).</em></td>
                                </tr>
                                <tr>
                                    <td><strong>Ajout d'un bloc de présentation graphique simple</strong></td>
                                    <td><span class="sav-badge-paid">Forfait 35 €</span></td>
                                    <td>Intégration d'une nouvelle section, composant visuel ou présentation harmonisée hors formule évolutions active.</td>
                                </tr>
                                <tr>
                                    <td><strong>Évolutions complexes / Hors grille</strong></td>
                                    <td><span class="sav-badge-paid">Sur devis</span></td>
                                    <td>Cas non standard ou développements spécifiques évalués au cas par cas avec devis préalable obligatoire.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h4>3. Principes d'Application & Engagements Éthiques</h4>
                    <p>• <strong>Présomption favorable par défaut :</strong> En cas d'hésitation ou de doute technique à la suite du diagnostic, le problème est qualifié en bug de template couvert par la garantie d'un an, et traité sans frais.</p>
                    <p>• <strong>Transparence contractuelle :</strong> Aucune prestation payante n'est engagée sans l'accord préalable, formel et explicite du client. Les modalités d'engagement (3 mois min., 12 mois pour espace pro à vie) relèvent des CGV écrites à valider par un professionnel juridique.</p>
                    <p>• <strong>Accompagnement direct :</strong> Vous êtes en relation directe avec les concepteurs de votre site (étudiants Grenoble INP et école de commerce), sans intermédiaire automatisé.</p>
                </div>

                <div class="lang-en">
                    <h4>1. Scope & Purpose of After-Sales Service (SAV)</h4>
                    <p>This reference policy defines warranties and support procedures applicable once the website is completed and published online. WebExpresso is committed to responsive, long-term, and transparent support: you always keep your website if you stop a subscription, with zero cancellation fees after the 3-month minimum commitment.</p>

                    <div class="sav-notice-box">
                        <p><strong>WebExpresso Golden Rule — Diagnostic is ALWAYS Free (0 €):</strong> Before any qualification, pricing, or technical task, a full diagnostic is performed free of charge, regardless of the final verdict.</p>
                    </div>

                    <h4>2. Summary of Warranties & SAV Rates</h4>
                    <div class="sav-table-container">
                        <table class="sav-table">
                            <thead>
                                <tr>
                                    <th>Scenario</th>
                                    <th>Status & Rate</th>
                                    <th>Terms & Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Template technical bug (within 1 year)</strong></td>
                                    <td><span class="sav-badge-free">Free (0 €)</span></td>
                                    <td>Warranty included in our plans (Essential €200, Autonomous + updates €200 + €30/mo, Autonomous + support €250 + €50/mo, On request €500). Default assumption in case of technical doubt.</td>
                                </tr>
                                <tr>
                                    <td><strong>Feature additions (Autonomous + updates)</strong></td>
                                    <td><span class="sav-badge-free">Included in subscription</span></td>
                                    <td>2 small requests per month (&lt; 30 min, non-rollover) + 1 larger quarterly evolution; target turnaround 5 to 10 business days (discounted subscriber quote beyond quota).</td>
                                </tr>
                                <tr>
                                    <td><strong>Template technical bug (after 1 year)</strong></td>
                                    <td><span class="sav-badge-paid">20 € (minor fix) / 20 €/h</span></td>
                                    <td>Affordable rate covering actual time spent, designed to ensure your website's long-term sustainability.</td>
                                </tr>
                                <tr>
                                    <td><strong>WebExpresso technical fault (GitHub setup, pro dashboard, routing)</strong></td>
                                    <td><span class="sav-badge-free">Free (traceable fault)</span></td>
                                    <td>WebExpresso responsibility whenever a traceable setup cause is identified at diagnostic (GitHub Pages hosting and domain name remain in the client's name and expense).</td>
                                </tr>
                                <tr>
                                    <td><strong>Preliminary diagnostic (all cases)</strong></td>
                                    <td><span class="sav-badge-free">Always free (0 €)</span></td>
                                    <td>Systematic entry condition prior to any decision, quote, or intervention.</td>
                                </tr>
                                <tr>
                                    <td><strong>Initial content adjustment (within 30 days)</strong></td>
                                    <td><span class="sav-badge-free">Free (0 €)</span></td>
                                    <td>Extension of the initial revision round to perfectly align your launch texts and photos.</td>
                                </tr>
                                <tr>
                                    <td><strong>Text modification / image addition (without active pro dashboard)</strong></td>
                                    <td><span class="sav-badge-paid">20 € flat fee</span></td>
                                    <td>Simple and prompt update for Essential websites or after stopping before 12 months. <em>(Autonomous with active or lifetime pro dashboard).</em></td>
                                </tr>
                                <tr>
                                    <td><strong>Simple graphic presentation / new block</strong></td>
                                    <td><span class="sav-badge-paid">35 € flat fee</span></td>
                                    <td>Adding a new visual section or structured layout component outside active feature subscription.</td>
                                </tr>
                                <tr>
                                    <td><strong>Complex features / Custom work</strong></td>
                                    <td><span class="sav-badge-paid">Custom quote</span></td>
                                    <td>Evaluated on a case-by-case basis with prior written approval required.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h4>3. Application Principles & Commitments</h4>
                    <p>• <strong>Default client-first assumption:</strong> If any doubt remains after diagnostic investigation, the issue is categorized as a covered template bug under the 1-year warranty and resolved free of charge.</p>
                    <p>• <strong>Strict pricing transparency:</strong> No billable intervention is ever undertaken without prior, explicit written client consent. Commitment and termination rules must be validated by a legal professional in written T&Cs.</p>
                    <p>• <strong>Direct team support:</strong> You communicate directly with the students who built your site (Grenoble INP & Business School), without call centers or automated barriers.</p>
                </div>
            `;
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 4. INITIALISATION & ÉCOUTEURS D'ÉVÉNEMENTS
    // ─────────────────────────────────────────────────────────────

    function initLegalSystem() {
        const legal = getLegalConfig();

        // 1. Gestion des Cookies
        if (legal.cookies.enabled) {
            const consent = getCookieConsent();
            if (!consent) {
                setTimeout(showCookieBanner, 800);
            }

            const btnAccept = document.getElementById('cookie-btn-accept');
            if (btnAccept) {
                btnAccept.addEventListener('click', function () {
                    saveCookieConsent({ analytics: true, multimedia: true });
                });
            }

            const btnRefuse = document.getElementById('cookie-btn-refuse');
            if (btnRefuse) {
                btnRefuse.addEventListener('click', function () {
                    saveCookieConsent({ analytics: false, multimedia: false });
                });
            }

            const btnCustomize = document.getElementById('cookie-btn-customize');
            if (btnCustomize) {
                btnCustomize.addEventListener('click', function () {
                    hideCookieBanner();
                    window.openCookieSettings();
                });
            }

            const btnSaveSettings = document.getElementById('cookie-save-settings');
            if (btnSaveSettings) {
                btnSaveSettings.addEventListener('click', function () {
                    const analytics = document.getElementById('cookie-opt-analytics')?.checked || false;
                    const multimedia = document.getElementById('cookie-opt-multimedia')?.checked || false;
                    saveCookieConsent({ analytics, multimedia });
                });
            }

            const closeCookieBtn = document.getElementById('cookie-settings-close');
            if (closeCookieBtn) {
                closeCookieBtn.addEventListener('click', closeCookieModal);
            }
        }

        // 2. Gestion des Onglets de la Modale Légale
        const legalModal = document.getElementById('legal-modal');
        if (legalModal) {
            const tabBtns = legalModal.querySelectorAll('.legal-tab-btn');
            tabBtns.forEach(btn => {
                btn.addEventListener('click', function () {
                    const targetTab = this.getAttribute('data-tab');
                    switchLegalTab(targetTab);
                });
            });

            const closeLegalBtn = legalModal.querySelector('.legal-modal-close');
            if (closeLegalBtn) {
                closeLegalBtn.addEventListener('click', window.closeLegalModal);
            }

            legalModal.addEventListener('click', function (e) {
                if (e.target === legalModal) {
                    window.closeLegalModal();
                }
            });
        }

        // 3. Touche Échap
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                if (document.querySelector('#cookie-settings-modal.active')) {
                    closeCookieModal();
                } else if (document.querySelector('#legal-modal.active')) {
                    window.closeLegalModal();
                }
            }
        });

        // 4. Délégation d'événements pour les déclencheurs légaux
        document.addEventListener('click', function (e) {
            const trigger = e.target.closest('[data-legal-tab]');
            if (trigger) {
                e.preventDefault();
                const tab = trigger.getAttribute('data-legal-tab');
                window.openLegalModal(tab);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLegalSystem);
    } else {
        initLegalSystem();
    }

})();
