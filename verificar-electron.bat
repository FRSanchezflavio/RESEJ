@echo off
echo ================================================
echo   RE.SE.J - Verificador Pre-Empaquetado
echo ================================================
echo.

set ERROR_COUNT=0

REM Verificar Node.js
echo [1/10] Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js no esta instalado
    set /a ERROR_COUNT+=1
) else (
    node --version
    echo [OK] Node.js instalado
)
echo.

REM Verificar npm
echo [2/10] Verificando npm...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] npm no esta disponible
    set /a ERROR_COUNT+=1
) else (
    npm --version
    echo [OK] npm disponible
)
echo.

REM Verificar node_modules raíz
echo [3/10] Verificando dependencias raiz...
if not exist "node_modules" (
    echo [X] node_modules no existe - Ejecuta: npm install
    set /a ERROR_COUNT+=1
) else (
    echo [OK] Dependencias raiz instaladas
)
echo.

REM Verificar node_modules backend
echo [4/10] Verificando dependencias backend...
if not exist "BACKEND\node_modules" (
    echo [X] BACKEND\node_modules no existe - Ejecuta: cd BACKEND ^&^& npm install
    set /a ERROR_COUNT+=1
) else (
    echo [OK] Dependencias backend instaladas
)
echo.

REM Verificar node_modules frontend
echo [5/10] Verificando dependencias frontend...
if not exist "frontend\node_modules" (
    echo [X] frontend\node_modules no existe - Ejecuta: cd frontend ^&^& npm install
    set /a ERROR_COUNT+=1
) else (
    echo [OK] Dependencias frontend instaladas
)
echo.

REM Verificar electron
echo [6/10] Verificando Electron...
if not exist "node_modules\electron" (
    echo [X] Electron no esta instalado - Ejecuta: npm install electron --save-dev
    set /a ERROR_COUNT+=1
) else (
    echo [OK] Electron instalado
)
echo.

REM Verificar electron-builder
echo [7/10] Verificando electron-builder...
if not exist "node_modules\electron-builder" (
    echo [X] electron-builder no esta instalado - Ejecuta: npm install electron-builder --save-dev
    set /a ERROR_COUNT+=1
) else (
    echo [OK] electron-builder instalado
)
echo.

REM Verificar archivos principales
echo [8/10] Verificando archivos principales...
if not exist "electron-main.js" (
    echo [X] electron-main.js no existe
    set /a ERROR_COUNT+=1
) else (
    echo [OK] electron-main.js existe
)
if not exist "electron-preload.js" (
    echo [X] electron-preload.js no existe
    set /a ERROR_COUNT+=1
) else (
    echo [OK] electron-preload.js existe
)
echo.

REM Verificar BACKEND/server.js
echo [9/10] Verificando servidor backend...
if not exist "BACKEND\server.js" (
    echo [X] BACKEND\server.js no existe
    set /a ERROR_COUNT+=1
) else (
    echo [OK] BACKEND\server.js existe
)
echo.

REM Verificar .env.example
echo [10/10] Verificando archivos de configuracion...
if not exist "BACKEND\.env.example" (
    echo [!] BACKEND\.env.example no existe (recomendado para distribución)
) else (
    echo [OK] BACKEND\.env.example existe
)
echo.

REM Resultado final
echo ================================================
if %ERROR_COUNT% EQU 0 (
    echo   VERIFICACION COMPLETA: TODO LISTO
    echo ================================================
    echo.
    echo Puedes proceder con:
    echo   1. Compilar frontend: npm run build:frontend
    echo   2. Empaquetar: npm run dist
    echo.
    echo O usa el script: empaquetar-electron.bat
) else (
    echo   VERIFICACION FALLIDA: %ERROR_COUNT% error(s) encontrado(s)
    echo ================================================
    echo.
    echo Corrige los errores antes de empaquetar.
    echo Ejecuta: instalar-electron.bat para instalar dependencias.
)
echo.

pause
