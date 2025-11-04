# Guía de Instalación - Sistema RESEJ Policía

## 📦 Instalación de la Aplicación de Escritorio

### Requisitos Previos

1. **Sistema Operativo**: Windows 10 o superior
2. **Base de Datos**: PostgreSQL 12 o superior instalado y en ejecución
3. **Espacio en Disco**: Mínimo 500 MB disponibles

### Pasos de Instalación

#### 1. Ejecutar el Instalador

1. Descargue el archivo `Sistema RESEJ Policía-Setup-1.0.0.exe`
2. Haga doble clic en el instalador
3. Si Windows SmartScreen muestra una advertencia:
   - Haga clic en "Más información"
   - Luego en "Ejecutar de todas formas"

#### 2. Proceso de Instalación

1. Seleccione la carpeta de instalación (recomendado: dejar la predeterminada)
2. Marque las casillas para:
   - ✅ Crear acceso directo en el escritorio
   - ✅ Crear acceso directo en el menú de inicio
3. Haga clic en "Instalar"
4. Espere a que finalice la instalación

#### 3. Configuración Inicial

Al ejecutar la aplicación por primera vez:

1. La aplicación creará automáticamente las carpetas necesarias
2. Configure la base de datos editando el archivo de configuración

---

## ⚙️ Configuración de la Base de Datos

### Ubicación del Archivo de Configuración

Después de la instalación, busque el archivo `.env` en:

```
C:\Users\[SuUsuario]\AppData\Local\Programs\sistema-resej-policia\resources\BACKEND\.env
```

O puede crear un archivo `.env` en la carpeta de instalación del programa.

### Contenido del Archivo .env

Cree o edite el archivo `.env` con la siguiente configuración:

```env
# Configuración de Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resej_db
DB_USER=resej_user
DB_PASSWORD=su_contraseña_segura

# Configuración del Servidor
PORT=3001
NODE_ENV=production

# Configuración JWT (Autenticación)
JWT_SECRET=clave_secreta_muy_segura_cambiar_en_produccion
JWT_REFRESH_SECRET=otra_clave_secreta_diferente_cambiar

# Configuración de Sesión
SESSION_SECRET=clave_de_sesion_muy_segura

# Configuración de Email (Opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_de_aplicacion
```

### Crear la Base de Datos

Antes de usar la aplicación, debe crear la base de datos:

1. Abra **pgAdmin** o la terminal de PostgreSQL
2. Ejecute los siguientes comandos:

```sql
-- Crear usuario
CREATE USER resej_user WITH PASSWORD 'su_contraseña_segura';

-- Crear base de datos
CREATE DATABASE resej_db OWNER resej_user;

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE resej_db TO resej_user;
```

3. Conecte a la base de datos `resej_db` y ejecute las migraciones

---

## 🚀 Ejecución de la Aplicación

### Primera Ejecución

1. Haga doble clic en el icono "Sistema RESEJ Policía" del escritorio
2. La aplicación iniciará automáticamente:
   - El servidor backend (puerto 3001)
   - La interfaz gráfica de usuario

### Inicio de Sesión por Defecto

Usuario: `admin`  
Contraseña: `admin123`

**⚠️ IMPORTANTE**: Cambie la contraseña después del primer inicio de sesión.

---

## 🔧 Solución de Problemas

### La aplicación no inicia

1. **Verificar PostgreSQL**:

   - Asegúrese de que PostgreSQL está en ejecución
   - Verifique el puerto 5432

2. **Revisar configuración**:

   - Verifique que el archivo `.env` existe y tiene los datos correctos
   - Compruebe usuario y contraseña de la base de datos

3. **Verificar puerto ocupado**:
   - Si el puerto 3001 está ocupado, cierre otras aplicaciones
   - O cambie el puerto en el archivo `.env`

### Error de conexión a base de datos

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solución**:

1. Abra "Servicios" de Windows (Win + R → `services.msc`)
2. Busque "PostgreSQL"
3. Haga clic derecho → "Iniciar"

### No aparecen los datos

**Solución**:

1. Verifique que ejecutó las migraciones de la base de datos
2. Desde una terminal, navegue a la carpeta BACKEND
3. Ejecute: `npm run migrate`

---

## 📱 Uso en la Red Local

Si desea acceder desde otros dispositivos en la red:

1. Obtenga la dirección IP del equipo servidor:

   - Abra CMD
   - Ejecute: `ipconfig`
   - Anote la "Dirección IPv4"

2. En otros dispositivos, abra el navegador:

   - Vaya a: `http://[IP_DEL_SERVIDOR]:3001`
   - Ejemplo: `http://192.168.1.100:3001`

3. Asegúrese de que el firewall permite conexiones en el puerto 3001

---

## 🔒 Seguridad

### Recomendaciones Importantes

1. **Cambiar credenciales por defecto** inmediatamente
2. **Mantener actualizado** PostgreSQL
3. **Realizar copias de seguridad** periódicas de la base de datos
4. **No compartir** el archivo `.env` con información sensible
5. **Usar contraseñas fuertes** (mínimo 12 caracteres)

### Realizar Copia de Seguridad

Desde pgAdmin o terminal PostgreSQL:

```bash
pg_dump -U resej_user resej_db > backup_resej_$(date +%Y%m%d).sql
```

Para restaurar:

```bash
psql -U resej_user resej_db < backup_resej_YYYYMMDD.sql
```

---

## 📞 Soporte Técnico

Para problemas técnicos:

1. Revise los logs en: `C:\Users\[SuUsuario]\AppData\Local\Programs\sistema-resej-policia\resources\BACKEND\logs`
2. Documente el error y capturas de pantalla
3. Contacte al departamento de TI

---

## 🔄 Actualización de la Aplicación

1. Descargue la nueva versión del instalador
2. Ejecute el nuevo instalador (automáticamente actualizará)
3. Los datos de la base de datos se mantienen intactos

---

## 📋 Desinstalación

1. Panel de Control → Programas y Características
2. Busque "Sistema RESEJ Policía"
3. Haga clic en "Desinstalar"

**Nota**: Los datos de la base de datos NO se eliminarán automáticamente.

---

## 📖 Documentación Adicional

Para más información:

- Consulte el archivo `README.md` en la carpeta de instalación
- Revise `BACKEND/README.md` para detalles técnicos
- Consulte `API_EXAMPLES.md` para integración con otros sistemas

---

_Versión 1.0.0 - Sistema de Registro de Secuestros - Policía_
