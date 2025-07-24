# 📋 Instrucciones para Activar GitHub Pages

## 🚀 Pasos para Publicar tu Sitio

### 1. 📤 Subir los Cambios a GitHub

Si aún no has subido estos archivos al repositorio:

```bash
git add .
git commit -m "Configurar sitio para GitHub Pages"
git push origin main
```

### 2. ⚙️ Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña **"Settings"** (Configuración)
3. En el menú lateral izquierdo, busca **"Pages"**
4. En la sección **"Source"** (Fuente):
   - Selecciona **"GitHub Actions"**
5. Guarda los cambios

### 3. 🎯 Personalizar la Configuración

Edita el archivo `_config.yml` y cambia estas líneas:

```yaml
url: "https://TU-USUARIO.github.io"  # Cambia TU-USUARIO por tu nombre de usuario
baseurl: "/ControlesParentales"      # Solo si tu repo NO se llama username.github.io

# En la sección social:
social:
  - platform: github
    user_url: "https://github.com/TU-USUARIO/ControlesParentales"
```

### 4. 🔗 Acceder a tu Sitio

Una vez activado, tu sitio estará disponible en:
- **Si el repositorio se llama `tu-usuario.github.io`**: `https://tu-usuario.github.io`
- **Si el repositorio tiene otro nombre**: `https://tu-usuario.github.io/nombre-repositorio`

### 5. ⏰ Tiempo de Despliegue

- El primer despliegue puede tomar **5-10 minutos**
- Los siguientes despliegues son automáticos al hacer push a la rama `main`
- Puedes ver el progreso en la pestaña **"Actions"** de tu repositorio

### 6. 🔧 Verificar que Funciona

1. Ve a la pestaña **"Actions"** en tu repositorio
2. Deberías ver un workflow ejecutándose o completado
3. Si hay errores, revisa los logs para solucionarlos

### 7. 📝 Personalización Adicional

#### Cambiar el Tema
En `_config.yml`, puedes cambiar:
```yaml
theme: minima  # Puedes usar: minima, jekyll-theme-cayman, etc.
```

#### Personalizar la Navegación
Edita la sección `header_pages` en `_config.yml`:
```yaml
header_pages:
  - index.md
  - INDICE-INTERACTIVO.md
  - GuiaParaMaestros.md
  - TallerFamiliar.md
  - FuentesReferencias.md
```

### 8. 🆘 Solución de Problemas Comunes

#### Error: "No se puede acceder al sitio"
- Verifica que GitHub Pages esté activado
- Revisa que la rama sea `main` (no `master`)
- Espera unos minutos para la propagación

#### Error: "Build failed" 
- Revisa los logs en la pestaña "Actions"
- Verifica que el archivo `_config.yml` tenga formato YAML válido
- Asegúrate de que no hay errores en el front matter de los archivos .md

#### Error: "Enlaces rotos"
- Verifica que todos los archivos .md referenciados existan
- Los enlaces deben usar rutas relativas (sin `/` al inicio)

### 9. 📊 Métricas y Analytics

Para agregar Google Analytics, añade a `_config.yml`:
```yaml
google_analytics: TU-ID-DE-ANALYTICS
```

### 10. 🔄 Mantenimiento

- Los cambios al hacer push a `main` se publican automáticamente
- Revisa periódicamente la pestaña "Actions" para verificar que no hay errores
- Actualiza las gemas ocasionalmente editando `Gemfile`

---

## ✅ Lista de Verificación Final

- [ ] Archivos de configuración creados (`_config.yml`, `Gemfile`, workflow)
- [ ] GitHub Pages activado en configuración del repositorio
- [ ] URL personalizada configurada en `_config.yml` 
- [ ] Primer deploy ejecutado exitosamente
- [ ] Sitio accesible desde la URL de GitHub Pages
- [ ] Navegación funcionando correctamente
- [ ] Enlaces internos funcionando

---

**🎉 ¡Listo! Tu biblioteca de seguridad digital ya está publicada y accesible para familias de todo el mundo.**

*Si tienes problemas, crea un issue en el repositorio con los detalles del error.* 