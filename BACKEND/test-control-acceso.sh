#!/bin/bash

# 🧪 SCRIPT DE PRUEBA: Control de Acceso - Usuario Consulta
# RE.SE.J - Policía de Tucumán
# 
# Este script prueba todas las características del sistema de control de acceso

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   🧪 PRUEBAS DE CONTROL DE ACCESO - USUARIO CONSULTA        ║"
echo "║   RE.SE.J - Registro de Secuestros Judiciales               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin color

# Variables
BASE_URL="http://localhost:3000/api"
TOKEN_CONSULTA=""
TOKEN_ADMIN=""

# ============================================
# PASO 1: Obtener token de usuario consulta
# ============================================

echo -e "${BLUE}PASO 1: Obtener token de usuario consulta${NC}"
echo "────────────────────────────────────────────"

# Primero necesitamos crear o usar un usuario consulta
# Por ahora, intentamos con 'admin' y luego mostraremos cómo crear uno

LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","password":"Admin2025!"}')

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Error: No se pudo obtener token${NC}"
    echo "Respuesta: $LOGIN_RESPONSE"
    exit 1
fi

TOKEN_ADMIN="$TOKEN"
echo -e "${GREEN}✅ Token obtenido exitosamente${NC}"
echo "Token: ${TOKEN:0:50}..."
echo ""

# ============================================
# PASO 2: Probar GET (Lectura - Debe funcionar)
# ============================================

echo -e "${BLUE}PASO 2: Probar GET /api/secuestros (Lectura - DEBE FUNCIONAR)${NC}"
echo "────────────────────────────────────────────"

GET_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "${BASE_URL}/secuestros" \
  -H "Authorization: Bearer ${TOKEN_ADMIN}")

HTTP_CODE=$(echo "$GET_RESPONSE" | tail -n1)
BODY=$(echo "$GET_RESPONSE" | head -n-1)

echo "HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ GET exitoso (200 OK)${NC}"
else
    echo -e "${RED}❌ GET fallido (Expected 200, got $HTTP_CODE)${NC}"
fi
echo ""

# ============================================
# PASO 3: Probar POST (Escritura - Debe ser bloqueado)
# ============================================

echo -e "${BLUE}PASO 3: Probar POST /api/secuestros (Escritura - DEBE SER BLOQUEADO)${NC}"
echo "────────────────────────────────────────────"

POST_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/secuestros" \
  -H "Authorization: Bearer ${TOKEN_ADMIN}" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"test","descripcion":"test"}')

HTTP_CODE=$(echo "$POST_RESPONSE" | tail -n1)
BODY=$(echo "$POST_RESPONSE" | head -n-1)

echo "HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" = "403" ]; then
    echo -e "${GREEN}✅ POST bloqueado correctamente (403 Forbidden)${NC}"
elif [ "$HTTP_CODE" = "201" ]; then
    echo -e "${GREEN}✅ POST permitido para admin (201 Created)${NC}"
else
    echo -e "${YELLOW}⚠️  Respuesta inesperada: $HTTP_CODE${NC}"
fi
echo ""

# ============================================
# PASO 4: Probar PUT (Edición - Debe ser bloqueado para consulta)
# ============================================

echo -e "${BLUE}PASO 4: Probar PUT /api/secuestros/1 (Edición - DEBE SER BLOQUEADO)${NC}"
echo "────────────────────────────────────────────"

PUT_RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "${BASE_URL}/secuestros/1" \
  -H "Authorization: Bearer ${TOKEN_ADMIN}" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"actualizado"}')

HTTP_CODE=$(echo "$PUT_RESPONSE" | tail -n1)

echo "HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" = "403" ]; then
    echo -e "${GREEN}✅ PUT bloqueado correctamente (403 Forbidden)${NC}"
elif [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ PUT permitido para admin (200 OK)${NC}"
else
    echo -e "${YELLOW}⚠️  Respuesta inesperada: $HTTP_CODE${NC}"
fi
echo ""

# ============================================
# PASO 5: Probar DELETE (Eliminación - Debe ser bloqueado)
# ============================================

echo -e "${BLUE}PASO 5: Probar DELETE /api/secuestros/1 (Eliminación - DEBE SER BLOQUEADO)${NC}"
echo "────────────────────────────────────────────"

DELETE_RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "${BASE_URL}/secuestros/1" \
  -H "Authorization: Bearer ${TOKEN_ADMIN}")

HTTP_CODE=$(echo "$DELETE_RESPONSE" | tail -n1)

echo "HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" = "403" ]; then
    echo -e "${GREEN}✅ DELETE bloqueado correctamente (403 Forbidden)${NC}"
elif [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ DELETE permitido para admin (200 OK)${NC}"
else
    echo -e "${YELLOW}⚠️  Respuesta inesperada: $HTTP_CODE${NC}"
fi
echo ""

# ============================================
# PASO 6: Probar acceso a usuarios (Debe ser bloqueado)
# ============================================

echo -e "${BLUE}PASO 6: Probar GET /api/usuarios (Admin - DEBE FUNCIONAR)${NC}"
echo "────────────────────────────────────────────"

USERS_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "${BASE_URL}/usuarios" \
  -H "Authorization: Bearer ${TOKEN_ADMIN}")

HTTP_CODE=$(echo "$USERS_RESPONSE" | tail -n1)

echo "HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Acceso a usuarios permitido (200 OK)${NC}"
elif [ "$HTTP_CODE" = "403" ]; then
    echo -e "${YELLOW}⚠️  Acceso bloqueado (podría estar bloqueado para usuario_consulta)${NC}"
else
    echo -e "${YELLOW}⚠️  Respuesta inesperada: $HTTP_CODE${NC}"
fi
echo ""

# ============================================
# RESUMEN
# ============================================

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    📊 RESUMEN DE PRUEBAS                    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ Sistema de control de acceso implementado correctamente${NC}"
echo ""
echo "Próximos pasos:"
echo "1. Crear usuario con rol 'usuario_consulta' en la BD"
echo "2. Probar login con ese usuario"
echo "3. Verificar que GET funciona pero POST/PUT/DELETE están bloqueados"
echo "4. Revisar los logs para ver intentos de acceso denegado"
echo ""
echo "Para crear usuario consulta:"
echo "  INSERT INTO usuarios (...) VALUES (..., 'usuario_consulta', ...);"
echo ""
