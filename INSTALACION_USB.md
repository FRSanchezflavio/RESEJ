# Guía de Instalación Ultra Detallada (USB) – RESEJ

Esta guía describe paso a paso cómo desplegar la aplicación **RESEJ** en una máquina **Windows 10/11 x64** usando el **instalador empaquetado Electron** (`RESEJ-Setup-1.0.0.exe`) copiado en una memoria USB junto con todos los prerrequisitos (PostgreSQL, Node.js para mantenimiento, scripts SQL, plantilla `.env`, documentación). Se **mantienen las DevTools habilitadas** para soporte.

---

## 1. Resumen Ejecutivo

Objetivos:

- Instalación reproducible sin Internet.
- Configuración segura inicial (DB, usuario admin, secretos JWT).
- Verificación funcional y checklist de seguridad.
- Procedimientos de operación, mantenimiento y actualización.

---

## 2. Estructura Recomendada de la Memoria USB

Ejemplo (unidad `E:`):

```
E:\
  RESEJ/
    instalador/
      RESEJ-Setup-1.0.0.exe
      RESEJ-Portable-1.0.0.exe (si generado)
    prerequisitos/
      node-vXX.X.X-x64.msi
      postgresql-XX.X-windows-x64.exe
      vcredist_x64.exe (opcional)
    sql/
      01_crear_usuario_y_bd.sql
      01b_crear_base_datos.sql
      01c_dar_permisos.sql
      02_configurar_permisos.sql
      setup_database.sql
    plantillas/
      .env.plantilla.txt
    documentacion/
      SEGURIDAD_CHECKLIST.md
      CONFIGURACION_EMAIL.md
      VERIFICACION_SISTEMA.md
      INSTALACION_USB_RESEJ.md (este archivo si lo renombraras)
    herramientas/
      scripts_batch_adicionales.txt (opcional)
    respaldo/ (vacío inicial)
  LEEME-PRIMEROS-PASOS.txt
```

Acciones previas:

- Verificar integridad (opcional): `CertUtil -hashfile RESEJ-Setup-1.0.0.exe SHA256`.
- Completar comentarios en `.env.plantilla.txt`.

---

## 3. Requisitos Previos Máquina Destino

Hardware recomendado: CPU x64 ≥2 núcleos, RAM 8 GB (mínimo 4 GB), 5 GB libres (crecimiento DB + backups).
Software:

- Windows 10/11 64-bit (usuario con permisos administrativos).
- Puertos: 5432 (PostgreSQL), 3000 (API interna). Frontend empaquetado no expone puerto público.
- Antivirus configurado para no bloquear carpeta instalación.
  Permisos: Administrador para instalar PostgreSQL y editar `.env`.
  Internet: No requerido salvo uso de email SMTP.

---

## 4. Instalación de PostgreSQL desde USB

1. Ejecutar instalador: `postgresql-XX.X-windows-x64.exe`.
2. Ruta sugerida: `C:\PostgreSQL\`.
3. Definir contraseña segura para usuario `postgres`.
4. Componentes: Servidor + (opcional) pgAdmin.
5. Puerto: 5432 (cambiar si ocupado).
6. Codificación: UTF8.
7. Locale: `Spanish_Spain.1252` (unificar con scripts).
8. Finalizar e iniciar servicio.
   Verificación:

```
psql -U postgres -c "SELECT version();"
```

---

## 5. Creación de Usuario y Base de Datos

Elegir **una** opción:

### Opción A (Secuencial)

Orden:

1. `01_crear_usuario_y_bd.sql`
2. `01b_crear_base_datos.sql`
3. `01c_dar_permisos.sql`
4. `02_configurar_permisos.sql`
   Ejecución:

```
psql -U postgres -f E:\RESEJ\sql\01_crear_usuario_y_bd.sql
psql -U postgres -f E:\RESEJ\sql\01b_crear_base_datos.sql
psql -U postgres -f E:\RESEJ\sql\01c_dar_permisos.sql
psql -U postgres -f E:\RESEJ\sql\02_configurar_permisos.sql
```

### Opción B (Integrada)

```
psql -U postgres -f E:\RESEJ\sql\setup_database.sql
```

Verificación:

```
psql -U postgres -c "\du"
psql -U postgres -c "\l"
psql -U resej_user -d resej_db -c "SELECT CURRENT_USER, CURRENT_DATABASE();"
```

---

## 6. Creación del Archivo `.env`

Ubicación tras instalación (estándar NSIS):
`%LOCALAPPDATA%\Programs\RESEJ\resources\app\BACKEND\`
Plantilla (usar `EMAIL_PASSWORD`):

```
NODE_ENV=production
PORT=3000
APP_NAME=RESEJ
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resej_db
DB_USER=resej_user
DB_PASSWORD=CAMBIAR_ESTA_CONTRASEÑA
JWT_SECRET=REEMPLAZAR_CON_SECRETO_UNICO
JWT_REFRESH_SECRET=REEMPLAZAR_CON_SECRETO_UNICO
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
CORS_ORIGIN=*
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=tu_correo@gmail.com
EMAIL_PASSWORD=CONTRASENA_APP_GMAIL
EMAIL_FROM="RESEJ <tu_correo@gmail.com>"
FRONTEND_URL=http://localhost
LOG_LEVEL=info
UPLOAD_DIR=uploads
APP_LOCALE=es_ES
```

Generar secretos seguros:

```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Repetir para cada secreto JWT. Restringir ACL NTFS del archivo (`solo Administradores`).

---

## 7. Instalación del Programa RESEJ

1. Navegar: `E:\RESEJ\instalador\`.
2. Ejecutar: `RESEJ-Setup-1.0.0.exe`.
3. Completar asistente (ruta por defecto o personalizada).
4. NO abrir aún la app; crear primero `.env` y ejecutar migraciones.
   Ubicación esperada: `%LOCALAPPDATA%\Programs\RESEJ\`.

---

## 8. Migraciones y Seeds

Instalar Node (si no disponible) desde `prerequisitos/`.

```
cd "%LOCALAPPDATA%\Programs\RESEJ\resources\app\BACKEND"
npx knex migrate:latest
npx knex seed:run
```

Verificación:

```
psql -U resej_user -d resej_db -c "\dt"
```

Si `npx` falla, usar copia fuente para ejecutar migraciones y apuntar a misma DB.

---

## 9. Primer Arranque y Verificación

1. Confirmar `.env` presente.
2. Abrir RESEJ (acceso directo). DevTools deben abrirse.
3. Revisar consola por errores.
4. Comprobar salud API (solo si expuesta):

```
curl http://localhost:3000/health
```

5. (Opcional) Ejecutar scripts de verificación copiados desde USB: `verificar-sistema.js`, `detect-ip.js`.

---

## 10. Endurecimiento Inicial

- Cambiar contraseña admin (seed inicial) inmediatamente.
- Restringir `CORS_ORIGIN` (ej. a `http://localhost`).
- Ajustar `RATE_LIMIT_MAX` (ej. 60) según escenario.
- Crear backup inicial:

```
pg_dump -U postgres resej_db > C:\RESEJ_BACKUPS\resej_db_inicial.sql
```

- Revisar `SEGURIDAD_CHECKLIST.md` punto por punto.
- Validar permisos archivo `.env`.

---

## 11. Operación Diaria

Inicio: abrir aplicación RESEJ.
Detener: cerrar ventana (Electron detiene backend). Si puerto 3000 permanece, localizar PID y terminar:

```
netstat -ano | findstr :3000
taskkill /F /PID <PID>
```

Backups programados (PowerShell tarea):

```
pg_dump -U postgres resej_db > C:\RESEJ_BACKUPS\resej_db_%DATE:~10,4%-%DATE:~4,2%-%DATE:~7,2%.sql
```

Rotación de secretos: editar `.env`, reiniciar app.

---

## 12. Modo Offline

- Funciona sin Internet (Electron + PostgreSQL local).
- Email SMTP pendiente/fallará → registrar en log.
- Actualización de versión requiere nuevo instalador en USB.
- Acceso LAN posible si API expone puerto de manera controlada.

---

## 13. Troubleshooting

| Problema                   | Acción                                                   |
| -------------------------- | -------------------------------------------------------- |
| Instalador falla           | Ver permisos admin y espacio libre                       |
| App no abre                | Revisar antivirus, ruta instalación, reinstalar          |
| DevTools ausentes          | Verificar `electron-main.js` (openDevTools)              |
| Error DB conexión          | Revisar `DB_HOST/USER/PASSWORD`, servicio activo         |
| Puerto 5432 ocupado        | Cambiar puerto PostgreSQL y `DB_PORT` en `.env`          |
| Migraciones fallan         | Instalar Node global, confirmar ruta BACKEND             |
| Usuario admin ausente      | Reejecutar `npx knex seed:run` o inserción manual        |
| Email error                | Verificar `EMAIL_HOST/PORT/USER/PASSWORD` (app password) |
| Alto CPU                   | Cerrar DevTools, reiniciar app                           |
| Antivirus elimina archivos | Añadir exclusión carpeta RESEJ                           |

---

## 14. Actualizaciones de Versión

1. Backup previo:

```
pg_dump -U postgres resej_db > C:\RESEJ_BACKUPS\resej_db_pre_update.sql
```

2. Cerrar app.
3. Ejecutar nuevo instalador.
4. Aplicar migraciones nuevas:

```
npx knex migrate:latest
```

5. Verificar tablas y datos.
6. (Opcional) Rotar secretos si cambio mayor.

---

## 15. Seguridad Ampliada

- Firewall: cerrar acceso remoto a 5432 si no se usa.
- Reducir permisos PostgreSQL (evitar ALL si no necesario).
- Rotación contraseñas admin cada 90 días.
- Política de longitud mínima y complejidad (backend / validaciones futuras).
- Revisión de logs semanal.
- Plan futuro para deshabilitar DevTools en entorno final de usuarios.

---

## 16. Checklist Final

```
[ ] PostgreSQL instalado
[ ] Usuario y DB creados
[ ] Archivo .env con secretos personalizados
[ ] Instalador ejecutado sin errores
[ ] Migraciones completadas
[ ] Seeds aplicados (admin creado)
[ ] Contraseña admin cambiada
[ ] Backup inicial realizado
[ ] CORS ajustado (si aplica)
[ ] Email configurado o documentado
[ ] Logs revisados
[ ] Seguridad checklist completada
```

---

## 17. Comandos Resumen

Instalación DB (sec):

```
psql -U postgres -f E:\RESEJ\sql\01_crear_usuario_y_bd.sql
psql -U postgres -f E:\RESEJ\sql\01b_crear_base_datos.sql
psql -U postgres -f E:\RESEJ\sql\01c_dar_permisos.sql
psql -U postgres -f E:\RESEJ\sql\02_configurar_permisos.sql
```

Migraciones / Seeds:

```
cd "%LOCALAPPDATA%\Programs\RESEJ\resources\app\BACKEND"
npx knex migrate:latest
npx knex seed:run
```

Salud:

```
curl http://localhost:3000/health
```

Dump respaldo:

```
pg_dump -U postgres resej_db > C:\RESEJ_BACKUPS\resej_db_inicial.sql
```

Secretos:

```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 18. Notas Finales

- Mantener DevTools facilita soporte pero expone internals: restringir acceso físico.
- Estudiar eliminación de DevTools para distribución masiva.
- Documentar cambios manuales en `.env` (fecha, responsable, motivo).

---

### Próximos Pasos Opcionales

- Crear script batch para ejecutar migraciones automáticamente.
- Añadir guía PDF generada del Markdown.
- Implementar rotación automática de backups con compresión.

---

**Fin de la Guía**
