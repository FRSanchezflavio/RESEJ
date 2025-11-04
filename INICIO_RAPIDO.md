# 🚀 GUÍA RÁPIDA - Acceso desde Celular

## ✅ SISTEMA CONFIGURADO Y LISTO

Tu IP local: **192.168.1.23**

---

## 📋 PASO A PASO

### 🖥️ EN TU COMPUTADORA:

**1. Ambos servidores están corriendo:**

- ✅ Backend: http://0.0.0.0:3000
- ✅ Frontend: http://192.168.1.23:5173

**2. Genera un enlace de acceso:**

```
1. Abre: http://localhost:5173 (o http://192.168.1.23:5173)
2. Login con tu usuario administrador
3. Ve a "Gestión de Usuarios"
4. Click en el botón 🔗 junto a cualquier usuario
5. Se abrirá un modal con el enlace
6. Click en "Copiar enlace"
```

**El enlace se verá así:**

```
http://192.168.1.23:5173/login?token=abc123def456...
```

---

### 📱 EN TU CELULAR:

**1. Conecta a la misma WiFi:**

- Tu celular debe estar en la MISMA red que tu computadora
- Verifica que ambos estén conectados a la misma WiFi

**2. Prueba primero el acceso básico:**

- Abre el navegador
- Ve a: **http://192.168.1.23:5173**
- Deberías ver la pantalla de login ✅

**3. Usa el enlace de acceso temporal:**

- Envíate el enlace por WhatsApp, email, etc.
- O escanea un código QR (recomendado)
- Al abrir el enlace, entrarás automáticamente

---

## 🔧 VERIFICACIÓN RÁPIDA

### Desde tu celular, prueba estas URLs:

1. **Frontend:**

   ```
   http://192.168.1.23:5173
   ```

   Deberías ver: Pantalla de login de RESEJ

2. **Backend (API):**
   ```
   http://192.168.1.23:3000/health
   ```
   Deberías ver: `{"status":"OK",...}`

---

## 🎯 CÓMO GENERAR UN CÓDIGO QR

**Opción 1: Usando una web**

1. Ve a: https://www.qr-code-generator.com/
2. Pega el enlace generado
3. Descarga el QR
4. Muéstraselo al usuario
5. El usuario escanea con su celular
6. Login automático ✅

**Opción 2: Usando Google Chrome**

1. Copia el enlace generado
2. En Chrome, ve a la URL
3. Click derecho en la página
4. "Crear código QR para esta página"
5. Guarda o comparte el QR

---

## ⚠️ SOLUCIÓN DE PROBLEMAS

### ❌ "No se puede conectar" desde el celular

**Causa 1: No están en la misma WiFi**

- ✅ Verifica que ambos dispositivos estén conectados a la misma red

**Causa 2: Firewall de Windows bloqueando**

- Solución: Abre PowerShell como Administrador y ejecuta:

```powershell
New-NetFirewallRule -DisplayName "Node.js - RESEJ" -Direction Inbound -Program "C:\Program Files\nodejs\node.exe" -Action Allow
```

**Causa 3: Antivirus bloqueando**

- Agrega una excepción para Node.js en tu antivirus

---

### ❌ "CORS error" en el navegador

- ✅ Ya está configurado, no deberías tener este problema
- Si aparece, verifica que el `.env` tenga:

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174,http://192.168.1.23:5173
```

---

### ❌ El enlace dice "Token inválido o expirado"

**Causa 1: Ya se usó el token**

- Los tokens son de UN SOLO USO
- Genera un nuevo enlace

**Causa 2: Han pasado más de 24 horas**

- Los tokens expiran en 24 horas
- Genera un nuevo enlace

---

## 📊 CARACTERÍSTICAS DEL SISTEMA

✅ **Token de un solo uso** - No puede reutilizarse
✅ **Expira en 24 horas** - Seguridad automática
✅ **Sin contraseña** - El usuario no necesita recordarla
✅ **Auditoría completa** - Todos los accesos quedan registrados
✅ **Detección de IP** - Se registra quién accedió y desde dónde

---

## 🎨 EJEMPLO DE USO REAL

**Caso: Quieres dar acceso a un usuario nuevo**

1. **Creas el usuario** en "Gestión de Usuarios"
2. **Generas el enlace** clickeando 🔗
3. **Se lo envías** por WhatsApp:

   ```
   Hola! Este es tu enlace de acceso al sistema RESEJ.
   Solo haz click y entrarás automáticamente:

   http://192.168.1.23:5173/login?token=abc123...

   ⚠️ Este enlace:
   - Solo funciona UNA vez
   - Expira en 24 horas
   - Es personal e intransferible
   ```

4. **El usuario lo abre** en su celular
5. **Entra automáticamente** ✅

---

## 📞 COMANDOS ÚTILES

**Ver tu IP:**

```bash
cd BACKEND
npm run detect-ip
```

**Verificar sistema:**

```bash
cd BACKEND
npm run verificar
```

**Reiniciar servidores:**

```bash
# Terminal 1
cd BACKEND
node server.js

# Terminal 2
cd frontend
npm run dev
```

---

## ✨ PRÓXIMOS PASOS

1. ✅ Prueba desde tu celular
2. ✅ Genera un enlace de prueba
3. ✅ Envíatelo por WhatsApp
4. ✅ Ábrelo en tu celular
5. ✅ Verifica que funcione el login automático

---

## 🎉 ¡TODO LISTO!

Tu sistema está completamente configurado para:

- ✅ Acceso desde computadora (localhost)
- ✅ Acceso desde celular (red local)
- ✅ Enlaces de acceso temporal
- ✅ Login automático
- ✅ Seguridad con tokens de un solo uso

**Ahora puedes compartir enlaces de acceso de forma segura!** 🔒
