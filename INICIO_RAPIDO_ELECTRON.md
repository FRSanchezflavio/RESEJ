# 🚀 Inicio Rápido - Aplicación de Escritorio Electron

## 📱 Para Usuarios Finales (Personal Policial)

### Instalación Rápida

1. **Ejecutar el instalador:** `Sistema RESEJ Policía-Setup-1.0.0.exe`
2. **Seguir el asistente** (dejar opciones por defecto)
3. **Configurar base de datos** (ver sección abajo)
4. **Iniciar la aplicación** desde el escritorio

### Login Inicial

- **Usuario:** `admin`
- **Contraseña:** `admin123`
- ⚠️ **¡Cambiar contraseña inmediatamente!**

### Configuración de Base de Datos

Editar archivo `.env` en la carpeta de instalación:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resej_db
DB_USER=resej_user
DB_PASSWORD=tu_contraseña_segura
```

Ver **INSTALACION.md** para instrucciones detalladas.

---

## 💻 Para Desarrolladores

### Primera Instalación

```bash
# 1. Instalar dependencias raíz
npm install

# 2. Instalar dependencias frontend
cd frontend
npm install
cd ..

# 3. Instalar dependencias backend
cd BACKEND
npm install
cd ..
```

### Desarrollo Diario

#### Opción 1: Desarrollo Web (Recomendado)

```bash
# Terminal 1: Backend
cd BACKEND
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```

Abrir navegador en: http://localhost:5173

#### Opción 2: Electron en Desarrollo

```bash
npm run electron:dev
```

Esto inicia todo automáticamente (backend + frontend + Electron).

#### Opción 3: Electron con Backend Integrado

```bash
npm run electron:with-backend
```

El backend se inicia automáticamente dentro de Electron.

### Construir Instalador

#### Método Rápido (Windows)

```bash
build-electron.bat
```

#### Método Manual

```bash
# 1. Construir frontend
cd frontend
npm run build
cd ..

# 2. Construir aplicación Electron
npm run electron:build:win
```

El instalador estará en: **`dist/Sistema RESEJ Policía-Setup-1.0.0.exe`**

---

## 🔧 Comandos Disponibles

| Comando                         | Descripción                                          |
| ------------------------------- | ---------------------------------------------------- |
| `npm start`                     | Inicia backend y frontend simultáneamente            |
| `npm run electron`              | Ejecuta Electron (requiere backend/frontend activos) |
| `npm run electron:dev`          | Desarrollo completo con Electron                     |
| `npm run electron:with-backend` | Electron con backend integrado                       |
| `npm run build:frontend`        | Construye el frontend                                |
| `npm run electron:build`        | Construye instalador completo                        |
| `npm run electron:build:win`    | Construye instalador para Windows                    |

---

## 🐛 Solución Rápida de Problemas

| Problema                     | Solución                                      |
| ---------------------------- | --------------------------------------------- |
| ❌ La app no inicia          | Verificar PostgreSQL corriendo en puerto 5432 |
| ❌ Error de conexión BD      | Revisar credenciales en `.env`                |
| ❌ Puerto 3001 ocupado       | Cerrar otras apps o cambiar PORT en `.env`    |
| ❌ Error al construir        | Ejecutar `npm cache clean --force`            |
| ❌ OneDrive bloquea archivos | Mover proyecto fuera de OneDrive              |
| ❌ Frontend no carga         | Verificar que `frontend/dist` existe          |

---

## 📋 Checklist Pre-Distribución

Antes de distribuir a la institución policial:

- [ ] Cambiar todas las `JWT_SECRET` en `.env`
- [ ] Configurar credenciales de BD correctas
- [ ] Probar instalador en máquina limpia
- [ ] Preparar documento INSTALACION.md
- [ ] Crear manual de usuario
- [ ] Configurar firewall rules si es necesario
- [ ] Planificar backups de base de datos
- [ ] Definir política de actualizaciones

---

## 📦 Archivos Importantes

```
RESEJ/
├── electron.js                    # Electron básico
├── electron-with-backend.js       # Electron con backend integrado
├── build-electron.bat             # Script de construcción Windows
├── package.json                   # Configuración principal
├── INSTALACION.md                 # Guía para usuarios finales
├── README_ELECTRON.md             # Documentación completa Electron
└── dist/                          # Instaladores generados
    └── Sistema RESEJ Policía-Setup-1.0.0.exe
```

---

## 🎯 Próximos Pasos

### Como Desarrollador:

1. ✅ Ejecutar `npm run electron:dev` para probar
2. ✅ Hacer cambios necesarios
3. ✅ Ejecutar `build-electron.bat` para crear instalador
4. ✅ Probar instalador en otra máquina

### Para Distribución:

1. ✅ Revisar y actualizar INSTALACION.md
2. ✅ Preparar archivo `.env.example` con variables necesarias
3. ✅ Crear manual de usuario (capturas de pantalla)
4. ✅ Distribuir instalador al personal IT
5. ✅ Capacitar usuarios finales

---

## 📚 Documentación Adicional

- **INSTALACION.md** - Guía completa de instalación para usuarios
- **README_ELECTRON.md** - Documentación técnica completa
- **BACKEND/README.md** - Documentación del backend
- **frontend/README.md** - Documentación del frontend

---

## 🔒 Notas de Seguridad

⚠️ **IMPORTANTE para producción:**

1. **Cambiar TODAS las claves secretas** en `.env`:

   - JWT_SECRET
   - JWT_REFRESH_SECRET
   - SESSION_SECRET

2. **Configurar PostgreSQL de forma segura:**

   - Usuario con contraseña fuerte
   - Acceso solo desde localhost o IPs permitidas
   - Backups automáticos configurados

3. **Firmar el instalador** con certificado digital (recomendado)

4. **Distribuir solo por canales oficiales**

---

## 🤝 Soporte

Para problemas técnicos:

1. Revisar logs en: `BACKEND/logs/`
2. Verificar configuración de `.env`
3. Consultar **INSTALACION.md** y **README_ELECTRON.md**
4. Contactar al equipo de desarrollo

---

_Sistema RESEJ v1.0.0 - Aplicación de Escritorio para Institución Policial_
