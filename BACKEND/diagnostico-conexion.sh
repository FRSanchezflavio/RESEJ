#!/bin/bash

# Script de diagnóstico de conexión RE.SE.J
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Diagnóstico de Conexión RE.SE.J"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Verificar que el backend esté corriendo
echo "1️⃣  Verificando si el backend está corriendo..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "   ✅ Backend responde en http://localhost:3000"
    BACKEND_STATUS=$(curl -s http://localhost:3000/health | grep -o '"status":"[^"]*' | cut -d'"' -f4)
    echo "   📊 Estado: $BACKEND_STATUS"
else
    echo "   ❌ Backend NO responde en http://localhost:3000"
    echo "   💡 Solución: Ejecuta 'cd BACKEND && node server.js'"
    exit 1
fi
echo ""

# 2. Verificar configuración del frontend
echo "2️⃣  Verificando configuración del frontend..."
if [ -f "../frontend/.env" ]; then
    echo "   ✅ Archivo .env encontrado"
    API_URL=$(grep VITE_API_URL ../frontend/.env | cut -d'=' -f2)
    echo "   📋 VITE_API_URL=$API_URL"
else
    echo "   ⚠️  Archivo .env NO encontrado"
    echo "   💡 Solución: Crea frontend/.env con:"
    echo "      VITE_API_URL=http://localhost:3000/api"
fi
echo ""

# 3. Verificar CORS
echo "3️⃣  Verificando configuración CORS..."
if [ -f ".env" ]; then
    ALLOWED_ORIGINS=$(grep ALLOWED_ORIGINS .env | cut -d'=' -f2)
    echo "   📋 ALLOWED_ORIGINS=$ALLOWED_ORIGINS"
    
    if echo "$ALLOWED_ORIGINS" | grep -q "localhost:5173"; then
        echo "   ✅ localhost:5173 está permitido"
    else
        echo "   ⚠️  localhost:5173 NO está en ALLOWED_ORIGINS"
        echo "   💡 Agrega: http://localhost:5173"
    fi
else
    echo "   ❌ Archivo .env NO encontrado en BACKEND"
fi
echo ""

# 4. Obtener interfaces de red
echo "4️⃣  Interfaces de red disponibles:"
if command -v ipconfig > /dev/null 2>&1; then
    # Windows
    ipconfig | grep "IPv4" | grep -v "127.0.0.1"
elif command -v ifconfig > /dev/null 2>&1; then
    # Linux/Mac
    ifconfig | grep "inet " | grep -v "127.0.0.1"
fi
echo ""

# 5. Verificar puerto 3000
echo "5️⃣  Verificando puerto 3000..."
if netstat -an 2>/dev/null | grep -q ":3000.*LISTEN"; then
    echo "   ✅ Puerto 3000 está en uso (backend corriendo)"
else
    echo "   ⚠️  Puerto 3000 NO está en uso"
    echo "   💡 El backend podría no estar corriendo"
fi
echo ""

# 6. Probar endpoint de login
echo "6️⃣  Probando endpoint de autenticación..."
LOGIN_TEST=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","password":"Admin2025!"}' 2>&1)

if echo "$LOGIN_TEST" | grep -q '"success":true'; then
    echo "   ✅ Endpoint de login funciona correctamente"
    TOKEN=$(echo "$LOGIN_TEST" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    echo "   🔑 Token obtenido: ${TOKEN:0:50}..."
else
    echo "   ⚠️  Endpoint de login no responde como esperado"
    echo "   📋 Respuesta: ${LOGIN_TEST:0:100}..."
fi
echo ""

# 7. Probar endpoint de enlaces
echo "7️⃣  Probando endpoint de enlaces compartidos..."
if [ ! -z "$TOKEN" ]; then
    ENLACES_TEST=$(curl -s -X GET "http://localhost:3000/api/enlaces-compartidos?page=1&limit=1" \
      -H "Authorization: Bearer $TOKEN" 2>&1)
    
    if echo "$ENLACES_TEST" | grep -q '"success":true'; then
        echo "   ✅ Endpoint de enlaces funciona correctamente"
    else
        echo "   ⚠️  Endpoint de enlaces no responde como esperado"
        echo "   📋 Respuesta: ${ENLACES_TEST:0:100}..."
    fi
else
    echo "   ⏭️  Saltando prueba (no hay token disponible)"
fi
echo ""

# Resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 URLs para configurar el frontend:"
echo "   Local:  http://localhost:3000/api"
echo ""
echo "💡 Siguiente paso:"
echo "   1. Crea/edita frontend/.env:"
echo "      VITE_API_URL=http://localhost:3000/api"
echo "   2. Reinicia el frontend:"
echo "      cd frontend && npm run dev"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
