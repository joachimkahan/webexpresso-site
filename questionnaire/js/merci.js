// merci.js : la confirmation d'envoi efface le brouillon gardé dans le navigateur (lot QST-04).
const CLE = 'webexpresso-questionnaire';
const note = document.getElementById('brouillon-efface');

try {
  if (window.localStorage.getItem(CLE) !== null) {
    window.localStorage.removeItem(CLE);
    note.hidden = false;
  }
} catch {
  // stockage indisponible : il n'y a pas de brouillon à effacer
}
