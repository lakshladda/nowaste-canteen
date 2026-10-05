@echo off
title Push NoWaste Canteen to GitHub
cd /d "%~dp0"
echo ========================================================
echo   Pushing NoWaste Canteen to https://github.com/lakshladda/nowaste-canteen
echo ========================================================
echo.
echo Make sure you created the empty repository at:
echo https://github.com/new (Repository name: nowaste-canteen)
echo.
git push -u origin main
echo.
pause
