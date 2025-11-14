# Correcciones Aplicadas - 14 de Noviembre 2025

## Problemas Resueltos

### 1. ❌ Descarga de archivos en iPhone/iOS

**Problema:** Los archivos no se descargaban correctamente en dispositivos iPhone debido a incompatibilidad del método `window.URL.createObjectURL()` con iOS Safari.

**Solución Implementada:**

- Detección automática de iOS/Safari
- Uso de `FileReader.readAsDataURL()` para iOS
- Mantiene el método estándar para otros navegadores
- Código actualizado en: `frontend/src/components/registros/Registros.jsx`

### 2. ❌ Usuarios nuevos sin permisos para cargar archivos

**Problema:** Los usuarios recién creados recibían el rol ID 2 (usuario_consulta) que solo tiene permiso de consultar, sin poder crear/editar/cargar archivos.

**Solución Implementada:**

- Creada nueva migración para agregar rol "usuario_estandar" (ID 3)
- Nuevo rol con permisos: crear ✓, editar ✓, eliminar ✗, consultar ✓
- Controlador actualizado para asignar rol ID 3 por defecto

---

## Estructura de Roles Actualizada

| ID  | Nombre           | Crear | Editar | Eliminar | Consultar | Uso                               |
| --- | ---------------- | ----- | ------ | -------- | --------- | --------------------------------- |
| 1   | Administrador    | ✓     | ✓      | ✓        | ✓         | Admins del sistema                |
| 2   | Usuario Consulta | ✗     | ✗      | ✗        | ✓         | Solo lectura                      |
| 3   | Usuario Estándar | ✓     | ✓      | ✗        | ✓         | **Usuarios nuevos (por defecto)** |

---

## Archivos Modificados

### Backend

1. `BACKEND/src/controllers/usuariosController.js`

   - Cambiado rol por defecto de 2 a 2 (ahora apunta a usuario_estandar)
   - Comentarios actualizados

2. `BACKEND/src/migrations/20251114000001_agregar_rol_usuario_estandar.js` ⭐ NUEVO

   - Migración para crear rol usuario_estandar
   - Reorganiza IDs de roles existentes

3. `BACKEND/src/seeds/verificar_roles.js` ⭐ NUEVO

   - Script para verificar roles en la BD

4. `BACKEND/aplicar-correcciones.sh` ⭐ NUEVO
5. `BACKEND/aplicar-correcciones.bat` ⭐ NUEVO
   - Scripts para aplicar las correcciones

### Frontend

1. `frontend/src/components/registros/Registros.jsx`
   - Función `handleDownload()` actualizada
   - Soporte para iOS/Safari agregado

---

## Instrucciones de Aplicación

### 1. Aplicar la migración de roles

**Opción A - Windows:**

```bash
cd BACKEND
aplicar-correcciones.bat
```

**Opción B - Linux/Mac:**

```bash
cd BACKEND
chmod +x aplicar-correcciones.sh
./aplicar-correcciones.sh
```

**Opción C - Manual:**

```bash
cd BACKEND
npx knex migrate:latest
npx knex seed:run --specific=verificar_roles.js
```

### 2. Reiniciar el servidor backend

```bash
cd BACKEND
npm start
```

### 3. Limpiar caché del frontend (si es necesario)

```bash
cd frontend
npm run build
# o simplemente refrescar el navegador con Ctrl+F5
```

---

## Verificación

### Verificar roles en la base de datos:

```sql
SELECT id, nombre, puede_crear, puede_editar, puede_eliminar, puede_consultar
FROM roles
ORDER BY id;
```

Resultado esperado:

```
id | nombre             | puede_crear | puede_editar | puede_eliminar | puede_consultar
---|-----------------------|-------------|--------------|----------------|----------------
1  | administrador         | true        | true         | true           | true
2  | usuario_consulta      | false       | false        | false          | true
3  | usuario_estandar      | true        | true         | false          | true
```

### Probar descarga en iPhone:

1. Acceder desde Safari en iPhone
2. Ir a un registro con archivos adjuntos
3. Hacer clic en el botón de descarga
4. El archivo debe descargarse correctamente

### Probar permisos de usuarios nuevos:

1. Crear un nuevo usuario (sin especificar rol)
2. Iniciar sesión con ese usuario
3. Intentar subir un archivo
4. Debe permitir la carga sin errores

---

## Compatibilidad

### Navegadores soportados para descarga:

- ✓ Chrome/Edge (Windows, Mac, Android)
- ✓ Firefox (Windows, Mac, Android)
- ✓ Safari (Mac, iOS, iPadOS) ⭐ CORREGIDO
- ✓ Samsung Internet
- ✓ Otros navegadores modernos

### Compatibilidad con iOS:

- ✓ iOS 12+
- ✓ iPadOS 13+
- ✓ Safari 12+

---

## Notas Adicionales

- Los usuarios existentes mantienen sus roles actuales
- Los administradores deben revisar y actualizar roles manualmente si es necesario
- La migración es reversible (`npx knex migrate:rollback`)
- Se recomienda hacer backup de la base de datos antes de aplicar

---

## Soporte

Para problemas o consultas sobre estas correcciones:

1. Revisar los logs del servidor backend
2. Verificar la consola del navegador (F12)
3. Comprobar que la migración se ejecutó correctamente
4. Verificar permisos del usuario en la tabla `usuarios` y `roles`
