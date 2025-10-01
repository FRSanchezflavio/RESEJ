-- ========================================
-- SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS
-- RE.SE.J - Registro de Secuestros Judiciales
-- ========================================

-- Crear base de datos
CREATE DATABASE resej_db
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_AR.UTF-8'
    LC_CTYPE = 'es_AR.UTF-8'
    TEMPLATE = template0;

-- Conectarse a la base de datos
\c resej_db

-- Crear usuario con privilegios
CREATE USER resej_user WITH PASSWORD 'cambiar_este_password';

-- Otorgar privilegios
GRANT ALL PRIVILEGES ON DATABASE resej_db TO resej_user;
GRANT ALL ON SCHEMA public TO resej_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO resej_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO resej_user;

-- Configurar búsqueda de texto completo para español
CREATE TEXT SEARCH CONFIGURATION spanish_unaccent ( COPY = spanish );
ALTER TEXT SEARCH CONFIGURATION spanish_unaccent
    ALTER MAPPING FOR hword, hword_part, word WITH unaccent, spanish_stem;

-- Crear extensión para búsquedas sin acentos (opcional)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Verificar configuración
\l resej_db
\du resej_user

-- Mensaje final
\echo '✅ Base de datos configurada correctamente'
\echo ''
\echo 'Próximos pasos:'
\echo '1. Ejecutar migraciones: npm run migrate:latest'
\echo '2. Crear usuario admin: npm run seed:run'
\echo '3. Iniciar servidor: npm run dev'
