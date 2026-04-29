# Script PowerShell pour lancer le serveur en utilisant le chemin court (sans espaces)
# Ce script contourne le bug Node.js 18.20.4 avec les chemins contenant des espaces

$ErrorActionPreference = "Stop"

# Obtenir le chemin court (8.3 format) du répertoire actuel
$currentPath = $PSScriptRoot
$fso = New-Object -ComObject Scripting.FileSystemObject
$folder = $fso.GetFolder($currentPath)
$shortPath = $folder.ShortPath

Write-Host "📁 Chemin actuel: $currentPath" -ForegroundColor Cyan
Write-Host "📁 Chemin court: $shortPath" -ForegroundColor Cyan

# Changer vers le chemin court
Set-Location $shortPath

Write-Host "🔨 Compilation du code..." -ForegroundColor Yellow
npm run build:dev 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0 -or (Test-Path "dist\server.js")) {
    Write-Host "✅ Compilation réussie!" -ForegroundColor Green
    Write-Host "🚀 Démarrage du serveur depuis le chemin court..." -ForegroundColor Cyan
    
    # Lancer le serveur depuis le chemin court
    node dist/server.js
} else {
    Write-Host "❌ Erreur de compilation" -ForegroundColor Red
    exit 1
}









