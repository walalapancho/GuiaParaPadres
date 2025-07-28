# Desarrollo Local con Jekyll

Este documento explica cómo configurar y ejecutar el sitio Jekyll localmente para desarrollo.

## 🔧 Requisitos Previos

- Ruby 2.7 o superior
- Bundler
- Git

## 🚀 Configuración Inicial

1. **Clonar el repositorio** (si aún no lo has hecho):
   ```bash
   git clone https://github.com/walalapancho/GuiaParaPadres.git
   cd GuiaParaPadres
   ```

2. **Configurar Bundler para instalación local**:
   ```bash
   bundle config set --local path 'vendor/bundle'
   ```

3. **Instalar dependencias**:
   ```bash
   bundle install
   ```

## 🌐 Ejecutar el Sitio Localmente

### Opción 1: Script Automático (Recomendado)
```bash
./serve.sh
```

### Opción 2: Comando Manual
```bash
bundle exec jekyll serve --config _config.yml,_config_local.yml --livereload --host=0.0.0.0 --port=4000
```

### Opción 3: Solo Construcción (sin servidor)
```bash
bundle exec jekyll build --config _config.yml,_config_local.yml
```

## 📱 Acceder al Sitio

Una vez iniciado el servidor, podrás acceder al sitio en:
- **URL local**: http://localhost:4000
- **Red local**: http://[tu-ip]:4000 (para acceso desde otros dispositivos)

## ⚡ Características del Desarrollo Local

- **Recarga automática**: El sitio se recarga automáticamente cuando modificas archivos
- **Sin baseurl**: La configuración local elimina el baseurl de GitHub Pages
- **Drafts habilitados**: Puedes trabajar con borradores
- **Construcción incremental**: Solo se reconstruyen los archivos modificados

## 📁 Estructura de Archivos de Desarrollo

```
├── _config.yml           # Configuración principal
├── _config_local.yml     # Configuración para desarrollo local
├── serve.sh             # Script para iniciar el servidor
├── vendor/              # Dependencias de Ruby (ignorado por git)
├── .bundle/             # Configuración de Bundle (ignorado por git)
└── _site/              # Sitio generado (ignorado por git)
```

## 🛠️ Comandos Útiles

### Actualizar Dependencias
```bash
bundle update
```

### Limpiar Cache
```bash
bundle exec jekyll clean
```

### Verificar Configuración
```bash
bundle exec jekyll doctor
```

### Ver Versión de Jekyll
```bash
bundle exec jekyll --version
```

## 🐛 Solución de Problemas

### Error de Permisos
Si encuentras errores de permisos, asegúrate de que la configuración de bundle esté correcta:
```bash
bundle config set --local path 'vendor/bundle'
bundle install
```

### Puerto Ocupado
Si el puerto 4000 está ocupado, puedes usar otro puerto:
```bash
bundle exec jekyll serve --config _config.yml,_config_local.yml --port 4001
```

### Cache Corrupto
Si tienes problemas con el cache:
```bash
bundle exec jekyll clean
bundle exec jekyll build --config _config.yml,_config_local.yml
```

## 📝 Notas Importantes

1. **No subas** los archivos `_config_local.yml` y `serve.sh` al repositorio (están en .gitignore)
2. **No subas** la carpeta `vendor/` (está en .gitignore)
3. **Las URLs locales** no incluyen el baseurl `/GuiaParaPadres`
4. **Los cambios** se ven inmediatamente gracias al livereload

## 🔄 Workflow de Desarrollo

1. Inicia el servidor local con `./serve.sh`
2. Haz tus cambios en los archivos
3. Ve los cambios automáticamente en http://localhost:4000
4. Cuando termines, detén el servidor con `Ctrl+C`
5. Haz commit y push de tus cambios

## 📚 Recursos Adicionales

- [Documentación de Jekyll](https://jekyllrb.com/docs/)
- [GitHub Pages + Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll)
- [Liquid Template Language](https://shopify.github.io/liquid/)
