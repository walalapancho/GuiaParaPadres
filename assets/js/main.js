// =====================================================
// SEGURIDAD DIGITAL FAMILIAR - MAIN JAVASCRIPT
// =====================================================

(function() {
  'use strict';

  // =====================================================
  // CONFIGURACIÓN Y CONSTANTES
  // =====================================================

  const CONFIG = {
    searchMinLength: 2,
    searchDebounceDelay: 300,
    scrollThreshold: 300,
    animationDuration: 300,
    storageKeys: {
      darkMode: 'sdf-dark-mode',
      fontSize: 'sdf-font-size',
      preferences: 'sdf-preferences'
    }
  };

  // =====================================================
  // UTILIDADES
  // =====================================================

  const Utils = {
    // Debounce function
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Throttle function
    throttle: function(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    // Smooth scroll to element
    scrollToElement: function(element, offset = 0) {
      if (!element) return;

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    },

    // Local storage helpers
    storage: {
      get: function(key, defaultValue = null) {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
          console.warn('Error reading from localStorage:', e);
          return defaultValue;
        }
      },

      set: function(key, value) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (e) {
          console.warn('Error writing to localStorage:', e);
          return false;
        }
      },

      remove: function(key) {
        try {
          localStorage.removeItem(key);
          return true;
        } catch (e) {
          console.warn('Error removing from localStorage:', e);
          return false;
        }
      }
    },

    // Animation helpers
    fadeIn: function(element, duration = CONFIG.animationDuration) {
      element.style.opacity = 0;
      element.style.display = 'block';

      let start = performance.now();

      function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = elapsed / duration;

        if (progress < 1) {
          element.style.opacity = progress;
          requestAnimationFrame(animate);
        } else {
          element.style.opacity = 1;
        }
      }

      requestAnimationFrame(animate);
    },

    fadeOut: function(element, duration = CONFIG.animationDuration) {
      let start = performance.now();
      const initialOpacity = parseFloat(getComputedStyle(element).opacity);

      function animate(currentTime) {
        const elapsed = currentTime - start;
        const progress = elapsed / duration;

        if (progress < 1) {
          element.style.opacity = initialOpacity * (1 - progress);
          requestAnimationFrame(animate);
        } else {
          element.style.opacity = 0;
          element.style.display = 'none';
        }
      }

      requestAnimationFrame(animate);
    }
  };

  // =====================================================
  // MODO OSCURO
  // =====================================================

  const DarkMode = {
    init: function() {
      this.createToggle();
      this.loadPreference();
      this.bindEvents();
    },

    createToggle: function() {
      const nav = document.querySelector('.site-nav .trigger');
      if (!nav) return;

      const toggle = document.createElement('button');
      toggle.id = 'dark-mode-toggle';
      toggle.className = 'dark-mode-toggle';
      toggle.setAttribute('aria-label', 'Alternar modo oscuro');
      toggle.innerHTML = '<span class="dark-mode-icon">🌙</span>';

      nav.appendChild(toggle);
    },

    loadPreference: function() {
      const savedMode = Utils.storage.get(CONFIG.storageKeys.darkMode);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedMode === 'dark' || (savedMode === null && prefersDark)) {
        this.enable();
      }
    },

    bindEvents: function() {
      const toggle = document.getElementById('dark-mode-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', () => {
        this.toggle();
      });

      // Listen for system preference changes
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          if (Utils.storage.get(CONFIG.storageKeys.darkMode) === null) {
            if (e.matches) {
              this.enable();
            } else {
              this.disable();
            }
          }
        });
    },

    toggle: function() {
      if (document.documentElement.classList.contains('dark-mode')) {
        this.disable();
      } else {
        this.enable();
      }
    },

    enable: function() {
      document.documentElement.classList.add('dark-mode');
      this.updateToggle(true);
      Utils.storage.set(CONFIG.storageKeys.darkMode, 'dark');
    },

    disable: function() {
      document.documentElement.classList.remove('dark-mode');
      this.updateToggle(false);
      Utils.storage.set(CONFIG.storageKeys.darkMode, 'light');
    },

    updateToggle: function(isDark) {
      const toggle = document.getElementById('dark-mode-toggle');
      const icon = toggle?.querySelector('.dark-mode-icon');

      if (icon) {
        icon.textContent = isDark ? '☀️' : '🌙';
      }

      if (toggle) {
        toggle.setAttribute('aria-label',
          isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
        );
      }
    }
  };

  // =====================================================
  // BÚSQUEDA EN EL SITIO
  // =====================================================

  const Search = {
    data: [],
    results: [],

    init: function() {
      this.createSearchBox();
      this.loadSearchData();
      this.bindEvents();
    },

    createSearchBox: function() {
      const header = document.querySelector('.site-header .wrapper');
      if (!header) return;

      const searchContainer = document.createElement('div');
      searchContainer.className = 'search-container';
      searchContainer.innerHTML = `
        <div class="search-input-wrapper">
          <input type="search"
                 id="site-search"
                 placeholder="Buscar recursos..."
                 aria-label="Buscar en el sitio"
                 autocomplete="off">
          <button class="search-clear" aria-label="Limpiar búsqueda">×</button>
        </div>
        <div class="search-results" id="search-results" aria-hidden="true">
          <div class="search-results-content"></div>
        </div>
      `;

      header.appendChild(searchContainer);
    },

    loadSearchData: function() {
      // En un sitio real, esto cargaría desde un archivo JSON
      // Por ahora, creamos datos de ejemplo basados en el contenido
      this.data = [
        {
          title: 'Controles Parentales Básicos',
          url: '/Controles_Parentales',
          excerpt: 'Guía básica para configurar controles parentales en dispositivos',
          tags: ['controles', 'configuración', 'básico']
        },
        {
          title: 'Seguridad en YouTube',
          url: '/SeguridadYouTube',
          excerpt: 'Cómo configurar YouTube de forma segura para niños',
          tags: ['youtube', 'videos', 'niños']
        },
        {
          title: 'Controles para Adolescentes',
          url: '/ControlesParentalesAdolescentes',
          excerpt: 'Guía específica para manejar la seguridad digital con adolescentes',
          tags: ['adolescentes', 'privacidad', 'autonomía']
        },
        {
          title: 'Apps Recomendadas 0-3 años',
          url: '/apps_recomendadas_0-3',
          excerpt: 'Aplicaciones seguras y educativas para los más pequeños',
          tags: ['apps', 'bebés', 'educativo']
        },
        {
          title: 'Emergencias Digitales',
          url: '/casos-uso-especificos',
          excerpt: 'Protocolos de crisis y situaciones de emergencia digital',
          tags: ['emergencia', 'crisis', 'ayuda']
        },
        {
          title: 'Guía para Maestros',
          url: '/GuiaParaMaestros',
          excerpt: 'Recursos para educadores sobre seguridad digital',
          tags: ['maestros', 'educadores', 'escuela']
        }
      ];
    },

    bindEvents: function() {
      const searchInput = document.getElementById('site-search');
      const clearButton = document.querySelector('.search-clear');
      const resultsContainer = document.getElementById('search-results');

      if (!searchInput) return;

      // Search input events
      searchInput.addEventListener('input',
        Utils.debounce((e) => {
          this.performSearch(e.target.value);
        }, CONFIG.searchDebounceDelay)
      );

      searchInput.addEventListener('focus', () => {
        if (searchInput.value.length >= CONFIG.searchMinLength) {
          this.showResults();
        }
      });

      // Clear button
      if (clearButton) {
        clearButton.addEventListener('click', () => {
          this.clearSearch();
        });
      }

      // Close results when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
          this.hideResults();
        }
      });

      // Keyboard navigation
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.hideResults();
          searchInput.blur();
        }
      });
    },

    performSearch: function(query) {
      const searchInput = document.getElementById('site-search');
      const clearButton = document.querySelector('.search-clear');

      if (query.length < CONFIG.searchMinLength) {
        this.hideResults();
        if (clearButton) clearButton.style.display = 'none';
        return;
      }

      if (clearButton) clearButton.style.display = 'block';

      const searchTerms = query.toLowerCase().split(' ');
      this.results = this.data.filter(item => {
        const searchText = `${item.title} ${item.excerpt} ${item.tags.join(' ')}`.toLowerCase();
        return searchTerms.every(term => searchText.includes(term));
      });

      this.displayResults();
      this.showResults();
    },

    displayResults: function() {
      const resultsContent = document.querySelector('.search-results-content');
      if (!resultsContent) return;

      if (this.results.length === 0) {
        resultsContent.innerHTML = `
          <div class="search-no-results">
            <p>No se encontraron resultados.</p>
            <p>Intenta con otros términos de búsqueda.</p>
          </div>
        `;
        return;
      }

      const resultsHTML = this.results.map(result => `
        <a href="${result.url}" class="search-result-item">
          <h4>${this.highlightText(result.title)}</h4>
          <p>${this.highlightText(result.excerpt)}</p>
          <div class="search-result-tags">
            ${result.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </a>
      `).join('');

      resultsContent.innerHTML = resultsHTML;
    },

    highlightText: function(text) {
      const searchInput = document.getElementById('site-search');
      if (!searchInput || !searchInput.value) return text;

      const query = searchInput.value.toLowerCase();
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    },

    showResults: function() {
      const results = document.getElementById('search-results');
      if (results) {
        results.style.display = 'block';
        results.setAttribute('aria-hidden', 'false');
      }
    },

    hideResults: function() {
      const results = document.getElementById('search-results');
      if (results) {
        results.style.display = 'none';
        results.setAttribute('aria-hidden', 'true');
      }
    },

    clearSearch: function() {
      const searchInput = document.getElementById('site-search');
      const clearButton = document.querySelector('.search-clear');

      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }

      if (clearButton) {
        clearButton.style.display = 'none';
      }

      this.hideResults();
    }
  };

  // =====================================================
  // MEJORAS DE ACCESIBILIDAD
  // =====================================================

  const Accessibility = {
    init: function() {
      this.createFontSizeControls();
      this.enhanceKeyboardNavigation();
      this.addSkipLinks();
      this.loadFontSizePreference();
    },

    createFontSizeControls: function() {
      const nav = document.querySelector('.site-nav .trigger');
      if (!nav) return;

      const fontControls = document.createElement('div');
      fontControls.className = 'font-size-controls';
      fontControls.innerHTML = `
        <button class="font-size-btn" data-size="small" aria-label="Texto pequeño">A</button>
        <button class="font-size-btn" data-size="normal" aria-label="Texto normal">A</button>
        <button class="font-size-btn" data-size="large" aria-label="Texto grande">A</button>
      `;

      nav.appendChild(fontControls);

      // Bind events
      fontControls.addEventListener('click', (e) => {
        if (e.target.classList.contains('font-size-btn')) {
          this.setFontSize(e.target.dataset.size);
        }
      });
    },

    setFontSize: function(size) {
      const root = document.documentElement;
      const buttons = document.querySelectorAll('.font-size-btn');

      // Remove active class from all buttons
      buttons.forEach(btn => btn.classList.remove('active'));

      // Add active class to selected button
      const activeButton = document.querySelector(`[data-size="${size}"]`);
      if (activeButton) activeButton.classList.add('active');

      // Apply font size
      switch (size) {
        case 'small':
          root.style.fontSize = '14px';
          break;
        case 'large':
          root.style.fontSize = '18px';
          break;
        default:
          root.style.fontSize = '16px';
      }

      Utils.storage.set(CONFIG.storageKeys.fontSize, size);
    },

    loadFontSizePreference: function() {
      const savedSize = Utils.storage.get(CONFIG.storageKeys.fontSize, 'normal');
      this.setFontSize(savedSize);
    },

    enhanceKeyboardNavigation: function() {
      // Add focus indicators for better keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-navigation');
        }
      });

      document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
      });

      // Improve focus management for interactive elements
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      interactiveElements.forEach(element => {
        element.addEventListener('focus', () => {
          element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
      });
    },

    addSkipLinks: function() {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link sr-only';
      skipLink.textContent = 'Saltar al contenido principal';

      skipLink.addEventListener('focus', () => {
        skipLink.classList.remove('sr-only');
      });

      skipLink.addEventListener('blur', () => {
        skipLink.classList.add('sr-only');
      });

      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  };

  // =====================================================
  // NAVEGACIÓN MEJORADA
  // =====================================================

  const Navigation = {
    init: function() {
      this.enhanceMobileMenu();
      this.addActiveStates();
      this.setupSmoothScrolling();
    },

    enhanceMobileMenu: function() {
      const trigger = document.querySelector('.site-nav .menu-icon');
      const menu = document.querySelector('.site-nav .trigger');

      if (!trigger || !menu) return;

      trigger.addEventListener('click', () => {
        const isOpen = menu.classList.contains('active');

        if (isOpen) {
          menu.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          menu.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.site-nav')) {
          menu.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    },

    addActiveStates: function() {
      const currentPath = window.location.pathname;
      const navLinks = document.querySelectorAll('.site-nav .page-link');

      navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
          link.classList.add('current');
        }
      });
    },

    setupSmoothScrolling: function() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();

          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            Utils.scrollToElement(target, 80);
          }
        });
      });
    }
  };

  // =====================================================
  // NOTIFICACIONES Y FEEDBACK
  // =====================================================

  const Notifications = {
    init: function() {
      this.createContainer();
    },

    createContainer: function() {
      const container = document.createElement('div');
      container.id = 'notifications-container';
      container.className = 'notifications-container';
      document.body.appendChild(container);
    },

    show: function(message, type = 'info', duration = 5000) {
      const container = document.getElementById('notifications-container');
      if (!container) return;

      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
        <div class="notification-content">
          <span class="notification-message">${message}</span>
          <button class="notification-close" aria-label="Cerrar notificación">×</button>
        </div>
      `;

      container.appendChild(notification);

      // Auto remove
      const autoRemove = setTimeout(() => {
        this.remove(notification);
      }, duration);

      // Manual close
      const closeBtn = notification.querySelector('.notification-close');
      closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        this.remove(notification);
      });

      // Animate in
      requestAnimationFrame(() => {
        notification.classList.add('notification-show');
      });
    },

    remove: function(notification) {
      notification.classList.add('notification-hide');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  };

  // =====================================================
  // ANALÍTICAS Y TRACKING
  // =====================================================

  const Analytics = {
    init: function() {
      this.trackPageViews();
      this.trackInteractions();
      this.trackPerformance();
    },

    trackPageViews: function() {
      // Solo en producción y con consentimiento
      if (window.location.hostname === 'localhost') return;

      console.log('Page view tracked:', {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString()
      });
    },

    trackInteractions: function() {
      // Track button clicks
      document.addEventListener('click', (e) => {
        if (e.target.matches('.btn, .feedback-btn, .search-result-item')) {
          console.log('Interaction tracked:', {
            element: e.target.className,
            text: e.target.textContent.trim(),
            url: e.target.href || null,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Track search queries
      const searchInput = document.getElementById('site-search');
      if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce((e) => {
          if (e.target.value.length >= CONFIG.searchMinLength) {
            console.log('Search tracked:', {
              query: e.target.value,
              timestamp: new Date().toISOString()
            });
          }
        }, 1000));
      }
    },

    trackPerformance: function() {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          console.log('Performance tracked:', {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
            timestamp: new Date().toISOString()
          });
        }, 0);
      });
    }
  };

  // =====================================================
  // INICIALIZACIÓN
  // =====================================================

  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initModules);
    } else {
      initModules();
    }
  }

  function initModules() {
    try {
      DarkMode.init();
      Search.init();
      Accessibility.init();
      Navigation.init();
      Notifications.init();
      Analytics.init();

      console.log('🛡️ Seguridad Digital Familiar - JavaScript inicializado correctamente');
    } catch (error) {
      console.error('Error inicializando módulos:', error);
    }
  }

  // Start the application
  init();

  // Expose utilities globally for debugging
  if (window.location.hostname === 'localhost') {
    window.SDF = {
      Utils,
      DarkMode,
      Search,
      Accessibility,
      Navigation,
      Notifications,
      Analytics
    };
  }

})();
