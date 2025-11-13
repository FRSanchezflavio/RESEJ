@echo off
chcp 65001 >nul
color 0C
title Sistema RESEJ - Deteniendo...

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          SISTEMA RESEJ - DETENER APLICACIÓN               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo Buscando procesos de Node.js (RESEJ)...
echo.

REM Buscar procesos de node que estén corriendo el sistema
for /f "tokens=2" %%i in ('tasklist ^| findstr /i "node.exe"') do (
    echo Proceso encontrado: %%i
)

echo.
echo ¿Desea detener todos los procesos de Node.js? (S/N)
echo (Esto detendrá el Backend y Frontend de RESEJ)
set /p CONFIRMAR=

if /i "%CONFIRMAR%"=="S" (
    echo.
    echo Deteniendo procesos...
    taskkill /F /IM node.exe >nul 2>&1
    if %errorLevel% equ 0 (
        echo [✓] Procesos detenidos correctamente
    ) else (
        echo [!] No se encontraron procesos de Node.js en ejecución
    )
) else (
    echo Operación cancelada
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                  SISTEMA DETENIDO                         ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
pause
