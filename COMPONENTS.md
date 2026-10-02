# COMPONENTS.MD — Catalogue des Composants et Sections du Template Maître

> **Version du Template** : 2.0.0  
> **Usage** : Document de référence pour l'IA (Antigravity) et les développeurs lors de l'exécution du **Prompt 2** (Personnalisation Client).  
> Il spécifie chaque composant disponible, ses contrats de données, ses variantes, ses dépendances et sa compatibilité par offre (**Essentiel** vs **Autonome**).

---

## 1. Vue d'Ensemble des Sections

| Identifiant Section | Rôle Principal | Source de Données | Essentiel | Autonome | Administrable CMS |
|---|---|---|---|---|---|
| `meta` | Métadonnées SEO et `<head>` | `DEFAULT_CONTENT.meta` / `site-config.js` | ✅ Inclus | ✅ Inclus | ❌ Non |
| `navbar` | Barre de navigation et menu mobile | `DEFAULT_CONTENT.identity` / `site-config.js` | ✅ Inclus | ✅ Inclus | ❌ Non |
| `hero` | Accroche visuelle plein écran | `DEFAULT_CONTENT.hero` | ✅ Inclus | ✅ Inclus | ❌ Non |
| `about` | Présentation éditoriale & signature | `DEFAULT_CONTENT.about` | ✅ Inclus | ✅ Inclus | ❌ Non |
| `banner` | Transition cinématique artistique | `DEFAULT_CONTENT.banner` | ✅ Inclus | ✅ Inclus | ❌ Non |
| `looks` | Onglets éditoriaux "Looks Signature" | `SiteContent.getLooks()` | ✅ Inclus | ✅ Inclus | ✅ **Oui** |
| `beforeAfter` | Comparateur interactif Glow Slider | `SiteContent.getBeforeAfter()` | ✅ Inclus | ✅ Inclus | ✅ **Oui** |
| `gallery` | Grille portfolio & Lightbox | `SiteContent.getGallery()` | ✅ Inclus | ✅ Inclus | ✅ **Oui** |
| `prestations` | Grille des services et tarifs | `SiteContent.getPrestations()` | ✅ Inclus | ✅ Inclus | ✅ **Oui** |
| `contact` | Formulaire sécurisé FormSubmit | `js/integrations/contact/` | ✅ Inclus | ✅ Inclus | ❌ Non |
| `footer` | Pied de page & copyright | `DEFAULT_CONTENT.footer` | ✅ Inclus | ✅ Inclus | ❌ Non |
| `admin` | Tableau de bord CRUD & Sécurité | `js/admin/`, `admin.html` | ❌ **Supprimé** | ✅ Inclus | N/A (Espace Pro) |

---

## 2. Spécification Détaillée des Sections

### 2.1. `meta` — Métadonnées SEO & En-tête
- **Fichier de rendu** : `js/section-renderer.js` (`renderMeta()`)
- **Rôle** : Injection dynamique des balises `<title>`, `<meta name="description">` et attributs de langue.
- **Contrat de données** :
  - `title` (`string`, requis, défaut: `"Beauté Éditoriale & Sur-Mesure"`) : 10 à 70 caractères.
  - `description` (`string`, requis, défaut: `""`) : 50 à 160 caractères.
  - `lang` (`string`, requis, défaut: `"fr"`) : Code langue ISO 639-1.
- **Compatibilité** : Essentiel (✅) | Autonome (✅)
- **Dépendances** : `js/default-content.js`, `js/site-config.js`.

---

### 2.2. `navbar` — Navigation & Menu Mobile
- **Fichier HTML / JS** : `index.html` (`<nav class="navbar">`) + `js/app.js`
- **Rôle** : Navigation fluide, ancres d'accès rapide et menu hamburger responsive.
- **Contrat de données** :
  - `logoText` (`string`, requis, défaut: `identity.name`) : Nom affiché dans la barre.
  - `navLinks` (`array`, requis) : Liens d'ancrage (`#accueil`, `#apropos`, `#looks`, `#galerie`, `#prestations`, `#contact`).
- **Compatibilité** : Essentiel (✅) | Autonome (✅)
- **Variantes** : Fixe transparente avec flou d'arrière-plan (*glassmorphism*).

---

### 2.3. `hero` — Section d'Accroche Plein Écran
- **Fichier de rendu** : `js/section-renderer.js` (`renderHero()`)
- **Rôle** : Première impression visuelle, titre d'impact et call-to-action principal.
- **Contrat de données** :
  - `eyebrow` (`string`, optionnel, défaut: `""`) : Surtitre élégant (ex: `"Makeup Artist · Paris"`).
  - `titleHtml` (`string`, requis, défaut: `""`) : Titre principal acceptant les balises d'emphase `<em>`.
  - `description` (`string`, requis, défaut: `""`) : Sous-titre descriptif (10 à 300 caractères).
  - `ctaText` (`string`, requis, défaut: `"Prendre rendez-vous"`) : Libellé du bouton d'action.
  - `ctaLink` (`string`, requis, défaut: `"#contact"`) : Ancre de redirection.
  - `imageUrl` (`string`, requis, format URL https ou relative) : Visuel d'arrière-plan haute définition.
- **Compatibilité** : Essentiel (✅) | Autonome (✅)

---

### 2.4. `about` — Section À Propos & Signature
- **Fichier de rendu** : `js/section-renderer.js` (`renderAbout()`)
- **Rôle** : Présentation du professionnel, philosophie artistique, citation inspirante et signature.
- **Contrat de données** :
  - `eyebrow` (`string`, optionnel, défaut: `"À propos"`) : Surtitre.
  - `titleHtml` (`string`, requis) : Titre de la section avec emphase.
  - `paragraphs` (`array[string]`, requis, min 1, max 4) : Corps du texte de présentation.
  - `quote` (`string`, optionnel, défaut: `""`) : Citation mise en avant (*pull quote*).
  - `signature` (`string`, optionnel, défaut: `""`) : Nom ou signature stylisée.
  - `imageUrl` (`string`, requis) : Portrait professionnel ou photo d'ambiance.
- **Compatibilité** : Essentiel (✅) | Autonome (✅)

---

### 2.5. `banner` — Bannière Cinématique de Transition
- **Fichier de rendu** : `js/section-renderer.js` (`renderBanner()`)
- **Rôle** : Séparateur visuel immersif créant une respiration élégante entre les sections.
- **Contrat de données** :
  - `imageUrl` (`string`, requis) : Image panoramique (ratio 16:9 ou 21:9).
  - `alt` (`string`, requis, défaut: `"Ambiance artistique"`) : Texte alternatif d'accessibilité.
- **Compatibilité** : Essentiel (✅) | Autonome (✅)

---

### 2.6. `looks` — Onglets Éditoriaux "Looks Signature"
- **Fichier de rendu** : `js/section-renderer.js` (`renderLooks()`) + `js/app.js` (gestion des onglets)
- **Rôle** : Présentation par onglets des styles créés avec photo principale, détails et tags de matières.
- **Contrat de données** (`lookItem` versionné v1) :
  - `id` (`string`, requis, stable) : Identifiant unique (ex: `"look-1"`).
  - `title` (`string`, requis, 3 à 120 car.) : Titre du look.
  - `subtitle` (`string`, requis, 3 à 120 car.) : Sous-titre de l'onglet.
  - `description` (`string`, requis, 10 à 600 car.) : Description technique et artistique.
  - `heroImageUrl` (`string`, requis) : Visuel grand format du look.
  - `detailImage1Url` (`string`, optionnel) : Zoom texture / détail 1.
  - `detailImage2Url` (`string`, optionnel) : Zoom texture / détail 2.
  - `tags` (`array[string] | string`, optionnel) : Liste des produits / matières phares.
- **Compatibilité** : Essentiel (✅ statique) | Autonome (✅ dynamique Firestore / CMS)

---

### 2.7. `beforeAfter` — Comparateur Interactif Glow Slider
- **Fichier de rendu** : `js/section-renderer.js` (`renderBeforeAfter()`) + `js/app.js`
- **Rôle** : Slider de comparaison interactif "Avant / Après" avec poignée tactile et souris.
- **Contrat de données** (`beforeAfterItem` versionné v1) :
  - `id` (`string`, requis, stable) : Identifiant unique (ex: `"ba-1"`).
  - `title` (`string`, requis, 2 à 100 car.) : Nom de la transformation.
  - `beforeUrl` (`string`, requis) : Image de l'état initial.
  - `afterUrl` (`string`, requis) : Image du résultat final.
- **Compatibilité** : Essentiel (✅ statique) | Autonome (✅ dynamique Firestore / CMS)

---

### 2.8. `gallery` — Galerie Portfolio & Lightbox
- **Fichier de rendu** : `js/section-renderer.js` (`renderGallery()`) + `js/app.js` (Lightbox)
- **Rôle** : Grille masonry dynamique affichant photos et intégrations vidéos (YouTube/Vimeo) avec agrandissement plein écran.
- **Contrat de données** (`galleryItem` versionné v1) :
  - `id` (`string`, requis, stable) : Identifiant unique (ex: `"gal-1"`).
  - `title` (`string`, requis, 2 à 100 car.) : Titre de la réalisation.
  - `type` (`enum: 'image' | 'video'`, requis, défaut: `'image'`).
  - `url` (`string`, requis) : URL de l'image (https / DataURL) ou du média vidéo.
- **Compatibilité** : Essentiel (✅ statique) | Autonome (✅ dynamique Firestore / CMS)

---

### 2.9. `prestations` — Grille des Tarifs & Services
- **Fichier de rendu** : `js/section-renderer.js` (`renderPrestations()`)
- **Rôle** : Affichage clair des offres commerciales sous forme de cartes élégantes avec icône, détails et prix.
- **Contrat de données** (`prestationItem` versionné v1) :
  - `id` (`string`, requis, stable) : Identifiant unique (ex: `"presta-1"`).
  - `icon` (`string`, optionnel, défaut: `'✨'`) : Émoji ou symbole graphique (1 à 8 car.).
  - `title` (`string`, requis, 2 à 100 car.) : Intitulé de la prestation.
  - `description` (`string`, requis, 10 à 400 car.) : Descriptif des soins / inclusions.
  - `price` (`string`, requis, 2 à 60 car.) : Tarif affiché (ex: `"À partir de 110€"`).
- **Compatibilité** : Essentiel (✅ statique) | Autonome (✅ dynamique Firestore / CMS)

---

### 2.10. `testimonials` — Témoignages & Avis Clients Étoilés (Optionnel)
- **Fichier de rendu** : `js/section-renderer.js` (`renderTestimonials()`)
- **Rôle** : Réassurance commerciale forte par l'affichage d'avis clients avec note en étoiles, commentaire, auteur et date.
- **Contrat de données** :
  - `id` (`string`, requis, stable) : Identifiant unique (ex: `"testi-1"`).
  - `author` (`string`, requis) : Nom ou pseudonyme du client.
  - `role` (`string`, optionnel) : Contexte de l'avis (ex: `"Mariée de Juillet"`, `"Client Google"`).
  - `rating` (`number`, requis, 1 à 5) : Note sur 5 étoiles.
  - `text` (`string`, requis) : Témoignage client.
  - `date` (`string`, optionnel) : Date indicative.
- **Compatibilité** : Essentiel (✅) | Autonome (✅)

---

### 2.11. `faq` — Foire Aux Questions (Accordéon Dynamique - Optionnel)
- **Fichier de rendu** : `js/section-renderer.js` (`renderFaq()`)
- **Rôle** : Répondre aux doutes et questions fréquentes sous forme d'accordéon repliable fluide.
- **Contrat de données** :
  - `id` (`string`, requis, stable) : Identifiant unique (ex: `"faq-1"`).
  - `question` (`string`, requis) : Intitulé de la question.
  - `answer` (`string`, requis) : Réponse claire et détaillée.
- **Compatibilité** : Essentiel (✅) | Autonome (✅)

---

### 2.12. `process` — Processus & Méthode en Étapes (Optionnel)
- **Fichier de rendu** : `js/section-renderer.js` (`renderProcess()`)
- **Rôle** : Explication chronologique claire du déroulement d'une intervention ou d'une prestation en 3 ou 4 étapes numérotées.
- **Contrat de données** :
  - `eyebrow` (`string`, optionnel) : Surtitre.
  - `titleHtml` (`string`, requis) : Titre de section.
  - `steps` (`array[{ number, title, description }]`, requis) : Liste ordonnée des étapes.
- **Compatibilité** : Essentiel (✅) | Autonome (✅)

---

### 2.13. `practicalInfo` — Informations Pratiques, Horaires & Zone (Optionnel)
- **Fichier de rendu** : `js/section-renderer.js` (`renderPracticalInfo()`)
- **Rôle** : Affichage structuré des horaires d'ouverture (midi/soir) et des badges de communes/zones desservies.
- **Contrat de données** :
  - `hours` (`array[{ days, times }]`, optionnel) : Tableau des plages horaires.
  - `areas` (`array[string]`, optionnel) : Communes ou secteurs géographiques couverts.
  - `address` (`string`, optionnel) : Adresse physique ou studio.
  - `phone` (`string`, optionnel) : Numéro de contact direct cliquable.
- **Compatibilité** : Essentiel (✅) | Autonome (✅)

---

### 2.14. `partners` — Logos Partenaires & Références (Optionnel)
- **Fichier de rendu** : `js/section-renderer.js` (`renderPartners()`)
- **Rôle** : Bandeau sobre de logos ou marques partenaires pour la réassurance B2B et institutionnelle.
- **Contrat de données** :
  - `id` (`string`, requis) : Identifiant.
  - `name` (`string`, requis) : Nom de l'entreprise ou du partenaire.
  - `logoUrl` (`string`, optionnel) : URL du logo vectoriel ou transparent.
- **Compatibilité** : Essentiel (✅) | Autonome (✅)

---

### 2.15. `contact` — Formulaire de Contact Sécurisé
- **Fichier HTML / JS** : `index.html` + `js/integrations/contact/` (`contact-validation.js`, `contact-service.js`, `contact-controller.js`)
- **Rôle** : Réception des messages clients sans backend propriétaire via le service sécurisé FormSubmit.co.
- **Contrat de données** :
  - `email` (`string`, requis, format email valide) : Adresse de réception du client.
  - `redirectUrl` (`string`, requis, format URL https) : URL de retour avec ancre `#contact`.
  - `subject` (`string`, requis) : Objet automatique de l'email.
  - `services` (`array[{ value, label }]`, requis) : Menu déroulant des prestations sélectionnables.
- **Compatibilité** : Essentiel (✅) | Autonome (✅)
- **Protection** : Validation anti-injection, anti-spam honeypot, animation de soumission sans rechargement de page.

---

### 2.16. `footer` — Pied de Page & Copyright
- **Fichier de rendu** : `js/section-renderer.js` (`renderFooter()`)
- **Rôle** : Mentions de copyright, rappel de marque et lien discret "Espace Pro" (uniquement en offre Autonome).
- **Contrat de données** :
  - `brand` (`string`, requis) : Nom de marque.
  - `tagline` (`string`, optionnel) : Slogan de bas de page.
  - `copyrightYear` (`string`, requis, défaut: `"2026"`) : Année courante.
  - `copyrightName` (`string`, requis) : Nom légal pour les droits réservés.
- **Compatibilité** : Essentiel (✅ sans Espace Pro) | Autonome (✅ avec modal Espace Pro)

---

### 2.17. `admin` — Tableau de Bord d'Administration (Espace Pro)
- **Fichiers** : `admin.html`, `js/admin/admin-auth.js`, `js/admin/admin-dashboard.js`, `js/admin.js`, `css/admin.css`
- **Rôle** : Authentification par mot de passe sécurisé (avec mot de passe de secours `Admin@2026!`), gestion CRUD en temps réel de la Galerie, des Looks, du Slider Avant/Après et des Prestations.
- **Compatibilité** : Essentiel (❌ **Suppression physique obligatoire**) | Autonome (✅ **Inclus et actif**)
