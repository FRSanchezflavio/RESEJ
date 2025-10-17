#!/bin/bash
# ========================================
# SCRIPT: Configurar PostgreSQL y Backend
# ========================================

echo "🔧 Iniciando configuración de PostgreSQL..."

# Paso 1: Conectar como superusuario y ejecutar el script de setup
echo "📝 Ejecutando script de configuración de usuario..."
psql -h localhost -U postgres -f setup_user.sql

if [ $? -ne 0 ]; then
    echo "❌ Error: No se pudo conectar como superusuario (postgres)"
    echo "💡 Solución: Asegúrate que PostgreSQL esté corriendo e intenta manualmente:"
    echo "   psql -h localhost -U postgres -f setup_user.sql"
    exit 1
fi

echo "✅ Usuario y permisos configurados"

# Paso 2: Ejecutar migraciones
echo ""
echo "🚀 Ejecutando migraciones..."
npm run migrate:latest

if [ $? -ne 0 ]; then
    echo "❌ Error: Las migraciones fallaron"
    exit 1
fi

echo "✅ Migraciones completadas"

# Paso 3: Ejecutar seeds (opcional)
echo ""
echo "🌱 Ejecutando seeds..."
npm run seed:run

if [ $? -ne 0 ]; then
    echo "⚠️  Las seeds fallaron (esto es opcional)"
fi

echo ""
echo "✅ Configuración completada exitosamente"
echo "🚀 Para iniciar el servidor, ejecuta: npm start"
