@echo off
title NoWaste Canteen - Demo Test Runner
cd /d "%~dp0backend"
echo Running 10-step End-to-End Demo Flow Verification...
node test-demo-scenario.js
pause
