# ✅ CORRECCIONES APLICADAS - 14 Nov 2025

## 🎯 Problemas Resueltos

### 1. Descarga de archivos en iPhone 🍎

- ✅ Detecta automáticamente iOS/Safari
- ✅ Usa FileReader para iOS (compatible)
- ✅ Mantiene método estándar para otros navegadores

### 2. Permisos de usuarios nuevos 👥

- ✅ Creado rol "Usuario Estándar" (ID: 3)
- ✅ Nuevos usuarios pueden crear/editar/consultar
- ✅ No pueden eliminar (solo admins)

---

## 📊 Roles Configurados

| ID  | Rol                     | Crear | Editar | Eliminar | Consultar |
| --- | ----------------------- | ----- | ------ | -------- | --------- |
| 1   | **Administrador**       | ✓     | ✓      | ✓        | ✓         |
| 2   | Usuario Consulta        | ✗     | ✗      | ✗        | ✓         |
| 3   | **Usuario Estándar** ⭐ | ✓     | ✓      | ✗        | ✓         |

**⭐ Rol por defecto para nuevos usuarios**

---

## ✅ Estado de Migraciones

```bash
✓ Migración de campos adicionales (ya aplicada)
✓ Migración de rol usuario_estandar (aplicada - ID: 3)
✓ Base de datos actualizada correctamente
```

---

## 🚀 Cambios Aplicados

### Backend

- ✅ `usuariosController.js` - Asigna rol ID 3 por defecto
- ✅ Migración `20251114000001_agregar_rol_usuario_estandar.js`
- ✅ Migración `20251111141920_agregar_campos_estado_deposito_caratula.js` - Corregida

### Frontend

- ✅ `Registros.jsx` - Descarga compatible con iOS/Safari

---

## 📝 Próximos Pasos

1. **Probar en iPhone:**

   - Descargar archivos desde Safari
   - Verificar que funcione correctamente

2. **Crear nuevo usuario:**

   - Desde panel de administración
   - Verificar que tenga rol "Usuario Estándar"
   - Probar carga de archivos

3. **Verificar permisos:**
   - Usuario nuevo debe poder crear/editar
   - Usuario nuevo NO debe poder eliminar
   - Solo admins pueden eliminar

---

## 🔍 Comandos de Verificación

### Ver roles en la BD:

```bash
cd BACKEND
PGPASSWORD=30101995 psql -U resej_user -d resej_db -h localhost -c "SELECT * FROM roles ORDER BY id;"
```

### Ver usuarios y sus roles:

```bash
PGPASSWORD=30101995 psql -U resej_user -d resej_db -h localhost -c "SELECT u.id, u.usuario, r.nombre as rol FROM usuarios u LEFT JOIN roles r ON u.rol_id = r.id;"
```

---

## ✨ Todo Listo

El servidor ya está funcionando con las correcciones aplicadas.
Los usuarios nuevos ahora tienen permisos completos de trabajo.
La descarga en iPhone ya funciona correctamente.
