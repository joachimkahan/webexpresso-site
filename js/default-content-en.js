/**
 * DEFAULT-CONTENT-EN.JS — English Dataset (WebExpresso Showcase)
 * ============================================================
 * Template Version: 2.5.1
 * Content: English translation for Plans, Process, Portfolio, About, and FAQ
 * ============================================================
 */

const DEFAULT_CONTENT_EN = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "meta": {
        "title": "WebExpresso | Your Professional Showcase Website in Under a Week",
        "description": "WebExpresso: showcase websites from €200 (Essential one-time payment, Autonomous + updates €200 + €30/month, or Autonomous + business/marketing support €250 + €50/month). You always keep your website.",
        "lang": "en"
    },
    "identity": {
        "name": "WebExpresso",
        "tagline": "Your custom website from €200 — you always keep your site",
        "activity": "Express & Turnkey Showcase Website Creation",
        "city": "Grenoble / France"
    },
    "hero": {
        "eyebrow": "",
        "titleHtml": "<span class=\"hero-brand-name\">WebExpresso</span><span class=\"hero-subline\">Custom website delivered in under a week</span>",
        "description": "Free online questionnaire and custom preview before you commit — you only pay when ordering. Three transparent plans starting at €200, and you always keep your website if you stop.",
        "ctaText": "Start my project ↗",
        "ctaLink": "questionnaire/en/",
        "imageUrl": "assets/hero-option-2-esquisse-laptop.jpg"
    },
    "ticker": {
        "enabled": true,
        "items": [
            "YOU ALWAYS KEEP YOUR WEBSITE",
            "ESSENTIAL €200 ONE-TIME PAYMENT",
            "AUTONOMOUS + UPDATES €200 + €30/MO",
            "3-MONTH MIN. COMMITMENT · ZERO CANCELLATION FEES",
            "PERFECT ON MOBILE & DESKTOP",
            "GRENOBLE INP STUDENT TEAM",
            "TURNKEY DELIVERY"
        ]
    },
    "process": {
        "eyebrow": "SIMPLE & FAST METHOD",
        "titleHtml": "How does it work?<br><em>From your needs to your live site in 4 simple steps</em>",
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
                "description": "We publish your website with https:// (GitHub Pages and domain name in your name and at your expense). You always keep your website even if you stop a subscription after the minimum period."
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
                "After-sales rates: €20 minor update / €35 simple block (hosting & domain in your name)"
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
                "2 small feature requests/month (< 30 min) + 1 major quarterly evolution (5–10 business days)",
                "3-month min. commitment (€290 min.; remaining months due if stopped earlier), €0 exit fee afterwards",
                "You always keep your website if you stop (prior paid months count if you resume later)",
                "After 12 cumulative months: pro dashboard acquired for life (GitHub Pages hosting & domain at client expense)"
            ]
        },
        {
            "id": "offre-accompagnement",
            "icon": "",
            "title": "Autonomous + business/marketing support",
            "price": "€250 + €50/mo",
            "commitment": "3-month minimum commitment",
            "priceSub": "€400 minimum total (€250 + 3 × €50) · Zero cancellation fees",
            "description": "Your website with a pro dashboard plus dedicated business and marketing support.",
            "ctaText": "Choose Autonomous + support ↗",
            "ctaUrl": "questionnaire/en/",
            "features": [
                "Full private pro dashboard included from launch",
                "Monthly check-in + 2 prepared posts/contents/mo + site updates by your advisor (zero result promises)",
                "3-month min. commitment (€400 min.; remaining months due if stopped earlier), €0 exit fee afterwards",
                "You always keep your website if you stop (prior paid months count if you resume later)",
                "After 12 cumulative months: pro dashboard acquired for life (GitHub Pages hosting & domain at client expense)"
            ]
        }
    ],
    "gallery": [
        {
            "id": "projet-leana",
            "title": "Léana — Makeup & Beauty",
            "description": "Elegant showcase website with portfolio gallery, service pricing, and online appointment booking.",
            "badge": "Live website",
            "displayUrl": "leana-makeup.fr",
            "targetUrl": "https://joachimkahan.github.io/leana_github.github.io/",
            "type": "image",
            "url": "assets/portfolio/leana_makeup_preview.png",
            "tags": [
                "Beauty & Craft",
                "Photo Gallery",
                "Appointments"
            ]
        },
        {
            "id": "projet-joachim",
            "title": "Joachim Kahan — Energy Engineer & Master in Management",
            "description": "High-precision engineering portfolio: energy systems modelling, applied AI, data science, and industrial case studies.",
            "badge": "Live website",
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
            "description": "Warm showcase website for a hair salon: treatment menu, before/after gallery, and direct booking.",
            "badge": "Live website",
            "displayUrl": "latelier-delodie.fr",
            "targetUrl": "https://joachimkahan.github.io/leana_github.github.io/",
            "type": "image",
            "url": "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
            "tags": [
                "Salon & Hair",
                "Before/After",
                "Appointments"
            ]
        },
        {
            "id": "projet-gauthier",
            "title": "Maison Gauthier — Artisan Bakery",
            "description": "Artisan bakery showcase website: sourdough bread presentation, opening hours, and family heritage.",
            "badge": "Live website",
            "displayUrl": "maison-gauthier-bordeaux.fr",
            "targetUrl": "https://joachimkahan.github.io/leana_github.github.io/",
            "type": "image",
            "url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
            "tags": [
                "Local Shop",
                "Artisan Bakery",
                "Online Orders"
            ]
        }
    ],
    "about": {
        "eyebrow": "ABOUT US",
        "titleHtml": "A Passionate Student Team.<br><em>A Real Project & Fair Pricing.</em>",
        "paragraphs": [
            "WebExpresso is a project we lead alongside our engineering studies (Grenoble INP) and business school. It is a financial complement for us, but above all a great opportunity to explore new horizons: perfecting our skills in technical development as well as sales, client relations, and project management.",
            "Our goal is straightforward: help artisans, local shopkeepers, and independent workers get a genuinely professional, fast, and reassuring website without spending €1,500 at traditional web agencies.",
            "Because we have no agency overhead, we offer three clear plans starting at €200 one-time (Essential), or with a pro dashboard and monthly support (Autonomous + updates at €200 + €30/month, or Autonomous + business/marketing support at €250 + €50/month, 3-month minimum commitment). You always keep your website if you stop."
        ],
        "quote": "Practicing on real client projects while offering a truly accessible web solution for independent businesses.",
        "signature": "The WebExpresso Team — Grenoble INP & Business School",
        "imageUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
    },
    "banner": {
        "imageUrl": "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
        "alt": "Modern workspace and website design",
        "eyebrow": "OUR COMMITMENT",
        "quote": "“A clear and professional website should never be an inaccessible luxury.”",
        "signature": "The WebExpresso Team — Grenoble INP & Business School"
    },
    "looks": [],
    "beforeAfter": [],
    "faq": [
        {
            "question": "Why are your prices lower than a traditional agency?",
            "answer": "We lead this project alongside our engineering and business studies (Grenoble INP & Business School). Without agency overhead, we pass on direct pricing: €200 one-time for Essential, €200 + €30/month for Autonomous + updates, and €250 + €50/month for Autonomous + business/marketing support (3-month minimum commitment)."
        },
        {
            "question": "What happens to my website if I cancel the subscription?",
            "answer": "You always keep your website if you stop. After the 3-month minimum commitment (€290 minimum for Autonomous + updates, €400 minimum for Autonomous + support), there are zero cancellation fees. If you cancel before 3 months, remaining monthly installments for the 3-month period remain due. Stopping before 12 cumulative months only removes access to the pro dashboard; if you resume later, your previously paid months count toward the 12 months required for lifetime pro dashboard access."
        },
        {
            "question": "Do I truly own the website?",
            "answer": "Yes. You always keep your website if you stop a subscription, and with Essential (€200 one-time) there is no subscription at all. Hosting (via GitHub Pages) and your domain name (~€10–15/year) are set up in your name and remain at your expense. Once out of subscription, developer edits follow standard after-sales rates (€20 text/photo update, €35 simple block, or custom quote)."
        },
        {
            "question": "Can I get the pro dashboard without a subscription?",
            "answer": "Prefer the pro space from the start, with no subscription? Available on request: €500 one-time payment for lifetime access to the pro dashboard (hosting on GitHub Pages and domain name remain at the client's expense; future developer feature additions billed at standard SAV rates)."
        },
        {
            "question": "What is the practical difference between the three plans?",
            "answer": "Essential (€200 one-time) provides a static showcase site with no private dashboard. Autonomous + updates (€200 + €30/month, 3-month min. i.e. €290) adds the private pro dashboard plus 2 small feature requests/month (< 30 min, non-rollover) and 1 major quarterly evolution within 5 to 10 business days. Autonomous + business/marketing support (€250 + €50/month, 3-month min. i.e. €400) includes a monthly check-in, 2 prepared posts/contents/month, and site offer updates by your commercial advisor, with zero quantified result promises."
        },
        {
            "question": "How do the 3-month commitment and cancellation work?",
            "answer": "The total minimum commitment (€290 or €400) is displayed in the pre-payment summary with an acceptance checkbox. Cancelling before the end of the 3-month period leaves the remaining installments of those 3 months due. After 3 months, you can stop anytime with zero cancellation fees. All commitment and termination terms are formalised by a legal professional in written T&Cs."
        },
        {
            "question": "How much do the questionnaire and initial preview cost?",
            "answer": "They are 100% free: you fill out the online questionnaire (10 min), receive your custom website preview under 7 days with no upfront deposit, and only pay once you validate your chosen plan in the pre-payment summary."
        }
    ],
    "contact": {
        "eyebrow": "TAKE ACTION",
        "title": "Ready to Launch Your Website?",
        "subtitle": "Fill out the 10-minute questionnaire to pick the plan that fits your business. You always keep your website if you stop.",
        "ctaText": "Start my project ↗",
        "ctaLink": "questionnaire/en/"
    },
    "footer": {
        "siteName": "WebExpresso",
        "tagline": "Your custom website from €200 — you always keep your site",
        "copyright": "© 2026 WebExpresso. All rights reserved."
    }
};

if (typeof window !== 'undefined') {
    window.DEFAULT_CONTENT_EN = DEFAULT_CONTENT_EN;
}
