#!/usr/bin/env python3
"""
VALIDATE-INSTRUCTIONS.PY — Validateur Automatisé des Instructions Client (Phase 12)
===================================================================================
Ce script effectue un contrôle rigoureux de la cohérence, de la syntaxe, de la
sécurité et de la conformité des fichiers d'instructions :
- instructions/client-brief.json
- instructions/site-spec.json
- instructions/site-content.json
- instructions/missing-information.md
===================================================================================
"""

import os
import sys
import json
import re

ALLOWED_OFFERS = ['essential', 'autonomous']
FORBIDDEN_SECRET_PATTERNS = [
    r'password\s*[:=]\s*["\'][^"\']+["\']',
    r'private_key',
    r'secret_key',
    r'api_secret',
    r'bearer\s+[a-zA-Z0-9_\-\.]{20,}',
    r'BEGIN PRIVATE KEY'
]

class InstructionsValidator:
    def __init__(self, base_dir=None):
        if base_dir:
            self.instructions_dir = os.path.join(base_dir, 'instructions') if not base_dir.endswith('instructions') else base_dir
        elif os.path.exists('instructions'):
            self.instructions_dir = 'instructions'
        elif os.path.exists(os.path.join('template', 'instructions')):
            self.instructions_dir = os.path.join('template', 'instructions')
        else:
            self.instructions_dir = 'instructions'

        self.errors = []
        self.warnings = []
        self.info = []

    def log_error(self, code, message, file_path=''):
        self.errors.append({'code': code, 'message': message, 'file': file_path, 'severity': 'BLOQUANT'})

    def log_warning(self, code, message, file_path=''):
        self.warnings.append({'code': code, 'message': message, 'file': file_path, 'severity': 'AVERTISSEMENT'})

    def log_info(self, message):
        self.info.append(message)

    def load_json(self, filename):
        path = os.path.join(self.instructions_dir, filename)
        if not os.path.exists(path):
            self.log_error('FILE_NOT_FOUND', f'Le fichier requis "{filename}" est introuvable.', path)
            return None
        try:
            with open(path, 'r', encoding='utf-8') as f:
                raw = f.read()
                if not raw.strip():
                    self.log_error('EMPTY_FILE', f'Le fichier "{filename}" est vide.', path)
                    return None
                
                # Check for secrets
                for pat in FORBIDDEN_SECRET_PATTERNS:
                    if re.search(pat, raw, re.IGNORECASE):
                        self.log_error('FORBIDDEN_SECRET', f'Présence de donnée sensible ou mot de passe détectée dans "{filename}".', path)

                return json.loads(raw)
        except json.JSONDecodeError as err:
            self.log_error('JSON_SYNTAX_ERROR', f'Erreur de syntaxe JSON dans "{filename}": {err}', path)
            return None
        except Exception as err:
            self.log_error('FILE_READ_ERROR', f'Impossible de lire "{filename}": {err}', path)
            return None

    def validate_all(self):
        self.errors = []
        self.warnings = []
        self.info = []

        # 1. Chargement des fichiers
        brief = self.load_json('client-brief.json')
        spec = self.load_json('site-spec.json')
        content = self.load_json('site-content.json')
        missing_path = os.path.join(self.instructions_dir, 'missing-information.md')

        if not os.path.exists(missing_path):
            self.log_error('FILE_NOT_FOUND', 'Le fichier "missing-information.md" est introuvable.', missing_path)
        else:
            with open(missing_path, 'r', encoding='utf-8') as f:
                missing_content = f.read()
                if 'Statut : BLOQUANT' in missing_content or '| **BLOQUANT** |' in missing_content:
                    self.log_error('BLOCKING_INFORMATION', 'Le registre "missing-information.md" contient un élément non résolu bloquant le Prompt 2.', missing_path)

        if not brief or not spec or not content:
            return False

        # 2. Validation de client-brief.json
        if not brief.get('businessName'):
            self.log_error('BRIEF_MISSING_NAME', 'Le champ "businessName" est obligatoire dans client-brief.json.')
        if not brief.get('selectedOffer') or brief.get('selectedOffer') not in ALLOWED_OFFERS:
            self.log_error('INVALID_OFFER', f'Offre invalide dans client-brief.json: "{brief.get("selectedOffer")}". Choix: {ALLOWED_OFFERS}')

        # 3. Validation de site-spec.json (Source de vérité technique)
        selected_offer = spec.get('selectedOffer')
        if not selected_offer or selected_offer not in ALLOWED_OFFERS:
            self.log_error('SPEC_INVALID_OFFER', f'Offre invalide dans site-spec.json: "{selected_offer}". Choix autorisés: {ALLOWED_OFFERS}')
        
        # Cohérence de l'offre entre brief et spec
        if brief.get('selectedOffer') and selected_offer and brief.get('selectedOffer') != selected_offer:
            self.log_warning('OFFER_MISMATCH', f'Offre divergente : brief="{brief.get("selectedOffer")}" vs spec="{selected_offer}". La valeur de site-spec.json sera retenue.')

        # Règles strictes pour l'offre Essentiel
        if selected_offer == 'essential':
            features = spec.get('enabledFeatures', {})
            if features.get('adminAuth') or features.get('adminDashboard') or features.get('firebaseIntegration'):
                self.log_error('ESSENTIAL_FORBIDDEN_FEATURE', 'Une fonctionnalité Autonome/Firebase/Admin est activée alors que l\'offre est "essential".')
            if spec.get('adminRoutes') and len(spec.get('adminRoutes')) > 0:
                self.log_error('ESSENTIAL_ADMIN_ROUTE', 'Des routes administratives sont déclarées pour une offre "essential".')

        # 4. Validation de site-content.json
        for key in ['identity', 'meta', 'hero', 'about', 'banner', 'looks', 'gallery', 'beforeAfter', 'prestations', 'contact', 'footer']:
            if key not in content:
                self.log_error('CONTENT_MISSING_SECTION', f'Section requise manquante dans site-content.json: "{key}".')

        # Vérification des identifiants stables et uniques
        for col_name in ['looks', 'gallery', 'beforeAfter', 'prestations']:
            items = content.get(col_name, [])
            if not isinstance(items, list):
                self.log_error('INVALID_COLLECTION_TYPE', f'La collection "{col_name}" doit être un tableau.')
                continue
            seen_ids = set()
            for idx, item in enumerate(items):
                item_id = item.get('id')
                if not item_id:
                    self.log_error('MISSING_ID', f'Identifiant manquant dans {col_name}[{idx}].')
                elif item_id in seen_ids:
                    self.log_error('DUPLICATE_ID', f'Identifiant dupliqué "{item_id}" dans {col_name}.')
                else:
                    seen_ids.add(item_id)

        # 5. Cohérence Sections Spec vs Content
        enabled_sections = spec.get('enabledSections', {})
        for sec_name, is_enabled in enabled_sections.items():
            if is_enabled and sec_name not in content:
                self.log_error('ENABLED_SECTION_NO_CONTENT', f'Section "{sec_name}" activée dans site-spec.json mais absente de site-content.json.')

        return len(self.errors) == 0

    def print_report(self):
        print('===========================================================')
        print('  RAPPORT DE VALIDATION DES INSTRUCTIONS CLIENT (PHASE 12)')
        print('===========================================================')
        print(f'Erreurs bloquantes : {len(self.errors)}')
        print(f'Avertissements     : {len(self.warnings)}')
        print('-----------------------------------------------------------')

        for err in self.errors:
            print(f'[FAIL] [{err["code"]}] {err["message"]}')

        for warn in self.warnings:
            print(f'[WARN] [{warn["code"]}] {warn["message"]}')

        if len(self.errors) == 0:
            print('\n[PASS] TOUS LES CONTROLES SONT PASSES AVEC SUCCES ! (100% VALIDE)')
        print('===========================================================')


if __name__ == '__main__':
    validator = InstructionsValidator()
    is_valid = validator.validate_all()
    validator.print_report()
    sys.exit(0 if is_valid else 1)
