# Site WebExpresso : comment il est fait

Site vitrine de WebExpresso, direction « le comptoir » (refonte de novembre 2026). Les pages publiées, à la racine du dépôt, sont **produites** : on modifie `_source/`, puis on reconstruit. On ne retouche jamais une page publiée à la main.

## 1. Pour qui, sur quel ton

Le visiteur est un artisan, un commerçant, un indépendant, souvent une personne âgée, peu à l'aise avec Internet. Il craint l'arnaque, l'abonnement piège et les mots qu'il ne comprend pas. Le site doit être **chaleureux**, **ne pas faire peur** et **donner confiance**.

- Vouvoiement, phrases courtes, mots de tous les jours. Une idée par phrase.
- Des faits, jamais d'adjectif creux (« sur-mesure », « d'exception », « clé de votre réussite »).
- Rien d'inventé : ni client, ni avis, ni chiffre, ni délai, ni promesse qui ne figure pas dans la fiche des offres.
- Titres en casse de phrase (« Formules et prix », pas « Formules Et Prix »). Aucun mot tout en capitales.
- Aucun émoji. Aucune flèche collée à un bouton ou à un lien. Aucun tiret long pour relier deux idées : une virgule, deux-points ou deux phrases.
- Le bouton principal porte partout le même nom : « Commencer gratuitement » (dans l'en-tête : « Commencer »). Il mène à `questionnaire/index.html`.
- La marque s'écrit toujours **WebExpresso**.

### Mots à ne pas montrer au visiteur

| On n'écrit pas | On écrit |
|---|---|
| SAV | dépannage, petits travaux |
| Espace Pro (seul) | « votre espace privé (l'Espace Pro) » à la première mention, puis « l'espace pro » |
| copie figée, export statique | « votre site reste en ligne, tel qu'il est » |
| GitHub Pages, Firebase, Netlify | « l'hébergement du site » (le nom du prestataire n'apparaît que dans les pages légales et, une fois, dans la page Formules et prix) |
| Stripe | « paiement par carte bancaire, sur une page sécurisée » (Stripe nommé une seule fois, page Formules et prix, et dans les conditions de vente) |
| template, socle, déployer, responsive, https, nom de domaine (seul) | « l'adresse de votre site (par exemple www.votre-nom.fr) » |
| acompte, mensualités restantes dues | « ce qui reste à payer des 3 premiers mois » |

## 2. Les faits : une seule source

Prix, durées d'engagement, ce qui se passe à l'arrêt, petits travaux à la carte : tout vient de la fiche des offres, `Technique/.agents/rules/offres-et-tarifs.md` (miroir de la fiche mémoire de Claude). Ne rien écrire qui la contredise ou la dépasse. Mentions obligatoires :

- le prix et la durée d'engagement se lisent côte à côte ;
- le total minimum (290 € ou 400 €) est dit là où l'on parle d'abonnement ;
- la phrase « Vous gardez toujours votre site si vous arrêtez. » est visible sur chaque page (elle est déjà dans le pied de page commun) ;
- aucune promesse de résultat pour l'accompagnement (ni clients, ni visibilité, ni classement) ;
- l'offre à 500 € n'a jamais sa fiche : une seule ligne discrète, mot pour mot « Vous préférez l'espace pro dès le départ, sans abonnement ? Possible, sur demande : 500 €. »

## 3. Construire

Depuis le dossier du site :

```
py -3 -B _source/construire.py             écrit les pages à la racine
py -3 -B _source/construire.py --verifier   échoue si une page publiée n'est plus à jour
py -3 -B _source/controler.py               contrôle les pages publiées (liens, images, mots interdits, prix)
```

Une page de `_source/pages/` commence par un commentaire d'en-tête, puis donne le contenu de `<main>` :

```html
<!--
titre: Formules et prix
description: Une phrase pour les moteurs de recherche (140 à 160 caractères).
menu: formules
classe: page-formules
-->
<section class="page-haut">…</section>
```

`menu` vaut `accueil`, `formules`, `exemples`, `deroule`, `equipe`, `questions` ou `contact` (page courante du menu). `{{racine}}` précède toute adresse interne (`{{racine}}formules.html`, `{{racine}}assets/…`). `{{inclure:nom}}` insère `_source/morceaux/nom.html`.

Morceaux disponibles : `picto-tasse`, `picto-calendrier`, `picto-ticket`, `picto-cle`, `picto-coche` (dessins au trait), `portraits` (les deux portraits des fondateurs), `bandeau-fin` (dernière section commune : « On commence ? »). **Chaque page se termine par `{{inclure:bandeau-fin}}`**, sauf les pages légales et la page d'erreur.

## 4. Les composants (classes de `css/site.css`)

Page d'accueil construite : `_source/pages/index.html` est le modèle à suivre pour l'écriture HTML.

| Besoin | Classes |
|---|---|
| Largeur de page, largeur de lecture | `cadre`, `cadre cadre--lecture` |
| Section | `section`, `section--serree` (moins haute), `section--lait` (fond café au lait), `section--bleu` (fond bleu, texte crème) |
| Haut d'une page intérieure | `<section class="page-haut"><div class="cadre">` : `h1`, puis `p.accroche`, puis `div.actions` facultatif |
| Haut de page avec un dessin à droite | `<section class="page-haut page-haut--planche"><div class="cadre">` : `div.page-haut__texte` (h1, accroche, actions) puis `figure.page-haut__planche` (`aria-hidden="true"`, un grand dessin SVG inclus par `{{inclure:planche-…}}`) ; la planche ne s'affiche qu'à partir de 900 px |
| Bas de section en dents de ticket | `section--dents`, sur une section de ton suivie d'une section crème ; une fois par page au plus, jamais sur le bandeau de fin |
| En-tête de section | `ouverture` (titre puis phrase), `ouverture ouverture--deux` (titre à gauche, phrase à droite), `ouverture ouverture--lien` (titre à gauche, lien à droite) |
| Texte | `accroche` (phrase d'introduction), `doux` (texte secondaire), `petit`, `mesure` (65 caractères par ligne) |
| Boutons | `bouton` (principal), `bouton bouton--clair` (secondaire), groupés dans `div.actions` ; lien vers une autre page : `lien-suite` |
| Pastilles | `etiquette` (crème dorée), `etiquette etiquette--trait` (contour), `etiquette etiquette--bleu` ; tampon incliné : `tampon` (réservé à « Recommandée ») |
| Ticket de caisse | `div.ticket-pose > aside.ticket` ; à l'intérieur `p.ticket__tete`, `p.ticket__sous`, `dl.ticket__lignes > div > dt + span.points + dd`, `p.ticket__inter` (sous-titre), `dl.ticket__lignes.ticket__total` (ligne de total), `p.ticket__pied` (mot manuscrit) ; `ticket--grand` pour un ticket plus lisible ; trois tickets côte à côte : `div.tickets` |
| Étapes numérotées | `ol.etapes > li.etape` : `div.etape__dessin` (un picto), `h3`, `p`, `span.etiquette` |
| Fiches des trois formules | `div.formules > article.formule` (`formule--choix` pour la recommandée, avec `span.tampon`) : `h3.formule__nom`, `p.formule__pour`, `p.formule__prix` (+ `small`), `p.formule__engagement`, `ul.formule__compris > li` (`li.sans` pour ce qui n'est pas compris), `a.bouton` |
| Frise en trois temps | `div.frise > div.frise__temps` : `p.frise__quand`, `h3`, `p` |
| Tableau | `div.tableau-zone > table.tableau` : `caption`, `thead th`, `tbody th` (intitulé de ligne), cellules `oui` / `non` / `prix`, colonne mise en avant `col-choix` |
| Étape détaillée « vous / nous » | `div.pas` : `div.pas__titre` (`div.etape__dessin` + `h2` avec `span.pas__numero`), `div.pas__roles > div.pas__role` (`h3`, `p` ou `ul`) |
| Exemples de sites | `div.exemples` (2 colonnes), `exemples--trois` ; `article.exemple` : `a.exemple__vue` ou `div.exemple__vue` avec `img.exemple__grand` + `span.exemple__petit > img`, puis `div.exemple__texte` (`span.etiquette`, `h3`, `p`, `a.lien-suite` facultatif) |
| Questions et réponses | `div.questions > details.question` : `summary`, `div.question__reponse > p` ; un `id` sur `details` permet un lien direct ; groupes : `div.questions-groupe > h2 + div.questions` |
| Texte long (pages légales, explications) | `div.prose` : `h2`, `h3`, `p`, `ul`, `ol` |
| Encadré | `div.encadre`, `encadre encadre--blanc` (jamais d'encadré dans un encadré) |
| Deux colonnes | `div.deux-colonnes` ; liste à coches : `ul.liste-coches` |
| Grand message (contact, erreur) | `section.message`, grande adresse : `a.adresse-ecrire` |

Images des exemples, dans `assets/exemples/` : `leana`, `joachim` (sites réels), `relieur`, `verrier`, `coutelier`, `torrefacteur` (démonstrations), chacun en `-ordinateur.webp` (1200 × 750) et `-telephone.webp` (390 × 823 ; 780 × 1647 pour `leana` et `joachim`). Toute `<img>` porte `width`, `height` et un `alt` qui décrit ce qu'on voit (`alt=""` pour la vignette téléphone qui redit la grande image).

### Styles en cours de travail

`_source/ajouts-‹nom›.css` : une feuille par chantier, rassemblées par la construction dans `css/ajouts.css` (chargée après `css/site.css`). Elle sert quand plusieurs personnes travaillent en même temps ; un chantier terminé se fusionne dans `css/site.css`, puis son fichier d'ajouts se supprime.

### Les dessins

Tous les dessins sont des SVG écrits à la main, au trait : `fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"`, épaisseur 2,6 pour une vignette de 64 (ajouter `vector-effect="non-scaling-stroke"` sur un grand dessin pour garder la même épaisseur à l'écran), remplissages limités à `var(--crema)`, `var(--papier-blanc)`, `var(--papier-lait)`, un détail `var(--caramel)` au plus. Aucun attribut `style`. Un dessin montre un objet du comptoir ou du métier (tasse, ticket, clé, calendrier, ardoise, carnet, enveloppe), jamais une forme abstraite ni rien qui évoque l'informatique.

## 5. Règles de mise en page

- Deux sections voisines ne s'ouvrent pas pareil : alterner `ouverture`, `ouverture--deux`, `ouverture--lien`, et les fonds (`section--lait`, une `section--bleu` au plus par page).
- Un seul moment centré par page : le bandeau de fin.
- Une boîte se mérite : grouper par l'espace, puis par un fond, puis par un filet. Jamais de carte dans une carte.
- Numéroter seulement une vraie suite (les étapes).
- Aucun style écrit dans la page (`style="…"`), aucun script dans la page. Si un composant manque, le dire plutôt que de l'improviser.
