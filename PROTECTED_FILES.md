# PROTECTED_FILES.MD — Périmètre des Fichiers Protégés (Non Modifiables)

> **Règle absolue pour l'Agent IA (Antigravity)** :  
> Ces fichiers constituent le **moteur architectural, sécuritaire et graphique** du template.  
> Ils ne doivent **JAMAIS** faire l'objet de modifications éditoriales directes lors du Prompt 2.

---

## 1. Moteur de Rendu & Adaptateurs Publics

| Fichier | Rôle Architectural & Raison de la Protection |
|---|---|
| `js/section-renderer.js` | Moteur de génération dynamique du DOM pour l'ensemble des sections publiques |
| `js/content-adapter.js` | Couche d'accès universelle et normalisateur de données (garant de la parité Essentiel/Autonome) |
| `js/content-schema.js` | Définition des contrats de données et validateur de schéma (`_schemaVersion: 1`) |
| `js/routes.js` | Gestionnaire centralisé des routes publiques et du contrôle d'accès Espace Pro |
| `js/app.js` | Gestionnaire d'interactions utilisateur (Lightbox, Glow Slider, onglets, transitions de page) |

---

## 2. Module de Contact Isolé

| Fichier | Rôle Architectural & Raison de la Protection |
|---|---|
| `js/integrations/contact/contact-validation.js` | Règles de validation syntaxique et assainissement anti-injection du formulaire |
| `js/integrations/contact/contact-service.js` | Couche réseau isolée d'envoi FormSubmit (sans dépendance externe) |
| `js/integrations/contact/contact-controller.js` | Contrôleur d'événements, gestion des états de soumission et animations |

---

## 3. Feuille de Styles Principale

| Fichier | Rôle Architectural & Raison de la Protection |
|---|---|
| `css/public.css` | Design System complet (variables CSS, typographie, grille responsive, animations). Toute modification manuelle entraîne des régressions d'affichage. |

---

## 4. Outils de Recette & Gouvernance du Template

| Fichier | Rôle & Raison de la Protection |
|---|---|
| `COMPONENTS.md` | Catalogue officiel des spécifications et contrats de données |
| `EDITABLE_FILES.md` | Périmètre d'autorisation des modifications client |
| `PROTECTED_FILES.md` | Ce document lui-même |
| `OFFER_RULES.md` | Matrice des règles de suppression et d'isolation des offres |
| `QA_CHECKLIST.md` | Grille d'évaluation qualité (Prompt 3) |
| `TEMPLATE_VERSION` | Version officielle du template maître |
| `scripts/validate-instructions.py` | Validateur automatisé des instructions |

---

> ℹ️ **Remarque sur les Fichiers Contrôlés par l'Offre** :  
> Certains fichiers (`admin.html`, `js/admin/`, `js/integrations/firebase/`, `routes.js`) sont protégés contre toute modification éditoriale, mais font l'objet d'une **suppression ou purge structurelle** si et seulement si l'offre choisie est `essential` (se référer impérativement à `OFFER_RULES.md`).
