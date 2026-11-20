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
- aucune promesse de résultat pour l'accompagnement : ne la dire qu'à deux endroits, la page Conditions de vente (détail de la formule) et « Qui sommes-nous » (engagements). Pas dans les fiches de formules, le tableau, les questions ni le questionnaire ;
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

`{{autre}}` donne l'adresse de la même page dans l'autre langue (l'accueil de l'autre langue si elle n'y existe pas). `{{ajouts}}`, dans le gabarit seulement, devient le lien vers `css/ajouts.css` quand une feuille `_source/ajouts-‹nom›.css` existe, et rien sinon.

Morceaux disponibles (`_source/morceaux/`) :

| Morceau | Ce que c'est | Où il sert |
|---|---|---|
| `picto-tasse`, `picto-calendrier`, `picto-ticket`, `picto-cle` | Petits dessins au trait, portant les classes `picto picto--tasse`, `picto picto--calendrier`, `picto picto--ticket`, `picto picto--cle` (la tasse a deux traits de vapeur, `vapeur`) | Étapes de l'accueil et de « Comment ça se passe », groupes de la page Questions, deux dessins de la page Formules ; la tasse sert aussi dans le bandeau de fin |
| `picto-coche` | Petite coche, `picto picto--coche` | Les trois points forts du haut de l'accueil |
| `planche-ardoise` | Grand dessin d'une ardoise de comptoir | Haut de la page Formules et prix |
| `planche-carnet` | Grand dessin d'un carnet | Haut de la page Comment ça se passe |
| `planche-grenoble` | Grand dessin de montagnes et de télécabines (Grenoble) | Haut de la page Qui sommes-nous |
| `planche-enveloppe` | Grand dessin d'une enveloppe, classe `planche-enveloppe` | Haut de la page Nous écrire |
| `portraits` | Le portrait du développeur (Joachim) | Accueil, Qui sommes-nous |
| `bandeau-fin` | Dernière section commune : « On commence ? » | Voir ci-dessous |

`assets/motif-comptoir.svg` n'est pas un morceau : c'est la tuile du papier peint du comptoir (cinq petits dessins, 180 px), employée seulement par `css/site.css` comme masque (voir le motif du comptoir, section 4).

**Chaque page se termine par `{{inclure:bandeau-fin}}`**, sauf les pages légales (`mentions-legales`, `conditions`, `confidentialite`, `accessibilite`) et la page d'erreur (`404`). La page `garanties` le porte, comme les pages de contenu.

### Version anglaise

Les pages de `_source/pages-en/` (accueil, formules, comment-ca-se-passe, qui-sommes-nous, exemples, questions, contact) sont publiées dans `en/`, sous le même nom de fichier que la page française, avec le gabarit `_source/gabarit-en.html`. Un morceau de `_source/morceaux-en/` (`bandeau-fin`, `portraits`, `planche-ardoise`, `planche-carnet`) remplace celui du même nom ; tout morceau absent de ce dossier (les pictos, `planche-grenoble`, `planche-enveloppe`) est pris dans `_source/morceaux/`. Dans une page anglaise, un lien vers une autre page anglaise s'écrit sans préfixe (`formules.html`) ; `{{racine}}` (qui vaut `../`) ne précède que ce qui est commun aux deux langues : `{{racine}}assets/…`, `{{racine}}css/…`, `{{racine}}questionnaire/en/index.html`. Les pages légales et la page Garanties et dépannage (`mentions-legales`, `conditions`, `garanties`, `confidentialite`, `accessibilite`) n'existent qu'en français : le pied de page anglais y renvoie, en le disant (« in French »).

### Référencement (moteurs de recherche)

La construction pose seule, dans chaque page, l'adresse officielle (`canonical`), le lien vers la même page dans l'autre langue (`hreflang`, seulement si elle existe), l'image de partage `assets/partage.png` (1200 × 630) ; sur les deux accueils, la carte d'identité de l'entreprise (données `application/ld+json` : nom, logo `assets/logo-carre.png`, adresse de contact, Grenoble). Elle écrit aussi `sitemap.xml`, la liste des pages à faire connaître. **L'adresse du site n'est écrite qu'à un endroit : `ADRESSE` en tête de `_source/construire.py`** ; le jour où le site a son propre nom de domaine, la changer là et reconstruire. Une page à tenir hors des moteurs de recherche porte `robots: noindex` dans son en-tête (c'est le cas de `404`) : elle sort aussi de `sitemap.xml`.

## 4. Les composants (classes de `css/site.css`)

Page d'accueil construite : `_source/pages/index.html` est le modèle à suivre pour l'écriture HTML.

| Besoin | Classes |
|---|---|
| Largeur de page, largeur de lecture | `cadre`, `cadre cadre--lecture` |
| Section | `section`, `section--serree` (moins haute), `section--lait` (fond café au lait), `section--bleu` (fond bleu, texte crème) |
| Haut d'une page intérieure | `<section class="page-haut"><div class="cadre">` : `h1`, puis `p.accroche`, puis `div.actions` facultatif |
| Haut de page avec un dessin à droite | `<section class="page-haut page-haut--planche"><div class="cadre">` : `div.page-haut__texte` (h1, accroche, actions) puis `figure.page-haut__planche` (`aria-hidden="true"`, un grand dessin SVG inclus par `{{inclure:planche-…}}`) ; la planche ne s'affiche qu'à partir de 900 px ; employé par Formules (`planche-ardoise`), Comment ça se passe (`planche-carnet`), Qui sommes-nous (`planche-grenoble`) ; sur Nous écrire, la même disposition sert à une `section.message.page-haut--planche` (`planche-enveloppe`) |
| Haut de l'accueil (texte et scène) | `section.accueil-haut > div.cadre.accueil-haut__grille`, deux colonnes : le texte (`h1`, `p.accroche`, `div.actions`, `ul.assurances`), puis `div.scene` (`div.scene__fond`, `img.scene__ecran` avec `fetchpriority="high"`, `div.telephone > img`, `div.ticket-pose > aside.ticket`) suivie de `p.scene__legende`, qui nomme les deux sites de démonstration montrés (à changer si on change les captures) ; dès 1000 px les deux colonnes partent du haut, pour que la scène ne saute pas quand les polices arrivent ; à 390 px la scène se recompose et le ticket reste entier |
| Bord de comptoir entre deux sections de même fond | `section--zinc` sur la seconde : un trait caramel et un filet, de la largeur du cadre ; sert une fois, sur `#etapes` de l'accueil |
| Bas de section en dents de ticket | `section--dents`, sur une section de ton suivie d'une section crème ; une fois par page au plus, jamais sur le bandeau de fin ; sert sur `#les-formules` (Formules) et `#questionnaire` (Comment ça se passe) |
| Ligne de découpe et mot manuscrit | `div.pas.pas--decoupe` : le filet du haut devient un pointillé, et `p.pas__mot` (le mot manuscrit, posé sur le pointillé, en première place dans le bloc) ; une seule fois, sur « Comment ça se passe », entre l'étape 2 et l'étape 3 (« ici, vous décidez ») |
| Vidéo de présentation (accueil seulement) | `div.film` dans `#etapes`, sous `ol.etapes` (elle remplace l'ancien `p.suite`) : `div.film__texte` (`h3`, `p`, lien vers Comment ça se passe), puis `figure.film__cadre` (fond café au lait décalé, `data-a-fournir` tant que la vidéo manque) > `div.film__ecran` (16/9) > `video.film__video` (`controls`, `preload="none"`, `playsinline`, `source` `assets/video/presentation.mp4`, EN `presentation-en.mp4`) et `button.film__affiche[data-film][hidden]` : les quatre pictos des étapes sur leur fil pointillé (`span.film__picto`), puis `span.film__jouer` et `span.film__libelle`. `js/site.js` montre l'affiche, retire les commandes et, au clic, lance la lecture ; à la fin, l'affiche revient. Sans script : la vidéo et ses commandes. Styles : `_source/ajouts-film.css`. Sous-titres à ajouter (`track kind="captions"`, fichier `.vtt`) dès que la vidéo existe |
| Carte des formules de l'accueil à cheval sur les étapes | Aucune classe à écrire : les sections `#etapes` et `#formules` de la page `page-accueil` ; dès 1000 px, la carte remonte de 96 px sur la section des étapes (`--pris`) |
| Groupe d'exemples à cheval sur le haut de page | `section.section--lait.section--debord` suivant le `page-haut` de la page `page-exemples`, avec `div.ouverture.ouverture--cote` (en-tête placé en marge, à gauche des deux captures dès 1040 px) ; les sites en ligne remontent de 150 px sur le haut de page |
| Petit ticket « Pourquoi nos prix sont bas » | `div.cadre.deux-colonnes.prix` dans une `section--bleu` : `h2`, `div.ticket-pose > aside.ticket.ticket--grand`, puis `div.prose.prix__texte` ; dès 900 px le ticket passe à gauche et déborde de 64 px au plus sur le bord haut de la section bleue ; page Qui sommes-nous seulement |
| Dessin en marge d'un groupe de questions | `div.questions-groupe__dessin` (`aria-hidden="true"`, un picto inclus) en premier dans `div.questions-groupe`, avant le `h2` ; au-dessus du titre sous 1200 px, dans la marge à gauche dès 1200 px ; page Questions fréquentes |
| Motif du comptoir (papier peint) | Aucune classe à écrire : `css/site.css` le pose lui-même derrière `section.fin` (bandeau de fin) et `.page-erreur .message` (page d'erreur), avec `assets/motif-comptoir.svg` en masque (encre à 7,5 % d'opacité, centre dégagé) ; le texte, le bouton et `p.fin__mot` ne passent jamais sur un dessin |
| Bandeau de fin | `section.section--lait.fin` > `div.cadre.fin__dans` : `div.fin__dessin` (la tasse), `h2`, `p`, `a.bouton`, `p.fin__mot` (mot manuscrit « le temps d'un café ») ; toujours inclus par `{{inclure:bandeau-fin}}`, jamais écrit dans une page |
| En-tête de section | `ouverture` (titre puis phrase), `ouverture ouverture--deux` (titre à gauche, phrase à droite), `ouverture ouverture--lien` (titre à gauche, lien à droite) |
| Texte | `accroche` (phrase d'introduction), `doux` (texte secondaire), `petit`, `mesure` (65 caractères par ligne) |
| Boutons | `bouton` (principal), `bouton bouton--clair` (secondaire), groupés dans `div.actions` ; lien vers une autre page : `lien-suite` |
| Pastilles | `etiquette` (crème dorée), `etiquette etiquette--trait` (contour), `etiquette etiquette--bleu` ; tampon incliné : `tampon` (réservé à « Recommandée ») |
| Ticket de caisse | `div.ticket-pose > aside.ticket` ; à l'intérieur `p.ticket__tete`, `p.ticket__sous`, `dl.ticket__lignes > div > dt + span.points + dd`, `p.ticket__inter` (sous-titre), `dl.ticket__lignes.ticket__total` (ligne de total), `p.ticket__pied` (mot manuscrit) ; `ticket--grand` pour un ticket plus lisible ; trois tickets côte à côte : `div.tickets` ; le ticket est réservé à l'accueil (`div.scene`), à Formules (`div.tickets`), à Qui sommes-nous (`.prix`) et à la scène de l'étape 3 de Comment ça se passe |
| Étapes numérotées | `ol.etapes > li.etape` : `div.etape__dessin` (un picto), `h3`, `p`, `span.etiquette` |
| Fiches des trois formules | `div.formules > article.formule` (`formule--choix` pour la recommandée, avec `span.tampon`) : `h3.formule__nom`, `p.formule__pour`, `p.formule__prix` (+ `small`), `p.formule__engagement`, `ul.formule__compris > li` (`li.sans` pour ce qui n'est pas compris), `a.bouton` |
| Frise en trois temps | `div.frise > div.frise__temps` : `p.frise__quand`, `h3`, `p` |
| Tableau | `div.tableau-zone > table.tableau` : `caption`, `thead th`, `tbody th` (intitulé de ligne), cellules `oui` / `non` / `prix`, colonne mise en avant `col-choix` |
| Étape détaillée « vous / nous » | `div.pas` : `div.pas__titre` (`div.etape__dessin` + `h2` avec `span.pas__numero`), `div.pas__roles > div.pas__role` (`h3`, `p` ou `ul`), toujours dans cet ordre : « Ce que vous faites », « Ce que nous faisons », « Ce que ça coûte » ; sur Comment ça se passe, dès 900 px, le troisième rôle passe sous les deux autres, sur toute la largeur, séparé d'eux par un filet en tirets |
| Scène d'une étape (Comment ça se passe seulement) | `figure.pas__scene.pas__scene--un` (à `--quatre`), entre `div.pas__titre` et `div.pas__roles` : `div.pas__scene-dans` (les objets, posés droits, sur un fond café au lait) puis `figcaption` (dit ce qu'on voit ; « site de démonstration » dès qu'un site est montré). Objets : `div.vue-tel > img` (téléphone), `div.vue-ecran` (`div.vue-ecran__barre > span`, vide ou portant l'adresse, puis `div.vue-ecran__page > img`), `p.pas__scene-mot` (mot manuscrit, `aria-hidden`), `div.ticket-pose`. Étape 1 : le questionnaire (`assets/deroule/questionnaire-telephone.webp`, `-en` pour l'anglais, à refaire si le questionnaire change). Étape 2 : la semaine au calendrier, `{{inclure:semaine-apercu}}` (sept jours, six barrés, l'enveloppe du message), figure `aria-hidden`, sans légende. Étape 3 : seulement le ticket des trois formules (`ticket--grand`, une `ticket__inter` par formule, total « L'aperçu ne vous plaît pas : 0 € »), sans légende ; prix à tenir d'accord avec la fiche des offres. Étape 4 : l'adresse dans la barre, et le téléphone (site de démonstration `verrier`). Styles : `_source/ajouts-deroule-scenes.css` ; dès 900 px la scène est sous le titre, dans la colonne de gauche, et le petit dessin de l'étape garde sa pastille |
| Objet en 3D (Exemples seulement) | `section.section.section--bleu` > `div.cadre.objet3d`, enfants : `div.objet3d__tete` (`h2` et `p.accroche` ; dès 1000 px titre à gauche, accroche à droite alignée sur son bas), `div.objet3d__planche` (planche annotée : la figure `{{inclure:scene-tasse}}` au centre et plus large que sa colonne, `p.objet3d__mot` mot manuscrit Kalam `--crema` près de la vapeur, `aria-hidden`, `ul.objet3d__points > li` avec `h3` + `p` : deux notes sans boîte, la première à gauche à mi-hauteur, la seconde à droite en bas, et `svg.objet3d__traits[aria-hidden]` : deux traits pointillés crème terminés d'un point plein, de chaque note vers le corps de la tasse et vers les pastilles ; les coordonnées des traits sont en pourcentages de la planche, à revoir si on change la taille de la tasse ; HTML dans l'ordre titre, tasse, notes ; sous 1000 px pas de traits, entre 700 et 999 px les deux notes côte à côte sous la tasse, sous 700 px une colonne), `div.objet3d__bande` (filet fin crème sur toute la largeur : `div.objet3d__bande-texte` avec `h3` + `p`, puis `div.objet3d__tirages[aria-hidden]` : `svg.objet3d__fil` (fil pointillé crème, derrière) et trois `figure.tirage` > `div.tirage__photo` (un dessin au trait `{{inclure:dessin-tasse-face}}`, `-cote`, `-dessus`, communs FR/EN) + `figcaption.tirage__mot` « de face / de côté / de dessus » (EN front / side / top) ; les tirages sont de petits papiers `--papier-blanc` penchés de ±1,5 à 2,5°, qui se redressent et montent de 5 px au survol à la souris), puis `div.objet3d__fin` (`p.petit`, `a.lien-suite` vers le questionnaire). Ordre à l'écran : titre, planche, bande, fin (`grid-template-areas`). C'est la seule `section--bleu` de la page : bords droits, aucun bouton plein. Mise en page : `_source/ajouts-objet3d.css`. Scène de la tasse : ligne suivante |
| Tasse en 3D (page Exemples seulement) | `{{inclure:scene-tasse}}` (FR et EN) : `figure.objet3d__scene[data-scene-3d="tasse"]` > `div.objet3d__scene-dans` (`img.objet3d__repli`, image de secours `assets/objets-3d/tasse-repli.webp`, 1200 × 1200), `div.objet3d__teintes` (4 `button.objet3d__teinte[data-teinte]` avec `aria-pressed`, puis `span.objet3d__teinte-active`), `figcaption.objet3d__legende` (étiquette « Démonstration »). `js/site.js` pose un script module `js/tasse-3d/tasse.js` quand la figure approche (400 px), sauf en économie de données, sous 4 Go de mémoire ou avec 2 cœurs au plus ; sans WebGL, l'image reste. three.js r187 est copié dans `js/vendor/three/` (licence MIT). Tasse et soucoupe construites par le code (`js/tasse-3d/formes.js`), matières et vapeur dans `matieres.js`. Les teintes de l'émail sont les jetons `--email-creme`, `--email-faience`, `--email-terre`, `--email-espresso` et `--argile` de `_source/ajouts-objet3d-scene.css` : la scène les lit, ne pas les écrire ailleurs. Refaire l'image de secours : ouvrir `exemples.html?capture-tasse=creme` (ou une autre teinte), lire `figure.tasseCapture` (PNG transparent) et l'enregistrer en WebP (qualité 84) ; outil d'essai `Technique/scratch/tasse-3d-captures/atelier.py` |
| Exemples de sites | `div.exemples` (2 colonnes), `exemples--trois` ; `article.exemple` : `a.exemple__vue` ou `div.exemple__vue` avec `img.exemple__grand` + `span.exemple__petit > img`, puis `div.exemple__texte` (`span.etiquette`, `h3`, `p`, `a.lien-suite` facultatif) |
| Questions et réponses | `div.questions > details.question` : `summary`, `div.question__reponse > p` ; un `id` sur `details` permet un lien direct ; groupes : `div.questions-groupe > h2 + div.questions` |
| Texte long (pages légales, explications) | `div.prose` : `h2`, `h3`, `p`, `ul`, `ol` |
| Encadré | `div.encadre`, `encadre encadre--blanc` (jamais d'encadré dans un encadré) |
| Deux colonnes | `div.deux-colonnes` ; liste à coches : `ul.liste-coches` |
| Grand message (contact, erreur) | `section.message`, grande adresse : `a.adresse-ecrire` |

Images des exemples, dans `assets/exemples/` : `leana`, `joachim` (sites réels), `relieur`, `verrier`, `coutelier`, `torrefacteur` (démonstrations), chacun en `-ordinateur.webp` (1200 × 750) et `-telephone.webp` (390 × 823 ; 780 × 1647 pour `leana` et `joachim`). Toute `<img>` porte `width`, `height` et un `alt` qui décrit ce qu'on voit (`alt=""` pour la vignette téléphone qui redit la grande image).

### Styles en cours de travail

`_source/ajouts-‹nom›.css` : une feuille par chantier, rassemblées par la construction dans `css/ajouts.css` (chargée après `css/site.css`). Elle sert quand plusieurs personnes travaillent en même temps ; un chantier terminé se fusionne dans `css/site.css`, puis son fichier d'ajouts se supprime.

La fusion se fait par `py -3 -B _source/fusionner_ajouts.py` : elle recopie toutes les feuilles d'ajouts à la fin de `css/site.css`, juste avant la section « Impression », puis les supprime. À ne lancer que lorsque plus personne ne travaille dans une feuille d'ajouts ; reconstruire et contrôler ensuite.

Feuille d'ajouts du second lot de mouvement : `_source/ajouts-ambiance2.css` (gestes des étapes, soleil de Grenoble, coches de l'accueil, tampon, trait de craie ; section 6). À fusionner dans `css/site.css` avec les autres, plus tard, par `fusionner_ajouts.py` ; ses règles vont alors à la suite du bloc « Mouvement d'ambiance » de la section 16.

### Les dessins

Tous les dessins sont des SVG écrits à la main, au trait : `fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"`, épaisseur 2,6 pour une vignette de 64 (ajouter `vector-effect="non-scaling-stroke"` sur un grand dessin pour garder la même épaisseur à l'écran), remplissages limités à `var(--crema)`, `var(--papier-blanc)`, `var(--papier-lait)`, un détail `var(--caramel)` au plus. Aucun attribut `style`. Un dessin montre un objet du comptoir ou du métier (tasse, ticket, clé, calendrier, ardoise, carnet, enveloppe, montagnes de Grenoble), jamais une forme abstraite ni rien qui évoque l'informatique.

Un picto porte sa classe `picto picto--‹nom›` sur le `<svg>` (c'est elle qui le fait bouger au survol, voir la section 6) ; les traits de vapeur de la tasse portent `vapeur` (ils montent seuls, voir la section 6). Un grand dessin pour un haut de page (`planche-…`) ne porte pas de classe `picto` ; s'il bouge seul (grenoble, carnet, enveloppe), son `<svg>` porte `planche-anime`.

## 5. Règles de mise en page

- Deux sections voisines ne s'ouvrent pas pareil : alterner `ouverture`, `ouverture--deux`, `ouverture--lien`, et les fonds (`section--lait`, une `section--bleu` au plus par page).
- Un seul moment centré par page : le bandeau de fin.
- Une boîte se mérite : grouper par l'espace, puis par un fond, puis par un filet. Jamais de carte dans une carte.
- Numéroter seulement une vraie suite (les étapes).
- Aucun style écrit dans la page (`style="…"`), aucun script dans la page. Si un composant manque, le dire plutôt que de l'improviser.

### Le système de décor

Le décor est rare et toujours au même endroit. Ne pas en ajouter ailleurs.

- **Dessin au trait en haut de page** : seulement sur Formules (ardoise), Comment ça se passe (carnet), Qui sommes-nous (montagnes) et Contact (enveloppe). Les autres pages (Exemples, Questions, Garanties, pages légales) ont un haut de page sans dessin. Un seul grand dessin par page.
- **Motif du comptoir** : seulement autour du bandeau de fin et sur la page d'erreur. Jamais sous un texte : le centre est dégagé, et le texte, le bouton et le mot manuscrit ne passent pas sur un dessin. Ne pas le poser sur une autre section.
- **Une section bleue au plus par page** (`section--bleu`). Autour d'elle, les bords sont droits : ni dents, ni bord de comptoir (seul le ticket de Qui sommes-nous déborde sur son bord haut).
- **Ticket** : réservé à l'accueil, à Formules, à Qui sommes-nous et à l'étape 3 de Comment ça se passe. Pas de ticket ailleurs.

### Les passages entre sections

Chaque passage a son usage, et un seul par frontière :

| Passage | Quand | Où il sert aujourd'hui |
|---|---|---|
| Dents de ticket (`section--dents`) | Bas d'une section de ton (café au lait) suivie d'une section crème ; **une fois par page au plus**, **jamais sur le bandeau de fin** | Formules, Comment ça se passe |
| Objet à cheval sur deux sections | Un objet (carte, groupe de captures, ticket) déborde sur la section du dessus, dès 900 à 1040 px selon la page | La carte des formules de l'accueil, les sites en ligne de la page Exemples, le ticket de Qui sommes-nous |
| Bord de comptoir (`section--zinc`) | Deux sections consécutives **de même fond** dont le sujet change | Accueil, entre le haut de page et les étapes |
| Bord droit | Partout ailleurs, et **toujours autour d'une section bleue** | Le reste du site |

## 6. Mouvement

**Ce qui part seul est une liste fermée** (mouvement d'ambiance, ci-dessous) ; avec le ticket de l'accueil (800 ms, une fois à l'arrivée), c'est tout. Le reste du site répond au visiteur ou suit son défilement.

### Ce qui bouge seul (mouvement d'ambiance)

Liste fermée. N'en ajouter aucune sans l'accord de l'opérateur : il veut du mouvement, pas du mouvement partout.

| Dessin | Ce qui bouge | Durée et amplitude |
|---|---|---|
| Tasses (`picto--tasse` : bandeau de fin de toutes les pages, étapes de l'accueil et de Comment ça se passe, marge de Questions) | Les deux traits `vapeur` montent en s'effaçant, puis reviennent en se redessinant ; décalés l'un de l'autre | 4,4 s et 3,8 s ; 5 px à l'écran au plus (`--montee`, en unités du dessin : 4,2 dans le bandeau de 76 px, 2,2 dans les dessins de 140 px, 3 sinon) |
| Dessin de Grenoble (`planche-grenoble`, Qui sommes-nous) | Les neuf bulles (`bulle`, deux trains de cinq et de quatre) montent le long du câble, de la gare basse à la gare haute, sans jamais redescendre ; elles sortent du mur de la gare basse et entrent dans celui de la gare haute (`clipPath` du dessin) ; les deux traits d'eau du bas (`eau`) glissent en sens contraire | 34 s pour un trajet (8 px/s environ, vitesse constante) ; eau : 6 unités, 10 s, aller-retour |
| Carnet (`planche-carnet`, Comment ça se passe) | Les trois coches (`coche--1` à `3`) s'effacent ensemble, puis se retracent l'une après l'autre, de gauche à droite | Boucle de 12 s ; au départ et à l'arrivée les trois sont cochées |
| Enveloppe (`planche-enveloppe`, Nous écrire) | La feuille (`feuille`) sort de 5 unités et rentre | 7 s, aller-retour |
| Tasse en 3D (`objet3d__scene`, page Exemples ; ajoutée à la demande de l'opérateur, 20/11/2026) | Deux voiles de vapeur montent lentement du café ; un demi-tour unique, au premier passage, invite à tourner la tasse | Vapeur continue, lente, apparition en 1,8 s ; demi-tour en 1,9 s, une seule fois. La boucle s'arrête hors de l'écran et à l'onglet caché ; la vapeur se fige avec `html.ambiance-coupee` (le bouton du pied de page apparaît dès qu'une page a une `[data-scene-3d]`) ; en mouvement réduit, ni vapeur, ni demi-tour, ni élan, et les teintes changent d'un coup |

L'ardoise (`planche-ardoise`) ne bouge pas : seul un trait de craie s'y trace une fois (second lot, ci-dessous). Rien de naturel à lui faire faire de plus sans faire bouger du texte.

**Règles de ce mouvement**

- **Lent et doux** : propriétés `translate`, `opacity`, `clip-path` seulement ; pas de rebond, pas de clignotement. Courbe `linear` pour le câble (vitesse constante), `ease-in-out` pour les allers-retours.
- **Sous `@media (prefers-reduced-motion: no-preference)`** : en mouvement réduit, rien ne bouge, les dessins sont complets et les bulles sont à leur place d'origine (les positions de départ sont écrites en CSS, hors de la media query : `.bulle:nth-child(n)`).
- **En pause hors de l'écran** : `js/site.js` pose la classe `en-vue` sur les dessins `.planche-anime` et `.picto--tasse` quand ils sont visibles ; elle fixe `--lecture: running`. Sans elle, `animation-play-state: paused`. Sans JavaScript, les dessins restent complets et immobiles.
- **Bouton d'arrêt** (WCAG 2.2.2) : dans le pied de page des deux gabarits, `<button class="pied__ambiance" data-ambiance hidden>` (« Arrêter les animations » / « Relancer les animations » ; EN « Stop animations » / « Restart animations », textes dans `data-arreter` et `data-relancer`), `aria-pressed`, hauteur 44 px. Le script retire `hidden` seulement si la page a du mouvement d'ambiance et hors mouvement réduit ; un clic pose `html.ambiance-coupee` (toutes les animations d'ambiance sont coupées, les dessins restent complets) et garde le choix dans `localStorage` (clé `wx-animations-arretees`, lecture et écriture dans un `try/catch`) ; le choix s'applique dès le chargement.
- **Survol** : la fumée ne se rejoue plus au survol, elle s'étire de 30 % depuis sa base (`scale`, propriété à part de l'animation : aucun conflit) quand la souris est sur son étape, ou sur le bouton ou la tasse du bandeau de fin, ou au focus du bouton.
- **Impression** : rien n'est animé.
- Pour ajouter un mouvement d'ambiance : le mettre dans cette liste, l'écrire dans le bloc « Mouvement d'ambiance » de la section 16 de `css/site.css` (avec `animation-play-state: var(--lecture, paused)` et la coupure `html.ambiance-coupee`), et donner la classe `planche-anime` (ou `picto--tasse`) au dessin pour que la pause hors écran le concerne.

### Second lot (feuille `_source/ajouts-ambiance2.css`)

Six idées, même mécanisme (`en-vue`, `--lecture`, `ambiance-coupee`, bouton du pied de page, mouvement réduit = état final). Trois boucles et trois mouvements joués une fois.

| Mouvement | Classes et dessins | Durée et amplitude |
|---|---|---|
| **Gestes des étapes, à tour de rôle** (boucle) | `g.geste`, dans `picto-cle`, `picto-calendrier`, `picto-ticket` ; seulement quand le picto est dans une `.etape` (accueil) ou un `.pas` (Comment ça se passe, Formules) | Cycle commun de 16 s : la clé se balance de ±4° sur son anneau (1 s à 3,1 s, deux oscillations), le calendrier s'incline de 4° (6,5 s à 8,5 s), le ticket sort de 3 unités du dessin (2,2 dans les dessins de 140 px, soit 4,8 px) et rentre (11 s à 13 s). La tasse garde sa fumée |
| **Soleil de Grenoble** (boucle) | `circle.soleil` dans `planche-grenoble` | Dérive en arc de 10 unités (4 de haut), 50 s, aller-retour, presque imperceptible |
| **Coches des assurances** (une fois, au chargement) | `ul.assurances` (`picto-coche`) | 350 ms chacune, 300 ms, 450 ms et 600 ms après le chargement, de gauche à droite (`clip-path`) |
| **Tampon « Recommandée »** (une fois) | `.tampon` partout (fiche, ligne de la carte de l'accueil, en-tête du tableau) | `scale` 1,25 et `opacity` 0 vers l'état normal, 220 ms, `--ease-out`, sans rebond ; part quand le tampon est entré à 18 % au-dessus du bas de l'écran |
| **Trait de craie de l'ardoise** (une fois) | `path.craie` dans `planche-ardoise` (FR et EN), sous la mention « à partir de » / « from » ; trait de craie de l'ardoise : `--papier`, 1,5, opacité 0,6 | 600 ms, de gauche à droite (`clip-path`), quand l'ardoise est à l'écran |

Règles propres à ce lot :

- **Un seul dessin d'étape bouge à la fois.** Les trois gestes se partagent un cycle de 16 s, chacun dans sa fenêtre de 2 s et immobile le reste du temps. Pour que le cycle reste commun, `js/site.js` joue ou arrête tous les dessins d'étape ensemble (il pose `en-vue` sur tous dès que l'un d'eux est à l'écran). Pour ajouter un geste, lui donner une fenêtre libre dans les 16 s, jamais chevaucher une autre.
- Le geste est posé sur un groupe intérieur (`g.geste`), jamais sur le `<svg>` : les gestes du survol (`rotate`, `translate` du `<svg>`) n'entrent donc pas en conflit.
- Les mouvements joués une fois ne cachent rien sans script : leur état de départ ne s'applique que sous `html.anime-pret`, classe que `js/site.js` pose seulement quand il peut les déclencher (pas en mouvement réduit). Une fois `en-vue` posé sur un tampon, il n'est plus retiré (une seule fois). Les coches, elles, n'ont besoin d'aucun script.
- Le bouton d'arrêt coupe les boucles ; ce qui ne joue qu'une fois s'affiche alors entier.
- Pas fait : le défilement de la capture dans le téléphone de l'accueil. Les captures de `assets/exemples/` sont des écrans d'une seule hauteur (390 × 823) : il n'y a rien en dessous à faire défiler, et le cadre n'en rogne que 2 %. Il faudrait une capture de page entière.

### Ce qui répond à la souris

| Objet | Réponse |
|---|---|
| Fiches des formules (`formule`) | La fiche se soulève de 4 px, son ombre se creuse, le tampon s'incline |
| Tickets (`ticket-pose`) | Le ticket se redresse et se soulève (5 px au plus) |
| Dessins des étapes (`etape`, `pas`) | Le dessin fait son geste : le calendrier s'incline, le ticket monte, la clé tourne de 8°, la fumée de la tasse s'étire |
| Tasse du bandeau de fin | Sa fumée s'étire quand la souris approche du bouton ou du dessin, ou quand le bouton prend le focus |
| Lignes de la carte de l'accueil (`formule-ligne`) et des tableaux (`tableau`) | La ligne survolée se surligne en crème |
| Captures de la page Exemples (`a.exemple__vue`) | La capture et le téléphone se soulèvent, seulement quand ce sont de vrais liens |
| Menu, liens, boutons | La couleur change, le soulignement du menu se déroule |
| Questions (`question`) | Le titre change de couleur, la pastille se colore en crème |

S'ajoutent deux gestes du visiteur qui ne sont pas des survols : le menu du téléphone qui se déroule, la réponse d'une question qui se déplie.

### Ce qui se trace au défilement

Sur Comment ça se passe, les jours du calendrier de l'étape 2 se barrent de la même façon, l'un après l'autre (`.croix--1` à `6`, `clip-path`, plages `cover 16%` à `cover 45%`) ; tous barrés et immobiles en mouvement réduit ou sans prise en charge.

Deux traits, en CSS seul (`animation-timeline: view()`), sans rien sur les navigateurs qui ne le savent pas : la frise « Et si j'arrête ? » de la page Formules (`frise`), et le fil pointillé entre les étapes de l'accueil (`etapes`, dès 1000 px). Sur ordinateur, le tracé se fait pendant que le bloc monte du bas de l'écran vers son milieu (plages `cover 12%` à `cover 42%`, trois tronçons de 10 %) : il est fini quand le bloc est au centre. Des plages `entry` le finiraient tout en bas de l'écran, avant qu'on le regarde. En mouvement réduit, ou sans prise en charge, le trait gris entier et le fil entier sont affichés d'emblée.

### Règles pour tout ajout

- **Propriétés permises** : `translate`, `scale`, `rotate`, `opacity`, `clip-path`. Les couleurs ne changent qu'au survol ou au focus. Jamais `top`, `left`, `width`, `height`, `margin`, `padding`.
- **Déplacements au survol** : dans `@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`. **Couleurs au survol** : dans `@media (hover: hover) and (pointer: fine)` (le survol des liens et des boutons, plus ancien, se contente de `hover: hover`). Tout mouvement qui part sans geste ou suit le défilement : dans `@media (prefers-reduced-motion: no-preference)`, et le bloc de fin de section 16 coupe le reste en mouvement réduit.
- **Durées et courbes** : les jetons, jamais une valeur écrite. `var(--survol)` (200 ms) pour un déplacement, `var(--duree)` (160 ms) pour une couleur, `var(--ease-out)` pour la courbe.
- **Amplitude** : 5 px et 8° au plus.
- **Jamais d'ombre animée directement** : l'ombre profonde est une couche à part (`::after`) dont seule l'opacité change.
- **Rien ne reste figé sur téléphone** : sans souris, aucun état « survolé » ne doit persister ; d'où `hover: hover` et `pointer: fine`. Un état de focus au clavier a toujours son équivalent (`:focus-visible`, `:has(… :focus-visible)`).
- **Un objet qu'on ne fait que lire ne doit pas faire croire qu'il est cliquable** : pas de curseur main, pas de soulignement, pas de couleur de lien. Une fiche ou un ticket peut se soulever ; une capture d'exemple ne bouge que si c'est un lien.
