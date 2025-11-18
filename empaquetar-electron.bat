@echo off
echo ================================================
echo   RE.SE.J - Empaquetador Electron
echo ================================================
echo.

echo [1/3] Compilando Frontend...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo la compilacion del frontend
    pause
    exit /b 1
)
cd ..
echo.

echo [2/3] Verificando archivos...
if not exist "frontend\dist\index.html" (
    echo [ERROR] No se encontro frontend\dist\index.html
    echo Verifica que la compilacion haya sido exitosa
    pause
    exit /b 1
)
echo [OK] Frontend compilado correctamente
echo.

echo [3/3] Creando ejecutables...
echo Esto puede tomar varios minutos...
call npm run dist
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo el empaquetado
    pause
    exit /b 1
)
echo.

echo ================================================
echo   Empaquetado completado
echo ================================================
echo.
echo Los archivos se encuentran en: dist-electron\
echo.
echo Archivos generados:
dir dist-electron\*.exe /b
echo.
pause
