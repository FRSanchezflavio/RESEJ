# 🚔 Sistema RESEJ - Registro de Secuestros Policía

Sistema de gestión de registros de secuestros para instituciones policiales, disponible como **aplicación web** y **aplicación de escritorio**.

## 📋 Descripción

RESEJ es una aplicación completa para el registro, seguimiento y gestión de casos de secuestros. Incluye funcionalidades de:

- 👤 Gestión de usuarios con roles y permisos
- 📝 Registro de personas y casos de secuestro
- 📎 Adjuntar archivos y evidencias
- 📊 Logs de auditoría completos
- 🔐 Autenticación segura con JWT
- 📱 Acceso desde dispositivos móviles
- 🖥️ Aplicación de escritorio para distribución institucional

## 🚀 Inicio Rápido

### Aplicación Web

```bash
# Instalar dependencias
npm install
cd frontend && npm install && cd ..
cd BACKEND && npm install && cd ..

# Iniciar en modo desarrollo
npm start
```

Acceder en: http://localhost:5173

### Aplicación de Escritorio

```bash
# Desarrollo con Electron
npm run electron:dev

# Construir instalador
build-electron.bat
```

Ver **[INICIO_RAPIDO_ELECTRON.md](INICIO_RAPIDO_ELECTRON.md)** para más detalles.

## 📚 Documentación

### Para Usuarios Finales

- **[INSTALACION.md](INSTALACION.md)** - Guía completa de instalación de la app de escritorio
- **[GUIA_ACCESO_CELULAR.md](GUIA_ACCESO_CELULAR.md)** - Acceso desde dispositivos móviles

### Para Desarrolladores

- **[README_ELECTRON.md](README_ELECTRON.md)** - Documentación técnica completa de Electron
- **[INICIO_RAPIDO_ELECTRON.md](INICIO_RAPIDO_ELECTRON.md)** - Guía de inicio rápido
- **[RESUMEN_IMPLEMENTACION.md](RESUMEN_IMPLEMENTACION.md)** - Resumen de implementación
- **[BACKEND/README.md](BACKEND/README.md)** - Documentación del backend
- **[frontend/README.md](frontend/README.md)** - Documentación del frontend

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│                  Vite + React Router                    │
│              Bootstrap + React Bootstrap                │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTP/REST API
┌─────────────────▼───────────────────────────────────────┐
│                    BACKEND (Node.js)                    │
│              Express + JWT Authentication               │
│                 Knex.js + PostgreSQL                    │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                 PostgreSQL Database                     │
│        usuarios, personas, registros, archivos          │
└─────────────────────────────────────────────────────────┘
```

### Estructura del Proyecto

```
RESEJ/
├── electron.js                   # Aplicación Electron básica
├── electron-with-backend.js      # Electron + backend integrado
├── build-electron.bat            # Script de construcción
├── verificar-electron.bat        # Script de verificación
│
├── BACKEND/                      # Servidor Node.js/Express
│   ├── server.js                 # Punto de entrada
│   ├── src/
│   │   ├── controllers/          # Lógica de negocio
│   │   ├── routes/               # Rutas de API
│   │   ├── middleware/           # Middleware personalizado
│   │   ├── models/               # Modelos de datos
│   │   └── migrations/           # Migraciones de BD
│   └── .env                      # Configuración (crear desde .env.example)
│
├── frontend/                     # Aplicación React
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   ├── context/              # Context API
│   │   ├── api/                  # Cliente API
│   │   └── App.jsx               # Componente principal
│   └── dist/                     # Build de producción
│
└── dist/                         # Instaladores generados
    └── Sistema RESEJ Policía-Setup-1.0.0.exe
```

## 🔧 Tecnologías

### Frontend

- **React 19** - Framework UI
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **Bootstrap 5** - Framework CSS
- **Axios** - Cliente HTTP
- **JWT Decode** - Decodificación de tokens

### Backend

- **Node.js** - Runtime
- **Express** - Framework web
- **PostgreSQL** - Base de datos
- **Knex.js** - Query builder
- **JSON Web Tokens** - Autenticación
- **Multer** - Upload de archivos
- **Bcrypt** - Hash de contraseñas

### Desktop

- **Electron** - Framework de escritorio
- **electron-builder** - Empaquetado

## ⚙️ Configuración

### Variables de Entorno (BACKEND/.env)

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resej_db
DB_USER=resej_user
DB_PASSWORD=tu_contraseña

# Servidor
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=clave_secreta_cambiar
JWT_REFRESH_SECRET=otra_clave_secreta

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña
```

## 📦 Scripts NPM

### Proyecto Principal

```bash
npm start                    # Backend + Frontend
npm run electron:dev         # Desarrollo con Electron
npm run electron:with-backend # Electron + backend integrado
npm run electron:build       # Construir instalador
npm run electron:build:win   # Construir para Windows
```

### Backend

```bash
cd BACKEND
npm start                    # Iniciar servidor
npm run migrate              # Ejecutar migraciones
npm run seed                 # Datos de prueba
npm run test                 # Tests
```

### Frontend

```bash
cd frontend
npm run dev                  # Servidor de desarrollo
npm run build                # Build de producción
npm run preview              # Preview del build
```

## 🛠️ Instalación y Configuración

### Requisitos Previos

- Node.js 18 o superior
- PostgreSQL 12 o superior
- npm o yarn

### Instalación Paso a Paso

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd RESEJ
```

2. **Instalar dependencias**

```bash
npm install
cd frontend && npm install && cd ..
cd BACKEND && npm install && cd ..
```

3. **Configurar base de datos**

```bash
# Crear base de datos en PostgreSQL
createdb resej_db

# Configurar BACKEND/.env
cp BACKEND/.env.example BACKEND/.env
# Editar BACKEND/.env con tus credenciales
```

4. **Ejecutar migraciones**

```bash
cd BACKEND
npm run migrate
cd ..
```

5. **Iniciar aplicación**

```bash
npm start
```

## 🔐 Seguridad

- Autenticación basada en JWT
- Refresh tokens para sesiones persistentes
- Tokens de acceso temporal para dispositivos móviles
- Hash de contraseñas con bcrypt
- Validación de permisos por rol
- Logs de auditoría completos
- CORS configurado
- Rate limiting

## 👥 Roles de Usuario

- **Super Admin** - Acceso total al sistema
- **Admin** - Gestión de usuarios y registros
- **Operador** - Registro y consulta de casos
- **Consulta** - Solo lectura

## 📱 Acceso Móvil

La aplicación soporta acceso desde dispositivos móviles mediante:

1. **Acceso directo** - Via navegador web
2. **Tokens temporales** - Enlaces de un solo uso
3. **PWA** - Instalable como app

Ver **[GUIA_ACCESO_CELULAR.md](GUIA_ACCESO_CELULAR.md)** para configuración.

## 🖥️ Aplicación de Escritorio

### Construcción

```bash
# Windows
build-electron.bat

# O manualmente
npm run electron:build:win
```

### Distribución

El instalador se genera en: `dist/Sistema RESEJ Policía-Setup-1.0.0.exe`

Ver **[INSTALACION.md](INSTALACION.md)** para instrucciones de instalación.

## 🧪 Testing

```bash
# Backend tests
cd BACKEND
npm test

# Frontend tests (si están configurados)
cd frontend
npm test
```

## 📊 Logs y Auditoría

Todos los eventos importantes quedan registrados en:

- Base de datos (tabla `logs_auditoria`)
- Archivos de log (BACKEND/logs/)
- Accesibles desde la interfaz de administración

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. Pull de los últimos cambios
2. Ejecutar migraciones si hay cambios en BD
3. Reconstruir frontend
4. Reiniciar servidor

## 🐛 Solución de Problemas

### La aplicación no inicia

- Verificar PostgreSQL corriendo
- Revisar credenciales en `.env`
- Verificar puertos disponibles

### Error de CORS

- Agregar origen en `ALLOWED_ORIGINS` en `.env`

### Error de base de datos

- Verificar conexión a PostgreSQL
- Ejecutar migraciones pendientes

Ver **[INSTALACION.md](INSTALACION.md#solución-de-problemas)** para más detalles.

## 📞 Soporte

Para problemas o preguntas:

1. Revisar documentación en este repositorio
2. Consultar logs de la aplicación
3. Contactar al equipo de desarrollo

## 📄 Licencia

Ver archivo [LICENCIA.md](BACKEND/LICENCIA.md)

## 🙏 Contribuciones

Este es un proyecto interno para uso policial. Las contribuciones están limitadas al personal autorizado.

## 📝 Changelog

### Versión 1.0.0 (Noviembre 2025)

- ✅ Implementación completa de aplicación web
- ✅ Conversión a aplicación de escritorio con Electron
- ✅ Sistema de tokens de acceso temporal
- ✅ Acceso desde dispositivos móviles
- ✅ Logs de auditoría completos
- ✅ Gestión de usuarios y permisos
- ✅ Upload de archivos adjuntos

---

_Desarrollado para Instituciones Policiales_
