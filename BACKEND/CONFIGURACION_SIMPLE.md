# 🚀 Configuración Rápida de PostgreSQL

## ⚡ Solución al Error de Transacción

El error "CREATE DATABASE no puede ser ejecutado dentro de un bloque de transacción" ocurre porque pgAdmin ejecuta todo junto. La solución es ejecutar cada comando por separado.

---

## 📋 Pasos Simples

### **PASO 1: Abrir pgAdmin**

1. Abre **pgAdmin 4**
2. Conecta a **PostgreSQL 16** (ingresa contraseña si pide)
3. Clic derecho en **PostgreSQL 16** → **Query Tool**

---

### **PASO 2: Crear Usuario**

En el Query Tool:

1. **Abre** el archivo `01_crear_usuario_y_bd.sql`
2. **Selecciona SOLO esta línea:**
   ```sql
   CREATE USER usuario WITH PASSWORD 'pass';
   ```
3. **Ejecuta** (F5 o botón ▶️)
4. ✅ Deberías ver: `CREATE ROLE` - Query returned successfully

---

### **PASO 3: Crear Base de Datos**

1. **Abre** el archivo `01b_crear_base_datos.sql`
2. **Selecciona SOLO estas líneas:**
   ```sql
   CREATE DATABASE resej_db
       OWNER usuario
       ENCODING 'UTF8'
       LC_COLLATE = 'Spanish_Spain.1252'
       LC_CTYPE = 'Spanish_Spain.1252'
       TEMPLATE = template0;
   ```
3. **Ejecuta** (F5 o botón ▶️)
4. ✅ Deberías ver: `CREATE DATABASE` - Query returned successfully

---

### **PASO 4: Dar Permisos**

1. **Abre** el archivo `01c_dar_permisos.sql`
2. **Selecciona SOLO esta línea:**
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE resej_db TO usuario;
   ```
3. **Ejecuta** (F5 o botón ▶️)
4. ✅ Deberías ver: `GRANT` - Query returned successfully

---

### **PASO 5: Refrescar y Verificar**

1. En el panel izquierdo, clic derecho en **Databases**
2. Selecciona **Refresh** (o presiona F5)
3. ✅ Deberías ver **resej_db** en la lista de bases de datos

---

### **PASO 6: Configurar Permisos del Esquema**

1. Clic derecho en **resej_db** → **Query Tool**
2. **Abre** el archivo `02_configurar_permisos.sql`
3. **Selecciona TODO el contenido** (Ctrl+A)
4. **Ejecuta** (F5 o botón ▶️)
5. ✅ Deberías ver varios mensajes `GRANT` y `ALTER DEFAULT PRIVILEGES`

---

### **PASO 7: Ejecutar Migraciones (VS Code)**

Ahora vuelve a **VS Code** y ejecuta en la terminal:

```bash
cd /c/Users/flavi/OneDrive/Escritorio/RESEJ/BACKEND

# Crear las 6 tablas del sistema
npm run migrate:latest
```

**Resultado esperado:**

```
Batch 1 run: 6 migrations
✅ Migraciones ejecutadas correctamente
```

---

### **PASO 8: Crear Usuario Admin**

```bash
npm run seed:run
```

**Resultado esperado:**

```
Ran 1 seed file
✅ Usuario admin creado
```

**Credenciales:**

- Usuario: `admin`
- Contraseña: `Admin2025!`

---

### **PASO 9: Iniciar Servidor**

```bash
npm run dev
```

**Resultado esperado:**

```
[nodemon] starting `node server.js`
✅ Base de datos conectada correctamente
🚀 Servidor corriendo en http://localhost:4000
```

---

### **PASO 10: Probar que Funciona**

Abre **otro terminal** y ejecuta:

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

---

## 🎉 ¡Éxito!

Si llegaste hasta aquí y todo funcionó, tu backend está **100% operativo**.

---

## 🐛 Problemas Comunes

### "role 'usuario' already exists"

El usuario ya existe. Opciones:

**A) Eliminar y recrear:**

```sql
DROP USER usuario;
-- Luego ejecutar PASO 2 nuevamente
```

**B) Saltar al PASO 3** (crear solo la base de datos)

---

### "database 'resej_db' already exists"

La base de datos ya existe. Opciones:

**A) Eliminar y recrear:**

```sql
DROP DATABASE resej_db;
-- Luego ejecutar PASO 3 nuevamente
```

**B) Saltar al PASO 4** (dar permisos)

---

### "authentication failed"

Verifica el archivo `.env`:

```env
DB_USER=usuario
DB_PASSWORD=pass
```

---

## 📞 ¿Necesitas Ayuda?

Si algún paso falla:

1. Copia el mensaje de error completo
2. Dime en qué paso estás
3. Te ayudo inmediatamente

---

**¡Adelante! Comienza con el PASO 1.** 🚀
