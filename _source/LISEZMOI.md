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
| `portraits` | Les deux portraits des fondateurs | Accueil, Qui sommes-nous |
| `bandeau-fin` | Dernière section commune : « On commence ? » | Voir ci-dessous |

`assets/motif-comptoir.svg` n'est pas un morceau : c'est la tuile du papier peint du comptoir (cinq petits dessins, 180 px), employée seulement par `css/site.css` comme masque (voir le motif du comptoir, section 4).

**Chaque page se termine par `{{inclure:bandeau-fin}}`**, sauf les pages légales (`mentions-legales`, `conditions`, `confidentialite`, `accessibilite`) et la page d'erreur (`404`). La page `garanties` le porte, comme les pages de contenu.

### Version anglaise

Les pages de `_source/pages-en/` (accueil, formules, comment-ca-se-passe, qui-sommes-nous, exemples, questions, contact) sont publiées dans `en/`, sous le même nom de fichier que la page française, avec le gabarit `_source/gabarit-en.html`. Un morceau de `_source/morceaux-en/` (`bandeau-fin`, `portraits`, `planche-ardoise`, `planche-carnet`) remplace celui du même nom ; tout morceau absent de ce dossier (les pictos, `planche-grenoble`, `planche-enveloppe`) est pris dans `_source/morceaux/`. Dans une page anglaise, un lien vers une autre page anglaise s'écrit sans préfixe (`formules.html`) ; `{{racine}}` (qui vaut `../`) ne précède que ce qui est commun aux deux langues : `{{racine}}assets/…`, `{{racine}}css/…`, `{{racine}}questionnaire/en/index.html`. Les pages légales et la page Garanties et dépannage (`mentions-legales`, `conditions`, `garanties`, `confidentialite`, `accessibilite`) n'existent qu'en français : le pied de page anglais y renvoie, en le disant (« in French »).
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
| Ticket de caisse | `div.ticket-pose > aside.ticket` ; à l'intérieur `p.ticket__tete`, `p.ticket__sous`, `dl.ticket__lignes > div > dt + span.points + dd`, `p.ticket__inter` (sous-titre), `dl.ticket__lignes.ticket__total` (ligne de total), `p.ticket__pied` (mot manuscrit) ; `ticket--grand` pour un ticket plus lisible ; trois tickets côte à côte : `div.tickets` ; le ticket est réservé à l'accueil (`div.scene`), à Formules (`div.tickets`) et à Qui sommes-nous (`.prix`) |
| Étapes numérotées | `ol.etapes > li.etape` : `div.etape__dessin` (un picto), `h3`, `p`, `span.etiquette` |
| Fiches des trois formules | `div.formules > article.formule` (`formule--choix` pour la recommandée, avec `span.tampon`) : `h3.formule__nom`, `p.formule__pour`, `p.formule__prix` (+ `small`), `p.formule__engagement`, `ul.formule__compris > li` (`li.sans` pour ce qui n'est pas compris), `a.bouton` |
| Frise en trois temps | `div.frise > div.frise__temps` : `p.frise__quand`, `h3`, `p` |
| Tableau | `div.tableau-zone > table.tableau` : `caption`, `thead th`, `tbody th` (intitulé de ligne), cellules `oui` / `non` / `prix`, colonne mise en avant `col-choix` |
| Étape détaillée « vous / nous » | `div.pas` : `div.pas__titre` (`div.etape__dessin` + `h2` avec `span.pas__numero`), `div.pas__roles > div.pas__role` (`h3`, `p` ou `ul`), toujours dans cet ordre : « Ce que vous faites », « Ce que nous faisons », « Ce que ça coûte » ; sur Comment ça se passe, dès 900 px, le troisième rôle passe sous les deux autres, sur toute la largeur, séparé d'eux par un filet en tirets |
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

### Les dessins

Tous les dessins sont des SVG écrits à la main, au trait : `fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"`, épaisseur 2,6 pour une vignette de 64 (ajouter `vector-effect="non-scaling-stroke"` sur un grand dessin pour garder la même épaisseur à l'écran), remplissages limités à `var(--crema)`, `var(--papier-blanc)`, `var(--papier-lait)`, un détail `var(--caramel)` au plus. Aucun attribut `style`. Un dessin montre un objet du comptoir ou du métier (tasse, ticket, clé, calendrier, ardoise, carnet, enveloppe, montagnes de Grenoble), jamais une forme abstraite ni rien qui évoque l'informatique.

Un picto porte sa classe `picto picto--‹nom›` sur le `<svg>` (c'est elle qui le fait bouger au survol, voir la section 6) ; les traits de vapeur de la tasse portent `vapeur`. Un grand dessin pour un haut de page (`planche-…`) ne porte pas de classe `picto`, il ne bouge pas.

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
- **Ticket** : réservé à l'accueil, à Formules et à Qui sommes-nous. Pas de ticket ailleurs.

### Les passages entre sections

Chaque passage a son usage, et un seul par frontière :

| Passage | Quand | Où il sert aujourd'hui |
|---|---|---|
| Dents de ticket (`section--dents`) | Bas d'une section de ton (café au lait) suivie d'une section crème ; **une fois par page au plus**, **jamais sur le bandeau de fin** | Formules, Comment ça se passe |
| Objet à cheval sur deux sections | Un objet (carte, groupe de captures, ticket) déborde sur la section du dessus, dès 900 à 1040 px selon la page | La carte des formules de l'accueil, les sites en ligne de la page Exemples, le ticket de Qui sommes-nous |
| Bord de comptoir (`section--zinc`) | Deux sections consécutives **de même fond** dont le sujet change | Accueil, entre le haut de page et les étapes |
| Bord droit | Partout ailleurs, et **toujours autour d'une section bleue** | Le reste du site |

## 6. Mouvement

**Presque rien ne part seul.** Une seule chose se joue sans geste du visiteur à l'arrivée : le ticket de l'accueil s'imprime (800 ms). Le reste du site répond au visiteur, ou suit son défilement. Aucune animation ne tourne en boucle.

### Ce qui répond à la souris

| Objet | Réponse |
|---|---|
| Fiches des formules (`formule`) | La fiche se soulève de 4 px, son ombre se creuse, le tampon s'incline |
| Tickets (`ticket-pose`) | Le ticket se redresse et se soulève (5 px au plus) |
| Dessins des étapes (`etape`, `pas`) | Le dessin fait son geste : le calendrier s'incline, le ticket monte, la clé tourne de 8°, la vapeur de la tasse monte |
| Tasse du bandeau de fin | Elle fume trois fois quand la souris approche du bouton ou du dessin, ou quand le bouton prend le focus |
| Lignes de la carte de l'accueil (`formule-ligne`) et des tableaux (`tableau`) | La ligne survolée se surligne en crème |
| Captures de la page Exemples (`a.exemple__vue`) | La capture et le téléphone se soulèvent, seulement quand ce sont de vrais liens |
| Menu, liens, boutons | La couleur change, le soulignement du menu se déroule |
| Questions (`question`) | Le titre change de couleur, la pastille se colore en crème |

S'ajoutent deux gestes du visiteur qui ne sont pas des survols : le menu du téléphone qui se déroule, la réponse d'une question qui se déplie.

### Ce qui se trace au défilement

Deux traits, en CSS seul (`animation-timeline: view()`), sans rien sur les navigateurs qui ne le savent pas : la frise « Et si j'arrête ? » de la page Formules (`frise`), et le fil pointillé entre les étapes de l'accueil (`etapes`, dès 1000 px). Sur ordinateur, le tracé se fait pendant que le bloc monte du bas de l'écran vers son milieu (plages `cover 12%` à `cover 42%`, trois tronçons de 10 %) : il est fini quand le bloc est au centre. Des plages `entry` le finiraient tout en bas de l'écran, avant qu'on le regarde. En mouvement réduit, ou sans prise en charge, le trait gris entier et le fil entier sont affichés d'emblée.

### Règles pour tout ajout

- **Propriétés permises** : `translate`, `scale`, `rotate`, `opacity`, `clip-path`. Les couleurs ne changent qu'au survol ou au focus. Jamais `top`, `left`, `width`, `height`, `margin`, `padding`.
- **Déplacements au survol** : dans `@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`. **Couleurs au survol** : dans `@media (hover: hover) and (pointer: fine)` (le survol des liens et des boutons, plus ancien, se contente de `hover: hover`). Tout mouvement qui part sans geste ou suit le défilement : dans `@media (prefers-reduced-motion: no-preference)`, et le bloc de fin de section 16 coupe le reste en mouvement réduit.
- **Durées et courbes** : les jetons, jamais une valeur écrite. `var(--survol)` (200 ms) pour un déplacement, `var(--duree)` (160 ms) pour une couleur, `var(--ease-out)` pour la courbe.
- **Amplitude** : 5 px et 8° au plus.
- **Jamais d'ombre animée directement** : l'ombre profonde est une couche à part (`::after`) dont seule l'opacité change.
- **Rien ne reste figé sur téléphone** : sans souris, aucun état « survolé » ne doit persister ; d'où `hover: hover` et `pointer: fine`. Un état de focus au clavier a toujours son équivalent (`:focus-visible`, `:has(… :focus-visible)`).
- **Un objet qu'on ne fait que lire ne doit pas faire croire qu'il est cliquable** : pas de curseur main, pas de soulignement, pas de couleur de lien. Une fiche ou un ticket peut se soulever ; une capture d'exemple ne bouge que si c'est un lien.
