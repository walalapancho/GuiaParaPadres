# 📚 Guía para Desarrolladores

Este documento describe cómo preparar el entorno de desarrollo local usando **mise** (el gestor de versiones) y cómo ejecutar el sitio Jekyll para pruebas.

---
## 1️⃣ Prerrequisitos

- macOS (el proyecto está pensado para macOS).
- **Homebrew** instalado (`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`).
- Acceso a internet la primera vez para descargar dependencias.

---
## 2️⃣ Instalar **mise**

```bash
# Instalar mise (solo la primera vez)
brew install jdx/mise/mise
```

> mise es un gestor de versiones que permite declarar la versión exacta de Ruby, Node, Bundler, etc., en un archivo de configuración.

---
## 3️⃣ Clonar el repositorio

```bash
git clone https://github.com/walalapancho/GuiaParaPadres.git
cd GuiaParaPadres/ControlesParentales
```

---
## 4️⃣ Configurar el entorno con mise

En el directorio raíz del proyecto ya está presente el archivo **`.mise.toml`** (creado por la IA). Ejecuta:

```bash
# Instala y activa las versiones declaradas en .mise.toml
mise install   # descarga Ruby, Bundler y Node
mise use       # coloca esas versiones en el PATH de la sesión actual
```

> Si `mise use` no se ejecuta automáticamente, abre una nueva terminal después de `mise install`.

---
## 5️⃣ Instalar dependencias Ruby (Jekyll & plugins)

```bash
# Con la versión de Ruby correcta, instala Bundler y las gems del proyecto
bundle install
```

Esto creará/actualizará `Gemfile.lock` con Jekyll 4.4.1 y los plugins requeridos.

---
## 6️⃣ Ejecutar el sitio localmente

```bash
# Usa el script helper que ya está en el repo
./serve.sh
```

El servidor se iniciará en `http://localhost:4000`. El modo **live‑reload** está habilitado; cualquier cambio en los archivos markdown o assets recargará automáticamente la página.

---
## 7️⃣ Verificar enlaces rotos

El proyecto incluye el script `verify_links_comprehensive.py` que revisa todos los enlaces internos.

```bash
python verify_links_comprehensive.py
```

Si el script finaliza sin errores, los enlaces están correctos.

---
## 8️⃣ Otras utilidades útiles

- **Makefile**: `make install`, `make serve`, `make build`, `make test-links` son atajos rápidos.
- **GitHub Actions**: el CI ya está configurado para usar Node 24; los warnings de Node 20 desaparecen después de actualizar el `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` en el workflow.

---
## 9️⃣ Contribuir

1. Crea una rama (`git checkout -b nombre‑de‑feature`).
2. Realiza tus cambios.
3. Ejecuta `make test-links` y verifica en el navegador.
4. Haz commit y push, abre un Pull Request.

---
**¡Listo!** Con estos pasos tendrás el entorno listo para desarrollar, probar y contribuir al proyecto sin sorpresas.
