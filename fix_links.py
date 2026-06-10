import re

def get_all_headings(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    headings = re.findall(r'^(#+)\s+(.*)', content, re.MULTILINE)
    return headings

def get_all_links(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    links = re.findall(r'\[(.*?)\]\((.*?)\)', content)
    return links

def main():
    # Fix INDICE-INTERACTIVO.md
    file_path = 'INDICE-INTERACTIVO.md'
    
    replacements = {
        "/GuiaParaPadres/casos-uso-especificos/#crisis-digital": "/GuiaParaPadres/casos-uso-especificos/#protocolo-de-crisis-digital",
        "/GuiaParaPadres/controles-consolas/#bloquear-compras": "/GuiaParaPadres/controles-consolas/#-bloqueo-de-compras-y-gastos",
        "/GuiaParaPadres/control-red-hogares/#filtrado": "/GuiaParaPadres/control-red-hogares/#-filtrado-de-contenido-dns",
        "/GuiaParaPadres/apps-0-3-anos/#actividades-offline": "/GuiaParaPadres/apps-0-3-anos/#-alternativas-saludables-juegos-sin-pantalla",
        "/GuiaParaPadres/apps-4-6-anos/#criterios-seleccion": "/GuiaParaPadres/apps-4-6-anos/#-criterios-para-seleccionar-apps-de-calidad",
        "/GuiaParaPadres/controles-adolescentes/#comunicacion": "/GuiaParaPadres/controles-adolescentes/#-estrategias-de-comunicaci%C3%B3n-y-negociaci%C3%B3n",
        "/GuiaParaPadres/controles-adolescentes/#negociacion": "/GuiaParaPadres/controles-adolescentes/#-estrategias-de-comunicaci%C3%B3n-y-negociaci%C3%B3n",
        "/GuiaParaPadres/controles-adolescentes/#autonomia": "/GuiaParaPadres/controles-adolescentes/#-fomentando-la-autonom%C3%ADa-y-la-confianza",
        "/GuiaParaPadres/controles-consolas/#bloquear-compras": "/GuiaParaPadres/controles-consolas/#-bloqueo-de-compras-y-gastos",
        "/GuiaParaPadres/controles-adolescentes/#preparacion-redes": "/GuiaParaPadres/controles-adolescentes/#-preparaci%C3%B3n-para-el-uso-de-redes-sociales",
        "/GuiaParaPadres/controles-smart-tv/#limites-tiempo": "/GuiaParaPadres/controles-smart-tv/#-establecimiento-de-l%C3%ADmites-de-tiempo",
        "/GuiaParaPadres/controles-smart-tv/#perfiles": "/GuiaParaPadres/controles-smart-tv/#-creaci%C3%B3n-de-perfiles-infantiles",
        "/GuiaParaPadres/control-red-hogares/#deteccion-vpn": "/GuiaParaPadres/control-red-hogares/#-estrategias-avanzadas-bloqueo-de-vpn-y-dns-seguro",
        "/GuiaParaPadres/control-red-hogares/#control-centralizado": "/GuiaParaPadres/control-red-hogares/#-ventajas-de-un-control-centralizado",
        "/GuiaParaPadres/guia-maestros/#protocolos-aula": "/GuiaParaPadres/guia-maestros/#-protocolos-y-estrategias-para-el-aula",
        "/GuiaParaPadres/guia-maestros/#comunicacion": "/GuiaParaPadres/guia-maestros/#-estrategias-de-comunicaci%C3%B3n-con-padres",
        "/GuiaParaPadres/guia-maestros/#crisis": "/GuiaParaPadres/guia-maestros/#-manejo-de-crisis-y-protocolos-de-actuaci%C3%B3n",
        "/GuiaParaPadres/control-red-escuelas/#politicas": "/GuiaParaPadres/control-red-escuelas/#-desarrollo-de-pol%C3%ADticas-de-uso-aceptable-pua",
        "/GuiaParaPadres/guia-maestros/#capacitacion": "/GuiaParaPadres/guia-maestros/#-recursos-y-capacitaci%C3%B3n-para-docentes",
        "/GuiaParaPadres/control-red-escuelas/#chromebooks": "/GuiaParaPadres/control-red-escuelas/#-configuraci%C3%B3n-de-chromebooks",
        "/GuiaParaPadres/control-red-hogares/#tp-link": "/GuiaParaPadres/control-red-hogares/#tp-link",
        "/GuiaParaPadres/control-red-hogares/#netgear": "/GuiaParaPadres/control-red-hogares/#netgear",
        "/GuiaParaPadres/control-red-hogares/#asus": "/GuiaParaPadres/control-red-hogares/#asus",
        "/GuiaParaPadres/control-red-hogares/#linksys": "/GuiaParaPadres/control-red-hogares/#linksys",
        "/GuiaParaPadres/control-red-hogares/#identificacion": "/GuiaParaPadres/control-red-hogares/#-c%C3%B3mo-identificar-la-marca-y-modelo-de-tu-router",
        "/GuiaParaPadres/seguridad-adolescentes/#comunicacion": "/GuiaParaPadres/seguridad-adolescentes/#-estrategias-de-comunicaci%C3%B3n-y-monitoreo",
        "/GuiaParaPadres/controles-adolescentes/#limites-academicos": "/GuiaParaPadres/controles-adolescentes/#-balance-entre-vida-digital-y-responsabilidades",
        "/GuiaParaPadres/guia-maestros/#curriculo": "/GuiaParaPadres/guia-maestros/#-integraci%C3%B3n-curricular-de-la-ciudadan%C3%ADa-digital",
        'Materiales de presentación': 'Recursos Multimedia',
        'Documentos imprimibles': 'Recursos Multimedia',
    }
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old_link, new_link in replacements.items():
        content = content.replace(old_link, new_link)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    # Fix pantallas-autismo.md
    file_path = 'pantallas-autismo.md'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("/GuiaParaPadres/casos-uso-especificos/#crisis-digital", "/GuiaParaPadres/casos-uso-especificos/#protocolo-de-crisis-digital")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    main()