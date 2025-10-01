# 🧪 Comandos de Prueba del Backend

## ✅ El servidor está funcionando correctamente

Los mensajes que viste son de **éxito**, no errores:

```
✓ Conexión a la base de datos establecida correctamente
🚀 Servidor RE.SE.J iniciado correctamente
📍 URL: http://0.0.0.0:4000
🌍 Entorno: development
```

---

## 🚀 Cómo Probar los Endpoints

### Opción 1: Usando curl (Línea de Comandos)

**Asegúrate de que el servidor esté corriendo** (`npm run dev` en una terminal).

Luego, en **otra terminal nueva**, ejecuta:

#### 1. Health Check

```bash
curl http://localhost:4000/health
```

**Respuesta esperada:**

```json
{
  "status": "ok",
  "timestamp": "2025-09-30T...",
  "database": "connected"
}
```

#### 2. Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","password":"Admin2025!"}'
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": 1,
      "usuario": "admin",
      "rol": "administrador",
      ...
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login exitoso"
}
```

#### 3. Obtener Perfil (requiere token)

Primero, copia el `accessToken` del login anterior, luego:

```bash
curl -X GET http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

### Opción 2: Usando el Script de Prueba

He creado un script que prueba automáticamente todos los endpoints:

```bash
chmod +x test-api.sh
./test-api.sh
```

Este script:

- ✅ Prueba el health check
- ✅ Hace login con admin
- ✅ Obtiene el token
- ✅ Prueba un endpoint protegido
- ✅ Muestra resultados en colores

---

### Opción 3: Usando Postman o Thunder Client

#### Thunder Client (en VS Code):

1. Instala la extensión **Thunder Client** en VS Code
2. Abre Thunder Client (ícono de rayo ⚡ en la barra lateral)
3. Crea una nueva request:

**Health Check:**

```
GET http://localhost:4000/health
```

**Login:**

```
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "usuario": "admin",
  "password": "Admin2025!"
}
```

**Perfil de Usuario:**

```
GET http://localhost:4000/api/auth/me
Authorization: Bearer [TOKEN_DEL_LOGIN]
```

---

### Opción 4: Usando el Navegador

Solo para endpoints GET como el health check:

Abre en tu navegador:

```
http://localhost:4000/health
```

---

## 📊 Endpoints Disponibles para Probar

### Sin Autenticación (Públicos)

| Método | Endpoint          | Descripción         |
| ------ | ----------------- | ------------------- |
| GET    | `/health`         | Estado del servidor |
| POST   | `/api/auth/login` | Login de usuario    |

### Con Autenticación (Requieren Token)

| Método | Endpoint            | Descripción                    |
| ------ | ------------------- | ------------------------------ |
| GET    | `/api/auth/me`      | Perfil del usuario actual      |
| POST   | `/api/auth/refresh` | Renovar token                  |
| POST   | `/api/auth/logout`  | Cerrar sesión                  |
| GET    | `/api/usuarios`     | Listar usuarios (admin)        |
| GET    | `/api/personas`     | Listar personas registradas    |
| GET    | `/api/registros`    | Listar registros de secuestros |
| POST   | `/api/registros`    | Crear nuevo registro (admin)   |

Consulta `API_EXAMPLES.md` para ver **70+ ejemplos** de todos los endpoints.

---

## 🐛 Solución de Problemas

### Error: "Failed to connect to localhost port 4000"

El servidor no está corriendo. Ejecuta:

```bash
npm run dev
```

### Error: "curl: command not found" (Windows)

Usa PowerShell en lugar de Git Bash, o instala curl para Windows.

En PowerShell:

```powershell
Invoke-RestMethod http://localhost:4000/health
```

### Error: HTTP 401 "Token no proporcionado"

Falta el token de autenticación. Primero haz login y usa el `accessToken` recibido.

---

## ✅ Resumen

**Tu backend está funcionando perfectamente.** Solo necesitas:

1. **Mantener corriendo** `npm run dev` en una terminal
2. **Abrir otra terminal** para hacer las pruebas con curl
3. O usar **Thunder Client** / **Postman** para una experiencia más visual

¿Quieres que te ayude a configurar Thunder Client en VS Code? 🚀
