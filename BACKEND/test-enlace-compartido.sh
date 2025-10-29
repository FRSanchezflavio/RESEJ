#!/bin/bash

# Script de prueba para enlaces compartidos
echo "=========================================="
echo "Test: Enlaces Compartidos RE.SE.J"
echo "=========================================="
echo ""

# Paso 1: Login
echo "1. Haciendo login como administrador..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","password":"Admin2025!"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Error: No se pudo obtener el token de autenticación"
  echo "Respuesta: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login exitoso - Token obtenido"
echo ""

# Paso 2: Crear enlace compartido
echo "2. Creando enlace compartido..."
CREATE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/enlaces-compartidos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Enlace de prueba desde script",
    "duracion_horas": 24,
    "max_accesos": 5
  }')

ENLACE_TOKEN=$(echo "$CREATE_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ENLACE_TOKEN" ]; then
  echo "❌ Error: No se pudo crear el enlace"
  echo "Respuesta: $CREATE_RESPONSE"
  exit 1
fi

echo "✅ Enlace creado exitosamente"
echo "   Token: $ENLACE_TOKEN"
echo ""

# Paso 3: Acceder al enlace público
echo "3. Accediendo al enlace público..."
PUBLIC_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/public/enlaces/$ENLACE_TOKEN/acceso" \
  -H "Content-Type: application/json")

PUBLIC_TOKEN=$(echo "$PUBLIC_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$PUBLIC_TOKEN" ]; then
  echo "❌ Error: No se pudo acceder al enlace público"
  echo "Respuesta: $PUBLIC_RESPONSE"
  exit 1
fi

echo "✅ Acceso público exitoso"
echo ""

# Mostrar resumen
echo "=========================================="
echo "✅ TODAS LAS PRUEBAS PASARON"
echo "=========================================="
echo ""
echo "📋 Información del enlace:"
echo "   Token: $ENLACE_TOKEN"
echo "   URL frontend: http://localhost:5173/enlace/$ENLACE_TOKEN"
echo "   Descripción: Enlace de prueba desde script"
echo "   Duración: 24 horas"
echo "   Máx. accesos: 5"
echo ""
echo "🔗 Puedes abrir este enlace en tu navegador:"
echo "   http://localhost:5173/enlace/$ENLACE_TOKEN"
echo ""
