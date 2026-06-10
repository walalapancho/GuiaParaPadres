import os
import re

def get_markdown_files(root_dir):
    md_files = []
    for root, dirs, files in os.walk(root_dir):
        if '_site' in dirs:
            dirs.remove('_site')
        for file in files:
            if file.endswith('.md'):
                md_files.append(os.path.join(root, file))
    return md_files

def get_all_files(root_dir):
    all_files = set()
    for root, dirs, files in os.walk(root_dir):
        if '_site' in dirs:
            dirs.remove('_site')
        for file in files:
            rel_path = os.path.relpath(os.path.join(root, file), root_dir)
            all_files.add(rel_path)
            # Also add path without extension for some link types
            all_files.add(os.path.splitext(rel_path)[0])
    return all_files

def get_permalinks(md_files):
    permalinks = {}
    permalink_re = re.compile(r'^permalink:\s*(.*)', re.MULTILINE)
    for md_file in md_files:
        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()
            match = permalink_re.search(content)
            if match:
                permalink = match.group(1).strip()
                permalinks[permalink] = md_file
                # Also handle permalinks without trailing slash
                if permalink.endswith('/'):
                    permalinks[permalink[:-1]] = md_file
                else:
                    permalinks[permalink + '/'] = md_file
    return permalinks

def check_links():
    root_dir = os.getcwd()
    md_files = get_markdown_files(root_dir)
    all_files = get_all_files(root_dir)
    permalinks = get_permalinks(md_files)
    
    # site.baseurl is /GuiaParaPadres but in source it's just {{ site.baseurl }}
    # Some links also hardcode /GuiaParaPadres/
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
                for link in links:
                    if link.startswith('http') or link.startswith('#') or link.startswith('mailto:') or link.startswith('tel:'):
                        continue
                    
                    original_link = link
                    # Strip anchor
                    link = link.split('#')[0]
                    if not link:
                        continue

                    # Handle {{ site.baseurl }} and hardcoded /GuiaParaPadres
                    link = link.replace('{{ site.baseurl }}', '')
                    if link.startswith('/GuiaParaPadres'):
                        link = link[len('/GuiaParaPadres'):]
                    
                    # If link is empty after removing baseurl (it was just baseurl)
                    if not link or link == '/':
                        if '/' not in permalinks:
                            broken_links.append((rel_source, line_no, original_link, "Root / not found in permalinks"))
                        continue

                    # Check permalinks
                    if link in permalinks:
                        continue
                    
                    # Check as direct file path
                    # Remove leading slash for file path check if it's absolute-like from root
                    file_path_to_check = link.lstrip('/')
                    # Handle URL encoded spaces
                    file_path_to_check = file_path_to_check.replace('%20', ' ')
                    
                    # Try relative path
                    rel_link = os.path.join(os.path.dirname(rel_source), file_path_to_check)
                    rel_link = os.path.normpath(rel_link)

                    if file_path_to_check in all_files or rel_link in all_files:
                        continue
                    
                    # Some links might not have .md extension but refer to .md files
                    if file_path_to_check + '.md' in all_files or (rel_link + '.md') in all_files:
                        continue
                        
                    broken_links.append((rel_source, line_no, original_link, "File or permalink not found"))

    return broken_links

if __name__ == "__main__":
    broken = check_links()
    if not broken:
        print("No broken internal links found.")
    else:
        print(f"Found {len(broken)} broken internal links:")
        for source, line, link, reason in broken:
            print(f"{source}:{line}: {link} ({reason})")
