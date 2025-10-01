# 🧪 Colección de Ejemplos de API - RE.SE.J

## Variables de entorno sugeridas

- `BASE_URL`: http://localhost:3000/api
- `ACCESS_TOKEN`: (se obtiene del login)

---

## 1️⃣ AUTENTICACIÓN

### 1.1 Login
\`\`\`
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
  "usuario": "admin",
  "password": "Admin2025!"
}
\`\`\`

### 1.2 Obtener datos del usuario actual
\`\`\`
GET {{BASE_URL}}/auth/me
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 1.3 Refrescar token
\`\`\`
POST {{BASE_URL}}/auth/refresh
Content-Type: application/json

{
  "refresh_token": "REFRESH_TOKEN_AQUI"
}
\`\`\`

### 1.4 Logout
\`\`\`
POST {{BASE_URL}}/auth/logout
Content-Type: application/json

{
  "refresh_token": "REFRESH_TOKEN_AQUI"
}
\`\`\`

---

## 2️⃣ USUARIOS (Solo Admin)

### 2.1 Listar usuarios
\`\`\`
GET {{BASE_URL}}/usuarios?page=1&limit=10
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 2.2 Crear usuario consulta
\`\`\`
POST {{BASE_URL}}/usuarios
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "usuario": "maria.lopez",
  "password": "Maria2025!Pass",
  "nombre": "María",
  "apellido": "López",
  "rol": "usuario_consulta"
}
\`\`\`

### 2.3 Crear usuario administrador
\`\`\`
POST {{BASE_URL}}/usuarios
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "usuario": "carlos.admin",
  "password": "Carlos2025!Admin",
  "nombre": "Carlos",
  "apellido": "Rodríguez",
  "rol": "administrador"
}
\`\`\`

### 2.4 Obtener usuario por ID
\`\`\`
GET {{BASE_URL}}/usuarios/2
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 2.5 Actualizar usuario
\`\`\`
PUT {{BASE_URL}}/usuarios/2
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "nombre": "María Fernanda",
  "apellido": "López García",
  "telefono": "381-5555555"
}
\`\`\`

### 2.6 Desactivar usuario
\`\`\`
PATCH {{BASE_URL}}/usuarios/2/deactivate
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 2.7 Activar usuario
\`\`\`
PATCH {{BASE_URL}}/usuarios/2/activate
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 2.8 Resetear contraseña
\`\`\`
POST {{BASE_URL}}/usuarios/2/reset-password
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "new_password": "NuevaPassword2025!"
}
\`\`\`

### 2.9 Ver historial de accesos
\`\`\`
GET {{BASE_URL}}/usuarios/2/historial-accesos?page=1&limit=20
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

---

## 3️⃣ PERSONAS

### 3.1 Listar personas
\`\`\`
GET {{BASE_URL}}/personas?page=1&limit=10
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 3.2 Buscar personas
\`\`\`
GET {{BASE_URL}}/personas/search?termino=Juan
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 3.3 Obtener persona por ID
\`\`\`
GET {{BASE_URL}}/personas/1
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 3.4 Crear persona (Solo Admin)
\`\`\`
POST {{BASE_URL}}/personas
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "nombre": "Juan Carlos",
  "apellido": "Gómez",
  "dni": "28345678",
  "fecha_nacimiento": "1985-03-15",
  "domicilio": "Av. Aconquija 1234, Yerba Buena",
  "telefono": "381-4567890",
  "email": "juan.gomez@email.com",
  "observaciones": "Sin antecedentes"
}
\`\`\`

### 3.5 Actualizar persona (Solo Admin)
\`\`\`
PUT {{BASE_URL}}/personas/1
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "domicilio": "Av. Aconquija 1234 - Dpto 5B, Yerba Buena",
  "telefono": "381-4567891"
}
\`\`\`

### 3.6 Eliminar persona (Solo Admin)
\`\`\`
DELETE {{BASE_URL}}/personas/1
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

---

## 4️⃣ REGISTROS DE SECUESTROS

### 4.1 Listar registros
\`\`\`
GET {{BASE_URL}}/registros?page=1&limit=10
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 4.2 Listar con filtros
\`\`\`
GET {{BASE_URL}}/registros?page=1&limit=10&estado_causa=abierta&fecha_desde=2025-01-01
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 4.3 Buscar registros (Todos los roles)
\`\`\`
GET {{BASE_URL}}/registros/buscar?termino=Juan&criterio=persona&page=1&limit=10
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 4.4 Buscar por legajo
\`\`\`
GET {{BASE_URL}}/registros/buscar?termino=123/2025&criterio=legajo
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 4.5 Obtener registro por ID
\`\`\`
GET {{BASE_URL}}/registros/1
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 4.6 Crear registro (Solo Admin)
\`\`\`
POST {{BASE_URL}}/registros
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "persona_id": 1,
  "fecha_ingreso": "2025-09-30",
  "ufi": "UFI N° 1 - Capital",
  "numero_legajo": "123/2025",
  "seccion_que_interviene": "División Robos y Hurtos",
  "detalle_secuestro": "1 celular marca Samsung, 1 notebook HP, documentación varia",
  "numero_protocolo": "PROT-001/2025",
  "cadena_custodia": "CC-001-2025",
  "nro_folio": "001",
  "nro_libro_secuestro": "LIB-001-2025",
  "of_a_cargo": "Oficial Juan Rodríguez - Leg. 12345",
  "tramite": "En proceso de investigación",
  "tipo_delito": "Robo agravado",
  "fecha_delito": "2025-09-28",
  "lugar_delito": "Calle San Martín 500, San Miguel de Tucumán",
  "descripcion": "Robo en vivienda con escalamiento",
  "estado_causa": "abierta",
  "numero_causa": "CAUSA-123/2025",
  "juzgado": "Juzgado de Instrucción N° 1"
}
\`\`\`

### 4.7 Actualizar registro (Solo Admin)
\`\`\`
PUT {{BASE_URL}}/registros/1
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "estado_causa": "en_proceso",
  "tramite": "Se realizó allanamiento. Causa en investigación",
  "descripcion": "Robo en vivienda con escalamiento. Se secuestraron elementos varios."
}
\`\`\`

### 4.8 Eliminar registro (Solo Admin)
\`\`\`
DELETE {{BASE_URL}}/registros/1
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 4.9 Obtener estadísticas (Solo Admin)
\`\`\`
GET {{BASE_URL}}/registros/estadisticas
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 4.10 Exportar registros (Solo Admin)
\`\`\`
GET {{BASE_URL}}/registros/exportar?estado_causa=abierta
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

---

## 5️⃣ ARCHIVOS

### 5.1 Subir archivo (Solo Admin)
\`\`\`
POST {{BASE_URL}}/archivos/upload
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: multipart/form-data

archivo: [Seleccionar archivo PDF/JPG/PNG]
registro_id: 1
\`\`\`

### 5.2 Listar archivos de un registro
\`\`\`
GET {{BASE_URL}}/archivos/registro/1
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 5.3 Descargar archivo
\`\`\`
GET {{BASE_URL}}/archivos/1/download
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 5.4 Eliminar archivo (Solo Admin)
\`\`\`
DELETE {{BASE_URL}}/archivos/1
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

---

## 6️⃣ LOGS DE AUDITORÍA (Solo Admin)

### 6.1 Listar todos los logs
\`\`\`
GET {{BASE_URL}}/logs?page=1&limit=50
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 6.2 Filtrar logs por acción
\`\`\`
GET {{BASE_URL}}/logs?accion=LOGIN&page=1&limit=20
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 6.3 Filtrar logs por usuario
\`\`\`
GET {{BASE_URL}}/logs?usuario_id=1&page=1&limit=20
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 6.4 Filtrar logs por rango de fechas
\`\`\`
GET {{BASE_URL}}/logs?fecha_desde=2025-09-01&fecha_hasta=2025-09-30
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 6.5 Logs de un usuario específico
\`\`\`
GET {{BASE_URL}}/logs/usuario/1?page=1&limit=20
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 6.6 Obtener lista de acciones
\`\`\`
GET {{BASE_URL}}/logs/acciones
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

### 6.7 Obtener tipos de recursos
\`\`\`
GET {{BASE_URL}}/logs/recursos-tipos
Authorization: Bearer {{ACCESS_TOKEN}}
\`\`\`

---

## 7️⃣ HEALTH CHECK

### 7.1 Verificar estado del servidor
\`\`\`
GET http://localhost:3000/health
\`\`\`

### 7.2 Información de la API
\`\`\`
GET http://localhost:3000/
\`\`\`

---

## 📌 Notas Importantes

1. **Reemplazar `{{ACCESS_TOKEN}}`** con el token obtenido del login
2. **Estados de causa válidos**: `abierta`, `cerrada`, `en_proceso`
3. **Criterios de búsqueda**: `todos`, `persona`, `legajo`, `ufi`, `protocolo`
4. **Archivos permitidos**: PDF, JPEG, PNG (máx 5MB)
5. **Rate limits**:
   - Login: 5 intentos / 15 min
   - General: 100 requests / 15 min
   - Upload: 5 archivos / minuto

---

## 🔐 Roles y Permisos

### Administrador (rol: `administrador`)
- ✅ Acceso completo a todas las funcionalidades
- ✅ Crear, editar, eliminar registros
- ✅ Gestionar usuarios
- ✅ Subir y eliminar archivos
- ✅ Ver logs de auditoría
- ✅ Exportar datos

### Usuario Consulta (rol: `usuario_consulta`)
- ✅ Buscar y ver registros
- ✅ Ver personas
- ✅ Descargar archivos
- ❌ No puede crear/editar/eliminar
- ❌ No puede gestionar usuarios
- ❌ No puede ver logs

---

## 💡 Tips

- Usa Postman o Thunder Client (extensión de VS Code)
- Guarda los tokens en variables de entorno
- Prueba primero con el usuario `admin`
- Crea usuarios de prueba para cada rol
- Verifica siempre la respuesta del servidor
