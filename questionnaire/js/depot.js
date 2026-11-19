// depot.js : envoi direct des photos et vidéos du questionnaire vers le stockage de WebExpresso (Google Cloud, Paris).
// Source : Phase 1 _ Formulaire/questionnaire/src/, copiée par outils/build_questionnaire.py. Récupération : outils/depot_fichiers.py.
// Chaque fichier part dès qu'il est choisi, par morceaux de 8 Mo : une coupure réseau reprend où elle s'était arrêtée, et un fichier
// interrompu (page fermée) reprend s'il est choisi de nouveau dans les 7 jours. Les règles du stockage n'autorisent que l'ajout :
// ni lecture, ni liste, ni remplacement. La liste reçue, avec le numéro de dossier, part avec le questionnaire (champ caché).
import TEXTES from './textes.js';

const zone = document.querySelector('[data-depot]');
const form = document.getElementById('formulaire');
const CLE = 'webexpresso-questionnaire:depot';
const DUREE_MAX = 30 * 24 * 3600 * 1000;
const MORCEAU = 4 * 1024 * 1024; // multiple de 256 Ko, exigé par le protocole d'envoi reprenable ; ~30 s sur un réseau mobile faible
const SANS_PROGRES = 60000; // un envoi qui n'avance plus depuis une minute est relancé (une lenteur, elle, n'interrompt rien)
const ATTENTES = [1, 2, 4, 8, 15, 30, 30, 30]; // secondes entre deux essais après une coupure
const TYPE_ACCEPTE = /^(image\/[a-z0-9.+-]+|video\/[a-z0-9.+-]+|application\/pdf)$/;
const PAR_EXTENSION = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', heic: 'image/heic',
  heif: 'image/heif', avif: 'image/avif', tif: 'image/tiff', tiff: 'image/tiff', svg: 'image/svg+xml', dng: 'image/x-adobe-dng',
  mp4: 'video/mp4', m4v: 'video/x-m4v', mov: 'video/quicktime', '3gp': 'video/3gpp', webm: 'video/webm', avi: 'video/x-msvideo',
  mkv: 'video/x-matroska', pdf: 'application/pdf',
};

const t = (id) => {
  const l = document.documentElement.lang === 'en' ? 'en' : 'fr';
  return (TEXTES[l] && TEXTES[l][id]) || TEXTES.fr[id] || '';
};

function stockage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function numero() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return [...crypto.getRandomValues(new Uint8Array(24))].map((x) => alphabet[x % 36]).join('');
}

function charger() {
  try {
    const brut = JSON.parse(stockage().getItem(CLE) || 'null');
    if (brut && /^[a-z0-9]{24}$/.test(brut.id) && Array.isArray(brut.fichiers) && Date.now() - Number(brut.t) < DUREE_MAX) {
      for (const f of brut.fichiers) if (f.etat !== 'recu') f.etat = 'interrompu';
      return brut;
    }
  } catch {
    // brouillon illisible ou stockage refusé : on repart d'un dossier neuf
  }
  return { id: numero(), t: Date.now(), fichiers: [] };
}

function taille(octets) {
  const virgule = (x) => (document.documentElement.lang === 'en' ? x : x.replace('.', ','));
  if (octets >= 1e9) return `${virgule((octets / 1e9).toFixed(1))} ${document.documentElement.lang === 'en' ? 'GB' : 'Go'}`;
  if (octets >= 1e6) return `${virgule((octets / 1e6).toFixed(1))} ${document.documentElement.lang === 'en' ? 'MB' : 'Mo'}`;
  return `${Math.max(1, Math.round(octets / 1e3))} ${document.documentElement.lang === 'en' ? 'KB' : 'Ko'}`;
}

function typeDe(fichier) {
  if (TYPE_ACCEPTE.test(fichier.type)) return fichier.type;
  const ext = (fichier.name.split('.').pop() || '').toLowerCase();
  return PAR_EXTENSION[ext] || '';
}

function nomPropre(original, rang) {
  const nom = original.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^[-.]+/, '');
  return `${String(rang).padStart(2, '0')}-${(nom || 'fichier').slice(-100)}`;
}

const attendre = (s) => new Promise((ok) => { setTimeout(ok, s * 1000); });

// Requête unique ; une coupure réseau rejette la promesse, une réponse du serveur (même un refus) la résout.
function requete(methode, url, entetes, corps, progression) {
  return new Promise((ok, ko) => {
    const x = new XMLHttpRequest();
    let veille = 0;
    const surveiller = () => {
      clearTimeout(veille);
      veille = setTimeout(() => x.abort(), SANS_PROGRES);
    };
    x.open(methode, url);
    for (const [k, v] of Object.entries(entetes)) x.setRequestHeader(k, v);
    x.upload.onprogress = (ev) => {
      surveiller();
      if (progression) progression(ev.loaded);
    };
    x.onload = () => {
      clearTimeout(veille);
      ok({ statut: x.status, entete: (k) => x.getResponseHeader(k) });
    };
    x.onerror = () => {
      clearTimeout(veille);
      ko(new Error('reseau'));
    };
    x.onabort = () => ko(new Error('bloque'));
    surveiller();
    x.send(corps);
  });
}

function demarrer() {
  const bucket = zone.dataset.bucket;
  const maxFichiers = Number(zone.dataset.maxFichiers);
  const maxOctets = Number(zone.dataset.maxMo) * 1024 * 1024;
  const api = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o`;
  const choix = zone.querySelector('.depot-choix');
  const liste = zone.querySelector('.depot-liste');
  const etat = zone.querySelector('.depot-etat');
  const cache = zone.querySelector('input[type="hidden"]');
  const avis = document.createElement('p');
  avis.className = 'depot-avis';
  avis.setAttribute('role', 'status');
  avis.hidden = true;
  const envoi = form.querySelector('.envoi');
  if (envoi) envoi.prepend(avis);

  let dossier = charger();
  const fichiersLocaux = new Map(); // clé -> File choisi dans cette visite
  const lignes = new Map(); // clé -> <li>
  const refus = []; // fichiers écartés avant envoi (format, poids, nombre), affichés sans être gardés
  let enCours = false;
  let envoiDemande = false;

  const cleDe = (f) => `${f.name}|${f.size}|${f.lastModified}`;
  const recus = () => dossier.fichiers.filter((f) => f.etat === 'recu');
  const enAttente = () => dossier.fichiers.some((f) => ['attente', 'en_cours', 'nouvel_essai'].includes(f.etat));

  function sauver() {
    try {
      const s = stockage();
      if (!s) return;
      if (dossier.fichiers.length) s.setItem(CLE, JSON.stringify(dossier));
      else s.removeItem(CLE);
    } catch {
      // stockage plein : la reprise après fermeture de la page ne sera simplement pas possible
    }
  }

  function majCache() {
    const ok = recus();
    const ko = dossier.fichiers.filter((f) => f.etat !== 'recu');
    if (!ok.length && !ko.length) {
      cache.value = '';
      return;
    }
    const total = ok.reduce((s, f) => s + f.taille, 0);
    const lignesTexte = [`Dossier n° ${dossier.id} : ${ok.length} fichier(s) reçu(s), ${(total / 1e6).toFixed(1).replace('.', ',')} Mo`];
    for (const f of ok) lignesTexte.push(`- ${f.nom} (${(f.taille / 1e6).toFixed(1).replace('.', ',')} Mo)`);
    if (ko.length) lignesTexte.push(`Non reçus : ${ko.map((f) => f.original).join(', ')}`);
    cache.value = lignesTexte.join('\n');
  }

  function statut(f) {
    if (f.etat === 'en_cours') return `${t('depot_en_cours')} ${Math.floor((100 * (f.envoye || 0)) / f.taille)} %`;
    return t({ recu: 'depot_recu', attente: 'depot_attente', nouvel_essai: 'depot_nouvel_essai', echec: 'depot_echec',
      interrompu: 'depot_interrompu', format: 'depot_format' }[f.etat] || 'depot_attente');
  }

  function ligne(f) {
    let li = lignes.get(f.cle);
    if (!li) {
      li = document.createElement('li');
      li.innerHTML = '<span class="depot-nom"></span> <span class="depot-taille"></span> <span class="depot-statut"></span>'
        + '<progress max="100" value="0"></progress>';
      li.querySelector('.depot-nom').textContent = f.original;
      lignes.set(f.cle, li);
      liste.append(li);
    }
    li.dataset.etat = f.etat;
    li.querySelector('.depot-taille').textContent = taille(f.taille);
    li.querySelector('.depot-statut').textContent = statut(f);
    const barre = li.querySelector('progress');
    barre.hidden = f.etat !== 'en_cours';
    barre.value = Math.floor((100 * (f.envoye || 0)) / f.taille);
    return li;
  }

  function afficher() {
    for (const f of dossier.fichiers) ligne(f);
    for (const r of refus) {
      if (lignes.has(r.cle)) continue;
      const li = document.createElement('li');
      li.dataset.etat = 'refuse';
      li.innerHTML = '<span class="depot-nom"></span> <span class="depot-statut"></span>';
      li.querySelector('.depot-nom').textContent = r.original;
      li.querySelector('.depot-statut').textContent = t(r.message);
      lignes.set(r.cle, li);
      liste.append(li);
    }
    const n = dossier.fichiers.length;
    etat.textContent = n ? t('depot_bilan').replace('{n}', String(recus().length)).replace('{total}', String(n)) : '';
    majCache();
  }

  async function envoyerUn(f) {
    const fichier = fichiersLocaux.get(f.cle);
    let offset = 0;
    let essais = 0;
    f.etat = 'en_cours';
    ligne(f);
    for (;;) {
      try {
        if (!f.url) {
          const r = await requete('POST', `${api}?name=${encodeURIComponent(`depots/${dossier.id}/${f.nom}`)}`, {
            'X-Goog-Upload-Protocol': 'resumable',
            'X-Goog-Upload-Command': 'start',
            'X-Goog-Upload-Header-Content-Length': String(f.taille),
            'X-Goog-Upload-Header-Content-Type': f.type,
            'Content-Type': 'application/json; charset=utf-8',
          }, JSON.stringify({ name: `depots/${dossier.id}/${f.nom}`, contentType: f.type }));
          if (r.statut >= 500) throw new Error('serveur');
          if (r.statut !== 200 || !r.entete('X-Goog-Upload-URL')) {
            f.etat = 'echec';
            return;
          }
          f.url = r.entete('X-Goog-Upload-URL');
          offset = 0;
          sauver();
        } else {
          const q = await requete('POST', f.url, { 'X-Goog-Upload-Command': 'query' }, null);
          if (q.statut >= 500) throw new Error('serveur');
          if (q.statut !== 200) { // session expirée (plus de 7 jours) : on recommence ce fichier
            f.url = '';
            continue;
          }
          if (q.entete('X-Goog-Upload-Status') === 'final') {
            f.etat = 'recu';
            return;
          }
          offset = Number(q.entete('X-Goog-Upload-Size-Received')) || 0;
        }
        while (offset < f.taille) {
          const fin = Math.min(offset + MORCEAU, f.taille);
          const depart = offset;
          const r = await requete('POST', f.url, {
            'X-Goog-Upload-Command': fin === f.taille ? 'upload, finalize' : 'upload',
            'X-Goog-Upload-Offset': String(offset),
          }, fichier.slice(offset, fin), (charge) => {
            f.envoye = depart + charge;
            ligne(f);
          });
          if (r.statut >= 500) throw new Error('serveur');
          if (r.statut !== 200) { // refus des règles (format, poids) : inutile d'insister
            f.etat = r.statut === 403 ? 'format' : 'echec';
            f.url = '';
            return;
          }
          offset = fin;
          f.envoye = fin;
          essais = 0;
          if (r.entete('X-Goog-Upload-Status') === 'final') {
            f.etat = 'recu';
            return;
          }
        }
        f.etat = 'recu';
        return;
      } catch {
        if (essais >= ATTENTES.length) {
          f.etat = 'echec';
          return;
        }
        f.etat = 'nouvel_essai';
        ligne(f);
        await attendre(ATTENTES[essais]);
        essais += 1;
        f.etat = 'en_cours';
        ligne(f);
        // la reprise demande au serveur ce qu'il a reçu : f.url est gardée, la boucle repart par « query »
      }
    }
  }

  async function file() {
    if (enCours) return;
    enCours = true;
    for (;;) {
      const f = dossier.fichiers.find((x) => x.etat === 'attente' && fichiersLocaux.has(x.cle));
      if (!f) break;
      await envoyerUn(f);
      if (f.etat === 'recu') {
        f.url = '';
        f.envoye = f.taille;
      }
      sauver();
      afficher();
    }
    enCours = false;
    if (envoiDemande) {
      envoiDemande = false;
      avis.hidden = true;
      if (dossier.fichiers.some((f) => f.etat !== 'recu')) {
        avis.textContent = t('depot_bloque');
        avis.hidden = false;
      } else {
        form.requestSubmit(form.querySelector('[type="submit"]'));
      }
    }
  }

  function ajouter(fichiers) {
    for (const fichier of fichiers) {
      const cle = cleDe(fichier);
      const connu = dossier.fichiers.find((f) => f.cle === cle);
      if (connu) {
        if (connu.etat === 'recu') {
          refus.push({ cle: `${cle}|deja|${Date.now()}`, original: fichier.name, message: 'depot_deja' });
          continue;
        }
        fichiersLocaux.set(cle, fichier); // fichier interrompu ou en échec, choisi de nouveau : il reprend
        connu.etat = 'attente';
        continue;
      }
      const type = typeDe(fichier);
      const message = !type ? 'depot_format' : fichier.size > maxOctets ? 'depot_trop_lourd'
        : !fichier.size ? 'depot_format' : dossier.fichiers.length >= maxFichiers ? 'depot_trop_nombreux' : '';
      if (message) {
        refus.push({ cle: `${cle}|refus|${Date.now()}`, original: fichier.name, message });
        continue;
      }
      fichiersLocaux.set(cle, fichier);
      dossier.fichiers.push({ cle, original: fichier.name, nom: nomPropre(fichier.name, dossier.fichiers.length + 1),
        taille: fichier.size, type, etat: 'attente', url: '', envoye: 0 });
    }
    dossier.t = Date.now();
    sauver();
    afficher();
    file();
  }

  choix.addEventListener('change', () => {
    ajouter([...choix.files]);
    choix.value = '';
  });

  // Envoi du questionnaire pendant un envoi de fichiers : on attend la fin, puis il part tout seul.
  form.addEventListener('submit', (ev) => {
    majCache();
    if (!enAttente()) return;
    ev.preventDefault();
    envoiDemande = true;
    avis.textContent = t('depot_patienter');
    avis.hidden = false;
  });

  // « Effacer mes réponses » remet le formulaire à zéro : nouveau dossier (les fichiers déjà reçus restent chez nous 30 jours au plus).
  form.addEventListener('reset', () => {
    dossier = { id: numero(), t: Date.now(), fichiers: [] };
    fichiersLocaux.clear();
    lignes.clear();
    refus.length = 0;
    liste.replaceChildren();
    sauver();
    setTimeout(afficher, 0);
  });

  window.addEventListener('beforeunload', (ev) => {
    if (enAttente()) ev.preventDefault();
  });

  // La bascule de langue réécrit les textes de la page : les états des fichiers suivent.
  new MutationObserver(() => {
    for (const f of dossier.fichiers) ligne(f);
    for (const [cle, li] of lignes) {
      const r = refus.find((x) => x.cle === cle);
      if (r) li.querySelector('.depot-statut').textContent = t(r.message);
    }
    afficher();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  afficher();
  zone.classList.add('depot-pret');
}

if (zone && form && window.XMLHttpRequest && window.crypto && crypto.getRandomValues) demarrer();
