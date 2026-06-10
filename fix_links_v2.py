import re
import os
from urllib.parse import unquote

def generate_anchor(heading):
    # This is a simplified anchor generation function.
    # It may not match exactly what the markdown renderer does in all cases.
    anchor = heading.lower()
    anchor = re.sub(r'[^a-z0-9\s-]', '', anchor)
    anchor = re.sub(r'\s+', '-', anchor)
    return '#' + anchor

def find_best_match(headings, broken_anchor):
    # This is a simple matching algorithm. It might not always find the correct heading.
    broken_anchor = broken_anchor.replace('%c3%b3', 'o').replace('%c3%a1', 'a').replace('%c3%a9', 'e').replace('%c3%ad', 'i').replace('%c3%ba', 'u')
    best_match = None
    max_similarity = 0
    
    for heading in headings:
        # Simple similarity check
        similarity = len(set(heading.lower().split()) & set(unquote(broken_anchor).lower().split()))
        if similarity > max_similarity:
            max_similarity = similarity
            best_match = heading
            
    return best_match

def main():
    broken_links_output = """
    pantallas-autismo.md:332: /GuiaParaPadres/casos-uso-especificos/#crisis-digital (Anchor '#crisis-digital' not found in casos-uso-especificos.md)
    INDICE-INTERACTIVO.md:26: /GuiaParaPadres/controles-consolas/#bloquear-compras (Anchor '#bloquear-compras' not found in controles-consolas.md)
    INDICE-INTERACTIVO.md:26: /GuiaParaPadres/control-red-hogares/#filtrado (Anchor '#filtrado' not found in control-red-hogares.md)
    INDICE-INTERACTIVO.md:43: /GuiaParaPadres/apps-0-3-anos/#actividades-offline (Anchor '#actividades-offline' not found in apps-0-3-anos.md)
    INDICE-INTERACTIVO.md:53: /GuiaParaPadres/apps-4-6-anos/#criterios-seleccion (Anchor '#criterios-seleccion' not found in apps-4-6-anos.md)
    INDICE-INTERACTIVO.md:72: /GuiaParaPadres/controles-adolescentes/#comunicacion (Anchor '#comunicacion' not found in controles-adolescentes.md)
    INDICE-INTERACTIVO.md:95: /GuiaParaPadres/controles-adolescentes/#negociacion (Anchor '#negociacion' not found in controles-adolescentes.md)
    INDICE-INTERACTIVO.md:101: /GuiaParaPadres/controles-adolescentes/#autonomia (Anchor '#autonomia' not found in controles-adolescentes.md)
    INDICE-INTERACTIVO.md:117: /GuiaParaPadres/controles-consolas/#bloquear-compras (Anchor '#bloquear-compras' not found in controles-consolas.md)
    INDICE-INTERACTIVO.md:135: /GuiaParaPadres/controles-adolescentes/#preparacion-redes (Anchor '#preparacion-redes' not found in controles-adolescentes.md)
    INDICE-INTERACTIVO.md:148: /GuiaParaPadres/controles-smart-tv/#limites-tiempo (Anchor '#limites-tiempo' not found in controles-smart-tv.md)
    INDICE-INTERACTIVO.md:151: /GuiaParaPadres/controles-smart-tv/#perfiles (Anchor '#perfiles' not found in controles-smart-tv.md)
    INDICE-INTERACTIVO.md:161: /GuiaParaPadres/control-red-hogares/#deteccion-vpn (Anchor '#deteccion-vpn' not found in control-red-hogares.md)
    INDICE-INTERACTIVO.md:167: /GuiaParaPadres/control-red-hogares/#control-centralizado (Anchor '#control-centralizado' not found in control-red-hogares.md)
    INDICE-INTERACTIVO.md:181: /GuiaParaPadres/guia-maestros/#protocolos-aula (Anchor '#protocolos-aula' not found in guia-maestros.md)
    INDICE-INTERACTIVO.md:184: /GuiaParaPadres/guia-maestros/#comunicacion (Anchor '#comunicacion' not found in guia-maestros.md)
    INDICE-INTERACTIVO.md:187: /GuiaParaPadres/guia-maestros/#crisis (Anchor '#crisis' not found in guia-maestros.md)
    INDICE-INTERACTIVO.md:197: /GuiaParaPadres/control-red-escuelas/#politicas (Anchor '#politicas' not found in control-red-escuelas.md)
    INDICE-INTERACTIVO.md:200: /GuiaParaPadres/guia-maestros/#crisis (Anchor '#crisis' not found in guia-maestros.md)
    INDICE-INTERACTIVO.md:203: /GuiaParaPadres/guia-maestros/#capacitacion (Anchor '#capacitacion' not found in guia-maestros.md)
    INDICE-INTERACTIVO.md:244: /GuiaParaPadres/control-red-escuelas/#chromebooks (Anchor '#chromebooks' not found in control-red-escuelas.md)
    INDICE-INTERACTIVO.md:252: /GuiaParaPadres/control-red-hogares/#tp-link (Anchor '#tp-link' not found in control-red-hogares.md)
    INDICE-INTERACTIVO.md:253: /GuiaParaPadres/control-red-hogares/#netgear (Anchor '#netgear' not found in control-red-hogares.md)
    INDICE-INTERACTIVO.md:254: /GuiaParaPadres/control-red-hogares/#asus (Anchor '#asus' not found in control-red-hogares.md)
    INDICE-INTERACTIVO.md:255: /GuiaParaPadres/control-red-hogares/#linksys (Anchor '#linksys' not found in control-red-hogares.md)
    INDICE-INTERACTIVO.md:256: /GuiaParaPadres/control-red-hogares/#identificacion (Anchor '#identificacion' not found in control-red-hogares.md)
    INDICE-INTERACTIVO.md:269: /GuiaParaPadres/control-red-hogares/#filtrado (Anchor '#filtrado' not found in control-red-hogares.md)
    INDICE-INTERACTIVO.md:270: /GuiaParaPadres/seguridad-adolescentes/#comunicacion (Anchor '#comunicacion' not found in seguridad-adolescentes.md)
    INDICE-INTERACTIVO.md:272: /GuiaParaPadres/controles-consolas/#bloquear-compras (Anchor '#bloquear-compras' not found in controles-consolas.md)
    INDICE-INTERACTIVO.md:281: /GuiaParaPadres/controles-adolescentes/#limites-academicos (Anchor '#limites-academicos' not found in controles-adolescentes.md)
    INDICE-INTERACTIVO.md:283: /GuiaParaPadres/controles-adolescentes/#comunicacion (Anchor '#comunicacion' not found in controles-adolescentes.md)
    INDICE-INTERACTIVO.md:283: /GuiaParaPadres/controles-adolescentes/#preparacion-redes (Anchor '#preparacion-redes' not found in controles-adolescentes.md)
    INDICE-INTERACTIVO.md:319: /GuiaParaPadres/controles-adolescentes/#comunicacion (Anchor '#comunicacion' not found in controles-adolescentes.md)
    INDICE-INTERACTIVO.md:371: /GuiaParaPadres/control-red-hogares/#filtrado (Anchor '#filtrado' not found in control-red-hogares.md)
    INDICE-INTERACTIVO.md:373: /GuiaParaPadres/seguridad-adolescentes/#comunicacion (Anchor '#comunicacion' not found in seguridad-adolescentes.md)
    INDICE-INTERACTIVO.md:451: /GuiaParaPadres/guia-maestros/#curriculo (Anchor '#curriculo' not found in guia-maestros.md)
    INDICE-INTERACTIVO.md:452: /GuiaParaPadres/guia-maestros/#crisis (Anchor '#crisis' not found in guia-maestros.md)
    INDICE-INTERACTIVO.md:453: /GuiaParaPadres/guia-maestros/#comunicacion (Anchor '#comunicacion' not found in guia-maestros.md)
    """
    
    for line in broken_links_output.strip().split('
'):
        parts = line.split(': ')
        file_with_broken_link = parts[0]
        broken_link_full = parts[2].split(' ')[0]
        
        broken_link_path, broken_anchor = broken_link_full.split('#')
        target_file_path = broken_link_path.split('/')[-1] + '.md'
        
        if not os.path.exists(target_file_path):
            # This is to handle the '/GuiaParaPadres/' prefix
            target_file_path = broken_link_path.split('/')[-1]
        
        if not os.path.exists(target_file_path):
            # This is to handle cases where the file is in the root
            target_file_path = broken_link_path[1:] + '.md'

        try:
            with open(target_file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except FileNotFoundError:
            print(f"File not found: {target_file_path}")
            continue
            
        headings = [h[1] for h in re.findall(r'^(#+)\s+(.*)', content, re.MULTILINE)]
        
        best_match_heading = find_best_match(headings, broken_anchor)
        
        if best_match_heading:
            correct_anchor = generate_anchor(best_match_heading)
            correct_link = broken_link_path + correct_anchor
            
            with open(file_with_broken_link, 'r', encoding='utf-8') as f:
                file_content = f.read()
            
            file_content = file_content.replace(broken_link_full, correct_link)
            
            with open(file_with_broken_link, 'w', encoding='utf-8') as f:
                f.write(file_content)
        else:
            print(f"Could not find a matching heading for anchor {broken_anchor} in {target_file_path}")

    # Also fix the links in INDICE-INTERACTIVO.md that were requested in the prompt
    file_path = 'INDICE-INTERACTIVO.md'
    
    replacements = {
        'Materiales de presentación': 'Recursos Multimedia',
        'Documentos imprimibles': 'Recursos Multimedia',
    }
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old_link, new_link in replacements.items():
        content = content.replace(old_link, new_link)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    main()