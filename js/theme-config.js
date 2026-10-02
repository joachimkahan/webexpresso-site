/**
 * THEME-CONFIG.JS — Système de Design & Tokens Visuels
 * ============================================================
 * [EDITABLE] Ce fichier centralise l'identité visuelle du site.
 *
 * Rôle :
 * - Définir la palette de couleurs, la typographie, les espacements et les ombres
 * - Permettre une personnalisation graphique rapide sans toucher au CSS
 * - Exposer la méthode `applyTheme()` pour injecter les variables CSS dans `:root`
 * ============================================================
 * Thème : Bleu de Travail & Cuir Ambré — Option B
 * ============================================================
 */

const THEME_CONFIG = {

    // ── Palette de Couleurs (Bleu de Travail & Cuir Ambré) ───────────────────
    colors: {
        blancArt:        "#EDF1F5",   // Fond principal — gris pierre / brume minérale
        champagne:       "#FFFFFF",   // Surface carte — blanc mat
        terracottaPale:  "#F8FAFC",   // Hover surface — blanc cassé
        orDiscret:       "#1B3A57",   // Bleu de Chauffe / Indigo artisanal
        encre:           "#13253A",   // Texte principal — bleu nuit profond
        grisPierre:      "#536479",   // Texte secondaire — ardoise douce
        orGlow:          "rgba(199, 125, 54, 0.20)",
        encreLight:      "rgba(27, 58, 87, 0.12)"
    },

    // ── Typographie ────────────────────────────────────────────────
    typography: {
        fontDisplay:     "'Plus Jakarta Sans', -apple-system, sans-serif",
        fontBody:        "'Inter', system-ui, sans-serif"
    },

    // ── Mise en page & Dimensions ──────────────────────────────────
    layout: {
        containerMax:    "1200px",
        sectionPaddingY: "160px"
    },

    // ── Ombres & Élévation (atelier & matières) ────────────────────
    shadows: {
        card:   "0 4px 20px rgba(27, 58, 87, 0.08)",
        hover:  "0 8px 30px rgba(27, 58, 87, 0.14)",
        subtle: "0 2px 8px rgba(27, 58, 87, 0.05)"
    },

    // ── Motion & Transitions ───────────────────────────────────────
    motion: {
        transitionSpeed:  "0.35s",
        transitionSlow:   "0.6s",
        customCursor:     false,
        pageVoile:        true,
        parallax:         true
    },

    /**
     * Applique dynamiquement les tokens de thème au document (CSS Custom Properties)
     */
    applyTheme: function () {
        const root = document.documentElement;
        if (!root) return;

        // Application des couleurs
        if (this.colors) {
            if (this.colors.blancArt) root.style.setProperty('--blanc-art', this.colors.blancArt);
            if (this.colors.champagne) root.style.setProperty('--champagne', this.colors.champagne);
            if (this.colors.terracottaPale) root.style.setProperty('--terracotta-pale', this.colors.terracottaPale);
            if (this.colors.orDiscret) root.style.setProperty('--or-discret', this.colors.orDiscret);
            if (this.colors.encre) root.style.setProperty('--encre', this.colors.encre);
            if (this.colors.grisPierre) root.style.setProperty('--gris-pierre', this.colors.grisPierre);
            if (this.colors.orGlow) root.style.setProperty('--or-glow', this.colors.orGlow);
            if (this.colors.encreLight) root.style.setProperty('--encre-light', this.colors.encreLight);
        }

        // Application de la typographie
        if (this.typography) {
            if (this.typography.fontDisplay) {
                root.style.setProperty('--font-display', this.typography.fontDisplay);
                root.style.setProperty('--police-titre', this.typography.fontDisplay);
            }
            if (this.typography.fontBody) {
                root.style.setProperty('--font-body', this.typography.fontBody);
                root.style.setProperty('--police-corps', this.typography.fontBody);
            }
        }

        // Application du layout
        if (this.layout) {
            if (this.layout.containerMax) root.style.setProperty('--container-max', this.layout.containerMax);
        }

        console.log('[ThemeConfig] Tokens de design appliqués avec succès.');
    }

};

// Export global pour le navigateur
if (typeof window !== 'undefined') {
    window.THEME_CONFIG = THEME_CONFIG;
}

