# Guide de développement local

## ⚠️ PROBLÈME CRITIQUE avec Node.js 18.20.4

Il y a un **bug connu dans Node.js v18.20.4** qui cause l'erreur `ERR_INTERNAL_ASSERTION` avec les modules ES. Ce bug est particulièrement problématique lorsque le chemin du projet contient des espaces (comme "yooreed event e-commerce 2025").

### 🔴 Ce bug affecte :
- `tsx` (ne fonctionne pas)
- `ts-node` (ne fonctionne pas)
- Même le code compilé avec `node dist/server.js` (ne fonctionne pas)

## ✅ SOLUTION UNIQUE : Mettre à jour Node.js

**C'est la SEULE solution qui fonctionne actuellement.**

### Étapes pour mettre à jour Node.js :

1. **Télécharger Node.js** depuis [nodejs.org](https://nodejs.org/)
   - Recommandé : Node.js 20.x LTS (Long Term Support)
   - Alternative : Node.js 18.21.x ou supérieur

2. **Installer la nouvelle version**
   - Sur Windows : Téléchargez l'installateur `.msi`
   - Suivez l'assistant d'installation

3. **Vérifier la version installée** :
   ```bash
   node --version
   ```
   Vous devriez voir `v20.x.x` ou `v18.21.x` ou supérieur

4. **Relancer le serveur** :
   ```bash
   npm run dev
   ```

### 🔍 Pourquoi mettre à jour Node.js ?

- ✅ Résout le bug `ERR_INTERNAL_ASSERTION`
- ✅ Permet l'utilisation normale de `tsx` et `ts-node`
- ✅ Améliore les performances et la sécurité
- ✅ Donne accès aux dernières fonctionnalités

### ⚠️ Si vous ne pouvez PAS mettre à jour Node.js

Malheureusement, **aucune solution de contournement ne fonctionne** avec Node.js 18.20.4 à cause de ce bug. Vous devrez :
- Utiliser un autre environnement de développement (Linux, Mac)
- Ou renommer votre dossier pour enlever les espaces (pas garanti de fonctionner)

## 📝 Scripts disponibles

- `npm run dev` - Mode développement avec tsx (ne fonctionne pas avec Node.js 18.20.4)
- `npm run dev:alt` - Mode développement alternatif avec compilation automatique
- `npm run build:dev` - Compiler le code pour le développement
- `npm start` - Démarrer le serveur compilé
- `npm run build` - Compiler pour la production

## 🔍 Vérifier votre version de Node.js

```bash
node --version
```

Si vous voyez `v18.20.4`, c'est le problème. Mettez à jour vers une version plus récente.









