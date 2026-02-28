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

echo Musiabux — сборка exe в один клик
echo.

if not exist "node_modules" (
    echo Установка зависимостей...
    call npm install
)

echo Сборка приложения и exe...
call npm run build:exe

if exist release\Musiabux*.exe (
    echo.
    echo Готово. Файл exe лежит в папке release\
    dir /b release\Musiabux*.exe
    echo.
    echo Можно скопировать exe куда угодно и запускать без установки.
    start "" "release"
) else (
    echo Что-то пошло не так. Проверьте вывод выше.
)

pause
