# 🚀 Guía Paso a Paso: Configurar PostgreSQL

## 📋 Resumen de Pasos

1. ✅ Abrir pgAdmin 4
2. ✅ Ejecutar script para crear usuario y base de datos
3. ✅ Ejecutar script para configurar permisos
4. ✅ Ejecutar migraciones desde la terminal
5. ✅ Crear usuario admin
6. ✅ Iniciar servidor

---

## 🎯 PASO 1: Abrir pgAdmin 4

### Opción A: Con pgAdmin (Recomendado - Interfaz Gráfica)

1. **Abrir pgAdmin 4**

   - Busca "pgAdmin 4" en el menú de inicio de Windows
   - Te pedirá una **Master Password** (la que configuraste al instalar PostgreSQL)
   - Ingresa la contraseña

2. **Conectarse al servidor**

   - En el panel izquierdo, expande **Servers**
   - Clic en **PostgreSQL 16** (puede pedir la contraseña de postgres)
   - Ingresa la contraseña del usuario **postgres**

3. **Abrir Query Tool**
   - Clic derecho en **PostgreSQL 16**
   - Selecciona **Query Tool**
   - Se abrirá una ventana de consultas SQL

---

## 🎯 PASO 2: Crear Usuario y Base de Datos

**En el Query Tool que acabas de abrir:**

1. **Abrir el primer script**

   - Clic en el ícono de carpeta 📁 (Open File)
   - Navega a: `C:\Users\flavi\OneDrive\Escritorio\RESEJ\BACKEND`
   - Selecciona: `01_crear_usuario_y_bd.sql`
   - Clic en **Abrir**

2. **Ejecutar el script**

   - Presiona **F5** o clic en el botón ▶️ (Execute)
   - Deberías ver en la parte inferior:
     ```
     ✅ Usuario y base de datos creados correctamente
     Usuario: usuario
     Contraseña: pass
     Base de datos: resej_db
     ```

3. **Verificar que se creó**
   - En el panel izquierdo, clic derecho en **Databases**
   - Selecciona **Refresh**
   - Deberías ver **resej_db** en la lista

---

## 🎯 PASO 3: Configurar Permisos

**IMPORTANTE: Ahora debes conectarte a la base de datos resej_db**

1. **Cerrar el Query Tool anterior** (opcional)

2. **Abrir Query Tool en resej_db**

   - En el panel izquierdo, expande **Databases**
   - Clic derecho en **resej_db**
   - Selecciona **Query Tool**

3. **Abrir el segundo script**

   - Clic en el ícono de carpeta 📁 (Open File)
   - Navega a: `C:\Users\flavi\OneDrive\Escritorio\RESEJ\BACKEND`
   - Selecciona: `02_configurar_permisos.sql`
   - Clic en **Abrir**

4. **Ejecutar el script**
   - Presiona **F5** o clic en el botón ▶️ (Execute)
   - Deberías ver:
     ```
     ✅ Permisos configurados correctamente
     El usuario "usuario" ahora tiene todos los permisos en resej_db
     ```

---

## 🎯 PASO 4: Ejecutar Migraciones

**Ahora volvemos a la terminal de VS Code:**

```bash
cd /c/Users/flavi/OneDrive/Escritorio/RESEJ/BACKEND
npm run migrate:latest
```

**Lo que deberías ver:**

```
Batch 1 run: 6 migrations
✅ 20250930000001_create_usuarios_table.js
✅ 20250930000002_create_personas_registradas_table.js
✅ 20250930000003_create_registros_secuestros_table.js
✅ 20250930000004_create_archivos_adjuntos_table.js
✅ 20250930000005_create_logs_auditoria_table.js
✅ 20250930000006_create_refresh_tokens_table.js
```

**Esto crea las 6 tablas del sistema.**

---

## 🎯 PASO 5: Crear Usuario Administrador

```bash
npm run seed:run
```

**Lo que deberías ver:**

```
Ran 1 seed file
✅ Usuario admin creado correctamente
```

**Credenciales creadas:**

- Usuario: `admin`
- Contraseña: `Admin2025!`

---

## 🎯 PASO 6: Iniciar el Servidor

```bash
npm run dev
```

**Lo que deberías ver:**

```
[nodemon] starting `node server.js`
✅ Base de datos conectada correctamente
🚀 Servidor corriendo en http://localhost:4000
Entorno: development
```

**¡Éxito! El servidor está funcionando.**

---

## ✅ PASO 7: Probar el Backend

### Probar Health Check

Abre un **nuevo terminal** y ejecuta:

```bash
curl http://localhost:4000/health
```

**Respuesta esperada:**

```json
{
  "status": "ok",
  "timestamp": "2025-09-30T...",
  "database": "connected"
}
```

### Probar Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"usuario\":\"admin\",\"password\":\"Admin2025!\"}"
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": 1,
      "usuario": "admin",
      "nombre": "Administrador",
      "apellido": "Sistema",
      "rol": "administrador",
      "email": "admin@policia.tucuman.gob.ar",
      "activo": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login exitoso"
}
```

**¡Si ves esto, el backend está 100% funcional!** 🎉

---

## 📊 Verificar en pgAdmin

Puedes ver las tablas creadas:

1. En pgAdmin, expande:

   - **Databases** → **resej_db** → **Schemas** → **public** → **Tables**

2. Deberías ver 6 tablas:

   - ✅ `usuarios`
   - ✅ `personas_registradas`
   - ✅ `registros_secuestros`
   - ✅ `archivos_adjuntos`
   - ✅ `logs_auditoria`
   - ✅ `refresh_tokens`

3. También verás:
   - `knex_migrations` (control de versiones)
   - `knex_migrations_lock` (control de concurrencia)

---

## 🐛 Solución de Problemas

### Error: "role 'usuario' already exists"

Ya existe el usuario. Puedes:

**Opción A:** Eliminar y recrear

```sql
DROP USER usuario;
-- Luego ejecutar 01_crear_usuario_y_bd.sql nuevamente
```

**Opción B:** Solo crear la base de datos

```sql
CREATE DATABASE resej_db OWNER usuario;
GRANT ALL PRIVILEGES ON DATABASE resej_db TO usuario;
```

### Error: "database 'resej_db' already exists"

La base de datos ya existe. Puedes:

**Opción A:** Eliminar y recrear

```sql
DROP DATABASE resej_db;
-- Luego ejecutar 01_crear_usuario_y_bd.sql nuevamente
```

**Opción B:** Solo configurar permisos

```sql
-- Ejecutar 02_configurar_permisos.sql
```

### Error en migraciones: "permission denied"

Falta ejecutar el script de permisos:

```bash
# En pgAdmin, conectado a resej_db, ejecutar:
# 02_configurar_permisos.sql
```

### No puedo conectarme a PostgreSQL en pgAdmin

Verifica:

1. PostgreSQL está corriendo (busca el servicio en Windows)
2. La contraseña del usuario `postgres` es correcta
3. El puerto 5432 está libre

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:

1. Copia el mensaje de error completo
2. Dime en qué paso estás
3. Te ayudaré a resolverlo

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu backend estará completamente funcional y listo para:

- Recibir peticiones del frontend
- Gestionar usuarios
- Registrar secuestros judiciales
- Subir archivos
- Generar reportes

**¡Felicitaciones! 🎊**
