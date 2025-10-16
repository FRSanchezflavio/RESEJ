-- ========================================
-- VERIFICAR Y CREAR USUARIO DE BASE DE DATOS
-- ========================================
-- Este script verifica si el usuario existe y lo crea si es necesario

-- Opción 1: Si el usuario resej_user NO existe, ejecuta esto:
-- (Ejecutar SOLO si obtienes error de que el usuario no existe)

CREATE USER resej_user WITH PASSWORD '30101995';
GRANT ALL PRIVILEGES ON DATABASE resej_db TO resej_user;

-- Opción 2: Si el usuario YA existe pero la contraseña es incorrecta:
-- (Ejecutar SOLO si el usuario existe pero la contraseña no coincide)

ALTER USER resej_user WITH PASSWORD '30101995';

-- Opción 3: Si prefieres usar el usuario "usuario" que creamos antes:
-- (Actualiza el .env con DB_USER=usuario y DB_PASSWORD=pass)
-- No ejecutes nada aquí, solo edita el .env

-- ========================================
-- VERIFICAR USUARIO ACTUAL
-- ========================================
-- Para ver qué usuarios existen, ejecuta:
-- \du
-- o:
SELECT usename FROM pg_user WHERE usename IN ('resej_user', 'usuario');

-- ========================================
-- DAR PERMISOS AL USUARIO EN LA BD
-- ========================================
-- Conectarse a resej_db primero: \c resej_db
-- Luego ejecutar:

GRANT ALL ON SCHEMA public TO resej_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO resej_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO resej_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO resej_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO resej_user;
