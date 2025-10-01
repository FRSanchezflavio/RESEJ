# 🔧 Solución: Servidor Backend RE.SE.J

## ❌ Problema Identificado

El error **HTTP 000** significa que el servidor **no está corriendo** cuando ejecutas las pruebas.

El problema es que necesitas **DOS terminales separadas**:

1. Una para mantener el servidor corriendo
2. Otra para ejecutar los comandos de prueba

---

## ✅ Solución Paso a Paso

### **PASO 1: Iniciar el Servidor**

Abre **VS Code** y:

1. Ve al menú **Terminal** → **New Terminal** (o presiona `` Ctrl+` ``)
2. Ejecuta:

```bash
cd /c/Users/flavi/OneDrive/Escritorio/RESEJ/BACKEND
npm run dev
```

**Deberías ver:**

```
✓ Conexión a la base de datos establecida correctamente
🚀 Servidor RE.SE.J iniciado correctamente
📍 URL: http://0.0.0.0:4000
```

**⚠️ IMPORTANTE: DEJA ESTA TERMINAL ABIERTA Y CORRIENDO**

---

### **PASO 2: Abrir Segunda Terminal para Pruebas**

En VS Code:

1. Ve al menú **Terminal** → **Split Terminal** (o el botón ➕ de dividir)
   - O simplemente abre **otra terminal nueva**
2. Ahora deberías tener **2 terminales**:
   - **Terminal 1**: Servidor corriendo (no tocar)
   - **Terminal 2**: Para ejecutar comandos de prueba

---

### **PASO 3: Probar los Endpoints**

En la **segunda terminal**, ejecuta:

#### Prueba 1: Health Check

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

#### Prueba 2: Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","password":"Admin2025!"}'
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "usuario": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 🖼️ Configuración Visual en VS Code

```
┌─────────────────────────────────────────┐
│ VS Code                                 │
├─────────────────────────────────────────┤
│                                         │
│  [Código Editor]                        │
│                                         │
├─────────────────────────────────────────┤
│ TERMINAL 1: npm run dev (CORRIENDO) ⚠️  │
│ [nodemon] starting node server.js       │
│ ✓ Servidor iniciado en puerto 4000     │
├─────────────────────────────────────────┤
│ TERMINAL 2: Pruebas (aquí escribes) ✍️  │
│ $ curl http://localhost:4000/health     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Usando el Script de Prueba

Si quieres probar todo automáticamente:

**Terminal 1:** Servidor corriendo

```bash
npm run dev
```

**Terminal 2:** Ejecutar pruebas

```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 🌐 Alternativa: Usar el Navegador

Si prefieres evitar la terminal para pruebas:

1. Inicia el servidor: `npm run dev`
2. Abre tu navegador
3. Ve a: `http://localhost:4000/health`

Deberías ver el JSON de respuesta.

---

## 📱 Alternativa: Instalar Thunder Client

Thunder Client es una extensión de VS Code como Postman pero integrada:

### Instalar:

1. En VS Code, ve a **Extensions** (Ctrl+Shift+X)
2. Busca: **Thunder Client**
3. Clic en **Install**

### Usar:

1. Clic en el ícono ⚡ en la barra lateral
2. Clic en **New Request**
3. GET: `http://localhost:4000/health`
4. Clic en **Send**

**Ventajas:**

- No necesitas segunda terminal
- Interfaz visual
- Guarda las peticiones
- Maneja tokens automáticamente

---

## 🐛 Solución de Problemas

### "El servidor se detiene al ejecutar curl"

**Causa:** Estás ejecutando curl en la misma terminal del servidor.

**Solución:** Usa DOS terminales separadas.

### "Connection refused" o "HTTP 000"

**Causa:** El servidor no está corriendo.

**Solución:**

1. Verifica que `npm run dev` esté corriendo
2. Espera 2-3 segundos después de iniciar
3. Verifica que diga "Servidor iniciado en puerto 4000"

### "curl: command not found"

**Causa:** curl no está instalado o no está en el PATH.

**Solución:**

- Usa Git Bash (incluye curl)
- O instala curl para Windows
- O usa Thunder Client
- O usa el navegador para GET requests

---

## ✅ Resumen de Comandos

```bash
# Terminal 1 - Iniciar servidor
cd /c/Users/flavi/OneDrive/Escritorio/RESEJ/BACKEND
npm run dev
# ⚠️ Dejar corriendo

# Terminal 2 - Pruebas
curl http://localhost:4000/health
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","password":"Admin2025!"}'
```

---

## 🎉 Próximos Pasos

Una vez que confirmes que funciona:

1. ✅ Revisa `API_EXAMPLES.md` para ver todos los endpoints
2. ✅ Instala Thunder Client para pruebas más cómodas
3. ✅ Comienza a integrar con tu frontend
4. ✅ Lee `DESPLIEGUE_PRODUCCION.md` cuando estés listo

---

**¿Listo? Abre dos terminales y prueba de nuevo.** 🚀
