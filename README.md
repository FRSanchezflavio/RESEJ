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

Si quieres abrir backend y frontend al mismo tiempo, usa `iniciar-app-completa.bat`. Este script verifica que existan los otros dos `.bat`, abre dos ventanas nuevas (una para `node server.js` y otra para Vite) y espera de forma inteligente a que el frontend responda (sondea `http://localhost:5173/` hasta por ~1 min). En cuanto detecta que Vite está listo, abre automáticamente `http://localhost:5173` en tu navegador predeterminado para que inicies sesión y navegues a Registros. Cierra cualquiera de las ventanas para detener el servicio correspondiente.

### Crear accesos directos (opcional)

1. En el escritorio haz clic derecho → `Nuevo > Acceso directo` y apunta al `.bat` que quieras (por ejemplo, `iniciar-app-completa.bat`).
2. Elige un nombre descriptivo (por ejemplo, “RESEJ Backend” o “RESEJ Frontend”).
3. En `Propiedades > Cambiar icono…` selecciona un `.ico` propio si quieres un aspecto personalizado. También puedes configurar “Ejecutar: Minimizada” para que la terminal no moleste.

Con esto puedes iniciar backend y frontend sin abrir manualmente una terminal ni ejecutar `npm start` o `npm run dev`.
