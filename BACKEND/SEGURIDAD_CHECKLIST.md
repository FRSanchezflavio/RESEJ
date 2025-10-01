# Checklist de Seguridad

## RE.SE.J - Registro de Secuestros Judiciales

---

## 🔐 Pre-Despliegue

### Configuración de Credenciales

- [ ] Cambiar contraseña por defecto del usuario `admin`
- [ ] Generar secretos JWT únicos y seguros (64+ caracteres)
- [ ] Usar contraseña segura para PostgreSQL
- [ ] Verificar que `.env` no está en Git (`.gitignore`)
- [ ] Configurar variables de entorno de producción
- [ ] Eliminar credenciales de prueba/desarrollo

### Base de Datos

- [ ] PostgreSQL configurado en red local únicamente
- [ ] Usuario de BD con permisos mínimos necesarios
- [ ] Conexión a BD usa contraseña fuerte
- [ ] `pg_hba.conf` limita conexiones por IP
- [ ] Backup automático configurado
- [ ] Logs de PostgreSQL habilitados

### Aplicación

- [ ] `NODE_ENV=production` en producción
- [ ] Rate limiting configurado apropiadamente
- [ ] CORS configurado solo para dominios autorizados
- [ ] Helmet configurado para headers de seguridad
- [ ] Logs de auditoría funcionando
- [ ] Validación de archivos con magic bytes
- [ ] Tamaño máximo de archivos configurado

---

## 🌐 Red y Firewall

### Firewall

- [ ] Solo puerto necesario abierto (3000 o configurado)
- [ ] PostgreSQL (5432) **NO** accesible desde internet
- [ ] Firewall de servidor configurado (UFW/Windows Firewall)
- [ ] Reglas de entrada/salida documentadas

### Red

- [ ] Backend en red interna/privada
- [ ] Frontend y backend en misma red o VPN
- [ ] Sin exposición directa a internet (usar reverse proxy)
- [ ] Nginx/Apache configurado como proxy inverso
- [ ] HTTPS configurado con certificado válido
- [ ] Redireccionamiento HTTP → HTTPS

---

## 🔒 HTTPS y Certificados

- [ ] Certificado SSL/TLS instalado
- [ ] Certificado de entidad confiable (Let's Encrypt)
- [ ] Renovación automática de certificados configurada
- [ ] Solo TLS 1.2 y 1.3 habilitados
- [ ] Cipher suites seguros configurados
- [ ] HSTS header configurado

---

## 👤 Control de Acceso

### Autenticación

- [ ] JWT con expiración configurada (24h access, 7d refresh)
- [ ] Refresh tokens almacenados en BD
- [ ] Tokens revocables implementado
- [ ] Logout invalida tokens
- [ ] Rate limiting en login (5 intentos / 15 min)
- [ ] Passwords hasheados con bcrypt (12 rounds mínimo)

### Autorización

- [ ] Roles implementados correctamente
- [ ] Middleware de autorización en todas las rutas protegidas
- [ ] Rutas públicas mínimas (solo login y health)
- [ ] Verificación de permisos en cada endpoint
- [ ] Admin no puede auto-desactivarse

### Gestión de Usuarios

- [ ] Política de contraseñas fuertes implementada
- [ ] Sistema de reset de contraseña seguro
- [ ] Desactivación de usuarios en lugar de eliminación
- [ ] Historial de accesos registrado
- [ ] Últimos accesos visibles

---

## 📁 Manejo de Archivos

- [ ] Validación de tipo MIME
- [ ] Validación magic bytes implementada
- [ ] Solo formatos permitidos aceptados (PDF, JPEG, PNG)
- [ ] Tamaño máximo de archivo configurado (5MB)
- [ ] Archivos almacenados con nombres UUID
- [ ] Directorio `uploads/` con permisos restrictivos
- [ ] Rate limiting en uploads (5 uploads / min)
- [ ] Prevención de path traversal

---

## 📊 Logging y Auditoría

### Logs de Aplicación

- [ ] Winston configurado correctamente
- [ ] Logs de error separados
- [ ] Rotación de logs configurada
- [ ] Nivel de log apropiado (warn/error en prod)
- [ ] Logs no contienen información sensible
- [ ] Directorio `logs/` con permisos restrictivos

### Logs de Auditoría

- [ ] Tabla `logs_auditoria` creada
- [ ] Middleware `auditLogger` en rutas críticas
- [ ] Acciones CRUD registradas
- [ ] Login/logout registrados
- [ ] Cambios de permisos registrados
- [ ] IP de usuario registrada

---

## 🛡️ Prevención de Ataques

### Inyección SQL

- [ ] Knex/ORM usado en todas las queries
- [ ] Sin concatenación de strings en queries
- [ ] Validación de inputs con express-validator
- [ ] Parametrización de todas las queries

### XSS (Cross-Site Scripting)

- [ ] Sanitización de inputs
- [ ] Headers de seguridad con Helmet
- [ ] Content-Type correcto en respuestas
- [ ] JSON parsing seguro

### CSRF (Cross-Site Request Forgery)

- [ ] CORS configurado restrictivamente
- [ ] Solo orígenes autorizados
- [ ] SameSite cookies (si se usan)

### Rate Limiting

- [ ] Rate limiter general (100 req / 15 min)
- [ ] Rate limiter específico para login
- [ ] Rate limiter para creación de recursos
- [ ] Rate limiter para uploads

### DDoS

- [ ] Rate limiting configurado
- [ ] Nginx configurado con límites
- [ ] Firewall con protección DDoS (opcional)

---

## 🔄 Backups y Recuperación

### Backups

- [ ] Script de backup automatizado creado
- [ ] Backup diario configurado (cron/task scheduler)
- [ ] Backups almacenados en ubicación segura
- [ ] Backup comprimido y cifrado
- [ ] Retención de backups configurada (30 días)
- [ ] Backup de archivos adjuntos incluido

### Recuperación

- [ ] Procedimiento de restauración documentado
- [ ] Backup restaurado y probado
- [ ] Plan de recuperación ante desastres definido
- [ ] RTO y RPO definidos

---

## 🔍 Monitoreo

### Sistema

- [ ] Monitoreo de CPU y RAM
- [ ] Monitoreo de espacio en disco
- [ ] Monitoreo de red
- [ ] Alertas configuradas para umbrales

### Aplicación

- [ ] Health check endpoint verificado
- [ ] Logs revisados periódicamente
- [ ] Logs de auditoría revisados semanalmente
- [ ] Conexiones a BD monitoreadas
- [ ] Errores 500 monitoreados

### Base de Datos

- [ ] Conexiones activas monitoreadas
- [ ] Tamaño de BD monitoreado
- [ ] Queries lentas identificadas
- [ ] Índices optimizados

---

## 🧹 Mantenimiento

### Regular (Semanal)

- [ ] Revisar logs de error
- [ ] Revisar logs de auditoría
- [ ] Limpiar tokens expirados
- [ ] Verificar espacio en disco

### Mensual

- [ ] Limpiar archivos huérfanos
- [ ] Revisar usuarios activos
- [ ] Verificar backups
- [ ] Actualizar dependencias con vulnerabilidades

### Trimestral

- [ ] Auditoría de seguridad completa
- [ ] Revisión de permisos de usuarios
- [ ] Análisis de logs de auditoría
- [ ] Prueba de restauración de backup
- [ ] Revisión de políticas de acceso

---

## 🚨 Respuesta a Incidentes

### Preparación

- [ ] Plan de respuesta a incidentes documentado
- [ ] Contactos de emergencia definidos
- [ ] Procedimiento de escalamiento definido
- [ ] Herramientas de análisis forense disponibles

### Detección

- [ ] Sistema de detección de intrusiones (opcional)
- [ ] Monitoreo de intentos de login fallidos
- [ ] Alertas de actividad sospechosa
- [ ] Revisión periódica de logs

### Contención

- [ ] Procedimiento para deshabilitar usuarios
- [ ] Procedimiento para revocar tokens
- [ ] Procedimiento para aislar servidor
- [ ] Backup de emergencia disponible

---

## 📋 Cumplimiento

### Normativa

- [ ] Cumple con ley de protección de datos personales
- [ ] Políticas de privacidad definidas
- [ ] Consentimiento de usuarios documentado (si aplica)
- [ ] Procedimiento de eliminación de datos definido

### Documentación

- [ ] Arquitectura del sistema documentada
- [ ] Flujos de datos documentados
- [ ] Políticas de seguridad documentadas
- [ ] Procedimientos operativos documentados

---

## ✅ Post-Despliegue

### Verificación Inmediata

- [ ] Health check responde correctamente
- [ ] Login funciona correctamente
- [ ] Todas las rutas principales funcionan
- [ ] Logs se están generando
- [ ] Auditoría registrando acciones
- [ ] Archivos se pueden subir y descargar

### Primera Semana

- [ ] Revisar logs diariamente
- [ ] Monitorear rendimiento
- [ ] Verificar backups automáticos
- [ ] Revisar logs de auditoría
- [ ] Verificar uso de recursos (CPU/RAM/Disco)

### Primer Mes

- [ ] Auditoría de seguridad
- [ ] Revisión de usuarios creados
- [ ] Análisis de logs de auditoría
- [ ] Verificar integridad de backups
- [ ] Ajustar límites si es necesario

---

## 🎯 Niveles de Seguridad

### Nivel Básico ⚠️

- Contraseñas seguras
- Firewall configurado
- Backups manuales
- Logs básicos

### Nivel Medio ✅

- Todo lo anterior +
- HTTPS configurado
- Backups automáticos
- Rate limiting
- Logs de auditoría
- Monitoreo básico

### Nivel Alto 🔒

- Todo lo anterior +
- IDS/IPS (Intrusion Detection/Prevention)
- Backups cifrados offsite
- Monitoreo avanzado con alertas
- Auditorías de seguridad regulares
- Plan de recuperación probado
- Análisis forense preparado

---

## 📞 Contactos de Seguridad

- **Responsable de Seguridad:** [Nombre]
- **Email de Seguridad:** seguridad@policia.tucuman.gob.ar
- **Teléfono de Emergencia:** [Número]
- **Escalamiento:** [Procedimiento]

---

## 📝 Registro de Revisiones

| Fecha      | Revisor  | Resultado | Observaciones         |
| ---------- | -------- | --------- | --------------------- |
| 2025-01-10 | [Nombre] | ✅        | Configuración inicial |
|            |          |           |                       |

---

## 🔄 Actualizaciones de este Checklist

Este checklist debe revisarse y actualizarse:

- Al implementar nuevas funcionalidades
- Después de incidentes de seguridad
- Al menos una vez al año
- Cuando cambien normativas o regulaciones

---

**Última actualización:** Enero 2025

**Próxima revisión:** Julio 2025
