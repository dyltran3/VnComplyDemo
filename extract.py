import zipfile, xml.etree.ElementTree as ET
import sys

def parse(filename, output_filename):
    try:
        z = zipfile.ZipFile(filename)
        tree = ET.fromstring(z.read('word/document.xml'))
        lines = []
        for p in tree.findall('.//w:p', {'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}):
            text = ''.join(n.text for n in p.findall('.//w:t', {'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}) if n.text)
            if text:
                lines.append(text)
        with open(output_filename, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))
        print(f"Extracted {filename} to {output_filename}")
    except Exception as e:
        print(f"Error parsing {filename}: {e}")

parse(r'c:\Users\TuanAnh\OneDrive\Documents\GitHub\VnComplyDemo\docs\VnComply_PhanTich_ToanDien.docx', 'docs/comprehensive_analysis.txt')
parse(r'c:\Users\TuanAnh\OneDrive\Documents\GitHub\VnComplyDemo\docs\VnComply_Demo_Tasks.docx', 'docs/parsed_tasks.txt')

