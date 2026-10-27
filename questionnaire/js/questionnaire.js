// questionnaire.js : étapes, questions conditionnelles, contrôle des réponses, brouillon et bascule de langue
// (lots QST-02, QST-04, QST-05). Source : Phase 1 _ Formulaire/questionnaire/src/, copiée par outils/build_questionnaire.py.
// Sans ce script, la page reste un formulaire complet, contrôlé par le navigateur et envoyé normalement.
import TEXTES from './textes.js';

const racine = document.documentElement;
const form = document.getElementById('formulaire');
const etapes = [...form.querySelectorAll('.etape')];
const resume = document.getElementById('erreurs');
const zoneBrouillon = document.getElementById('brouillon');
const messageBrouillon = document.getElementById('brouillon-message');
const boutonEffacer = document.getElementById('effacer');
const boutonLangue = document.querySelector('.langue-bouton');
const conditionnels = [...form.querySelectorAll('[data-si]')];
const SUJET = form.elements._subject.value;
// Une seule clé : les noms des champs ne changent jamais d'une version à l'autre, un ancien brouillon reste lisible.
const CLE = 'webexpresso-questionnaire';
const DUREE_MAX = 30 * 24 * 3600 * 1000;
const FORMATS = {
  email: /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/,
  url: /^https?:\/\/[^\s/$.?#][^\s]*$/,
  tel: /^\+?[0-9][0-9 .()-]{5,}$/,
  annee: /^(19|20)[0-9]{2}$/,
};

let langue = racine.lang === 'en' ? 'en' : 'fr';
let courante = 0;
let erreursAffichees = [];
let stockage = null;
let minuterie = null;

const t = (id) => (TEXTES[langue] && TEXTES[langue][id]) || TEXTES.fr[id] || '';
const mouvementReduit = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function luhn(chiffres) {
  let somme = 0;
  [...chiffres].reverse().forEach((c, rang) => {
    const n = Number(c) * (rang % 2 ? 2 : 1);
    somme += n > 9 ? n - 9 : n;
  });
  return somme % 10 === 0;
}

// ── Questions conditionnelles ────────────────────────────────────────────────────────────────────────

function conditionRemplie(el) {
  const cible = form.elements[el.dataset.si];
  if (!cible) return true;
  const valeurs = el.dataset.siValeurs ? el.dataset.siValeurs.split(' ') : null;
  if (cible instanceof RadioNodeList) return valeurs ? valeurs.includes(cible.value) : Boolean(cible.value);
  if (cible.type === 'checkbox') return cible.checked;
  return valeurs ? valeurs.includes(cible.value) : Boolean(cible.value);
}

function appliquerConditions() {
  for (const el of conditionnels) {
    const visible = conditionRemplie(el);
    el.hidden = !visible;
    // un champ masqué n'est ni contrôlé ni envoyé ; sa valeur reste dans le brouillon
    for (const c of el.querySelectorAll('input, textarea')) {
      c.disabled = !visible;
      if (c.hasAttribute('data-requis')) c.required = visible;
    }
  }
}

// ── Contrôle des réponses ────────────────────────────────────────────────────────────────────────────

function verifierChamp(c) {
  if (c.type === 'checkbox') return c.required && !c.checked ? 'erreur_case' : null;
  const v = c.value.trim();
  if (!v) return c.required ? 'erreur_requis' : null;
  const type = c.dataset.type;
  if (FORMATS[type] && !FORMATS[type].test(v)) return `erreur_${type}`;
  if (type === 'siret') {
    const chiffres = v.replace(/\s/g, '');
    if (!/^[0-9]{14}$/.test(chiffres) || !luhn(chiffres)) return 'erreur_siret';
  }
  return null;
}

function verifierGroupe(g) {
  const entrees = [...g.querySelectorAll('input')];
  const coches = entrees.filter((x) => x.checked).length;
  if (g.dataset.type === 'choix') return entrees.some((x) => x.required) && !coches ? 'erreur_requis' : null;
  if (g.hasAttribute('data-requis-groupe') && !coches) return 'erreur_cases';
  if (g.dataset.max && coches > Number(g.dataset.max)) return 'erreur_max';
  return null;
}

function valider(etape) {
  const erreurs = [];
  for (const g of etape.querySelectorAll('fieldset.groupe')) {
    if (g.closest('[hidden]')) continue;
    const message = verifierGroupe(g);
    const entrees = [...g.querySelectorAll('input')];
    if (message) erreurs.push({ groupe: g, cible: entrees.find((x) => x.checked) || entrees[0], message });
  }
  for (const c of etape.querySelectorAll('input[data-type], textarea[data-type]')) {
    if (c.disabled || c.closest('[hidden]')) continue;
    const message = verifierChamp(c);
    if (message) erreurs.push({ champ: c, cible: c, message });
  }
  return erreurs.sort((a, b) => (a.cible.compareDocumentPosition(b.cible) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
}

const zoneErreur = (err) => document.getElementById(`${err.groupe ? err.groupe.id : err.champ.id}-erreur`);

function libelle(err) {
  const zone = err.groupe || err.champ.closest('.champ');
  const titre = zone && zone.querySelector('legend [data-t], label [data-t]');
  return titre ? titre.textContent : '';
}

function effacerErreurs() {
  for (const p of form.querySelectorAll('.erreur')) p.textContent = '';
  for (const c of form.querySelectorAll('[aria-invalid]')) c.removeAttribute('aria-invalid');
  resume.querySelector('ul').replaceChildren();
  resume.hidden = true;
  erreursAffichees = [];
}

function montrerErreurs(erreurs, focus = true) {
  effacerErreurs();
  erreursAffichees = erreurs;
  if (!erreurs.length) return;
  const liste = resume.querySelector('ul');
  const separateur = langue === 'fr' ? ' : ' : ': ';
  for (const err of erreurs) {
    const message = t(err.message);
    zoneErreur(err).textContent = message;
    for (const m of err.groupe ? err.groupe.querySelectorAll('input') : [err.champ]) m.setAttribute('aria-invalid', 'true');
    const lien = document.createElement('a');
    lien.href = `#${err.cible.id}`;
    lien.textContent = libelle(err) + separateur + message;
    lien.addEventListener('click', (ev) => {
      ev.preventDefault();
      err.cible.focus();
    });
    const item = document.createElement('li');
    item.append(lien);
    liste.append(item);
  }
  etapes[courante].querySelector('.etape-entete').after(resume);
  resume.hidden = false;
  if (focus) erreurs[0].cible.focus();
}

// Une réponse corrigée retire son erreur, sans relancer l'annonce des autres
function rafraichir(c) {
  const restantes = erreursAffichees.filter((err) => {
    const concerne = err.groupe ? err.groupe.contains(c) : err.champ === c;
    if (!concerne) return true;
    if ((err.groupe ? verifierGroupe(err.groupe) : verifierChamp(err.champ)) === err.message) return true;
    zoneErreur(err).textContent = '';
    for (const m of err.groupe ? err.groupe.querySelectorAll('input') : [err.champ]) m.removeAttribute('aria-invalid');
    const lien = resume.querySelector(`a[href="#${err.cible.id}"]`);
    if (lien) lien.parentElement.remove();
    return false;
  });
  erreursAffichees = restantes;
  if (!restantes.length) resume.hidden = true;
}

// ── Étapes ───────────────────────────────────────────────────────────────────────────────────────────

function afficherEtape(i, { focus = true } = {}) {
  courante = Math.max(0, Math.min(etapes.length - 1, Number(i) || 0));
  etapes.forEach((e, k) => e.classList.toggle('est-active', k === courante));
  for (const a of document.querySelectorAll('.sommaire a')) {
    if (a.getAttribute('href') === `#${etapes[courante].id}`) a.setAttribute('aria-current', 'step');
    else a.removeAttribute('aria-current');
  }
  if (focus) {
    etapes[courante].querySelector('h2').focus({ preventScroll: true });
    etapes[courante].scrollIntoView({ block: 'start', behavior: mouvementReduit() ? 'auto' : 'smooth' });
  }
  sauver();
}

function suivant() {
  const erreurs = valider(etapes[courante]);
  if (erreurs.length) {
    montrerErreurs(erreurs);
    return;
  }
  effacerErreurs();
  afficherEtape(courante + 1);
}

// ── Langue ───────────────────────────────────────────────────────────────────────────────────────────

function appliquerLangue(l) {
  langue = l;
  racine.lang = l;
  document.title = t('titre_page');
  for (const el of document.querySelectorAll('[data-t]')) {
    const texte = t(el.dataset.t);
    if (texte) el.textContent = texte;
  }
  for (const el of document.querySelectorAll('[data-t-etape]')) {
    el.textContent = t('etape_sur').replace('{n}', el.dataset.tEtape).replace('{total}', String(etapes.length));
  }
  if (boutonLangue) boutonLangue.lang = l === 'fr' ? 'en' : 'fr';
  form.elements.langue_formulaire.value = l;
  form.elements._next.value = `${form.dataset.base}${l === 'en' ? 'en/' : ''}merci.html`;
  if (messageBrouillon.dataset.message) messageBrouillon.textContent = t(messageBrouillon.dataset.message);
  if (erreursAffichees.length) montrerErreurs(erreursAffichees, false);
}

// ── Brouillon (navigateur seulement : rien n'est envoyé avant le bouton d'envoi) ─────────────────────

function ouvrirStockage() {
  try {
    const s = window.localStorage;
    s.setItem(`${CLE}:essai`, '1');
    s.removeItem(`${CLE}:essai`);
    return s;
  } catch {
    return null;
  }
}

function valeurs() {
  const out = {};
  for (const c of form.elements) {
    if (!c.name || c.name.startsWith('_') || ['hidden', 'submit', 'button'].includes(c.type)) continue;
    if (c.type === 'radio') {
      if (c.checked) out[c.name] = c.value;
    } else if (c.type === 'checkbox') {
      if (c.checked) out[c.name] = 'oui';
    } else if (c.value) {
      out[c.name] = c.value;
    }
  }
  return out;
}

function sauver() {
  if (!stockage) return;
  clearTimeout(minuterie);
  minuterie = setTimeout(() => {
    const v = valeurs();
    try {
      if (Object.keys(v).length) {
        stockage.setItem(CLE, JSON.stringify({ v: form.dataset.version, t: Date.now(), langue, etape: courante, valeurs: v }));
      } else {
        stockage.removeItem(CLE);
      }
    } catch {
      // stockage plein ou refusé : le brouillon n'est simplement pas gardé
    }
  }, 300);
}

function restaurer() {
  let brouillon = null;
  try {
    brouillon = JSON.parse(stockage.getItem(CLE) || 'null');
  } catch {
    brouillon = null;
  }
  if (!brouillon || typeof brouillon.valeurs !== 'object' || brouillon.valeurs === null) return null;
  if (!(Date.now() - Number(brouillon.t) < DUREE_MAX)) {
    try {
      stockage.removeItem(CLE);
    } catch {
      // rien à effacer
    }
    return null;
  }
  for (const [nom, valeur] of Object.entries(brouillon.valeurs)) {
    const c = form.elements[nom];
    if (!c || nom.startsWith('_')) continue;
    if (c instanceof RadioNodeList) {
      for (const r of c) r.checked = r.value === valeur;
    } else if (c.type === 'checkbox') {
      c.checked = valeur === 'oui';
    } else if (c.type !== 'hidden') {
      c.value = String(valeur);
    }
  }
  return brouillon;
}

function annoncer(id, { effacer = true } = {}) {
  messageBrouillon.dataset.message = id;
  messageBrouillon.textContent = t(id);
  boutonEffacer.hidden = !effacer;
  zoneBrouillon.hidden = false;
}

function effacerBrouillon() {
  if (!window.confirm(t('effacer_confirmer'))) return;
  clearTimeout(minuterie);
  try {
    if (stockage) stockage.removeItem(CLE);
  } catch {
    // rien à effacer
  }
  form.reset();
  appliquerConditions();
  effacerErreurs();
  appliquerLangue(langue);
  afficherEtape(0, { focus: false });
  annoncer('brouillon_efface', { effacer: false });
  etapes[0].querySelector('h2').focus();
}

// ── Démarrage ────────────────────────────────────────────────────────────────────────────────────────

function demarrer() {
  form.noValidate = true; // le script contrôle chaque étape et affiche un résumé ; sans lui, le navigateur contrôle seul
  stockage = ouvrirStockage();
  const brouillon = stockage ? restaurer() : null;
  if (brouillon && (brouillon.langue === 'fr' || brouillon.langue === 'en') && brouillon.langue !== langue) {
    appliquerLangue(brouillon.langue);
  }
  appliquerConditions();
  afficherEtape(brouillon ? brouillon.etape : 0, { focus: false });
  if (brouillon) annoncer('brouillon_repris');
  else if (!stockage) annoncer('brouillon_indispo', { effacer: false });

  form.addEventListener('input', sauver);
  form.addEventListener('change', (ev) => {
    appliquerConditions();
    if (erreursAffichees.length) rafraichir(ev.target);
    sauver();
  });
  form.addEventListener('click', (ev) => {
    const bouton = ev.target.closest('[data-action]');
    if (!bouton) return;
    if (bouton.dataset.action === 'suivant') suivant();
    if (bouton.dataset.action === 'precedent') {
      effacerErreurs();
      afficherEtape(courante - 1);
    }
  });
  // Entrée dans un champ d'une étape intermédiaire passe à l'étape suivante, au lieu d'envoyer tout le questionnaire
  form.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter' || ev.target.tagName !== 'INPUT' || ['checkbox', 'radio'].includes(ev.target.type)) return;
    if (courante < etapes.length - 1) {
      ev.preventDefault();
      suivant();
    }
  });
  form.addEventListener('submit', (ev) => {
    for (let i = 0; i < etapes.length; i += 1) {
      const erreurs = valider(etapes[i]);
      if (erreurs.length) {
        ev.preventDefault();
        if (i !== courante) afficherEtape(i, { focus: false });
        montrerErreurs(erreurs);
        return;
      }
    }
    const nom = form.elements.activite_nom.value.trim();
    form.elements._subject.value = nom ? `${SUJET} : ${nom}` : SUJET;
    // le brouillon n'est pas effacé ici : la page de confirmation s'en charge, un envoi refusé ne perd donc rien
  });
  document.querySelector('.sommaire').addEventListener('click', (ev) => {
    const lien = ev.target.closest('a[href^="#etape-"]');
    if (!lien) return;
    ev.preventDefault();
    const i = etapes.findIndex((e) => `#${e.id}` === lien.getAttribute('href'));
    if (i >= 0) {
      effacerErreurs();
      afficherEtape(i);
    }
  });
  boutonEffacer.addEventListener('click', effacerBrouillon);
  if (boutonLangue) {
    boutonLangue.addEventListener('click', () => {
      appliquerLangue(langue === 'fr' ? 'en' : 'fr');
      sauver();
    });
  }
  racine.classList.add('js-pret');
}

demarrer();
