# RE.SE.J - Script de Configuración Post-Instalación

Este script debe ejecutarse DESPUÉS de instalar la aplicación en una nueva computadora.

## Ubicación

Copia este script a la carpeta de instalación:
- Instalador: `C:\Users\TuUsuario\AppData\Local\Programs\RESEJ\`
- Portable: Donde hayas extraído la aplicación

## Pasos de Configuración

### 1. Instalar PostgreSQL

Si aún no lo has hecho:
1. Descargar: https://www.postgresql.org/download/windows/
2. Instalar (anotar la contraseña de postgres)
3. Verificar que el servicio esté corriendo

### 2. Crear Base de Datos

Abrir pgAdmin 4 o psql y ejecutar:

```sql
-- Crear usuario
CREATE USER resej_user WITH PASSWORD 'tu_contraseña_segura';

-- Crear base de datos
CREATE DATABASE resej_db OWNER resej_user;

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE resej_db TO resej_user;
GRANT ALL ON SCHEMA public TO resej_user;
```

### 3. Ejecutar Script de Configuración

```batch
cd "C:\Users\TuUsuario\AppData\Local\Programs\RESEJ"
configurar-env.bat
```

Este script te preguntará:
- Host de PostgreSQL (generalmente: localhost)
- Puerto (generalmente: 5432)
- Nombre de la base de datos (resej_db)
- Usuario (resej_user)
- Contraseña (la que elegiste)

### 4. Ejecutar Migraciones

```batch
cd resources\BACKEND
npx knex migrate:latest
```

Esto creará todas las tablas necesarias.

### 5. (Opcional) Crear Usuario Administrador

```batch
cd resources\BACKEND
node scripts\crear-admin.js
```

### 6. Iniciar la Aplicación

Ejecutar desde:
- Acceso directo del escritorio
- Menú Inicio → RE.SE.J
- Ejecutable: `RESEJ.exe`

## Verificación

La aplicación está funcionando correctamente si:
- ✅ Se abre una ventana de Electron
- ✅ Aparece la pantalla de login
- ✅ En DevTools (Ctrl+Shift+I) no hay errores rojos
- ✅ El backend responde (puerto 3000 por defecto)

## Archivos de Configuración

### Backend (.env)
Ubicación: `resources\BACKEND\.env`

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resej_db
DB_USER=resej_user
DB_PASSWORD=tu_contraseña
JWT_SECRET=clave_super_secreta
REFRESH_TOKEN_SECRET=otra_clave_diferente
```

### Frontend (.env)
Ubicación: `resources\frontend\.env`

```env
VITE_API_URL=http://localhost:3000/api
```

## Solución de Problemas

### Error: "Cannot connect to database"

**Causa**: PostgreSQL no está corriendo o credenciales incorrectas

**Solución**:
1. Abrir Services (services.msc)
2. Buscar "postgresql-x64-XX"
3. Verificar que esté "Running"
4. Verificar credenciales en `.env`

### Error: "Port 3000 already in use"

**Causa**: Otro programa usa el puerto 3000

**Solución**:
1. Editar `resources\BACKEND\.env`
2. Cambiar `PORT=3000` a `PORT=3001` (o cualquier otro)
3. Editar `resources\frontend\.env`
4. Cambiar URL a `http://localhost:3001/api`
5. Reiniciar la aplicación

### Error: "Backend not starting"

**Causa**: Falta archivo .env o error en configuración

**Solución**:
1. Verificar que exista `resources\BACKEND\.env`
2. Si no existe, ejecutar `configurar-env.bat`
3. Verificar logs en `resources\BACKEND\logs\`

### La ventana está en blanco

**Causa**: Frontend no se compiló correctamente

**Solución**:
1. Verificar que exista `resources\frontend\dist\index.html`
2. Si empaquetaste tú mismo, ejecuta `npm run build:frontend` antes

## Actualización

Para actualizar a una nueva versión:
1. Desinstalar la versión anterior (si usaste instalador)
2. Instalar la nueva versión
3. **IMPORTANTE**: Hacer backup del archivo `.env` antes
4. Restaurar el archivo `.env` después de instalar
5. Ejecutar migraciones nuevas si las hay

## Backup de Datos

### Exportar Base de Datos

```batch
pg_dump -U resej_user -h localhost -d resej_db > backup_%date%.sql
```

### Importar Base de Datos

```batch
psql -U resej_user -h localhost -d resej_db < backup.sql
```

## Contacto y Soporte

Para más información consulta:
- README.md principal
- GUIA_ELECTRON.md
- BACKEND\CONFIGURAR_BD.md
- BACKEND\INICIO_RAPIDO.md
