# 🚀 INICIO RÁPIDO - Electron

## Para Crear el Ejecutable (Primera vez)

```batch
# 1. Instalar todo
.\instalar-electron.bat

# 2. Verificar que todo esté listo
.\verificar-electron.bat

# 3. Empaquetar
.\empaquetar-electron.bat
```

## Resultados

Los ejecutables estarán en `dist-electron\`:
- **RESEJ-Setup-1.0.0.exe** → Instalador completo
- **RESEJ-Portable-1.0.0.exe** → Versión portable

## Para Instalar en Otra Computadora

1. **Instalar PostgreSQL** (si no está instalado)
2. **Ejecutar** `RESEJ-Setup-1.0.0.exe`
3. **Configurar** el archivo `.env`:
   ```batch
   cd "C:\Users\TuUsuario\AppData\Local\Programs\RESEJ"
   configurar-env.bat
   ```
4. **Crear base de datos** (desde pgAdmin o scripts SQL)
5. **Ejecutar migraciones**:
   ```batch
   cd "C:\Users\TuUsuario\AppData\Local\Programs\RESEJ\resources\BACKEND"
   npx knex migrate:latest
   ```
6. **Iniciar aplicación** desde el acceso directo

## Comandos npm Disponibles

```bash
npm run electron          # Ejecutar en modo producción
npm run electron:dev      # Ejecutar en modo desarrollo
npm run build:frontend    # Compilar solo frontend
npm run build:all         # Compilar todo
npm run pack              # Crear carpeta sin instalar
npm run dist              # Crear instalador + portable
npm run dist:win          # Crear solo para Windows
```

## Estructura del Empaquetado

```
dist-electron/
├── win-unpacked/              # Versión sin empaquetar (testing)
├── RESEJ-Setup-1.0.0.exe     # Instalador
└── RESEJ-Portable-1.0.0.exe  # Portable
```

## ¿Problemas?

Consulta:
- `README_ELECTRON.md` → Guía rápida
- `GUIA_ELECTRON.md` → Guía completa
- `POSTINSTALACION.md` → Configuración en nueva PC
- `verificar-electron.bat` → Verificar requisitos

## Modo Desarrollo

```batch
# Terminal 1
cd frontend
npm run dev

# Terminal 2
.\ejecutar-electron-dev.bat
```
