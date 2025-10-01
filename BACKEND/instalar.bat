@echo off
echo ========================================
echo  INSTALACION RE.SE.J BACKEND
echo  Sistema de Registro de Secuestros
echo ========================================
echo.

REM Verificar Node.js
echo [1/6] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instalar Node.js 18 o superior desde https://nodejs.org
    pause
    exit /b 1
)
echo OK - Node.js instalado

REM Verificar npm
echo [2/6] Verificando npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm no esta disponible
    pause
    exit /b 1
)
echo OK - npm disponible

REM Instalar dependencias
echo.
echo [3/6] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo la instalacion de dependencias
    pause
    exit /b 1
)
echo OK - Dependencias instaladas

REM Crear archivo .env si no existe
echo.
echo [4/6] Configurando variables de entorno...
if not exist .env (
    copy .env.example .env
    echo OK - Archivo .env creado
    echo.
    echo IMPORTANTE: Editar .env con las credenciales de PostgreSQL
) else (
    echo AVISO: Archivo .env ya existe, no se sobrescribe
)

REM Crear directorio uploads si no existe
echo.
echo [5/6] Creando directorios necesarios...
if not exist uploads mkdir uploads
if not exist logs mkdir logs
echo OK - Directorios creados

REM Mostrar instrucciones
echo.
echo [6/6] Verificando instalacion...
echo.
echo ========================================
echo  INSTALACION COMPLETADA
echo ========================================
echo.
echo PROXIMOS PASOS:
echo.
echo 1. Configurar PostgreSQL:
echo    - Crear base de datos: resej_db
echo    - Crear usuario: resej_user
echo.
echo 2. Editar archivo .env con credenciales de BD
echo.
echo 3. Ejecutar migraciones:
echo    npm run migrate:latest
echo.
echo 4. Crear usuario admin:
echo    npm run seed:run
echo.
echo 5. Iniciar servidor:
echo    npm run dev
echo.
echo Consultar INICIO_RAPIDO.md para mas detalles
echo.
pause
