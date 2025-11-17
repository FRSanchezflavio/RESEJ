@echo off
setlocal

set ROOT_DIR=%~dp0
set BACKEND_SCRIPT=%ROOT_DIR%iniciar-backend.bat
set FRONTEND_SCRIPT=%ROOT_DIR%iniciar-frontend.bat
set FRONTEND_URL=http://localhost:5173

if not exist "%BACKEND_SCRIPT%" (
    echo No se encontro iniciar-backend.bat en %ROOT_DIR%.
    echo Crea el script o vuelve a clonar el repositorio.
    pause
    exit /b 1
)

if not exist "%FRONTEND_SCRIPT%" (
    echo No se encontro iniciar-frontend.bat en %ROOT_DIR%.
    echo Crea el script o vuelve a clonar el repositorio.
    pause
    exit /b 1
)

echo ==================================================
echo   Lanzando RESEJ (backend + frontend)
echo   Se abriran dos ventanas de terminal separadas.
echo ==================================================

start "RESEJ Backend" cmd /k call "%BACKEND_SCRIPT%"
echo Backend iniciado, esperando 3 segundos...
timeout /t 3 /nobreak >nul

start "RESEJ Frontend" cmd /k call "%FRONTEND_SCRIPT%"

echo.
echo ==================================================
echo IMPORTANTE: Vite necesita tiempo para compilar
echo.
echo El navegador se abrira en 20 segundos.
echo Por favor NO cierres esta ventana.
echo.
echo Contador:
echo ==================================================

REM Contador visual
for /L %%i in (20,-1,1) do (
    echo   Abriendo navegador en %%i segundos...
    timeout /t 1 /nobreak >nul
)

echo.
echo Listo! Abriendo navegador ahora...

:OPEN_BROWSER
echo.
echo Abriendo %FRONTEND_URL% en el navegador...
echo.
start "" "%FRONTEND_URL%"

echo.
echo ==================================================
echo APLICACION INICIADA
echo ==================================================
echo.
echo - Backend corriendo en: http://localhost:3000
echo - Frontend corriendo en: http://localhost:5173
echo.
echo Si aun ves error 404 en el navegador:
echo   Espera 5-10 segundos mas y presiona F5
echo.
echo Para detener los servicios:
echo   Cierra las 2 ventanas de terminal que se abrieron
echo ==================================================
echo.

echo Ambos procesos se estan ejecutando en ventanas separadas.
echo Cierra esas ventanas para detener los servicios.

pause
endlocal
