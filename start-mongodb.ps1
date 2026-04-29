# Script pour démarrer MongoDB
Write-Host "🔍 Recherche de MongoDB..." -ForegroundColor Cyan

$mongoPath = Get-ChildItem "C:\Program Files\MongoDB" -Recurse -Filter "mongod.exe" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName

if (-not $mongoPath) {
    Write-Host "❌ MongoDB non trouvé dans C:\Program Files\MongoDB" -ForegroundColor Red
    Write-Host "💡 Installez MongoDB depuis https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ MongoDB trouvé: $mongoPath" -ForegroundColor Green

# Créer le dossier de données si nécessaire
$dbPath = "C:\data\db"
if (-not (Test-Path $dbPath)) {
    New-Item -ItemType Directory -Path $dbPath -Force | Out-Null
    Write-Host "📁 Dossier créé: $dbPath" -ForegroundColor Yellow
}

# Vérifier si MongoDB est déjà en cours d'exécution
$mongoProcess = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✅ MongoDB est déjà en cours d'exécution (PID: $($mongoProcess.Id))" -ForegroundColor Green
    exit 0
}

# Démarrer MongoDB
Write-Host "🚀 Démarrage de MongoDB..." -ForegroundColor Cyan
Start-Process -FilePath $mongoPath -ArgumentList "--dbpath", $dbPath -WindowStyle Hidden

# Attendre que MongoDB démarre
Start-Sleep -Seconds 3

# Vérifier la connexion
$connectionTest = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($connectionTest) {
    Write-Host "✅ MongoDB démarré avec succès sur le port 27017" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB en cours de démarrage, veuillez patienter..." -ForegroundColor Yellow
}

