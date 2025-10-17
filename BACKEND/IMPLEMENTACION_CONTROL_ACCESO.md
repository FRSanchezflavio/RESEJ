# 📋 Documentación: Implementación de Control de Acceso - Usuario Consulta

## 📖 Índice

1. [Descripción General](#descripción-general)
2. [Archivos Creados](#archivos-creados)
3. [Cómo Funciona](#cómo-funciona)
4. [Integración en tu Backend](#integración-en-tu-backend)
5. [Pruebas](#pruebas)
6. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Descripción General

Se ha implementado un **sistema completo de control de acceso** para usuarios con rol `usuario_consulta`, garantizando que:

✅ **Solo puedan leer** (GET)
✅ **No puedan crear** (POST) ❌
✅ **No puedan editar** (PUT/PATCH) ❌
✅ **No puedan eliminar** (DELETE) ❌
✅ **No puedan gestionar usuarios** ❌
✅ **No puedan acceder a auditoría** ❌

---

## Archivos Creados

### 1. **`src/config/promptSystemConsulta.js`**

- ✅ Prompt para Claude Sonnet 4.5 (10/10)
- ✅ Matriz de permisos por rol
- ✅ Mensajes pre-formateados
- ✅ Reglas de seguridad

### 2. **`src/middleware/permisosConsulta.js`**

- ✅ Middleware `validarPermiso(accion, tipo)`
- ✅ Middleware `bloquearConsulta`
- ✅ Middleware `soloLectura`
- ✅ Middleware `detectarIntentosAnomalo`

### 3. **`src/services/respuestaConsultaService.js`**

- ✅ Respuestas estandarizadas
- ✅ Métodos para cada tipo de operación
- ✅ Validación de permisos

### 4. **`src/config/rutasProtegidas.js`**

- ✅ Configuración de rutas
- ✅ Matriz de control de acceso
- ✅ Funciones auxiliares

---

## Cómo Funciona

### Flujo de Control de Acceso

```
Usuario realiza solicitud
    ↓
¿Está autenticado? (middleware auth)
    ├─ NO → Error 401
    └─ SÍ → Continuar
    ↓
¿Hay patrones sospechosos? (detectarIntentosAnomalo)
    ├─ SÍ → Error 400 + Log
    └─ NO → Continuar
    ↓
¿Es operación de lectura (GET)?
    ├─ SÍ → ✅ Permitir
    └─ NO → Continuar
    ↓
¿Tiene rol usuario_consulta?
    ├─ SÍ → ❌ Error 403 + Mensaje
    └─ NO (admin) → ✅ Permitir
    ↓
Respuesta con datos o error
```

### Middleware en Acción

```
RUTAS PERMITIDAS (usuario_consulta)
├─ GET /api/secuestros ✅
├─ GET /api/secuestros/:id ✅
├─ GET /api/personas ✅
├─ GET /api/objetos ✅
└─ GET /api/dependencias ✅

RUTAS BLOQUEADAS (usuario_consulta)
├─ POST /api/secuestros ❌
├─ PUT /api/secuestros/:id ❌
├─ DELETE /api/secuestros/:id ❌
├─ POST /api/usuarios ❌
├─ DELETE /api/usuarios/:id ❌
└─ GET /api/logs ❌
```

---

## Integración en tu Backend

### Paso 1: Importar Middlewares en `app.js`

```javascript
const { soloLectura, detectarIntentosAnomalo } = require('./middleware/permisosConsulta');

// Después de autenticación, agregar:
app.use(detectarIntentosAnomalo);
app.use(soloLectura);
```

### Paso 2: Integrar en Rutas Específicas

#### En `src/routes/secuestros.routes.js` o similar:

```javascript
const { soloLectura } = require('../middleware/permisosConsulta');
const { authenticateToken } = require('../middleware/auth');

// Rutas de lectura - Permitidas
router.get('/', authenticateToken, controlador.listar);
router.get('/:id', authenticateToken, controlador.obtener);

// Rutas de escritura - Bloqueadas para usuario_consulta
router.post('/', authenticateToken, soloLectura, controlador.crear);
router.put('/:id', authenticateToken, soloLectura, controlador.actualizar);
router.delete('/:id', authenticateToken, soloLectura, controlador.eliminar);
```

### Paso 3: Usar RespuestaConsultaService en Controladores

```javascript
const RespuestaConsultaService = require('../services/respuestaConsultaService');

class SecuestroController {
  static async listar(req, res) {
    try {
      const secuestros = await SecuestroService.listar();

      // Respuesta estandarizada
      return res.status(200).json(
        RespuestaConsultaService.respuestaBusquedaExitosa({
          registros: secuestros,
          total: secuestros.length,
          pagination: { page: 1, limit: 10 }
        })
      );
    } catch (error) {
      return res.status(500).json(
        RespuestaConsultaService.respuestaError(error.message)
      );
    }
  }

  static async crear(req, res) {
    try {
      // El middleware soloLectura ya bloquea esto, pero por seguridad:
      if (req.usuario.rol === 'usuario_consulta') {
        return res.status(403).json(
          RespuestaConsultaService.respuestaAccesoDenegadoCreacion('secuestro')
        );
      }
      // ... resto del código
    } catch (error) {
      return res.status(500).json(
        RespuestaConsultaService.respuestaError(error.message)
      );
    }
  }
}
```

---

## Pruebas

### Test 1: Usuario Consulta Leyendo (✅ Debe funcionar)

```bash
curl -X GET http://localhost:3000/api/secuestros \
  -H "Authorization: Bearer $TOKEN_USUARIO_CONSULTA"

# Respuesta esperada: 200 OK con datos
{
  "success": true,
  "data": [...],
  "message": "Se encontraron X registros",
  "timestamp": "2025-10-16T..."
}
```

### Test 2: Usuario Consulta Creando (❌ Debe fallar)

```bash
curl -X POST http://localhost:3000/api/secuestros \
  -H "Authorization: Bearer $TOKEN_USUARIO_CONSULTA" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"test"}'

# Respuesta esperada: 403 FORBIDDEN
{
  "success": false,
  "error": "⚠️ ACCESO DENEGADO - No Puedes Crear Registros...",
  "accion_bloqueada": "crear",
  "statusCode": 403
}
```

### Test 3: Usuario Consulta Editando (❌ Debe fallar)

```bash
curl -X PUT http://localhost:3000/api/secuestros/1 \
  -H "Authorization: Bearer $TOKEN_USUARIO_CONSULTA" \
  -H "Content-Type: application/json" \
  -d '{"estado":"cerrado"}'

# Respuesta esperada: 403 FORBIDDEN
{
  "success": false,
  "error": "⚠️ ACCESO DENEGADO - No Puedes Editar Registros...",
  "statusCode": 403
}
```

### Test 4: Usuario Consulta Eliminando (❌ Debe fallar)

```bash
curl -X DELETE http://localhost:3000/api/secuestros/1 \
  -H "Authorization: Bearer $TOKEN_USUARIO_CONSULTA"

# Respuesta esperada: 403 FORBIDDEN
{
  "success": false,
  "error": "⚠️ ACCESO DENEGADO - No Puedes Eliminar Registros...",
  "statusCode": 403
}
```

### Test 5: Admin Creando (✅ Debe funcionar)

```bash
curl -X POST http://localhost:3000/api/secuestros \
  -H "Authorization: Bearer $TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"test"}'

# Respuesta esperada: 201 CREATED
{
  "success": true,
  "data": {...},
  "message": "Registro creado exitosamente"
}
```

---

## Ejemplos de Uso

### Crear un Usuario Consulta en BD

```sql
INSERT INTO usuarios (usuario, password_hash, nombre, apellido, rol, activo)
VALUES (
  'consulta_usuario',
  '$2b$12$...hash...',
  'Usuario',
  'Consulta',
  'usuario_consulta',
  true
);
```

### Actualizar un Usuario a Consulta

```sql
UPDATE usuarios
SET rol = 'usuario_consulta'
WHERE id = 5;
```

### Respuesta Bienvenida para Usuario Consulta

```javascript
// En controller después de login
const respuestaBienvenida = RespuestaConsultaService.respuestaBienvenida(usuario);
return res.status(200).json(respuestaBienvenida);

// Respuesta:
{
  "success": true,
  "message": "Bienvenido, Juan Pérez",
  "usuario": {
    "id": "5",
    "nombre": "Juan Pérez",
    "rol": "usuario_consulta",
    "rol_nombre": "Usuario de Consulta"
  },
  "funcionalidades": {
    "disponibles": [
      "🔍 Búsqueda avanzada de registros",
      "👁️ Visualizar detalles completos",
      "📥 Descargar archivos adjuntos",
      "📊 Generar reportes"
    ]
  },
  "informacion": {
    "Tu rol": "Usuario de Consulta (Solo Lectura)",
    "Acceso a": "Búsqueda y visualización de datos",
    "Limitaciones": "No puedes crear, editar o eliminar registros"
  },
  "timestamp": "2025-10-16T..."
}
```

### Endpoint de Información de Permisos

```javascript
// GET /api/auth/mis-permisos
app.get('/api/auth/mis-permisos', authenticateToken, (req, res) => {
  const info = RespuestaConsultaService.respuestaInformativaPermisos();
  return res.status(200).json(info);
});

// Respuesta:
{
  "success": true,
  "rol": "usuario_consulta",
  "nombre_rol": "Usuario de Consulta",
  "permisos": {
    "permitidos": ["✅ Buscar registros", ...],
    "denegados": ["❌ Crear registros", ...]
  },
  "soporte": {
    "email": "soporte-ti@policia.tucuman.gob.ar",
    "horario": "Lunes a Viernes 8:00-17:00"
  }
}
```

---

## 🔒 Seguridad Implementada

✅ **Validación de token JWT** - Toda solicitud requiere token válido
✅ **Validación de rol** - Se verifica el rol en cada operación
✅ **Detección de patrones sospechosos** - Se bloquean intentos SQL injection, XSS, etc.
✅ **Logging completo** - Se registran todos los intentos fallidos
✅ **Mensajes informativos** - El usuario sabe por qué se bloqueó
✅ **Respuestas estandarizadas** - Formato consistente en toda la API

---

## 📊 Matriz de Control de Acceso Final

| Operación     | usuario_consulta | administrador |
| ------------- | ---------------- | ------------- |
| Listar datos  | ✅ GET           | ✅ GET        |
| Ver detalles  | ✅ GET           | ✅ GET        |
| Crear         | ❌               | ✅ POST       |
| Editar        | ❌               | ✅ PUT        |
| Eliminar      | ❌               | ✅ DELETE     |
| Usuarios      | ❌               | ✅            |
| Auditoría     | ❌               | ✅            |
| Configuración | ❌               | ✅            |

---

## 🎯 Próximos Pasos

1. ✅ **Implementado** - Sistema de control de acceso
2. ⏳ **Próximo** - Crear endpoint para cambiar contraseña (solo lectura)
3. ⏳ **Próximo** - Crear endpoint de mis permisos
4. ⏳ **Próximo** - Crear dashboard de usuario consulta
5. ⏳ **Próximo** - Implementar reportes de solo lectura

---

**Última actualización**: 16 de octubre de 2025
**Estado**: ✅ IMPLEMENTADO Y LISTO PARA USAR
