# 🗄️ Guide MongoDB - Yooreed Event

## ✅ MongoDB est maintenant démarré !

MongoDB a été démarré avec succès sur le port **27017**.

---

## 🚀 Démarrer MongoDB (à chaque session)

### Option 1: Script PowerShell (Recommandé)
```powershell
.\start-mongodb.ps1
```

### Option 2: Commande manuelle
```powershell
& "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db"
```

### Option 3: Service Windows (si configuré)
```powershell
Start-Service MongoDB
```

---

## 🔍 Vérifier que MongoDB fonctionne

```powershell
# Tester la connexion
Test-NetConnection -ComputerName localhost -Port 27017

# Ou utiliser mongosh
mongosh
```

---

## 📝 Configuration

MongoDB est configuré pour utiliser :
- **Port:** 27017
- **Dossier de données:** `C:\data\db`
- **URI de connexion:** `mongodb://localhost:27017/yooreed-event`

Cette URI est définie dans `backend/.env` :
```env
MONGODB_URI=mongodb://localhost:27017/yooreed-event
```

---

## 🐛 Dépannage

### MongoDB ne démarre pas
1. Vérifiez que le dossier `C:\data\db` existe
2. Vérifiez qu'aucun autre processus n'utilise le port 27017
3. Vérifiez les permissions d'écriture sur `C:\data\db`

### Le backend ne peut pas se connecter
1. Vérifiez que MongoDB est démarré : `Get-Process -Name mongod`
2. Vérifiez le port : `Test-NetConnection -ComputerName localhost -Port 27017`
3. Redémarrez le backend après avoir démarré MongoDB

### Port 27017 déjà utilisé
```powershell
# Trouver le processus utilisant le port
Get-NetTCPConnection -LocalPort 27017 | Select-Object OwningProcess

# Arrêter MongoDB
Stop-Process -Name mongod -Force
```

---

## 💡 Astuce

Ajoutez MongoDB au démarrage automatique de Windows en créant une tâche planifiée ou en l'installant comme service Windows.

---

## ✅ Prochaines étapes

1. ✅ MongoDB est démarré
2. Redémarrez le backend : `cd backend && npm run dev`
3. Vous devriez voir : `✅ MongoDB Connected: localhost`

---

**MongoDB est prêt à être utilisé ! 🎉**

