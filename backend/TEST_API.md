# Guide de Test de l'API - Yooreed Event

## 🔗 URL de base

Remplacez `VOTRE-PROJET` par votre nom de projet Vercel :
```
https://api-yooreed-e-commerce.vercel.app
```
ou
```
https://votre-projet.vercel.app
```

## 📋 Endpoints de Test

### 1. Health Check (Vérifier que l'API fonctionne)

**GET** `/api/health`

**Dans le navigateur :**
```
https://api-yooreed-e-commerce.vercel.app/api/health
```

**Avec curl :**
```bash
curl https://api-yooreed-e-commerce.vercel.app/api/health
```

**Réponse attendue :**
```json
{
  "status": "OK",
  "message": "Yooreed Event API is running"
}
```

---

### 2. Liste de tous les produits

**GET** `/api/products`

**Dans le navigateur :**
```
https://api-yooreed-e-commerce.vercel.app/api/products
```

**Avec curl :**
```bash
curl https://api-yooreed-e-commerce.vercel.app/api/products
```

**Avec PowerShell (Windows) :**
```powershell
Invoke-RestMethod -Uri "https://api-yooreed-e-commerce.vercel.app/api/products" -Method Get
```

**Réponse attendue :**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Nom du produit",
      "description": "Description",
      "price": 100,
      "category": "...",
      "images": [...],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "count": 1
}
```

---

### 3. Produit par ID

**GET** `/api/products/:id`

**Exemple :**
```
https://api-yooreed-e-commerce.vercel.app/api/products/507f1f77bcf86cd799439011
```

---

### 4. Produits par catégorie

**GET** `/api/products/category/:category`

**Exemple :**
```
https://api-yooreed-e-commerce.vercel.app/api/products/category/impression
```

---

### 5. Liste des catégories

**GET** `/api/categories`

**Dans le navigateur :**
```
https://api-yooreed-e-commerce.vercel.app/api/categories
```

---

## 🧪 Tester avec différents outils

### Option 1 : Navigateur (le plus simple)

1. Ouvrez votre navigateur
2. Allez sur : `https://api-yooreed-e-commerce.vercel.app/api/products`
3. Vous devriez voir la liste des produits en JSON

### Option 2 : PowerShell (Windows)

```powershell
# Liste des produits
$response = Invoke-RestMethod -Uri "https://api-yooreed-e-commerce.vercel.app/api/products" -Method Get
$response | ConvertTo-Json -Depth 10
```

### Option 3 : curl (tous systèmes)

```bash
# Liste des produits
curl https://api-yooreed-e-commerce.vercel.app/api/products

# Avec formatage JSON (si jq est installé)
curl https://api-yooreed-e-commerce.vercel.app/api/products | jq
```

### Option 4 : Postman / Insomnia

1. Créez une nouvelle requête GET
2. URL : `https://api-yooreed-e-commerce.vercel.app/api/products`
3. Cliquez sur "Send"

### Option 5 : JavaScript (dans la console du navigateur)

```javascript
fetch('https://api-yooreed-e-commerce.vercel.app/api/products')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

## 🔍 Dépannage

### Si vous obtenez une erreur 500

1. Vérifiez les **logs de runtime** dans Vercel :
   - Allez dans votre projet Vercel
   - Onglet "Functions"
   - Cliquez sur la fonction qui a échoué
   - Consultez les logs

2. Vérifiez les **variables d'environnement** :
   - `MONGODB_URI` doit être configurée
   - `FRONTEND_URL` doit être configurée
   - `JWT_SECRET` doit être configurée

### Si vous obtenez CORS error

Vérifiez que `FRONTEND_URL` dans Vercel correspond à l'URL depuis laquelle vous testez.

### Si vous obtenez "Route not found"

Vérifiez que l'URL est correcte. Les routes commencent par `/api/`

---

## 📝 Endpoints disponibles

### Public (pas d'authentification)
- `GET /api/health` - Health check
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Produit par ID
- `GET /api/products/category/:category` - Produits par catégorie
- `GET /api/categories` - Liste des catégories
- `POST /api/contact` - Envoyer un message
- `POST /api/quotes` - Demander un devis
- `POST /api/orders` - Créer une commande

### Admin (authentification requise)
- `POST /api/auth/login` - Connexion admin
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

---

## 🚀 Test rapide

Ouvrez simplement cette URL dans votre navigateur :
```
https://api-yooreed-e-commerce.vercel.app/api/products
```

Si ça fonctionne, vous verrez la liste des produits en JSON ! 🎉



















