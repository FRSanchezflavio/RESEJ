# 🔧 Solución de Problemas - RESEJ

## Error 404 en el navegador

### Síntoma
<<<<<<< HEAD
Al ejecutar `iniciar-app-completa.bat`, el navegador se abre pero muestra "This localhost page can't be found - HTTP ERROR 404"

### Causa
Vite (el servidor frontend) aún está compilando el código React. Necesita tiempo para procesar todos los archivos.

### Solución
=======

Al ejecutar `iniciar-app-completa.bat`, el navegador se abre pero muestra "This localhost page can't be found - HTTP ERROR 404"

### Causa

Vite (el servidor frontend) aún está compilando el código React. Necesita tiempo para procesar todos los archivos.

### Solución

>>>>>>> cd57601e476db50c4d478d69812fb000de7d8741
1. **NO cierres el navegador**
2. **Espera 10-15 segundos adicionales**
3. **Presiona F5** o el botón "Reload" en el navegador
4. La aplicación debería cargar correctamente

---

## El navegador no se abre automáticamente

### Solución
<<<<<<< HEAD
Abre manualmente tu navegador y ve a:
=======

Abre manualmente tu navegador y ve a:

>>>>>>> cd57601e476db50c4d478d69812fb000de7d8741
```
http://localhost:5173
```

---

## Error "No se encontró iniciar-backend.bat"

### Causa
<<<<<<< HEAD
Estás ejecutando el script desde la carpeta incorrecta

### Solución
Asegúrate de ejecutar `iniciar-app-completa.bat` desde la carpeta raíz del proyecto:
=======

Estás ejecutando el script desde la carpeta incorrecta

### Solución

Asegúrate de ejecutar `iniciar-app-completa.bat` desde la carpeta raíz del proyecto:

>>>>>>> cd57601e476db50c4d478d69812fb000de7d8741
```
C:\Users\Usuario\OneDrive\Desktop\RESEJ\
```

---

## Las ventanas de terminal se cierran inmediatamente

### Solución para Backend
<<<<<<< HEAD
=======

>>>>>>> cd57601e476db50c4d478d69812fb000de7d8741
1. Abre una terminal en la carpeta BACKEND
2. Ejecuta: `npm install`
3. Verifica que existe el archivo `.env` con la configuración de base de datos

### Solución para Frontend
<<<<<<< HEAD
=======

>>>>>>> cd57601e476db50c4d478d69812fb000de7d8741
1. Abre una terminal en la carpeta frontend
2. Ejecuta: `npm install`
3. Verifica que se creó la carpeta `node_modules`

---

## Puerto 5173 o 3000 ya en uso

### Síntoma
<<<<<<< HEAD
Error al iniciar: "Puerto ya en uso" o "EADDRINUSE"

### Solución
=======

Error al iniciar: "Puerto ya en uso" o "EADDRINUSE"

### Solución

>>>>>>> cd57601e476db50c4d478d69812fb000de7d8741
1. Cierra TODAS las ventanas de terminal abiertas
2. Abre el Administrador de Tareas (Ctrl+Shift+Esc)
3. Ve a la pestaña "Detalles"
4. Busca y finaliza todos los procesos `node.exe`
5. Intenta ejecutar `iniciar-app-completa.bat` nuevamente

---

## La aplicación carga pero no puedo ver Registros

### Causa
<<<<<<< HEAD
No has iniciado sesión o no tienes permisos

### Solución
=======

No has iniciado sesión o no tienes permisos

### Solución

>>>>>>> cd57601e476db50c4d478d69812fb000de7d8741
1. Asegúrate de ver la pantalla de LOGIN primero
2. Ingresa con tu usuario y contraseña
3. Una vez autenticado, usa el menú superior para ir a "Registros"

---

## ¿Cómo detengo la aplicación?

### Solución
<<<<<<< HEAD
Cierra las **DOS ventanas de terminal** que se abrieron:
=======

Cierra las **DOS ventanas de terminal** que se abrieron:

>>>>>>> cd57601e476db50c4d478d69812fb000de7d8741
- Una dice "RESEJ Backend"
- Otra dice "RESEJ Frontend"

Al cerrarlas, los servicios se detendrán automáticamente.

---

## El backend dice "Error de conexión a base de datos"

### Causa
<<<<<<< HEAD
PostgreSQL no está corriendo o la configuración en `.env` es incorrecta

### Solución
=======

PostgreSQL no está corriendo o la configuración en `.env` es incorrecta

### Solución

>>>>>>> cd57601e476db50c4d478d69812fb000de7d8741
1. Verifica que PostgreSQL esté instalado y corriendo
2. Abre `BACKEND\.env` y verifica:
   - DB_HOST (usualmente `localhost`)
   - DB_PORT (usualmente `5432`)
   - DB_USER (tu usuario de PostgreSQL)
   - DB_PASSWORD (tu contraseña de PostgreSQL)
   - DB_NAME (nombre de tu base de datos)

---

## ¿Necesitas ayuda adicional?

Ejecuta el script de diagnóstico:
<<<<<<< HEAD
=======

>>>>>>> cd57601e476db50c4d478d69812fb000de7d8741
```cmd
test-scripts.bat
```

Este verificará que todos los componentes estén instalados correctamente.
