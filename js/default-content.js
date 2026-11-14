/**
 * DEFAULT-CONTENT.JS — Jeu de Données Élite (WebExpresso Vitrine)
 * ============================================================
 * Version Template : 2.5.1
 * Contenu : Offres, Processus, Réalisations et FAQ WebExpresso
 * ============================================================
 */

const DEFAULT_CONTENT_FR = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "meta": {
        "title": "WebExpresso | Votre Site Vitrine Professionnel en Moins d'une Semaine",
        "description": "WebExpresso : sites vitrine professionnels dès 200 € (Essentiel paiement unique, Autonome + évolutions à 200 € + 30 €/mois ou Autonome + accompagnement à 250 € + 50 €/mois). Vous gardez toujours votre site.",
        "lang": "fr"
    },
    "identity": {
        "name": "WebExpresso",
        "tagline": "Votre site dès 200 € — vous gardez toujours votre site",
        "activity": "Création de Sites Vitrine Express & Clé en Main",
        "city": "Grenoble / France"
    },
    "hero": {
        "eyebrow": "",
        "titleHtml": "<span class=\"hero-brand-name\">WebExpresso</span><span class=\"hero-subline\">Site personnalisé livré en moins d'une semaine</span>",
        "description": "Questionnaire et aperçu personnalisé gratuits avant de vous lancer — vous ne réglez qu'à la commande. Trois formules claires dès 200 €, et vous gardez toujours votre site si vous arrêtez.",
        "ctaText": "Démarrer mon projet ↗",
        "ctaLink": "questionnaire/",
        "imageUrl": "assets/hero-option-2-esquisse-laptop.jpg"
    },
    "ticker": {
        "enabled": true,
        "items": [
            "VOUS GARDEZ TOUJOURS VOTRE SITE",
            "ESSENTIEL 200 € PAIEMENT UNIQUE",
            "AUTONOME + ÉVOLUTIONS 200 € + 30 €/MOIS",
            "ENGAGEMENT MINIMUM 3 MOIS · ZÉRO FRAIS D'ANNULATION",
            "ADAPTÉ MOBILE & ORDINATEUR",
            "ÉQUIPE ÉTUDIANTE GRENOBLE INP",
            "LIVRAISON CLÉ EN MAIN"
        ]
    },
    "process": {
        "eyebrow": "MÉTHODE SIMPLE & RAPIDE",
        "titleHtml": "Comment ça marche ?<br><em>De votre besoin à votre site en ligne en 4 étapes simples</em>",
        "description": "Un fonctionnement transparent : aperçu gratuit avant commande, vous gardez toujours votre site si vous arrêtez, et zéro frais d'annulation après le minimum de 3 mois.",
        "steps": [
            {
                "number": "01",
                "title": "Le Questionnaire Gratuit (10 min)",
                "description": "Vous partagez votre activité, vos couleurs et vos besoins via notre formulaire en ligne gratuit — sans aucun acompte préalable."
            },
            {
                "number": "02",
                "title": "Aperçu Personnalisé Gratuit (< 7 jours)",
                "description": "Nous préparons gratuitement un premier aperçu sur-mesure de votre site sous 7 jours. Vous ne payez que si vous décidez de commander."
            },
            {
                "number": "03",
                "title": "Choix de la Formule & Récapitulatif",
                "description": "Vous validez la formule choisie (Essentiel 200 €, Autonome + évolutions 200 € + 30 €/mois ou Autonome + accompagnement 250 € + 50 €/mois) avec affichage du total minimum avant paiement Stripe."
            },
            {
                "number": "04",
                "title": "Mise en Ligne Clé en Main (GitHub Pages)",
                "description": "Nous publions votre site en https:// via GitHub Pages (hébergement GitHub et nom de domaine ~10–15 €/an à votre nom et à votre charge). Vous gardez toujours votre site si vous arrêtez."
            }
        ]
    },
    "prestations": [
        {
            "id": "offre-essentiel",
            "icon": "",
            "title": "Essentiel",
            "price": "200 €",
            "commitment": "paiement unique",
            "priceSub": "Site fixe · Pas d'espace privé",
            "description": "L'alternative simple et honnête pour les activités dont les informations changent peu.",
            "ctaText": "Choisir l'Essentiel ↗",
            "ctaUrl": "questionnaire/",
            "features": [
                "Site vitrine professionnel complet et adapté mobile",
                "Paiement unique de 200 €, sans abonnement mensuel",
                "Site fixe : pas d'espace privé d'administration",
                "Formulaire de contact relié à votre messagerie",
                "Vous gardez toujours votre site",
                "Garantie 1 an & SAV transparent (20 € texte/image, 35 € bloc ; hébergement GitHub Pages et domaine à votre nom)"
            ]
        },
        {
            "id": "offre-autonome",
            "icon": "",
            "title": "Autonome + évolutions",
            "price": "200 € + 30 €/mois",
            "commitment": "engagement de 3 mois minimum",
            "priceSub": "Soit 290 € minimum (200 + 3 × 30 €) · Aucun frais d'annulation",
            "badge": "Recommandée",
            "description": "Gardez la main via votre espace pro et faites ajouter de nouvelles fonctionnalités par le développeur.",
            "ctaText": "Choisir Autonome + évolutions ↗",
            "ctaUrl": "questionnaire/",
            "features": [
                "Espace pro privé pour modifier vos contenus en autonomie",
                "2 petites demandes/mois (< 30 min, non reportables) + 1 évolution/trimestre par le développeur sous 5 à 10 j ouvrés",
                "Engagement 3 mois min. (290 € min. ; mensualités restantes dues si arrêt avant 3 mois), 0 € frais d'annulation ensuite",
                "Vous gardez toujours votre site (copie figée) si vous arrêtez ; perte de l'espace pro avant 12 mois (mois cumulables si reprise)",
                "Après 12 mois cumulés : espace pro acquis à vie sans mensualité (hébergement GitHub Pages et domaine à votre nom et charge)"
            ]
        },
        {
            "id": "offre-accompagnement",
            "icon": "",
            "title": "Autonome + accompagnement commercial/marketing",
            "price": "250 € + 50 €/mois",
            "commitment": "engagement de 3 mois minimum",
            "priceSub": "Soit 400 € minimum (250 + 3 × 50 €) · Aucun frais d'annulation",
            "description": "Votre site avec espace pro et un accompagnement dédié assuré par votre conseiller commercial.",
            "ctaText": "Choisir Autonome + accompagnement ↗",
            "ctaUrl": "questionnaire/",
            "features": [
                "Tout l'espace pro privé inclus dès le lancement",
                "Accompagnement par votre conseiller dédié : 1 point mensuel + 2 contenus/publications par mois + mise à jour des actualités (zéro promesse de résultat)",
                "Engagement 3 mois min. (400 € min. ; mensualités restantes dues si arrêt avant 3 mois), 0 € frais d'annulation ensuite",
                "Vous gardez toujours votre site (copie figée) si vous arrêtez ; perte de l'espace pro avant 12 mois (mois cumulables si reprise)",
                "Après 12 mois cumulés : espace pro acquis à vie sans mensualité (hébergement GitHub Pages et domaine à votre nom et charge)"
            ]
        }
    ],
    "gallery": [
        {
            "id": "projet-leana",
            "title": "Léana — Maquillage & Beauté",
            "description": "Site vitrine élégant avec galerie de réalisations, présentation des tarifs et prise de rendez-vous en ligne.",
            "badge": "Site en ligne",
            "displayUrl": "leana-makeup.fr",
            "targetUrl": "https://joachimkahan.github.io/leana_github.github.io/",
            "type": "image",
            "url": "assets/portfolio/leana_makeup_preview.png",
            "tags": [
                "Artisanat & Beauté",
                "Galerie Photos",
                "Prise de RDV"
            ]
        },
        {
            "id": "projet-joachim",
            "title": "Joachim Kahan — Ingénieur SEM & Master MAE",
            "description": "Portfolio d'ingénierie et recherche : modélisation de systèmes énergétiques, data science, IA et projets industriels.",
            "badge": "Site en ligne",
            "displayUrl": "joachimkahan.dev",
            "targetUrl": "https://joachimkahan.github.io/portefolio_github.github.io/",
            "type": "image",
            "url": "assets/portfolio/joachim_portfolio_preview.png",
            "tags": [
                "Systèmes Énergétiques",
                "Double Diplôme",
                "Data Science & IA"
            ]
        },
        {
            "id": "projet-elodie",
            "title": "L'Atelier d'Élodie — Salon de Coiffure",
            "description": "Site vitrine chaleureux pour salon de coiffure : carte des soins, photos avant/après et réservation directe.",
            "badge": "Site en ligne",
            "displayUrl": "latelier-delodie.fr",
            "targetUrl": "https://joachimkahan.github.io/leana_github.github.io/",
            "type": "image",
            "url": "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
            "tags": [
                "Salon & Coiffure",
                "Galerie Avant/Après",
                "Prise de RDV"
            ]
        },
        {
            "id": "projet-gauthier",
            "title": "Maison Gauthier — Boulangerie Artisanale",
            "description": "Site vitrine gourmand pour boulangerie artisanale : présentation des pains au levain, horaires et histoire familiale.",
            "badge": "Site en ligne",
            "displayUrl": "maison-gauthier-bordeaux.fr",
            "targetUrl": "https://joachimkahan.github.io/leana_github.github.io/",
            "type": "image",
            "url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
            "tags": [
                "Commerce de Proximité",
                "Fournil Artisanal",
                "Commande en Ligne"
            ]
        }
    ],
    "about": {
        "eyebrow": "",
        "titleHtml": "Qui sommes-nous",
        "paragraphs": [
            "WebExpresso est un projet que nous menons en parallèle de nos études d'ingénieur (Grenoble INP) et de commerce. C'est pour nous un complément financier, mais c'est avant tout une formidable opportunité de découvrir de nouvelles choses : nous perfectionner en pratique sur la technique comme sur la commercialisation et la relation client.",
            "Notre démarche est simple : permettre aux artisans, commerçants de proximité et indépendants d'avoir un vrai site web professionnel, rapide et soigné, sans devoir débourser les 1 500 € réclamés par les agences traditionnelles.",
            "Puisque nous n'avons pas de lourdes charges d'agence, nous proposons trois formules transparentes dès 200 € en paiement unique (Essentiel), ou avec espace pro et suivi mensuel (Autonome + évolutions à 200 € + 30 €/mois ou Autonome + accompagnement commercial/marketing à 250 € + 50 €/mois, engagement minimum de 3 mois). Et dans tous les cas, vous gardez toujours votre site si vous arrêtez."
        ],
        "quote": "Pratiquer sur des projets réels tout en offrant une solution web enfin accessible aux indépendants.",
        "signature": "L'Équipe WebExpresso — Grenoble INP & École de Commerce",
        "imageUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
    },
    "banner": {
        "imageUrl": "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
        "alt": "Espace de travail moderne et création de site internet",
        "eyebrow": "NOTRE ENGAGEMENT",
        "quote": "Un site internet clair et professionnel ne devrait jamais être un luxe inaccessible.",
        "signature": "L'Équipe WebExpresso — Grenoble INP & École de Commerce"
    },
    "looks": [],
    "beforeAfter": [],
    "faq": [
        {
            "question": "Pourquoi vos prix sont-ils plus accessibles qu'une agence classique ?",
            "answer": "Nous menons ce projet en parallèle de nos études (Grenoble INP et école de commerce). N'ayant pas de frais d'agence superflus, nous proposons des tarifs directs : 200 € en paiement unique pour Essentiel, 200 € + 30 €/mois pour Autonome + évolutions, et 250 € + 50 €/mois pour Autonome + accompagnement commercial/marketing (engagement de 3 mois minimum)."
        },
        {
            "question": "Que devient mon site si j'arrête l'abonnement ?",
            "answer": "Vous gardez toujours votre site si vous arrêtez. Aucun frais d'annulation après le minimum de 3 mois (290 € minimum en Autonome + évolutions, 400 € minimum en Autonome + accompagnement ; en cas d'annulation avant 3 mois, les mensualités restantes du minimum restent dues). Si vous arrêtez avant 12 mois, vous recevez une copie figée du site et perdez l'espace pro ; en cas de reprise ultérieure, les mois déjà payés comptent vers le seuil des 12 mois. Après 12 mois cumulés, l'espace pro est acquis à vie sans mensualité (hébergement GitHub Pages et nom de domaine ~10–15 €/an restent au nom et à la charge du client ; modalités à faire valider par un professionnel dans des CGV écrites)."
        },
        {
            "question": "Le site m'appartient-il vraiment ?",
            "answer": "Oui. Vous gardez toujours votre site si vous arrêtez un abonnement, et avec la formule Essentiel (200 € en paiement unique) vous n'avez aucun abonnement dès le départ. Votre site est déployé via GitHub Pages et relié à votre nom de domaine (~10–15 €/an) ; l'hébergement et le domaine restent au nom et à la charge du client."
        },
        {
            "question": "Puis-je obtenir l'espace pro sans abonnement ?",
            "answer": "Vous préférez l'espace pro dès le départ, sans abonnement ? Possible, sur demande : 500 € en paiement unique (espace pro acquis à vie sans mensualité ; hébergement GitHub Pages et nom de domaine ~10–15 €/an au nom et à la charge du client, et éventuelles évolutions futures selon la grille SAV à la carte)."
        },
        {
            "question": "Quelle est la différence entre les trois formules ?",
            "answer": "Essentiel (200 € en paiement unique) offre un site fixe sans espace privé. Autonome + évolutions (200 € + 30 €/mois, engagement 3 mois min. soit 290 €) ajoute l'espace pro et l'ajout de fonctionnalités par le développeur (2 petites demandes de moins de 30 min par mois non reportables + 1 évolution plus importante par trimestre, sous 5 à 10 jours ouvrés). Autonome + accompagnement commercial/marketing (250 € + 50 €/mois, engagement 3 mois min. soit 400 €) ajoute un suivi par votre conseiller commercial dédié (1 point mensuel + 2 publications/contenus par mois + mise à jour du site), sans aucune promesse de résultat chiffré."
        },
        {
            "question": "Comment fonctionnent les 3 mois d'engagement et une éventuelle annulation ?",
            "answer": "Le total de l'engagement minimum (290 € ou 400 €) est indiqué avant paiement avec une case d'acceptation. En cas d'arrêt avant la fin des 3 mois, les mensualités restantes de l'engagement minimum restent dues. Après 3 mois, l'arrêt est libre sans aucun frais d'annulation, et si vous reprenez plus tard, vos mois déjà réglés comptent dans le cumul des 12 mois (clauses d'engagement et de résiliation à faire valider par un professionnel dans des CGV écrites)."
        },
        {
            "question": "Combien coûtent le questionnaire et le premier aperçu ?",
            "answer": "Ils sont 100 % gratuits. Vous répondez au questionnaire en ligne (10 min), recevez votre premier aperçu personnalisé sous 7 jours sans aucun acompte préalable, et vous ne réglez qu'à la commande de votre formule."
        },
        {
            "question": "Que se passe-t-il si mon site rencontre un bug ou un problème après sa mise en ligne ?",
            "answer": "Le diagnostic est systématiquement 100 % gratuit, quel que soit le cas. Votre site bénéficie d'une garantie technique d'un an couvrant toute correction de template, et tout ajustement initial de contenu mal appliqué est corrigé gratuitement pendant les 30 jours suivant la livraison. <a href=\"#\" data-legal-tab=\"sav\">Consultez nos Garanties & SAV</a>."
        },
        {
            "question": "Si je souhaite modifier un texte, mes horaires ou ajouter des photos plus tard, comment ça se passe ?",
            "answer": "Avec les formules incluant l'espace pro (Autonome + évolutions, Autonome + accompagnement, ou sur demande à 500 €), vous modifiez vos contenus librement. Avec Essentiel ou pour une intervention ponctuelle hors formule, nous appliquons nos tarifs SAV transparents : forfait fixe de 20 € pour une retouche texte ou photo, et 35 € pour une section graphique simple. <a href=\"#\" data-legal-tab=\"sav\">Voir la grille SAV</a>."
        }
    ],
    "contact": {
        "eyebrow": "PASSEZ À L'ACTION",
        "title": "Prêt à Lancer Votre Projet ?",
        "subtitle": "Remplissez le questionnaire gratuit en 10 minutes pour découvrir votre aperçu et choisir votre formule. Vous gardez toujours votre site si vous arrêtez.",
        "ctaText": "Démarrer mon projet ↗",
        "ctaLink": "questionnaire/"
    },
    "footer": {
        "siteName": "WebExpresso",
        "tagline": "Votre site vitrine professionnel dès 200 € — vous gardez toujours votre site",
        "copyright": "© 2026 WebExpresso. Tous droits réservés."
    }
};

const DEFAULT_CONTENT_EN = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "meta": {
        "title": "WebExpresso | Your Custom Showcase Website in Under a Week",
        "description": "WebExpresso: showcase websites from €200 (Essential one-time payment, Autonomous + updates €200 + €30/month, or Autonomous + business/marketing support €250 + €50/month). You always keep your website.",
        "lang": "en"
    },
    "identity": {
        "name": "WebExpresso",
        "tagline": "Your custom website from €200 — you always keep your site",
        "activity": "Express & Turnkey Showcase Websites",
        "city": "Grenoble / France"
    },
    "hero": {
        "eyebrow": "",
        "titleHtml": "<span class=\"hero-brand-name\">WebExpresso</span><span class=\"hero-subline\">Custom website delivered in under a week</span>",
        "description": "Free online questionnaire and custom preview before you commit — you only pay when ordering. Three transparent plans starting at €200, and you always keep your website if you stop.",
        "ctaText": "Start my project ↗",
        "ctaLink": "questionnaire/en/",
        "imageUrl": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80"
    },
    "ticker": {
        "enabled": true,
        "items": [
            "YOU ALWAYS KEEP YOUR WEBSITE",
            "ESSENTIAL €200 ONE-TIME PAYMENT",
            "AUTONOMOUS + UPDATES €200 + €30/MO",
            "3-MONTH MIN. COMMITMENT · ZERO CANCELLATION FEES",
            "MOBILE & DESKTOP OPTIMIZED",
            "GRENOBLE INP STUDENT TEAM",
            "TURNKEY DELIVERY"
        ]
    },
    "process": {
        "eyebrow": "SIMPLE & FAST METHOD",
        "titleHtml": "How does it work?<br><em>From your needs to your live website in 4 simple steps</em>",
        "description": "Transparent process: free preview before ordering, you always keep your website if you stop, and zero cancellation fees after the 3-month minimum.",
        "steps": [
            {
                "number": "01",
                "title": "Free Online Questionnaire (10 min)",
                "description": "Share your activity, style preferences, and needs via our free online form — no upfront deposit required."
            },
            {
                "number": "02",
                "title": "Free Custom Preview (< 7 days)",
                "description": "We prepare a custom website preview based on your brief within 7 days. You only pay if you decide to order."
            },
            {
                "number": "03",
                "title": "Plan Selection & Pre-Payment Summary",
                "description": "Confirm your chosen plan (Essential €200, Autonomous + updates €200 + €30/month, or Autonomous + support €250 + €50/month) with total minimum commitment displayed before Stripe payment."
            },
            {
                "number": "04",
                "title": "Turnkey Launch (GitHub Pages)",
                "description": "We publish your website with https:// via GitHub Pages (GitHub hosting and domain ~€10–15/yr in your name and expense). You always keep your website even if you stop a subscription after the minimum period."
            }
        ]
    },
    "prestations": [
        {
            "id": "offre-essentiel",
            "icon": "",
            "title": "Essential",
            "price": "€200",
            "commitment": "one-time payment",
            "priceSub": "Static website · No private dashboard",
            "description": "The honest, straightforward option for businesses whose information rarely changes.",
            "ctaText": "Choose Essential ↗",
            "ctaUrl": "questionnaire/en/",
            "features": [
                "Complete, mobile-ready professional showcase website",
                "€200 one-time payment with zero monthly subscription",
                "Static website: no private self-editing dashboard",
                "Direct contact form connected to your inbox",
                "You always keep your website",
                "1-year technical warranty & transparent support (€20 text/photo, €35 block; GitHub Pages hosting & domain in your name)"
            ]
        },
        {
            "id": "offre-autonome",
            "icon": "",
            "title": "Autonomous + updates",
            "price": "€200 + €30/mo",
            "commitment": "3-month minimum commitment",
            "priceSub": "€290 minimum total (€200 + 3 × €30) · Zero cancellation fees",
            "badge": "Recommended",
            "description": "Stay independent with your pro dashboard and request new features from the developer.",
            "ctaText": "Choose Autonomous + updates ↗",
            "ctaUrl": "questionnaire/en/",
            "features": [
                "Private pro dashboard to update your content yourself",
                "Developer updates: 2 small requests/month (< 30 min, non-rollover) + 1 larger upgrade/quarter within 5–10 business days",
                "3-month min. commitment (€290 min.; remaining minimum months due if stopped earlier), €0 cancellation fees afterwards",
                "You always keep your website (frozen static copy) if you stop; pro dashboard lost if stopped before 12 months (paid months count cumulatively if resumed)",
                "After 12 cumulative months: pro dashboard acquired for life with no monthly fee (GitHub Pages hosting & domain in your name and expense)"
            ]
        },
        {
            "id": "offre-accompagnement",
            "icon": "",
            "title": "Autonomous + business/marketing support",
            "price": "€250 + €50/mo",
            "commitment": "3-month minimum commitment",
            "priceSub": "€400 minimum total (€250 + 3 × €50) · Zero cancellation fees",
            "description": "Your website with a pro dashboard plus dedicated business and marketing support from your advisor.",
            "ctaText": "Choose Autonomous + support ↗",
            "ctaUrl": "questionnaire/en/",
            "features": [
                "Full private pro dashboard included from launch",
                "Dedicated commercial advisor support: 1 monthly check-in + 2 prepared posts/month + site offer/news updates (zero result promises)",
                "3-month min. commitment (€400 min.; remaining minimum months due if stopped earlier), €0 cancellation fees afterwards",
                "You always keep your website (frozen static copy) if you stop; pro dashboard lost if stopped before 12 months (paid months count cumulatively if resumed)",
                "After 12 cumulative months: pro dashboard acquired for life with no monthly fee (GitHub Pages hosting & domain in your name and expense)"
            ]
        }
    ],
    "gallery": [
        {
            "id": "projet-leana",
            "title": "Léana — Makeup & Beauty",
            "description": "Elegant showcase website with portfolio gallery, service pricing, and online appointment booking.",
            "badge": "Live Website",
            "displayUrl": "leana-makeup.fr",
            "targetUrl": "https://joachimkahan.github.io/leana_github.github.io/",
            "type": "image",
            "url": "assets/portfolio/leana_makeup_preview.png",
            "tags": [
                "Beauty & Craft",
                "Photo Gallery",
                "Online Booking"
            ]
        },
        {
            "id": "projet-joachim",
            "title": "Joachim Kahan — Energy Engineer & Master in Management",
            "description": "High-precision engineering portfolio: energy systems modelling, applied AI, data science, and industrial case studies.",
            "badge": "Live Website",
            "displayUrl": "joachimkahan.dev",
            "targetUrl": "https://joachimkahan.github.io/portefolio_github.github.io/",
            "type": "image",
            "url": "assets/portfolio/joachim_portfolio_preview.png",
            "tags": [
                "Energy Systems",
                "Dual Degree",
                "Applied AI"
            ]
        },
        {
            "id": "projet-elodie",
            "title": "L'Atelier d'Élodie — Hair Salon",
            "description": "Warm and inviting hair salon website: treatment menu, before/after gallery, and direct bookings.",
            "badge": "Live Website",
            "displayUrl": "latelier-delodie.fr",
            "targetUrl": "https://joachimkahan.github.io/leana_github.github.io/",
            "type": "image",
            "url": "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
            "tags": [
                "Hair Salon",
                "Before/After Gallery",
                "Direct Booking"
            ]
        },
        {
            "id": "projet-gauthier",
            "title": "Maison Gauthier — Artisan Bakery",
            "description": "Artisanal bakery showcase: sourdough bread selection, opening hours, and family heritage.",
            "badge": "Live Website",
            "displayUrl": "maison-gauthier-bordeaux.fr",
            "targetUrl": "https://joachimkahan.github.io/leana_github.github.io/",
            "type": "image",
            "url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
            "tags": [
                "Local Bakery",
                "Artisanal Breads",
                "Online Orders"
            ]
        }
    ],
    "about": {
        "eyebrow": "",
        "titleHtml": "About Us",
        "paragraphs": [
            "WebExpresso is a project we run alongside our engineering (Grenoble INP) and business degrees. While it provides supplemental income during our studies, it is above all a great opportunity to explore new horizons: honing our hands-on skills in web development, marketing, and client relationships.",
            "Our approach is simple: help local craftspeople, neighborhood merchants, and freelancers get a genuine professional website without spending the 1 500 € charged by traditional agencies.",
            "Because we do not have large agency overhead, we offer three clear plans starting at €200 one-time (Essential), or with a pro dashboard and monthly support (Autonomous + updates at €200 + €30/month, or Autonomous + business/marketing support at €250 + €50/month, 3-month minimum commitment). You always keep your website if you stop."
        ],
        "quote": "Real-world practice while providing an affordable web solution for independent businesses.",
        "signature": "The WebExpresso Team — Grenoble INP & Business School",
        "imageUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
    },
    "banner": {
        "imageUrl": "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
        "alt": "Modern workspace and web development",
        "eyebrow": "OUR COMMITMENT",
        "quote": "A clear and professional website should never be an inaccessible luxury.",
        "signature": "The WebExpresso Team — Grenoble INP & Business School"
    },
    "looks": [],
    "beforeAfter": [],
    "faq": [
        {
            "question": "Why are your prices lower than a classic agency?",
            "answer": "We run this project alongside our engineering and business studies (Grenoble INP & Business School). Without agency overhead, we pass transparent direct pricing on to independent businesses: €200 one-time for Essential, €200 + €30/month for Autonomous + updates, and €250 + €50/month for Autonomous + business/marketing support (3-month minimum commitment)."
        },
        {
            "question": "What happens to my website if I cancel the subscription?",
            "answer": "You always keep your website if you stop. Zero cancellation fees after the 3-month minimum commitment (€290 minimum for Autonomous + updates, €400 minimum for Autonomous + support; remaining minimum installments remain due if cancelled before 3 months). If you stop before 12 months, you keep a frozen static copy and lose access to the pro dashboard; if you resume later, previously paid months count toward the 12-month threshold. After 12 cumulative months, the pro dashboard is acquired for life with no monthly fee (GitHub Pages hosting and domain ~€10–15/yr stay in the client's name and expense; clauses to be validated by a legal professional in written T&Cs)."
        },
        {
            "question": "Do I really own my website?",
            "answer": "Yes. You always keep your website if you stop a subscription, and with Essential (€200 one-time) there is no subscription at all. Your website is deployed on GitHub Pages with your domain name (~€10–15/yr) registered in your name and at your expense."
        },
        {
            "question": "Can I get the pro dashboard without a subscription?",
            "answer": "Prefer the pro space from the start, with no subscription? Available on request: €500 one-time payment (lifetime pro dashboard with no monthly fee; GitHub Pages hosting and domain ~€10–15/yr in the client's name and expense; future developer changes priced per à la carte support rates)."
        },
        {
            "question": "What is the concrete difference between the three plans?",
            "answer": "Essential (€200 one-time) gives you a static showcase site with no private dashboard. Autonomous + updates (€200 + €30/month, 3-month min. i.e. €290) adds the private pro dashboard and developer feature additions (2 small requests under 30 min per month non-rollover + 1 larger quarterly upgrade, delivered in 5–10 business days). Autonomous + business/marketing support (€250 + €50/month, 3-month min. i.e. €400) adds your dedicated commercial advisor (1 monthly check-in + 2 prepared posts/month + site offer/news updates), with zero quantified result promises."
        },
        {
            "question": "How do the 3-month commitment and cancellation work?",
            "answer": "The total minimum commitment (€290 or €400) is displayed in the pre-payment summary with an acceptance checkbox. If cancelled before 3 months, the remaining minimum monthly installments remain due. After 3 months, cancellation is free with €0 fees, and any paid months count cumulatively toward the 12-month threshold if you resume later (commitment and termination clauses must be validated by a legal professional in written T&Cs)."
        },
        {
            "question": "How much do the questionnaire and initial preview cost?",
            "answer": "They are 100% free. You fill out the online questionnaire, discover your custom preview under 7 days with no upfront deposit, and only pay when ordering your chosen plan."
        },
        {
            "question": "What happens if my website experiences a bug or issue after going live?",
            "answer": "Diagnosis is always 100% free, whatever the case. Your website includes a 1-year technical warranty covering any template fixes, and any initial content misalignments are fixed free of charge within 30 days after launch. <a href=\"#\" data-legal-tab=\"sav\">View our Warranties & Support policy</a>."
        },
        {
            "question": "Can I have my texts or photos updated later on?",
            "answer": "With any plan including the pro dashboard (Autonomous + updates, Autonomous + support, or €500 on request), you can edit content yourself anytime. With Essential or for one-off requests outside your plan, we apply transparent fixed support rates: €20 for a text or photo edit, and €35 for a simple graphic section. <a href=\"#\" data-legal-tab=\"sav\">Check our support rates & policy</a>."
        }
    ],
    "contact": {
        "eyebrow": "TAKE ACTION",
        "title": "Ready to Launch Your Website?",
        "subtitle": "Fill out the free 10-minute questionnaire to get your preview and pick the plan that fits your business. You always keep your website if you stop.",
        "ctaText": "Start my project ↗",
        "ctaLink": "questionnaire/en/"
    },
    "footer": {
        "siteName": "WebExpresso",
        "tagline": "Your custom website from €200 — you always keep your site",
        "copyright": "© 2026 WebExpresso. All rights reserved."
    }
};

// Instance réactive mutable de DEFAULT_CONTENT
const initialLang = (typeof localStorage !== 'undefined' && localStorage.getItem('site_lang')) || 'fr';
const DEFAULT_CONTENT = Object.assign({}, (initialLang === 'en') ? DEFAULT_CONTENT_EN : DEFAULT_CONTENT_FR);

// Écouteur global pour commuter DEFAULT_CONTENT lors de la bascule de langue
if (typeof window !== 'undefined') {
    window.DEFAULT_CONTENT = DEFAULT_CONTENT;
    window.DEFAULT_CONTENT_FR = DEFAULT_CONTENT_FR;
    window.DEFAULT_CONTENT_EN = DEFAULT_CONTENT_EN;

    window.addEventListener('app:lang-change', (e) => {
        const lang = (e && e.detail && e.detail.lang) || 'fr';
        const target = (lang === 'en') ? DEFAULT_CONTENT_EN : DEFAULT_CONTENT_FR;
        for (const key of Object.keys(DEFAULT_CONTENT)) {
            delete DEFAULT_CONTENT[key];
        }
        Object.assign(DEFAULT_CONTENT, target);
    });
}
