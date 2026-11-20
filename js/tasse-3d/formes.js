// formes.js : la tasse à cappuccino et sa soucoupe, construites par le code (profils tournés, anse en tube).
// Unité : le décimètre (la tasse fait 8 cm de haut, la soucoupe 16 cm de large).
import * as THREE from '../vendor/three/three.module.js';

const SEGMENTS = 144;   // finesse du tour (assez pour un reflet net sur la lèvre)

// Échantillonne un profil à pas réguliers (la texture de tournage garde la même finesse partout).
function echantillonner(chemin, n) {
    return chemin.getSpacedPoints(n).map((p) => new THREE.Vector2(Math.max(p.x, 0), p.y));
}

// Ajoute à une géométrie tournée l'attribut « bord » : 1 sur la lèvre, où l'émail s'amincit et laisse voir la terre.
function marquerBord(geometrie, profil, apex, largeur) {
    const longueurs = [0];
    for (let i = 1; i < profil.length; i++) longueurs.push(longueurs[i - 1] + profil[i].distanceTo(profil[i - 1]));
    const sApex = longueurs[apex];
    const nb = geometrie.attributes.position.count;
    const bord = new Float32Array(nb);
    const parTour = profil.length;   // LatheGeometry range les sommets tour par tour, profil complet à chaque fois
    for (let k = 0; k < nb; k++) {
        const d = (longueurs[k % parTour] - sApex) / largeur;
        bord[k] = Math.exp(-d * d);
    }
    geometrie.setAttribute('bord', new THREE.BufferAttribute(bord, 1));
}

function sansBord(geometrie) {
    geometrie.setAttribute('bord', new THREE.BufferAttribute(new Float32Array(geometrie.attributes.position.count), 1));
    geometrie.setAttribute('occl', new THREE.BufferAttribute(new Float32Array(geometrie.attributes.position.count), 1));
}

// Occlusion peinte dans les sommets (attribut « occl ») : le bas de la panse près de la soucoupe, le creux sous la tasse.
const lisse = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// Teinte de la terre brute, sommet par sommet : plus sombre là où le pied touche (matière lue par « vertexColors »).
function teinterTerre(geometrie, profil, regle) {
    const nb = geometrie.attributes.position.count;
    const couleurs = new Float32Array(nb * 3);
    for (let k = 0; k < nb; k++) couleurs.fill(regle(profil[k % profil.length]), k * 3, k * 3 + 3);
    geometrie.setAttribute('color', new THREE.BufferAttribute(couleurs, 3));
}

function marquerOcclusion(geometrie, profil, regle) {
    const i0 = sommet(profil);
    const valeurs = profil.map((p, i) => regle(p, i < i0));
    const nb = geometrie.attributes.position.count;
    const occl = new Float32Array(nb);
    for (let k = 0; k < nb; k++) occl[k] = valeurs[k % profil.length];
    geometrie.setAttribute('occl', new THREE.BufferAttribute(occl, 1));
}

// Indice du point le plus haut d'un profil (le sommet de la lèvre).
function sommet(profil) {
    let i0 = 0;
    profil.forEach((p, i) => { if (p.y > profil[i0].y) i0 = i; });
    return i0;
}

/* ── La tasse ── */
// Partie en terre brute : le dessous et le pied annulaire, jusqu'à la ligne d'émail.
function profilPiedTasse() {
    const c = new THREE.Path();
    c.moveTo(0, 0.032);
    c.lineTo(0.165, 0.032);
    c.quadraticCurveTo(0.188, 0.032, 0.192, 0.012);          // l'intérieur du pied descend
    c.quadraticCurveTo(0.196, 0.0, 0.212, 0.0);
    c.lineTo(0.236, 0.0);                                      // l'anneau qui touche la soucoupe
    c.quadraticCurveTo(0.254, 0.0, 0.256, 0.018);
    c.lineTo(0.262, 0.068);                                    // le flanc du pied, jusqu'à la ligne d'émail
    return echantillonner(c, 56);
}

// Partie émaillée : un petit ressaut (l'épaisseur de l'émail), la panse, la lèvre arrondie, l'intérieur.
function profilCorpsTasse() {
    const c = new THREE.Path();
    c.moveTo(0.262, 0.068);
    c.quadraticCurveTo(0.262, 0.074, 0.27, 0.076);            // le bord de l'émail, un rien en saillie
    c.bezierCurveTo(0.43, 0.074, 0.512, 0.28, 0.502, 0.665);  // la panse : un bol, rond en bas, presque droit en haut
    c.absarc(0.4865, 0.665, 0.0155, 0, Math.PI, false);       // la lèvre
    c.bezierCurveTo(0.478, 0.33, 0.42, 0.106, 0.13, 0.1);     // la paroi intérieure, plus épaisse vers le fond
    c.lineTo(0, 0.1);
    return echantillonner(c, 300);
}

// Rayon de la paroi intérieure à une hauteur donnée (pour poser le café).
function rayonInterieur(profil, y) {
    const i0 = sommet(profil);
    for (let i = i0; i < profil.length - 1; i++) {
        const a = profil[i], b = profil[i + 1];
        if ((a.y - y) * (b.y - y) <= 0) return a.x + (b.x - a.x) * ((y - a.y) / (b.y - a.y || 1));
    }
    return 0.4;
}

// Rayon extérieur à une hauteur donnée (pour ancrer l'anse dans la paroi).
function rayonExterieur(profil, y) {
    const i0 = sommet(profil);
    for (let i = 0; i < i0; i++) {
        const a = profil[i], b = profil[i + 1];
        if ((a.y - y) * (b.y - y) <= 0) return a.x + (b.x - a.x) * ((y - a.y) / (b.y - a.y || 1));
    }
    return 0.45;
}

// L'anse : un tube sur une courbe douce, section ovale, qui s'évase à ses deux attaches.
function geometrieAnse(profil) {
    const yHaut = 0.545, yBas = 0.235;
    const rHaut = rayonExterieur(profil, yHaut) - 0.016;
    const rBas = rayonExterieur(profil, yBas) - 0.016;
    const courbe = new THREE.CatmullRomCurve3([
        new THREE.Vector3(rHaut, yHaut, 0),
        new THREE.Vector3(rHaut + 0.06, yHaut + 0.012, 0),
        new THREE.Vector3(0.625, 0.548, 0),
        new THREE.Vector3(0.69, 0.485, 0),
        new THREE.Vector3(0.697, 0.385, 0),
        new THREE.Vector3(0.652, 0.295, 0),
        new THREE.Vector3(rBas + 0.075, yBas + 0.005, 0),
        new THREE.Vector3(rBas, yBas, 0),
    ], false, 'centripetal');
    const pas = 120, tour = 28, rayon = 0.03, largeur = 1.32;
    const g = new THREE.TubeGeometry(courbe, pas, rayon, tour, false);
    const pos = g.attributes.position, nor = g.attributes.normal;
    const centre = new THREE.Vector3(), v = new THREE.Vector3(), n = new THREE.Vector3();
    for (let k = 0; k < pos.count; k++) {
        const u = Math.floor(k / (tour + 1)) / pas;
        courbe.getPointAt(u, centre);
        // évasement aux attaches : le tube grossit de 45 % en se fondant dans la paroi
        const bout = Math.max(1 - u / 0.16, 1 - (1 - u) / 0.16, 0);
        const evase = 1 + 0.45 * bout * bout;
        v.fromBufferAttribute(pos, k).sub(centre);
        v.x *= evase; v.y *= evase; v.z *= evase * largeur;   // section ovale : plus large que profonde
        pos.setXYZ(k, centre.x + v.x, centre.y + v.y, centre.z + v.z);
        n.fromBufferAttribute(nor, k);
        n.z /= largeur;
        n.normalize();
        nor.setXYZ(k, n.x, n.y, n.z);
    }
    sansBord(g);
    return g;
}

/* ── La soucoupe ── */
function profilPiedSoucoupe() {
    const c = new THREE.Path();
    c.moveTo(0, 0.02);
    c.lineTo(0.25, 0.02);
    c.quadraticCurveTo(0.27, 0.02, 0.274, 0.008);
    c.quadraticCurveTo(0.278, 0.0, 0.29, 0.0);
    c.lineTo(0.33, 0.0);
    c.quadraticCurveTo(0.346, 0.0, 0.352, 0.012);
    c.lineTo(0.356, 0.018);
    return echantillonner(c, 40);
}

function profilCorpsSoucoupe() {
    const c = new THREE.Path();
    c.moveTo(0.356, 0.018);
    c.bezierCurveTo(0.5, 0.028, 0.72, 0.05, 0.8, 0.104);        // le dessous remonte vers le bord
    c.absarc(0.787, 0.108, 0.0135, -0.3, Math.PI, false);       // le bord roulé
    c.bezierCurveTo(0.762, 0.1, 0.62, 0.072, 0.38, 0.064);      // le dessus redescend vers le creux
    c.quadraticCurveTo(0.31, 0.062, 0.29, 0.054);               // le creux, en pente douce, où la tasse se pose
    c.quadraticCurveTo(0.282, 0.052, 0.26, 0.052);
    c.lineTo(0, 0.052);
    return echantillonner(c, 200);
}

/* ── Assemblage ── */
export function construireFormes() {
    const piedTasse = profilPiedTasse();
    const corpsTasse = profilCorpsTasse();
    const piedSoucoupe = profilPiedSoucoupe();
    const corpsSoucoupe = profilCorpsSoucoupe();

    const gPiedTasse = new THREE.LatheGeometry(piedTasse, SEGMENTS);
    const gCorpsTasse = new THREE.LatheGeometry(corpsTasse, SEGMENTS);
    const gPiedSoucoupe = new THREE.LatheGeometry(piedSoucoupe, SEGMENTS);
    const gCorpsSoucoupe = new THREE.LatheGeometry(corpsSoucoupe, SEGMENTS);
    marquerBord(gCorpsTasse, corpsTasse, sommet(corpsTasse), 0.022);
    marquerBord(gCorpsSoucoupe, corpsSoucoupe, sommet(corpsSoucoupe), 0.02);
    marquerOcclusion(gCorpsTasse, corpsTasse, (p, dehors) => (dehors ? 0.3 * (1 - lisse(0.06, 0.24, p.y)) : 0.12 * lisse(0.5, 0.6, p.y) * (1 - lisse(0.6, 0.66, p.y))));
    // Le creux de la soucoupe s'assombrit doucement autour du pied de la tasse : elle y est vraiment posée.
    marquerOcclusion(gCorpsSoucoupe, corpsSoucoupe, (p, dehors) => (dehors ? 0 : Math.min(0.62,
        0.55 * Math.exp(-Math.pow((p.x - 0.262) / 0.045, 2)) + 0.25 * (1 - lisse(0.28, 0.5, p.x)))));
    teinterTerre(gPiedTasse, piedTasse, (p) => 0.5 + 0.34 * lisse(0, 0.05, p.y));
    teinterTerre(gPiedSoucoupe, piedSoucoupe, () => 0.85);
    sansBord(gPiedTasse);
    sansBord(gPiedSoucoupe);

    const niveauCafe = 0.585;
    const rayonCafe = rayonInterieur(corpsTasse, niveauCafe) + 0.006;   // le bord du disque se cache dans la paroi
    // Le café : un disque à peine bombé, relevé au bord (le ménisque contre la paroi).
    const gCafe = new THREE.RingGeometry(0.0001, rayonCafe, 128, 28);
    const p = gCafe.attributes.position;
    for (let k = 0; k < p.count; k++) {
        const x = p.getX(k), y = p.getY(k);
        const r = Math.hypot(x, y) / rayonCafe;
        const z = 0.006 * (1 - r * r) + 0.012 * Math.pow(Math.max(0, (r - 0.9) / 0.1), 3);
        p.setZ(k, z);
    }
    gCafe.computeVertexNormals();
    gCafe.rotateX(-Math.PI / 2);
    gCafe.translate(0, niveauCafe, 0);

    return {
        piedTasse: gPiedTasse,
        corpsTasse: gCorpsTasse,
        anse: geometrieAnse(corpsTasse),
        piedSoucoupe: gPiedSoucoupe,
        corpsSoucoupe: gCorpsSoucoupe,
        cafe: gCafe,
        niveauCafe,
        rayonCafe,
        hauteurTasse: 0.68,
        posePlateau: 0.052,   // hauteur du creux de la soucoupe, où se pose le pied de la tasse
        rayonSoucoupe: 0.80,
    };
}
