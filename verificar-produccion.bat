@echo off
chcp 65001 >nul
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║     Verificación de Configuración de Producción - RESEJ      ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

cd BACKEND

echo 🔍 Verificando archivo .env...
echo.

if not exist ".env" (
    echo ❌ ERROR: Archivo .env no encontrado
    echo.
    echo 💡 Solución:
    echo    1. Copie .env.example a .env
    echo    2. O copie .env.production a .env
    echo    3. Configure las variables necesarias
    echo.
    pause
    exit /b 1
)

echo ✅ Archivo .env encontrado
echo.

echo ═══════════════════════════════════════════════════════════════
echo  VERIFICANDO CONFIGURACIONES CRÍTICAS
echo ═══════════════════════════════════════════════════════════════
echo.

:: Variables para tracking
set "WARNINGS=0"
set "ERRORS=0"
set "CHECKS=0"

:: Función para verificar variable
call :check_var "NODE_ENV" "production"
call :check_var "PORT" "3001"

echo.
echo ─────────────────────────────────────────────────────────────
echo  🗄️  BASE DE DATOS
echo ─────────────────────────────────────────────────────────────
echo.

call :check_exists "DB_HOST"
call :check_exists "DB_PORT"
call :check_exists "DB_NAME"
call :check_exists "DB_USER"
call :check_secret "DB_PASSWORD" "30101995" "ADVERTENCIA: Usando contraseña por defecto"

echo.
echo ─────────────────────────────────────────────────────────────
echo  🔐 SEGURIDAD JWT
echo ─────────────────────────────────────────────────────────────
echo.

call :check_secret "JWT_SECRET" "your_super_secure" "CRÍTICO: JWT_SECRET debe cambiarse"
call :check_secret "REFRESH_TOKEN_SECRET" "your_super_secure" "CRÍTICO: REFRESH_TOKEN_SECRET debe cambiarse"
call :check_secret "SESSION_SECRET" "session" "CRÍTICO: SESSION_SECRET debe cambiarse"

echo.
echo ─────────────────────────────────────────────────────────────
echo  📧 EMAIL
echo ─────────────────────────────────────────────────────────────
echo.

call :check_secret "EMAIL_USER" "tu-correo" "Configurar email institucional"
call :check_secret "EMAIL_PASSWORD" "tu-contraseña" "Configurar contraseña de email"

echo.
echo ─────────────────────────────────────────────────────────────
echo  🌐 CORS y URLs
echo ─────────────────────────────────────────────────────────────
echo.

call :check_exists "ALLOWED_ORIGINS"
call :check_exists "FRONTEND_URL"

echo.
echo ═══════════════════════════════════════════════════════════════
echo  RESUMEN DE VERIFICACIÓN
echo ═══════════════════════════════════════════════════════════════
echo.

echo Total de verificaciones: %CHECKS%
echo.

if %ERRORS% GTR 0 (
    echo ❌ ERRORES CRÍTICOS: %ERRORS%
    echo    ⚠️  Debe corregir estos errores antes de usar en producción
)

if %WARNINGS% GTR 0 (
    echo ⚠️  ADVERTENCIAS: %WARNINGS%
    echo    💡 Se recomienda corregir antes de producción
)

if %ERRORS% EQU 0 if %WARNINGS% EQU 0 (
    echo ✅ Todas las verificaciones pasaron correctamente
    echo.
    echo ╔═══════════════════════════════════════════════════════════════╗
    echo ║              ✅ LISTO PARA PRODUCCIÓN                         ║
    echo ╚═══════════════════════════════════════════════════════════════╝
)

echo.
echo ═══════════════════════════════════════════════════════════════
echo  RECOMENDACIONES FINALES
echo ═══════════════════════════════════════════════════════════════
echo.

echo 1. 🔒 Cambiar contraseña del usuario admin después del primer login
echo 2. 📦 Configurar backups automáticos de PostgreSQL
echo 3. 🔍 Revisar logs regularmente en: BACKEND/logs/
echo 4. 🔄 Actualizar ALLOWED_ORIGINS con todas las IPs necesarias
echo 5. 📧 Probar envío de emails con: npm run test:email
echo 6. 🗄️  Ejecutar migraciones: npm run migrate
echo 7. 🧪 Crear usuario de prueba y verificar funcionalidad
echo 8. 🔐 Verificar que PostgreSQL esté corriendo
echo.

cd ..
pause
exit /b %ERRORS%

:: ========== FUNCIONES ==========

:check_var
set /p temp=< BACKEND\.env | findstr /C:"%~1=%~2" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  %~1 no está configurado como "%~2"
    set /a WARNINGS+=1
) else (
    echo ✅ %~1 = %~2
)
set /a CHECKS+=1
goto :eof

:check_exists
findstr /B /C:"%~1=" .env >nul 2>&1
if errorlevel 1 (
    echo ❌ %~1 NO está configurado
    set /a ERRORS+=1
) else (
    for /f "tokens=2 delims==" %%a in ('findstr /B /C:"%~1=" .env') do (
        echo ✅ %~1 = %%a
    )
)
set /a CHECKS+=1
goto :eof

:check_secret
findstr /B /C:"%~1=" .env | findstr /C:"%~2" >nul 2>&1
if not errorlevel 1 (
    echo ❌ %~1 - %~3
    set /a ERRORS+=1
) else (
    echo ✅ %~1 está configurado
)
set /a CHECKS+=1
goto :eof
