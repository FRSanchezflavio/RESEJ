#!/bin/bash

echo "=================================================="
echo "🧪 PROBANDO BACKEND RE.SE.J"
echo "=================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:4000"

# Verificar si el servidor está corriendo
echo -e "${BLUE}🔍 Verificando si el servidor está corriendo...${NC}"
if ! curl -s --connect-timeout 2 $BASE_URL/health > /dev/null 2>&1; then
    echo -e "${RED}❌ ERROR: El servidor NO está corriendo${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Solución:${NC}"
    echo "1. Abre otra terminal"
    echo "2. Ejecuta: cd /c/Users/flavi/OneDrive/Escritorio/RESEJ/BACKEND"
    echo "3. Ejecuta: npm run dev"
    echo "4. Espera a ver: '🚀 Servidor iniciado'"
    echo "5. Vuelve a ejecutar este script"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Servidor detectado en $BASE_URL${NC}"
echo ""

echo "📡 Probando Health Check..."
echo "GET $BASE_URL/health"
echo ""

HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" $BASE_URL/health)
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n 1)
BODY=$(echo "$HEALTH_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Health Check OK (200)${NC}"
    echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}❌ Health Check FAILED (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi

echo ""
echo "=================================================="
echo "🔐 Probando Login Admin..."
echo "POST $BASE_URL/api/auth/login"
echo ""

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","password":"Admin2025!"}')

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n 1)
BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Login Exitoso (200)${NC}"
    echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
    
    # Extraer token
    ACCESS_TOKEN=$(echo "$BODY" | jq -r '.data.accessToken' 2>/dev/null)
    
    if [ ! -z "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
        echo ""
        echo -e "${GREEN}🎫 Token obtenido:${NC}"
        echo "${ACCESS_TOKEN:0:50}..."
        
        echo ""
        echo "=================================================="
        echo "👤 Probando endpoint protegido..."
        echo "GET $BASE_URL/api/auth/me"
        echo ""
        
        ME_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET $BASE_URL/api/auth/me \
          -H "Authorization: Bearer $ACCESS_TOKEN")
        
        HTTP_CODE=$(echo "$ME_RESPONSE" | tail -n 1)
        BODY=$(echo "$ME_RESPONSE" | sed '$d')
        
        if [ "$HTTP_CODE" = "200" ]; then
            echo -e "${GREEN}✅ Endpoint Protegido OK (200)${NC}"
            echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
        else
            echo -e "${RED}❌ Endpoint Protegido FAILED (HTTP $HTTP_CODE)${NC}"
            echo "$BODY"
        fi
    fi
else
    echo -e "${RED}❌ Login FAILED (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi

echo ""
echo "=================================================="
echo "✅ Pruebas completadas"
echo "=================================================="
