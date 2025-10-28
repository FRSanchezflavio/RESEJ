# Frontend RE.SE.J

Aplicación React (Vite) para el Registro de Secuestros Judiciales. Consume la API Express del backend y expone los flujos de autenticación, consulta y compartición de registros.

## 🚀 Puesta en marcha

```bash
cd frontend
npm install
npm run dev
```

La URL base por defecto es `http://localhost:3000/api`. Ajusta el archivo `.env.local` si el backend corre en otra dirección:

```env
VITE_API_URL=http://localhost:4000/api
```

## 🔐 Roles soportados

- **administrador** – acceso completo (gestión de registros, usuarios y enlaces).
- **usuario_consulta** – puede consultar registros y crear/revocar enlaces compartidos.
- **usuario_temporal** – navegación restringida a la vista "Acceso compartido" para validar tokens recibidos.

## 🧭 Rutas principales

| Ruta | Descripción |
| ---- | ----------- |
| `/` | Redirige al dashboard, registro o acceso temporal según el rol autenticado. |
| `/dashboard` | Accesos rápidos para administración (solo roles completos). |
| `/registros` | Buscador de registros con opción de generar enlace compartido. |
| `/enlaces` | Gestión completa de enlaces compartidos (crear, listar, revocar). |
| `/acceso-temporal` | Formulario para usuarios provisionales con token y contraseña. |
| `/enlace/:token` | Vista pública sin autenticación para consumir un enlace compartido. |

## 🧪 Pruebas manuales sugeridas

1. Inicia backend (`npm run dev` en `BACKEND/`) y ejecuta migraciones.
2. En otra terminal, arranca el frontend con `npm run dev` y abre `http://localhost:5173`.
3. Inicia sesión como:
	- `administrador`: genera un enlace desde "Registros", copia la URL y credenciales. Revoca el enlace desde `/enlaces` y verifica que ya no esté disponible.
	- `usuario_consulta`: valida que solo tenga acceso a `/registros` y `/enlaces`.
	- `usuario_temporal`: ingresa a `/acceso-temporal`, prueba un token válido y uno expirado/revocado.
4. Abre la URL pública (`/enlace/:token`) en una ventana privada y confirma los estados: requiere contraseña, acceso concedido, acceso revocado.

Reporta cualquier comportamiento inesperado en `frontend/src/components/enlaces/SharedLinks.jsx` o `.../TemporalAccess.jsx`.
