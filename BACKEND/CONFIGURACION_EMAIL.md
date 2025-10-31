# Configuración de Email para RESEJ

## 📧 Guía de Configuración de Email con Gmail

### Paso 1: Habilitar la autenticación de dos factores en Gmail

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. En el menú lateral, selecciona **Seguridad**
3. Busca la sección **Cómo inicias sesión en Google**
4. Haz clic en **Verificación en dos pasos** y actívala

### Paso 2: Generar una contraseña de aplicación

1. Una vez activada la verificación en dos pasos, regresa a **Seguridad**
2. Busca **Contraseñas de aplicaciones** (puede estar en la sección de verificación en dos pasos)
3. Haz clic en **Contraseñas de aplicaciones**
4. Selecciona:
   - **App**: Correo
   - **Dispositivo**: Otro (pon "RESEJ Backend")
5. Gmail generará una contraseña de 16 caracteres
6. **Copia esta contraseña** (no la podrás ver de nuevo)

### Paso 3: Configurar las variables de entorno

Edita el archivo `BACKEND/.env` y actualiza las siguientes variables:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu-correo@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM="Sistema RESEJ <tu-correo@gmail.com>"
FRONTEND_URL=http://localhost:5173
```

**Importante:**

- `EMAIL_USER`: Tu correo completo de Gmail
- `EMAIL_PASSWORD`: La contraseña de 16 caracteres que generaste (puede incluir espacios)
- `EMAIL_FROM`: Puede ser el mismo correo o un nombre personalizado

### Ejemplo de configuración:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=admin@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM="Sistema RESEJ <admin@gmail.com>"
FRONTEND_URL=http://localhost:5173
```

## 🔧 Alternativas a Gmail

### Outlook / Hotmail

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu-correo@outlook.com
EMAIL_PASSWORD=tu-contraseña
EMAIL_FROM="Sistema RESEJ <tu-correo@outlook.com>"
```

### Yahoo Mail

```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu-correo@yahoo.com
EMAIL_PASSWORD=tu-contraseña-de-aplicacion
EMAIL_FROM="Sistema RESEJ <tu-correo@yahoo.com>"
```

### Servidor SMTP propio

```env
EMAIL_HOST=smtp.tudominio.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=noreply@tudominio.com
EMAIL_PASSWORD=tu-contraseña
EMAIL_FROM="Sistema RESEJ <noreply@tudominio.com>"
```

## ✅ Verificar la configuración

Una vez configurado, reinicia el servidor backend:

```bash
cd BACKEND
npm start
```

En los logs deberías ver:

```
✓ Configuración de email verificada correctamente
```

Si ves una advertencia:

```
⚠ No se pudo verificar configuración de email
```

Revisa que:

- El correo y contraseña sean correctos
- La verificación en dos pasos esté activa (Gmail)
- La contraseña de aplicación esté correcta
- No haya espacios extra en las variables de entorno

## 🧪 Probar el envío de emails

1. Ve a la sección de **Gestión de Usuarios** en el Dashboard
2. Haz clic en **Crear Nuevo Usuario**
3. Completa el formulario:
   - Usuario
   - Nombre
   - Apellido
   - **Email** (importante)
   - Contraseña
   - Rol
4. Asegúrate de que el checkbox **"✉️ Enviar credenciales por email"** esté marcado
5. Haz clic en **Crear**

Si todo está configurado correctamente:

- Verás un mensaje: "Usuario creado exitosamente. ✉️ Se han enviado las credenciales al correo: ..."
- El usuario recibirá un correo con:
  - Sus credenciales de acceso
  - Un botón para acceder directamente al sistema
  - Instrucciones de seguridad

## 🚨 Solución de problemas

### Error: "EAUTH - Invalid login"

- Verifica que el correo y contraseña sean correctos
- En Gmail, asegúrate de usar la contraseña de aplicación, no tu contraseña normal

### Error: "ETIMEDOUT" o "ECONNREFUSED"

- Verifica que el `EMAIL_HOST` y `EMAIL_PORT` sean correctos
- Revisa que no haya firewall bloqueando el puerto 587

### Error: "self signed certificate"

Si usas un servidor SMTP con certificado autofirmado, cambia:

```env
EMAIL_SECURE=true
```

### No llega el correo

- Revisa la carpeta de **Spam**
- Verifica que el email del usuario sea correcto
- Revisa los logs del backend para ver detalles del error

## 📝 Notas de seguridad

1. **Nunca** compartas tu contraseña de aplicación
2. **Nunca** subas el archivo `.env` a repositorios públicos
3. La contraseña se envía en texto plano por email (es temporal)
4. Recomienda al usuario cambiar su contraseña en el primer inicio de sesión
5. Usa HTTPS en producción para el `FRONTEND_URL`

## 📋 Plantilla del correo

El usuario recibirá un correo HTML profesional con:

- 🎉 Encabezado de bienvenida
- 📋 Credenciales (usuario y contraseña)
- 🚀 Botón de acceso directo al sistema
- ⚠️ Instrucciones de seguridad
- 📧 Pie de página con información del sistema

## 🔄 Funcionalidades adicionales

El servicio de email también incluye:

1. **Envío de credenciales**: Al crear un nuevo usuario
2. **Restablecimiento de contraseña**: Para recuperar acceso (función preparada para futuro uso)
3. **Verificación de configuración**: Al iniciar el servidor

---

**Documentación actualizada:** 31 de octubre de 2025
