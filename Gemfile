source "https://rubygems.org"

# Gema principal de Jekyll
gem "jekyll", "~> 4.3.0"

# Tema por defecto de Jekyll
gem "minima", "~> 2.5"

# Plugins de Jekyll
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-sitemap", "~> 1.4"
  gem "jekyll-seo-tag", "~> 2.8"
end

# Para compatibilidad con GitHub Pages
gem "github-pages", "~> 228", group: :jekyll_plugins

# Dependencias del sistema
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster para watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Para evitar errores de codificación en Windows
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

# Gema requerida para Jekyll 4.3+
gem "webrick", "~> 1.7" 