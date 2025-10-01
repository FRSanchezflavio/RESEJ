# 🚀 Guía Rápida de Inicio - RE.SE.J Backend

## Pasos para levantar el proyecto

### 1. Instalar dependencias
\`\`\`bash
npm install
\`\`\`

### 2. Configurar base de datos PostgreSQL

**Opción A: Desde psql**
\`\`\`bash
psql -U postgres
\`\`\`

\`\`\`sql
CREATE DATABASE resej_db;
CREATE USER resej_user WITH ENCRYPTED PASSWORD 'resej_password_2025';
GRANT ALL PRIVILEGES ON DATABASE resej_db TO resej_user;
\q
\`\`\`

**Opción B: Desde pgAdmin**
- Crear base de datos: `resej_db`
- Crear usuario: `resej_user` con contraseña `resej_password_2025`
- Dar permisos completos al usuario sobre la base de datos

### 3. Configurar variables de entorno

**Copiar archivo de ejemplo:**
\`\`\`bash
cp .env.example .env
\`\`\`

**Editar `.env` si es necesario** (ya viene con valores por defecto funcionales)

### 4. Ejecutar migraciones

\`\`\`bash
npm run migrate:latest
\`\`\`

Esto creará todas las tablas en la base de datos.

### 5. Crear usuario administrador

\`\`\`bash
npm run seed:run
\`\`\`

**Credenciales del administrador:**
- Usuario: `admin`
- Contraseña: `Admin2025!`

⚠️ **IMPORTANTE**: Cambiar esta contraseña después del primer login.

### 6. Iniciar el servidor

**Modo desarrollo (con auto-reload):**
\`\`\`bash
npm run dev
\`\`\`

**Modo producción:**
\`\`\`bash
npm start
\`\`\`

El servidor estará disponible en: **http://localhost:3000**

---

## ✅ Verificar que todo funciona

### 1. Health Check
\`\`\`bash
curl http://localhost:3000/health
\`\`\`

Debe responder:
\`\`\`json
{
  "status": "OK",
  "timestamp": "2025-09-30T...",
  "environment": "development"
}
\`\`\`

### 2. Login de prueba

**Usando curl:**
\`\`\`bash
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"usuario": "admin", "password": "Admin2025!"}'
\`\`\`

**Usando Postman:**
- Método: POST
- URL: `http://localhost:3000/api/auth/login`
- Body (raw JSON):
\`\`\`json
{
  "usuario": "admin",
  "password": "Admin2025!"
}
\`\`\`

Si funciona, recibirás:
\`\`\`json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "usuario": {
      "id": 1,
      "usuario": "admin",
      "rol": "administrador",
      ...
    }
  }
}
\`\`\`

---

## 🔧 Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar en modo desarrollo |
| `npm start` | Iniciar en modo producción |
| `npm run migrate:latest` | Ejecutar migraciones |
| `npm run migrate:rollback` | Revertir última migración |
| `npm run seed:run` | Ejecutar seeds |

---

## 📝 Próximos pasos

1. **Probar endpoints** con Postman o similar
2. **Cambiar contraseña del admin**
3. **Crear usuarios adicionales** si es necesario
4. **Integrar con el frontend**
5. **Configurar backups** de la base de datos

---

## ❌ Problemas comunes

### Error: "ECONNREFUSED" al conectar a PostgreSQL
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que la base de datos exista

### Error: "Cannot find module"
- Ejecutar `npm install` nuevamente

### Error en migraciones
- Verificar conexión a BD
- Ejecutar `npm run migrate:rollback` y luego `npm run migrate:latest`

---

## 📞 Soporte

Para problemas o consultas:
- Revisar el archivo `README.md` completo
- Consultar logs en la carpeta `logs/`
- Contactar a los desarrolladores

**Desarrolladores:**
- Flavio Sanchez (14059)
- Lucas Jonas Diaz (30313)
