# 🤖 Instrucciones para Agentes de IA (AGENTS.md)

Este documento sirve como guía técnica e histórica para los agentes inteligentes y desarrolladores que trabajen en este repositorio en futuras sesiones. Contiene la arquitectura del proyecto, convenciones de codificación, automatizaciones disponibles y pautas críticas para evitar romper la navegación del sitio.

---

## 🌟 1. Contexto del Proyecto

El proyecto **Recursos de Seguridad Digital Familiar** es una biblioteca integral y estructurada orientada a padres, tutores, educadores y comunidades en Latinoamérica. Proporciona guías prácticas sobre controles parentales, redes sociales, videojuegos y bienestar digital.

*   **Tecnología:** Sitio estático generado con **Jekyll**.
*   **Tema/Diseño:** Tema personalizado de estilo oscuro basado en `dark-poole` (se configura a través de CSS en `assets/css` y layouts en `_layouts`).
*   **URL de Producción:** [https://walalapancho.github.io/GuiaParaPadres/](https://walalapancho.github.io/GuiaParaPadres/)
*   **Idioma:** Español (`es`).

---

## 📁 2. Arquitectura de Directorios

El repositorio tiene la siguiente estructura clave:

*   **`/` (Raíz):** Contiene los archivos markdown (`.md`) principales de las guías organizados por tema (edad, plataformas, necesidades especiales).
*   **`_data/`:**
    *   [navigation.yml](./_data/navigation.yml): Archivo de configuración centralizado para la barra de navegación, menús de categorías y listado de servicios de emergencia por país (México, Colombia, Chile, Perú, Argentina).
*   **`_layouts/`:**
    *   [default-dark.html](./_layouts/default-dark.html): Layout oscuro principal para las páginas.
    *   `default.html`: Layout base por defecto.
*   **`_includes/`:** Fragmentos reutilizables (breadcrumbs, feedback, google-analytics, head, page-navigation, toc).
*   **`assets/`:** Contiene imágenes, estilos CSS (`assets/css/` donde reside el diseño personalizado) y scripts JavaScript (`assets/js/`).
*   **`registro de cambios/`:** Directorio histórico con documentos de mejoras previas, configuraciones y correcciones de enlaces.

---

## 📝 3. Convenciones de Markdown y Front Matter

Cada archivo `.md` nuevo o editado debe seguir las siguientes pautas de cabecera (Front Matter):

```yaml
---
layout: default-dark          # Obligatorio para mantener la coherencia visual oscura
title: "Título de la Guía"    # Título que aparecerá en la pestaña y SEO
permalink: /nombre-guia/       # URL amigable (ej: /seguridad-tiktok/)
toc: true                     # Opcional (solo en guías largas con múltiples subsecciones)
---
```

### 🔗 Reglas Cruciales de Enlaces Internos
1.  **Formatos de Enlace:**
    *   Para navegación en producción, se prefieren enlaces basados en los permalinks de Jekyll (ej: `[Texto del enlace](/GuiaParaPadres/nombre-guia/)` o `[Texto del enlace](./nombre-guia.md)` si se utiliza un link relativo local que Jekyll resuelva).
    *   **NUNCA** utilices rutas absolutas locales como `file:///...` en los archivos markdown finales.
2.  **Anclas (Anchors):**
    *   El motor Jekyll utiliza **kramdown** para renderizar markdown. Las anclas automáticas de los encabezados se generan en minúsculas y reemplazando espacios por guiones (ej. `## Seguridad en Roblox` genera el ancla `#seguridad-en-roblox`).
    *   Evita usar caracteres especiales o eñes en los nombres de anclas manuales si las defines con `{#ancla-manual}`.

---

## 🛠️ 4. Scripts y Automatización de Enlaces

Para prevenir enlaces rotos (una de las tareas de mantenimiento principales en este proyecto), existen varios scripts de Python en la raíz:

### 🔍 `verify_links_comprehensive.py`
Es el validador oficial y más robusto del repositorio.
*   **¿Qué hace?**: Analiza todos los archivos `.md` del proyecto, construye un mapa de permalinks y anclas (anchors) de encabezados en memoria, y valida que:
    *   Todos los enlaces internos apunten a archivos existentes o permalinks válidos.
    *   Los enlaces con anclas (ej: `/controles-consolas/#nintendo-switch`) existan realmente en la página destino.
    *   No haya enlaces a archivos de desarrollo o rutas locales inválidas.
*   **Uso:**
    ```bash
    python verify_links_comprehensive.py
    ```
    *Ejecútalo siempre antes de finalizar una sesión para asegurar el 100% de integridad.*

---

## 🚀 5. Desarrollo y Despliegue Local

Para levantar el entorno local de desarrollo y probar cambios visuales o de contenido:

1.  **Requisitos:** Tener instalado Ruby, Bundler y Jekyll.
2.  **Ejecutar Servidor Local:**
    *   Utiliza el script helper [serve.sh](./serve.sh):
        ```bash
        ./serve.sh
        ```
    *   Esto iniciará Jekyll usando la configuración combinada: `bundle exec jekyll serve --config _config.yml,_config_local.yml --livereload`.
    *   El sitio estará disponible localmente en `http://localhost:4000/GuiaParaPadres/`.

---

## 📅 6. Tareas Pendientes y Roadmap (Guía para futuras sesiones)

Al retomar el desarrollo del proyecto en futuras sesiones, considera priorizar:
1.  **Actualización de Redes Sociales Emergentes:** Verificar si las configuraciones de seguridad de TikTok, Discord o Instagram han cambiado y actualizar sus guías correspondientes.
2.  **Validación de Números de Emergencia:** Revisar periódicamente que los servicios listados en `_data/navigation.yml` sigan activos.
3.  **Ejecución de Linter de Enlaces:** Corrección inmediata de cualquier aviso emitido por `verify_links_comprehensive.py`.
4.  **Optimización SEO:** Garantizar que cada página markdown tenga descripciones meta adecuadas si se configuran layouts más avanzados.
