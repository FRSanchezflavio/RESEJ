@echo off
setlocal

set PROJECT_DIR=%~dp0frontend
set VITE_BIN=%PROJECT_DIR%\node_modules\.bin\vite.cmd

if not exist "%PROJECT_DIR%" (
    echo No se encontro la carpeta frontend en %PROJECT_DIR%.
    pause
    exit /b 1
)

if not exist "%PROJECT_DIR%\package.json" (
    echo No se encontro package.json dentro de la carpeta frontend.
    pause
    exit /b 1
)

if not exist "%VITE_BIN%" (
    echo No se encontro Vite CLI. Ejecuta "npm install" dentro de la carpeta frontend al menos una vez.
    pause
    exit /b 1
)

echo ==================================================
echo   Iniciando frontend RESEJ con Vite
cd /d "%PROJECT_DIR%"

echo Ejecutando: %VITE_BIN% --host 0.0.0.0 --port 5173
echo (Abre http://localhost:5173 en tu navegador)
echo ==================================================
"%VITE_BIN%" --host 0.0.0.0 --port 5173

if %errorlevel% neq 0 (
    echo El frontend finalizo con errores (%errorlevel%).
    pause
)

endlocal
