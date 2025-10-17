-- ========================================
-- SCRIPT: Configurar usuario resej_user
-- ========================================
-- Conéctate como superusuario (postgres) para ejecutar este script
-- psql -h localhost -U postgres

-- Crear rol si no existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'resej_user') THEN
    CREATE ROLE resej_user LOGIN PASSWORD '3010';
    RAISE NOTICE 'Rol resej_user creado';
  ELSE
    RAISE NOTICE 'Rol resej_user ya existe, actualizando contraseña...';
    ALTER ROLE resej_user WITH LOGIN PASSWORD '3010';
  END IF;
END$$;

-- Crear base de datos si no existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'resej_db') THEN
    CREATE DATABASE resej_db OWNER resej_user;
    RAISE NOTICE 'Base de datos resej_db creada';
  ELSE
    RAISE NOTICE 'Base de datos resej_db ya existe';
  END IF;
END$$;

-- Conectar a resej_db y dar permisos al usuario
\c resej_db

-- Permisos en la base de datos
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO resej_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO resej_user;
GRANT ALL PRIVILEGES ON DATABASE resej_db TO resej_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO resej_user;
GRANT CREATE ON SCHEMA public TO resej_user;

-- Dar permisos sobre tablas existentes (si las hay)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO resej_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO resej_user;

RAISE NOTICE 'Todos los permisos han sido configurados correctamente para resej_user';
