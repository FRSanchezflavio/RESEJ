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
echo ESPERANDO A QUE VITE COMPILE LA APLICACION...
echo ==================================================
echo.
echo Vite tarda aproximadamente 30 segundos en la primera compilacion.
echo Por favor espera...
echo.

REM Esperar 30 segundos con contador regresivo
for /L %%i in (30,-1,1) do (
    echo   Tiempo restante: %%i segundos...
    timeout /t 1 /nobreak >nul
)

echo.
echo *** Abriendo navegador ahora ***
echo.

:OPEN_BROWSER
start "" "%FRONTEND_URL%"

echo.
echo ==================================================
echo APLICACION INICIADA CORRECTAMENTE
echo ==================================================
echo.
echo - Backend:  http://localhost:3000
echo - Frontend: http://localhost:5173
echo.
echo IMPORTANTE:
echo - Si ves error 404, espera 10 segundos y presiona F5
echo - Las 2 ventanas de terminal deben permanecer abiertas
echo.
echo Para detener la aplicacion:
echo   Cierra las 2 ventanas de terminal (Backend y Frontend)
echo ==================================================
echo.

echo Ambos procesos se estan ejecutando en ventanas separadas.
echo Cierra esas ventanas para detener los servicios.

pause
endlocal
