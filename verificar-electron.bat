@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║          Sistema RESEJ - Verificación del Sistema           ║
echo ║                    Aplicación de Escritorio                 ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔍 Verificando instalación...
echo.

:: Verificar Node.js
echo [1/6] Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo    ❌ Node.js NO está instalado
    echo    📥 Descargar desde: https://nodejs.org/
    goto :error
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo    ✅ Node.js instalado: %NODE_VERSION%
)
echo.

:: Verificar npm
echo [2/6] npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo    ❌ npm NO está instalado
    goto :error
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo    ✅ npm instalado: %NPM_VERSION%
)
echo.

:: Verificar dependencias del proyecto raíz
echo [3/6] Dependencias del proyecto
if not exist "node_modules" (
    echo    ⚠️  node_modules no existe
    echo    📦 Ejecutando: npm install
    call npm install --silent
    if errorlevel 1 (
        echo    ❌ Error al instalar dependencias
        goto :error
    )
)
echo    ✅ Dependencias del proyecto instaladas
echo.

:: Verificar Electron
echo [4/6] Electron
npm list electron --depth=0 >nul 2>&1
if errorlevel 1 (
    echo    ⚠️  Electron no está instalado
    echo    📦 Instalando Electron...
    call npm install --save-dev electron
) else (
    for /f "tokens=2 delims=@" %%i in ('npm list electron --depth=0 2^>nul ^| findstr electron@') do set ELECTRON_VERSION=%%i
    echo    ✅ Electron instalado
)
echo.

:: Verificar Frontend
echo [5/6] Frontend
if not exist "frontend\node_modules" (
    echo    ⚠️  Dependencias de frontend no instaladas
    echo    📦 Instalando...
    cd frontend
    call npm install --silent
    cd ..
    if errorlevel 1 (
        echo    ❌ Error al instalar dependencias del frontend
        goto :error
    )
)
echo    ✅ Frontend configurado
echo.

:: Verificar Backend
echo [6/6] Backend
if not exist "BACKEND\node_modules" (
    echo    ⚠️  Dependencias de backend no instaladas
    echo    📦 Instalando...
    cd BACKEND
    call npm install --silent
    cd ..
    if errorlevel 1 (
        echo    ❌ Error al instalar dependencias del backend
        goto :error
    )
)
echo    ✅ Backend configurado
echo.

:: Verificar archivos clave
echo.
echo 📋 Verificando archivos...
echo.

if exist "electron.js" (
    echo    ✅ electron.js
) else (
    echo    ❌ electron.js NO encontrado
)

if exist "electron-with-backend.js" (
    echo    ✅ electron-with-backend.js
) else (
    echo    ❌ electron-with-backend.js NO encontrado
)

if exist "build-electron.bat" (
    echo    ✅ build-electron.bat
) else (
    echo    ❌ build-electron.bat NO encontrado
)

if exist "INSTALACION.md" (
    echo    ✅ INSTALACION.md
) else (
    echo    ❌ INSTALACION.md NO encontrado
)

if exist "README_ELECTRON.md" (
    echo    ✅ README_ELECTRON.md
) else (
    echo    ❌ README_ELECTRON.md NO encontrado
)
echo.

:: Mostrar configuración
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                  CONFIGURACIÓN DEL SISTEMA                   ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📦 Proyecto: Sistema RESEJ Policía
echo 📍 Ubicación: %CD%
echo 🔧 Node.js: %NODE_VERSION%
echo 📦 npm: %NPM_VERSION%
echo.

:: Mostrar comandos disponibles
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   COMANDOS DISPONIBLES                       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🚀 DESARROLLO:
echo    npm start                    - Iniciar backend + frontend
echo    npm run electron:dev         - Desarrollo con Electron
echo    npm run electron:with-backend - Electron + backend integrado
echo.
echo 🏗️  CONSTRUCCIÓN:
echo    build-electron.bat           - Construir instalador (automático)
echo    npm run electron:build:win   - Construir instalador Windows
echo    npm run build:frontend       - Solo construir frontend
echo.
echo 📦 PRUEBAS:
echo    npm run pack                 - Empaquetar sin instalador
echo.

:: Verificar PostgreSQL (opcional)
echo.
echo 🗄️  PostgreSQL:
pg_ctl --version >nul 2>&1
if errorlevel 1 (
    echo    ⚠️  PostgreSQL no detectado en PATH
    echo    💡 Asegúrese de tener PostgreSQL instalado para usar la app
) else (
    for /f "tokens=3" %%i in ('pg_ctl --version 2^>^&1') do set PG_VERSION=%%i
    echo    ✅ PostgreSQL instalado: %PG_VERSION%
)
echo.

:: Verificar archivo .env
echo.
echo ⚙️  Configuración:
if exist "BACKEND\.env" (
    echo    ✅ BACKEND\.env encontrado
) else (
    echo    ⚠️  BACKEND\.env NO encontrado
    echo    💡 Copie BACKEND\.env.example a BACKEND\.env y configure
)
echo.

:: Resumen final
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                      ✅ TODO LISTO                           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo El sistema está correctamente configurado y listo para:
echo.
echo   1. 💻 Desarrollo:        npm run electron:dev
echo   2. 🏗️  Construir app:     build-electron.bat
echo   3. 📦 Generar instalador: dist\Sistema RESEJ Policía-Setup-1.0.0.exe
echo.
echo 📚 Documentación:
echo    - INSTALACION.md          (Para usuarios finales)
echo    - README_ELECTRON.md       (Documentación técnica)
echo    - INICIO_RAPIDO_ELECTRON.md (Quick start)
echo    - RESUMEN_IMPLEMENTACION.md (Resumen completo)
echo.
pause
exit /b 0

:error
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    ❌ ERROR DETECTADO                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Por favor corrija los errores anteriores antes de continuar.
echo.
pause
exit /b 1
