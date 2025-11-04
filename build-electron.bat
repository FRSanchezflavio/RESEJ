@echo off
rem -------------------------------------------------------------
rem Sistema RESEJ - Constructor Electron (mejorado)
rem Este script se asegura de ejecutar desde la carpeta del proyecto
rem -------------------------------------------------------------

rem Cambiar el directorio de trabajo a la carpeta donde está este script
pushd "%~dp0" >nul || (
    echo ERROR: No se pudo cambiar al directorio del script.
    pause
    exit /b 1
)

echo ========================================
echo  Sistema RESEJ - Constructor Electron
echo ========================================
echo.

echo [1/6] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
        echo ERROR: Node.js no esta instalado
        echo Por favor instale Node.js desde https://nodejs.org/
        popd >nul
        pause
        exit /b 1
)
echo Node.js encontrado: 
node --version
echo.

echo [2/6] Instalando dependencias del proyecto raiz...
call npm install
if errorlevel 1 (
        echo ERROR: Fallo la instalacion de dependencias en %cd%
        popd >nul
        pause
        exit /b 1
)
echo.

echo [3/6] Instalando dependencias del frontend...
if not exist frontend goto :SKIP_FRONTEND_INSTALL
pushd frontend >nul
call npm install
if errorlevel 1 (
    echo ERROR: Fallo la instalacion del frontend (frontend) en %cd%
    popd >nul
    popd >nul
    pause
    exit /b 1
)
popd >nul
:SKIP_FRONTEND_INSTALL
if exist frontend (
    echo Frontend: OK
) else (
    echo WARNING: No se encontró la carpeta frontend; saltando instalación frontend.
)
echo.

echo [4/6] Construyendo frontend (producción)...
if not exist frontend goto :SKIP_FRONTEND_BUILD
pushd frontend >nul
call npm run build --silent
if errorlevel 1 (
    echo ERROR: Fallo la construccion del frontend en %cd%
    popd >nul
    popd >nul
    pause
    exit /b 1
)
popd >nul
:SKIP_FRONTEND_BUILD
if exist frontend (
    echo Frontend build: OK
) else (
    echo WARNING: No se encontró la carpeta frontend; no hay build que ejecutar.
)
echo.

echo [5/6] Verificando BACKEND
if not exist BACKEND (
    echo WARNING: No se encontró la carpeta BACKEND
    echo.
    goto :AFTER_BACKEND_CHECK
)
echo  - BACKEND encontrado
pushd BACKEND >nul
if not exist node_modules (
    call npm install --silent
    if errorlevel 1 (
        echo ERROR: Fallo la instalacion de dependencias del BACKEND en %cd%
        popd >nul
        popd >nul
        pause
        exit /b 1
    )
)
popd >nul
:AFTER_BACKEND_CHECK
echo.

echo [6/6] Construyendo aplicacion de escritorio (Electron/Builder)...
call npm run electron:build:win --silent
if errorlevel 1 (
        echo ERROR: Fallo la construccion de Electron
        popd >nul
        pause
        exit /b 1
)
echo.

echo ========================================
echo  Construccion completada exitosamente!
echo ========================================
echo.
echo El instalador (si fue creado) se encuentra en la carpeta: dist\
echo.
popd >nul
pause
