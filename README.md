# TEMPLATE MAÎTRE UNIQUE — Guide d'Utilisation & Architecture

> **Version du Template** : 2.0.0  
> **Méthode** : Personnalisation manuelle guidée par IA (Antigravity) en 3 Prompts (sans générateur codé).

---

## 📖 1. Présentation du Projet

Ce dépôt constitue le **Template Maître Unique** conçu pour produire deux gammes de sites vitrines professionnels haute performance :
1. **Offre Essentiel** : Site vitrine 100% statique, ultra-rapide, sans serveur, sans dépendance externe, avec formulaire de contact sécurisé.
2. **Offre Autonome** : Même socle public d'exception + tableau de bord d'administration sécurisé (`admin.html`), base de données Firestore en temps réel, gestionnaire de médias et schéma de contenu versionné.

---

## 🗺️ 2. Guide des Documents de Référence

L'ensemble des règles de personnalisation, contrats de données et consignes d'architecture sont formalisés dans les documents à la racine du template :

| Document | Rôle & Usage pour le Développeur / Antigravity |
|---|---|
| [COMPONENTS.md](file:///c:/Users/33783/Documents/Informatique/WebExpress/Technique/Phase%202%20_%20Template%20et%20master%20prompt/template/COMPONENTS.md) | **Catalogue des composants** : contrats de données, types de champs, valeurs par défaut, variantes et compatibilité par offre. |
| [EDITABLE_FILES.md](file:///c:/Users/33783/Documents/Informatique/WebExpress/Technique/Phase%202%20_%20Template%20et%20master%20prompt/template/EDITABLE_FILES.md) | **Périmètre modifiable** : liste exhaustive des fichiers autorisés à être modifiés pour un client spécifique lors du Prompt 2. |
| [PROTECTED_FILES.md](file:///c:/Users/33783/Documents/Informatique/WebExpress/Technique/Phase%202%20_%20Template%20et%20master%20prompt/template/PROTECTED_FILES.md) | **Périmètre protégé** : liste des fichiers constituant le moteur architectural du template, strictement interdits de modification éditoriale. |
| [OFFER_RULES.md](file:///c:/Users/33783/Documents/Informatique/WebExpress/Technique/Phase%202%20_%20Template%20et%20master%20prompt/template/OFFER_RULES.md) | **Matrice des offres** : règles de suppression physique (Essentiel) ou de configuration Firebase/Admin (Autonome). |
| [QA_CHECKLIST.md](file:///c:/Users/33783/Documents/Informatique/WebExpress/Technique/Phase%202%20_%20Template%20et%20master%20prompt/template/QA_CHECKLIST.md) | **Grille de recette qualité** : ensemble des contrôles obligatoires à exécuter avant toute livraison client (Prompt 3). |

---

## ⚡ 3. Les 3 Prompts de Personnalisation Manuelle

La création d'un site client s'exécute manuellement via l'agent IA Antigravity selon la séquence stricte en 3 étapes :

```
┌───────────────────────────┐
│   PROMPT 1 : SOCLE        │  Validation et intégrité du template maître
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│   PROMPT 2 : CLIENT       │  Duplication, injection des instructions et personnalisation
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│   PROMPT 3 : RECETTE      │  Contrôle qualité systématique avec QA_CHECKLIST.md
└───────────────────────────┘
```

### Étape 1 : Prompt 1 — Structuration du Template Maître
- **Objectif** : S'assurer que le template maître est 100% intègre, que tous les fichiers sont présents et que les tests du terminal passent avec succès.

### Étape 2 : Prompt 2 — Création & Personnalisation Manuelle du Projet Client
- **Actions réalisées par Antigravity** :
  1. Copier l'intégralité du dossier `template/` vers le dossier cible du projet client (ex: `clients/mon-client/`).
  2. Renseigner les fichiers d'instructions dans `instructions/` (`client-brief.json`, `site-spec.json`, `site-content.json`, `missing-information.md`).
  3. Valider les instructions avec la commande :
     ```bash
     python scripts/validate-instructions.py
     ```
  4. Injecter les données client dans `js/site-config.js`, `js/theme-config.js`, `js/feature-config.js` et `js/default-content.js`.
  5. Appliquer les règles d'offre définies dans `OFFER_RULES.md` :
     - **Si offre Essentiel** : Supprimer physiquement `admin.html`, `css/admin.css`, `js/admin/`, `js/integrations/firebase/`, `instructions/`, `scripts/`, et purger les balises `[AUTONOME_ONLY]`.
     - **Si offre Autonome** : Configurer les clés Firebase client et définir le mot de passe initial.
  6. Renommer `README.client.md` en `README.md` pour le client final.

### Étape 3 : Prompt 3 — Recette Qualité Finale
- **Actions** :
  1. Exécuter l'intégralité des points de contrôle de [QA_CHECKLIST.md](file:///c:/Users/33783/Documents/Informatique/WebExpress/Technique/Phase%202%20_%20Template%20et%20master%20prompt/template/QA_CHECKLIST.md).
  2. Vérifier l'absence de toute erreur dans la console navigateur (0 erreur JS, 0 warning critique).
  3. Tester la soumission du formulaire de contact et la responsivité mobile/tablette.
  4. Valider le projet pour livraison.

---

## 🛠️ 4. Structure des Dossiers du Template Maître

```text
template/
├── index.html                                 # Page publique principale
├── admin.html                                 # Tableau de bord admin (Autonome)
├── TEMPLATE_VERSION                           # Version courante du template (2.0.0)
│
├── css/
│   ├── public.css                             # Design system & styles publics
│   └── admin.css                              # Styles du tableau de bord admin
│
├── js/
│   ├── default-content.js                     # Modèle et données de contenu universelles
│   ├── site-config.js                         # Configuration de marque et identité
│   ├── theme-config.js                        # Tokens graphiques (couleurs, polices)
│   ├── feature-config.js                      # Gestionnaire d'activation des modules
│   ├── content-schema.js                      # Schéma versionné et validateur
│   ├── content-adapter.js                     # Adaptateur universel normalisateur
│   ├── section-renderer.js                    # Moteur de rendu dynamique du DOM
│   ├── routes.js                              # Routage public et gardes d'accès admin
│   ├── app.js                                 # Contrôleur d'interactions publiques
│   ├── admin.js                               # Point d'entrée de l'administration
│   ├── admin/
│   │   ├── admin-auth.js                      # Authentification et gestion session
│   │   └── admin-dashboard.js                 # Contrôleur CRUD et formulaires admin
│   └── integrations/
│       ├── contact/
│       │   ├── contact-validation.js          # Validation anti-injection du formulaire
│       │   ├── contact-service.js             # Service réseau FormSubmit
│       │   └── contact-controller.js          # Contrôleur d'interface du formulaire
│       └── firebase/
│           ├── firebase-client.js             # Connexion SDK Firebase
│           ├── media-repository.js            # Validation et compression des médias
│           └── content-repository.js          # Dépôt Firestore & LocalStorage
│
├── instructions/                              # Fichiers de brief et spécifications client
│   ├── client-brief.json
│   ├── site-spec.json
│   ├── site-content.json
│   └── missing-information.md
│
├── scripts/
│   └── validate-instructions.py               # Validateur automatisé des instructions
│
├── media/                                     # Médias et visuels
│   └── client/
│       ├── originals/
│       └── optimized/
│
└── documents/                                 # Documents et plaquettes téléchargeables
```
