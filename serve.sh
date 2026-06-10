#!/bin/bash
# Script para ejecutar Jekyll localmente

# Matar procesos previos de Jekyll/LiveReload que pudieran estar ocupando puertos
echo "🔍 Verificando procesos previos de Jekyll..."
pkill -f 'jekyll serve' 2>/dev/null || true
lsof -ti:4001 | xargs -r kill -9 2>/dev/null || true
lsof -ti:35729 | xargs -r kill -9 2>/dev/null || true
sleep 1

echo "🚀 Iniciando Jekyll en modo desarrollo..."
echo "📍 URL local: http://localhost:4001"
echo "🔄 El sitio se recargará automáticamente cuando hagas cambios"
echo "⏹️  Presiona Ctrl+C para detener el servidor"
echo ""

# Ejecutar Jekyll con configuración local
bundle exec jekyll serve --config _config.yml,_config_local.yml --livereload --host=0.0.0.0 --port=4001
