// tasse.js : la tasse en 3D de la page Exemples (module chargé par js/site.js quand la scène approche de l'écran).
// L'image de secours reste visible tant que la première image 3D n'est pas rendue, et pour toujours si la 3D ne peut pas démarrer.
import * as THREE from '../vendor/three/three.module.js';
import { RoomEnvironment } from '../vendor/three/addons/environments/RoomEnvironment.js';
import { construireFormes } from './formes.js';
import { couleur, jeton, materiauxCeramique, materiauCafe, materiauOmbre, materiauVapeur } from './matieres.js';

const ANGLE_REPOS = -0.32;                 // l'anse à droite, un peu tournée vers le visiteur
const ELEVATION = 0.44;                    // la caméra regarde la tasse d'un peu au-dessus (25°)
const INCLINAISON = 0.349;                 // ± 20° d'inclinaison au glisser vertical
const DISTANCE = 4.75;
const VISEE = new THREE.Vector3(0, 0.5, 0);
const PAS_CLAVIER = Math.PI / 6;
const TEXTES = {
    fr: ['anse à droite', 'anse tournée vers vous', 'anse à gauche', 'anse derrière la tasse'],
    en: ['handle on the right', 'handle towards you', 'handle on the left', 'handle behind the cup'],
};

const adoucir = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);   // entrée et sortie douces
const sortir = (t) => 1 - Math.pow(1 - t, 3);

function webglPossible() {
    try {
        const c = document.createElement('canvas');
        return !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
    } catch (e) {
        return false;
    }
}

export function demarrer(figure, options) {
    const capture = !!(options && options.capture);
    const zone = figure.querySelector('.objet3d__scene-dans');
    if (!zone || figure.dataset.scene3dLance || !webglPossible()) return null;
    figure.dataset.scene3dLance = '1';

    const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduit = mouvementReduit.matches && !capture;
    const auDoigt = window.matchMedia('(pointer: coarse)').matches;
    const anglais = (document.documentElement.lang || '').toLowerCase().startsWith('en');

    /* ── Rendu ── */
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: capture });
    } catch (e) {
        delete figure.dataset.scene3dLance;
        return null;
    }
    renderer.setClearAlpha(0);
    renderer.toneMapping = THREE.NeutralToneMapping;   // tons de « photo produit » : les teintes de l'émail restent justes
    renderer.toneMappingExposure = 0.95;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.autoUpdate = false;   // l'ombre ne se recalcule que si la tasse a bougé (pas pour la vapeur seule)
    renderer.setPixelRatio(capture ? 1 : Math.min(window.devicePixelRatio || 1, auDoigt ? 1.5 : 2));
    const canevas = renderer.domElement;
    canevas.className = 'objet3d__canvas';
    canevas.setAttribute('aria-hidden', 'true');
    zone.appendChild(canevas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(24, 1, 0.5, 20);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const piece = new RoomEnvironment();
    // Le studio : deux boîtes à lumière ajoutées à la pièce, qui dessinent sur l'émail les reflets nets d'une photo produit.
    // Murs de la pièce assombris : l'émail ne reflète plus un gris laiteux, seulement les boîtes à lumière.
    piece.traverse((o) => { if (o.isMesh && o.material.side === THREE.BackSide) o.material.color.setScalar(0.32); });
    const studio = new THREE.Group();
    studio.position.y = 3.5;                  // la pièce est descendue de 3,5 : on remet le studio à hauteur de la tasse
    piece.add(studio);
    // La caméra regarde d'en haut : les parois verticales reflètent ce qui est un peu plus bas qu'elles.
    [[4.5, 7, 7, -6, -1.6, 4.4], [1.2, 7, 5, 6.4, -1, -2.2], [5, 1.6, 2.2, 0, 6.5, -5.5]].forEach(([l, h, force, x, y, z]) => {
        const boite = new THREE.Mesh(new THREE.PlaneGeometry(l, h), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
        boite.material.color.setScalar(force);
        boite.position.set(x, y, z);
        boite.lookAt(0, 0.5, 0);
        studio.add(boite);
    });
    const environnement = pmrem.fromScene(piece, 0.035).texture;
    piece.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    pmrem.dispose();
    scene.environment = environnement;
    scene.environmentIntensity = 0.75;

    /* ── Objets ── */
    const f = construireFormes();
    const ceramique = materiauxCeramique(figure);
    const cafe = materiauCafe(figure);
    const ombre = materiauOmbre(figure);

    const pivot = new THREE.Group();          // tourne au geste du visiteur
    const tasse = new THREE.Group();          // se soulève un instant au changement de teinte
    scene.add(pivot);
    pivot.add(tasse);
    tasse.position.y = f.posePlateau;

    const maillage = (g, m, parent, ombres) => {
        const o = new THREE.Mesh(g, m);
        o.castShadow = ombres.porte;
        o.receiveShadow = ombres.recoit;
        parent.add(o);
        return o;
    };
    maillage(f.piedTasse, ceramique.terre, tasse, { porte: true, recoit: false });
    maillage(f.corpsTasse, ceramique.email, tasse, { porte: true, recoit: true });
    maillage(f.anse, ceramique.email, tasse, { porte: true, recoit: true });
    maillage(f.cafe, cafe, tasse, { porte: false, recoit: true });
    maillage(f.piedSoucoupe, ceramique.terre, pivot, { porte: false, recoit: false });
    maillage(f.corpsSoucoupe, ceramique.email, pivot, { porte: true, recoit: true });

    // Le sol invisible : une ombre de contact douce, couleur de la nuit du thème.
    const sol = new THREE.Group();
    scene.add(sol);
    const contact = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9), ombre);
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = 0.001;
    sol.add(contact);
    // l'ombre s'allonge un peu à l'opposé de la lumière principale (vers l'arrière, à droite)
    contact.scale.set(1, 1.08, 1);
    contact.rotation.z = 0.75;
    contact.position.set(0.04, 0.001, -0.04);
    // Sous la tasse, sur la soucoupe : un peu d'ombre là où le pied se pose.
    const dessous = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 0.78), ombre.clone());
    dessous.material.opacity = 0.7;
    dessous.rotation.x = -Math.PI / 2;
    dessous.position.y = f.posePlateau + 0.0015;
    pivot.add(dessous);

    // La vapeur : deux voiles qui montent du café, toujours de face.
    const vapeurs = [[0.42, 0.24, -0.04], [3.7, 0.17, 0.05]].map(([graine, opacite, dx]) => {
        const m = materiauVapeur(figure, graine, opacite);
        const v = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 1.05), m);
        v.position.set(dx, f.posePlateau + f.niveauCafe + 0.5, 0.02);
        v.renderOrder = 2;
        v.userData.opacite = opacite;
        scene.add(v);
        return v;
    });

    /* ── Lumières ── */
    const principale = new THREE.DirectionalLight(couleur(jeton(figure, '--papier-blanc')), 3.1);
    principale.position.set(-3.2, 2.7, 2.5);
    principale.target.position.set(0, 0.3, 0);
    principale.castShadow = true;
    principale.shadow.mapSize.set(1024, 1024);
    const oc = principale.shadow.camera;
    oc.left = -1.5; oc.right = 1.5; oc.top = 1.5; oc.bottom = -1.5; oc.near = 1; oc.far = 9;
    principale.shadow.bias = -0.0004;
    principale.shadow.normalBias = 0.012;
    principale.shadow.radius = 5;
    scene.add(principale, principale.target);
    // Contre-jour froid : il dessine le bord de la tasse sur le fond bleu, même en émail sombre.
    const contre = new THREE.DirectionalLight(couleur(jeton(figure, '--bleu-clair')), 1.5);
    contre.position.set(1.6, 2.4, -3.2);
    scene.add(contre);

    /* ── Teintes ── */
    const teintes = {};
    figure.querySelectorAll('[data-teinte]').forEach((b) => {
        teintes[b.dataset.teinte] = couleur(jeton(figure, '--email-' + b.dataset.teinte));
    });
    const affichee = figure.querySelector('.objet3d__teinte-active');

    /* ── État ── */
    const etat = {
        angle: ANGLE_REPOS,
        vitesse: 0,
        elevation: ELEVATION,
        paraX: 0, paraY: 0, paraXc: 0, paraYc: 0,
        saisie: null,
        tween: null,          // rotation programmée (invitation, clavier)
        teinte: null,         // passage d'une teinte à l'autre
        saut: null,           // petit geste de la tasse
        temps: 7.3,           // horloge de la vapeur (avance seulement quand elle est montrée)
        voile: 0,             // la vapeur apparaît en douceur après la première image (l'image de secours n'en a pas)
    };
    let visible = capture, ongletVisible = !document.hidden, boucle = false, dernier = 0, invitee = capture || reduit;
    let ambianceCoupee = document.documentElement.classList.contains('ambiance-coupee');
    let fini = false, aAnnoncer = false;

    const vapeurAnimee = () => !reduit && !ambianceCoupee && !capture;

    function placerCamera() {
        const el = THREE.MathUtils.clamp(etat.elevation + etat.paraY, ELEVATION - INCLINAISON, ELEVATION + INCLINAISON);
        camera.position.set(0, VISEE.y + Math.sin(el) * DISTANCE, Math.cos(el) * DISTANCE);
        camera.lookAt(VISEE);
        vapeurs.forEach((v) => { v.rotation.x = -el * 0.35; });
    }

    const derniereOmbre = [NaN, NaN, NaN];
    function rendre() {
        pivot.rotation.y = etat.angle + etat.paraX;
        if (derniereOmbre[0] !== pivot.rotation.y || derniereOmbre[1] !== tasse.position.y || derniereOmbre[2] !== tasse.rotation.y) {
            derniereOmbre[0] = pivot.rotation.y;
            derniereOmbre[1] = tasse.position.y;
            derniereOmbre[2] = tasse.rotation.y;
            renderer.shadowMap.needsUpdate = true;
        }
        placerCamera();
        vapeurs.forEach((v) => {
            v.visible = !reduit && !capture && etat.voile > 0;
            v.material.uniforms.uTemps.value = etat.temps;
            v.material.uniforms.uOpacite.value = v.userData.opacite * etat.voile;
        });
        renderer.render(scene, camera);
    }

    function enMouvement() {
        return !!(etat.saisie || etat.tween || etat.teinte || etat.saut || Math.abs(etat.vitesse) > 0.004
            || Math.abs(etat.elevation - ELEVATION) > 0.0008
            || Math.abs(etat.paraX - etat.paraXc) > 0.0005 || Math.abs(etat.paraY - etat.paraYc) > 0.0005
            || vapeurAnimee());
    }

    function image(maintenant) {
        const dt = Math.min(0.05, (maintenant - dernier) / 1000 || 0.016);
        dernier = maintenant;

        if (etat.tween) {
            const t = Math.min(1, (maintenant - etat.tween.debut) / etat.tween.duree);
            etat.angle = etat.tween.de + (etat.tween.vers - etat.tween.de) * etat.tween.courbe(t);
            if (t >= 1) etat.tween = null;
        } else if (!etat.saisie && Math.abs(etat.vitesse) > 0.004) {
            etat.angle += etat.vitesse * dt;
            etat.vitesse *= Math.exp(-dt * 3.4);          // l'élan s'éteint en une seconde environ
        }
        if (!etat.saisie && !reduit) etat.elevation += (ELEVATION - etat.elevation) * (1 - Math.exp(-dt * 3));
        const suivi = 1 - Math.exp(-dt * 5);
        etat.paraX += (etat.paraXc - etat.paraX) * suivi;
        etat.paraY += (etat.paraYc - etat.paraY) * suivi;

        if (etat.teinte) {
            const t = Math.min(1, (maintenant - etat.teinte.debut) / 400);
            ceramique.email.color.copy(etat.teinte.de).lerp(etat.teinte.vers, adoucir(t));
            if (t >= 1) etat.teinte = null;
        }
        if (etat.saut) {
            const t = Math.min(1, (maintenant - etat.saut.debut) / 460);
            tasse.position.y = f.posePlateau + Math.sin(Math.PI * sortir(t)) * 0.045;
            tasse.rotation.y = etat.saut.de + 0.42 * sortir(t);
            if (t >= 1) { etat.saut = null; tasse.position.y = f.posePlateau; }
        }
        if (vapeurAnimee()) {
            etat.temps += dt;
            etat.voile = Math.min(1, etat.voile + dt / 1.8);
        }

        rendre();
        // La position annoncée aux lecteurs d'écran change quand la tasse s'est posée, pas à chaque image.
        if (aAnnoncer && !etat.saisie && !etat.tween && !etat.saut && Math.abs(etat.vitesse) <= 0.004) {
            aAnnoncer = false;
            majValeur();
        }
        if (!enMouvement()) arreterBoucle();
    }

    function reveiller() {
        aAnnoncer = true;
        if (fini || boucle || !visible || !ongletVisible) return;
        boucle = true;
        dernier = performance.now();
        renderer.setAnimationLoop(image);
    }
    function arreterBoucle() {
        if (!boucle) return;
        boucle = false;
        renderer.setAnimationLoop(null);
        majValeur();
    }

    /* ── Accessibilité : la scène se tourne au clavier ── */
    function majValeur() {
        const a = etat.angle + tasse.rotation.y;
        const deg = ((Math.round(THREE.MathUtils.radToDeg(a)) % 360) + 360) % 360;
        // direction de l'anse vue de la caméra : x à droite, z vers le visiteur
        const x = Math.cos(a), z = -Math.sin(a);
        const textes = TEXTES[anglais ? 'en' : 'fr'];
        const texte = Math.abs(x) >= Math.abs(z) ? (x > 0 ? textes[0] : textes[2]) : (z > 0 ? textes[1] : textes[3]);
        zone.setAttribute('aria-valuenow', String(deg));
        zone.setAttribute('aria-valuetext', texte);
    }

    function tourner(delta, duree) {
        etat.vitesse = 0;
        const de = etat.angle;
        if (reduit || !duree) {
            etat.angle = de + delta;
            etat.tween = null;
            rendre();
            majValeur();
            return;
        }
        etat.tween = { de, vers: (etat.tween ? etat.tween.vers : de) + delta, debut: performance.now(), duree, courbe: duree > 1000 ? adoucir : sortir };
        reveiller();
    }

    /* ── Geste du visiteur ── */
    let echantillons = [];
    function poser(e) {
        if (e.button !== 0 || etat.saisie) return;
        etat.saisie = { id: e.pointerId, x: e.clientX, y: e.clientY, type: e.pointerType };
        etat.tween = null;
        etat.vitesse = 0;
        invitee = true;
        echantillons = [{ t: e.timeStamp, a: etat.angle }];
        zone.setPointerCapture(e.pointerId);
        zone.classList.add('est-saisie');
        reveiller();
    }
    function deplacer(e) {
        const r = zone.getBoundingClientRect();
        if (etat.saisie && e.pointerId === etat.saisie.id) {
            const dx = e.clientX - etat.saisie.x, dy = e.clientY - etat.saisie.y;
            etat.saisie.x = e.clientX;
            etat.saisie.y = e.clientY;
            etat.angle += (dx / r.width) * Math.PI * 1.5;
            etat.elevation = THREE.MathUtils.clamp(etat.elevation + (dy / r.height) * 1.1, ELEVATION - INCLINAISON, ELEVATION + INCLINAISON);
            echantillons.push({ t: e.timeStamp, a: etat.angle });
            if (echantillons.length > 6) echantillons.shift();
            reveiller();
        } else if (e.pointerType === 'mouse' && !reduit) {
            // au repos, la tasse suit très légèrement la souris
            etat.paraXc = ((e.clientX - r.left) / r.width - 0.5) * 0.16;
            etat.paraYc = ((e.clientY - r.top) / r.height - 0.5) * 0.08;
            reveiller();
        }
    }
    function lacher(e) {
        if (!etat.saisie || e.pointerId !== etat.saisie.id) return;
        etat.saisie = null;
        zone.classList.remove('est-saisie');
        const premier = echantillons[0], dernierE = echantillons[echantillons.length - 1];
        const duree = (dernierE.t - premier.t) / 1000;
        etat.vitesse = !reduit && e.type === 'pointerup' && duree > 0.01 && duree < 0.3
            ? THREE.MathUtils.clamp((dernierE.a - premier.a) / duree, -9, 9) : 0;
        reveiller();
    }
    function quitter() {
        etat.paraXc = 0;
        etat.paraYc = 0;
        reveiller();
    }
    function touche(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') tourner(PAS_CLAVIER, 240);
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') tourner(-PAS_CLAVIER, 240);
        else if (e.key === 'Home') tourner(THREE.MathUtils.euclideanModulo(ANGLE_REPOS - etat.angle - tasse.rotation.y + Math.PI, Math.PI * 2) - Math.PI, 240);
        else return;
        invitee = true;
        e.preventDefault();
    }

    /* ── Teintes ── */
    function choisir(bouton) {
        const nom = bouton.dataset.teinte;
        if (!teintes[nom] || bouton.getAttribute('aria-pressed') === 'true') return;
        figure.querySelectorAll('[data-teinte]').forEach((b) => b.setAttribute('aria-pressed', b === bouton ? 'true' : 'false'));
        if (affichee) affichee.textContent = bouton.textContent.trim();
        if (reduit) {
            ceramique.email.color.copy(teintes[nom]);
            rendre();
            return;
        }
        etat.teinte = { de: ceramique.email.color.clone(), vers: teintes[nom], debut: performance.now() };
        etat.saut = { de: tasse.rotation.y, debut: performance.now() };
        reveiller();
    }
    const auClic = (e) => {
        const b = e.target.closest('[data-teinte]');
        if (b) choisir(b);
    };

    /* ── Taille, visibilité, préférences ── */
    function ajuster() {
        const l = capture ? 1200 : zone.clientWidth, h = capture ? 1200 : zone.clientHeight;
        if (!l || !h) return;
        renderer.setSize(l, h, false);
        camera.aspect = l / h;
        camera.updateProjectionMatrix();
        if (!boucle) rendre();
    }
    const redim = new ResizeObserver(ajuster);
    const vue = new IntersectionObserver((entrees) => {
        entrees.forEach((en) => {
            visible = en.isIntersecting;
            if (!visible) { arreterBoucle(); return; }
            reveiller();
            // Le demi-tour d'invitation, une seule fois, quand la tasse est bien à l'écran.
            if (!invitee && en.intersectionRatio >= 0.45) {
                invitee = true;
                setTimeout(() => { if (!etat.saisie && !etat.tween) tourner(Math.PI, 1900); }, 380);
            }
        });
    }, { threshold: [0, 0.45] });
    const surOnglet = () => {
        ongletVisible = !document.hidden;
        if (ongletVisible) reveiller(); else arreterBoucle();
    };
    const surMouvement = () => {
        reduit = mouvementReduit.matches;
        if (reduit) { etat.vitesse = 0; etat.tween = null; etat.paraXc = etat.paraYc = 0; }
        rendre();
        reveiller();
    };
    const surAmbiance = new MutationObserver(() => {
        ambianceCoupee = document.documentElement.classList.contains('ambiance-coupee');
        reveiller();
    });

    function perdu() {
        // Contexte WebGL perdu : on revient à l'image de secours, sans erreur visible.
        arreter();
    }

    function arreter() {
        if (fini) return;
        fini = true;
        renderer.setAnimationLoop(null);
        redim.disconnect();
        vue.disconnect();
        surAmbiance.disconnect();
        document.removeEventListener('visibilitychange', surOnglet);
        mouvementReduit.removeEventListener('change', surMouvement);
        zone.removeEventListener('pointerdown', poser);
        zone.removeEventListener('pointermove', deplacer);
        zone.removeEventListener('pointerup', lacher);
        zone.removeEventListener('pointercancel', lacher);
        zone.removeEventListener('pointerleave', quitter);
        zone.removeEventListener('keydown', touche);
        figure.removeEventListener('click', auClic);
        figure.classList.remove('est-3d');
        ['tabindex', 'role', 'aria-label', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext'].forEach((a) => zone.removeAttribute(a));
        scene.traverse((o) => {
            if (o.geometry) o.geometry.dispose();
            if (o.material) {
                Object.values(o.material).forEach((v) => { if (v && v.isTexture) v.dispose(); });
                o.material.dispose();
            }
        });
        ceramique.textures.forEach((t) => t.dispose());
        environnement.dispose();
        renderer.dispose();
        canevas.remove();
        delete figure.dataset.scene3dLance;
    }
    canevas.addEventListener('webglcontextlost', perdu, { once: true });

    /* ── Première image ── */
    ajuster();
    placerCamera();
    pivot.rotation.y = etat.angle;
    const pret = renderer.compileAsync ? renderer.compileAsync(scene, camera) : Promise.resolve();
    pret.catch(() => {}).then(() => {
        if (fini) return;
        if (capture) {
            // ?capture-tasse=faience : la même image, dans une autre teinte (vérification des quatre émaux)
            const t = new URLSearchParams(location.search).get('capture-tasse');
            if (teintes[t]) ceramique.email.color.copy(teintes[t]);
            rendre();
            figure.tasseCapture = canevas.toDataURL('image/png');
            figure.dataset.capture = 'pret';
            return;
        }
        rendre();
        // La 3D remplace l'image d'un coup, au même cadrage.
        figure.classList.add('est-3d');
        zone.setAttribute('tabindex', '0');
        zone.setAttribute('role', 'slider');
        zone.setAttribute('aria-label', figure.dataset.libelleTourner || '');
        zone.setAttribute('aria-valuemin', '0');
        zone.setAttribute('aria-valuemax', '359');
        majValeur();
        zone.addEventListener('pointerdown', poser);
        zone.addEventListener('pointermove', deplacer);
        zone.addEventListener('pointerup', lacher);
        zone.addEventListener('pointercancel', lacher);
        zone.addEventListener('pointerleave', quitter);
        zone.addEventListener('keydown', touche);
        figure.addEventListener('click', auClic);
        redim.observe(zone);
        vue.observe(figure);
        document.addEventListener('visibilitychange', surOnglet);
        mouvementReduit.addEventListener('change', surMouvement);
        surAmbiance.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    });

    return arreter;
}

// Le module démarre seul toutes les scènes « tasse » de la page que js/site.js a marquées comme proches de l'écran.
function lancerProches() {
    const capture = /[?&]capture-tasse\b/.test(location.search);
    document.querySelectorAll('[data-scene-3d="tasse"][data-scene-3d-proche]').forEach((figure) => demarrer(figure, { capture }));
}
document.addEventListener('scene3d:proche', lancerProches);
lancerProches();
