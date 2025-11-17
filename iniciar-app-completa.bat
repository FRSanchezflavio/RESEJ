@echo off
setlocal

set ROOT_DIR=%~dp0
set BACKEND_SCRIPT=%ROOT_DIR%iniciar-backend.bat
set FRONTEND_SCRIPT=%ROOT_DIR%iniciar-frontend.bat
set FRONTEND_BASE=http://localhost:5173
set FRONTEND_URL=%FRONTEND_BASE%
set MAX_RETRIES=20
set RETRY_DELAY=3

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
start "RESEJ Frontend" cmd /k call "%FRONTEND_SCRIPT%"

echo Esperando a que el frontend quede listo en %FRONTEND_BASE% ...
echo (Esto puede tomar 30-60 segundos mientras Vite compila...)
set /a RETRY_COUNT=0

:WAIT_FOR_FRONTEND
echo Intento %RETRY_COUNT%/%MAX_RETRIES% - Verificando si Vite responde...
curl -s -o nul -w "%%{http_code}" %FRONTEND_BASE% 2>nul | findstr "200" >nul
if %errorlevel%==0 (
    echo Frontend detectado y listo!
    goto OPEN_BROWSER
)

set /a RETRY_COUNT+=1
if %RETRY_COUNT% GEQ %MAX_RETRIES% (
    echo Tiempo de espera agotado. Abriendo navegador de todas formas...
    goto OPEN_BROWSER
)
timeout /t %RETRY_DELAY% /nobreak >nul
goto WAIT_FOR_FRONTEND

:OPEN_BROWSER
echo.
echo Abriendo la app en el navegador predeterminado (%FRONTEND_URL%)
start "" "%FRONTEND_URL%"

echo Ambos procesos se estan ejecutando en ventanas separadas.
echo Cierra esas ventanas para detener los servicios.

pause
endlocal
