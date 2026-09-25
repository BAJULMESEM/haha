@echo off
setlocal EnableExtensions

title Lecture Archive - UPDATE

echo.
echo ==========================================
echo     LECTURE ARCHIVE - UPDATE
echo ==========================================
echo.

echo [1/3] Membaca folder MADDAH...
py build.py
if errorlevel 1 (
    echo.
    echo [ERROR] Build gagal. Periksa file .link kamu.
    echo.
    pause
    exit /b 1
)

echo.
echo [2/3] Menyiapkan Git...
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Folder ini bukan Git repository.
    echo.
    echo Jalankan sekali:
    echo     git init
    echo     git branch -M main
    echo     git remote add origin URL_REPOSITORY_KAMU
    echo.
    pause
    exit /b 1
)

git add MADDAH generated index.html style.css app.js build.py update.bat README.md .github assets

git diff --cached --quiet
if %errorlevel%==0 (
    echo Tidak ada perubahan baru.
    echo.
    pause
    exit /b 0
)

git commit -m "Update lecture data"
if errorlevel 1 (
    echo [ERROR] Commit gagal.
    echo.
    pause
    exit /b 1
)

echo.
echo [3/3] Mengirim perubahan ke GitHub...
git push
if errorlevel 1 (
    echo.
    echo [ERROR] Push gagal.
    echo Pastikan GitHub sudah terhubung dan autentikasi Git sudah siap.
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo     UPDATE BERHASIL
echo ==========================================
echo.
echo Data .link sudah di-build dan dikirim ke GitHub.
echo GitHub Pages akan deploy ulang otomatis.
echo.
pause
