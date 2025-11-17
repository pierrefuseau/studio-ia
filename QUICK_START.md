# 🚀 Guide de Démarrage Rapide - Déploiement Studio IA

## ⚡ Déploiement en 5 Minutes

Suivez ces étapes **dans l'ordre** pour déployer votre application.

---

## 📋 Étape 1 : Créer une Pull Request

### 1.1 Aller sur GitHub

Ouvrez cette URL dans votre navigateur :

```
https://github.com/pierrefuseau/studio-ia/compare/claude/claude-md-mi3mxzmoty19202o-01AXiYGmigD9JAsAEugiYWuz
```

### 1.2 Créer la PR

1. Cliquez sur le bouton vert **"Create pull request"**
2. **Titre** : `🚀 Déploiement Phase 1 + Configuration GitHub Pages`
3. **Description** : Copiez-collez ceci :

```markdown
## 🚀 Déploiement Phase 1 + Configuration

### ✨ Nouvelles Fonctionnalités
- ✅ Historique persistant avec localStorage
- ✅ Galerie avec filtres et recherche
- ✅ Validation d'images avant upload
- ✅ Suivi en temps réel du traitement
- ✅ Navigation améliorée avec badges

### 📦 Configuration
- ✅ Workflow GitHub Actions automatique
- ✅ Configuration Vite pour GitHub Pages
- ✅ Scripts de déploiement (npm run deploy)
- ✅ Documentation complète (README + guides)

### 📊 Build
- Taille : 313 kB (88 kB gzippé)
- Status : ✅ Testé et validé
- Prêt pour production

**URL** : https://pierrefuseau.github.io/studio-ia/
```

4. Cliquez **"Create pull request"** à nouveau

### 1.3 Merger la PR

1. Attendez quelques secondes
2. Cliquez sur le bouton vert **"Merge pull request"**
3. Cliquez **"Confirm merge"**

✅ **Terminé !** La branche est maintenant sur `main`

---

## ⚙️ Étape 2 : Activer GitHub Pages

### 2.1 Aller dans Settings

Ouvrez cette URL :

```
https://github.com/pierrefuseau/studio-ia/settings/pages
```

### 2.2 Configurer GitHub Pages

1. Sous **"Build and deployment"**
2. Section **"Source"** :
   - Sélectionnez **"GitHub Actions"** dans le menu déroulant
3. La page se sauvegarde automatiquement

Vous devriez voir un message :

```
✅ Your site is ready to be published
```

✅ **Terminé !** GitHub Pages est activé

---

## 🎬 Étape 3 : Lancer le Déploiement

### Option A : Automatique (Recommandé)

Le déploiement se lance **automatiquement** après le merge !

### Option B : Manuel (si besoin)

1. Allez sur : https://github.com/pierrefuseau/studio-ia/actions
2. Cliquez sur **"Deploy to GitHub Pages"** (à gauche)
3. Cliquez sur le bouton **"Run workflow"** (à droite)
4. Sélectionnez la branche **"main"**
5. Cliquez **"Run workflow"** (bouton vert)

---

## ⏱️ Étape 4 : Attendre le Déploiement

### 4.1 Suivre la Progression

Allez sur :

```
https://github.com/pierrefuseau/studio-ia/actions
```

Vous verrez :

- ⏳ **Orange** : Déploiement en cours (2-3 minutes)
- ✅ **Vert** : Déploiement réussi !
- ❌ **Rouge** : Erreur (voir les logs)

### 4.2 Vérifier le Build

Cliquez sur le workflow en cours pour voir :

```
Build → Upload → Deploy → ✅
```

✅ **Terminé !** Votre application est déployée

---

## 🌐 Étape 5 : Accéder à l'Application

### 5.1 Ouvrir l'URL

Ouvrez cette URL dans votre navigateur :

```
https://pierrefuseau.github.io/studio-ia/
```

### 5.2 Vérifier le Fonctionnement

✅ **Checklist** :
- [ ] La page d'accueil s'affiche
- [ ] Les 4 traitements sont visibles
- [ ] Le bouton "Historique" est dans le header
- [ ] Vous pouvez uploader une image
- [ ] La validation d'images fonctionne
- [ ] Pas d'erreurs dans la console (F12)

---

## 🎉 Félicitations !

Votre application **Studio IA** est maintenant en ligne !

### 📱 Partager

Partagez cette URL avec votre équipe :

```
🌐 https://pierrefuseau.github.io/studio-ia/
```

---

## 🔧 Dépannage Rapide

### Problème : La page affiche une erreur 404

**Solution** :
1. Attendez 5-10 minutes (propagation DNS)
2. Videz le cache : `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)
3. Vérifiez que GitHub Pages est bien en mode "GitHub Actions"

### Problème : Les assets ne se chargent pas

**Solution** :
1. Ouvrez la console (F12)
2. Cherchez les erreurs 404
3. Vérifiez que la base URL est bien `/studio-ia/` dans vite.config.ts

### Problème : Le workflow échoue

**Solution** :
1. Allez sur Actions → Cliquez sur le workflow en erreur
2. Lisez les logs pour identifier l'erreur
3. Vérifiez les permissions dans Settings → Actions → General

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- **README.md** : Vue d'ensemble du projet
- **DEPLOIEMENT.md** : Guide de déploiement complet
- **DEPLOYMENT_SUMMARY.md** : Récapitulatif technique
- **CLAUDE.md** : Documentation développeurs

---

## 🆘 Besoin d'Aide ?

1. Consultez [DEPLOIEMENT.md](./DEPLOIEMENT.md)
2. Vérifiez les [issues](https://github.com/pierrefuseau/studio-ia/issues)
3. Créez une nouvelle issue avec les détails

---

## ⏭️ Prochaines Étapes

Une fois déployé, vous pouvez :

1. **Tester** toutes les fonctionnalités
2. **Partager** l'URL avec votre équipe
3. **Planifier** la Phase 2 (voir DEPLOYMENT_SUMMARY.md)
4. **Mettre à jour** : Just push to main, it auto-deploys !

---

**Temps estimé** : 5 minutes
**Difficulté** : ⭐ Facile
**Prérequis** : Compte GitHub avec accès au repository

---

**Bonne chance ! 🚀**
