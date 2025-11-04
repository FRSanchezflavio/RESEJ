# 🖥️ Sistema RESEJ Policía - Aplicación de Escritorio

Sistema de Registro de Secuestros convertido en aplicación de escritorio con Electron.

## 📋 Índice

- [Desarrollo](#desarrollo)
- [Construcción](#construcción)
- [Distribución](#distribución)
- [Configuración](#configuración)

## 🔧 Desarrollo

### Requisitos Previos

- Node.js 18 o superior
- PostgreSQL 12 o superior
- npm o yarn

### Instalación de Dependencias

```bash
# Instalar dependencias del proyecto raíz
npm install

# Instalar dependencias del backend
cd BACKEND
npm install
cd ..

# Instalar dependencias del frontend
cd frontend
npm install
cd ..
```

### Ejecución en Modo Desarrollo

#### Opción 1: Desarrollo Web Normal (Recomendado para desarrollo)

```bash
# Terminal 1: Backend
cd BACKEND
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```

Abrir navegador en: http://localhost:5173

#### Opción 2: Electron con Frontend/Backend Separados

```bash
# Desde la raíz del proyecto
npm run electron:dev
```

Esto iniciará:

1. Backend en puerto 3001
2. Frontend con Vite en puerto 5173
3. Electron cargando el frontend de Vite

#### Opción 3: Electron con Backend Integrado

```bash
# Terminal 1: Frontend en desarrollo
cd frontend
npm run dev

# Terminal 2: Electron con backend
npm run electron:with-backend
```

### Scripts Disponibles

```json
{
  "start": "Inicia backend y frontend simultáneamente",
  "start:frontend": "Inicia solo el frontend (Vite)",
  "start:backend": "Inicia solo el backend",
  "electron": "Ejecuta Electron (requiere frontend y backend corriendo)",
  "electron:dev": "Desarrollo completo con Electron",
  "electron:with-backend": "Electron con backend integrado",
  "build:frontend": "Construye el frontend para producción",
  "electron:build": "Construye la aplicación de escritorio completa",
  "electron:build:win": "Construye específicamente para Windows"
}
```

## 🏗️ Construcción

### Preparar para Producción

1. **Construir el Frontend:**

```bash
cd frontend
npm run build
cd ..
```

Esto generará los archivos en `frontend/dist/`

2. **Verificar Configuración del Backend:**

Asegúrese de que `BACKEND/.env` esté configurado correctamente para producción.

3. **Instalar Dependencias de Producción del Backend:**

```bash
cd BACKEND
npm install --production
cd ..
```

### Generar Instalador

```bash
# Desde la raíz del proyecto
npm run electron:build:win
```

El instalador se generará en: `dist/Sistema RESEJ Policía-Setup-1.0.0.exe`

### Construcción Solo para Pruebas (sin instalador)

```bash
npm run pack
```

Esto genera una carpeta ejecutable en `dist/` sin crear el instalador.

## 📦 Distribución

### Archivos Generados

Después de ejecutar `npm run electron:build:win`, encontrará:

```
dist/
├── Sistema RESEJ Policía-Setup-1.0.0.exe    # Instalador NSIS
├── win-unpacked/                             # Aplicación sin empaquetar
└── builder-effective-config.yaml             # Configuración usada
```

### Distribución a la Institución Policial

1. **Preparar el Paquete de Instalación:**

   - Copie `Sistema RESEJ Policía-Setup-1.0.0.exe`
   - Incluya `INSTALACION.md`
   - Incluya `BACKEND/.env.example` como referencia

2. **Documentos Necesarios:**

   - Guía de instalación (INSTALACION.md)
   - Credenciales de base de datos
   - Manual de usuario

3. **Requisitos del Sistema Destino:**
   - Windows 10/11
   - PostgreSQL instalado y configurado
   - Mínimo 4GB RAM
   - 500MB espacio en disco

## ⚙️ Configuración

### Archivo de Configuración Principal

La aplicación busca el archivo `.env` en:

```
BACKEND/.env
```

### Variables de Entorno Importantes

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resej_db
DB_USER=resej_user
DB_PASSWORD=contraseña_segura

# Servidor
PORT=3001
NODE_ENV=production

# Seguridad
JWT_SECRET=clave_secreta_cambiar
JWT_REFRESH_SECRET=otra_clave_secreta_cambiar
SESSION_SECRET=clave_sesion_cambiar
```

### Configuración de Electron

Edite `electron.js` o `electron-with-backend.js` para:

- Cambiar el tamaño de ventana inicial
- Modificar el icono de la aplicación
- Ajustar el comportamiento de la ventana
- Configurar seguridad adicional

### Personalización del Instalador

Edite `package.json` en la sección `build`:

```json
{
  "build": {
    "appId": "com.policia.resej",
    "productName": "Sistema RESEJ Policía",
    "win": {
      "icon": "ruta/al/icono.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

## 🐛 Solución de Problemas

### Error al instalar Electron

Si recibe errores de OneDrive bloqueando archivos:

```bash
# Limpiar caché
npm cache clean --force

# Reinstalar
npm install
```

### Error de compilación de frontend

```bash
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

### Error de base de datos en producción

Verifique:

1. PostgreSQL está corriendo
2. Credenciales en `.env` son correctas
3. Base de datos existe y tiene las tablas migradas

### La aplicación no inicia

Revise los logs en:

- Windows: `%APPDATA%\sistema-resej-policia\logs\`
- O en la consola de Electron (si está en desarrollo)

## 📝 Notas Importantes

### Seguridad

1. **Nunca incluya** archivos `.env` con credenciales reales en el instalador
2. **Cambie todas las claves secretas** en producción
3. **Use certificados de firma de código** para el instalador en entorno real

### Performance

- La primera ejecución puede tardar mientras se inicializa la base de datos
- El backend tarda ~3 segundos en iniciar
- Considere usar SQLite para instalaciones individuales (requiere cambios en el código)

### Actualizaciones

Para implementar actualizaciones automáticas, considere:

- electron-updater
- Servidor de actualizaciones propio
- Sistema de notificaciones de nuevas versiones

## 📚 Recursos Adicionales

- [Documentación de Electron](https://www.electronjs.org/docs)
- [Documentación de electron-builder](https://www.electron.build/)
- [Guía de seguridad de Electron](https://www.electronjs.org/docs/tutorial/security)

## 🤝 Soporte

Para problemas o preguntas:

1. Revise los logs de la aplicación
2. Consulte INSTALACION.md
3. Contacte al equipo de desarrollo

---

_Desarrollado para la Institución Policial_
