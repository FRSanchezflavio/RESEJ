-- ========================================
-- PASO 2: CONFIGURAR PERMISOS EN EL ESQUEMA
-- ========================================
-- IMPORTANTE: Ejecutar este archivo CONECTADO a la base de datos resej_db
-- En pgAdmin: 
--   1. Clic derecho en resej_db -> Query Tool
--   2. Abrir este archivo -> Ejecutar (F5)

-- Dar permisos en el esquema public
GRANT ALL ON SCHEMA public TO usuario;

-- Dar permisos en todas las tablas existentes
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO usuario;

-- Dar permisos en todas las secuencias existentes
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO usuario;

-- Configurar permisos por defecto para tablas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON TABLES TO usuario;

-- Configurar permisos por defecto para secuencias futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON SEQUENCES TO usuario;

-- ========================================
-- ✅ PERMISOS CONFIGURADOS CORRECTAMENTE
-- ========================================
-- El usuario "usuario" ahora tiene todos los permisos en resej_db
-- 
-- SIGUIENTE PASO: Volver a VS Code y ejecutar en la terminal:
--   npm run migrate:latest
--   npm run seed:run
--   npm run dev
-- ========================================
