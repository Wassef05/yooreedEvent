# Script de développement local
# Ce script compile le code et lance le serveur

Write-Host "🔨 Compilation du code TypeScript..." -ForegroundColor Cyan
npm run build:dev

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Compilation réussie!" -ForegroundColor Green
    Write-Host "🚀 Démarrage du serveur..." -ForegroundColor Cyan
    npm start
} else {
    Write-Host "❌ Erreur de compilation" -ForegroundColor Red
    exit 1
}









