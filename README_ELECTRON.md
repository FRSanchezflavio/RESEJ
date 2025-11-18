# 📦 RE.SE.J - Distribución Electron

## ⚡ Inicio Rápido

### Para Empaquetar la Aplicación:

1. **Instalar dependencias**:
   ```bash
   .\instalar-electron.bat
   ```

2. **Empaquetar**:
   ```bash
   .\empaquetar-electron.bat
   ```

3. **Buscar el ejecutable** en `dist-electron/`

### Para Desarrollo:

1. **Terminal 1** - Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Terminal 2** - Electron:
   ```bash
   .\ejecutar-electron-dev.bat
   ```

## 📋 Archivos Importantes

- `instalar-electron.bat` - Instala todas las dependencias
- `empaquetar-electron.bat` - Crea el ejecutable final
- `ejecutar-electron-dev.bat` - Ejecuta en modo desarrollo
- `configurar-env.bat` - Configura variables de entorno
- `electron-main.js` - Proceso principal de Electron
- `GUIA_ELECTRON.md` - Guía detallada completa

## 🎯 Distribución Final

El script `empaquetar-electron.bat` generará:

1. **RESEJ-Setup-1.0.0.exe** - Instalador tradicional
   - Instala en `C:\Program Files`
   - Crea accesos directos
   - Permite desinstalar

2. **RESEJ-Portable-1.0.0.exe** - Versión portable
   - No requiere instalación
   - Ejecuta desde cualquier carpeta
   - Ideal para USB

## 🖥️ Instalación en Nueva Computadora

### 1. Instalar PostgreSQL

- Descargar de: https://www.postgresql.org/download/
- Anotar la contraseña del usuario `postgres`
- Puerto: 5432

### 2. Crear Base de Datos

Opción A - pgAdmin:
```sql
CREATE USER resej_user WITH PASSWORD 'tu_contraseña';
CREATE DATABASE resej_db OWNER resej_user;
GRANT ALL PRIVILEGES ON DATABASE resej_db TO resej_user;
```

Opción B - Scripts incluidos:
```bash
cd BACKEND
psql -U postgres -f 01_crear_usuario_y_bd.sql
```

### 3. Instalar la Aplicación

- Ejecutar `RESEJ-Setup-1.0.0.exe`
- Seguir el asistente de instalación

### 4. Configurar Variables de Entorno

**Ubicación del archivo**:
- Instalador: `C:\Users\TuUsuario\AppData\Local\Programs\RESEJ\resources\BACKEND\.env`
- Portable: `carpeta-donde-ejecutaste\resources\BACKEND\.env`

**Opción A** - Usar el script automático:
```bash
cd "C:\Users\TuUsuario\AppData\Local\Programs\RESEJ"
configurar-env.bat
```

**Opción B** - Manual:
1. Copiar `BACKEND\.env.example` a `BACKEND\.env`
2. Editar con Notepad++, VS Code o similar
3. Cambiar contraseña de DB y secretos JWT

### 5. Ejecutar Migraciones

```bash
cd "C:\Users\TuUsuario\AppData\Local\Programs\RESEJ\resources\BACKEND"
npx knex migrate:latest
```

### 6. Iniciar Aplicación

- Doble clic en el acceso directo del escritorio
- O buscar "RE.SE.J" en el menú inicio

## 🔧 Configuración Avanzada

### Variables de Entorno Importantes

```env
# Puerto del servidor (cambia si 3000 está ocupado)
PORT=3000

# Credenciales de PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resej_db
DB_USER=resej_user
DB_PASSWORD=tu_contraseña_aqui

# Secretos (CAMBIAR EN PRODUCCIÓN)
JWT_SECRET=clave_super_secreta_aqui
REFRESH_TOKEN_SECRET=otra_clave_diferente_aqui
```

### Cambiar el Puerto

Si el puerto 3000 está ocupado:

1. Editar `.env`: `PORT=3001`
2. Reiniciar la aplicación

## 🐛 Problemas Comunes

### "No se puede conectar a la base de datos"

**Solución**:
1. Verificar que PostgreSQL esté corriendo (Services → postgresql-x64-XX)
2. Confirmar credenciales en `.env`
3. Verificar que la base de datos exista en pgAdmin

### "Backend no inicia"

**Solución**:
1. Verificar que el archivo `.env` exista
2. Abrir DevTools (Ctrl+Shift+I) para ver errores
3. Verificar logs en `BACKEND\logs\`

### "Puerto ya en uso"

**Solución**:
- Cambiar `PORT` en `.env` a otro número (ej: 3001, 8080)
- O cerrar la aplicación que usa el puerto 3000

### Error al empaquetar

**Solución**:
1. Verificar que `frontend/dist/` exista con archivos
2. Ejecutar `npm run build:frontend` manualmente
3. Verificar espacio en disco

## 📊 Estructura de la Aplicación Empaquetada

```
RESEJ/
├── RESEJ.exe                      # Ejecutable principal
├── resources/
│   ├── app.asar                   # Código de la aplicación
│   ├── BACKEND/                   # Backend Node.js
│   │   ├── .env                   # Configuración (crear manualmente)
│   │   ├── .env.example          # Plantilla de configuración
│   │   ├── server.js
│   │   ├── src/
│   │   └── node_modules/
│   └── frontend/
│       └── dist/                  # Frontend compilado
└── ...otros archivos de Electron
```

## 🔐 Seguridad

**IMPORTANTE**:
- ✅ Cambiar `JWT_SECRET` y `REFRESH_TOKEN_SECRET`
- ✅ Usar contraseñas fuertes para PostgreSQL
- ✅ No compartir el archivo `.env`
- ✅ Mantener PostgreSQL actualizado
- ✅ Hacer backups regulares de la base de datos

## 📝 Notas Adicionales

### Actualizar la Aplicación

1. Cambiar versión en `package.json`
2. Reempaquetar: `.\empaquetar-electron.bat`
3. Distribuir nuevo instalador

### Logs de la Aplicación

- Backend: `BACKEND\logs\`
- Electron: Abrir DevTools (Ctrl+Shift+I)

### Backup de Base de Datos

```bash
# Backup
pg_dump -U resej_user -d resej_db > backup.sql

# Restaurar
psql -U resej_user -d resej_db < backup.sql
```

## 📞 Soporte

Consulta estos archivos para más ayuda:
- `GUIA_ELECTRON.md` - Guía completa de Electron
- `BACKEND/CONFIGURAR_BD.md` - Configuración de base de datos
- `BACKEND/INICIO_RAPIDO.md` - Inicio rápido del backend
- `SOLUCION_PROBLEMAS.md` - Problemas comunes

## 📄 Licencia

Sistema propietario - Policía de Tucumán
