# 🚀 Guide de Démarrage - Yooreed Event

## 📋 Prérequis

- ✅ Node.js (v18+) installé
- ✅ MongoDB installé et démarré
- ✅ Dépendances installées (`npm install` dans backend et frontend)

---

## 🔧 Configuration

### 1. Vérifier les fichiers .env

Les fichiers `.env` ont été créés automatiquement. Vérifiez qu'ils existent :

- ✅ `backend/.env`
- ✅ `frontend/.env`

### 2. Configurer MongoDB

**Option A - MongoDB Local :**
```bash
# Démarrer MongoDB (Windows)
net start MongoDB

# Ou vérifier qu'il est déjà démarré
```

**Option B - MongoDB Atlas (Cloud) :**
- Modifier `MONGODB_URI` dans `backend/.env` avec votre URI Atlas

### 3. Créer l'admin par défaut

```bash
cd backend
npm run create-admin
```

Cela créera un admin avec :
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Changez le mot de passe après la première connexion !**

---

## 🏃 Démarrer le Projet

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Le serveur backend démarrera sur `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Le frontend démarrera sur `http://localhost:3000`

---

## 🌐 Accès

### Frontend Public
- **URL:** http://localhost:3000
- **Pages disponibles:**
  - `/` - Page d'accueil
  - `/catalogue` - Catalogue produits
  - `/produit/:id` - Page produit
  - `/panier` - Panier
  - `/commande` - Formulaire de commande
  - `/devis` - Formulaire de devis
  - `/contact` - Page contact

### Dashboard Admin
- **URL:** http://localhost:3000/admin/login
- **Identifiants par défaut:**
  - Username: `admin`
  - Password: `admin123`

**Pages admin disponibles:**
- `/admin` - Dashboard avec statistiques
- `/admin/products` - Gestion des produits (CRUD complet)
- `/admin/categories` - Gestion des catégories (CRUD complet)
- `/admin/orders` - Gestion des commandes (liste + détails)
- `/admin/quotes` - Gestion des devis (liste + détails)

---

## ✅ Vérification

### Backend
1. Ouvrir http://localhost:5000/api/health
2. Devrait retourner: `{"status":"OK","message":"Yooreed Event API is running"}`

### Frontend
1. Ouvrir http://localhost:3000
2. La page d'accueil devrait s'afficher

### Admin
1. Aller sur http://localhost:3000/admin/login
2. Se connecter avec `admin` / `admin123`
3. Le dashboard devrait s'afficher

---

## 🐛 Dépannage

### Erreur de connexion MongoDB
```
❌ MongoDB connection error
```
**Solution:** Vérifier que MongoDB est démarré et que l'URI dans `.env` est correcte

### Erreur CORS
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:3000' has been blocked by CORS
```
**Solution:** Vérifier que `FRONTEND_URL=http://localhost:3000` dans `backend/.env`

### Erreur 401 Unauthorized
```
Token d'authentification manquant
```
**Solution:** Se reconnecter via `/admin/login`

### Port déjà utilisé
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Changer le PORT dans `backend/.env` ou arrêter le processus utilisant le port

---

## 📝 Notes Importantes

1. **MongoDB doit être démarré** avant de lancer le backend
2. **Les emails** nécessitent une configuration SMTP dans `backend/.env`
3. **L'upload de fichiers** sera implémenté dans une prochaine version
4. **Changez le JWT_SECRET** en production !

---

## 🎯 Prochaines Étapes

1. ✅ Démarrer MongoDB
2. ✅ Créer l'admin par défaut (`npm run create-admin`)
3. ✅ Démarrer le backend (`npm run dev`)
4. ✅ Démarrer le frontend (`npm run dev`)
5. ✅ Tester les fonctionnalités
6. ✅ Créer des produits et catégories via le dashboard admin

---

**Bon développement ! 🚀**

