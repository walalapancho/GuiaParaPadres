#!/bin/bash
# Script para ejecutar Jekyll localmente

echo "🚀 Iniciando Jekyll en modo desarrollo..."
echo "📍 URL local: http://localhost:4000"
echo "🔄 El sitio se recargará automáticamente cuando hagas cambios"
echo "⏹️  Presiona Ctrl+C para detener el servidor"
echo ""

# Ejecutar Jekyll con configuración local
bundle exec jekyll serve --config _config.yml,_config_local.yml --livereload --host=0.0.0.0 --port=4000
