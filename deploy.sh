#!/usr/bin/env bash

# Script de déploiement manuel sur GitHub Pages
# Usage: ./deploy.sh

set -e

echo "🚀 Déploiement de Studio IA sur GitHub Pages"
echo ""

# Vérifier si on est sur la bonne branche
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Branche actuelle: $CURRENT_BRANCH"

# Sauvegarder les changements non commités
if [[ -n $(git status -s) ]]; then
    echo "⚠️  Changements non commités détectés"
    read -p "Voulez-vous continuer? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Déploiement annulé"
        exit 1
    fi
fi

# Build du projet
echo ""
echo "🔨 Build du projet..."
export GITHUB_ACTIONS=true
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Erreur: Le dossier dist n'existe pas"
    exit 1
fi

echo "✅ Build terminé"
echo ""

# Créer le fichier .nojekyll
touch dist/.nojekyll

# Déployer sur gh-pages
echo "📤 Déploiement sur la branche gh-pages..."

# Installer gh-pages si nécessaire
if ! npm list -g gh-pages >/dev/null 2>&1; then
    echo "📦 Installation de gh-pages..."
    npm install -g gh-pages
fi

# Déployer
npx gh-pages -d dist -m "Deploy from $CURRENT_BRANCH"

echo ""
echo "✅ Déploiement terminé!"
echo "🌐 Votre application sera disponible à:"
echo "   https://pierrefuseau.github.io/studio-ia/"
echo ""
echo "⏳ Cela peut prendre quelques minutes pour que les changements soient visibles"
