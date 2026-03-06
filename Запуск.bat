@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is required. Install it from https://nodejs.org
    start "" "https://nodejs.org"
    pause
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo npm is required. Reinstall Node.js from https://nodejs.org
    start "" "https://nodejs.org"
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Installing dependencies...
    call npm.cmd install
    if errorlevel 1 (
        echo Dependency installation failed. Check errors above.
        pause
        exit /b 1
    )
)

echo Starting dev server...
echo Browser will open after Vite starts.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:5173/'"
call npm.cmd run dev
if errorlevel 1 (
    echo Dev server start failed. Check errors above.
    pause
    exit /b 1
)
