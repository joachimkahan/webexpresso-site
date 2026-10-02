# EDITABLE_FILES.MD — Périmètre des Fichiers Modifiables lors du Prompt 2

> **Règle absolue pour l'Agent IA (Antigravity)** :  
> Seuls les fichiers listés dans ce document sont autorisés à être modifiés pour adapter le site aux besoins du client.  
> **Tout autre fichier est strictement PROTÉGÉ** (voir `PROTECTED_FILES.md`).

---

## 1. Fichiers de Configuration Métier & Thème

| Fichier | Ce que vous devez modifier pour le client |
|---|---|
| `js/site-config.js` | Raison sociale, ville, activité, email de réception du formulaire, coordonnées, configuration SEO de base |
| `js/theme-config.js` | Palette de couleurs du client (`colorPrimary`, `colorSecondary`, `colorBackground`), polices Google Fonts |
| `js/feature-config.js` | Activation / désactivation des modules selon les choix de `site-spec.json` |
| `js/default-content.js` | Injection de l'ensemble des contenus publics issus de `site-content.json` |

---

## 2. Fichiers d'Instructions Client

| Fichier | Rôle lors de la personnalisation |
|---|---|
| `instructions/client-brief.json` | Expression initiale de la demande du client (lecture / mise à jour) |
| `instructions/site-spec.json` | Spécification technique finale et source de vérité de l'offre (lecture / mise à jour) |
| `instructions/site-content.json` | Données publiques validées prêtes à être injectées dans `default-content.js` |
| `instructions/missing-information.md` | Suivi et clôture des arbitrages / validations client |

---

## 3. Médias & Documents Client

| Dossier | Contenu autorisé |
|---|---|
| `media/client/originals/` | Réception des fichiers visuels sources fournis par le client |
| `media/client/optimized/` | Visuels optimisés pour le web (JPEG/WebP haute performance) |
| `documents/` | Plaquettes tarifaires PDF, conditions générales ou documents téléchargeables |

---

## 4. Documentation du Projet Client Livré

| Fichier | Action lors du Prompt 2 |
|---|---|
| `README.md` | Dérivé du gabarit `README.client.md` lors de la finalisation du projet client (documentant la mise en ligne, le mot de passe initial et le guide d'utilisation) |

---

> ⚠️ **Interdiction** : Ne modifiez jamais les sélecteurs CSS (`class`, `id`), les structures de contrôleurs ni les algorithmes du moteur. Modifiez uniquement les valeurs de configuration et de contenu.
