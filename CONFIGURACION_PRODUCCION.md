# 🔒 Guía de Configuración Segura para Producción

## ✅ Configuración Completada

El archivo `.env` ha sido configurado con claves de seguridad únicas para esta instalación.

---

## 🔐 Claves de Seguridad Generadas

Se han generado las siguientes claves de seguridad **únicas** para esta instalación:

- ✅ **JWT_SECRET** - Autenticación de usuarios
- ✅ **REFRESH_TOKEN_SECRET** - Tokens de renovación
- ✅ **SESSION_SECRET** - Seguridad de sesiones

⚠️ **IMPORTANTE:** Estas claves son confidenciales y específicas para esta instalación. **NO compartir**.

---

## 📋 Checklist de Configuración

### 1. Base de Datos PostgreSQL

```bash
# Conectar a PostgreSQL como superusuario
psql -U postgres

# Crear usuario
CREATE USER resej_user WITH PASSWORD 'tu_contraseña_segura_aqui';

# Crear base de datos
CREATE DATABASE resej_db OWNER resej_user;

# Dar permisos
GRANT ALL PRIVILEGES ON DATABASE resej_db TO resej_user;
\q

# Ejecutar migraciones
cd BACKEND
npm run migrate
```

**Actualizar en `.env`:**

```env
DB_PASSWORD=tu_contraseña_segura_aqui
```

### 2. Configuración de Email (Opcional)

Para **Gmail**:

1. Activar verificación en 2 pasos: https://myaccount.google.com/security
2. Generar contraseña de aplicación: https://myaccount.google.com/apppasswords
3. Copiar la contraseña generada

**Actualizar en `.env`:**

```env
EMAIL_USER=correo.institucional@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM="Sistema RESEJ Policía <correo.institucional@gmail.com>"
```

### 3. CORS - Acceso desde Red Local

Si necesita acceso desde otros dispositivos en la red:

1. Obtener IP del servidor:

```cmd
ipconfig
```

2. Agregar IPs permitidas en `.env`:

```env
ALLOWED_ORIGINS=http://localhost:3001,http://192.168.1.100:3001,http://192.168.1.101:3001
```

### 4. Verificar Configuración

```bash
# Ejecutar script de verificación
verificar-produccion.bat
```

Debe mostrar: ✅ **LISTO PARA PRODUCCIÓN**

---

## 🔒 Seguridad Post-Instalación

### Cambiar Contraseña del Administrador

1. Iniciar la aplicación
2. Login con: `admin` / `admin123`
3. Ir a **Perfil** → **Cambiar Contraseña**
4. Usar contraseña fuerte (mínimo 12 caracteres)

### Política de Contraseñas Seguras

- ✅ Mínimo 12 caracteres
- ✅ Mezcla de mayúsculas y minúsculas
- ✅ Números y símbolos especiales
- ✅ No usar información personal
- ✅ Diferente para cada usuario

**Ejemplo de contraseña segura:**

```
P0l1c14$R3s3j#2025!Segur@
```

---

## 📦 Backups Automáticos

### Configurar Backup de PostgreSQL

**Windows (Tarea Programada):**

1. Crear script `backup-db.bat`:

```batch
@echo off
set PGPASSWORD=tu_contraseña
set BACKUP_DIR=C:\Backups\RESEJ
set DATE=%date:~-4%%date:~3,2%%date:~0,2%
set TIME=%time:~0,2%%time:~3,2%

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

"C:\Program Files\PostgreSQL\14\bin\pg_dump.exe" -U resej_user -h localhost resej_db > "%BACKUP_DIR%\resej_db_%DATE%_%TIME%.sql"

echo Backup completado: %BACKUP_DIR%\resej_db_%DATE%_%TIME%.sql
```

2. Programar tarea diaria:

```cmd
# Ejecutar como Administrador
schtasks /create /tn "Backup RESEJ" /tr "C:\ruta\backup-db.bat" /sc daily /st 02:00
```

### Backup Manual

```bash
# Windows
"C:\Program Files\PostgreSQL\14\bin\pg_dump.exe" -U resej_user resej_db > backup_%date%.sql

# Restaurar si es necesario
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U resej_user resej_db < backup_20251104.sql
```

---

## 🌐 Configuración de Firewall

### Windows Firewall

Permitir acceso en puertos necesarios:

```powershell
# Ejecutar PowerShell como Administrador

# Backend (Puerto 3001)
New-NetFirewallRule -DisplayName "RESEJ Backend" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow

# PostgreSQL (Solo si se accede remotamente)
# New-NetFirewallRule -DisplayName "PostgreSQL" -Direction Inbound -LocalPort 5432 -Protocol TCP -Action Allow
```

---

## 📊 Monitoreo y Logs

### Ubicación de Logs

```
BACKEND/logs/
├── app.log          # Log general de la aplicación
├── error.log        # Errores
└── audit.log        # Auditoría de acciones
```

### Revisar Logs

```bash
# Ver últimas líneas del log
tail -f BACKEND/logs/app.log

# Buscar errores
findstr "ERROR" BACKEND\logs\app.log
```

### Logs en Base de Datos

Acceder desde la aplicación:

- **Administración** → **Logs de Auditoría**

Filtrar por:

- Usuario
- Acción
- Fecha/Hora
- IP de origen

---

## 🔧 Mantenimiento Regular

### Tareas Diarias

- [ ] Revisar logs de errores
- [ ] Verificar backups ejecutados
- [ ] Monitorear espacio en disco

### Tareas Semanales

- [ ] Revisar logs de auditoría
- [ ] Verificar usuarios activos
- [ ] Limpiar archivos temporales

### Tareas Mensuales

- [ ] Actualizar contraseñas críticas
- [ ] Revisar permisos de usuarios
- [ ] Verificar integridad de backups
- [ ] Actualizar sistema operativo
- [ ] Revisar logs de acceso

---

## 🚨 Procedimiento de Emergencia

### Si se Sospecha de Acceso No Autorizado

1. **Inmediato:**

   - Cambiar todas las contraseñas
   - Revisar logs de auditoría
   - Identificar IPs sospechosas

2. **Cambiar claves de seguridad:**

```bash
# Generar nuevas claves
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Actualizar en .env
JWT_SECRET=nueva_clave_generada
REFRESH_TOKEN_SECRET=otra_nueva_clave
SESSION_SECRET=otra_nueva_clave_mas

# Reiniciar aplicación
```

3. **Revocar todos los tokens activos:**
   - Todos los usuarios deberán volver a iniciar sesión

### Si la Base de Datos se Corrompe

1. Detener la aplicación
2. Restaurar desde último backup
3. Verificar integridad de datos
4. Reiniciar aplicación

---

## 📝 Variables de Entorno Críticas

### Ubicación

```
BACKEND/.env
```

### Variables que DEBE cambiar en cada instalación:

| Variable               | Propósito                        | Ejemplo                     |
| ---------------------- | -------------------------------- | --------------------------- |
| `DB_PASSWORD`          | Contraseña de PostgreSQL         | `M!Contr@s3ña$3gur@123`     |
| `JWT_SECRET`           | Firma de tokens de autenticación | (64+ caracteres aleatorios) |
| `REFRESH_TOKEN_SECRET` | Firma de refresh tokens          | (64+ caracteres aleatorios) |
| `SESSION_SECRET`       | Seguridad de sesiones            | (64+ caracteres aleatorios) |
| `EMAIL_PASSWORD`       | Contraseña de email              | `abcd efgh ijkl mnop`       |

### Generar Claves Seguras

```bash
# Node.js (Recomendado)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))

# Online (usar con precaución)
# https://www.random.org/strings/
```

---

## ✅ Verificación Final

Antes de poner en producción:

- [ ] ✅ PostgreSQL instalado y corriendo
- [ ] ✅ Base de datos creada y migrada
- [ ] ✅ Todas las claves secretas cambiadas
- [ ] ✅ Contraseña de admin cambiada
- [ ] ✅ Email configurado y probado
- [ ] ✅ Backups automáticos configurados
- [ ] ✅ Firewall configurado
- [ ] ✅ Script de verificación pasado
- [ ] ✅ Pruebas de funcionalidad realizadas
- [ ] ✅ Documentación entregada a usuarios
- [ ] ✅ Plan de soporte definido

---

## 📞 Soporte Técnico

### Verificar Estado del Sistema

```bash
# Verificar configuración
verificar-produccion.bat

# Verificar PostgreSQL
sc query postgresql-x64-14

# Verificar logs
type BACKEND\logs\app.log | more
```

### Comandos Útiles

```bash
# Reiniciar PostgreSQL
net stop postgresql-x64-14
net start postgresql-x64-14

# Ver procesos Node.js
tasklist | findstr node

# Matar proceso si no responde
taskkill /F /IM node.exe
```

---

## 📚 Referencias

- **PostgreSQL:** https://www.postgresql.org/docs/
- **Node.js Security:** https://nodejs.org/en/docs/guides/security/
- **JWT Best Practices:** https://tools.ietf.org/html/rfc8725
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/

---

## 🎓 Capacitación Recomendada

Para el personal IT:

1. Administración de PostgreSQL
2. Seguridad en aplicaciones Node.js
3. Manejo de backups y recuperación
4. Monitoreo y logs de sistemas

Para usuarios finales:

1. Uso básico de la aplicación
2. Políticas de contraseñas seguras
3. Procedimientos de reporte de incidentes

---

_Configuración completada el 4 de noviembre de 2025_  
_Sistema RESEJ - Versión 1.0.0 - Producción_
