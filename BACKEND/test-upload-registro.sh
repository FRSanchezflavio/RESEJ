#!/bin/bash

# Test de carga de registro

echo "🔐 Obteniendo token..."
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"usuario":"admin","password":"Admin2025!"}' | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo "❌ Error: No se pudo obtener el token"
  exit 1
fi

echo "✅ Token obtenido"
echo ""

echo "📤 Creando registro con persona_id=1..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/registros \
  -H "Authorization: Bearer $TOKEN" \
  -F "persona_id=1" \
  -F "fecha_ingreso=2025-10-09" \
  -F "seccion_que_interviene=Criminalística" \
  -F "detalle_secuestro=Prueba de secuestro desde script de test")

echo "$RESPONSE" | python -m json.tool 2>/dev/null || echo "$RESPONSE"

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo ""
  echo "✅ Registro creado exitosamente"
else
  echo ""
  echo "❌ Error al crear registro"
fi
