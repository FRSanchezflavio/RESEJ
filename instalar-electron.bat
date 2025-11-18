@echo off
echo ================================================
echo   RE.SE.J - Instalador Electron
echo ================================================
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado
    echo Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Verificando Node.js...
node --version
npm --version
echo.

echo [2/4] Instalando dependencias principales...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo la instalacion de dependencias
    pause
    exit /b 1
)
echo.

echo [3/4] Instalando dependencias del Backend...
cd BACKEND
call npm install
cd ..
echo.

echo [4/4] Instalando dependencias del Frontend...
cd frontend
call npm install
cd ..
echo.

echo ================================================
echo   Instalacion completada con exito
echo ================================================
echo.
echo Ahora puedes:
echo   1. Compilar el frontend: npm run build:frontend
echo   2. Crear el ejecutable: npm run dist
echo   3. Probar en desarrollo: npm run electron:dev
echo.
pause
