# Push ODYSCARE to GitHub - PowerShell Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "     PUSH ODYSCARE KE GITHUB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ghPath = "C:\Program Files\GitHub CLI\gh.exe"

# Check if gh CLI exists
if (-not (Test-Path $ghPath)) {
    Write-Host "[INFO] GitHub CLI belum terinstall." -ForegroundColor Yellow
    Write-Host "[INFO] Menginstall via winget..." -ForegroundColor Yellow
    winget install --id GitHub.cli -e --source winget
    Write-Host ""
    Write-Host "[INFO] Installasi selesai. Silakan jalankan ulang script ini." -ForegroundColor Green
    Read-Host "Tekan Enter untuk keluar"
    exit
}

Write-Host "[OK] GitHub CLI ditemukan." -ForegroundColor Green
Write-Host ""

# Check login status
$authStatus = & $ghPath auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[STEP 1] Login ke GitHub..." -ForegroundColor Yellow
    Write-Host "[INFO] Browser akan terbuka untuk autentikasi..." -ForegroundColor Cyan
    & $ghPath auth login --web
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Login gagal." -ForegroundColor Red
        Read-Host "Tekan Enter untuk keluar"
        exit
    }
}

Write-Host "[OK] Login berhasil!" -ForegroundColor Green
Write-Host ""

# Get username
$githubUser = & $ghPath api user -q .login
Write-Host "[INFO] GitHub Username: $githubUser" -ForegroundColor Cyan
Write-Host ""

# Create repo and push
Write-Host "[STEP 2] Membuat repository 'odyscare-web'..." -ForegroundColor Yellow
& $ghPath repo create odyscare-web --public --source=. --remote=origin --push

if ($LASTEXITCODE -ne 0) {
    Write-Host "[INFO] Repository mungkin sudah ada, mencoba push manual..." -ForegroundColor Yellow
    git remote add origin "https://github.com/$githubUser/odyscare-web.git" 2>$null
    git branch -M main
    git push -u origin main
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "     PUSH SELESAI!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Repository: https://github.com/$githubUser/odyscare-web" -ForegroundColor Cyan
Write-Host ""
Write-Host "Untuk aktifkan GitHub Pages (website online gratis):" -ForegroundColor Yellow
Write-Host "1. Buka: https://github.com/$githubUser/odyscare-web" -ForegroundColor White
Write-Host "2. Klik tab Settings" -ForegroundColor White
Write-Host "3. Di sidebar kiri, klik Pages" -ForegroundColor White
Write-Host "4. Source: pilih 'Deploy from a branch'" -ForegroundColor White
Write-Host "5. Branch: main, Folder: / (root)" -ForegroundColor White
Write-Host "6. Klik Save" -ForegroundColor White
Write-Host "7. Tunggu 1-2 menit, lalu akses:" -ForegroundColor White
Write-Host "   https://$githubUser.github.io/odyscare-web" -ForegroundColor Green
Write-Host ""
Read-Host "Tekan Enter untuk selesai"
