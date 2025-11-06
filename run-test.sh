#!/bin/bash

echo "=== INICIANDO BACKEND ==="
cd /c/Users/flavi/OneDrive/Escritorio/RESEJ/BACKEND
npm run dev > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend iniciado con PID: $BACKEND_PID"

echo "Esperando 5 segundos para que el servidor inicie..."
sleep 5

echo ""
echo "=== EJECUTANDO PRUEBAS ==="
cd /c/Users/flavi/OneDrive/Escritorio/RESEJ
node test-invitaciones.js

TEST_EXIT=$?

echo ""
echo "=== LIMPIEZA ==="
kill $BACKEND_PID 2>/dev/null
echo "Backend detenido"

exit $TEST_EXIT
