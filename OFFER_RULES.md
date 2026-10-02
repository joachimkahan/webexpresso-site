# OFFER_RULES.MD — Matrice des Règles de Transformation par Offre

> **Version** : 2.0.0  
> **Source de Vérité Unique** : Ce document est la référence exclusive suivie par l'Agent IA (Antigravity) lors de l'exécution du **Prompt 2** pour transformer une copie du template en site client final (**Essentiel** ou **Autonome**).  
> **Règle d'or** : Aucune logique n'est déléguée à un générateur automatique ; chaque étape est appliquée manuellement, rigoureusement et vérifiée sans résidu.

---

## 1. Cartographie Complète des Fonctionnalités par Offre

| Fonctionnalité | Dossiers & Fichiers Associés | Routes Associées | Dépendances & SDK | Offre `essential` | Offre `autonomous` |
|---|---|---|---|:---:|:---:|
| **Socle Public & Rendu** | `index.html`, `css/public.css`, `js/section-renderer.js`, `js/app.js` | `#accueil`, `#apropos`, `#looks`, `#galerie`, `#prestations`, `#contact` | Vanilla JS / CSS | ✅ **Oui** | ✅ **Oui** |
| **Contenus & Schémas Locaux** | `js/default-content.js`, `js/content-schema.js`, `js/content-adapter.js` | N/A | Aucun | ✅ **Oui** | ✅ **Oui** (Fallback) |
| **Configurations Métier & Thème** | `js/site-config.js`, `js/theme-config.js`, `js/feature-config.js` | N/A | Aucun | ✅ **Oui** | ✅ **Oui** |
| **Formulaire Contact Isolé** | `js/integrations/contact/` (`contact-validation.js`, `contact-service.js`, `contact-controller.js`) | `#contact` | Service FormSubmit.co | ✅ **Oui** | ✅ **Oui** |
| **Espace Administration (Dashboard)** | `admin.html`, `css/admin.css`, `js/admin/admin-dashboard.js`, `js/admin.js` | `admin.html` | Vanilla JS / CSS | ❌ **NON (Supprimé)** | ✅ **Oui** |
| **Authentification & Session Admin** | `js/admin/admin-auth.js`, modal login dans `index.html` | Modal login public + garde `admin.html` | SessionStorage / LocalStorage | ❌ **NON (Supprimé)** | ✅ **Oui** |
| **Firebase App & SDK** | CDN Firebase (`firebase-app.js`, `firebase-firestore.js`), `js/integrations/firebase/firebase-client.js` | N/A | SDK Firebase v8 | ❌ **NON (Supprimé)** | ✅ **Oui** |
| **Dépôt Firestore & Données CMS** | `js/integrations/firebase/content-repository.js` | N/A | Firestore API | ❌ **NON (Supprimé)** | ✅ **Oui** |
| **Gestionnaire de Médias** | `js/integrations/firebase/media-repository.js` | N/A | Canvas API / Storage | ❌ **NON (Supprimé)** | ✅ **Oui** |
| **Dossiers de Travail Internes** | `instructions/`, `scripts/`, `media/client/originals/` | N/A | Aucun | ❌ **NON (Supprimé)** | ❌ **NON (Supprimé)** |

---

## 2. Offre Essentiel — Procédure de Suppression Physique Exhaustive

Lorsqu'un projet client est commandé sous l'offre **Essentiel** (`selectedOffer: "essential"`), exécuter scrupuleusement la liste de suppressions suivante :

### 2.1. Suppression Physique des Fichiers et Dossiers
Supprimer définitivement les 14 éléments suivants du dossier projet :
- [ ] `admin.html` *(Page d'administration)*
- [ ] `css/admin.css` *(Feuille de styles admin)*
- [ ] `js/admin.js` *(Point d'entrée admin)*
- [ ] `js/admin/` *(Dossier complet : admin-auth.js, admin-dashboard.js)*
- [ ] `js/integrations/firebase/` *(Dossier complet : firebase-client.js, content-repository.js, media-repository.js)*
- [ ] `instructions/` *(Dossier complet : client-brief.json, site-spec.json, site-content.json, missing-information.md)*
- [ ] `scripts/` *(Dossier complet : validate-instructions.py)*
- [ ] `media/client/originals/` *(Dossier des visuels sources bruts)*
- [ ] `COMPONENTS.md` *(Documentation interne template)*
- [ ] `EDITABLE_FILES.md` *(Documentation interne template)*
- [ ] `PROTECTED_FILES.md` *(Documentation interne template)*
- [ ] `OFFER_RULES.md` *(Documentation interne template)*
- [ ] `QA_CHECKLIST.md` *(Documentation interne template)*
- [ ] `TEMPLATE_VERSION` *(Fichier de version interne)*

---

### 2.2. Nettoyage Manuel de `index.html`

1. **Supprimer le bloc de scripts Firebase & Dépôts** :
   ```html
   <!-- SUPPRIMER CE BLOC ENTIER : -->
   <!-- [AUTONOME_ONLY_START] -->
   <script src="js/integrations/firebase/firebase-client.js"></script>
   <script src="js/integrations/firebase/media-repository.js"></script>
   <script src="js/integrations/firebase/content-repository.js"></script>
   <!-- [AUTONOME_ONLY_END] -->
   ```

2. **Supprimer la modale d'accès administrateur** :
   ```html
   <!-- SUPPRIMER CE BLOC ENTIER : -->
   <!-- [AUTONOME_ONLY_START] -->
   <div class="lightbox" id="admin-login-modal" ...>
       ...
   </div>
   <!-- [AUTONOME_ONLY_END] -->
   ```

3. **Vérifier l'ordre des scripts restants dans `index.html`** :
   ```html
   <!-- Scripts Socle Commun -->
   <script src="js/theme-config.js"></script>
   <script src="js/site-config.js"></script>
   <script src="js/feature-config.js"></script>
   <script src="js/default-content.js"></script>
   <script src="js/content-schema.js"></script>

   <!-- Intégration Contact Isolée -->
   <script src="js/integrations/contact/contact-validation.js"></script>
   <script src="js/integrations/contact/contact-service.js"></script>
   <script src="js/integrations/contact/contact-controller.js"></script>

   <!-- Adaptateur universel, Routage & Rendu des sections -->
   <script src="js/content-adapter.js"></script>
   <script src="js/routes.js"></script>
   <script src="js/section-renderer.js"></script>
   <script src="js/app.js"></script>
   ```

---

### 2.3. Nettoyage Manuel de `js/routes.js`
Dans `js/routes.js`, supprimer le bloc de routage administratif balisé :
```javascript
// SUPPRIMER CE BLOC ENTIER :
// [AUTONOME_ONLY_START]
getExpectedAdminPin: function () { ... },
authenticateAdmin: function (enteredPassword) { ... },
logoutAdmin: function () { ... },
toggleModalPassword: function () { ... },
handleModalSubmit: function (event) { ... }
// [AUTONOME_ONLY_END]
```

---

### 2.4. Finalisation de la Documentation Client
- [ ] Renommer le fichier `README.client.md` en `README.md` à la racine du projet.

---

## 3. Offre Autonome — Procédure de Configuration & Conservation

Lorsqu'un projet client est commandé sous l'offre **Autonome** (`selectedOffer: "autonomous"`), **tous les fichiers sont conservés** et les configurations suivantes sont renseignées :

### 3.1. Automatisation de l'Injection Firebase Client (`site-spec.json` ➔ `firebase-client.js`)
Lors de l'exécution du **Prompt 2** sous l'offre **Autonome** :
1. L'Agent lit automatiquement le bloc `firebaseConfig` défini dans `instructions/site-spec.json` :
   ```json
   "firebaseConfig": {
     "apiKey": "AIzaSy...",
     "authDomain": "client-id.firebaseapp.com",
     "projectId": "client-id",
     "storageBucket": "client-id.firebasestorage.app",
     "messagingSenderId": "123456789",
     "appId": "1:123456789:web:abcdef",
     "measurementId": "G-XXXXXXXXXX"
   }
   ```
2. L'Agent injecte ces valeurs directement dans la constante `FIREBASE_CONFIG` de `js/integrations/firebase/firebase-client.js`.
3. Si `apiKey` est renseignée avec une vraie clé Google, la base Firestore se connecte instantanément. Si `apiKey` reste `"VOTRE_API_KEY"`, le site reste en mode local de démonstration sans rupture.

### 3.2. Configuration du Mot de Passe Sécurisé (`js/site-config.js`)
- Renseigner `admin.passwordDefault` avec un mot de passe fort (lettres, chiffres, caractères spéciaux).
- Noter que le mot de passe de secours technique garanti `Admin@2026!` reste actif pour vos télémaintenances.
- Le client pourra modifier son mot de passe en toute autonomie depuis `admin.html`.

### 3.3. Initialisation des Données & Schéma (`js/default-content.js`)
- Injecter les contenus initiaux validés dans `default-content.js`. Ces données servent de contenu initial si les collections Firestore sont vierges lors du premier démarrage.
- Le schéma `_schemaVersion: 1` défini dans `content-schema.js` s'applique automatiquement à toute création/modification ultérieure dans Firestore.

### 3.4. Nettoyage des Dossiers Internes Post-Personnalisation
- [ ] Supprimer `instructions/` et `scripts/` avant livraison au client.
- [ ] Renommer `README.client.md` en `README.md`.

---

## 4. Combinaisons Incohérentes & Points de Vigilance Manuelle

Lors de la personnalisation, l'opérateur doit impérativement s'assurer de ne jamais créer les anomalies suivantes :

| Anomalie Détectée | Risque / Symptôme | Action Corrective Immédiate |
|---|---|---|
| **Administration active sans Authentification** | Faille de sécurité : n'importe qui accède à `admin.html` | Vérifier que `AdminAuth.checkState()` est appelé au chargement de `admin.html`. |
| **Firebase actif sous Offre Essentiel** | Violation de l'offre, requêtes inutiles et erreurs console 404 | Supprimer `js/integrations/firebase/` et purger les `<script>` dans `index.html`. |
| **Contenus dynamiques sans `default-content.js`** | Écran blanc si Firestore est inaccessible ou hors-ligne | Toujours conserver un `default-content.js` complet et à jour en repli. |
| **Divergence de schéma (`_schemaVersion` manquant)** | Incohérence des formulaires CRUD et corruption de données | Vérifier que `content-schema.js` est chargé avant `content-repository.js`. |
| **Email de contact manquant ou pointant vers localhost** | Perte des messages prospects du client | Vérifier `site-config.js` (`contact.email`) et le champ `_next` de redirection. |

---

## 5. Protocole de Vérification Post-Suppression (Offre Essentiel)

Après avoir appliqué les suppressions pour une offre Essentiel, exécuter les contrôles suivants :

### 5.1. Recherche de Résidus de Code (Commandes Terminal)
Exécuter ces commandes dans le terminal à la racine du projet :
```bash
# 1. Vérifier qu'aucune référence à Firebase ne subsiste dans index.html
python -c "content = open('index.html', encoding='utf-8').read(); print('Firebase in index.html:', 'firebase' in content.lower())"
# Attendu: False

# 2. Vérifier qu'aucun fichier admin n'est présent
python -c "import os; print('Admin files present:', os.path.exists('admin.html') or os.path.exists('js/admin'))"
# Attendu: False

# 3. Vérifier qu'aucune méthode admin n'est présente dans routes.js
python -c "content = open('js/routes.js', encoding='utf-8').read(); print('AdminAuth in routes.js:', 'authenticateAdmin' in content)"
# Attendu: False
```

### 5.2. Contrôle Navigateur (Console DevTools)
1. Ouvrir `index.html` dans le navigateur.
2. Ouvrir la console DevTools (`F12`) :
   - [ ] **0 erreur JavaScript**.
   - [ ] `window.firebase` est `undefined`.
   - [ ] `window.ContentRepository` est `undefined`.
   - [ ] `window.AdminAuth` est `undefined`.
   - [ ] Aucun appel réseau vers `firestore.googleapis.com` dans l'onglet **Network**.
   - [ ] Tous les textes et médias s'affichent parfaitement depuis `default-content.js`.
