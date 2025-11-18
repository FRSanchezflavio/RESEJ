@echo off
setlocal enabledelayedexpansion

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║        RE.SE.J - PROCESO COMPLETO DE EMPAQUETADO             ║
echo ║                                                               ║
echo ╔═══════════════════════════════════════════════════════════════╝
echo.

REM Verificar que estamos en la carpeta correcta
if not exist "package.json" (
    echo [ERROR] No se encontro package.json
    echo Ejecuta este script desde la carpeta raiz del proyecto
    pause
    exit /b 1
)

echo Este script realizara TODO el proceso de empaquetado:
echo.
echo [1] Verificar Node.js y npm
echo [2] Instalar dependencias (raiz, backend, frontend)
echo [3] Compilar frontend
echo [4] Crear ejecutables con Electron
echo.
echo Esto puede tomar 10-15 minutos dependiendo de tu conexion.
echo.

choice /C SN /M "¿Deseas continuar? (S=Si, N=No)"
if errorlevel 2 exit /b 0

echo.
echo ═══════════════════════════════════════════════════════════════
echo   PASO 1/4: Verificando Node.js
echo ═══════════════════════════════════════════════════════════════
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado
    echo Descarga e instala desde: https://nodejs.org/
    pause
    exit /b 1
)

node --version
npm --version
echo [OK] Node.js y npm disponibles
echo.
timeout /t 2 /nobreak >nul

echo.
echo ═══════════════════════════════════════════════════════════════
echo   PASO 2/4: Instalando Dependencias
echo ═══════════════════════════════════════════════════════════════
echo.

REM Instalar dependencias raiz
echo [2.1] Instalando dependencias raiz...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo instalacion raiz
    pause
    exit /b 1
)
echo [OK] Dependencias raiz instaladas
echo.

REM Instalar dependencias backend
echo [2.2] Instalando dependencias backend...
cd BACKEND
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo instalacion backend
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Dependencias backend instaladas
echo.

REM Instalar dependencias frontend
echo [2.3] Instalando dependencias frontend...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo instalacion frontend
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Dependencias frontend instaladas
echo.
timeout /t 2 /nobreak >nul

echo.
echo ═══════════════════════════════════════════════════════════════
echo   PASO 3/4: Compilando Frontend
echo ═══════════════════════════════════════════════════════════════
echo.

cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo compilacion frontend
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend compilado en: frontend\dist\
echo.
timeout /t 2 /nobreak >nul

REM Verificar que el build existe
if not exist "frontend\dist\index.html" (
    echo [ERROR] No se genero frontend\dist\index.html
    echo La compilacion pudo fallar
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   PASO 4/4: Creando Ejecutables con Electron
echo ═══════════════════════════════════════════════════════════════
echo.
echo Este proceso puede tomar 5-10 minutos...
echo Por favor, NO cierres esta ventana.
echo.

call npm run dist
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Fallo la creacion de ejecutables
    echo.
    echo Posibles causas:
    echo - Falta espacio en disco
    echo - Antivirus bloqueando electron-builder
    echo - Error en la configuracion
    echo.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   ✅ PROCESO COMPLETADO CON EXITO
echo ═══════════════════════════════════════════════════════════════
echo.

REM Mostrar archivos generados
if exist "dist-electron" (
    echo Archivos generados en: dist-electron\
    echo.
    dir dist-electron\*.exe /b
    echo.
    
    REM Calcular tamaños
    for %%f in (dist-electron\*.exe) do (
        set "size=0"
        for /f "tokens=3" %%a in ('dir "%%f" ^| findstr /C:"%%~nxf"') do set "size=%%a"
        echo   %%~nxf - !size! bytes
    )
) else (
    echo [ADVERTENCIA] No se encontro la carpeta dist-electron
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo   PROXIMO PASO: Distribucion
echo ═══════════════════════════════════════════════════════════════
echo.
echo Los ejecutables estan listos para distribuir.
echo.
echo Para instalar en otra PC:
echo   1. Copiar el archivo RESEJ-Setup-1.0.0.exe
echo   2. Instalar PostgreSQL en la PC destino
echo   3. Ejecutar el instalador
echo   4. Configurar .env con: configurar-env.bat
echo   5. Crear base de datos
echo   6. Ejecutar migraciones
echo.
echo Ver POSTINSTALACION.md para instrucciones detalladas.
echo.

REM Preguntar si abrir la carpeta
choice /C SN /M "¿Deseas abrir la carpeta dist-electron? (S=Si, N=No)"
if errorlevel 2 goto :END

explorer dist-electron

:END
echo.
echo Presiona cualquier tecla para salir...
pause >nul
