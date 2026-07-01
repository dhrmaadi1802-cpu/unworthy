@echo off
echo Membuat folder assets...
mkdir "C:\xampp\unworty\assets" 2>nul

echo Menyalin gambar produk asli...
copy /Y "C:\Users\Lenovo\.gemini\antigravity\brain\ea94f6ec-b269-49c0-a43a-ceca32cce15e\media__1782874070162.png" "C:\xampp\unworty\assets\produk.png"
copy /Y "C:\xampp\unworty\WhatsApp Image 2026-07-01 at 09.20.57.jpeg" "C:\xampp\unworty\assets\vini_jr.jpg"

echo.
echo Selesai! Semua gambar produk yang benar sudah disalin ke folder assets.
echo Sekarang Anda bisa upload folder unworty ke GitHub.
pause
