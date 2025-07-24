source "https://rubygems.org"

# Usar solo github-pages para máxima compatibilidad
gem "github-pages", group: :jekyll_plugins

# Dependencias específicas para diferentes plataformas
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster para Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Requerido para Jekyll 4+
gem "webrick", "~> 1.8" 