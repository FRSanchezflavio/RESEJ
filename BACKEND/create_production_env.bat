@echo off
rem Script sencillo para crear BACKEND\.env a partir del ejemplo
rem Este script NO almacena secretos en remoto. Debe editar los valores manualmente.

setlocal
set EXAMPLE_FILE=.env.production.example
set TARGET_FILE=.env

if not exist "%EXAMPLE_FILE%" (
  echo ERROR: No se encontró %EXAMPLE_FILE% en %cd%
  pause
  exit /b 1
)

if exist "%TARGET_FILE%" (
  echo Aviso: %TARGET_FILE% ya existe.
  echo Si desea reemplazarlo, borre %TARGET_FILE% y vuelva a ejecutar este script.
  pause
  exit /b 0
)

copy "%EXAMPLE_FILE%" "%TARGET_FILE%" >nul
if errorlevel 1 (
  echo ERROR: No se pudo copiar %EXAMPLE_FILE% a %TARGET_FILE%
  pause
  exit /b 1
)

echo Se creó %TARGET_FILE% a partir de %EXAMPLE_FILE% en %cd%
echo Abra %TARGET_FILE% y reemplace los valores PLACEHOLDER por sus credenciales reales.
echo Para editar ahora en Windows se abrirá el notepad.
start notepad "%TARGET_FILE%"

endlocal
exit /b 0