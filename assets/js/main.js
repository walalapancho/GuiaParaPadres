// =====================================================
// SEGURIDAD DIGITAL FAMILIAR - JAVASCRIPT SIMPLIFICADO
// =====================================================

(function () {
  "use strict";

  // =====================================================
  // CONFIGURACIÓN
  // =====================================================

  const CONFIG = {
    scrollThreshold: 300,
    animationDuration: 300,
  };

  // =====================================================
  // UTILIDADES BÁSICAS
  // =====================================================

  const Utils = {
    debounce: function (func, wait) {
      let timeout;
      return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          func.apply(context, args);
        }, wait);
      };
    },

    scrollToElement: function (element, offset) {
      if (!element) return;
      offset = offset || 0;

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    },
  };

  // =====================================================
  // BARRA DE PROGRESO DE LECTURA
  // =====================================================

  function updateReadingProgress() {
    const progressBar = document.getElementById("reading-progress");
    if (!progressBar) return;

    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    progressBar.style.width = scrolled + "%";
  }

  // =====================================================
  // TABLA DE CONTENIDOS AUTOMÁTICA
  // =====================================================

  function generateTOC() {
    const tocContent = document.getElementById("toc-content");
    if (!tocContent) return;

    const headings = document.querySelectorAll("h2, h3");
    if (headings.length === 0) return;

    const tocList = document.createElement("ul");
    tocList.className = "toc-list";

    headings.forEach(function (heading, index) {
      // Agregar ID si no lo tiene
      if (!heading.id) {
        heading.id = "heading-" + index;
      }

      const listItem = document.createElement("li");
      listItem.className = "toc-item toc-" + heading.tagName.toLowerCase();

      const link = document.createElement("a");
      link.href = "#" + heading.id;
      link.textContent = heading.textContent;
      link.className = "toc-link";

      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });

    tocContent.appendChild(tocList);
  }

  // =====================================================
  // TOGGLE DE TABLA DE CONTENIDOS
  // =====================================================

  function setupTOCToggle() {
    const toggle = document.getElementById("toc-toggle");
    const content = document.getElementById("toc-content");

    if (!toggle || !content) return;

    toggle.addEventListener("click", function () {
      const isCollapsed = content.classList.contains("toc-collapsed");
      const icon = toggle.querySelector(".toc-icon");

      if (isCollapsed) {
        content.classList.remove("toc-collapsed");
        content.style.display = "block";
        if (icon) icon.textContent = "▼";
      } else {
        content.classList.add("toc-collapsed");
        content.style.display = "none";
        if (icon) icon.textContent = "▶";
      }
    });
  }

  // =====================================================
  // BOTÓN VOLVER AL INICIO
  // =====================================================

  function setupBackToTop() {
    const backToTop = document.getElementById("back-to-top");
    if (!backToTop) return;

    function toggleButton() {
      if (window.pageYOffset > CONFIG.scrollThreshold) {
        backToTop.style.display = "flex";
      } else {
        backToTop.style.display = "none";
      }
    }

    window.addEventListener("scroll", Utils.debounce(toggleButton, 100));

    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    // Llamada inicial
    toggleButton();
  }

  // =====================================================
  // SISTEMA DE FEEDBACK
  // =====================================================

  function setupFeedback() {
    const feedbackButtons = document.querySelectorAll(".feedback-btn");
    const thankMessage = document.getElementById("feedback-thanks");

    if (!feedbackButtons.length) return;

    feedbackButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const feedback = this.getAttribute("data-feedback");

        // Ocultar botones y mostrar agradecimiento
        feedbackButtons.forEach(function (btn) {
          btn.style.display = "none";
        });

        if (thankMessage) {
          thankMessage.style.display = "block";
        }

        // Console log para debugging (se puede quitar en producción)
        console.log("Feedback recibido:", feedback);
      });
    });
  }

  // =====================================================
  // SCROLL SUAVE PARA ENLACES DE ANCLAJE
  // =====================================================

  function setupSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#") return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          Utils.scrollToElement(target, 80);
        }
      });
    });
  }

  // =====================================================
  // MEJORAS DE NAVEGACIÓN MÓVIL Y MENÚ HAMBURGUESA
  // =====================================================

  function setupMobileNavigation() {
    const navTrigger = document.getElementById("nav-trigger");
    const siteNav = document.querySelector(".site-nav");
    const menuIcon = document.querySelector(".menu-icon");

    if (!navTrigger || !siteNav) return;

    // Cerrar menú al hacer clic en un enlace (excluyendo dropdowns)
    const navLinks = siteNav.querySelectorAll(".page-link:not(.dropdown-toggle)");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navTrigger.checked = false;
      });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", function (e) {
      if (!siteNav.contains(e.target) && !menuIcon.contains(e.target)) {
        navTrigger.checked = false;
      }
    });

    // Manejar menús desplegables en móvil
    const dropdownToggles = siteNav.querySelectorAll(".dropdown-toggle");
    dropdownToggles.forEach(function (toggle) {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        
        // En móvil, alternar visibilidad del dropdown
        if (window.innerWidth <= 768) {
          const dropdownMenu = toggle.nextElementSibling;
          const arrow = toggle.querySelector(".dropdown-arrow");
          
          if (dropdownMenu.style.display === "block") {
            dropdownMenu.style.display = "none";
            arrow.style.transform = "rotate(0deg)";
          } else {
            // Cerrar otros dropdowns
            dropdownToggles.forEach(function (otherToggle) {
              if (otherToggle !== toggle) {
                const otherMenu = otherToggle.nextElementSibling;
                const otherArrow = otherToggle.querySelector(".dropdown-arrow");
                otherMenu.style.display = "none";
                otherArrow.style.transform = "rotate(0deg)";
              }
            });
            
            dropdownMenu.style.display = "block";
            arrow.style.transform = "rotate(180deg)";
          }
        }
      });
    });

    // Cerrar dropdowns al redimensionar ventana
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        const dropdownMenus = siteNav.querySelectorAll(".dropdown-menu");
        const arrows = siteNav.querySelectorAll(".dropdown-arrow");
        
        dropdownMenus.forEach(function (menu) {
          menu.style.display = "";
        });
        
        arrows.forEach(function (arrow) {
          arrow.style.transform = "rotate(0deg)";
        });
      }
    });
  }

  // =====================================================
  // MEJORAS DE ACCESIBILIDAD
  // =====================================================

  function setupAccessibility() {
    // Indicador de navegación por teclado
    document.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation");
      }
    });

    document.addEventListener("mousedown", function () {
      document.body.classList.remove("keyboard-navigation");
    });

    // Cerrar TOC con Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        const tocContent = document.getElementById("toc-content");
        const tocToggle = document.getElementById("toc-toggle");

        if (
          tocContent &&
          tocToggle &&
          !tocContent.classList.contains("toc-collapsed")
        ) {
          tocToggle.click();
        }
      }
    });
  }

  // =====================================================
  // CARGA DE FUENTES MEJORADA
  // =====================================================

  function setupFontLoading() {
    // Cargar fuente Inter si no está disponible
    if (!document.fonts || !document.fonts.check("16px Inter")) {
      const link = document.createElement("link");
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }

  // =====================================================
  // DETECCIÓN DE CARACTERÍSTICAS DEL DISPOSITIVO
  // =====================================================

  function setupDeviceDetection() {
    // Detectar dispositivo táctil
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      document.body.classList.add("touch-device");
    }

    // Detectar conexión lenta
    if (navigator.connection && navigator.connection.effectiveType) {
      if (
        navigator.connection.effectiveType === "slow-2g" ||
        navigator.connection.effectiveType === "2g"
      ) {
        document.body.classList.add("slow-connection");
      }
    }
  }

  // =====================================================
  // LAZY LOADING DE IMÁGENES
  // =====================================================

  function setupLazyLoading() {
    if ("IntersectionObserver" in window) {
      const images = document.querySelectorAll("img[data-src]");

      const imageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(function (img) {
        imageObserver.observe(img);
      });
    }
  }

  // =====================================================
  // NOTIFICACIONES SIMPLES
  // =====================================================

  function showNotification(message, type, duration) {
    type = type || "info";
    duration = duration || 5000;

    // Crear contenedor si no existe
    let container = document.getElementById("notifications-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "notifications-container";
      container.style.cssText =
        "position:fixed;top:1rem;right:1rem;z-index:10000;max-width:400px;";
      document.body.appendChild(container);
    }

    // Crear notificación
    const notification = document.createElement("div");
    notification.style.cssText = `
      background: white;
      border: 1px solid #e5e7eb;
      border-left: 4px solid #2563eb;
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;

    if (type === "success") notification.style.borderLeftColor = "#059669";
    if (type === "error") notification.style.borderLeftColor = "#dc2626";
    if (type === "warning") notification.style.borderLeftColor = "#f59e0b";

    notification.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <span style="flex: 1; color: #111827; font-size: 0.875rem;">${message}</span>
        <button onclick="this.parentElement.parentElement.remove()"
                style="background: none; border: none; font-size: 1.25rem; cursor: pointer; color: #6b7280;">×</button>
      </div>
    `;

    container.appendChild(notification);

    // Animar entrada
    setTimeout(function () {
      notification.style.transform = "translateX(0)";
    }, 10);

    // Auto eliminar
    setTimeout(function () {
      if (notification.parentNode) {
        notification.style.transform = "translateX(100%)";
        setTimeout(function () {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, duration);
  }

  // =====================================================
  // INICIALIZACIÓN PRINCIPAL
  // =====================================================

  function init() {
    // Verificar que el DOM esté listo
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initModules);
    } else {
      initModules();
    }
  }

  function initModules() {
    try {
      // Configurar módulos básicos
      setupFontLoading();
      setupDeviceDetection();
      setupAccessibility();
      setupMobileNavigation();
      setupSmoothScrolling();

      // Configurar componentes interactivos
      generateTOC();
      setupTOCToggle();
      setupBackToTop();
      setupFeedback();
      setupLazyLoading();

      // Configurar barra de progreso
      window.addEventListener(
        "scroll",
        Utils.debounce(updateReadingProgress, 50),
      );
      updateReadingProgress();

      // Mensaje de éxito en consola
      console.log(
        "🛡️ Seguridad Digital Familiar - JavaScript inicializado correctamente",
      );
    } catch (error) {
      console.error("Error inicializando JavaScript:", error);

      // Funcionalidad mínima en caso de error
      window.addEventListener("scroll", updateReadingProgress);
      setupSmoothScrolling();
    }
  }

  // =====================================================
  // EVENTOS DE RENDIMIENTO
  // =====================================================

  window.addEventListener("load", function () {
    // Ocultar indicadores de carga si existen
    const loadingIndicators = document.querySelectorAll(".loading");
    loadingIndicators.forEach(function (indicator) {
      indicator.style.display = "none";
    });

    // Mostrar notificación de bienvenida (solo en desarrollo)
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      setTimeout(function () {
        showNotification(
          "Sitio cargado correctamente en modo desarrollo 🚀",
          "success",
          3000,
        );
      }, 1000);
    }
  });

  // =====================================================
  // MANEJO DE ERRORES GLOBAL
  // =====================================================

  window.addEventListener("error", function (e) {
    console.error("Error JavaScript:", e.error);

    // En producción, podrías enviar esto a un servicio de analytics
    if (window.location.hostname !== "localhost") {
      // Analytics o logging service aquí
    }
  });

  // =====================================================
  // EXPOSICIÓN GLOBAL PARA DEBUGGING
  // =====================================================

  // Solo en desarrollo
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    window.SDF = {
      Utils: Utils,
      showNotification: showNotification,
      updateReadingProgress: updateReadingProgress,
      generateTOC: generateTOC,
    };
  }

  // =====================================================
  // INICIAR LA APLICACIÓN
  // =====================================================

  init();
})();
