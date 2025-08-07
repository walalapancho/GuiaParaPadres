
(function() {
  // Función para aplicar el tema
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    var switcher = document.getElementById('theme-switcher');
    if (switcher) {
      switcher.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // Obtener el tema guardado o usar el oscuro por defecto
  var savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  // Esperar a que el DOM esté cargado para añadir el evento al botón
  document.addEventListener('DOMContentLoaded', function() {
    var switcher = document.getElementById('theme-switcher');
    if (switcher) {
      switcher.addEventListener('click', function() {
        var currentTheme = document.documentElement.getAttribute('data-theme');
        var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    }
  });
})();
