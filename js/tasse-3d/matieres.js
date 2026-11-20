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
    const fonce = melange(argile, [40, 26, 16], 0.55);
    for (let k = 0; k < 520; k++) {
        const x = alea() * 1024, y = alea() * 512, r = 0.6 + Math.pow(alea(), 3) * 1.8;
        ctx.fillStyle = rgba(fonce, 0.22 + alea() * 0.4);
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
            .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, uArgile, vBord * uCasse) * (1.0 - vOccl);');
    };
    email.customProgramCacheKey = () => 'email-bord';

    const terre = new THREE.MeshStandardMaterial({
        map: textureArgile(argileOctets),
        roughness: 0.92,
        metalness: 0,
        normalMap: relief,
        normalScale: new THREE.Vector2(0.25, 0.25),
    });
    return { email, terre, uniformes, textures: [relief, piqures, terre.map] };
}

/* ── Le café ── */
// Le cœur de lait : la courbe classique du cœur, couchée (pointe vers +x), un peu plus large que longue.
function tracerCoeur(ctx, cx, cy, s) {
    const k = s / 16.5;
    ctx.beginPath();
    for (let i = 0; i <= 160; i++) {
        const t = (i / 160) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        const w = 1 + 0.03 * Math.sin(3 * t + 1.3) + 0.018 * Math.sin(5 * t + 0.4);   // le lait n'est jamais tout à fait régulier
        const px = cx - (y - 2.5) * k * 0.9 * w, py = cy + x * k * 1.04 * w;
        if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.closePath();
}

export function materiauCafe(element) {
    const T = 1024, m = T / 2;
    const encre = octets(jeton(element, '--encre'));
    const caramel = octets(jeton(element, '--caramel'));
    const crema = octets(jeton(element, '--crema'));
    const lait = octets(jeton(element, '--papier-blanc'));
    const noisette = melange(caramel, encre, 0.3);
    const mousse = melange(lait, crema, 0.18);
    const alea = hasard(11);

    const c = toile(T, T);
    const ctx = c.getContext('2d');
    // Fond : la crème du café, noisette, plus sombre vers la paroi où l'espresso affleure.
    const fond = ctx.createRadialGradient(m, m, 0, m, m, m);
    fond.addColorStop(0, rgba(melange(caramel, encre, 0.1), 1));
    fond.addColorStop(0.55, rgba(noisette, 1));
    fond.addColorStop(0.86, rgba(melange(caramel, encre, 0.52), 1));
    fond.addColorStop(0.965, rgba(melange(caramel, encre, 0.72), 1));
    fond.addColorStop(1, rgba(encre, 1));
    ctx.fillStyle = fond;
    ctx.fillRect(0, 0, T, T);
    // Marbrure de la crème (« peau de tigre ») : taches douces, claires et sombres.
    for (let k = 0; k < 700; k++) {
        const a = alea() * Math.PI * 2, r = Math.sqrt(alea()) * m * 0.93;
        const x = m + Math.cos(a) * r, y = m + Math.sin(a) * r, t = 4 + alea() * 16;
        const g = ctx.createRadialGradient(x, y, 0, x, y, t);
        const teinte = alea() < 0.55 ? melange(caramel, crema, 0.35) : melange(noisette, encre, 0.4);
        g.addColorStop(0, rgba(teinte, 0.13));
        g.addColorStop(1, rgba(teinte, 0));
        ctx.fillStyle = g;
        ctx.fillRect(x - t, y - t, t * 2, t * 2);
    }
    // Liseré de mousse claire contre la paroi.
    ctx.lineWidth = 6;
    ctx.strokeStyle = rgba(melange(crema, caramel, 0.4), 0.4);
    ctx.beginPath();
    ctx.arc(m, m, m * 0.985, 0, Math.PI * 2);
    ctx.stroke();

    // Le cœur : le lait monté, plus blanc au centre, bordé d'un halo de crème claire.
    const s = m * 0.6, cx = m - s * 0.27, cy = m + 4;
    ctx.save();
    ctx.shadowColor = rgba(melange(caramel, crema, 0.45), 0.6);
    ctx.shadowBlur = 12;
    const blanc = ctx.createRadialGradient(cx - s * 0.2, cy, s * 0.1, cx, cy, s * 1.05);
    blanc.addColorStop(0, rgba(lait, 1));
    blanc.addColorStop(0.7, rgba(mousse, 1));
    blanc.addColorStop(1, rgba(melange(mousse, crema, 0.4), 1));
    ctx.fillStyle = blanc;
    tracerCoeur(ctx, cx, cy, s);
    ctx.fill();
    ctx.restore();
    // Les couches du lait versé : deux cœurs emboîtés, en fin trait de crème, vers les lobes.
    ctx.lineJoin = 'round';
    [[0.74, 0.18, 4, 0.34], [0.5, 0.32, 3, 0.24]].forEach(([e, d, l, a]) => {
        ctx.lineWidth = l;
        ctx.strokeStyle = rgba(melange(caramel, crema, 0.45), a);
        tracerCoeur(ctx, cx - s * d, cy, s * e);
        ctx.stroke();
    });
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = rgba(noisette, 0.4);
    tracerCoeur(ctx, cx, cy, s);
    ctx.stroke();
    // Le tiré : le filet de lait qui fend le cœur et l'étire en pointe.
    const tire = ctx.createLinearGradient(cx - s * 0.65, cy, cx + s * 1.0, cy);
    tire.addColorStop(0, rgba(noisette, 0));
    tire.addColorStop(0.2, rgba(melange(caramel, crema, 0.3), 0.7));
    tire.addColorStop(1, rgba(noisette, 0.6));
    ctx.fillStyle = tire;
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.62, cy - 4);
    ctx.bezierCurveTo(cx - s * 0.1, cy - 3, cx + s * 0.5, cy + 1, cx + s * 1.0, cy + 2);
    ctx.bezierCurveTo(cx + s * 0.5, cy + 3.5, cx - s * 0.1, cy + 4, cx - s * 0.62, cy + 4);
    ctx.closePath();
    ctx.fill();
    // Micro-mousse : de fines bulles partout.
    for (let k = 0; k < 2400; k++) {
        const a = alea() * Math.PI * 2, r = Math.sqrt(alea()) * m * 0.97;
        ctx.fillStyle = alea() < 0.5 ? 'rgba(255,250,240,0.10)' : 'rgba(40,24,12,0.08)';
        ctx.beginPath();
        ctx.arc(m + Math.cos(a) * r, m + Math.sin(a) * r, 0.7 + alea() * 1.3, 0, Math.PI * 2);
        ctx.fill();
    }
    const carte = new THREE.CanvasTexture(c);
    carte.colorSpace = THREE.SRGBColorSpace;
    carte.anisotropy = 8;

    // Relief : le lait est un rien plus haut que la crème.
    const r = toile(512, 512);
    const rc = r.getContext('2d');
    rc.fillStyle = 'rgb(90,90,90)';
    rc.fillRect(0, 0, 512, 512);
    rc.save();
    rc.shadowColor = 'rgba(255,255,255,0.9)';
    rc.shadowBlur = 14;
    rc.fillStyle = 'rgb(208,208,208)';
    tracerCoeur(rc, (cx) / 2, cy / 2, s / 2);
    rc.fill();
    rc.restore();
    const relief = new THREE.CanvasTexture(r);

    return new THREE.MeshPhysicalMaterial({
        map: carte,
        roughness: 0.58,
        metalness: 0,
        bumpMap: relief,
        bumpScale: 0.5,
        clearcoat: 0.22,
        clearcoatRoughness: 0.32,
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
