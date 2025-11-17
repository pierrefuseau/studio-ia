# Guide de Déploiement - Studio IA

Ce guide explique comment déployer l'application Studio IA sur GitHub Pages.

## 🚀 Déploiement Automatique (Recommandé)

Le déploiement automatique est configuré via **GitHub Actions**. À chaque push sur la branche `main` ou `master`, l'application est automatiquement déployée.

### Configuration initiale

1. **Activer GitHub Pages** dans votre repository :
   - Allez dans `Settings` → `Pages`
   - Sous "Source", sélectionnez `GitHub Actions`
   - Cliquez sur `Save`

2. **Pusher votre code** :
   ```bash
   git push origin main
   ```

3. **Vérifier le déploiement** :
   - Allez dans l'onglet `Actions` de votre repository
   - Vous verrez le workflow "Deploy to GitHub Pages" en cours
   - Une fois terminé (icône verte ✓), votre site est en ligne !

4. **Accéder à votre application** :
   ```
   https://pierrefuseau.github.io/studio-ia/
   ```

### Workflow automatique

Le fichier `.github/workflows/deploy.yml` configure le déploiement automatique :

- **Déclencheurs** : Push sur main/master ou déclenchement manuel
- **Étapes** :
  1. Checkout du code
  2. Installation de Node.js 20
  3. Installation des dépendances (`npm ci`)
  4. Build du projet (`npm run build`)
  5. Déploiement sur GitHub Pages

## 🛠️ Déploiement Manuel

Si vous préférez déployer manuellement :

### Méthode 1 : Script Bash

```bash
./deploy.sh
```

Le script `deploy.sh` :
- Build le projet avec la configuration GitHub Pages
- Déploie sur la branche `gh-pages`
- Affiche l'URL de l'application

### Méthode 2 : Commande npm

```bash
npm run deploy
```

Cette commande :
1. Build le projet (`predeploy`)
2. Déploie le dossier `dist` sur la branche `gh-pages`

### Méthode 3 : Build et déploiement séparés

```bash
# Build
npm run build

# Déployer manuellement
npx gh-pages -d dist
```

## 📋 Prérequis

- **Node.js** : Version 18 ou supérieure
- **npm** : Installé avec Node.js
- **gh-pages** : Installé automatiquement avec `npm install`

## 🔧 Configuration

### Vite Configuration (`vite.config.ts`)

```typescript
base: process.env.GITHUB_ACTIONS ? '/studio-ia/' : '/'
```

Cette configuration :
- En production (GitHub Actions) : utilise `/studio-ia/` comme base URL
- En développement : utilise `/` pour localhost

### Variables d'environnement

Le build de production utilise automatiquement :
- `GITHUB_ACTIONS=true` pour activer la base URL GitHub Pages
- Pas besoin de fichier `.env` pour le déploiement

## 🌐 URLs

- **Production** : https://pierrefuseau.github.io/studio-ia/
- **Développement** : http://localhost:5173/

## 🐛 Dépannage

### Le site ne s'affiche pas correctement

1. **Vérifier la base URL** :
   - La configuration Vite doit utiliser `/studio-ia/`
   - Vérifier que `GITHUB_ACTIONS=true` pendant le build

2. **Vider le cache** :
   ```bash
   rm -rf dist
   npm run build
   ```

3. **Vérifier GitHub Pages** :
   - Settings → Pages doit pointer vers "GitHub Actions"
   - Le workflow doit avoir réussi (icône verte)

### Erreur 404 sur les assets

- Problème de base URL
- Solution : Vérifier `vite.config.ts` ligne `base:`

### Le déploiement échoue

1. **Vérifier les permissions** :
   - Le workflow nécessite les permissions `pages: write` et `id-token: write`
   - Vérifier dans Settings → Actions → General → Workflow permissions

2. **Vérifier les dépendances** :
   ```bash
   npm ci
   npm run build
   ```

3. **Consulter les logs** :
   - Onglet Actions → Cliquer sur le workflow échoué
   - Lire les logs pour identifier l'erreur

## 📦 Structure de Déploiement

```
studio-ia/
├── .github/
│   └── workflows/
│       └── deploy.yml       # Workflow GitHub Actions
├── dist/                    # Build de production (généré)
├── public/
│   └── .nojekyll           # Désactive Jekyll sur GitHub Pages
├── deploy.sh               # Script de déploiement manuel
├── vite.config.ts          # Configuration Vite avec base URL
└── package.json            # Scripts de déploiement
```

## ⚡ Optimisations

Le build de production inclut :

- **Code splitting** : Séparation vendor/lucide pour cache optimal
- **Minification** : Code JavaScript/CSS minifié
- **Tree shaking** : Suppression du code inutilisé
- **Compression** : Assets optimisés pour le web

## 🔐 Sécurité

- **Pas de secrets** : Aucune clé API dans le code front-end
- **HTTPS** : GitHub Pages utilise HTTPS par défaut
- **CSP** : Considérer ajouter Content Security Policy headers

## 📊 Monitoring

Après le déploiement :

1. **Vérifier le statut** :
   - Onglet Actions → Voir le dernier workflow
   - Icône verte ✓ = Succès

2. **Tester l'application** :
   - Ouvrir https://pierrefuseau.github.io/studio-ia/
   - Tester les fonctionnalités principales
   - Vérifier la console navigateur (F12)

3. **Analytics** (optionnel) :
   - Ajouter Google Analytics ou Plausible
   - Suivre l'utilisation et les erreurs

## 🔄 Mises à jour

Pour déployer une nouvelle version :

1. **Développer en local** :
   ```bash
   npm run dev
   ```

2. **Tester les changements** :
   - Vérifier que tout fonctionne
   - Tester sur différents navigateurs

3. **Commiter et pusher** :
   ```bash
   git add .
   git commit -m "Description des changements"
   git push origin main
   ```

4. **Attendre le déploiement automatique** :
   - Le workflow GitHub Actions se lance automatiquement
   - Durée : environ 2-3 minutes
   - Notification par email si échec

## 📞 Support

En cas de problème :

1. Consulter les logs GitHub Actions
2. Vérifier la documentation Vite : https://vitejs.dev
3. Vérifier la documentation GitHub Pages : https://pages.github.com

---

**Dernière mise à jour** : 2025-11-17
