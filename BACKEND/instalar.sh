#!/bin/bash

echo "========================================"
echo " INSTALACIÓN RE.SE.J BACKEND"
echo " Sistema de Registro de Secuestros"
echo "========================================"
echo ""

# Verificar Node.js
echo "[1/6] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js no está instalado"
    echo "Por favor instalar Node.js 18 o superior desde https://nodejs.org"
    exit 1
fi
echo "✅ OK - Node.js $(node --version)"

# Verificar npm
echo "[2/6] Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ ERROR: npm no está disponible"
    exit 1
fi
echo "✅ OK - npm $(npm --version)"

# Instalar dependencias
echo ""
echo "[3/6] Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Falló la instalación de dependencias"
    exit 1
fi
echo "✅ OK - Dependencias instaladas"

# Crear archivo .env
echo ""
echo "[4/6] Configurando variables de entorno..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ OK - Archivo .env creado"
    echo ""
    echo "⚠️  IMPORTANTE: Editar .env con las credenciales de PostgreSQL"
else
    echo "⚠️  AVISO: Archivo .env ya existe, no se sobrescribe"
fi

# Crear directorios
echo ""
echo "[5/6] Creando directorios necesarios..."
mkdir -p uploads logs
echo "✅ OK - Directorios creados"

# Mostrar instrucciones
echo ""
echo "[6/6] Verificando instalación..."
echo ""
echo "========================================"
echo " ✅ INSTALACIÓN COMPLETADA"
echo "========================================"
echo ""
echo "PRÓXIMOS PASOS:"
echo ""
echo "1. Configurar PostgreSQL:"
echo "   - Crear base de datos: resej_db"
echo "   - Crear usuario: resej_user"
echo ""
echo "2. Editar archivo .env con credenciales de BD"
echo ""
echo "3. Ejecutar migraciones:"
echo "   npm run migrate:latest"
echo ""
echo "4. Crear usuario admin:"
echo "   npm run seed:run"
echo ""
echo "5. Iniciar servidor:"
echo "   npm run dev"
echo ""
echo "Consultar INICIO_RAPIDO.md para más detalles"
echo ""
