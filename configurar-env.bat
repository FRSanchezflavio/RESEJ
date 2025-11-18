@echo off
setlocal enabledelayedexpansion

echo ================================================
echo   RE.SE.J - Configurador de Variables de Entorno
echo ================================================
echo.

REM Determinar la ruta del backend
set "BACKEND_PATH=%~dp0BACKEND"
if not exist "%BACKEND_PATH%" (
    echo [ERROR] No se encontro la carpeta BACKEND
    echo Ruta esperada: %BACKEND_PATH%
    pause
    exit /b 1
)

set "ENV_FILE=%BACKEND_PATH%\.env"
set "ENV_EXAMPLE=%BACKEND_PATH%\.env.example"

REM Verificar si ya existe .env
if exist "%ENV_FILE%" (
    echo [ADVERTENCIA] Ya existe un archivo .env
    echo.
    choice /C SN /M "Deseas sobrescribirlo? (S=Si, N=No)"
    if errorlevel 2 goto :END
    echo.
)

REM Verificar que existe .env.example
if not exist "%ENV_EXAMPLE%" (
    echo [ERROR] No se encontro el archivo .env.example
    pause
    exit /b 1
)

echo Vamos a configurar las variables de entorno del sistema.
echo Presiona ENTER para usar el valor por defecto entre []
echo.

REM === CONFIGURACION DE BASE DE DATOS ===
echo --- CONFIGURACION DE BASE DE DATOS ---
echo.

set /p DB_HOST="Host de PostgreSQL [localhost]: "
if "!DB_HOST!"=="" set "DB_HOST=localhost"

set /p DB_PORT="Puerto de PostgreSQL [5432]: "
if "!DB_PORT!"=="" set "DB_PORT=5432"

set /p DB_NAME="Nombre de la base de datos [resej_db]: "
if "!DB_NAME!"=="" set "DB_NAME=resej_db"

set /p DB_USER="Usuario de la base de datos [resej_user]: "
if "!DB_USER!"=="" set "DB_USER=resej_user"

set /p DB_PASSWORD="Contraseña de la base de datos: "
if "!DB_PASSWORD!"=="" (
    echo [ERROR] La contraseña no puede estar vacia
    pause
    exit /b 1
)

echo.
echo --- CONFIGURACION DE SEGURIDAD ---
echo.
echo Generando claves secretas aleatorias...

REM Generar JWT_SECRET aleatorio
for /f "delims=" %%i in ('powershell -command "[guid]::NewGuid().ToString() + [guid]::NewGuid().ToString()"') do set "JWT_SECRET=%%i"

REM Generar REFRESH_TOKEN_SECRET aleatorio
for /f "delims=" %%i in ('powershell -command "[guid]::NewGuid().ToString() + [guid]::NewGuid().ToString()"') do set "REFRESH_TOKEN_SECRET=%%i"

echo [OK] Claves secretas generadas
echo.

REM === CONFIGURACION DEL SERVIDOR ===
echo --- CONFIGURACION DEL SERVIDOR ---
echo.

set /p PORT="Puerto del servidor [3000]: "
if "!PORT!"=="" set "PORT=3000"

echo.
echo --- GENERANDO ARCHIVO .env ---
echo.

REM Crear archivo .env
(
echo # Server Configuration
echo PORT=!PORT!
echo NODE_ENV=production
echo.
echo # Database Configuration
echo DB_HOST=!DB_HOST!
echo DB_PORT=!DB_PORT!
echo DB_NAME=!DB_NAME!
echo DB_USER=!DB_USER!
echo DB_PASSWORD=!DB_PASSWORD!
echo.
echo # JWT Configuration
echo JWT_SECRET=!JWT_SECRET!
echo JWT_EXPIRES_IN=24h
echo REFRESH_TOKEN_SECRET=!REFRESH_TOKEN_SECRET!
echo REFRESH_TOKEN_EXPIRES_IN=7d
echo.
echo # File Upload Configuration
echo UPLOAD_DIR=./uploads
echo MAX_FILE_SIZE=5242880
echo.
echo # Security Configuration
echo BCRYPT_ROUNDS=12
echo RATE_LIMIT_WINDOW_MS=900000
echo RATE_LIMIT_MAX_REQUESTS=100
echo.
echo # CORS Configuration
echo ALLOWED_ORIGINS=http://localhost:!PORT!
) > "%ENV_FILE%"

echo [OK] Archivo .env creado en: %ENV_FILE%
echo.

REM === RESUMEN ===
echo ================================================
echo   CONFIGURACION COMPLETADA
echo ================================================
echo.
echo Base de datos:
echo   Host: !DB_HOST!
echo   Puerto: !DB_PORT!
echo   Nombre: !DB_NAME!
echo   Usuario: !DB_USER!
echo.
echo Servidor:
echo   Puerto: !PORT!
echo.
echo IMPORTANTE:
echo 1. Asegurate de que PostgreSQL este instalado y en ejecucion
echo 2. La base de datos debe existir antes de iniciar la aplicacion
echo 3. Ejecuta las migraciones con: cd BACKEND ^&^& npx knex migrate:latest
echo.

:END
pause
