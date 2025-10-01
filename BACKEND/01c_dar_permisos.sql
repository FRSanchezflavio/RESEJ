-- ========================================
-- PASO 1C: DAR PERMISOS AL USUARIO
-- ========================================
-- Ejecutar DESPUÉS de crear la base de datos
-- 
-- INSTRUCCIONES EN pgAdmin:
-- 1. Selecciona SOLO la línea 9
-- 2. Ejecuta solo esa línea (F5 o botón ▶️)
-- ========================================

GRANT ALL PRIVILEGES ON DATABASE resej_db TO usuario;

-- ========================================
-- ✅ USUARIO Y BASE DE DATOS CREADOS
-- ========================================
-- Usuario: usuario
-- Contraseña: pass
-- Base de datos: resej_db
-- 
-- SIGUIENTE PASO:
-- 1. Haz clic derecho en "Databases" -> Refresh (F5)
-- 2. Deberías ver "resej_db" en la lista
-- 3. Clic derecho en "resej_db" -> Query Tool
-- 4. Abrir y ejecutar: 02_configurar_permisos.sql
-- ========================================