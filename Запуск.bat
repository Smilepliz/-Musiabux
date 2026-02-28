@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Musiabux — запуск...
echo.

set "NODE_OK=0"
where node >nul 2>nul
if not errorlevel 1 set "NODE_OK=1"

if "%NODE_OK%"=="0" if exist "%~dp0.node-portable\node.exe" (
    set "PATH=%~dp0.node-portable;%PATH%"
    set "NODE_OK=1"
)

if "%NODE_OK%"=="0" (
    echo Node.js не найден. Скачиваем портативную версию (один раз, ~30 МБ)...
    echo.
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
        "$nodeVer = 'v20.18.0'; ^
         $zipUrl = \"https://nodejs.org/dist/$nodeVer/node-$nodeVer-win-x64.zip\"; ^
         $zipPath = \"%~dp0node-portable.zip\"; ^
         $dest = \"%~dp0.node-portable\"; ^
         New-Item -ItemType Directory -Force -Path $dest | Out-Null; ^
         try { ^
             [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; ^
             Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UseBasicParsing; ^
             Expand-Archive -Path $zipPath -DestinationPath \"%~dp0\" -Force; ^
             $folder = Get-ChildItem -Path \"%~dp0\" -Directory -Filter 'node-*-win-x64' | Select-Object -First 1; ^
             if ($folder) { Copy-Item -Path \"$($folder.FullName)\*\" -Destination $dest -Recurse -Force; Remove-Item $folder.FullName -Recurse -Force }; ^
             Remove-Item $zipPath -Force -ErrorAction SilentlyContinue; ^
             Write-Host 'Готово.' ^
         } catch { Write-Host \"Ошибка: $_\"; exit 1 }"
    if errorlevel 1 (
        echo Не удалось скачать. Установите Node.js с https://nodejs.org
        start https://nodejs.org
        pause
        exit /b 1
    )
    set "PATH=%~dp0.node-portable;%PATH%"
    echo.
)

if not exist "node_modules" (
    echo Установка зависимостей проекта...
    call npm install
    echo.
)

start "Musiabux" cmd /k "set PATH=%~dp0.node-portable;%PATH% && npm run dev"
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo.
echo Браузер открыт. Окно с сервером не закрывайте.
exit
