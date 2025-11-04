# 📱 Guía de Acceso desde Celular

## 🎯 Problema

Cuando generas un enlace de acceso temporal, este usa `localhost` que solo funciona en la misma computadora. Para acceder desde tu celular, necesitas usar la IP local de tu red.

## ✅ Solución Implementada

### 1. Detección Automática de IP

El sistema ahora detecta automáticamente tu IP de red local al generar enlaces.

### 2. Configuración Manual (Recomendado)

#### Paso 1: Detectar tu IP Local

```bash
cd BACKEND
npm run detect-ip
```

Esto mostrará tu IP local, por ejemplo: `192.168.1.23`

#### Paso 2: Configurar el Backend

Abre el archivo `BACKEND/.env` y configura:

```env
FRONTEND_URL=http://192.168.1.23:5173
FRONTEND_PORT=5173
```

**IMPORTANTE**: Reemplaza `192.168.1.23` con TU IP que apareció en el paso 1.

#### Paso 3: Configurar CORS

En el mismo archivo `.env`, agrega tu IP a las origins permitidas:

```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174,http://192.168.1.23:5173
```

#### Paso 4: Reiniciar Servidores

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

El frontend ahora aceptará conexiones desde cualquier dispositivo en la red.

### 3. Acceder desde tu Celular

1. **Conecta tu celular a la MISMA RED WiFi** que tu computadora

2. **Abre el navegador** en tu celular

3. **Navega a:** `http://192.168.1.23:5173`
   (usa TU IP detectada)

4. **Genera un enlace** desde la computadora:

   - Login como administrador
   - Ve a "Gestión de Usuarios"
   - Click en 🔗 junto a un usuario
   - Copia el enlace generado

5. **El enlace ahora tendrá el formato:**

   ```
   http://192.168.1.23:5173/login?token=abc123...
   ```

6. **Envía este enlace a tu celular** por:

   - WhatsApp
   - Email
   - SMS
   - Código QR (recomendado)

7. **Abre el enlace en tu celular**
   - Se abrirá automáticamente el login
   - La sesión iniciará automáticamente

## 🔧 Verificación

### Comprobar que el Frontend es Accesible

Desde tu celular, abre: `http://192.168.1.23:5173`

- ✅ Debería aparecer la página de login
- ❌ Si no carga, verifica que estés en la misma red WiFi

### Comprobar que el Backend es Accesible

Desde tu celular, abre: `http://192.168.1.23:3000/health`

- ✅ Debería mostrar: `{"status":"OK",...}`
- ❌ Si no responde, verifica el firewall de Windows

## 🛡️ Firewall de Windows

Si no puedes acceder desde el celular, probablemente el firewall esté bloqueando las conexiones.

### Permitir Node.js en el Firewall:

1. Abre **Windows Defender Firewall**
2. Click en **Configuración avanzada**
3. Click en **Reglas de entrada**
4. Click en **Nueva regla...**
5. Selecciona **Programa** → Siguiente
6. Busca `node.exe` (usualmente en `C:\Program Files\nodejs\node.exe`)
7. Selecciona **Permitir la conexión**
8. Aplica para **Dominio, Privado y Público**
9. Dale un nombre: "Node.js - RESEJ"
10. **Finalizar**

**O ejecuta este comando como Administrador en PowerShell:**

```powershell
New-NetFirewallRule -DisplayName "Node.js - RESEJ" -Direction Inbound -Program "C:\Program Files\nodejs\node.exe" -Action Allow
```

## 🔄 Cambios Realizados

### Backend:

- ✅ Detección inteligente de IP de red local (prioriza 192.168.x.x, 10.x.x.x)
- ✅ Script `detect-ip.js` para detectar tu IP fácilmente
- ✅ Configuración `FRONTEND_URL` en `.env`
- ✅ CORS actualizado para permitir tu IP

### Frontend:

- ✅ Vite configurado con `host: '0.0.0.0'` para aceptar conexiones externas
- ✅ Puerto fijo en 5173

## 📝 Notas Importantes

1. **Misma Red WiFi**: Tu celular DEBE estar en la misma red WiFi que tu computadora

2. **IP Dinámica**: Si tu router usa DHCP, tu IP puede cambiar. Si esto pasa:

   - Ejecuta `npm run detect-ip` nuevamente
   - Actualiza el `.env` con la nueva IP
   - Reinicia el backend

3. **Firewall**: Windows Firewall puede bloquear conexiones. Sigue las instrucciones arriba.

4. **Seguridad**: Los enlaces son de un solo uso y expiran en 24 horas

5. **Desarrollo vs Producción**:
   - En desarrollo: usa IP local (192.168.x.x)
   - En producción: usa dominio real (ejemplo.com)

## 🆘 Problemas Comunes

### "No se puede conectar" desde el celular

- ✅ Verifica que ambos dispositivos estén en la misma red WiFi
- ✅ Ejecuta `npm run detect-ip` para confirmar tu IP
- ✅ Verifica el firewall de Windows
- ✅ Intenta hacer ping desde el celular a tu IP

### "CORS error" en el navegador del celular

- ✅ Verifica que tu IP esté en `ALLOWED_ORIGINS` en `.env`
- ✅ Reinicia el servidor backend después de cambiar `.env`

### El enlace muestra "localhost" en lugar de tu IP

- ✅ Configura `FRONTEND_URL` en `BACKEND/.env`
- ✅ Reinicia el servidor backend

### El token ya fue usado o expiró

- ✅ Los tokens son de un solo uso
- ✅ Genera un nuevo enlace
- ✅ Los tokens expiran en 24 horas

## 🎨 Bonus: Generar Código QR

Para facilitar el envío del enlace, puedes generar un código QR:

1. Ve a: https://www.qr-code-generator.com/
2. Pega el enlace generado
3. Descarga el QR
4. El usuario escanea con su celular
5. Login automático

## 📞 Soporte

Si tienes problemas, verifica:

1. Misma red WiFi
2. IP correcta en `.env`
3. Servidores reiniciados
4. Firewall configurado
