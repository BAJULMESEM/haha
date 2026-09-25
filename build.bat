@echo off
setlocal
py build.py
if errorlevel 1 (
  echo.
  echo BUILD GAGAL.
  pause
  exit /b 1
)
echo.
echo BUILD BERHASIL.
echo File generated\data.js sudah diperbarui.
pause
