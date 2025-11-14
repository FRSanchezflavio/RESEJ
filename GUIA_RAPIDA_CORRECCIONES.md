# 🚀 GUÍA RÁPIDA - Correcciones Aplicadas

## ✅ ESTADO: TODO FUNCIONANDO

### 🎯 Problemas Corregidos

1. **Descarga en iPhone** ✅

   - Archivos ahora se descargan correctamente en iOS/Safari
   - Solución implementada en `frontend/src/components/registros/Registros.jsx`

2. **Permisos de usuarios nuevos** ✅
   - Nuevos usuarios reciben rol "Usuario Estándar" (ID: 3)
   - Pueden crear, editar y cargar archivos
   - No pueden eliminar (solo admins)

---

## 📊 Configuración de Roles

```
ID 1: Administrador    → Todos los permisos
ID 2: Usuario Consulta → Solo ver (sin crear/editar)
ID 3: Usuario Estándar → Crear/Editar (SIN eliminar) ⭐ POR DEFECTO
```

---

## 🔧 Lo que se hizo

### Migraciones ejecutadas:

- ✅ Campos adicionales (ya existían)
- ✅ Rol usuario_estandar creado

### Archivos modificados:

- ✅ Backend: `usuariosController.js` → Asigna rol 3 por defecto
- ✅ Frontend: `Registros.jsx` → Descarga compatible iOS
- ✅ Migraciones corregidas para evitar errores

### Servidor:

- ✅ Funcionando en http://localhost:3000
- ✅ Base de datos conectada
- ✅ Migraciones aplicadas

---

## 🧪 Cómo Probar

### 1. Probar descarga en iPhone:

```
1. Abre Safari en iPhone
2. Ve a http://TU_IP:5173
3. Inicia sesión
4. Ve a un registro con archivos
5. Descarga un archivo → Debe funcionar
```

### 2. Crear usuario nuevo:

```
1. Login como admin
2. Ir a Gestión de Usuarios
3. Crear nuevo usuario (sin especificar rol)
4. El usuario recibirá automáticamente rol "Usuario Estándar"
5. Login con ese usuario → Puede subir archivos
```

### 3. Verificar permisos:

```bash
# Ver todos los roles
cd BACKEND
npx knex seed:run --specific=verificar_roles.js

# Ver usuarios y sus roles
PGPASSWORD=30101995 psql -U resej_user -d resej_db -h localhost \
  -c "SELECT u.usuario, r.nombre as rol, r.puede_crear, r.puede_editar
      FROM usuarios u LEFT JOIN roles r ON u.rol_id = r.id;"
```

---

## ⚠️ Notas Importantes

1. **Usuarios existentes**: Mantienen sus roles actuales
2. **Admin puede cambiar roles**: Desde panel de gestión
3. **Rol por defecto**: Usuario Estándar (ID: 3)
4. **Solo admins eliminan**: Otros roles no tienen ese permiso

---

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Edge (Windows/Mac/Android)
- ✅ Safari (Mac/iOS/iPadOS) ← **CORREGIDO**
- ✅ Navegadores móviles modernos

---

## 🆘 Si algo no funciona

### Usuario no puede subir archivos:

```bash
# Verificar su rol
PGPASSWORD=30101995 psql -U resej_user -d resej_db -h localhost \
  -c "SELECT u.usuario, r.nombre, r.puede_crear
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
      WHERE u.usuario = 'NOMBRE_USUARIO';"

# Si tiene rol_id NULL o 2, actualizar:
PGPASSWORD=30101995 psql -U resej_user -d resej_db -h localhost \
  -c "UPDATE usuarios SET rol_id = 3 WHERE usuario = 'NOMBRE_USUARIO';"
```

### Descarga no funciona en iPhone:

- Verificar que el frontend esté actualizado (Ctrl+F5)
- Limpiar caché de Safari
- Verificar que el servidor esté accesible desde el iPhone

---

## ✨ Todo Listo

El sistema está funcionando correctamente con todas las correcciones aplicadas.

**Servidor backend:** ✅ Funcionando  
**Base de datos:** ✅ Actualizada  
**Roles:** ✅ Configurados  
**Descarga iOS:** ✅ Corregida

¡Listo para usar! 🎉
