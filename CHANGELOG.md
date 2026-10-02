# 📜 CHANGELOG — Historique des Versions du Template Maître

---

## [2.1.0] — 2026-08-31
### 🛡️ Immunisation Architecturale & Durcissement Graphique (Phase E)

#### 🚀 Correctifs Bloquants (P1)
- **Suppression du voile bloquant `#page-voile`** : Neutralisation de `.page-voile { display: none !important; }` et sécurisation de `initApp()` dans `app.js` avec `try/finally` pour éliminer tout risque d'écran noir.
- **Support universel des tags dans `renderLooks()`** : Traitement polymorphe des tags acceptant indifféremment un tableau `tags: [...]` ou une chaîne `tags: "..."` sans jamais lever de `TypeError`.
- **Restauration de la visibilité et animation du Hero** : Déclaration de `@keyframes heroEntrance` et fixation de `opacity: 1` par défaut sur `.hero-content`.
- **Protection anti-débordement du logo Navbar** : Application de `max-width: calc(100% - 70px)` et troncature `text-overflow: ellipsis` pour empêcher tout nom long de pousser le bouton hamburger hors du viewport (320px–375px).

#### 🎨 Design System & Tokens (P2)
- **Nettoyage des 56 couleurs en dur dans `public.css`** : Remplacement de tous les dégradés or et lueurs fixes par `var(--color-primary)`, `var(--color-accent)`, `var(--color-border)` et `var(--or-glow)`.
- **Fond du menu mobile synchronisé** : `#mobile-nav` utilise désormais `var(--color-overlay)` avec `backdrop-filter: blur(20px)`.
- **Dégradé Hero adaptatif** : `.hero-overlay` dérive dynamiquement vers `var(--color-bg)` avec un contraste optimal.
- **Boutons CTA adaptatifs** : `.btn-primary` et `.btn` supportent les libellés de plus de 50 caractères avec `word-break: break-word` et `max-width: 100%`.
- **Bannière cinématique verrouillée** : `min-height: clamp(260px, 40vw, 520px)` et `object-fit: cover` sur `.cine-banner img`.
- **Sécurisation de la Galerie Vidéo** : Parseur d'URLs YouTube universel supportant `watch?v=`, `youtu.be/` et `embed/`.
- **Purge de la variable obsolète `--gris-pierre`** : Remplacement par `var(--color-text-muted)`.

#### 📐 Finition & Typographie (P3)
- **Token de graisse des titres `--font-heading-weight`** : Permet au Prompt 2 d'ajuster l'épaisseur des polices d'impact (ex: 700 pour `Syne`, 400 pour `Cormorant`).
- **Centrage responsive des grilles Processus impaires** : Alignement flexbox de la dernière rangée pour les listes de 5 étapes.
- **Harmonisation de la modale "Accès Pro"** : Nettoyage des styles inline et application des tokens de surface et typographie.
- **Liaison synchrone de `tokens.css`** : Ajout de `<link rel="stylesheet" href="css/tokens.css">` dans le `<head>` de `index.html`.

---

## [2.0.0] — 2026-08-25
- Architecture modulaire binaire (Offre Essentiel vs Offre Autonome).
- Séparation des contrôleurs de contact et d'administration.
- Intégration FormSubmit et Firebase v8.
