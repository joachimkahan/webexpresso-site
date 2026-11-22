// merci.js : récapitulatif d'engagement avant paiement, case d'acceptation et nettoyage du brouillon (lot QST-04 + grille nov. 2026).
const CLE = 'webexpresso-questionnaire';
const note = document.getElementById('brouillon-efface');
const recap = document.getElementById('recap-engagement');
const choisie = document.getElementById('recap-engagement-choisie');
const caseAccept = document.getElementById('accept-engagement');
const errAccept = document.getElementById('accept-engagement-erreur');
const btnPaiement = document.getElementById('bouton-paiement');
const estAnglais = document.documentElement.lang === 'en';

const RESUMES = {
  fr: {
    webexpresso: 'Formule retenue : Essentiel — Total minimum à régler : 200 € (paiement unique).',
    moi: 'Formule retenue : Autonome — Total de l\'engagement minimum (3 mois) : 290 € (200 € + 3 × 30 €/mois).',
    accompagnement: 'Formule retenue : Autonome + accompagnement commercial/marketing — Total de l\'engagement minimum (3 mois) : 400 € (250 € + 3 × 50 €/mois).',
    autonome_vie: 'Formule retenue (sur demande) : Autonome avec espace pro à vie — Total : 500 € (paiement unique ; hébergement GitHub Pages et domaine à la charge du client).',
    conseil: 'Formule à confirmer ensemble — Voir les totaux minimum de chaque formule ci-dessous :',
  },
  en: {
    webexpresso: 'Selected plan: Essential — Total minimum due: €200 (one-time payment).',
    moi: 'Selected plan: Autonomous — Minimum 3-month commitment total: €290 (€200 + 3 × €30/month).',
    accompagnement: 'Selected plan: Autonomous + business/marketing support — Minimum 3-month commitment total: €400 (€250 + 3 × €50/month).',
    autonome_vie: 'Selected plan (on request): Autonomous with lifetime pro dashboard — Total: €500 (one-time; GitHub Pages hosting and domain at client\'s expense).',
    conseil: 'Plan to be advised together — Review each plan\'s minimum commitment total below:',
  },
};

try {
  const brut = window.localStorage.getItem(CLE);
  if (brut !== null) {
    try {
      const donnees = JSON.parse(brut);
      const offre = donnees && donnees.valeurs && donnees.valeurs.gestion;
      const textes = RESUMES[estAnglais ? 'en' : 'fr'];
      if (offre && textes[offre] && choisie) {
        choisie.textContent = textes[offre];
      }
      if (offre && recap) {
        for (const li of recap.querySelectorAll('li[data-offre]')) {
          if (li.dataset.offre === offre) li.classList.add('est-retenue');
        }
      }
    } catch {
      // brouillon illisible : affichage par défaut
    }
    window.localStorage.removeItem(CLE);
    if (note) note.hidden = false;
  }
  window.localStorage.removeItem(`${CLE}:depot`); // liste des photos et vidéos envoyées (js/depot.js)
} catch {
  // stockage indisponible : il n'y a pas de brouillon à effacer
}

if (btnPaiement && caseAccept) {
  btnPaiement.addEventListener('click', (ev) => {
    if (!caseAccept.checked) {
      ev.preventDefault();
      if (errAccept) errAccept.hidden = false;
      caseAccept.focus();
    }
  });
  caseAccept.addEventListener('change', () => {
    if (caseAccept.checked && errAccept) errAccept.hidden = true;
  });
}
