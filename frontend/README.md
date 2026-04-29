# Yooreed Events — Frontend v2.0

> Plateforme de catalogue événementiel premium — React 18 + Vite 5 + TypeScript + Tailwind CSS

---

## 🎯 Présentation

**Yooreed Events** est une plateforme B2B de location et scénographie événementielle basée à Sousse, Tunisie. Cette version 2.0 du frontend est une refonte complète axée sur :

- **Design dark futuriste** (palette navy + violet + cyan)
- **Catalogue structuré** avec filtres hiérarchiques, infinite scroll et mock data
- **Sécurité renforcée** (XSS, CSRF, obfuscation contacts, validation stricte)
- **Conformité RGPD** (cookie consent, pages légales)
- **Performance** (lazy loading, skeleton loaders, Intersection Observer)

---

## 🚀 Installation & Démarrage

### Prérequis

| Outil | Version minimale |
|-------|-----------------|
| Node.js | 18.x |
| npm | 9.x |

### Installation

```bash
# Cloner le projet
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
# → http://localhost:3000
```

### Build production

```bash
npm run build
# Sortie dans ./dist/
```

### Vérification TypeScript

```bash
npx tsc --noEmit
```

---

## 🏗️ Architecture du projet

```
frontend/src/
├── components/
│   ├── Header.tsx          # Header dark + mega-menu catalogue
│   ├── Footer.tsx          # Footer dark + contacts obfusqués
│   ├── CookieBanner.tsx    # Bandeau RGPD avec préférences granulaires
│   ├── ScrollToTop.tsx
│   └── admin/              # Composants panel admin
│
├── pages/
│   ├── Home.tsx            # Hero dark, stats animées, catégories, produits
│   ├── Catalogue.tsx       # Filtres hiérarchiques, infinite scroll, mock fallback
│   ├── Product.tsx         # Galerie lightbox, onglets, produits similaires
│   ├── Contact.tsx         # Formulaire sécurisé, validation, obfuscation
│   ├── Quote.tsx           # Demande de devis sécurisée
│   ├── PrivacyPolicy.tsx   # Politique de confidentialité RGPD
│   ├── CGU.tsx             # Conditions Générales d'Utilisation
│   └── admin/              # Pages administration
│
├── data/
│   ├── mockData.ts         # 12 produits démo + 4 catégories + sous-catégories
│   └── categoryTree.ts     # Arbre hiérarchique des catégories (méga-menu)
│
├── services/               # Appels API (productService, categoryService, etc.)
├── context/CartContext.tsx # État global du panier
├── hooks/useSeo.tsx        # Gestion dynamique des meta tags
├── types/index.ts          # Types TypeScript partagés
│
├── App.tsx                 # Router + routes publiques/admin
├── index.css               # Design system complet (dark theme)
└── main.tsx
```

---

## 🎨 Design System

### Palette de couleurs

| Token | Valeur | Usage |
|-------|--------|-------|
| `navy-900` | `#080C14` | Fond principal |
| `violet-500` | `#7C3AED` | Couleur primaire (CTAs, accents) |
| `cyber-400` | `#00D4FF` | Accents futuristes |
| `gold-500` | `#F5B544` | Prix, étoiles, highlights |
| `slate-400` | `#94a3b8` | Texte secondaire |

### Typographie

- **Police principale** : Inter (Google Fonts) — 300 à 900
- **Hiérarchie** : H1 → `section-title` (4xl-7xl bold), H2 → (`text-2xl font-bold`), body → (`text-sm/base`)

### Classes utilitaires clés

```css
.btn-primary       /* Bouton violet avec glow */
.btn-secondary     /* Bouton ghost outline violet */
.btn-cyber         /* Bouton gradient cyan→violet */
.card              /* Carte glassmorphism dark */
.glass-panel       /* Panel transparent dark */
.badge-soft        /* Badge violet subtil */
.badge-cyber       /* Badge cyan */
.skeleton          /* Loader shimmer */
.gradient-text     /* Texte dégradé violet→cyan */
.product-card      /* Carte produit avec hover glow */
.breadcrumb        /* Fil d'Ariane dark */
.section-label     /* Étiquette de section */
.section-title     /* Titre de section large */
.divider-cyber     /* Séparateur gradient */
.animate-on-scroll /* Animation déclenchée au scroll */
```

---

## 🛠️ Fonctionnalités principales

### Catalogue

- **Arbre hiérarchique** : 4 catégories principales + 13 sous-catégories
- **Filtrage temps réel** : sidebar desktop + drawer mobile
- **Recherche** : debounce 350ms + tolérance aux fautes (fuzzy match)
- **Tri** : 6 options (date, nom, prix × croissant/décroissant)
- **Infinite scroll** : Intersection Observer, pas de bouton "Suivant"
- **Mock data fallback** : 12 produits démo si l'API retourne 0 résultats
- **Chips de filtres actifs** : visualisation et suppression rapide
- **Skeleton loaders** : UX fluide lors du chargement

### Page Produit

- **Galerie lightbox** : navigation clavier (←/→/Escape)
- **Onglets** : Description / Fiche technique / Options & livraison
- **XSS** : `DOMPurify.sanitize()` sur `descriptionTechnique` HTML
- **Breadcrumb** dynamique : Accueil › Catalogue › [Catégorie] › [Produit]
- **Produits similaires** : section carreau 4 colonnes

### Formulaires sécurisés

| Formulaire | Mesures |
|-----------|---------|
| Contact | Validation regex, sanitisation XSS, rate limit 5s, obfuscation tel/email |
| Devis | Validation required, sanitisation, rate limit 3s, CSRF token, spinner |

---

## 🔒 Mesures de sécurité

### 1. Protection XSS

```typescript
// DOMPurify sur tout contenu HTML dynamique
import DOMPurify from 'dompurify';
const safe = DOMPurify.sanitize(product.descriptionTechnique);

// Sanitisation manuelle des inputs texte
const sanitizeText = (text: string) =>
  text.replace(/[<>]/g, '').replace(/javascript:/gi, '').trim();
```

### 2. Obfuscation des contacts

```typescript
// Email stocké en base64 — décodé uniquement au clic
onClick={() => {
  const em = atob('Y29udGFjdEBldmVudC55b29yZWVkLmNvbS50bg==');
  window.location.href = `mailto:${em}`;
}}

// Affichage via HTML entities (illisible pour les scrapers)
<span dangerouslySetInnerHTML={{ __html: 'contact&#64;event&#46;yooreed&#46;com&#46;tn' }} />
```

### 3. Rate Limiting côté client

```typescript
const [lastSubmit, setLastSubmit] = useState(0);
const now = Date.now();
if (now - lastSubmit < 5000) return; // Bloque les soumissions < 5s
setLastSubmit(now);
```

### 4. Token CSRF simulé

```tsx
<input type="hidden" name="_csrf" value={Math.random().toString(36).slice(2)} />
```

### 5. Validation stricte

```typescript
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone: string) => /^(\+216|00216)?[2-9]\d{7}$/.test(phone.replace(/\s/g, ''));
```

### 6. Conformité RGPD

- **Cookie banner** : accepter / refuser / préférences granulaires (analytics, marketing)
- **Persistance** : `localStorage` avec version et timestamp
- **Page** : `/politique-confidentialite` — droits, durées de conservation, cookies
- **Page** : `/cgu` — 10 articles complets

---

## 📦 Dépendances principales

| Package | Version | Usage |
|---------|---------|-------|
| `react` | 18.x | Framework UI |
| `react-router-dom` | 6.x | Routing SPA |
| `vite` | 5.x | Build tool |
| `tailwindcss` | 3.x | Styling |
| `typescript` | 5.x | Types |
| `dompurify` | 3.x | Sanitisation XSS |
| `axios` | 1.x | Appels API |

---

## 🗂️ Structure des catégories

```
📁 Audiovisuel & Scénographie
   ├── Écrans géants
   ├── Captation multi-cam
   ├── Régie vidéo
   └── Éclairage scénique

📁 Impression & Branding
   ├── Grand format
   ├── Signalétique
   ├── Roll-up & Banderoles
   └── Covering & Stands

📁 Supports Premium
   ├── Pupitres
   ├── Trophées
   └── Objets sur-mesure

📁 Équipes & Services
   ├── Accompagnement événementiel
   └── Équipe de production
```

> **Note** : Ces catégories sont définies dans `src/data/categoryTree.ts` (statique) et dans MongoDB via le panel admin. Le catalogue affiche les données API en priorité, et bascule sur les données mock si l'API retourne 0 résultats.

---

## 🌐 Routes publiques

| Route | Page |
|-------|------|
| `/` | Accueil |
| `/catalogue` | Catalogue avec filtres |
| `/catalogue?category=<slug>` | Catalogue filtré |
| `/produit/:id` | Détail produit |
| `/devis` | Demande de devis |
| `/panier` | Panier |
| `/commande` | Commande |
| `/contact` | Contact |
| `/services` | Services |
| `/services-evenementiels` | Équipe événementielle |
| `/politique-confidentialite` | Politique de confidentialité |
| `/cgu` | Conditions Générales d'Utilisation |

### Routes admin (authentifiées)

| Route | Page |
|-------|------|
| `/admin/login` | Connexion admin |
| `/admin/` | Dashboard |
| `/admin/products` | Gestion produits |
| `/admin/categories` | Gestion catégories |
| `/admin/orders` | Gestion commandes |
| `/admin/quotes` | Gestion devis |
| `/admin/event-services` | Gestion services événementiels |

---

## ⚡ Performance

- **Lazy loading** : images avec `loading="lazy"` 
- **Skeleton loaders** : pendant le fetch API
- **Infinite Scroll** : Intersection Observer (pas de re-render global)
- **Debounce** : 350ms sur la recherche
- **Google Fonts** : `preconnect` dans `index.html`
- **Vite** : code-splitting automatique par route

---

## 📞 Contact

**Yooreed Events**  
Novation City, Technopole de Sousse, Bâtiment 6000  
Sousse 4051, Tunisie  

*Pour les questions techniques, consultez la documentation ou ouvrez une issue.*

---

*Frontend v2.0 — Refonte complète 2025 — React 18 + Vite 5 + Tailwind CSS 3 + TypeScript*
