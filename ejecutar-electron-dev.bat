@echo off
echo ================================================
echo   RE.SE.J - Modo Desarrollo Electron
echo ================================================
echo.

REM Verificar que las dependencias esten instaladas
if not exist "node_modules" (
    echo [ERROR] Dependencias no instaladas
    echo Ejecuta primero: instalar-electron.bat
    pause
    exit /b 1
)

echo Iniciando aplicacion en modo desarrollo...
echo.
echo IMPORTANTE:
echo - El backend se iniciara automaticamente
echo - El frontend debe estar corriendo en http://localhost:5173
echo - Abre otra terminal y ejecuta: cd frontend ^&^& npm run dev
echo.
echo Presiona CTRL+C para detener
echo.

set NODE_ENV=development
call npm run electron

pause
