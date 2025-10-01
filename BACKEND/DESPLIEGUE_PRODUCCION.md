# Guía de Despliegue en Producción

## RE.SE.J - Registro de Secuestros Judiciales

---

## 📋 Pre-requisitos

- **Servidor**: Windows Server 2019+ o Linux (Ubuntu 20.04+)
- **Node.js**: v18 LTS o superior
- **PostgreSQL**: v14 o superior
- **RAM**: Mínimo 4GB
- **Disco**: Mínimo 20GB disponibles
- **Red**: Puerto 3000 (o el configurado) accesible

---

## 🔒 1. Preparación del Entorno

### 1.1. Actualizar Sistema Operativo

**Windows Server:**

```powershell
# Verificar actualizaciones de Windows
Windows Update > Buscar actualizaciones
```

**Linux:**

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2. Instalar Node.js

**Windows:**

- Descargar desde [nodejs.org](https://nodejs.org)
- Instalar versión LTS (18.x)

**Linux:**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Verificar
```

### 1.3. Instalar PostgreSQL

**Windows:**

- Descargar desde [postgresql.org](https://www.postgresql.org/download/windows/)
- Instalar PostgreSQL 14+

**Linux:**

```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## 🗄️ 2. Configuración de Base de Datos

### 2.1. Acceder a PostgreSQL

**Windows:**

```cmd
psql -U postgres
```

**Linux:**

```bash
sudo -u postgres psql
```

### 2.2. Ejecutar Script de Configuración

```sql
-- Crear base de datos y usuario
\i setup_database.sql
```

**O manualmente:**

```sql
-- Crear base de datos
CREATE DATABASE resej_db ENCODING 'UTF8';

-- Crear usuario
CREATE USER resej_user WITH PASSWORD 'PASSWORD_SEGURO_AQUI';

-- Otorgar privilegios
GRANT ALL PRIVILEGES ON DATABASE resej_db TO resej_user;
```

### 2.3. Configurar PostgreSQL para Producción

Editar `postgresql.conf`:

```ini
# Conexiones
max_connections = 100
shared_buffers = 256MB

# Logging
log_destination = 'stderr'
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d.log'
log_rotation_age = 1d
log_rotation_size = 100MB
log_min_duration_statement = 1000

# Performance
effective_cache_size = 1GB
maintenance_work_mem = 128MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

Editar `pg_hba.conf`:

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   resej_db        resej_user                              md5
host    resej_db        resej_user      127.0.0.1/32            md5
```

Reiniciar PostgreSQL:

**Windows:**

```cmd
net stop postgresql-x64-14
net start postgresql-x64-14
```

**Linux:**

```bash
sudo systemctl restart postgresql
```

---

## 📦 3. Despliegue de la Aplicación

### 3.1. Crear Usuario para la Aplicación

**Linux (recomendado):**

```bash
sudo adduser --system --group --home /opt/resej resej
sudo mkdir -p /opt/resej
sudo chown resej:resej /opt/resej
```

### 3.2. Clonar/Copiar Código

**Desde Git:**

```bash
cd /opt/resej
git clone <repositorio> backend
cd backend
```

**Desde archivo ZIP:**

```bash
# Copiar archivo ZIP al servidor
unzip backend.zip -d /opt/resej/backend
cd /opt/resej/backend
```

### 3.3. Instalar Dependencias

```bash
npm ci --only=production
```

> **Nota:** `npm ci` es más rápido y determinista que `npm install` en producción.

### 3.4. Configurar Variables de Entorno

```bash
cp .env.example .env
nano .env  # o vim .env
```

**Configuración mínima de producción:**

```env
NODE_ENV=production
PORT=3000

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resej_db
DB_USER=resej_user
DB_PASSWORD=PASSWORD_SEGURO_AQUI

# JWT - GENERAR SECRETOS ÚNICOS Y SEGUROS
JWT_ACCESS_SECRET=SECRETO_ALEATORIO_LARGO_ACCESS_64_CARACTERES
JWT_REFRESH_SECRET=SECRETO_ALEATORIO_LARGO_REFRESH_64_CARACTERES
JWT_ACCESS_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS - IP/Dominio del frontend
CORS_ORIGIN=http://IP_SERVIDOR_FRONTEND

# Seguridad
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logs
LOG_LEVEL=warn
LOG_DIR=/opt/resej/logs
```

**Generar secretos seguros:**

**Linux/Mac:**

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Windows PowerShell:**

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3.5. Crear Directorios Necesarios

```bash
mkdir -p uploads logs
chmod 755 uploads logs
```

### 3.6. Ejecutar Migraciones

```bash
npm run migrate:latest
```

### 3.7. Crear Usuario Administrador

```bash
npm run seed:run
```

> **⚠️ IMPORTANTE:** Cambiar la contraseña del admin después del primer login.

---

## 🚀 4. Configurar Servicio Systemd (Linux)

### 4.1. Crear Archivo de Servicio

```bash
sudo nano /etc/systemd/system/resej-backend.service
```

Contenido:

```ini
[Unit]
Description=RE.SE.J Backend - Sistema de Registro de Secuestros
Documentation=https://github.com/tu-repo/resej
After=network.target postgresql.service

[Service]
Type=simple
User=resej
Group=resej
WorkingDirectory=/opt/resej/backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=resej-backend

# Variables de entorno
Environment=NODE_ENV=production
EnvironmentFile=/opt/resej/backend/.env

# Límites de recursos
LimitNOFILE=65536
LimitNPROC=4096

# Seguridad
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/resej/backend/uploads /opt/resej/backend/logs

[Install]
WantedBy=multi-user.target
```

### 4.2. Habilitar e Iniciar Servicio

```bash
sudo systemctl daemon-reload
sudo systemctl enable resej-backend
sudo systemctl start resej-backend
```

### 4.3. Verificar Estado

```bash
sudo systemctl status resej-backend
sudo journalctl -u resej-backend -f
```

---

## 🪟 5. Configurar Servicio Windows

### 5.1. Instalar PM2

```cmd
npm install -g pm2
npm install -g pm2-windows-service
```

### 5.2. Configurar PM2

```cmd
cd C:\resej\backend
pm2 start server.js --name resej-backend
pm2 save
```

### 5.3. Instalar como Servicio de Windows

```cmd
pm2-service-install
pm2 resurrect
```

---

## 🔐 6. Configurar Firewall

### Windows Firewall

```powershell
New-NetFirewallRule -DisplayName "RE.SE.J Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### Linux UFW

```bash
sudo ufw allow 3000/tcp
sudo ufw enable
sudo ufw status
```

---

## 🌐 7. Configurar Nginx como Reverse Proxy (Opcional pero Recomendado)

### 7.1. Instalar Nginx

**Ubuntu:**

```bash
sudo apt install nginx -y
```

### 7.2. Configurar Virtual Host

```bash
sudo nano /etc/nginx/sites-available/resej-backend
```

Contenido:

```nginx
upstream resej_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name resej.policia.tucuman.gob.ar;  # Ajustar dominio

    # Logs
    access_log /var/log/nginx/resej-access.log;
    error_log /var/log/nginx/resej-error.log;

    # Proxy settings
    location / {
        proxy_pass http://resej_backend;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Buffers
        proxy_buffering off;
        proxy_request_buffering off;
    }

    # Archivos estáticos
    location /uploads/ {
        alias /opt/resej/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        proxy_pass http://resej_backend/health;
        access_log off;
    }

    # Límites de tamaño de archivos (5MB)
    client_max_body_size 5M;
}
```

### 7.3. Habilitar Sitio

```bash
sudo ln -s /etc/nginx/sites-available/resej-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 8. Configurar HTTPS con Let's Encrypt (Opcional pero Recomendado)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d resej.policia.tucuman.gob.ar
```

---

## 📊 9. Configurar Monitoreo

### 9.1. Logs de Aplicación

```bash
# Ver logs en tiempo real
tail -f /opt/resej/backend/logs/combined.log
tail -f /opt/resej/backend/logs/error.log
```

### 9.2. Logs de Sistema

```bash
# Logs del servicio
sudo journalctl -u resej-backend -f

# Logs de Nginx
sudo tail -f /var/log/nginx/resej-access.log
sudo tail -f /var/log/nginx/resej-error.log
```

### 9.3. Configurar Rotación de Logs

```bash
sudo nano /etc/logrotate.d/resej-backend
```

Contenido:

```
/opt/resej/backend/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 resej resej
    sharedscripts
    postrotate
        systemctl reload resej-backend > /dev/null 2>&1 || true
    endscript
}
```

---

## 🔄 10. Backups Automatizados

### 10.1. Script de Backup de Base de Datos

```bash
sudo nano /opt/resej/backup-db.sh
```

Contenido:

```bash
#!/bin/bash
BACKUP_DIR="/opt/resej/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/resej_db_$DATE.sql.gz"

mkdir -p $BACKUP_DIR

pg_dump -h localhost -U resej_user resej_db | gzip > $BACKUP_FILE

# Mantener solo backups de los últimos 30 días
find $BACKUP_DIR -name "resej_db_*.sql.gz" -mtime +30 -delete

echo "Backup completado: $BACKUP_FILE"
```

```bash
chmod +x /opt/resej/backup-db.sh
```

### 10.2. Configurar Cron para Backups Diarios

```bash
sudo crontab -e
```

Agregar:

```
# Backup diario a las 2:00 AM
0 2 * * * /opt/resej/backup-db.sh >> /opt/resej/logs/backup.log 2>&1
```

---

## 🧪 11. Verificación Post-Despliegue

### 11.1. Health Check

```bash
curl http://localhost:3000/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "timestamp": "2025-01-10T...",
  "database": "connected"
}
```

### 11.2. Verificar Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","password":"Admin2025!"}'
```

### 11.3. Lista de Verificación

- [ ] Base de datos creada y configurada
- [ ] Migraciones ejecutadas correctamente
- [ ] Usuario admin creado
- [ ] Servicio systemd/Windows funcionando
- [ ] Firewall configurado
- [ ] Nginx configurado (si aplica)
- [ ] HTTPS configurado (si aplica)
- [ ] Logs funcionando correctamente
- [ ] Backups automatizados configurados
- [ ] Variables de entorno de producción configuradas
- [ ] Contraseña de admin cambiada

---

## 🔧 12. Mantenimiento

### 12.1. Actualizar Aplicación

```bash
cd /opt/resej/backend
sudo systemctl stop resej-backend
git pull origin main  # o copiar nuevos archivos
npm ci --only=production
npm run migrate:latest  # si hay nuevas migraciones
sudo systemctl start resej-backend
sudo systemctl status resej-backend
```

### 12.2. Verificar Estado

```bash
# Estado del servicio
sudo systemctl status resej-backend

# Uso de recursos
htop
df -h

# Conexiones de base de datos
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity WHERE datname='resej_db';"
```

### 12.3. Limpiar Archivos Temporales

```bash
# Limpiar tokens expirados (ejecutar periódicamente)
npm run cleanup-tokens

# Limpiar archivos huérfanos
npm run cleanup-files
```

---

## 🚨 13. Solución de Problemas

### Servicio no inicia

```bash
# Ver logs detallados
sudo journalctl -u resej-backend -n 100 --no-pager

# Verificar permisos
ls -la /opt/resej/backend

# Verificar puerto disponible
sudo netstat -tlnp | grep 3000
```

### Error de conexión a BD

```bash
# Verificar PostgreSQL
sudo systemctl status postgresql

# Probar conexión
psql -h localhost -U resej_user -d resej_db

# Verificar configuración
cat /opt/resej/backend/.env | grep DB_
```

### Alto uso de memoria

```bash
# Reiniciar servicio
sudo systemctl restart resej-backend

# Verificar logs de errores
tail -100 /opt/resej/backend/logs/error.log
```

---

## 📞 14. Contacto y Soporte

Para problemas técnicos o consultas:

- **Email**: soporte-ti@policia.tucuman.gob.ar
- **Documentación**: Consultar README.md y API_EXAMPLES.md

---

## 📄 Licencia

Este sistema es propiedad de la Policía de Tucumán.
Uso restringido y confidencial.

---

**Última actualización:** Enero 2025
