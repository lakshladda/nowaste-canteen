@echo off
title NoWaste Canteen - UN SDG 12 Platform
cd /d "%~dp0backend"
echo ========================================================
echo   🌱 Starting NoWaste Canteen Full-Stack Server
echo   Aligned with UN SDG 12: Responsible Consumption
echo ========================================================
echo.
echo Server starting at: http://localhost:5000
echo Health check:       http://localhost:5000/api/health
echo.
start "" "http://localhost:5000"
start "" "http://localhost:5000/api/health"
node server.js
pause
