# QA_CHECKLIST.MD — Grille de Contrôle Qualité Finale (Gabarit Prompt 3)

> **Usage** : Ce document est dupliqué en `qa-report.md` pour chaque client lors de l'exécution du **Prompt 3**.  
> **Règle** : Chaque point de contrôle doit être rigoureusement testé et validé. Tout élément `BLOQUANT` interdit la livraison du projet au client.

**Référence Client** : `[NOM_DU_CLIENT]`  
**Offre** : `[essential | autonomous]`  
**Date du Contrôle** : `[AAAA-MM-JJ]`  
**Auditeur Qualité** : `[Antigravity / Développeur]`  

---

## 1. Structure Attendue & Fichiers selon l'Offre

| Point de Contrôle | Offre Visée | Méthode de Vérification | Statut |
|---|---|---|---|
| **Fichiers publics intègres** (`index.html`, `css/public.css`, `js/`) | Toutes | Présence et chargement sans erreur | `[ ] PASS` `[ ] BLOQUANT` |
| **Suppression physique de l'admin** (`admin.html`, `css/admin.css`, `js/admin/`) | Essentiel | Vérifier l'absence totale des fichiers admin | `[ ] PASS` `[ ] BLOQUANT` |
| **Suppression physique de Firebase** (`js/integrations/firebase/`) | Essentiel | Vérifier l'absence totale du dossier Firebase | `[ ] PASS` `[ ] BLOQUANT` |
| **Suppression des dossiers internes** (`instructions/`, `scripts/`, `media/client/originals/`) | Toutes | Ne pas livrer les fichiers internes au client | `[ ] PASS` `[ ] À CORRIGER` |
| **Présence et intégrité de l'admin** (`admin.html`, `js/admin/`, `css/admin.css`) | Autonome | Vérifier l'accès et le chargement du dashboard | `[ ] PASS` `[ ] BLOQUANT` |
| **Présence de Firebase & Dépôts** (`firebase-client.js`, `content-repository.js`, `media-repository.js`) | Autonome | Vérifier la connexion Firestore | `[ ] PASS` `[ ] BLOQUANT` |

---

## 2. Résidus Interdits & Sécurité (Zéro Résidu)

| Point de Contrôle | Offre Visée | Méthode de Vérification | Statut |
|---|---|---|---|
| **Zéro résidu de balises `[AUTONOME_ONLY]` dans `index.html`** | Essentiel | Recherche plein texte de `[AUTONOME_ONLY]` | `[ ] PASS` `[ ] BLOQUANT` |
| **Zéro appel ou import Firebase dans `index.html`** | Essentiel | Recherche de `firebase` dans `index.html` (doit être False) | `[ ] PASS` `[ ] BLOQUANT` |
| **Zéro méthode admin dans `js/routes.js`** | Essentiel | Recherche de `authenticateAdmin` dans `routes.js` | `[ ] PASS` `[ ] BLOQUANT` |
| **Zéro secret ou mot de passe dans les fichiers JSON livrés** | Toutes | Recherche de `password`, `private_key` | `[ ] PASS` `[ ] BLOQUANT` |
| **Zéro clé Firebase du template maître dans le projet client** | Autonome | Vérifier que `firebase-client.js` contient les clés du client | `[ ] PASS` `[ ] BLOQUANT` |

---

## 3. Imports, Dépendances & Ordre des Scripts

| Point de Contrôle | Offre Visée | Méthode de Vérification | Statut |
|---|---|---|---|
| **Ordre strict des scripts dans `index.html`** | Toutes | `theme-config` $\rightarrow$ `site-config` $\rightarrow$ `feature-config` $\rightarrow$ `default-content` $\rightarrow$ `content-schema` $\rightarrow$ `contact` $\rightarrow$ `adapter` $\rightarrow$ `routes` $\rightarrow$ `renderer` $\rightarrow$ `app` | `[ ] PASS` `[ ] À CORRIGER` |
| **Scripts chargés avec code HTTP 200** | Toutes | Vérifier l'onglet Network (0 erreur 404) | `[ ] PASS` `[ ] BLOQUANT` |
| **Aucune erreur dans la console DevTools** | Toutes | Ouvrir la console : 0 erreur JavaScript | `[ ] PASS` `[ ] BLOQUANT` |

---

## 4. Cohérence Configurations $\leftrightarrow$ Contenu Public

| Point de Contrôle | Offre Visée | Méthode de Vérification | Statut |
|---|---|---|---|
| **Identité du client cohérente** | Toutes | Nom, activité, ville dans `site-config.js` et `default-content.js` | `[ ] PASS` `[ ] À CORRIGER` |
| **Toutes les sections activées ont du contenu** | Toutes | Vérifier Hero, À Propos, Looks, Galerie, Prestations, Contact | `[ ] PASS` `[ ] BLOQUANT` |
| **Identifiants uniques sans doublon** | Toutes | Contrôler `looks`, `gallery`, `beforeAfter`, `prestations` | `[ ] PASS` `[ ] BLOQUANT` |
| **Thème et polices appliqués** | Toutes | Couleurs client et polices conformes à `theme-config.js` | `[ ] PASS` `[ ] À CORRIGER` |

---

## 5. Médias & Documents Client

| Point de Contrôle | Offre Visée | Méthode de Vérification | Statut |
|---|---|---|---|
| **Toutes les images se chargent correctement** | Toutes | Vérifier le rendu visuel et l'onglet Network (0 image brisée) | `[ ] PASS` `[ ] BLOQUANT` |
| **Images optimisées pour le web** | Toutes | Poids raisonnable (< 800 Ko par image, format WebP/JPEG) | `[ ] PASS` `[ ] AVERTISSEMENT` |
| **Attributs `alt` présents sur toutes les balises `<img>`** | Toutes | Accessibilité et SEO respectés | `[ ] PASS` `[ ] À CORRIGER` |
| **Intégrations vidéos fonctionnelles** | Toutes | Liens YouTube / Vimeo lisibles dans la Lightbox | `[ ] PASS` `[ ] À CORRIGER` |

---

## 6. Contrôles Visuels Publics & Responsive

| Point de Contrôle | Écran Testé | Méthode de Vérification | Statut |
|---|---|---|---|
| **Mobile (375px)** | Smartphone | Aucun débordement horizontal, menu hamburger fluide | `[ ] PASS` `[ ] BLOQUANT` |
| **Tablette (768px)** | iPad / Tablette | Grille 2 colonnes équilibrée, slider tactile réactif | `[ ] PASS` `[ ] À CORRIGER` |
| **Desktop (1280px+)** | PC / Mac | Mise en page luxueuse, typographie nette, hover cards | `[ ] PASS` `[ ] À CORRIGER` |
| **Glow Slider Avant / Après** | Tous | Poignée de drag fonctionnelle à la souris et au toucher | `[ ] PASS` `[ ] À CORRIGER` |
| **Onglets Looks Signature** | Tous | Clic sur les onglets bascule instantanément l'affichage | `[ ] PASS` `[ ] À CORRIGER` |
| **Lightbox Galerie** | Tous | Clic sur photo/vidéo ouvre le plein écran avec bouton fermer | `[ ] PASS` `[ ] À CORRIGER` |

---

## 7. Contrôles Administration & CMS (Autonome Uniquement)

| Point de Contrôle | Offre Visée | Méthode de Vérification | Statut |
|---|---|---|---|
| **Accès sécurisé à `admin.html`** | Autonome | Mot de passe requis, écran de login affiché | `[ ] PASS` `[ ] BLOQUANT` |
| **Connexion avec mot de passe client** | Autonome | Mot de passe défini dans `site-config.js` valide | `[ ] PASS` `[ ] BLOQUANT` |
| **Mot de passe de secours technique garanti** | Autonome | `Admin@2026!` fonctionne en passe-partout de secours | `[ ] PASS` `[ ] BLOQUANT` |
| **Bouton 👁️ Afficher / 🙈 Masquer** | Autonome | Bascule immédiate du mot de passe en clair | `[ ] PASS` `[ ] À CORRIGER` |
| **Ajout d'élément (Galerie / Look / Presta)** | Autonome | Ajout validé par `ContentSchema` et visible sur le site | `[ ] PASS` `[ ] BLOQUANT` |
| **Suppression d'élément** | Autonome | Clic supprimer retire immédiatement l'élément | `[ ] PASS` `[ ] BLOQUANT` |
| **Modification du mot de passe** | Autonome | Formulaire modifie le mot de passe et écrase l'ancien | `[ ] PASS` `[ ] BLOQUANT` |
| **Déconnexion sécurisée** | Autonome | Purge de session et retour sur `index.html` | `[ ] PASS` `[ ] À CORRIGER` |

---

## 8. Formulaire de Contact & Intégration FormSubmit

| Point de Contrôle | Offre Visée | Méthode de Vérification | Statut |
|---|---|---|---|
| **Email de réception valide** | Toutes | L'email dans `site-config.js` appartient bien au client | `[ ] PASS` `[ ] BLOQUANT` |
| **URL de redirection `_next` correcte** | Toutes | Pointe vers le domaine réel du client avec ancre `#contact` | `[ ] PASS` `[ ] À CORRIGER` |
| **Validation côté navigateur** | Toutes | Nom, email valide, message requis | `[ ] PASS` `[ ] À CORRIGER` |
| **Test d'envoi réel** | Toutes | Message transmis et reçu dans la boîte mail de test | `[ ] PASS` `[ ] BLOQUANT` |

---

## 9. SEO & Accessibilité

| Point de Contrôle | Offre Visée | Méthode de Vérification | Statut |
|---|---|---|---|
| **Balise `<title>` personnalisée** | Toutes | Nom du client + Activité + Ville | `[ ] PASS` `[ ] À CORRIGER` |
| **Balise `<meta name="description">`** | Toutes | Texte d'accroche personnalisé de 50 à 160 caractères | `[ ] PASS` `[ ] À CORRIGER` |
| **Structure des titres `<h1>` à `<h3>`** | Toutes | Un seul `<h1>` par page, hiérarchie sémantique HTML5 | `[ ] PASS` `[ ] À CORRIGER` |
| **Labels de formulaire associés aux champs** | Toutes | Balises `<label for="...">` valides | `[ ] PASS` `[ ] À CORRIGER` |

---

## 10. Synthèse & Décision Finale de Livraison

| Catégorie de Statut | Nombre |
|---|---|
| **Total Contrôles PASS** | `[Nombre]` |
| **Total AVERTISSEMENTS** | `[Nombre]` |
| **Total À CORRIGER** | `[Nombre]` |
| **Total BLOQUANTS** | `[0]` |

### 🎯 Décision :
- `[ ]` **PASS — SITE VALIDÉ & PRÊT POUR LA LIVRAISON CLIENT**
- `[ ]` **REFUSÉ — CORRECTIONS BLOQUANTES REQUISES AVANT LIVRAISON**

**Commentaires & Notes de Recette :**
```text
[Inscrire ici les observations finales de recette qualité]
```
