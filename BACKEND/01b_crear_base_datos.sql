-- ========================================
-- PASO 1B: CREAR BASE DE DATOS
-- ========================================
-- IMPORTANTE: Ejecutar este comando SOLO después de crear el usuario
-- 
-- INSTRUCCIONES EN pgAdmin:
-- 1. Selecciona SOLO las líneas 9-13 (el comando CREATE DATABASE completo)
-- 2. Ejecuta solo esas líneas (F5 o botón ▶️)
-- ========================================

CREATE DATABASE resej_db 
    OWNER usuario
    ENCODING 'UTF8'
    LC_COLLATE = 'Spanish_Spain.1252'
    LC_CTYPE = 'Spanish_Spain.1252'
    TEMPLATE = template0;

-- ========================================
-- ✅ Si ves "CREATE DATABASE", continúa al siguiente paso
-- ========================================