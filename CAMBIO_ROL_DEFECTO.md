# ✅ Cambio de Rol por Defecto - 14 Nov 2025

## 🎯 Cambio Realizado

**ANTES:** Los nuevos usuarios recibían rol "Usuario Estándar" (ID: 3)
**AHORA:** Los nuevos usuarios reciben rol "Administrador" (ID: 1) ⭐

---

## 📊 Configuración de Roles

| ID  | Rol               | Crear | Editar | Eliminar | Consultar | Por Defecto |
| --- | ----------------- | ----- | ------ | -------- | --------- | ----------- |
| 1   | **Administrador** | ✓     | ✓      | ✓        | ✓         | **✅ SÍ**   |
| 2   | Usuario Consulta  | ✗     | ✗      | ✗        | ✓         | No          |
| 3   | Usuario Estándar  | ✓     | ✓      | ✗        | ✓         | No          |

---

## 🔧 Archivo Modificado

**Backend:**

- `src/controllers/usuariosController.js`
  - Línea cambiada: `const rolIdFinal = rol_id || 1;`
  - Ahora asigna rol de Administrador por defecto

---

## ✅ Permisos de Nuevos Usuarios

Cuando un administrador crea un nuevo usuario (sin especificar rol):

✓ **Puede crear** secuestros/registros  
✓ **Puede editar** secuestros/registros  
✓ **Puede eliminar** secuestros/registros  
✓ **Puede consultar** toda la información  
✓ **Puede subir archivos**  
✓ **Acceso completo** al sistema

---

## 🚀 Aplicar Cambios

El servidor ya fue reiniciado con la nueva configuración.

Para verificar:

```bash
cd BACKEND
PGPASSWORD=30101995 psql -U resej_user -d resej_db -h localhost \
  -c "SELECT id, nombre, puede_crear, puede_editar, puede_eliminar
      FROM roles ORDER BY id;"
```

---

## 🧪 Probar

1. **Login como administrador existente**
2. **Ir a Gestión de Usuarios**
3. **Crear nuevo usuario** (sin seleccionar rol específico)
4. **Verificar:** El usuario tendrá rol "Administrador"
5. **Login con ese usuario:** Podrá hacer todo (crear, editar, eliminar)

---

## ⚠️ Nota de Seguridad

Ahora **todos los nuevos usuarios son administradores** por defecto.

Si deseas que algunos usuarios tengan permisos limitados:

- Al crear el usuario, selecciona manualmente:
  - **Usuario Consulta** (ID: 2) → Solo ver
  - **Usuario Estándar** (ID: 3) → Crear/Editar (sin eliminar)

---

## ✨ Estado Actual

- ✅ Servidor funcionando
- ✅ Nuevos usuarios = Administradores
- ✅ Pueden crear y subir secuestros
- ✅ Acceso completo al sistema

¡Todo listo! 🎉
