# 📚 Índice de Documentación

## RE.SE.J - Registro de Secuestros Judiciales

---

## 🎯 Guía de Inicio Rápido

Documentos esenciales para comenzar:

### 1. 🚀 [INICIO_RAPIDO.md](INICIO_RAPIDO.md)

**¿Para quién?** Desarrolladores que configuran el sistema por primera vez  
**Contenido:**

- Requisitos del sistema
- Instalación paso a paso
- Configuración básica
- Primeros pasos
- ⏱️ Tiempo de lectura: 10 minutos

### 2. 📖 [README.md](README.md)

**¿Para quién?** Desarrolladores y administradores del sistema  
**Contenido:**

- Descripción general del proyecto
- Arquitectura del sistema
- Stack tecnológico completo
- Estructura de directorios
- Scripts NPM disponibles
- Variables de entorno
- Documentación técnica detallada
- ⏱️ Tiempo de lectura: 20 minutos

---

## 🔧 Documentación Técnica

### 3. 📡 [API_EXAMPLES.md](API_EXAMPLES.md)

**¿Para quién?** Desarrolladores frontend, integradores, testers  
**Contenido:**

- 70+ ejemplos de endpoints
- Ejemplos con curl
- Ejemplos para Postman/Thunder Client
- Respuestas esperadas
- Códigos de error
- Flujos de autenticación completos
- ⏱️ Tiempo de lectura: 30 minutos (consulta)

### 4. 🗄️ [setup_database.sql](setup_database.sql)

**¿Para quién?** Administradores de base de datos  
**Contenido:**

- Script SQL de configuración
- Creación de base de datos
- Creación de usuario
- Configuración de permisos
- ⏱️ Tiempo de ejecución: 2 minutos

---

## 🚀 Despliegue y Producción

### 5. 🌐 [DESPLIEGUE_PRODUCCION.md](DESPLIEGUE_PRODUCCION.md)

**¿Para quién?** DevOps, administradores de sistemas  
**Contenido:**

- Guía completa de despliegue en producción
- Configuración de PostgreSQL para producción
- Configuración de servicios (systemd/Windows)
- Nginx como reverse proxy
- HTTPS con Let's Encrypt
- Monitoreo y logs
- Backups automatizados
- Solución de problemas
- ⏱️ Tiempo de lectura: 45 minutos

### 6. 🔒 [SEGURIDAD_CHECKLIST.md](SEGURIDAD_CHECKLIST.md)

**¿Para quién?** Responsables de seguridad, auditores  
**Contenido:**

- Checklist completo de seguridad
- Pre-despliegue
- Post-despliegue
- Mantenimiento regular
- Plan de respuesta a incidentes
- Niveles de seguridad
- ⏱️ Tiempo de lectura: 25 minutos

---

## 📚 Documentación de Apoyo

### 7. ❓ [FAQ.md](FAQ.md)

**¿Para quién?** Todos los usuarios del sistema  
**Contenido:**

- Preguntas frecuentes
- Instalación y configuración
- Autenticación y seguridad
- Usuarios y roles
- Archivos adjuntos
- Búsquedas y consultas
- Base de datos
- Solución de problemas comunes
- Mantenimiento
- ⏱️ Tiempo de lectura: 20 minutos (consulta)

### 8. ⚖️ [LICENCIA.md](LICENCIA.md)

**¿Para quién?** Todos los usuarios, personal legal  
**Contenido:**

- Términos de uso
- Propiedad intelectual
- Confidencialidad
- Marco legal
- Protección de datos personales
- Responsabilidades y sanciones
- ⏱️ Tiempo de lectura: 15 minutos

---

## 🛠️ Scripts de Instalación

### 9. 🪟 [instalar.bat](instalar.bat)

**¿Para quién?** Usuarios de Windows  
**Contenido:**

- Script automatizado de instalación
- Verificación de requisitos
- Instalación de dependencias
- Configuración inicial
- ⏱️ Tiempo de ejecución: 5 minutos

### 10. 🐧 [instalar.sh](instalar.sh)

**¿Para quién?** Usuarios de Linux/Mac  
**Contenido:**

- Script automatizado de instalación
- Verificación de requisitos
- Instalación de dependencias
- Configuración inicial
- ⏱️ Tiempo de ejecución: 5 minutos

---

## 📊 Diagramas y Visuales

### 11. 🏗️ Arquitectura del Sistema

**Ubicación:** README.md → Sección Arquitectura  
**Contenido:**

- Diagrama de capas
- Flujo de datos
- Componentes principales
- Interacciones entre servicios

### 12. 🔐 Flujo de Autenticación

**Ubicación:** API_EXAMPLES.md → Sección Autenticación  
**Contenido:**

- Login y obtención de tokens
- Uso de access token
- Renovación con refresh token
- Logout y revocación

---

## 📋 Referencia Rápida

### Comandos Principales

```bash
# Instalación
npm install                    # Instalar dependencias
npm run migrate:latest         # Ejecutar migraciones
npm run seed:run              # Crear usuario admin

# Desarrollo
npm run dev                    # Iniciar en modo desarrollo
npm start                      # Iniciar en producción

# Base de datos
npm run migrate:rollback       # Revertir última migración
npm run migrate:make nombre    # Crear nueva migración
npm run seed:make nombre       # Crear nuevo seed

# Mantenimiento
npm run cleanup:tokens         # Limpiar tokens expirados
npm run cleanup:files          # Limpiar archivos huérfanos
```

### Credenciales por Defecto

- **Usuario:** `admin`
- **Contraseña:** `Admin2025!`
- ⚠️ **Cambiar después del primer login**

### URLs Importantes

- **API Base:** `http://localhost:3000/api`
- **Health Check:** `http://localhost:3000/health`
- **Documentación API:** `API_EXAMPLES.md`

### Puertos

- **Backend:** 3000 (configurable)
- **PostgreSQL:** 5432
- **Nginx (opcional):** 80/443

---

## 🗂️ Estructura de Archivos del Proyecto

```
BACKEND/
├── 📄 README.md                    # Documentación principal
├── 📄 INICIO_RAPIDO.md            # Guía de inicio
├── 📄 API_EXAMPLES.md             # Ejemplos de API
├── 📄 DESPLIEGUE_PRODUCCION.md    # Guía de producción
├── 📄 SEGURIDAD_CHECKLIST.md      # Checklist de seguridad
├── 📄 FAQ.md                      # Preguntas frecuentes
├── 📄 LICENCIA.md                 # Términos y licencia
├── 📄 INDICE_DOCUMENTACION.md     # Este archivo
│
├── 📄 package.json                # Dependencias y scripts
├── 📄 knexfile.js                 # Configuración de Knex
├── 📄 .env.example                # Variables de entorno ejemplo
├── 📄 .gitignore                  # Archivos ignorados por Git
│
├── 🔧 instalar.bat                # Instalador Windows
├── 🔧 instalar.sh                 # Instalador Linux/Mac
├── 🔧 setup_database.sql          # Script de BD
│
├── 📁 src/
│   ├── 📁 config/                 # Configuraciones
│   ├── 📁 middleware/             # Middleware Express
│   ├── 📁 models/                 # Modelos de datos
│   ├── 📁 services/               # Lógica de negocio
│   ├── 📁 controllers/            # Controladores
│   ├── 📁 routes/                 # Rutas de la API
│   ├── 📁 utils/                  # Utilidades
│   ├── 📁 migrations/             # Migraciones de BD
│   ├── 📁 seeds/                  # Seeds de BD
│   ├── 📄 app.js                  # Configuración Express
│   └── 📄 server.js               # Punto de entrada
│
├── 📁 scripts/
│   ├── 📄 cleanup-tokens.js       # Limpiar tokens
│   └── 📄 cleanup-files.js        # Limpiar archivos
│
├── 📁 uploads/                    # Archivos subidos
├── 📁 logs/                       # Logs de aplicación
└── 📁 node_modules/               # Dependencias
```

---

## 🎓 Rutas de Aprendizaje

### Para Desarrolladores Nuevos

1. **Día 1:**

   - [ ] Leer `INICIO_RAPIDO.md`
   - [ ] Instalar sistema localmente
   - [ ] Probar health check
   - [ ] Probar login con usuario admin

2. **Día 2:**

   - [ ] Leer `README.md` completo
   - [ ] Explorar estructura de archivos
   - [ ] Revisar migraciones de BD
   - [ ] Entender modelos de datos

3. **Día 3:**

   - [ ] Estudiar `API_EXAMPLES.md`
   - [ ] Probar todos los endpoints
   - [ ] Usar Postman/Thunder Client
   - [ ] Revisar logs de auditoría

4. **Semana 1:**
   - [ ] Leer `FAQ.md` completo
   - [ ] Entender flujos de autenticación
   - [ ] Revisar código fuente de servicios
   - [ ] Implementar primera funcionalidad de prueba

### Para Administradores de Sistema

1. **Primera Semana:**

   - [ ] Leer `DESPLIEGUE_PRODUCCION.md`
   - [ ] Revisar `SEGURIDAD_CHECKLIST.md`
   - [ ] Configurar entorno de prueba
   - [ ] Probar backups y restauración

2. **Segunda Semana:**
   - [ ] Configurar monitoreo
   - [ ] Implementar backups automáticos
   - [ ] Revisar logs periódicamente
   - [ ] Documentar procedimientos específicos

### Para Auditores de Seguridad

1. **Auditoría Inicial:**

   - [ ] Leer `LICENCIA.md`
   - [ ] Revisar `SEGURIDAD_CHECKLIST.md`
   - [ ] Verificar implementación de medidas
   - [ ] Probar vulnerabilidades conocidas

2. **Auditoría Regular:**
   - [ ] Revisar logs de auditoría
   - [ ] Verificar permisos de usuarios
   - [ ] Comprobar backups
   - [ ] Actualizar checklist si es necesario

---

## 🔍 Búsqueda Rápida de Temas

### Autenticación

- API_EXAMPLES.md → Sección "Autenticación"
- README.md → Sección "Autenticación JWT"
- FAQ.md → "Autenticación y Seguridad"

### Roles y Permisos

- README.md → Sección "Roles"
- FAQ.md → "Usuarios y Roles"
- API_EXAMPLES.md → Ejemplos de usuarios

### Archivos Adjuntos

- API_EXAMPLES.md → Sección "Archivos Adjuntos"
- FAQ.md → "Archivos Adjuntos"
- README.md → Configuración de Multer

### Base de Datos

- setup_database.sql → Script de configuración
- README.md → Sección "Base de Datos"
- FAQ.md → "Base de Datos"

### Seguridad

- SEGURIDAD_CHECKLIST.md → Checklist completo
- DESPLIEGUE_PRODUCCION.md → Sección "Seguridad"
- FAQ.md → "Seguridad"

### Despliegue

- DESPLIEGUE_PRODUCCION.md → Guía completa
- INICIO_RAPIDO.md → Configuración básica
- FAQ.md → Problemas comunes

### Mantenimiento

- FAQ.md → Sección "Mantenimiento"
- DESPLIEGUE_PRODUCCION.md → Sección "Mantenimiento"
- scripts/ → Scripts de limpieza

---

## 📞 Contactos

### Soporte Técnico

- **Email:** soporte-ti@policia.tucuman.gob.ar
- **Horario:** Lunes a Viernes, 8:00 - 16:00

### Seguridad

- **Email:** seguridad@policia.tucuman.gob.ar
- **Disponibilidad:** 24/7

### Protección de Datos

- **Email:** datospersonales@policia.tucuman.gob.ar
- **Horario:** Lunes a Viernes, 8:00 - 16:00

---

## 🔄 Actualizaciones de Documentación

Este índice se actualiza con cada nueva versión de la documentación.

**Última actualización:** Enero 2025  
**Versión:** 1.0  
**Próxima revisión:** Julio 2025

---

## 📝 Contribuciones a la Documentación

Si encuentras errores o quieres sugerir mejoras:

1. Documentar el problema claramente
2. Proponer la corrección/mejora
3. Enviar a: soporte-ti@policia.tucuman.gob.ar

---

## ✅ Checklist de Documentos Leídos

Para nuevos usuarios del sistema:

- [ ] INICIO_RAPIDO.md - Configuración inicial
- [ ] README.md - Documentación técnica
- [ ] API_EXAMPLES.md - Ejemplos de uso
- [ ] FAQ.md - Preguntas frecuentes
- [ ] LICENCIA.md - Términos de uso

Para administradores de sistema:

- [ ] DESPLIEGUE_PRODUCCION.md - Despliegue
- [ ] SEGURIDAD_CHECKLIST.md - Seguridad
- [ ] FAQ.md - Preguntas frecuentes

Para auditores:

- [ ] SEGURIDAD_CHECKLIST.md - Medidas de seguridad
- [ ] LICENCIA.md - Marco legal
- [ ] README.md - Arquitectura técnica

---

**¡Bienvenido al sistema RE.SE.J!**

Este índice es tu mapa para navegar toda la documentación.  
Comienza por `INICIO_RAPIDO.md` y avanza según tu rol.

---

**© 2025 Policía de Tucumán**
