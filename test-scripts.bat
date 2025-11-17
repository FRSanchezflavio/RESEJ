@echo off
echo ============================================
echo TEST DE SCRIPTS RESEJ
echo ============================================
echo.

echo [1/4] Verificando archivos necesarios...
if exist "iniciar-backend.bat" (
    echo   [OK] iniciar-backend.bat encontrado
) else (
    echo   [ERROR] iniciar-backend.bat NO encontrado
)

if exist "iniciar-frontend.bat" (
    echo   [OK] iniciar-frontend.bat encontrado
) else (
    echo   [ERROR] iniciar-frontend.bat NO encontrado
)

if exist "BACKEND\server.js" (
    echo   [OK] BACKEND\server.js encontrado
) else (
    echo   [ERROR] BACKEND\server.js NO encontrado
)

if exist "frontend\node_modules\.bin\vite.cmd" (
    echo   [OK] Vite instalado en frontend
) else (
    echo   [ERROR] Vite NO instalado. Ejecuta: cd frontend ^&^& npm install
)

echo.
echo [2/4] Verificando PowerShell...
powershell -NoProfile -Command "Write-Host '  [OK] PowerShell disponible'" 2>nul
if %errorlevel% neq 0 (
    echo   [ERROR] PowerShell no disponible
)

echo.
echo [3/4] Probando conexion a localhost (simulando espera de Vite)...
echo   Nota: Este test fallara si Vite no esta corriendo, es normal.
powershell -NoProfile -Command "$progressPreference='silentlyContinue'; try { $r = Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 2; Write-Host '  [OK] Vite respondiendo en puerto 5173' -ForegroundColor Green } catch { Write-Host '  [INFO] Vite no esta corriendo (esperado si no iniciaste la app)' -ForegroundColor Yellow }"

echo.
echo [4/4] Estructura del proyecto:
tree /F /A . 2>nul | findstr /V ".git node_modules" | head -20

echo.
echo ============================================
echo TEST COMPLETADO
echo ============================================
echo.
echo Para iniciar la aplicacion completa:
echo   Ejecuta: iniciar-app-completa.bat
echo.
pause
