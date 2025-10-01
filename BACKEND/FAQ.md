# Preguntas Frecuentes (FAQ)

## RE.SE.J - Registro de Secuestros Judiciales

---

## 📋 Instalación y Configuración

### ¿Cómo instalo el sistema por primera vez?

1. Instalar Node.js 18+ y PostgreSQL 14+
2. Clonar o copiar el código del backend
3. Ejecutar el script de instalación:
   - **Windows:** Doble clic en `instalar.bat`
   - **Linux/Mac:** `chmod +x instalar.sh && ./instalar.sh`
4. Configurar PostgreSQL (ejecutar `setup_database.sql`)
5. Editar archivo `.env` con credenciales
6. Ejecutar migraciones: `npm run migrate:latest`
7. Crear usuario admin: `npm run seed:run`
8. Iniciar servidor: `npm run dev`

### ¿Qué puerto usa el servidor?

Por defecto el puerto **3000**. Se puede cambiar en el archivo `.env`:

```env
PORT=3000
```

### ¿Cómo genero secretos seguros para JWT?

Ejecutar en la terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copiar el resultado generado y pegarlo en `.env`:

```env
JWT_ACCESS_SECRET=resultado_aqui
JWT_REFRESH_SECRET=otro_resultado_aqui
```

---

## 🔐 Autenticación y Seguridad

### ¿Cuáles son las credenciales por defecto del admin?

- **Usuario:** `admin`
- **Contraseña:** `Admin2025!`

**⚠️ IMPORTANTE:** Cambiar la contraseña después del primer login.

### ¿Cómo cambio la contraseña del admin?

**Opción 1: Desde la API**

```bash
POST /api/usuarios/:id/reset-password
Authorization: Bearer TOKEN_ADMIN
{
  "nueva_password": "NuevaPassword2025!"
}
```

**Opción 2: Desde la base de datos**

```sql
-- Generar hash de nueva contraseña (bcrypt rounds=12)
-- Luego actualizar en BD
UPDATE usuarios
SET password_hash = 'HASH_GENERADO_AQUI'
WHERE usuario = 'admin';
```

### ¿Cuánto tiempo dura un token de acceso?

- **Access Token:** 24 horas (configurable en `.env`)
- **Refresh Token:** 7 días (configurable en `.env`)

```env
JWT_ACCESS_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

### ¿Qué hacer si me bloquea el rate limiter?

El rate limiter tiene diferentes límites:

- **General:** 100 requests por 15 minutos
- **Login:** 5 intentos por 15 minutos
- **Creación:** 10 requests por minuto
- **Upload:** 5 uploads por minuto

Esperar el tiempo indicado o ajustar los límites en `.env`:

```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 👥 Usuarios y Roles

### ¿Qué roles existen en el sistema?

1. **administrador**: Acceso completo (CRUD en todo)
2. **usuario_consulta**: Solo lectura (búsquedas y visualización)

### ¿Cómo creo un usuario de solo consulta?

```bash
POST /api/usuarios
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "usuario": "consulta1",
  "password": "Consulta2025!",
  "nombre": "Usuario",
  "apellido": "Consulta",
  "email": "consulta@policia.gob.ar",
  "rol": "usuario_consulta"
}
```

### ¿Cómo desactivo un usuario sin eliminarlo?

```bash
PUT /api/usuarios/:id/desactivar
Authorization: Bearer TOKEN_ADMIN
```

Para reactivarlo:

```bash
PUT /api/usuarios/:id/activar
Authorization: Bearer TOKEN_ADMIN
```

---

## 📁 Archivos Adjuntos

### ¿Qué tipos de archivos puedo subir?

- **PDF:** application/pdf
- **JPEG:** image/jpeg
- **PNG:** image/png

Configurado en `.env`:

```env
ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/png
```

### ¿Cuál es el tamaño máximo de archivo?

**5 MB** por defecto. Configurable en `.env`:

```env
MAX_FILE_SIZE=5242880
```

Para 10 MB:

```env
MAX_FILE_SIZE=10485760
```

### ¿Cómo subo un archivo?

```bash
POST /api/archivos
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

archivo: [seleccionar archivo]
registro_id: 1
tipo_documento: "acta_secuestro"
descripcion: "Acta judicial"
```

### ¿Dónde se almacenan los archivos?

En el directorio `uploads/` con nombres únicos (UUID) para evitar colisiones.

---

## 🔍 Búsquedas y Consultas

### ¿Cómo busco una persona por DNI?

```bash
GET /api/personas?dni=12345678
Authorization: Bearer TOKEN
```

### ¿Cómo busco todos los registros de una causa?

```bash
GET /api/registros?numero_causa=1234&anio_causa=2024
Authorization: Bearer TOKEN
```

### ¿Cómo filtro por rango de fechas?

```bash
GET /api/registros?fecha_desde=2024-01-01&fecha_hasta=2024-12-31
Authorization: Bearer TOKEN
```

### ¿Cómo obtengo estadísticas?

```bash
GET /api/registros/estadisticas
Authorization: Bearer TOKEN
```

Retorna:

- Total de registros
- Registros por estado de causa
- Registros por mes

---

## 🗄️ Base de Datos

### ¿Cómo hago backup de la base de datos?

**Manual:**

```bash
pg_dump -h localhost -U resej_user resej_db > backup.sql
```

**Comprimido:**

```bash
pg_dump -h localhost -U resej_user resej_db | gzip > backup.sql.gz
```

### ¿Cómo restauro un backup?

**Desde SQL:**

```bash
psql -h localhost -U resej_user -d resej_db < backup.sql
```

**Desde SQL comprimido:**

```bash
gunzip -c backup.sql.gz | psql -h localhost -U resej_user -d resej_db
```

### ¿Cómo ejecuto una migración?

**Aplicar última migración:**

```bash
npm run migrate:latest
```

**Revertir última migración:**

```bash
npm run migrate:rollback
```

**Crear nueva migración:**

```bash
npm run migrate:make nombre_migracion
```

---

## 🐛 Solución de Problemas

### El servidor no inicia

**1. Verificar puerto en uso:**

```bash
# Linux/Mac
lsof -i :3000

# Windows
netstat -ano | findstr :3000
```

**2. Verificar logs:**

```bash
tail -f logs/error.log
```

**3. Verificar conexión a PostgreSQL:**

```bash
psql -h localhost -U resej_user -d resej_db
```

### Error: "Database connection failed"

**Verificar:**

1. PostgreSQL está corriendo
2. Credenciales en `.env` son correctas
3. Base de datos `resej_db` existe
4. Usuario `resej_user` tiene permisos

**Probar conexión:**

```bash
psql -h localhost -U resej_user -d resej_db
```

### Error: "JWT malformed"

El token JWT está corrupto o mal formado.

**Soluciones:**

1. Hacer login nuevamente para obtener nuevo token
2. Verificar que el token se está enviando correctamente:
   ```
   Authorization: Bearer TOKEN_AQUI
   ```
3. Verificar que no hay espacios extras en el token

### Error: "File too large"

El archivo excede el tamaño máximo permitido (5MB por defecto).

**Soluciones:**

1. Comprimir el archivo
2. Aumentar límite en `.env`:
   ```env
   MAX_FILE_SIZE=10485760
   ```
3. Reiniciar servidor después de cambiar `.env`

### Error 429: "Too many requests"

Has excedido el límite de peticiones.

**Esperar** el tiempo del rate limiter (15 minutos) o ajustar límites en `.env`.

### Los logs de auditoría no se guardan

**Verificar:**

1. Tabla `logs_auditoria` existe (ejecutar migraciones)
2. Middleware `auditLogger` está configurado en rutas
3. No hay errores en `logs/error.log`

---

## 🔧 Mantenimiento

### ¿Cómo limpio tokens expirados?

```bash
npm run cleanup:tokens
```

Ejecutar periódicamente (recomendado: semanal).

### ¿Cómo limpio archivos huérfanos?

```bash
npm run cleanup:files
```

Elimina archivos del sistema que no tienen registro en BD.

### ¿Cómo roto los logs?

Los logs se rotan automáticamente con Winston. Configuración en `src/utils/logger.js`.

**Manual:**

```bash
# Linux
sudo logrotate /etc/logrotate.d/resej-backend

# O simplemente eliminar logs antiguos
rm logs/*.log.*
```

### ¿Cómo actualizo dependencias?

**Ver dependencias desactualizadas:**

```bash
npm outdated
```

**Actualizar a versiones seguras:**

```bash
npm update
```

**Actualizar a últimas versiones (cuidado):**

```bash
npm install package@latest
```

**Verificar vulnerabilidades:**

```bash
npm audit
npm audit fix
```

---

## 📊 Monitoreo

### ¿Cómo verifico que el servidor está corriendo?

**Health Check:**

```bash
curl http://localhost:3000/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "timestamp": "2025-01-10T...",
  "database": "connected"
}
```

### ¿Cómo veo los logs en tiempo real?

**Logs combinados:**

```bash
tail -f logs/combined.log
```

**Solo errores:**

```bash
tail -f logs/error.log
```

**Logs del servicio (systemd):**

```bash
sudo journalctl -u resej-backend -f
```

### ¿Cómo monitoreo el uso de recursos?

**CPU y RAM:**

```bash
htop
```

**Espacio en disco:**

```bash
df -h
```

**Conexiones a PostgreSQL:**

```sql
SELECT count(*) FROM pg_stat_activity WHERE datname='resej_db';
```

---

## 🌐 Frontend Integration

### ¿Cómo conecto mi frontend?

1. Configurar CORS en `.env`:

   ```env
   CORS_ORIGIN=http://localhost:5173
   ```

2. En el frontend, usar la URL base:

   ```javascript
   const API_URL = 'http://localhost:3000/api';
   ```

3. Incluir token JWT en todas las peticiones:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   }
   ```

### ¿El backend sirve archivos estáticos del frontend?

No, el backend es **solo API REST**. El frontend debe ser servido por:

- Vite/React en desarrollo
- Nginx/Apache en producción
- Servicio de hosting estático (Vercel, Netlify, etc.)

---

## 🔒 Seguridad

### ¿Qué medidas de seguridad implementa el sistema?

1. **Autenticación:** JWT con refresh tokens
2. **Autorización:** Control de acceso basado en roles
3. **Passwords:** Hashing con bcrypt (12 rounds)
4. **Rate Limiting:** Límites por endpoint
5. **Validación:** Input validation con express-validator
6. **Headers:** Helmet para headers de seguridad
7. **CORS:** Configuración restrictiva
8. **Auditoría:** Logging completo de acciones
9. **Archivos:** Validación magic bytes + tipo MIME
10. **SQL Injection:** Knex previene automáticamente

### ¿Debo usar HTTPS?

**Sí, absolutamente** en producción. Consultar `DESPLIEGUE_PRODUCCION.md` para configurar con Let's Encrypt.

---

## 📞 Soporte

### ¿Dónde encuentro más documentación?

- **README.md**: Documentación técnica completa
- **INICIO_RAPIDO.md**: Guía de inicio rápido
- **API_EXAMPLES.md**: 70+ ejemplos de endpoints
- **DESPLIEGUE_PRODUCCION.md**: Guía de producción

### ¿A quién contacto para soporte?

- **Email:** soporte-ti@policia.tucuman.gob.ar
- **Departamento:** Área de Sistemas - Policía de Tucumán

---

## 📝 Notas Importantes

- Cambiar **siempre** las credenciales por defecto
- Hacer **backups regulares** de la base de datos
- Mantener el sistema **actualizado**
- Revisar **logs de auditoría** periódicamente
- Configurar **HTTPS** en producción
- Establecer **políticas de contraseñas** fuertes
- Documentar **cambios** realizados

---

**Última actualización:** Enero 2025
