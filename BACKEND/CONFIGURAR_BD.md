# 🗄️ Configuración de Base de Datos PostgreSQL

## ⚠️ Estado Actual

El backend está intentando conectarse a PostgreSQL con:

- **Usuario:** `usuario`
- **Contraseña:** `pass`
- **Base de datos:** `resej_db`
- **Host:** `localhost`
- **Puerto:** `5432`

**Error actual:** Autenticación fallida para el usuario `usuario`

---

## 🔧 Solución: Configurar PostgreSQL

### Opción 1: Crear usuario y base de datos (Recomendado)

Abre **pgAdmin** o **psql** y ejecuta:

```sql
-- Conectarse como postgres (superusuario)
-- En pgAdmin: clic derecho en PostgreSQL 16 -> Query Tool

-- 1. Crear usuario
CREATE USER usuario WITH PASSWORD 'pass';

-- 2. Crear base de datos
CREATE DATABASE resej_db OWNER usuario;

-- 3. Dar permisos al usuario
GRANT ALL PRIVILEGES ON DATABASE resej_db TO usuario;

-- 4. Conectarse a la base de datos resej_db
\c resej_db

-- 5. Dar permisos en el esquema public
GRANT ALL ON SCHEMA public TO usuario;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO usuario;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO usuario;
```

### Opción 2: Usar usuario postgres existente

Si prefieres usar el usuario `postgres` que ya tienes:

**1. Editar el archivo `.env`:**

```env
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA_DE_POSTGRES_AQUI
```

**2. Crear solo la base de datos:**

```sql
-- En pgAdmin o psql como postgres
CREATE DATABASE resej_db;
```

---

## 📋 Pasos Después de Configurar la BD

Una vez configurada la base de datos:

### 1. Ejecutar Migraciones

```bash
cd /c/Users/flavi/OneDrive/Escritorio/RESEJ/BACKEND
npm run migrate:latest
```

Esto creará las 6 tablas:

- usuarios
- personas_registradas
- registros_secuestros
- archivos_adjuntos
- logs_auditoria
- refresh_tokens

### 2. Crear Usuario Admin

```bash
npm run seed:run
```

Esto creará el usuario administrador:

- **Usuario:** `admin`
- **Contraseña:** `Admin2025!`

### 3. Iniciar Servidor

```bash
npm run dev
```

Deberías ver:

```
✅ Base de datos conectada correctamente
🚀 Servidor corriendo en puerto 4000
```

### 4. Probar Health Check

Abre en el navegador o usa curl:

```bash
curl http://localhost:4000/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "timestamp": "2025-09-30T...",
  "database": "connected"
}
```

### 5. Probar Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","password":"Admin2025!"}'
```

Respuesta esperada:

```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": 1,
      "usuario": "admin",
      "rol": "administrador",
      ...
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 🐛 Solución de Problemas

### Error: "database does not exist"

```sql
-- Crear la base de datos
CREATE DATABASE resej_db;
```

### Error: "permission denied"

```sql
-- Dar permisos al usuario
GRANT ALL PRIVILEGES ON DATABASE resej_db TO usuario;
\c resej_db
GRANT ALL ON SCHEMA public TO usuario;
```

### Error: "password authentication failed"

**Opción A:** Cambiar contraseña del usuario

```sql
ALTER USER usuario WITH PASSWORD 'pass';
```

**Opción B:** Actualizar `.env` con la contraseña correcta

```env
DB_PASSWORD=tu_contraseña_real
```

### Verificar conexión manual

```bash
psql -U usuario -d resej_db -h localhost
```

Si pide contraseña y conecta correctamente, la configuración está bien.

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas, copia el mensaje de error completo y lo revisamos juntos.

---

**Siguiente paso:** Configurar PostgreSQL según las instrucciones anteriores.
