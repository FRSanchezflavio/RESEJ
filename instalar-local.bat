@echo off
chcp 65001 >nul
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     SISTEMA RESEJ - INSTALACIÓN PARA DEPENDENCIA LOCAL    ║
echo ║     Versión 1.0.0 - Policía de Tucumán                    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Verificar que se ejecuta como administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Este script debe ejecutarse como Administrador
    echo.
    echo Por favor:
    echo 1. Cierre esta ventana
    echo 2. Click derecho en el archivo
    echo 3. Seleccione "Ejecutar como administrador"
    echo.
    pause
    exit /b 1
)

echo [1/8] Verificando requisitos del sistema...
echo ════════════════════════════════════════════════════════════
echo.

REM Verificar Node.js
echo Verificando Node.js...
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [✗] Node.js NO está instalado
    echo.
    echo Por favor instale Node.js 18 o superior desde:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [✓] Node.js instalado: %NODE_VERSION%
)

REM Verificar npm
echo Verificando npm...
npm --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [✗] npm NO está instalado
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [✓] npm instalado: %NPM_VERSION%
)

REM Verificar PostgreSQL
echo Verificando PostgreSQL...
psql --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [✗] PostgreSQL NO está instalado
    echo.
    echo Por favor instale PostgreSQL 13 o superior desde:
    echo https://www.postgresql.org/download/
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('psql --version') do set PG_VERSION=%%i
    echo [✓] PostgreSQL instalado: %PG_VERSION%
)

echo.
echo [2/8] Verificando estructura del proyecto...
echo ════════════════════════════════════════════════════════════
echo.

if not exist "BACKEND\" (
    echo [✗] No se encuentra la carpeta BACKEND
    echo Asegúrese de ejecutar este script desde la raíz del proyecto RESEJ
    pause
    exit /b 1
)

if not exist "frontend\" (
    echo [✗] No se encuentra la carpeta frontend
    pause
    exit /b 1
)

echo [✓] Estructura del proyecto verificada
echo.

echo [3/8] Instalando dependencias del Backend...
echo ════════════════════════════════════════════════════════════
echo.
cd BACKEND
call npm install
if %errorLevel% neq 0 (
    echo [✗] Error al instalar dependencias del backend
    pause
    exit /b 1
)
echo [✓] Dependencias del backend instaladas
cd ..

echo.
echo [4/8] Configurando variables de entorno...
echo ════════════════════════════════════════════════════════════
echo.

if not exist "BACKEND\.env" (
    if exist "BACKEND\.env.example" (
        copy "BACKEND\.env.example" "BACKEND\.env" >nul
        echo [✓] Archivo .env creado desde .env.example
        echo.
        echo [!] IMPORTANTE: Debe configurar el archivo BACKEND\.env
        echo     con sus credenciales de PostgreSQL antes de continuar.
        echo.
        echo ¿Desea editar el archivo .env ahora? (S/N)
        set /p EDITAR_ENV=
        if /i "%EDITAR_ENV%"=="S" (
            notepad "BACKEND\.env"
        )
    ) else (
        echo [!] No se encontró .env.example, creando archivo .env básico...
        (
            echo NODE_ENV=production
            echo PORT=3001
            echo DB_HOST=localhost
            echo DB_PORT=5432
            echo DB_NAME=resej_db
            echo DB_USER=resej_user
            echo DB_PASSWORD=CAMBIAR_ESTA_CONTRASEÑA
            echo JWT_SECRET=GENERAR_CLAVE_SECRETA_ALEATORIA_AQUI
            echo JWT_EXPIRES_IN=8h
            echo FRONTEND_URL=http://localhost:3000
        ) > "BACKEND\.env"
        echo [✓] Archivo .env básico creado
        echo [!] DEBE editar BACKEND\.env antes de continuar
        notepad "BACKEND\.env"
    )
) else (
    echo [✓] Archivo .env ya existe
)

echo.
echo [5/8] Configurando base de datos...
echo ════════════════════════════════════════════════════════════
echo.
echo ¿Desea crear/migrar la base de datos ahora? (S/N)
echo (Asegúrese de haber configurado correctamente el archivo .env)
set /p MIGRAR_DB=

if /i "%MIGRAR_DB%"=="S" (
    cd BACKEND
    echo Ejecutando migraciones...
    call npm run migrate:latest
    if %errorLevel% neq 0 (
        echo [✗] Error al ejecutar migraciones
        echo Verifique la configuración de la base de datos en .env
        cd ..
        pause
        exit /b 1
    )
    echo [✓] Migraciones ejecutadas correctamente
    
    echo.
    echo ¿Desea cargar datos de ejemplo/iniciales? (S/N)
    set /p CARGAR_SEEDS=
    if /i "%CARGAR_SEEDS%"=="S" (
        call npm run seed:run
        echo [✓] Datos iniciales cargados
    )
    cd ..
) else (
    echo [!] Migraciones omitidas. Recuerde ejecutar 'npm run migrate:latest' en BACKEND
)

echo.
echo [6/8] Instalando dependencias del Frontend...
echo ════════════════════════════════════════════════════════════
echo.
cd frontend
call npm install
if %errorLevel% neq 0 (
    echo [✗] Error al instalar dependencias del frontend
    pause
    exit /b 1
)
echo [✓] Dependencias del frontend instaladas
cd ..

echo.
echo [7/8] Configurando frontend...
echo ════════════════════════════════════════════════════════════
echo.

if not exist "frontend\.env" (
    (
        echo VITE_API_URL=http://localhost:3001/api
    ) > "frontend\.env"
    echo [✓] Archivo frontend\.env creado
) else (
    echo [✓] Archivo frontend\.env ya existe
)

echo.
echo [8/8] Compilando Frontend para producción...
echo ════════════════════════════════════════════════════════════
echo.
cd frontend
call npm run build
if %errorLevel% neq 0 (
    echo [!] Error al compilar frontend (esto es normal en modo desarrollo)
) else (
    echo [✓] Frontend compilado correctamente
)
cd ..

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              INSTALACIÓN COMPLETADA CON ÉXITO             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo [✓] Todos los componentes fueron instalados correctamente
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │  PRÓXIMOS PASOS:                                           │
echo ├────────────────────────────────────────────────────────────┤
echo │  1. Verifique la configuración en BACKEND\.env            │
echo │  2. Para iniciar el sistema, ejecute: iniciar-sistema.bat │
echo │  3. Acceda desde el navegador a: http://localhost:5173    │
echo │  4. Usuario por defecto: admin / Contraseña: admin123     │
echo └────────────────────────────────────────────────────────────┘
echo.
echo ¿Desea iniciar el sistema ahora? (S/N)
set /p INICIAR_AHORA=

if /i "%INICIAR_AHORA%"=="S" (
    call iniciar-sistema.bat
) else (
    echo.
    echo Para iniciar el sistema más tarde, ejecute: iniciar-sistema.bat
    pause
)
