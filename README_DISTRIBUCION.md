# 📦 Paquete de Distribución - Sistema RESEJ

## 🎯 Para Instalar en Otra Dependencia Policial

Este paquete contiene todo lo necesario para instalar el Sistema RESEJ (Registro de Secuestros Judiciales) en una nueva dependencia policial.

---

## 📋 Contenido del Paquete

```
RESEJ/
├── 📄 REQUISITOS_SISTEMA.md          → Requisitos técnicos necesarios
├── 📄 GUIA_INSTALACION_DEPENDENCIAS.md → Guía paso a paso
├── 📄 README_DISTRIBUCION.md         → Este archivo
├── 🔧 instalar-local.bat             → Script de instalación automática
├── ▶️ iniciar-sistema.bat            → Iniciar el sistema
├── ⏹️ detener-sistema.bat            → Detener el sistema
├── 💾 backup-db.bat                  → Crear respaldo de BD
├── 📂 restaurar-db.bat               → Restaurar respaldo de BD
├── 📁 BACKEND/                       → Código del servidor
├── 📁 frontend/                      → Interfaz web
└── 📁 Documentación/                 → Manuales y guías
```

---

## ⚡ Instalación Rápida (5 Pasos)

### 1️⃣ Verificar Requisitos

Antes de instalar, asegúrese de tener:

- ✅ **Windows 10/11** (64 bits)
- ✅ **Node.js 18+** → [Descargar](https://nodejs.org/)
- ✅ **PostgreSQL 13+** → [Descargar](https://www.postgresql.org/download/)
- ✅ **4 GB RAM mínimo** (8 GB recomendado)
- ✅ **20 GB espacio en disco**

### 2️⃣ Copiar el Paquete

1. Copie la carpeta completa `RESEJ` a la computadora de destino
2. Ubicación sugerida: `C:\RESEJ` o `C:\Program Files\RESEJ`

### 3️⃣ Ejecutar Instalador

1. Abra la carpeta donde copió RESEJ
2. Click derecho en `instalar-local.bat`
3. Seleccione **"Ejecutar como administrador"**
4. Siga las instrucciones en pantalla

### 4️⃣ Configurar Base de Datos

Durante la instalación se le pedirá:

- **Nombre de la base de datos:** `resej_db` (o el que prefiera)
- **Usuario PostgreSQL:** `resej_user` (o el que prefiera)
- **Contraseña:** Elija una contraseña segura

### 5️⃣ Iniciar el Sistema

1. Ejecute `iniciar-sistema.bat`
2. Espere a que se abran las ventanas del Backend y Frontend
3. El navegador se abrirá automáticamente
4. Credenciales iniciales:
   - **Usuario:** `admin`
   - **Contraseña:** `admin123`

---

## 🔧 Tres Opciones de Instalación

### Opción A: Instalación Local Simple ⭐ RECOMENDADA

**Mejor para:** Una sola dependencia con su propia base de datos.

```bash
# Ejecutar como Administrador:
instalar-local.bat
```

### Opción B: Servidor Centralizado

**Mejor para:** Múltiples dependencias conectadas a un servidor central.

1. Instalar en el servidor usando `instalar-local.bat`
2. Configurar IP estática en el servidor
3. Abrir puertos en el firewall (3001 y 3000)
4. En cada dependencia: Acceder vía navegador a `http://[IP-SERVIDOR]:3000`

Ver: `GUIA_INSTALACION_DEPENDENCIAS.md` → Opción A

### Opción C: Aplicación de Escritorio (Electron)

**Mejor para:** Instalación simple sin configuración de servidor.

1. Construir el instalador ejecutable (requiere máquina de desarrollo)
2. Distribuir el archivo `.exe`
3. Instalar en cada dependencia

Ver: `GUIA_INSTALACION_DEPENDENCIAS.md` → Opción C

---

## 📖 Documentación Incluida

| Archivo                            | Descripción                                 |
| ---------------------------------- | ------------------------------------------- |
| `REQUISITOS_SISTEMA.md`            | Requisitos de hardware y software           |
| `GUIA_INSTALACION_DEPENDENCIAS.md` | Guía completa con 3 opciones de instalación |
| `INSTALACION.md`                   | Documentación técnica general               |
| `INICIO_RAPIDO.md`                 | Guía de inicio rápido                       |
| `CONFIGURACION_PRODUCCION.md`      | Configuración para producción               |

---

## 🛠️ Scripts Útiles

### Iniciar el Sistema

```bash
iniciar-sistema.bat
```

- Inicia Backend y Frontend
- Abre automáticamente en el navegador
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5173`

### Detener el Sistema

```bash
detener-sistema.bat
```

- Detiene todos los procesos de Node.js

### Crear Respaldo

```bash
backup-db.bat
```

- Crea un respaldo completo de la base de datos
- Guarda en `C:\RESEJ-Backups\`
- Incluye fecha y hora en el nombre del archivo

### Restaurar Respaldo

```bash
restaurar-db.bat
```

- Restaura la base de datos desde un respaldo
- ⚠️ **ADVERTENCIA:** Reemplaza todos los datos actuales

---

## 🔐 Configuración de Seguridad

### Cambiar Contraseñas por Defecto

**IMPORTANTE:** Después de la instalación:

1. Inicie sesión como `admin`
2. Vaya a "Mi Perfil" → "Cambiar Contraseña"
3. Cambie la contraseña inmediatamente

### Archivo de Configuración (.env)

Ubicado en `BACKEND\.env`:

```env
# DEBE cambiar estos valores:
DB_PASSWORD=su_contraseña_segura_aqui
JWT_SECRET=genere_una_clave_aleatoria_larga_aqui

# Puede mantener estos:
DB_NAME=resej_db
DB_USER=resej_user
PORT=3001
```

**Generar JWT_SECRET seguro:**

```bash
# En Node.js:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🌐 Acceso desde Otros Equipos

### En Red Local

1. Obtener la IP del servidor:

   ```bash
   ipconfig
   # Buscar "Dirección IPv4"
   ```

2. Configurar firewall:

   ```bash
   # Ejecutar como Administrador
   netsh advfirewall firewall add rule name="RESEJ Backend" dir=in action=allow protocol=TCP localport=3001
   netsh advfirewall firewall add rule name="RESEJ Frontend" dir=in action=allow protocol=TCP localport=3000
   ```

3. Editar `frontend\.env`:

   ```env
   VITE_API_URL=http://192.168.1.XXX:3001/api
   ```

4. Desde otros equipos, acceder a:
   ```
   http://192.168.1.XXX:3000
   ```

---

## 📱 Acceso desde Celulares

Ver: `GUIA_ACCESO_CELULAR.md`

1. Conectar el celular a la misma red WiFi
2. Abrir navegador en el celular
3. Ir a: `http://[IP-DEL-SERVIDOR]:3000`

---

## 🔍 Verificación de la Instalación

### Checklist Post-Instalación

- [ ] PostgreSQL está corriendo
- [ ] Backend inicia sin errores
- [ ] Frontend se abre en el navegador
- [ ] Login funciona con usuario `admin`
- [ ] Se puede crear un nuevo registro
- [ ] Se puede subir un archivo adjunto
- [ ] Los logs se generan en `BACKEND\logs\`

### Verificación Automática

```bash
cd BACKEND
node verificar-sistema.js
```

---

## ❓ Solución de Problemas Comunes

### Error: "node is not recognized"

**Solución:** Node.js no está instalado o no está en el PATH.

1. Instalar Node.js desde https://nodejs.org/
2. Reiniciar la terminal
3. Verificar: `node --version`

### Error: "Cannot connect to database"

**Solución:** Verificar PostgreSQL.

1. Abrir "Servicios" de Windows
2. Buscar servicio de PostgreSQL
3. Asegurarse de que esté "Iniciado"
4. Verificar credenciales en `BACKEND\.env`

### Error: "Port 3001 already in use"

**Solución:** Cambiar el puerto o detener el proceso.

```bash
# Opción 1: Cambiar puerto en BACKEND\.env
PORT=3002

# Opción 2: Encontrar y terminar proceso
netstat -ano | findstr :3001
taskkill /PID [número] /F
```

### Frontend no carga

**Solución:**

```bash
cd frontend
npm run build
npm run dev
```

---

## 📞 Soporte Técnico

### Información de Contacto

- 📧 **Email:** soporte@resej.gob.ar
- ☎️ **Teléfono:** [Completar con número de contacto]
- 🕒 **Horario:** Lunes a Viernes, 8:00 - 16:00

### Antes de Contactar Soporte

Tenga a mano:

1. Versión del sistema (1.0.0)
2. Sistema operativo
3. Capturas de pantalla del error
4. Archivos de log en `BACKEND\logs\`

### Logs del Sistema

Ubicación de logs:

```
BACKEND\logs\
├── combined.log    → Todos los logs
├── error.log       → Solo errores
└── exceptions.log  → Excepciones críticas
```

---

## 🎓 Capacitación del Personal

### Materiales de Capacitación

- [ ] Manual de Usuario (próximamente)
- [ ] Videos tutoriales (próximamente)
- [ ] Guías de referencia rápida
- [ ] Sesiones de capacitación presencial

### Roles de Usuario

| Rol          | Permisos                          |
| ------------ | --------------------------------- |
| **Admin**    | Acceso total, gestión de usuarios |
| **Operador** | Crear y editar registros          |
| **Consulta** | Solo visualización                |

---

## 💾 Respaldos y Mantenimiento

### Configurar Respaldos Automáticos

1. Abrir "Programador de tareas" de Windows
2. Crear nueva tarea:
   - **Nombre:** "Respaldo RESEJ Diario"
   - **Desencadenador:** Diario a las 2:00 AM
   - **Acción:** Ejecutar `C:\RESEJ\backup-db.bat`

### Mantener el Sistema Actualizado

1. Verifique actualizaciones mensualmente
2. Aplique parches de seguridad
3. Mantenga Node.js y PostgreSQL actualizados

---

## 📋 Checklist de Distribución

### Antes de Entregar a una Dependencia

- [ ] Verificar que todos los archivos estén incluidos
- [ ] Probar instalación en ambiente limpio
- [ ] Documentación completa y actualizada
- [ ] Scripts de instalación funcionando
- [ ] Credenciales por defecto documentadas
- [ ] Información de contacto de soporte incluida
- [ ] Plan de capacitación definido

---

## 📄 Información Legal

**Nombre del Sistema:** RE.SE.J - Registro de Secuestros Judiciales  
**Versión:** 1.0.0  
**Desarrolladores:** Flavio Sanchez & Lucas Jonas Diaz  
**Organización:** Policía de Tucumán  
**Licencia:** Uso interno policial

---

## 🚀 Próximos Pasos

Después de la instalación:

1. ✅ Cambiar contraseña del admin
2. ✅ Crear usuarios para el personal
3. ✅ Configurar respaldos automáticos
4. ✅ Capacitar al personal
5. ✅ Realizar pruebas de funcionalidad
6. ✅ Documentar la configuración específica

---

**¿Necesita ayuda?**

Consulte la documentación completa en `GUIA_INSTALACION_DEPENDENCIAS.md`  
o contacte al soporte técnico.

---

**Última actualización:** 12 de noviembre de 2025  
**Versión del documento:** 1.0
