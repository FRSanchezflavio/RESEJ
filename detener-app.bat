@echo off
echo ==================================================
echo   Deteniendo RESEJ (Backend + Frontend)
echo ==================================================
echo.

echo Buscando procesos de Node.js en puerto 3000 (Backend)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Deteniendo proceso %%a
    taskkill /PID %%a /F >nul 2>&1
)

echo Buscando procesos de Node.js en puerto 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    echo Deteniendo proceso %%a
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo ==================================================
echo Servicios detenidos correctamente
echo ==================================================
echo.
pause
