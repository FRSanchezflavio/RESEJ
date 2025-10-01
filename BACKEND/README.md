# RE.SE.J - Registro de Secuestros Judiciales
## Backend API - Policía de Tucumán

Sistema de gestión de registros de secuestros judiciales con autenticación JWT y autorización por roles.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Migraciones y Seeds](#migraciones-y-seeds)
- [Ejecución](#ejecución)
- [Documentación de API](#documentación-de-api)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Seguridad](#seguridad)
- [Mantenimiento](#mantenimiento)

---

## ✨ Características

- ✅ Autenticación JWT con Access y Refresh Tokens
- ✅ Autorización por roles (Administrador / Usuario Consulta)
- ✅ Sistema de auditoría completo
- ✅ Manejo de archivos con validación de magic bytes
- ✅ Rate limiting para prevenir abuso
- ✅ Logging estructurado con Winston
- ✅ Validación de datos con Express Validator
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Base de datos PostgreSQL con Knex.js
- ✅ Soporte para hasta 3 usuarios concurrentes

---

## 🛠️ Requisitos Previos

- **Node.js**: >= 18.0.0
- **NPM**: >= 9.0.0
- **PostgreSQL**: >= 14.0
- **Sistema Operativo**: Windows Server / Linux

---

## 📦 Instalación

### 1. Clonar el repositorio

\`\`\`bash
git clone <repository-url>
cd RESEJ/BACKEND
\`\`\`

### 2. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Crear base de datos PostgreSQL

\`\`\`sql
CREATE DATABASE resej_db;
CREATE USER resej_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE resej_db TO resej_user;
\`\`\`

---

## ⚙️ Configuración

### 1. Copiar archivo de configuración

\`\`\`bash
cp .env.example .env
\`\`\`

### 2. Configurar variables de entorno (.env)

\`\`\`env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resej_db
DB_USER=resej_user
DB_PASSWORD=secure_password

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your_super_secure_refresh_token_secret_change_this
REFRESH_TOKEN_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Security Configuration
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
\`\`\`

**⚠️ IMPORTANTE**: Cambiar los valores de `JWT_SECRET` y `REFRESH_TOKEN_SECRET` en producción.

---

## 🗄️ Migraciones y Seeds

### Ejecutar migraciones

\`\`\`bash
npm run migrate:latest
\`\`\`

### Ejecutar seed (Usuario Admin)

\`\`\`bash
npm run seed:run
\`\`\`

**Usuario Administrador por defecto**:
- Usuario: `admin`
- Contraseña: `Admin2025!`
- ⚠️ **Cambiar la contraseña inmediatamente después del primer acceso**

### Revertir migraciones

\`\`\`bash
npm run migrate:rollback
\`\`\`

---

## 🚀 Ejecución

### Modo desarrollo (con nodemon)

\`\`\`bash
npm run dev
\`\`\`

### Modo producción

\`\`\`bash
npm start
\`\`\`

El servidor estará disponible en: `http://localhost:3000`

---

## 📚 Documentación de API

### Base URL

\`\`\`
http://localhost:3000/api
\`\`\`

---

### 🔐 Autenticación

#### Login

\`\`\`http
POST /api/auth/login
Content-Type: application/json

{
  "usuario": "admin",
  "password": "Admin2025!"
}
\`\`\`

**Respuesta**:
\`\`\`json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "usuario": {
      "id": 1,
      "usuario": "admin",
      "nombre": "Administrador",
      "apellido": "Sistema",
      "nombreCompleto": "Administrador Sistema",
      "rol": "administrador"
    }
  },
  "message": "Login exitoso"
}
\`\`\`

#### Refrescar Token

\`\`\`http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGc..."
}
\`\`\`

#### Logout

\`\`\`http
POST /api/auth/logout
Content-Type: application/json

{
  "refresh_token": "eyJhbGc..."
}
\`\`\`

#### Obtener Usuario Actual

\`\`\`http
GET /api/auth/me
Authorization: Bearer {accessToken}
\`\`\`

---

### 👥 Usuarios (Solo Administradores)

#### Listar Usuarios

\`\`\`http
GET /api/usuarios?page=1&limit=10&activo=true
Authorization: Bearer {accessToken}
\`\`\`

#### Crear Usuario

\`\`\`http
POST /api/usuarios
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "usuario": "juan.perez",
  "password": "Password123!",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "usuario_consulta"
}
\`\`\`

#### Actualizar Usuario

\`\`\`http
PUT /api/usuarios/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "nombre": "Juan Carlos",
  "apellido": "Pérez González"
}
\`\`\`

#### Resetear Contraseña

\`\`\`http
POST /api/usuarios/:id/reset-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "new_password": "NewPassword123!"
}
\`\`\`

---

### 👤 Personas

#### Listar Personas

\`\`\`http
GET /api/personas?page=1&limit=10
Authorization: Bearer {accessToken}
\`\`\`

#### Buscar Personas

\`\`\`http
GET /api/personas/search?termino=Juan
Authorization: Bearer {accessToken}
\`\`\`

#### Crear Persona (Solo Admin)

\`\`\`http
POST /api/personas
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "García",
  "dni": "12345678",
  "fecha_nacimiento": "1980-05-15",
  "domicilio": "Av. Principal 123",
  "telefono": "381-1234567",
  "email": "juan.garcia@example.com"
}
\`\`\`

---

### 📄 Registros de Secuestros

#### Listar Registros

\`\`\`http
GET /api/registros?page=1&limit=10&estado_causa=en_proceso
Authorization: Bearer {accessToken}
\`\`\`

#### Buscar Registros (Todos los roles)

\`\`\`http
GET /api/registros/buscar?termino=Juan&criterio=persona&page=1&limit=10
Authorization: Bearer {accessToken}
\`\`\`

**Criterios de búsqueda**: `todos`, `persona`, `legajo`, `ufi`, `protocolo`

#### Obtener Registro por ID

\`\`\`http
GET /api/registros/:id
Authorization: Bearer {accessToken}
\`\`\`

#### Crear Registro (Solo Admin)

\`\`\`http
POST /api/registros
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "persona_id": 1,
  "fecha_ingreso": "2025-09-30",
  "ufi": "UFI N° 1",
  "numero_legajo": "123/2025",
  "seccion_que_interviene": "División Robos",
  "detalle_secuestro": "Elementos varios",
  "numero_protocolo": "PROT-001/2025",
  "cadena_custodia": "CC-001",
  "nro_folio": "001",
  "nro_libro_secuestro": "LIB-001",
  "of_a_cargo": "Oficial Rodríguez",
  "tramite": "En proceso",
  "tipo_delito": "Robo",
  "estado_causa": "abierta"
}
\`\`\`

#### Exportar Registros (Solo Admin)

\`\`\`http
GET /api/registros/exportar?estado_causa=abierta
Authorization: Bearer {accessToken}
\`\`\`

---

### 📁 Archivos

#### Subir Archivo (Solo Admin)

\`\`\`http
POST /api/archivos/upload
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

archivo: [archivo.pdf]
registro_id: 1
\`\`\`

**Tipos permitidos**: PDF, JPEG, PNG  
**Tamaño máximo**: 5MB

#### Listar Archivos de un Registro

\`\`\`http
GET /api/archivos/registro/:registroId
Authorization: Bearer {accessToken}
\`\`\`

#### Descargar Archivo

\`\`\`http
GET /api/archivos/:id/download
Authorization: Bearer {accessToken}
\`\`\`

#### Eliminar Archivo (Solo Admin)

\`\`\`http
DELETE /api/archivos/:id
Authorization: Bearer {accessToken}
\`\`\`

---

### 📊 Logs de Auditoría (Solo Admin)

#### Listar Logs

\`\`\`http
GET /api/logs?page=1&limit=50&accion=LOGIN&fecha_desde=2025-09-01
Authorization: Bearer {accessToken}
\`\`\`

#### Logs de un Usuario

\`\`\`http
GET /api/logs/usuario/:usuarioId
Authorization: Bearer {accessToken}
\`\`\`

---

## 📁 Estructura del Proyecto

\`\`\`
BACKEND/
├── src/
│   ├── config/           # Configuraciones (DB, JWT, Multer)
│   ├── controllers/      # Controladores de rutas
│   ├── middleware/       # Middleware (Auth, Audit, Errors)
│   ├── models/           # Modelos de datos
│   ├── routes/           # Definición de rutas
│   ├── services/         # Lógica de negocio
│   ├── utils/            # Utilidades y helpers
│   ├── migrations/       # Migraciones de BD
│   ├── seeds/            # Seeds de datos iniciales
│   └── app.js            # Configuración de Express
├── uploads/              # Archivos subidos
├── logs/                 # Logs de la aplicación
├── .env                  # Variables de entorno
├── .env.example          # Ejemplo de variables
├── knexfile.js           # Configuración de Knex
├── package.json          # Dependencias
├── server.js             # Punto de entrada
└── README.md             # Documentación
\`\`\`

---

## 🔒 Seguridad

### Características de Seguridad Implementadas

1. **Autenticación JWT**:
   - Access tokens de corta duración (24h)
   - Refresh tokens con revocación manual
   - Tokens almacenados en BD para control

2. **Autorización por Roles**:
   - Middleware de verificación de roles
   - Permisos granulares por endpoint

3. **Rate Limiting**:
   - Login: 5 intentos cada 15 minutos
   - General: 100 requests cada 15 minutos
   - Upload: 5 archivos por minuto

4. **Validación de Archivos**:
   - Validación de Content-Type
   - Verificación de magic bytes
   - Límite de tamaño (5MB)

5. **Encriptación**:
   - Bcrypt con 12 salt rounds
   - Contraseñas nunca expuestas

6. **Headers HTTP Seguros**:
   - Helmet.js configurado
   - CORS restrictivo

7. **Auditoría Completa**:
   - Todas las acciones registradas
   - IP tracking
   - Timestamp de todas las operaciones

---

## 🔧 Mantenimiento

### Limpiar tokens expirados

Ejecutar periódicamente (se puede automatizar con cron):

\`\`\`javascript
const AuthService = require('./src/services/authService');
await AuthService.cleanExpiredTokens();
\`\`\`

### Backup de Base de Datos

\`\`\`bash
pg_dump -Fc resej_db > resej_backup_$(date +%Y%m%d).dump
\`\`\`

### Restaurar Backup

\`\`\`bash
pg_restore -d resej_db resej_backup_20250930.dump
\`\`\`

---

## 🐛 Troubleshooting

### Error de conexión a PostgreSQL

1. Verificar que PostgreSQL esté corriendo
2. Verificar credenciales en `.env`
3. Verificar que la base de datos existe

### Error de permisos en uploads

\`\`\`bash
chmod 755 uploads/
\`\`\`

### Errores de migración

\`\`\`bash
npm run migrate:rollback
npm run migrate:latest
\`\`\`

---

## 📞 Contacto

**Desarrolladores**:
- Flavio Sanchez - P.T.P. - CARGO: 14059
- Lucas Jonas Diaz - CARGO: 30313

**Organización**: Policía de Tucumán  
**Departamento**: Inteligencia Criminal

---

## 📄 Licencia

Este proyecto es de uso interno de la Policía de Tucumán. Todos los derechos reservados © 2025

---

## 🔄 Versión

**Versión**: 1.0.0  
**Fecha**: 30 de Septiembre 2025  
**Estado**: Producción
