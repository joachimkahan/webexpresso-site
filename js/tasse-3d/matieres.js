// matieres.js : couleurs lues dans les jetons du site, textures peintes à la volée (émail, café, ombre) et vapeur.
import * as THREE from '../vendor/three/three.module.js';

/* ── Couleurs ── */
// Les jetons sont en OKLCH : on les peint sur un canevas d'un pixel et on relit ce pixel en sRGB.
let pixel = null;
export function octets(texte) {
    if (!pixel) {
        const c = document.createElement('canvas');
        c.width = c.height = 1;
        pixel = c.getContext('2d', { willReadFrequently: true });
    }
    pixel.clearRect(0, 0, 1, 1);
    pixel.fillStyle = '#808080';
    pixel.fillStyle = texte;
    pixel.fillRect(0, 0, 1, 1);
    const d = pixel.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
}
export function jeton(element, nom) {
    return getComputedStyle(element).getPropertyValue(nom).trim() || '#808080';
}
export function couleur(texte) {
    const [r, g, b] = octets(texte);
    return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
}
function rgba(o, a) { return `rgba(${o[0]},${o[1]},${o[2]},${a})`; }
function melange(a, b, t) { return a.map((v, i) => Math.round(v + (b[i] - v) * t)); }

/* ── Hasard reproductible et bruit périodique ── */
function hasard(graine) {
    let s = graine >>> 0;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
}
// Bruit de valeurs qui se raccorde sur ses bords (la texture fait le tour de la tasse sans couture).
function bruitPeriodique(px, py, alea) {
    const g = new Float32Array(px * py).map(() => alea());
    const lisse = (t) => t * t * (3 - 2 * t);
    return (x, y) => {
        const xi = Math.floor(x), yi = Math.floor(y);
        const fx = lisse(x - xi), fy = lisse(y - yi);
        const x0 = ((xi % px) + px) % px, x1 = (x0 + 1) % px;
        const y0 = ((yi % py) + py) % py, y1 = (y0 + 1) % py;
        const a = g[y0 * px + x0], b = g[y0 * px + x1], c = g[y1 * px + x0], d = g[y1 * px + x1];
        return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
    };
}

function toile(l, h) {
    const c = document.createElement('canvas');
    c.width = l;
    c.height = h;
    return c;
}

/* ── Émail : relief de tournage et piqûres ── */
// Relief : les fines côtes laissées par les doigts au tournage, et une ondulation lente, très faibles.
function texteRelief() {
    const L = 512, H = 512;
    const alea = hasard(7);
    const lent = bruitPeriodique(6, 8, alea);
    const fin = bruitPeriodique(48, 64, alea);
    const hauteur = new Float32Array(L * H);
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < L; x++) {
            const u = x / L, v = y / H;
            const derive = lent(u * 6, v * 8) * 1.4;
            const cotes = Math.sin((v * 34 + derive) * Math.PI * 2) * (0.55 + 0.45 * lent(u * 6 + 3, v * 8 + 5));
            hauteur[y * L + x] = cotes * 0.16 + lent(u * 6 + 11, v * 8 + 2) * 1.3 + fin(u * 48, v * 64) * 0.12;
        }
    }
    const c = toile(L, H);
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(L, H);
    const force = 1.6;
    for (let y = 0; y < H; y++) {
        for (let x = 0; x < L; x++) {
            const g = hauteur[y * L + ((x + L - 1) % L)], d = hauteur[y * L + ((x + 1) % L)];
            const h = hauteur[((y + H - 1) % H) * L + x], b = hauteur[((y + 1) % H) * L + x];
            let nx = (g - d) * force, ny = (b - h) * force, nz = 1;
            const n = Math.hypot(nx, ny, nz);
            const i = (y * L + x) * 4;
            img.data[i] = (nx / n * 0.5 + 0.5) * 255;
            img.data[i + 1] = (ny / n * 0.5 + 0.5) * 255;
            img.data[i + 2] = (nz / n * 0.5 + 0.5) * 255;
            img.data[i + 3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
    return t;
}

// Piqûres : les petits points de fer d'un grès émaillé, à peine visibles sur les teintes sombres.
function texturePiqures(argile) {
    const c = toile(1024, 512);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 512);
    const alea = hasard(23);
    const fonce = melange(argile, [40, 26, 16], 0.38);
    for (let k = 0; k < 310; k++) {
        const x = alea() * 1024, y = alea() * 512, r = 0.6 + Math.pow(alea(), 3) * 1.8;
        ctx.fillStyle = rgba(fonce, 0.14 + alea() * 0.26);
        ctx.beginPath();
        ctx.ellipse(x, y, r * 1.1, r, 0, 0, Math.PI * 2);
        ctx.fill();
        if (x < 4) { ctx.beginPath(); ctx.ellipse(x + 1024, y, r * 1.1, r, 0, 0, Math.PI * 2); ctx.fill(); }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 4;
    return t;
}

// Terre brute : grain mat, quelques nuances.
function textureArgile(argile) {
    const c = toile(512, 256);
    const ctx = c.getContext('2d');
    ctx.fillStyle = rgba(argile, 1);
    ctx.fillRect(0, 0, 512, 256);
    const alea = hasard(5);
    for (let k = 0; k < 2600; k++) {
        const clair = alea() < 0.5;
        ctx.fillStyle = clair ? 'rgba(255,248,235,0.18)' : 'rgba(60,38,20,0.16)';
        ctx.fillRect(alea() * 512, alea() * 256, 1 + alea() * 1.5, 1 + alea() * 1.5);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
}

export function materiauxCeramique(element) {
    const argileOctets = octets(jeton(element, '--argile'));
    const relief = texteRelief();
    const piqures = texturePiqures(argileOctets);
    const uniformes = { uArgile: { value: couleur(jeton(element, '--argile')) }, uCasse: { value: 0.55 } };

    const email = new THREE.MeshPhysicalMaterial({
        color: couleur(jeton(element, '--email-creme')),
        map: piqures,
        roughness: 0.32,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.07,
        normalMap: relief,
        normalScale: new THREE.Vector2(0.09, 0.09),
        clearcoatNormalMap: relief,
        clearcoatNormalScale: new THREE.Vector2(0.06, 0.06),
        ior: 1.52,
    });
    // L'émail s'amincit sur la lèvre et laisse paraître la terre (attribut « bord » des géométries).
    email.onBeforeCompile = (shader) => {
        shader.uniforms.uArgile = uniformes.uArgile;
        shader.uniforms.uCasse = uniformes.uCasse;
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nattribute float bord;\nattribute float occl;\nvarying float vBord;\nvarying float vOccl;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvBord = bord;\nvOccl = occl;');
        shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nuniform vec3 uArgile;\nuniform float uCasse;\nvarying float vBord;\nvarying float vOccl;')
            .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, uArgile, vBord * uCasse) * (1.0 - 0.45 * vOccl);')
            // l'occlusion éteint aussi les reflets : un creux ombré reste de la couleur de l'émail, jamais un gris de verre
            .replace('#include <aomap_fragment>', '#include <aomap_fragment>\n{ float ao = 1.0 - vOccl; reflectedLight.indirectDiffuse *= ao; reflectedLight.indirectSpecular *= ao * ao;\n#if defined( USE_CLEARCOAT )\nclearcoatSpecularIndirect *= ao * ao;\n#endif\n}');
    };
    email.customProgramCacheKey = () => 'email-bord';

    // La terre brute du pied : mate, chaude, assombrie là où elle touche la soucoupe (couleurs des sommets).
    const terre = new THREE.MeshStandardMaterial({
        map: textureArgile(argileOctets),
        roughness: 1,
        metalness: 0,
        envMapIntensity: 0.55,
        vertexColors: true,
        normalMap: relief,
        normalScale: new THREE.Vector2(0.35, 0.35),
    });
    return { email, terre, uniformes, textures: [relief, piqures, terre.map] };
}

/* ── Le café ── */
// Le cœur de lait : la courbe classique du cœur, couchée (pointe vers +x), un peu plus large que longue.
function pointCoeur(cx, cy, s, t) {
    const k = s / 16.5;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const w = 1 + 0.03 * Math.sin(3 * t + 1.3) + 0.018 * Math.sin(5 * t + 0.4);   // le lait n'est jamais tout à fait régulier
    return [cx - (y - 2.5) * k * 0.9 * w, cy + x * k * 1.04 * w];
}
function tracerCoeur(ctx, cx, cy, s) {
    ctx.beginPath();
    for (let i = 0; i <= 160; i++) {
        const [px, py] = pointCoeur(cx, cy, s, (i / 160) * Math.PI * 2);
        if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.closePath();
}

// Une forme aux bords fondus : on ne peint que son ombre, la forme elle-même est tracée hors du canevas
// (le flou de l'ombre marche dans tous les navigateurs, contrairement à ctx.filter).
function flou(ctx, tracer, couleur, rayon, trait) {
    ctx.save();
    ctx.shadowColor = couleur;
    ctx.shadowBlur = rayon;
    ctx.shadowOffsetX = 8192;
    ctx.translate(-8192, 0);
    tracer();
    if (trait) {
        ctx.lineWidth = trait;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.stroke();
    } else {
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fill();
    }
    ctx.restore();
}

export function materiauCafe(element) {
    const T = 1024, m = T / 2;
    const encre = octets(jeton(element, '--encre'));
    const caramel = octets(jeton(element, '--caramel'));
    const crema = octets(jeton(element, '--crema'));
    const lait = octets(jeton(element, '--papier-blanc'));
    const ivoire = melange(lait, crema, 0.32);              // le lait monté : ivoire, jamais blanc pur
    const alea = hasard(11);

    const c = toile(T, T);
    const ctx = c.getContext('2d');
    // Fond : la crème du café, caramel au centre, noisette puis presque espresso contre la paroi.
    const fond = ctx.createRadialGradient(m, m, 0, m, m, m);
    fond.addColorStop(0, rgba(melange(caramel, crema, 0.12), 1));
    fond.addColorStop(0.5, rgba(caramel, 1));
    fond.addColorStop(0.78, rgba(melange(caramel, encre, 0.3), 1));
    fond.addColorStop(0.93, rgba(melange(caramel, encre, 0.58), 1));
    fond.addColorStop(1, rgba(melange(caramel, encre, 0.82), 1));
    ctx.fillStyle = fond;
    ctx.fillRect(0, 0, T, T);
    // Marbrure « peau de tigre » : taches étirées dans le sens où tourne la crème, chaudes, claires et sombres.
    for (let k = 0; k < 1100; k++) {
        const a = alea() * Math.PI * 2, r = Math.sqrt(alea()) * m * 0.95;
        const x = m + Math.cos(a) * r, y = m + Math.sin(a) * r, t = 3 + alea() * 11;
        const fonce = alea() < 0.5;
        const teinte = fonce ? melange(caramel, encre, 0.45 + 0.2 * (r / m)) : melange(caramel, crema, 0.35);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(a + Math.PI / 2);
        ctx.scale(2.6, 1);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, t);
        g.addColorStop(0, rgba(teinte, fonce ? 0.2 : 0.16));
        g.addColorStop(1, rgba(teinte, 0));
        ctx.fillStyle = g;
        ctx.fillRect(-t, -t, t * 2, t * 2);
        ctx.restore();
    }
    // Fin liseré de mousse claire contre la paroi.
    ctx.lineWidth = 4;
    ctx.strokeStyle = rgba(melange(caramel, crema, 0.5), 0.45);
    ctx.beginPath();
    ctx.arc(m, m, m * 0.988, 0, Math.PI * 2);
    ctx.stroke();

    // Le cœur, en couches de lait.
    const s = m * 0.6, cx = m - s * 0.27, cy = m + 4;
    const coeur = (e, d) => () => tracerCoeur(ctx, cx - s * d, cy, s * e);
    // 1. la crème s'éclaircit autour du lait, puis le lait lui-même, aux bords fondus sur quelques pixels
    flou(ctx, coeur(1.05, 0), rgba(melange(caramel, crema, 0.55), 0.55), 26);
    flou(ctx, coeur(1, 0), rgba(ivoire, 0.94), 7);
    // 2. le bord du lait laisse transparaître la crème
    ctx.save();
    tracerCoeur(ctx, cx, cy, s);
    ctx.clip();
    flou(ctx, coeur(1, 0), rgba(melange(caramel, crema, 0.5), 0.32), 10, 10);
    // 3. les vaguelettes du lait versé en plusieurs fois : des cœurs emboîtés, tirés vers les lobes
    //    (bandes de crème larges et floues, qui s'effacent vers la pointe : une bande, pas un trait)
    const bandes = toile(T, T);
    const bc = bandes.getContext('2d');
    [[0.8, 0.14, 9, 0.3], [0.6, 0.25, 7, 0.24], [0.42, 0.34, 5, 0.18]].forEach(([e, d, l, a]) => {
        flou(bc, () => tracerCoeur(bc, cx - s * d, cy, s * e), rgba(melange(caramel, crema, 0.42), a), 7, l);
    });
    bc.globalCompositeOperation = 'destination-in';
    const fondu = bc.createLinearGradient(cx - s * 0.6, 0, cx + s * 0.95, 0);
    fondu.addColorStop(0, 'rgba(0,0,0,1)');
    fondu.addColorStop(0.5, 'rgba(0,0,0,0.65)');
    fondu.addColorStop(1, 'rgba(0,0,0,0)');
    bc.fillStyle = fondu;
    bc.fillRect(0, 0, T, T);
    ctx.drawImage(bandes, 0, 0);
    // 4. grain de la mousse et microbulles sur le lait
    for (let k = 0; k < 2600; k++) {
        const x = cx - s * 0.7 + alea() * s * 1.9, y = cy - s * 1.05 + alea() * s * 2.1;
        ctx.fillStyle = alea() < 0.55 ? rgba(melange(ivoire, caramel, 0.35), 0.16) : 'rgba(255,253,248,0.22)';
        ctx.beginPath();
        ctx.arc(x, y, 0.5 + Math.pow(alea(), 2) * 1.6, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
    // 5. fines traînées où le lait se mêle à la crème
    for (let k = 0; k < 22; k++) {
        const t = alea() * Math.PI * 2;
        const [x, y] = pointCoeur(cx, cy, s, t);
        const [x2, y2] = pointCoeur(cx, cy, s, t + 0.02);
        const nx = y2 - y, ny = -(x2 - x), n = Math.hypot(nx, ny) || 1;   // normale sortante
        const long = 5 + alea() * 12, sens = 1;                            // elles filent dans le sens du versement, vers la pointe
        ctx.strokeStyle = rgba(ivoire, 0.12 + alea() * 0.14);
        ctx.lineWidth = 0.8 + alea() * 1.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x - (nx / n) * 2, y - (ny / n) * 2);
        ctx.quadraticCurveTo(x + (nx / n) * long * 0.5 + sens * (x2 - x) * 4, y + (ny / n) * long * 0.5 + sens * (y2 - y) * 4,
            x + (nx / n) * long + sens * (x2 - x) * 8, y + (ny / n) * long + sens * (y2 - y) * 8);
        ctx.stroke();
    }
    // 6. le tiré : une traînée de crème qui fend le cœur, s'amenuise et file un peu au-delà de la pointe
    flou(ctx, () => {
        const debut = cx - s * 0.34, fin = cx + s * 1.2, n = 40;
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
            const u = i / n;
            ctx.lineTo(debut + (fin - debut) * u, cy - (3.6 * Math.pow(1 - u, 0.9) + 0.35) + Math.sin(u * 5) * 1.2);
        }
        for (let i = n; i >= 0; i--) {
            const u = i / n;
            ctx.lineTo(debut + (fin - debut) * u, cy + (3.6 * Math.pow(1 - u, 0.9) + 0.35) + Math.sin(u * 5) * 1.2);
        }
        ctx.closePath();
    }, rgba(melange(caramel, encre, 0.12), 0.78), 2.2);
    // Micro-mousse : de fines bulles sur toute la crème.
    for (let k = 0; k < 2600; k++) {
        const a = alea() * Math.PI * 2, r = Math.sqrt(alea()) * m * 0.97;
        ctx.fillStyle = alea() < 0.5 ? rgba(melange(caramel, crema, 0.6), 0.14) : rgba(melange(caramel, encre, 0.6), 0.1);
        ctx.beginPath();
        ctx.arc(m + Math.cos(a) * r, m + Math.sin(a) * r, 0.6 + alea() * 1.2, 0, Math.PI * 2);
        ctx.fill();
    }
    const carte = new THREE.CanvasTexture(c);
    carte.colorSpace = THREE.SRGBColorSpace;
    carte.anisotropy = 8;

    // Relief : le lait est un rien plus haut que la crème, les vaguelettes un rien plus hautes encore.
    const r = toile(512, 512);
    const rc = r.getContext('2d');
    rc.fillStyle = 'rgb(90,90,90)';
    rc.fillRect(0, 0, 512, 512);
    flou(rc, () => tracerCoeur(rc, cx / 2, cy / 2, s / 2), 'rgba(205,205,205,1)', 8);
    [[0.8, 0.15], [0.6, 0.27]].forEach(([e, d]) => flou(rc, () => tracerCoeur(rc, (cx - s * d) / 2, cy / 2, (s * e) / 2), 'rgba(235,235,235,0.6)', 2, 2));
    const relief = new THREE.CanvasTexture(r);

    return new THREE.MeshPhysicalMaterial({
        map: carte,
        roughness: 0.64,
        metalness: 0,
        specularIntensity: 0.6,
        bumpMap: relief,
        bumpScale: 0.5,
        clearcoat: 0.12,
        clearcoatRoughness: 0.4,
    });
}

/* ── L'ombre de contact ── */
export function materiauOmbre(element) {
    const c = toile(256, 256);
    const ctx = c.getContext('2d');
    const o = octets(jeton(element, '--bleu-nuit'));
    const nuit = melange(o, [0, 0, 0], 0.55);
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    // le bord de la soucoupe tombe à 84 % du rayon : l'ombre ne déborde que d'un liseré doux, jamais jusqu'au bord du cadre
    g.addColorStop(0, rgba(nuit, 0.7));
    g.addColorStop(0.76, rgba(nuit, 0.62));
    g.addColorStop(0.84, rgba(nuit, 0.4));
    g.addColorStop(0.91, rgba(nuit, 0.12));
    g.addColorStop(0.98, rgba(nuit, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, toneMapped: false });
}

/* ── La vapeur ── */
const VAPEUR_SOMMETS = /* glsl */`
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const VAPEUR_FRAGMENTS = /* glsl */`
varying vec2 vUv;
uniform float uTemps;
uniform float uGraine;
uniform float uOpacite;
uniform vec3 uCouleur;
float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h(i), h(i + vec2(1.0, 0.0)), f.x), mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
    float s = 0.0, a = 0.5;
    for (int k = 0; k < 4; k++) { s += a * n(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
    return s;
}
void main() {
    float y = vUv.y;
    float t = uTemps;
    // La colonne ondule de plus en plus en montant, et s'élargit.
    float ondule = (fbm(vec2(y * 1.4 - t * 0.11, uGraine)) - 0.5) * 0.7 * y;
    float x = vUv.x - 0.5 - ondule;
    float largeur = mix(0.05, 0.2, y);
    float colonne = exp(-(x * x) / (largeur * largeur));
    float volutes = fbm(vec2(vUv.x * 3.2 + uGraine, y * 2.2 - t * 0.2));
    float voile = smoothstep(0.42, 0.9, volutes * colonne * 1.55);
    float fondu = smoothstep(0.02, 0.22, y) * (1.0 - smoothstep(0.4, 0.98, y));
    gl_FragColor = vec4(uCouleur, voile * fondu * uOpacite);
    #include <colorspace_fragment>
}`;

export function materiauVapeur(element, graine, opacite) {
    return new THREE.ShaderMaterial({
        uniforms: {
            uTemps: { value: 0 },
            uGraine: { value: graine },
            uOpacite: { value: opacite },
            uCouleur: { value: couleur(jeton(element, '--papier-blanc')) },
        },
        vertexShader: VAPEUR_SOMMETS,
        fragmentShader: VAPEUR_FRAGMENTS,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        forceSinglePass: true,   // un voile transparent à double face : un seul passage suffit
        toneMapped: false,
    });
}
