# Requisitos del Sistema - RESEJ (Registro de Secuestros Judiciales)

## 📋 Información General

**Nombre del Sistema:** RE.SE.J - Sistema de Registro de Secuestros Judiciales  
**Versión:** 1.0.0  
**Desarrolladores:** Flavio Sanchez & Lucas Jonas Diaz  
**Organización:** Policía de Tucumán

---

## 💻 Requisitos de Hardware

### Servidor (Mínimo)

- **Procesador:** Intel Core i3 o equivalente (2.0 GHz o superior)
- **Memoria RAM:** 4 GB mínimo (8 GB recomendado)
- **Disco Duro:** 20 GB de espacio libre (50 GB recomendado)
- **Red:** Tarjeta de red 100 Mbps

### Servidor (Recomendado)

- **Procesador:** Intel Core i5 o superior (3.0 GHz o superior)
- **Memoria RAM:** 16 GB o más
- **Disco Duro:** 100 GB SSD
- **Red:** Tarjeta de red 1 Gbps

### Estaciones de Trabajo (Clientes)

- **Procesador:** Intel Core i3 o equivalente
- **Memoria RAM:** 4 GB mínimo
- **Disco Duro:** 10 GB de espacio libre
- **Resolución de Pantalla:** 1366x768 mínimo (1920x1080 recomendado)
- **Red:** Conexión a red local o internet

---

## 🖥️ Requisitos de Software

### Sistema Operativo (Servidor)

**Opciones soportadas:**

- ✅ Windows 10/11 Pro o Enterprise (64 bits)
- ✅ Windows Server 2016/2019/2022
- ✅ Ubuntu 20.04 LTS o superior
- ✅ CentOS 7/8 o Rocky Linux

### Sistema Operativo (Clientes)

**Navegadores Web soportados:**

- ✅ Google Chrome 100 o superior (Recomendado)
- ✅ Mozilla Firefox 100 o superior
- ✅ Microsoft Edge 100 o superior
- ⚠️ Safari 14 o superior (compatibilidad limitada)
- ❌ Internet Explorer (NO soportado)

---

## 🔧 Software Requerido en el Servidor

### 1. Node.js

- **Versión:** 18.x o superior
- **Descarga:** https://nodejs.org/
- **Verificar instalación:**
  ```bash
  node --version  # Debe mostrar v18.x.x o superior
  npm --version   # Debe mostrar 9.x.x o superior
  ```

### 2. PostgreSQL

- **Versión:** 13.x o superior (Recomendado: 15.x)
- **Descarga:** https://www.postgresql.org/download/
- **Verificar instalación:**
  ```bash
  psql --version  # Debe mostrar PostgreSQL 13.x o superior
  ```

### 3. Git (Opcional - para actualizaciones)

- **Versión:** 2.30 o superior
- **Descarga:** https://git-scm.com/downloads

---

## 📦 Dependencias del Sistema

### Backend (Node.js)

```json
{
  "express": "^5.1.0",
  "pg": "^8.16.3",
  "knex": "^3.1.0",
  "bcrypt": "^6.0.0",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "helmet": "^8.1.0",
  "express-rate-limit": "^8.1.0",
  "multer": "^2.0.2",
  "nodemailer": "^7.0.10",
  "winston": "^3.18.2"
}
```

### Frontend (React + Vite)

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.9.3",
  "axios": "^1.12.2",
  "bootstrap": "^5.3.8",
  "react-bootstrap": "^2.10.10"
}
```

---

## 🌐 Requisitos de Red

### Configuración de Red Local

- **Puerto Backend:** 3001 (configurable)
- **Puerto Frontend:** 5173 (desarrollo) / 3000 (producción)
- **Puerto PostgreSQL:** 5432
- **Protocolo:** HTTP/HTTPS

### Firewall

**Puertos a habilitar:**

- Puerto 3001 (API Backend)
- Puerto 3000 o 80/443 (Frontend Web)
- Puerto 5432 (PostgreSQL - solo si es acceso remoto)

### Conectividad

- Red local (LAN) para instalación centralizada
- Internet (opcional) para actualizaciones y notificaciones por email

---

## 🔒 Requisitos de Seguridad

### Certificados SSL/TLS (Recomendado para producción)

- Certificado SSL válido para HTTPS
- Configuración de variables de entorno seguras

### Base de Datos

- Usuario dedicado con permisos limitados
- Contraseñas seguras (mínimo 12 caracteres)
- Respaldo de base de datos configurado

### Autenticación

- Sistema de tokens JWT
- Gestión de roles y permisos
- Rate limiting para prevenir ataques

---

## 💾 Requisitos de Almacenamiento

### Base de Datos PostgreSQL

- **Espacio inicial:** 500 MB
- **Crecimiento estimado:**
  - 10 MB por cada 1000 registros
  - Archivos adjuntos: variable según uso

### Archivos Adjuntos

- **Ubicación:** `/uploads` (configurable)
- **Espacio recomendado:** 10 GB inicial
- **Tipos permitidos:** PDF, imágenes (JPG, PNG), documentos

### Logs del Sistema

- **Ubicación:** `/BACKEND/logs`
- **Espacio recomendado:** 1 GB
- **Rotación:** Configurada automáticamente

---

## 🔧 Configuración Mínima de PostgreSQL

```sql
-- Configuración recomendada para postgresql.conf
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 4MB
```

---

## 📱 Requisitos para Acceso Móvil

### Navegadores Móviles

- ✅ Chrome Mobile (Android)
- ✅ Safari Mobile (iOS)
- ✅ Edge Mobile

### Sistema Operativo Móvil

- Android 8.0 o superior
- iOS 13.0 o superior

### Conectividad

- WiFi o datos móviles con conexión a la red de la dependencia

---

## ⚙️ Modo Electron (Aplicación de Escritorio)

### Sistema Operativo

- Windows 10/11 (64 bits)

### Requisitos Adicionales

- 200 MB adicionales de espacio en disco
- Permisos de administrador para instalación

---

## 📋 Checklist de Instalación

Antes de instalar, verificar que se cuenta con:

- [ ] Node.js 18.x o superior instalado
- [ ] PostgreSQL 13.x o superior instalado
- [ ] Al menos 20 GB de espacio libre en disco
- [ ] 4 GB de RAM disponible
- [ ] Puertos 3001 y 5432 disponibles
- [ ] Permisos de administrador en el sistema
- [ ] Conexión a red local configurada
- [ ] Navegador web moderno instalado

---

## 📞 Soporte Técnico

Para consultas sobre requisitos del sistema:

- **Email:** soporte@resej.gob.ar
- **Teléfono:** [Número de contacto]
- **Horario:** Lunes a Viernes, 8:00 - 16:00

---

**Última actualización:** 12 de noviembre de 2025  
**Versión del documento:** 1.0
