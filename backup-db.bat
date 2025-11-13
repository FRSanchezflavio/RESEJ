@echo off
chcp 65001 >nul
color 0E
title Sistema RESEJ - Respaldo de Base de Datos

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║        SISTEMA RESEJ - RESPALDO DE BASE DE DATOS          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Configuración
set DB_USER=resej_user
set DB_NAME=resej_db
set DB_HOST=localhost
set BACKUP_DIR=C:\RESEJ-Backups

REM Crear nombre del archivo con fecha y hora
set FECHA=%date:~-4,4%-%date:~-7,2%-%date:~-10,2%
set HORA=%time:~0,2%-%time:~3,2%-%time:~6,2%
set HORA=%HORA: =0%
set FILENAME=resej_backup_%FECHA%_%HORA%.sql

echo [1/4] Verificando PostgreSQL...
echo ════════════════════════════════════════════════════════════
echo.

pg_dump --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [✗] pg_dump no está disponible
    echo Asegúrese de que PostgreSQL esté instalado correctamente
    pause
    exit /b 1
)
echo [✓] PostgreSQL encontrado
echo.

echo [2/4] Creando directorio de respaldos...
echo ════════════════════════════════════════════════════════════
echo.

if not exist "%BACKUP_DIR%" (
    mkdir "%BACKUP_DIR%"
    echo [✓] Directorio creado: %BACKUP_DIR%
) else (
    echo [✓] Directorio ya existe: %BACKUP_DIR%
)
echo.

echo [3/4] Generando respaldo de la base de datos...
echo ════════════════════════════════════════════════════════════
echo.
echo Base de datos: %DB_NAME%
echo Usuario: %DB_USER%
echo Archivo: %FILENAME%
echo.

REM Ejecutar pg_dump
pg_dump -U %DB_USER% -h %DB_HOST% %DB_NAME% > "%BACKUP_DIR%\%FILENAME%" 2>&1

if %errorLevel% neq 0 (
    echo [✗] Error al crear el respaldo
    echo.
    echo Posibles causas:
    echo - La contraseña de PostgreSQL no está configurada
    echo - El usuario %DB_USER% no tiene permisos
    echo - La base de datos %DB_NAME% no existe
    echo.
    echo Configure la variable PGPASSWORD o use .pgpass
    pause
    exit /b 1
)

echo [✓] Respaldo creado correctamente
echo.

echo [4/4] Verificando archivo de respaldo...
echo ════════════════════════════════════════════════════════════
echo.

if exist "%BACKUP_DIR%\%FILENAME%" (
    for %%A in ("%BACKUP_DIR%\%FILENAME%") do set FILESIZE=%%~zA
    echo [✓] Archivo creado: %FILENAME%
    echo [✓] Tamaño: %FILESIZE% bytes
) else (
    echo [✗] No se pudo verificar el archivo
)

echo.

REM Limpiar respaldos antiguos (mantener últimos 30 días)
echo ¿Desea limpiar respaldos antiguos? (S/N)
echo (Se eliminarán respaldos con más de 30 días)
set /p LIMPIAR=

if /i "%LIMPIAR%"=="S" (
    echo Limpiando respaldos antiguos...
    forfiles /P "%BACKUP_DIR%" /S /M resej_backup_*.sql /D -30 /C "cmd /c del @path" 2>nul
    echo [✓] Limpieza completada
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║            RESPALDO COMPLETADO EXITOSAMENTE               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Ubicación: %BACKUP_DIR%\%FILENAME%
echo.
echo IMPORTANTE:
echo - Guarde este respaldo en un lugar seguro
echo - Se recomienda copiar a un disco externo o servidor remoto
echo - Programe este script para ejecución automática diaria
echo.
pause
