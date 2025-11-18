# Guía de Empaquetado con Electron - RE.SE.J

## 📦 Descripción

Esta aplicación empaqueta el sistema RE.SE.J completo (frontend + backend) en un ejecutable de escritorio usando Electron.

## 🔧 Requisitos Previos

### En la computadora de desarrollo:
1. **Node.js** (v18 o superior)
2. **PostgreSQL** instalado y en ejecución
3. Dependencias del proyecto instaladas

### En la computadora nueva (donde se instalará):
1. **PostgreSQL** instalado y configurado
2. Base de datos creada según instrucciones en `BACKEND/CONFIGURAR_BD.md`

## 🚀 Pasos para Empaquetar

### 1. Instalar Dependencias

```bash
# En la raíz del proyecto
npm install

# Esto automáticamente instalará también las dependencias de BACKEND y frontend
```

### 2. Construir el Frontend

```bash
npm run build:frontend
```

Este comando compila el frontend de React en archivos estáticos optimizados.

### 3. Crear el Ejecutable

**Opción A: Crear instalador NSIS + Portable**
```bash
npm run dist
```

**Opción B: Solo para Windows**
```bash
npm run dist:win
```

**Opción C: Crear carpeta sin instalador (más rápido para pruebas)**
```bash
npm run pack
```

### 4. Encontrar los Archivos Generados

Los archivos se crearán en la carpeta `dist-electron/`:

- **Instalador**: `RESEJ-Setup-1.0.0.exe` (instalador tradicional)
- **Portable**: `RESEJ-Portable-1.0.0.exe` (no requiere instalación)

## 📁 Estructura del Empaquetado

El ejecutable incluye:
```
RESEJ/
├── electron-main.js           # Proceso principal de Electron
├── electron-preload.js        # Script de seguridad
├── BACKEND/                   # Todo el código del backend
│   ├── server.js
│   ├── .env.example          # Plantilla de configuración
│   ├── src/
│   └── node_modules/         # Dependencias del backend
└── frontend/
    └── dist/                 # Frontend compilado (HTML/CSS/JS)
```

## ⚙️ Configuración en la Computadora Nueva

### 1. Instalar PostgreSQL

Descarga e instala PostgreSQL desde: https://www.postgresql.org/download/

**Durante la instalación:**
- Elige una contraseña para el usuario `postgres`
- Puerto predeterminado: `5432`

### 2. Crear la Base de Datos

Abre pgAdmin 4 o usa la terminal:

```sql
-- Crear usuario
CREATE USER resej_user WITH PASSWORD 'tu_contraseña_segura';

-- Crear base de datos
CREATE DATABASE resej_db OWNER resej_user;

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE resej_db TO resej_user;
```

También puedes usar los scripts SQL en `BACKEND/`:
- `01_crear_usuario_y_bd.sql`
- `01b_crear_base_datos.sql`
- `01c_dar_permisos.sql`

### 3. Configurar Variables de Entorno

**IMPORTANTE**: Después de instalar la aplicación, debes configurar el archivo `.env`

**Ubicación del archivo:**
- Si instalaste con el instalador: `C:\Users\TuUsuario\AppData\Local\Programs\RESEJ\resources\BACKEND\.env`
- Si usas la versión portable: `carpeta-de-instalacion\resources\BACKEND\.env`

**Crear el archivo `.env`** (copiar desde `.env.example`):

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resej_db
DB_USER=resej_user
DB_PASSWORD=tu_contraseña_aqui

# JWT Configuration
JWT_SECRET=cambia_este_secreto_por_algo_seguro_y_aleatorio
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=otro_secreto_diferente_y_seguro
REFRESH_TOKEN_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000
```

### 4. Ejecutar Migraciones

Antes de usar la aplicación por primera vez, ejecuta las migraciones:

```bash
# Navega a la carpeta del backend
cd C:\Users\TuUsuario\AppData\Local\Programs\RESEJ\resources\BACKEND

# Ejecuta las migraciones
npx knex migrate:latest
```

### 5. Iniciar la Aplicación

Simplemente ejecuta el acceso directo de RESEJ desde:
- El escritorio
- El menú de inicio
- El archivo ejecutable directamente

## 🔍 Verificación

Cuando la aplicación inicie:

1. **Consola de Electron**: Verás mensajes de inicio en la consola (si abres DevTools)
2. **Backend**: Debe mostrar "Servidor iniciado en puerto 3000"
3. **Frontend**: La ventana de Electron mostrará la interfaz de login

## 🐛 Solución de Problemas

### Error: "No se pudo conectar a la base de datos"

**Causas comunes:**
- PostgreSQL no está en ejecución
- Credenciales incorrectas en `.env`
- Base de datos no existe
- Firewall bloqueando la conexión

**Solución:**
1. Verifica que PostgreSQL esté corriendo (busca el servicio en Windows Services)
2. Confirma las credenciales en `.env`
3. Verifica que la base de datos exista en pgAdmin

### Error: "Backend no inicia"

**Solución:**
1. Verifica que el archivo `.env` exista en la ubicación correcta
2. Revisa los logs de la aplicación
3. Ejecuta manualmente: `node server.js` en la carpeta del backend para ver errores

### Error: "Puerto 3000 ya en uso"

**Solución:**
- Cambia el puerto en `.env`: `PORT=3001`
- O cierra cualquier otra aplicación usando el puerto 3000

### La aplicación no encuentra los archivos

**Solución:**
- Verifica que ejecutaste `npm run build:frontend` antes de empaquetar
- Asegúrate de que la carpeta `frontend/dist` existe y contiene archivos

## 📊 Logs y Depuración

Para ver logs detallados:

1. **En desarrollo**: Ejecuta `npm run electron:dev`
2. **En producción**: Los logs se guardan en `BACKEND/logs/`

## 🔐 Seguridad

**IMPORTANTE:**
- Cambia TODOS los secretos en `.env`
- Usa contraseñas fuertes para PostgreSQL
- No compartas el archivo `.env`
- Haz backups regulares de la base de datos

## 📋 Checklist de Distribución

Antes de distribuir el ejecutable:

- [ ] Frontend compilado (`npm run build:frontend`)
- [ ] Variables de entorno configuradas
- [ ] Secretos JWT cambiados
- [ ] Documentación incluida
- [ ] Probado en una máquina limpia
- [ ] Instrucciones de instalación de PostgreSQL listas

## 🔄 Actualización

Para actualizar a una nueva versión:

1. Incrementa la versión en `package.json`
2. Reconstruye: `npm run dist`
3. El nuevo instalador se creará en `dist-electron/`

## 📞 Soporte

Para más ayuda, consulta:
- `BACKEND/CONFIGURAR_BD.md` - Configuración de base de datos
- `BACKEND/INICIO_RAPIDO.md` - Guía de inicio
- `SOLUCION_PROBLEMAS.md` - Problemas comunes
