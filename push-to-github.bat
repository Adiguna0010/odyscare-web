@echo off
chcp 65001 >nul
echo ========================================
echo     PUSH ODYSCARE KE GITHUB
echo ========================================
echo.

REM Check if gh CLI is installed
if not exist "C:\Program Files\GitHub CLI\gh.exe" (
    echo [INFO] GitHub CLI belum terinstall.
    echo [INFO] Menginstall GitHub CLI...
    winget install --id GitHub.cli -e --source winget
    echo.
    echo [INFO] Silakan restart komputer atau terminal setelah install selesai.
    echo [INFO] Lalu jalankan script ini lagi.
    pause
    exit
)

echo [OK] GitHub CLI ditemukan.
echo.

REM Login to GitHub
echo [STEP 1] Login ke GitHub...
echo [INFO] Browser akan terbuka untuk autentikasi.
"C:\Program Files\GitHub CLI\gh.exe" auth login --web

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Login gagal atau dibatalkan.
    echo [INFO] Coba jalankan: gh auth login
    pause
    exit
)

echo.
echo [OK] Login berhasil!
echo.

REM Get username
for /f "tokens=*" %%a in ('"C:\Program Files\GitHub CLI\gh.exe" api user -q .login') do set GITHUB_USER=%%a
echo [INFO] GitHub Username: %GITHUB_USER%

REM Create repository and push
echo.
echo [STEP 2] Membuat repository 'odyscare-web' di GitHub...
"C:\Program Files\GitHub CLI\gh.exe" repo create odyscare-web --public --source=. --remote=origin --push

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Gagal membuat/push repository.
    echo [INFO] Mungkin repository sudah ada. Mencoba push manual...
    git remote add origin https://github.com/%GITHUB_USER%/odyscare-web.git 2>nul
    git branch -M main
    git push -u origin main
)

echo.
echo ========================================
echo     PUSH SELESAI!
echo ========================================
echo.
echo Website Anda sudah online di:
echo https://github.com/%GITHUB_USER%/odyscare-web
echo.
echo Untuk akses website via GitHub Pages:
echo 1. Buka https://github.com/%GITHUB_USER%/odyscare-web
echo 2. Klik Settings
echo 3. Pilih Pages (di sidebar kiri)
echo 4. Di "Source", pilih "Deploy from a branch"
echo 5. Pilih branch "main" dan folder "/ (root)"
echo 6. Klik Save
echo 7. Website akan live di: https://%GITHUB_USER%.github.io/odyscare-web
echo.
pause
