@echo off
chcp 65001 >nul
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo Нужен Node.js. Установите с https://nodejs.org
    start https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Установка зависимостей...
    call npm install
)
start "Musiabux" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
start http://localhost:5173
echo Открыт браузер. Окно с сервером не закрывайте.
