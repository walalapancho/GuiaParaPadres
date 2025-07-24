// ===========================================
// NAVEGACIÓN MEJORADA - BIBLIOTECA SEGURIDAD DIGITAL
// ===========================================

class NavigationEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.setupReadingProgress();
    this.generateTOC();
    this.setupTOCToggle();
    this.setupBackToTop();
    this.setupFeedback();
    this.setupSmoothScrolling();
    this.setupKeyboardNavigation();
    this.setupLazyLoading();
    this.trackPageViews();
  }

  // =======================================
  // BARRA DE PROGRESO DE LECTURA
  // =======================================
  setupReadingProgress() {
    let progressBar = document.getElementById('reading-progress');
    if (!progressBar) {
      // Crear la barra si no existe
      progressBar = document.createElement('div');
      progressBar.id = 'reading-progress';
      document.body.insertBefore(progressBar, document.body.firstChild);
    }

    const updateProgress = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = Math.min((winScroll / height) * 100, 100);
      progressBar.style.width = scrolled + '%';
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Llamada inicial
  }

  // =======================================
  // TABLA DE CONTENIDOS AUTOMÁTICA
  // =======================================
  generateTOC() {
    const tocContent = document.getElementById('toc-content');
    if (!tocContent) return;

    const headings = document.querySelectorAll('h2, h3');
    if (headings.length < 2) {
      // Ocultar TOC si hay muy pocos encabezados
      const tocNav = document.getElementById('toc-nav');
      if (tocNav) tocNav.style.display = 'none';
      return;
    }

    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    headings.forEach((heading, index) => {
      // Agregar ID si no tiene uno
      if (!heading.id) {
        heading.id = 'heading-' + index;
      }

      const listItem = document.createElement('li');
      listItem.className = 'toc-item toc-' + heading.tagName.toLowerCase();

      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent.replace(/[📝🔍⚡🎯🚀]/g, '').trim();
      link.className = 'toc-link';

      // Destacar elemento actual al hacer scroll
      this.setupActiveHeading(link, heading);

      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });

    tocContent.appendChild(tocList);
  }

  setupActiveHeading(link, heading) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remover clase active de todos los enlaces
          document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
          // Agregar clase active al enlace actual
          link.classList.add('active');
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '-20% 0px -70% 0px'
    });

    observer.observe(heading);
  }

  // =======================================
  // TOGGLE DE LA TABLA DE CONTENIDOS
  // =======================================
  setupTOCToggle() {
    const toggle = document.getElementById('toc-toggle');
    const content = document.getElementById('toc-content');

    if (!toggle || !content) return;

    toggle.addEventListener('click', () => {
      content.classList.toggle('toc-collapsed');
      const icon = toggle.querySelector('.toc-icon');
      icon.textContent = content.classList.contains('toc-collapsed') ? '▶' : '▼';
      
      // Guardar preferencia en localStorage
      localStorage.setItem('toc-collapsed', content.classList.contains('toc-collapsed'));
    });

    // Restaurar estado anterior
    const wasCollapsed = localStorage.getItem('toc-collapsed') === 'true';
    if (wasCollapsed) {
      toggle.click();
    }
  }

  // =======================================
  // BOTÓN VOLVER ARRIBA
  // =======================================
  setupBackToTop() {
    let backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) {
      backToTopBtn = document.createElement('button');
      backToTopBtn.className = 'back-to-top';
      backToTopBtn.innerHTML = '↑';
      backToTopBtn.title = 'Volver arriba';
      backToTopBtn.setAttribute('aria-label', 'Volver al inicio de la página');
      document.body.appendChild(backToTopBtn);
    }

    // Mostrar/ocultar según scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.style.display = 'flex';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    // Funcionalidad del botón
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =======================================
  // SISTEMA DE FEEDBACK
  // =======================================
  setupFeedback() {
    const feedbackButtons = document.querySelectorAll('.feedback-btn');
    const thankMessage = document.getElementById('feedback-thanks');

    feedbackButtons.forEach(button => {
      button.addEventListener('click', () => {
        const feedback = button.getAttribute('data-feedback');
        const pageUrl = window.location.pathname;

        // Registrar feedback (puedes enviar a analytics aquí)
        this.recordFeedback(feedback, pageUrl);

        // Mostrar mensaje de agradecimiento
        this.showFeedbackThanks(feedbackButtons, thankMessage, feedback);
        
        // Guardar en localStorage para evitar múltiples envíos
        localStorage.setItem(`feedback-${pageUrl}`, feedback);
      });
    });

    // No mostrar feedback si ya se dio opinión
    const pageUrl = window.location.pathname;
    const previousFeedback = localStorage.getItem(`feedback-${pageUrl}`);
    if (previousFeedback) {
      this.showFeedbackThanks(feedbackButtons, thankMessage, previousFeedback);
    }
  }

  recordFeedback(feedback, pageUrl) {
    // Aquí puedes enviar los datos a Google Analytics, etc.
    if (typeof gtag !== 'undefined') {
      gtag('event', 'feedback', {
        'event_category': 'User Engagement',
        'event_label': pageUrl,
        'value': feedback === 'helpful' ? 1 : 0
      });
    }

    console.log('Feedback registrado:', { feedback, pageUrl });
  }

  showFeedbackThanks(buttons, thankMessage, feedback) {
    buttons.forEach(btn => btn.style.display = 'none');
    if (thankMessage) {
      thankMessage.style.display = 'block';
      thankMessage.querySelector('p').textContent = 
        feedback === 'helpful' 
          ? '¡Gracias por tu feedback positivo! 🙏' 
          : '¡Gracias por tu feedback! Trabajaremos en mejorarlo 🙏';
    }
  }

  // =======================================
  // SCROLL SUAVE PARA ENLACES INTERNOS
  // =======================================
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
          // Offset para el header fijo
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Actualizar URL sin saltar
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  // =======================================
  // NAVEGACIÓN POR TECLADO
  // =======================================
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC para cerrar TOC
      if (e.key === 'Escape') {
        const tocContent = document.getElementById('toc-content');
        const tocToggle = document.getElementById('toc-toggle');
        if (tocContent && tocToggle && !tocContent.classList.contains('toc-collapsed')) {
          tocToggle.click();
        }
      }

      // Ctrl/Cmd + K para búsqueda rápida (si existe)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  }

  // =======================================
  // LAZY LOADING PARA IMÁGENES
  // =======================================
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback para navegadores antiguos
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  }

  // =======================================
  // TRACKING BÁSICO DE PÁGINAS
  // =======================================
  trackPageViews() {
    // Registrar tiempo en página
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      if (typeof gtag !== 'undefined') {
        gtag('event', 'timing_complete', {
          'name': 'page_view_time',
          'value': timeSpent
        });
      }
    });
  }
}

// =======================================
// FUNCIONES UTILITARIAS GLOBALES
// =======================================

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('¡Enlace copiado al portapapeles!');
  });
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// =======================================
// INICIALIZACIÓN
// =======================================

document.addEventListener('DOMContentLoaded', () => {
  new NavigationEnhancer();
});

// Manejo de errores global
window.addEventListener('error', (e) => {
  console.error('Error en navegación:', e.error);
}); 