import os
import re

def get_markdown_files(root_dir):
    md_files = []
    for root, dirs, files in os.walk(root_dir):
        if '_site' in dirs:
            dirs.remove('_site')
        if 'registro de cambios' in dirs:
            dirs.remove('registro de cambios')
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))
    return md_files

def get_all_files(root_dir):
    all_files = {}
    for root, dirs, files in os.walk(root_dir):
        if '_site' in dirs:
            dirs.remove('_site')
        if 'registro de cambios' in dirs:
            dirs.remove('registro de cambios')
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, root_dir)
            all_files[rel_path] = full_path
    return all_files

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s]+', '-', text)
    return text.strip('-')

def get_anchors_from_content(content):
    anchors = set()
    # Heading anchors
    heading_re = re.compile(r'^(#+)\s+(.*?)(?:\s+\{#(.*?)\})?$', re.MULTILINE)
    for match in heading_re.finditer(content):
        _, title, manual_id = match.groups()
        if manual_id:
            anchors.add(manual_id)
        else:
            anchors.add(slugify(title))
    
    # Explicit anchors <a id="anchor"></a> or <div id="anchor"></div> or {#anchor}
    id_re = re.compile(r'id=["\'](.*?)["\']')
    for match in id_re.finditer(content):
        anchors.add(match.group(1))
        
    explicit_anchor_re = re.compile(r'\{#([\w-]+)\}')
    for match in explicit_anchor_re.finditer(content):
        anchors.add(match.group(1))
        
    return anchors

def get_metadata(md_files):
    metadata = {}
    permalink_re = re.compile(r'^permalink:\s*(.*)', re.MULTILINE)
    for md_file in md_files:
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
            match = permalink_re.search(content)
            permalink = match.group(1).strip() if match else None
            anchors = get_anchors_from_content(content)
            metadata[md_file] = {
                'permalink': permalink,
                'anchors': anchors
            }
    return metadata

def check_links():
    root_dir = os.getcwd()
    md_files = get_markdown_files(root_dir)
    all_files = get_all_files(root_dir)
    metadata = get_metadata(md_files)
    
    # Reverse map for permalinks
    permalinks = {}
    for md_file, data in metadata.items():
        if data['permalink']:
            p = data['permalink']
            permalinks[p] = md_file
            if p.endswith('/'):
                permalinks[p[:-1]] = md_file
            else:
                permalinks[p + '/'] = md_file

    link_re = re.compile(r'\[.*?\]\((.*?)\)')
    broken_links = []
    
    for md_file in md_files:
        rel_source = os.path.relpath(md_file, root_dir)
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Remove code blocks and inline code
            content = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
            content = re.sub(r'`.*?`', '', content)
            
            lines = content.splitlines()
            for line_no, line in enumerate(lines, 1):
                links = link_re.findall(line)
                for original_link in links:
                    if original_link.startswith(('http', 'mailto:', 'tel:')):
                        continue
                    
                    # Split link and anchor
                    parts = original_link.split('#')
                    link_part = parts[0]
                    anchor_part = parts[1] if len(parts) > 1 else None
                    
                    target_file = None
                    
                    if not link_part:
                        # Same file anchor
                        target_file = md_file
                    else:
                        # Handle baseurl
                        processed_link = link_part.replace('{{ site.baseurl }}', '')
                        if processed_link.startswith('/GuiaParaPadres'):
                            processed_link = processed_link[len('/GuiaParaPadres'):]
                        
                        # Check permalinks
                        if processed_link in permalinks:
                            target_file = permalinks[processed_link]
                        elif processed_link == '/' or processed_link == '':
                             if '/' in permalinks:
                                 target_file = permalinks['/']
                             else:
                                 # index.md is usually /
                                 target_file = os.path.join(root_dir, 'index.md')
                        else:
                            # Try as file path
                            file_path = processed_link.lstrip('/')
                            file_path = file_path.replace('%20', ' ')
                            
                            # Relative path
                            rel_link = os.path.join(os.path.dirname(md_file), file_path)
                            rel_link = os.path.normpath(rel_link)
                            
                            if os.path.exists(rel_link) and os.path.isfile(rel_link):
                                target_file = rel_link
                            elif os.path.exists(os.path.join(root_dir, file_path)) and os.path.isfile(os.path.join(root_dir, file_path)):
                                target_file = os.path.join(root_dir, file_path)
                            elif os.path.exists(rel_link + '.md') and os.path.isfile(rel_link + '.md'):
                                target_file = rel_link + '.md'
                            elif os.path.exists(os.path.join(root_dir, file_path + '.md')) and os.path.isfile(os.path.join(root_dir, file_path + '.md')):
                                target_file = os.path.join(root_dir, file_path + '.md')

                    if not target_file:
                        broken_links.append((rel_source, line_no, original_link, "File/Permalink not found"))
                    elif anchor_part:
                        # Check anchor in target file
                        if target_file in metadata:
                            if anchor_part not in metadata[target_file]['anchors']:
                                # Try slugifying anchor_part just in case
                                slugified_anchor = slugify(anchor_part)
                                if slugified_anchor not in metadata[target_file]['anchors']:
                                    broken_links.append((rel_source, line_no, original_link, f"Anchor '#{anchor_part}' not found in {os.path.relpath(target_file, root_dir)}"))
                        else:
                            # Not a markdown file, cannot check anchors easily but let's assume it's OK if it's not .md
                            if target_file.endswith('.md'):
                                 broken_links.append((rel_source, line_no, original_link, f"Target {os.path.relpath(target_file, root_dir)} not indexed for anchors"))

    return broken_links

if __name__ == "__main__":
    broken = check_links()
    if not broken:
        print("No broken internal links found.")
    else:
        print(f"Found {len(broken)} broken internal links:")
        for source, line, link, reason in broken:
            print(f"{source}:{line}: {link} ({reason})")
