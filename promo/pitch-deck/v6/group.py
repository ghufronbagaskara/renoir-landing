"""Wrap each slide in one editable DrawingML group without UI-only Group()."""
import os
import re
import sys
import zipfile
from pathlib import Path
from lxml import etree as ET

path = Path(sys.argv[1]).resolve()
assert path.parent.name == 'v6' and path.suffix == '.pptx'
ns = {'p':'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
for prefix, uri in ns.items():
    ET.register_namespace(prefix, uri)
ET.register_namespace('r','http://schemas.openxmlformats.org/officeDocument/2006/relationships')
tag = lambda prefix, name: '{'+ns[prefix]+'}'+name
temporary = path.with_name('grouped-v6.tmp.pptx')
count = 0
with zipfile.ZipFile(path) as source, zipfile.ZipFile(temporary,'w',zipfile.ZIP_DEFLATED) as dest:
    for info in source.infolist():
        data = source.read(info.filename)
        if re.fullmatch(r'ppt/slides/slide\d+\.xml',info.filename):
            slide = ET.fromstring(data)
            tree = slide.find('p:cSld/p:spTree',ns)
            members = [child for child in tree if child.tag not in (tag('p','nvGrpSpPr'),tag('p','grpSpPr'),tag('p','extLst'))]
            assert len(members) >= 5
            maximum = max(int(s.get('id')) for s in tree.findall('.//p:cNvPr',ns))
            group = ET.Element(tag('p','grpSp'))
            nv = ET.SubElement(group,tag('p','nvGrpSpPr'))
            ET.SubElement(nv,tag('p','cNvPr'),id=str(maximum+1),name='Katalhys V6 entire slide')
            ET.SubElement(nv,tag('p','cNvGrpSpPr'))
            ET.SubElement(nv,tag('p','nvPr'))
            props = ET.SubElement(group,tag('p','grpSpPr'))
            xfrm = ET.SubElement(props,tag('a','xfrm'))
            for name, attrs in [('off',{'x':'0','y':'0'}),('ext',{'cx':'12192000','cy':'6858000'}),('chOff',{'x':'0','y':'0'}),('chExt',{'cx':'12192000','cy':'6858000'})]:
                ET.SubElement(xfrm,tag('a',name),attrs)
            for member in members:
                tree.remove(member)
                group.append(member)
            extension = tree.find('p:extLst',ns)
            tree.insert(list(tree).index(extension) if extension is not None else len(tree),group)
            timing = slide.find('p:timing',ns)
            if timing is not None:
                slide.remove(timing)
            assert len(group) == len(members)+2
            data = ET.tostring(slide,encoding='utf-8',xml_declaration=True)
            count += 1
        dest.writestr(info,data)
assert count == 39
with zipfile.ZipFile(temporary) as check:
    assert check.testzip() is None
os.replace(temporary,path)
print(f'Grouped {count} pages without changing slide identities or media')
