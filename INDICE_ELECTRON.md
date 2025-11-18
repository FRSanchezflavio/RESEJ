# 📚 Índice de Documentación - Electron

## 🎯 Guías de Empaquetado

### Principal
- **[QUICKSTART_ELECTRON.md](QUICKSTART_ELECTRON.md)** ⭐ - Inicio ultra rápido
- **[README_ELECTRON.md](README_ELECTRON.md)** - Guía completa de distribución
- **[GUIA_ELECTRON.md](GUIA_ELECTRON.md)** - Guía detallada paso a paso

### Post-Instalación
- **[POSTINSTALACION.md](POSTINSTALACION.md)** - Configuración en nueva PC

## 🔧 Scripts de Automatización

### Instalación y Configuración
- `instalar-electron.bat` - Instalar todas las dependencias
- `configurar-env.bat` - Configurar variables de entorno interactivamente
- `verificar-electron.bat` - Verificar que todo esté listo

### Empaquetado
- `empaquetar-electron.bat` - Crear ejecutable completo
- `ejecutar-electron-dev.bat` - Modo desarrollo

### Scripts Originales (aún funcionan)
- `iniciar-app-completa.bat` - Iniciar sin Electron (modo desarrollo)
- `iniciar-backend.bat` - Solo backend
- `iniciar-frontend.bat` - Solo frontend

## 📦 Flujo de Trabajo

### 1. Desarrollo Local (sin Electron)
```batch
# Terminal 1: Backend
.\iniciar-backend.bat

# Terminal 2: Frontend
.\iniciar-frontend.bat
```

### 2. Desarrollo con Electron
```batch
# Terminal 1: Frontend dev server
cd frontend
npm run dev

# Terminal 2: Electron
.\ejecutar-electron-dev.bat
```

### 3. Crear Distribución
```batch
# Paso 1: Instalar dependencias (solo primera vez)
.\instalar-electron.bat

# Paso 2: Verificar
.\verificar-electron.bat

# Paso 3: Empaquetar
.\empaquetar-electron.bat
```

## 📋 Archivos Técnicos

### Electron
- `electron-main.js` - Proceso principal de Electron
- `electron-preload.js` - Bridge de seguridad
- `package.json` - Configuración y scripts

### Configuración
- `BACKEND/.env.example` - Plantilla de variables de entorno
- `frontend/.env` - Configuración del frontend
- `vite.config.js` - Configuración de compilación

## 🎯 Casos de Uso

### Quiero desarrollar la aplicación
→ Usa `iniciar-app-completa.bat` o scripts separados

### Quiero probar con Electron en desarrollo
→ Usa `ejecutar-electron-dev.bat` + frontend dev server

### Quiero crear un ejecutable para distribuir
→ Usa `empaquetar-electron.bat`

### Quiero instalar en otra computadora
1. Copiar el ejecutable generado
2. Instalar PostgreSQL
3. Ver `POSTINSTALACION.md`

## 📖 Documentación Backend (Original)

- `BACKEND/INICIO_RAPIDO.md` - Inicio rápido del backend
- `BACKEND/CONFIGURAR_BD.md` - Configuración de PostgreSQL
- `BACKEND/API_EXAMPLES.md` - Ejemplos de la API
- `BACKEND/CONFIGURACION_EMAIL.md` - Configurar emails
- `BACKEND/DESPLIEGUE_PRODUCCION.md` - Despliegue en servidor

## 📖 Documentación Frontend (Original)

- `frontend/GUIA_RAPIDA.md` - Guía rápida del frontend
- `frontend/README.md` - Documentación completa
- `frontend/SISTEMA_DISEÑO.md` - Sistema de diseño UI

## 📖 Documentación General

- `README.md` - Documentación principal del proyecto
- `INICIO_RAPIDO.md` - Inicio rápido general
- `SOLUCION_PROBLEMAS.md` - Solución de problemas comunes
- `VERIFICACION_SISTEMA.md` - Verificación del sistema

## 🚀 Comandos npm Rápidos

```bash
# Electron
npm run electron              # Ejecutar (producción)
npm run electron:dev          # Ejecutar (desarrollo)

# Empaquetado
npm run build:frontend        # Compilar frontend
npm run build:all             # Compilar todo
npm run dist                  # Crear instalador
npm run dist:win              # Crear solo Windows
npm run pack                  # Crear carpeta (testing)

# Instalación
npm run postinstall           # Instalar deps backend + frontend
```

## 🎯 Estructura de Carpetas

```
RESEJ/
├── electron-main.js           # Proceso principal Electron
├── electron-preload.js        # Preload script
├── package.json               # Configuración raíz + Electron
│
├── BACKEND/                   # Servidor Node.js
│   ├── server.js
│   ├── .env.example
│   ├── package.json
│   └── src/
│
├── frontend/                  # Aplicación React
│   ├── src/
│   ├── dist/                  # Compilado (se crea)
│   ├── package.json
│   └── vite.config.js
│
├── dist-electron/             # Ejecutables (se crea)
│   ├── RESEJ-Setup.exe
│   └── RESEJ-Portable.exe
│
└── Documentación y scripts .bat
```

## 🔐 Seguridad

**Archivos que NUNCA se deben compartir:**
- `BACKEND/.env` (contiene contraseñas)
- `BACKEND/logs/` (puede contener información sensible)
- `BACKEND/uploads/` (archivos del usuario)

**Archivos seguros para distribuir:**
- `BACKEND/.env.example` ✅
- Todo el código fuente ✅
- Ejecutables generados ✅

## 🆘 Ayuda Rápida

| Problema | Solución |
|----------|----------|
| "No se puede conectar a BD" | Ver `BACKEND/CONFIGURAR_BD.md` |
| "Puerto en uso" | Cambiar `PORT` en `.env` |
| "Backend no inicia" | Verificar `.env` existe |
| Error al empaquetar | Ejecutar `verificar-electron.bat` |
| Falta archivo .env | Ejecutar `configurar-env.bat` |

## 📞 Contacto y Soporte

Para más información:
- Revisa la documentación específica de cada sección
- Ejecuta los scripts de verificación
- Consulta los archivos `.md` según tu necesidad
