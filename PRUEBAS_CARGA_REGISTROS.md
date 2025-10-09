# Guía de Pruebas - Formulario de Carga de Registros

## ✅ Cambios Implementados

### Simplificación del Formulario

- **Eliminado**: Modal de creación de personas, selector complejo, gestión de personas
- **Agregado**: Campo simple `persona_id` (input numérico)
- **Reducción**: De 540 líneas a 299 líneas (~45% menos código)

## 🧪 Cómo Probar

### 1. Base de Datos

Ya existe una persona de prueba en la base:

- ID: `1`
- Nombre: Juan Pérez
- DNI: 12345678

### 2. Levantar Servicios

```bash
# Terminal 1 - Backend
cd BACKEND
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 3. Acceder a la Aplicación

1. Abrir: `http://localhost:5173`
2. Login con:
   - Usuario: `admin`
   - Contraseña: `Admin2025!`

### 4. Probar Carga de Registro

1. Navegar a "Registros" o "Cargar Registro"
2. Completar el formulario:
   - **ID de Persona**: `1` (obligatorio)
   - **Fecha de ingreso**: Seleccionar una fecha (obligatorio)
   - **Sección que interviene**: Seleccionar opción (obligatorio)
   - **Detalle del secuestro**: Escribir descripción (obligatorio)
   - Resto de campos opcionales
3. Pulsar **GUARDAR**
4. Verificar mensaje de éxito: "✅ Registro cargado correctamente"

### 5. Probar Validación de Errores

#### Error: persona_id vacío

- Dejar campo vacío → "Debes ingresar un ID de persona válido"

#### Error: persona_id inválido

- Ingresar `abc` o `0` → "Debes ingresar un ID de persona válido"

#### Error: persona no existe

- Ingresar `999` → "❌ Error al subir: La persona especificada no existe"

## 📊 Quality Gates

- ✅ Backend: `npm test` (2 tests passed)
- ✅ Frontend: `npm run build` (build exitoso)
- ✅ Persona de prueba creada en BD (ID=1)

## 🔧 Archivos Modificados

1. `frontend/src/components/registros/UploadForm.jsx` - Simplificado
2. `BACKEND/test-upload-registro.sh` - Script de prueba (opcional)

## 💡 Notas Importantes

- El campo `persona_id` debe ser un número entero positivo
- La persona debe existir en la tabla `personas_registradas`
- Para crear más personas, usar el endpoint `/api/personas` con admin
- El formulario resetea todos los campos tras guardar exitosamente
- Los archivos adjuntos son opcionales

## 🚀 Próximos Pasos Sugeridos

Si necesitas crear más personas de prueba:

```sql
-- Conectar a la base
psql -U postgres -d resej_db

-- Crear personas adicionales
INSERT INTO personas_registradas (nombre, apellido, dni) VALUES
  ('María', 'González', '87654321'),
  ('Carlos', 'López', '11223344');
```

Luego podrás usar IDs 2 y 3 en el formulario.
