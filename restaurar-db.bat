@echo off
chcp 65001 >nul
color 0D
title Sistema RESEJ - Restaurar Base de Datos

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     SISTEMA RESEJ - RESTAURAR BASE DE DATOS               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo [!] ADVERTENCIA:
echo     Esta operación reemplazará TODOS los datos actuales
echo     de la base de datos con los datos del respaldo.
echo.

REM Configuración
set DB_USER=resej_user
set DB_NAME=resej_db
set DB_HOST=localhost
set BACKUP_DIR=C:\RESEJ-Backups

echo ¿Está seguro de que desea continuar? (S/N)
set /p CONFIRMAR=

if /i not "%CONFIRMAR%"=="S" (
    echo Operación cancelada
    pause
    exit /b 0
)

echo.
echo [1/4] Listando respaldos disponibles...
echo ════════════════════════════════════════════════════════════
echo.

if not exist "%BACKUP_DIR%\" (
    echo [✗] No se encuentra el directorio de respaldos: %BACKUP_DIR%
    pause
    exit /b 1
)

dir /B /O-D "%BACKUP_DIR%\resej_backup_*.sql" 2>nul
if %errorLevel% neq 0 (
    echo [✗] No se encontraron archivos de respaldo
    pause
    exit /b 1
)

echo.
echo Ingrese el nombre del archivo de respaldo a restaurar:
echo (Ejemplo: resej_backup_2025-11-12_10-30-00.sql)
echo.
set /p BACKUP_FILE=

if not exist "%BACKUP_DIR%\%BACKUP_FILE%" (
    echo [✗] El archivo especificado no existe
    pause
    exit /b 1
)

echo.
echo [2/4] Verificando PostgreSQL...
echo ════════════════════════════════════════════════════════════
echo.

psql --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [✗] psql no está disponible
    pause
    exit /b 1
)
echo [✓] PostgreSQL encontrado
echo.

echo [3/4] Deteniendo el sistema...
echo ════════════════════════════════════════════════════════════
echo.
echo [!] Asegúrese de que el sistema RESEJ esté detenido
echo.
echo ¿El sistema está detenido? (S/N)
set /p SISTEMA_DETENIDO=

if /i not "%SISTEMA_DETENIDO%"=="S" (
    echo Por favor detenga el sistema y vuelva a intentar
    pause
    exit /b 1
)

echo.
echo [4/4] Restaurando base de datos...
echo ════════════════════════════════════════════════════════════
echo.
echo Archivo: %BACKUP_FILE%
echo Base de datos: %DB_NAME%
echo.
echo [!] ÚLTIMA ADVERTENCIA: Todos los datos actuales se perderán
echo.
echo ¿Continuar con la restauración? (S/N)
set /p CONFIRMAR_FINAL=

if /i not "%CONFIRMAR_FINAL%"=="S" (
    echo Operación cancelada
    pause
    exit /b 0
)

echo.
echo Eliminando base de datos actual...
psql -U %DB_USER% -h %DB_HOST% -c "DROP DATABASE IF EXISTS %DB_NAME%;" postgres
if %errorLevel% neq 0 (
    echo [!] Advertencia: No se pudo eliminar la base de datos
)

echo Creando base de datos nueva...
psql -U %DB_USER% -h %DB_HOST% -c "CREATE DATABASE %DB_NAME%;" postgres
if %errorLevel% neq 0 (
    echo [✗] Error al crear la base de datos
    pause
    exit /b 1
)

echo Restaurando datos desde respaldo...
psql -U %DB_USER% -h %DB_HOST% %DB_NAME% < "%BACKUP_DIR%\%BACKUP_FILE%"
if %errorLevel% neq 0 (
    echo [✗] Error al restaurar el respaldo
    pause
    exit /b 1
)

echo [✓] Base de datos restaurada correctamente
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║          RESTAURACIÓN COMPLETADA EXITOSAMENTE             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo La base de datos ha sido restaurada desde:
echo %BACKUP_FILE%
echo.
echo Puede iniciar el sistema nuevamente con: iniciar-sistema.bat
echo.
pause
