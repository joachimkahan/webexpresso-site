// active.js : chargé dans <head>, avant l'affichage (lot QST-02). Si le navigateur sait exécuter le script du questionnaire,
// la page passe en mode « une étape à la fois » (classe js). Si ce script n'a pas démarré au bout de 4 secondes, la page revient
// au formulaire complet, utilisable sans JavaScript.
(function () {
  var racine = document.documentElement;
  if (!('noModule' in HTMLScriptElement.prototype)) return;
  racine.classList.add('js');
  window.setTimeout(function () {
    if (!racine.classList.contains('js-pret')) racine.classList.remove('js');
  }, 4000);
})();
