#!/bin/bash
# Script para aplicar las correcciones de roles y permisos

echo "================================================"
echo "  Aplicando correcciones de roles y permisos"
echo "================================================"
echo ""

cd "$(dirname "$0")"

echo "1. Ejecutando migración de roles..."
npx knex migrate:latest

echo ""
echo "2. Verificando roles creados..."
npx knex seed:run --specific=verificar_roles.js

echo ""
echo "================================================"
echo "  ✓ Correcciones aplicadas exitosamente"
echo "================================================"
echo ""
echo "Roles disponibles:"
echo "  - ID 1: Administrador (todos los permisos)"
echo "  - ID 2: Usuario Estándar (crear, editar, consultar)"
echo "  - ID 3: Usuario Consulta (solo consultar)"
echo ""
