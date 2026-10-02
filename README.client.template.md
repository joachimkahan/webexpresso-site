# Guide d'Utilisation & Documentation — {{CLIENT_NAME}}

> **Site Web Professionnel** : {{CLIENT_ACTIVITY}} — {{CLIENT_CITY}}  
> **Offre** : {{OFFER_NAME}} (`{{OFFER_SLUG}}`)  
> **Version du Socle** : 2.0.0  

Félicitations pour votre nouveau site web vitrine haut de gamme ! Ce guide vous explique en toute simplicité comment fonctionne votre site et comment le mettre à jour.

---

## 🌟 1. Fonctionnalités de Votre Site

| Fonctionnalité | Inclus dans Votre Offre | Description |
|---|:---:|---|
| **Design Responsive Haut de Gamme** | ✅ Oui | Adapté aux smartphones, tablettes et ordinateurs |
| **Galerie & Portfolio avec Lightbox** | ✅ Oui | Agrandissement plein écran des photos et vidéos |
| **Comparateur Avant / Après (Glow Slider)** | ✅ Oui | Poignée interactive pour comparer les résultats |
| **Onglets "Looks Signature"** | ✅ Oui | Présentation détaillée de vos styles phares |
| **Formulaire de Contact Sécurisé** | ✅ Oui | Réception directe des demandes dans votre boîte email |
| **Tableau de Bord d'Administration (`admin.html`)** | {{ADMIN_STATUS}} | Gestion autonome des photos, looks et tarifs en temps réel |
| **Base de Données Cloud (Firebase Firestore)** | {{FIREBASE_STATUS}} | Synchronisation instantanée de vos modifications en ligne |

---

## 🚀 2. Comment Consulter Votre Site en Local

1. **Aucune installation technique n'est requise** (technologies web natives HTML5, CSS3, JavaScript).
2. Ouvrez le dossier de votre projet sur votre ordinateur.
3. Double-cliquez sur le fichier `index.html` pour l'ouvrir dans votre navigateur web habituel (Google Chrome, Safari, Mozilla Firefox, Microsoft Edge).

---

## 🔐 3. Espace d'Administration (Offre Autonome Uniquement)

Si vous disposez de l'offre **Autonome**, vous pouvez modifier les contenus de votre portfolio et vos tarifs sans toucher au code :

### 3.1. Se Connecter au Tableau de Bord
1. Rendez-vous sur votre site et descendez tout en bas de la page.
2. Cliquez sur le lien discret **"Espace Pro"** dans le pied de page (ou ouvrez directement `admin.html`).
3. Saisissez votre mot de passe administrateur :
   * **Mot de passe initial par défaut** : `{{INITIAL_ADMIN_PASSWORD}}`
   * *(Cliquez sur le bouton **👁️ Afficher** pour vérifier votre saisie).*
4. Cliquez sur **« Se connecter »**.

### 3.2. Modifier Votre Mot de Passe
Pour des raisons de sécurité, nous vous recommandons de personnaliser votre mot de passe dès votre première connexion :
1. Descendez tout en bas du tableau de bord dans la section **« Sécurité & Accès »**.
2. Renseignez votre mot de passe actuel, puis saisissez votre nouveau mot de passe (au moins 6 caractères recommandés, chiffres, lettres et symboles acceptés).
3. Cliquez sur **« Mettre à jour mon mot de passe »**.

### 3.3. Ajouter une Réalisation au Portfolio
1. Dans la section **« Ajouter une réalisation »** :
   * Saisissez un titre.
   * Choisissez le type : **Photo** ou **Vidéo**.
   * Pour une photo : sélectionnez le fichier depuis votre ordinateur (redimensionnement automatique).
   * Pour une vidéo : collez le lien YouTube ou Vimeo.
2. Cliquez sur **« Ajouter au Portfolio »** $\rightarrow$ la réalisation apparaît instantanément sur votre site public !

### 3.4. Gérer les Looks, Transformations et Prestations
* **Looks Signature** : Ajoutez de nouveaux styles avec photo principale, détails et tags de matières.
* **Avant / Après** : Ajoutez des transformations en téléchargeant l'image Avant et l'image Après.
* **Prestations & Tarifs** : Ajoutez ou supprimez vos formules avec leur tarif affiché.

---

## 📧 4. Formulaire de Contact & Réception des Messages

Le formulaire de contact transmet automatiquement les demandes de vos prospects vers votre adresse email :
* **Adresse de réception configurée** : `{{CONTACT_EMAIL}}`
* **Fonctionnement** : Lorsqu'un visiteur remplit le formulaire, un email instantané contenant ses coordonnées (nom, email, téléphone, prestation choisie et message) vous est délivré sans passer par un serveur intermédiaire.

---

## 🌍 5. Opérations Restantes Avant la Mise en Ligne Définitive

Avant d'ouvrir le site à vos clients sur votre propre nom de domaine (ex: `www.votre-domaine.com`) :
1. **Nom de domaine & Hébergement** : Associez les fichiers à votre hébergeur web (Vercel, Netlify, OVH, Hostinger, GitHub Pages, etc.).
2. **Premier Envoi de Test** : Remplissez une fois le formulaire sur le site en ligne pour activer et valider votre adresse de réception.
3. **Vérification Mobile** : Testez le confort visuel sur votre smartphone.

---

## ❓ Assistance & Support

Pour toute question technique, évolution de votre design ou ajout de nouvelles pages, contactez votre prestataire web :
* **Support Technique** : `{{SUPPORT_EMAIL}}`
