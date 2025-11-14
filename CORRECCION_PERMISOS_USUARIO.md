# 🔧 Corrección de Permisos de Usuario - 14 Nov 2025

## ❌ Problema Identificado

Los usuarios nuevos (como "rocioAdmin") no podían cargar secuestros aunque tenían rol de Administrador.

**Causa raíz:** El token JWT usaba `user.rol` (campo antiguo vacío) en lugar de `user.rol_nombre` (campo de la relación con tabla roles).

---

## ✅ Solución Aplicada

### Archivo corregido:

`BACKEND/src/services/authService.js`

**Cambio realizado:**

```javascript
// ANTES (incorrecto):
rol: user.rol,

// DESPUÉS (correcto):
rol: user.rol_nombre || user.rol || 'sin_rol',
```

Ahora el token JWT incluye correctamente el nombre del rol desde la tabla `roles`.

---

## 🚀 Pasos para que funcione

### Para usuarios EXISTENTES (como rocioAdmin):

1. **IMPORTANTE:** El usuario debe **cerrar sesión** completamente
2. **Volver a iniciar sesión**
3. Ahora el nuevo token JWT tendrá el rol correcto
4. Podrá acceder a todas las funciones de administrador

### ¿Por qué cerrar sesión?

El token JWT se genera al hacer login. Si el usuario ya tiene una sesión activa, está usando un token con el rol incorrecto. Al cerrar sesión y volver a entrar, se genera un nuevo token con el rol correcto.

---

## 🧪 Verificar que funciona

Después de que rocioAdmin cierre sesión y vuelva a entrar:

1. ✅ Podrá acceder a "Cargar Secuestro"
2. ✅ Podrá crear nuevos registros
3. ✅ Podrá editar registros existentes
4. ✅ Podrá eliminar registros
5. ✅ Podrá subir archivos

---

## 📊 Verificación Técnica

### Ver el rol del usuario en la base de datos:

```bash
PGPASSWORD=30101995 psql -U resej_user -d resej_db -h localhost -c "
  SELECT u.usuario, u.nombre, r.nombre as rol, r.puede_crear, r.puede_editar
  FROM usuarios u
  LEFT JOIN roles r ON u.rol_id = r.id
  WHERE u.usuario = 'rocioAdmin';
"
```

Debe mostrar:

- **rol:** administrador
- **puede_crear:** t (true)
- **puede_editar:** t (true)

---

## ⚠️ Nota Importante

Este problema solo afecta a usuarios que ya tenían sesión iniciada antes de la corrección.

**Usuarios nuevos** que se creen DESPUÉS de esta corrección funcionarán correctamente desde el primer login.

---

## ✨ Estado

- ✅ Código corregido
- ✅ Servidor reiniciado
- ⏳ Usuario debe cerrar sesión y volver a entrar

**Siguiente paso:** Decirle a rocio que cierre sesión y vuelva a entrar.
