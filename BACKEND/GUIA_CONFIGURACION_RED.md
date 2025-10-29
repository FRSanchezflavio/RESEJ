# Guía de Configuración de Red - RE.SE.J

## 🌐 Problema: ERR_CONNECTION_TIMED_OUT

Este error ocurre cuando el frontend no puede conectarse al backend.

## ✅ Solución Paso a Paso

### **1. Verifica que el backend esté corriendo**

```bash
cd BACKEND
node server.js
```

Deberías ver algo como:

```
🚀 Servidor RE.SE.J iniciado correctamente
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 URLs de acceso disponibles:
   - Local:    http://localhost:3000
   - Local:    http://127.0.0.1:3000
   - Red:      http://192.168.1.23:3000
```

### **2. Identifica qué URL usar**

#### **Opción A: Desarrollo local (mismo equipo)**

Si frontend y backend están en el **mismo equipo**:

**Frontend `.env`:**

```env
VITE_API_URL=http://localhost:3000/api
```

#### **Opción B: Acceso desde la red (otro dispositivo)**

Si accedes desde **otro equipo/celular en la misma red**:

**Frontend `.env`:**

```env
VITE_API_URL=http://192.168.1.23:3000/api
```

_(Reemplaza `192.168.1.23` con la IP que muestra el servidor backend)_

### **3. Configura CORS en el backend**

Edita `BACKEND/.env`:

```env
# Permitir acceso desde localhost y red local
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://192.168.1.23:5173,http://192.168.1.23:5175
```

### **4. Reinicia ambos servidores**

**Terminal 1 - Backend:**

```bash
cd BACKEND
node server.js
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### **5. Verifica la conexión**

Abre el navegador y ve a:

- `http://localhost:3000/health` (debería mostrar JSON)

En la consola del navegador (F12), deberías ver:

```
🌐 API configurada: http://localhost:3000/api
```

## 🔥 Firewall de Windows

Si accedes desde otro dispositivo y no funciona:

```powershell
# Ejecuta como Administrador
netsh advfirewall firewall add rule name="Node Backend" dir=in action=allow protocol=TCP localport=3000
```

## 📱 Acceso desde celular

1. **Conecta el celular a la misma WiFi**
2. **Obtén la IP del backend** (aparece al iniciar el servidor)
3. **Configura el frontend:**
   ```env
   VITE_API_URL=http://192.168.1.23:3000/api
   ```
4. **Inicia Vite con host:**
   ```bash
   npm run dev -- --host
   ```
5. **Accede desde el celular:**
   ```
   http://192.168.1.23:5173
   ```

## ❌ Problemas Comunes

### Error: "Network Error" o "ERR_CONNECTION_TIMED_OUT"

**Causa:** El frontend no puede conectarse al backend

**Solución:**

1. Verifica que el backend esté corriendo
2. Verifica que la URL en `.env` sea correcta
3. Verifica que CORS permita el origen
4. Verifica el firewall

### Error: "CORS policy"

**Causa:** El origen no está permitido en CORS

**Solución:**
Agrega el origen a `ALLOWED_ORIGINS` en `BACKEND/.env`:

```env
ALLOWED_ORIGINS=http://localhost:5173,http://192.168.1.23:5173
```

### El frontend no lee el .env

**Causa:** Vite no recarga las variables de entorno automáticamente

**Solución:**

```bash
# Detén el servidor (Ctrl+C)
npm run dev
```

## 🧪 Prueba de Conexión

Ejecuta en la consola del navegador (F12):

```javascript
fetch('http://localhost:3000/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

Si funciona, deberías ver:

```json
{
  "status": "OK",
  "timestamp": "2025-10-29T...",
  "environment": "development"
}
```

## 📝 Checklist Final

- [ ] Backend corriendo en `http://0.0.0.0:3000`
- [ ] Frontend `.env` creado con `VITE_API_URL` correcta
- [ ] `ALLOWED_ORIGINS` en backend incluye URL del frontend
- [ ] Ambos servidores reiniciados
- [ ] `http://localhost:3000/health` responde
- [ ] Consola del navegador muestra "🌐 API configurada"
- [ ] No hay errores de CORS en la consola
