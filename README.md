# RESEJ

## Inicio rápido sin comandos npm

Puedes arrancar ambos servicios con un doble clic gracias a los scripts `.bat` ubicados en la raíz del proyecto.

### Backend

1. Instala dependencias una sola vez dentro de `BACKEND` ejecutando `npm install`.
2. Lanza `iniciar-backend.bat` para iniciar `node server.js` sin usar `npm start`. El script valida la presencia de `server.js` y muestra los errores en la misma ventana.

### Frontend

1. Instala dependencias dentro de `frontend` con `npm install`.
2. Lanza `iniciar-frontend.bat`; internamente invoca `vite --host 0.0.0.0 --port 5173`, por lo que la app quedará disponible en `http://localhost:5173`.

### Todo en uno

Si quieres abrir backend y frontend al mismo tiempo, usa `iniciar-app-completa.bat`. Este script:

1. Abre dos ventanas de terminal (backend con Node.js y frontend con Vite)
2. Espera 20 segundos con contador visible para que Vite compile la aplicación
3. Abre automáticamente tu navegador en `http://localhost:5173`

**El contador de 20 segundos es necesario** porque Vite necesita compilar todo el código React antes de servir la aplicación. NO cierres la ventana durante la espera.

Si al abrir el navegador aún ves error 404, espera 5-10 segundos más y presiona F5.

Cierra las dos ventanas de terminal que se abrieron para detener los servicios.

### Crear accesos directos (opcional)

1. En el escritorio haz clic derecho → `Nuevo > Acceso directo` y apunta al `.bat` que quieras (por ejemplo, `iniciar-app-completa.bat`).
2. Elige un nombre descriptivo (por ejemplo, “RESEJ Backend” o “RESEJ Frontend”).
3. En `Propiedades > Cambiar icono…` selecciona un `.ico` propio si quieres un aspecto personalizado. También puedes configurar “Ejecutar: Minimizada” para que la terminal no moleste.

Con esto puedes iniciar backend y frontend sin abrir manualmente una terminal ni ejecutar `npm start` o `npm run dev`.
