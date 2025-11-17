@echo off
setlocal

rem Determina la ruta absoluta hacia la carpeta BACKEND
set PROJECT_DIR=%~dp0BACKEND

if not exist "%PROJECT_DIR%\server.js" (
    echo No se encontro server.js dentro de la carpeta BACKEND.
    echo Verifica que el proyecto este ubicado en %PROJECT_DIR%
    pause
    exit /b 1
)

echo ==================================================
echo   Iniciando backend RESEJ sin npm start
rem /d permite cambiar de unidad si el proyecto no esta en C:
cd /d "%PROJECT_DIR%"

echo Ejecutando: node server.js
echo ==================================================
node server.js

if %errorlevel% neq 0 (
    echo El backend finalizo con errores (%errorlevel%).
    pause
)

endlocal
