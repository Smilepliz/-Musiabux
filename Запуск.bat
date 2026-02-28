@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Musiabux — запуск...
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo Не найден Node.js. Установите с https://nodejs.org
    echo Открываю страницу загрузки...
    start https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Первый запуск: установка зависимостей...
    call npm install
    echo.
)

start "Musiabux" cmd /k "npm run dev"
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo.
echo Браузер открыт. Окно с сервером не закрывайте.
exit
