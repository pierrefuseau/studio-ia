# Studio IA - Application de Traitement d'Images Produits

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Studio Produit Marketing** est une application web française professionnelle pour le traitement d'images de produits et la génération de vidéos marketing. Transformez vos images produits en visuels marketing professionnels grâce à l'intelligence artificielle.

![Studio IA Banner](https://via.placeholder.com/1200x400/1e293b/ffffff?text=Studio+IA+-+Traitement+d%27Images+Professionnel)

## 🎯 Fonctionnalités

### ✨ Traitements d'Images

#### 1. **Détourage Studio**
- Packshot professionnel sur fond blanc
- Suppression automatique de l'arrière-plan
- Ajustement de l'ombre et de la netteté
- Badge: **Rapide**

#### 2. **Mise en situation Packaging**
- Intégration du packaging dans un environnement réaliste
- Environnements personnalisables (bureau moderne, nature, etc.)
- Éclairage naturel ou artificiel
- Badge: **Premium**

#### 3. **Mise en situation Produit Brut**
- Intégration du produit brut dans un environnement personnalisé
- Scènes sur mesure selon vos besoins
- Contrôle total de l'environnement
- Badge: **Nouveau**

#### 4. **Génération de Vidéos**
- Création de vidéos marketing à partir de vos images
- Format 16:9, durée 8 secondes
- Upload simple et rapide
- Badge: **Admin**

### 🆕 Nouvelles Fonctionnalités (Phase 1)

#### 📜 **Historique Persistant**
- Sauvegarde automatique de tous vos traitements
- Stockage local avec localStorage (jusqu'à 100 items)
- Accès rapide à vos traitements précédents
- Persistance après rechargement de la page

#### 🖼️ **Galerie Complète**
- Interface intuitive avec grille de thumbnails
- **Recherche** : Trouvez vos produits par nom ou description
- **Filtres** : Par statut (Tous, Terminés, En cours, Échoués, En attente)
- **Panneau de détails** : Informations complètes sur chaque traitement
- **Actions** : Télécharger résultats, Supprimer items
- Statistiques en temps réel

#### ✅ **Validation d'Images**
- Vérification automatique avant upload :
  - **Format** : JPEG, PNG, WEBP
  - **Taille** : Maximum 10 MB
  - **Dimensions** : 500px - 8000px
  - **Ratio** : Recommandations de ratio d'aspect
- Messages d'erreur détaillés en français
- Avertissements et suggestions d'amélioration
- Compression automatique si nécessaire

#### ⏱️ **Suivi en Temps Réel**
- Barre de progression visuelle
- Étapes détaillées :
  - 🕐 File d'attente
  - 📤 Upload
  - 👁️ Analyse
  - 🔧 Traitement
  - ✨ Rendu
- Temps écoulé et temps restant estimé
- Pourcentage de progression précis

#### 🧭 **Navigation Améliorée**
- Bouton **Accueil** pour retour rapide
- Bouton **Historique** avec badge de compteur
- Interface cohérente et intuitive
- Transitions fluides entre les pages

## 🚀 Installation

### Prérequis

- **Node.js** 18+ (recommandé: 20+)
- **npm** ou **yarn**
- Un navigateur moderne (Chrome, Firefox, Safari, Edge)

### Installation des dépendances

```bash
# Cloner le repository
git clone https://github.com/pierrefuseau/studio-ia.git
cd studio-ia

# Installer les dépendances
npm install
```

## 💻 Utilisation

### Développement local

```bash
# Démarrer le serveur de développement
npm run dev

# L'application sera disponible sur http://localhost:5173/
```

### Build de production

```bash
# Créer un build optimisé
npm run build

# Prévisualiser le build de production
npm run preview
```

### Linter

```bash
# Vérifier le code avec ESLint
npm run lint
```

## 🌐 Déploiement

L'application est configurée pour un déploiement automatique sur **GitHub Pages**.

### Déploiement automatique

À chaque push sur `main` ou `master`, l'application est automatiquement déployée via GitHub Actions.

### Déploiement manuel

```bash
# Option 1 : Via npm
npm run deploy

# Option 2 : Via script bash
./deploy.sh
```

### URL de production

```
https://pierrefuseau.github.io/studio-ia/
```

📖 **Documentation complète** : Consultez [DEPLOIEMENT.md](./DEPLOIEMENT.md) pour les instructions détaillées.

## 🏗️ Architecture Technique

### Stack Technologique

- **Frontend** : React 18.3.1 avec TypeScript 5.5.3
- **Build Tool** : Vite 5.4.2 (HMR ultra-rapide)
- **Styling** : Tailwind CSS 3.4.1
- **State Management** : React Context API avec useReducer
- **Icons** : Lucide React 0.344.0
- **File Upload** : react-dropzone 14.3.8
- **Code Quality** : ESLint 9.9.1 avec TypeScript ESLint

### Structure du Projet

```
studio-ia/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions pour déploiement
├── public/
│   └── .nojekyll              # Configuration GitHub Pages
├── src/
│   ├── components/
│   │   ├── ui/                # Composants UI réutilisables
│   │   ├── Gallery.tsx        # ✨ Galerie d'historique
│   │   ├── Header.tsx         # En-tête avec navigation
│   │   ├── HeroSection.tsx    # Page d'accueil
│   │   ├── ImageValidationPanel.tsx  # ✨ Panel de validation
│   │   ├── ProcessingProgressPanel.tsx # ✨ Suivi progression
│   │   └── ...                # Autres composants
│   ├── contexts/
│   │   └── AppContext.tsx     # Gestion d'état globale
│   ├── services/
│   │   ├── errorHandler.ts    # Gestion des erreurs
│   │   ├── historyStorage.ts  # ✨ Service d'historique
│   │   ├── imageValidation.ts # ✨ Service de validation
│   │   └── webhookService.ts  # Intégration n8n webhook
│   ├── types/
│   │   └── index.ts           # Définitions TypeScript
│   ├── utils/
│   │   └── cn.ts              # Utilitaires
│   ├── App.tsx                # Composant racine
│   └── main.tsx               # Point d'entrée
├── CLAUDE.md                  # Documentation pour IA
├── DEPLOIEMENT.md            # Guide de déploiement
├── deploy.sh                 # Script de déploiement
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### Patterns & Conventions

#### State Management

L'application utilise React Context avec useReducer pour la gestion d'état :

```typescript
// Exemple d'utilisation
const { state, dispatch } = useApp();

dispatch({
  type: 'ADD_HISTORY_ITEM',
  payload: historyItem
});
```

#### Validation d'Images

```typescript
import { imageValidator } from './services/imageValidation';

const validation = await imageValidator.validateImage(file);
if (validation.isValid) {
  // Continuer le traitement
}
```

#### Stockage d'Historique

```typescript
import { historyStorage } from './services/historyStorage';

// Ajouter un item
historyStorage.addHistoryItem(item);

// Récupérer l'historique
const history = historyStorage.getHistory();
```

## 🎨 Interface Utilisateur

### Design System

- **Palette de couleurs** : Tons de gris personnalisés (50-900)
- **Typographie** : -apple-system, BlinkMacSystemFont, Inter, Segoe UI
- **Icons** : Lucide React (plus de 1000 icônes)
- **Animations** : Transitions fluides avec Tailwind CSS
- **Responsive** : Design adaptatif mobile-first

### Thème

- Mode clair par défaut
- Persistance du thème dans localStorage
- Support du mode sombre (à venir)

## 🔗 Intégration n8n

L'application communique avec n8n pour le traitement des images :

**Webhook URL** : `https://n8n.srv778298.hstgr.cloud/webhook/fb09047a-1a80-44e7-833a-99fe0eda3266`

### Structure du Payload

```json
{
  "client": "Studio Produit",
  "productName": "Nom du produit",
  "productDescription": "Description",
  "treatmentType": "background-removal",
  "imagesBase64": ["base64_string_1", "base64_string_2"],
  "originalFileNames": ["image1.jpg", "image2.jpg"],
  "situationDescription": "Description de la situation"
}
```

**Note** : Les images sont encodées en base64 pur (sans le préfixe `data:image/...;base64,`)

## 🧪 Tests & Qualité

### Linting

```bash
npm run lint
```

Configuration ESLint avec :
- TypeScript ESLint
- React Hooks rules
- React Refresh plugin

### Futures améliorations

- [ ] Tests unitaires (Vitest)
- [ ] Tests de composants (React Testing Library)
- [ ] Tests E2E (Playwright)
- [ ] Coverage reports

## 🔐 Sécurité

### Pratiques actuelles

- ✅ Validation d'entrées côté client
- ✅ Échappement automatique de React (XSS protection)
- ✅ HTTPS sur GitHub Pages
- ✅ Pas de secrets dans le code

### À implémenter

- [ ] Authentification utilisateur
- [ ] Autorisation basée sur les rôles
- [ ] Rate limiting
- [ ] CSP headers
- [ ] CORS configuration

## 📈 Performance

### Optimisations

- **Code splitting** : Vendor et Lucide séparés
- **Tree shaking** : Code inutilisé supprimé
- **Minification** : JS/CSS minifiés en production
- **Lazy loading** : Chargement différé des composants
- **Memoization** : Optimisation des re-renders

### Métriques

- **Build size** : ~500 KB (gzippé)
- **First Load** : < 2 secondes
- **Time to Interactive** : < 3 secondes

## 🗺️ Roadmap

### Phase 1 - MVP Amélioré ✅ (Terminé)
- [x] Historique persistant
- [x] Galerie avec filtres
- [x] Validation d'images
- [x] Suivi en temps réel

### Phase 2 - Scale (Prochainement)
- [ ] Authentification utilisateur
- [ ] Traitement par lots (batch)
- [ ] Templates d'environnements
- [ ] Export multi-formats

### Phase 3 - Premium (Futur)
- [ ] Vidéo avancée
- [ ] Intégrations e-commerce
- [ ] Collaboration équipe
- [ ] API publique

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. **Fork** le projet
2. **Créez** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Pushez** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

### Guidelines

- Utilisez TypeScript avec typage strict
- Suivez les conventions de nommage existantes
- Ajoutez des commentaires en français pour le domaine métier
- Testez vos changements avant de soumettre
- Mettez à jour la documentation si nécessaire

## 📄 License

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- **Pierre Fuseau** - [GitHub](https://github.com/pierrefuseau)
- **Développé avec l'assistance de Claude (Anthropic)**

## 🙏 Remerciements

- [React](https://reactjs.org/) pour le framework
- [Vite](https://vitejs.dev/) pour le build tool ultra-rapide
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Lucide](https://lucide.dev/) pour les icônes magnifiques
- [n8n](https://n8n.io/) pour l'automatisation

## 📞 Support

Pour toute question ou problème :

1. Consultez la [documentation](./CLAUDE.md)
2. Consultez le [guide de déploiement](./DEPLOIEMENT.md)
3. Ouvrez une [issue](https://github.com/pierrefuseau/studio-ia/issues)
4. Contactez l'équipe de développement

---

**Fait avec ❤️ en France** 🇫🇷

Dernière mise à jour : Novembre 2025
