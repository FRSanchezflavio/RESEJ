# 📦 Guía de Instalación para Dependencias Policiales - RESEJ

## 🎯 Introducción

Esta guía describe el proceso completo para instalar el Sistema RE.SE.J (Registro de Secuestros Judiciales) en una nueva dependencia policial.

---

## 📑 Tabla de Contenidos

1. [Preparación Previa](#preparación-previa)
2. [Opción A: Instalación Servidor Web Centralizado](#opción-a-instalación-servidor-web-centralizado)
3. [Opción B: Instalación Local por Dependencia](#opción-b-instalación-local-por-dependencia)
4. [Opción C: Instalación como Aplicación de Escritorio](#opción-c-instalación-como-aplicación-de-escritorio)
5. [Configuración Post-Instalación](#configuración-post-instalación)
6. [Verificación de la Instalación](#verificación-de-la-instalación)
7. [Solución de Problemas](#solución-de-problemas)

---

## 📋 Preparación Previa

### 1. Verificar Requisitos del Sistema

Antes de comenzar, asegúrese de cumplir con los [Requisitos del Sistema](./REQUISITOS_SISTEMA.md).

### 2. Obtener el Paquete de Instalación

Puede obtener el sistema de dos formas:

**A) Descarga directa:**
- Solicite el paquete comprimido `RESEJ-v1.0.0.zip` al equipo de desarrollo
- Verifique que el archivo tenga aproximadamente 50-100 MB

**B) Desde repositorio Git:**
```bash
git clone https://github.com/FRSanchezflavio/RESEJ.git
cd RESEJ
```

### 3. Preparar Credenciales

Tendrá que configurar:
- ✅ Usuario y contraseña de PostgreSQL
- ✅ Credenciales de administrador del sistema
- ✅ Configuración de email (opcional)
- ✅ Secret keys para JWT

---

## 🌐 Opción A: Instalación Servidor Web Centralizado

**Recomendado para:** Múltiples dependencias accediendo a un servidor central.

### Paso 1: Preparar el Servidor

```bash
# En Windows (PowerShell como Administrador)
# O en Linux/Ubuntu

# 1. Crear directorio de instalación
mkdir C:\RESEJ-Server
cd C:\RESEJ-Server

# 2. Descomprimir el paquete
# (Si descargó el .zip, extráigalo aquí)
```

### Paso 2: Instalar PostgreSQL

```bash
# Descargar e instalar PostgreSQL desde:
# https://www.postgresql.org/download/

# Configurar durante la instalación:
# - Puerto: 5432
# - Contraseña del superusuario: [su contraseña segura]
```

### Paso 3: Crear la Base de Datos

```bash
# Abrir pgAdmin o psql
# Ejecutar los siguientes scripts en orden:

psql -U postgres
```

```sql
-- Crear la base de datos
CREATE DATABASE resej_db;

-- Crear usuario dedicado
CREATE USER resej_user WITH ENCRYPTED PASSWORD 'SuContraseñaSegura123!';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE resej_db TO resej_user;

-- Salir
\q
```

### Paso 4: Configurar Variables de Entorno (Backend)

```bash
cd BACKEND
cp .env.example .env
```

Editar el archivo `.env`:

```env
# Configuración del Servidor
NODE_ENV=production
PORT=3001

# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resej_db
DB_USER=resej_user
DB_PASSWORD=SuContraseñaSegura123!

# Seguridad - JWT
JWT_SECRET=genere_una_clave_secreta_aleatoria_muy_larga_aqui
JWT_EXPIRES_IN=8h

# Configuración de Archivos
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=su-email@gmail.com
SMTP_PASSWORD=su-contraseña-de-aplicacion
EMAIL_FROM=noreply@resej.gob.ar

# URL del Frontend
FRONTEND_URL=http://localhost:3000
```

### Paso 5: Instalar Dependencias del Backend

```bash
# Dentro de la carpeta BACKEND
npm install
```

### Paso 6: Ejecutar Migraciones de la Base de Datos

```bash
# Crear las tablas
npm run migrate:latest

# (Opcional) Cargar datos de ejemplo
npm run seed:run
```

### Paso 7: Configurar el Frontend

```bash
cd ../frontend
```

Crear archivo `.env` en la carpeta `frontend`:

```env
VITE_API_URL=http://[IP-DEL-SERVIDOR]:3001/api
```

### Paso 8: Compilar el Frontend para Producción

```bash
npm install
npm run build
```

### Paso 9: Iniciar el Sistema

**Opción 1: Modo Desarrollo (para pruebas)**
```bash
# Desde la raíz del proyecto
npm install
npm start
```

**Opción 2: Modo Producción**
```bash
# Terminal 1 - Backend
cd BACKEND
npm start

# Terminal 2 - Servir el frontend (usar un servidor web)
# Opción A: Usar serve
npm install -g serve
cd frontend/dist
serve -s . -p 3000

# Opción B: Usar nginx o Apache (configuración más avanzada)
```

### Paso 10: Configurar como Servicio de Windows (Producción)

Para que el sistema se inicie automáticamente:

```bash
# Instalar node-windows
npm install -g node-windows

# Crear script de servicio (guardar como install-service.js)
```

Crear archivo `install-service.js`:

```javascript
const Service = require('node-windows').Service;

// Backend Service
const backendSvc = new Service({
  name: 'RESEJ Backend',
  description: 'Backend del Sistema RESEJ',
  script: 'C:\\RESEJ-Server\\BACKEND\\server.js',
  nodeOptions: ['--max_old_space_size=4096']
});

backendSvc.on('install', () => {
  backendSvc.start();
});

backendSvc.install();
```

```bash
node install-service.js
```

### Paso 11: Configurar Acceso desde Otras Dependencias

En cada estación de trabajo de las dependencias:

1. Abrir navegador web
2. Ir a: `http://[IP-DEL-SERVIDOR]:3000`
3. Iniciar sesión con las credenciales proporcionadas

**Configurar IP estática en el servidor:**
- Panel de Control → Red → Adaptador de red → Propiedades IPv4
- Asignar IP fija (ej: 192.168.1.100)

**Abrir puertos en el firewall del servidor:**
```bash
# Windows Firewall
netsh advfirewall firewall add rule name="RESEJ Backend" dir=in action=allow protocol=TCP localport=3001
netsh advfirewall firewall add rule name="RESEJ Frontend" dir=in action=allow protocol=TCP localport=3000
```

---

## 💻 Opción B: Instalación Local por Dependencia

**Recomendado para:** Dependencias que operan de forma autónoma sin conexión al servidor central.

### Pasos Resumidos

Repetir los pasos 1-9 de la Opción A en cada computadora de la dependencia.

**Diferencias clave:**
- No es necesario configurar acceso remoto
- Usar `localhost` en todas las configuraciones
- Cada dependencia tiene su propia base de datos independiente

### Script de Instalación Automatizada

Crear archivo `instalar-local.bat`:

```batch
@echo off
echo ========================================
echo   Instalacion RESEJ - Dependencia Local
echo ========================================
echo.

echo [1/6] Verificando Node.js...
node --version || (
    echo ERROR: Node.js no esta instalado
    echo Descargue desde: https://nodejs.org/
    pause
    exit /b 1
)

echo [2/6] Verificando PostgreSQL...
psql --version || (
    echo ERROR: PostgreSQL no esta instalado
    echo Descargue desde: https://www.postgresql.org/
    pause
    exit /b 1
)

echo [3/6] Instalando dependencias del Backend...
cd BACKEND
call npm install

echo [4/6] Configurando base de datos...
call npm run migrate:latest
call npm run seed:run

echo [5/6] Instalando dependencias del Frontend...
cd ../frontend
call npm install

echo [6/6] Compilando Frontend...
call npm run build

echo.
echo ========================================
echo   Instalacion Completada!
echo ========================================
echo.
echo Para iniciar el sistema, ejecute:
echo   iniciar-sistema.bat
echo.
pause
```

Crear archivo `iniciar-sistema.bat`:

```batch
@echo off
title Sistema RESEJ
echo Iniciando Sistema RESEJ...
echo.

start "RESEJ Backend" cmd /k "cd BACKEND && npm start"
timeout /t 5

start "RESEJ Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Sistema iniciado!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
```

---

## 🖥️ Opción C: Instalación como Aplicación de Escritorio

**Recomendado para:** Instalación simple y rápida sin configuración de servidor.

### Paso 1: Construir la Aplicación Electron

En la máquina de desarrollo:

```bash
# Desde la raíz del proyecto
npm install
npm run electron:build:win
```

Esto generará un instalador en `dist/Sistema RESEJ Policía-Setup-1.0.0.exe`

### Paso 2: Distribuir el Instalador

1. Copiar el archivo `.exe` a un USB o compartirlo por red
2. En cada dependencia:
   - Ejecutar el instalador como Administrador
   - Seguir el asistente de instalación
   - El instalador creará un acceso directo en el escritorio

### Paso 3: Configuración Inicial

Al iniciar por primera vez:

1. La aplicación solicitará configurar PostgreSQL
2. Ingresar las credenciales de la base de datos
3. El sistema creará automáticamente las tablas necesarias

---

## ⚙️ Configuración Post-Instalación

### 1. Crear Usuario Administrador

```bash
# Opción A: Usando los seeds predefinidos
cd BACKEND
npm run seed:run

# Opción B: Crear manualmente via SQL
psql -U resej_user -d resej_db
```

```sql
-- Insertar administrador (la contraseña será hasheada automáticamente al iniciar sesión)
INSERT INTO usuarios (username, password, rol, activo) 
VALUES ('admin', '$2b$10$...', 'admin', true);
```

### 2. Configurar Datos de la Dependencia

Editar en la interfaz web o directamente en la base de datos:

```sql
-- Configurar información de la comisaría
UPDATE configuracion SET 
  dependencia_nombre = 'Comisaría Primera',
  dependencia_codigo = 'COM01',
  ubicacion = 'Dirección de la comisaría',
  telefono = '381-1234567';
```

### 3. Configurar Respaldos Automáticos

Crear script `backup-db.bat`:

```batch
@echo off
set BACKUP_DIR=C:\RESEJ-Backups
set DATE=%date:~-4,4%%date:~-7,2%%date:~-10,2%
set TIME=%time:~0,2%%time:~3,2%%time:~6,2%
set FILENAME=resej_backup_%DATE%_%TIME%.sql

mkdir %BACKUP_DIR% 2>nul

pg_dump -U resej_user -h localhost resej_db > "%BACKUP_DIR%\%FILENAME%"

echo Backup creado: %FILENAME%
```

Programar con el Programador de Tareas de Windows (diario a las 2:00 AM).

### 4. Crear Usuarios para el Personal

Acceder como administrador y crear usuarios:

1. Ir a "Administración" → "Usuarios"
2. Crear usuario con rol apropiado:
   - **Admin:** Acceso total
   - **Operador:** Crear y editar registros
   - **Consulta:** Solo lectura

---

## ✅ Verificación de la Instalación

### Script de Verificación

```bash
cd BACKEND
node verificar-sistema.js
```

### Checklist Manual

- [ ] PostgreSQL está en ejecución
- [ ] Backend responde en `http://localhost:3001/api/health`
- [ ] Frontend carga correctamente
- [ ] Login funciona con usuario admin
- [ ] Se pueden crear registros
- [ ] Los archivos se suben correctamente
- [ ] Los logs se generan en `/BACKEND/logs`

### Prueba de Conectividad (Servidor Central)

Desde otra computadora en la red:

```bash
# Probar conexión al backend
curl http://[IP-DEL-SERVIDOR]:3001/api/health

# O abrir en navegador:
http://[IP-DEL-SERVIDOR]:3000
```

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to database"

**Solución:**
```bash
# 1. Verificar que PostgreSQL esté corriendo
# Windows:
services.msc
# Buscar "postgresql" y verificar que esté iniciado

# 2. Verificar credenciales en .env
# 3. Probar conexión manual:
psql -U resej_user -d resej_db -h localhost
```

### Error: "Port 3001 already in use"

**Solución:**
```bash
# Windows - Encontrar y terminar proceso
netstat -ano | findstr :3001
taskkill /PID [número_de_proceso] /F

# O cambiar el puerto en .env
PORT=3002
```

### Error: "npm command not found"

**Solución:**
1. Instalar Node.js desde https://nodejs.org/
2. Reiniciar la terminal
3. Verificar: `node --version`

### Frontend no carga

**Solución:**
```bash
# 1. Verificar que el backend esté corriendo
curl http://localhost:3001/api/health

# 2. Limpiar caché y reconstruir
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

### No se pueden subir archivos

**Solución:**
```bash
# 1. Verificar permisos de la carpeta uploads
# Windows: Click derecho → Propiedades → Seguridad
# Dar permisos de escritura al usuario que corre el servicio

# 2. Verificar configuración en .env
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

---

## 📞 Soporte y Capacitación

### Recursos Disponibles

- 📖 [Manual de Usuario](./MANUAL_USUARIO.md) (próximamente)
- 🎥 Videos tutoriales: [Link a videos] (próximamente)
- 📧 Email: soporte@resej.gob.ar
- ☎️ Teléfono: [Número de contacto]

### Capacitación del Personal

Se recomienda capacitar al personal en:

1. **Nivel Básico (2 horas)**
   - Login y navegación
   - Crear registros
   - Buscar y consultar

2. **Nivel Intermedio (4 horas)**
   - Gestión de archivos
   - Reportes
   - Gestión de usuarios

3. **Nivel Administrador (8 horas)**
   - Instalación y configuración
   - Backups y restauración
   - Resolución de problemas

---

## 📄 Checklist Final de Instalación

Completar antes de poner en producción:

- [ ] Sistema instalado y funcionando
- [ ] Base de datos creada y migrada
- [ ] Usuario administrador creado
- [ ] Datos de la dependencia configurados
- [ ] Respaldos automáticos programados
- [ ] Personal capacitado
- [ ] Documentación entregada
- [ ] Pruebas de funcionalidad realizadas
- [ ] Plan de contingencia documentado
- [ ] Información de contacto de soporte disponible

---

## 📋 Registro de Instalación

**Dependencia:** _______________________________________________  
**Fecha de Instalación:** _______________________________________________  
**Instalado por:** _______________________________________________  
**Versión del Sistema:** 1.0.0  
**Tipo de Instalación:** [ ] Servidor Central [ ] Local [ ] Electron  
**IP del Servidor:** _______________________________________________  
**Usuarios Creados:** _______________________________________________  
**Observaciones:** _______________________________________________  

---

**Última actualización:** 12 de noviembre de 2025  
**Versión del documento:** 1.0
