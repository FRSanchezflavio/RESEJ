#!/bin/bash

echo "======================================"
echo "🧪 PRUEBA DE API - RE.SE.J BACKEND"
echo "======================================"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # Sin color

# Variables
BASE_URL="http://localhost:3000/api"
TOKEN=""

echo "📡 Probando endpoint: POST /auth/login"
echo "--------------------------------------"

LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","password":"Admin2025!"}')

echo "$LOGIN_RESPONSE" | jq . 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Extraer token
if command -v jq &> /dev/null; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken' 2>/dev/null)
else
    # Extraer token sin jq
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
fi

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✓ Login exitoso${NC}"
    echo "Token: ${TOKEN:0:50}..."
    echo ""
    
    # Probar endpoint protegido
    echo "📡 Probando endpoint: GET /usuarios (con autenticación)"
    echo "--------------------------------------"
    
    USUARIOS_RESPONSE=$(curl -s -X GET "${BASE_URL}/usuarios" \
      -H "Authorization: Bearer ${TOKEN}")
    
    echo "$USUARIOS_RESPONSE" | jq . 2>/dev/null || echo "$USUARIOS_RESPONSE"
    echo ""
    
    # Probar perfil
    echo "📡 Probando endpoint: GET /auth/profile"
    echo "--------------------------------------"
    
    PROFILE_RESPONSE=$(curl -s -X GET "${BASE_URL}/auth/profile" \
      -H "Authorization: Bearer ${TOKEN}")
    
    echo "$PROFILE_RESPONSE" | jq . 2>/dev/null || echo "$PROFILE_RESPONSE"
    echo ""
else
    echo -e "${RED}✗ Login fallido${NC}"
    echo ""
fi

echo "======================================"
echo "✅ Pruebas completadas"
echo "======================================"
