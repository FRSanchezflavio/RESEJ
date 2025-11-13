@echo off
chcp 65001 >nul
color 0B
title Sistema RESEJ - Iniciando...

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║          SISTEMA RESEJ - INICIAR APLICACIÓN               ║
echo ║          Versión 1.0.0 - Policía de Tucumán               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Verificar que existe la carpeta BACKEND
if not exist "BACKEND\" (
    echo [✗] Error: No se encuentra la carpeta BACKEND
    echo Asegúrese de ejecutar este script desde la raíz del proyecto
    pause
    exit /b 1
)

REM Verificar que existe la carpeta frontend
if not exist "frontend\" (
    echo [✗] Error: No se encuentra la carpeta frontend
    pause
    exit /b 1
)

echo [1/3] Verificando servicios...
echo ════════════════════════════════════════════════════════════
echo.

REM Verificar PostgreSQL
echo Verificando PostgreSQL...
sc query postgresql-x64-15 >nul 2>&1
if %errorLevel% neq 0 (
    sc query postgresql-x64-14 >nul 2>&1
    if %errorLevel% neq 0 (
        sc query postgresql-x64-13 >nul 2>&1
        if %errorLevel% neq 0 (
            echo [!] No se pudo verificar el servicio de PostgreSQL
            echo     Asegúrese de que PostgreSQL esté en ejecución
        ) else (
            echo [✓] PostgreSQL detectado
        )
    ) else (
        echo [✓] PostgreSQL detectado
    )
) else (
    echo [✓] PostgreSQL detectado
)

echo.
echo [2/3] Iniciando Backend...
echo ════════════════════════════════════════════════════════════
echo.

REM Iniciar el backend en una nueva ventana
start "RESEJ - Backend API" cmd /k "cd BACKEND && echo Backend iniciado en puerto 3001 && echo. && npm start"

echo [✓] Backend iniciando...
echo     Espere unos segundos para que el servidor esté listo...
timeout /t 5 /nobreak >nul

echo.
echo [3/3] Iniciando Frontend...
echo ════════════════════════════════════════════════════════════
echo.

REM Iniciar el frontend en una nueva ventana
start "RESEJ - Frontend Web" cmd /k "cd frontend && echo Frontend iniciado en puerto 5173 && echo. && npm run dev"

echo [✓] Frontend iniciando...
timeout /t 3 /nobreak >nul

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║            SISTEMA RESEJ INICIADO CORRECTAMENTE           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │  INFORMACIÓN DE ACCESO:                                    │
echo ├────────────────────────────────────────────────────────────┤
echo │  Backend API:  http://localhost:3001                       │
echo │  Frontend Web: http://localhost:5173                       │
echo │                                                             │
echo │  El navegador se abrirá automáticamente en 5 segundos...  │
echo └────────────────────────────────────────────────────────────┘
echo.
echo ┌────────────────────────────────────────────────────────────┐
echo │  CREDENCIALES POR DEFECTO:                                 │
echo │  Usuario:   admin                                          │
echo │  Contraseña: admin123                                      │
echo │  (Cambie la contraseña después del primer acceso)         │
echo └────────────────────────────────────────────────────────────┘
echo.
echo [!] IMPORTANTE:
echo     - NO cierre las ventanas del Backend y Frontend
echo     - Para detener el sistema, cierre ambas ventanas
echo     - Los logs se guardan en BACKEND\logs\
echo.

REM Esperar 5 segundos y abrir el navegador
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo Para detener el sistema:
echo 1. Cierre la ventana "RESEJ - Backend API"
echo 2. Cierre la ventana "RESEJ - Frontend Web"
echo.
echo O ejecute: detener-sistema.bat
echo.
pause
