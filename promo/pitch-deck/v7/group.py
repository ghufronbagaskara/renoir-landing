"""Group the appended page only; preserve every original slide XML byte."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from lxml import etree as E
import os
import sys
path=Path(sys.argv[1]).resolve()
assert path.parent.name=='v7' and path.suffix=='.pptx'
ns={'p':'http://schemas.openxmlformats.org/presentationml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
tag=lambda pre,name:'{'+ns[pre]+'}'+name
temp=path.with_suffix('.grouped.pptx')
with ZipFile(path) as src,ZipFile(temp,'w',ZIP_DEFLATED) as dest:
    presentation=E.fromstring(src.read('ppt/presentation.xml'))
    ids=presentation.findall('p:sldIdLst/p:sldId',ns)
    assert len(ids)==40
    rels={r.get('Id'):r.get('Target') for r in E.fromstring(src.read('ppt/_rels/presentation.xml.rels'))}
    target=rels[ids[-1].get(tag('r','id'))]
    name=target.lstrip('/') if target.startswith('/') else 'ppt/'+target
    for item in src.infolist():
        data=src.read(item.filename)
        if item.filename==name:
            slide=E.fromstring(data);tree=slide.find('p:cSld/p:spTree',ns)
            members=[c for c in tree if c.tag not in (tag('p','nvGrpSpPr'),tag('p','grpSpPr'),tag('p','extLst'))]
            maximum=max(int(n.get('id')) for n in tree.findall('.//p:cNvPr',ns))
            group=E.Element(tag('p','grpSp'));nv=E.SubElement(group,tag('p','nvGrpSpPr'))
            E.SubElement(nv,tag('p','cNvPr'),id=str(maximum+1),name='Katalhys V7 entire slide')
            E.SubElement(nv,tag('p','cNvGrpSpPr'));E.SubElement(nv,tag('p','nvPr'))
            props=E.SubElement(group,tag('p','grpSpPr'));xf=E.SubElement(props,tag('a','xfrm'))
            for n,attrs in [('off',{'x':'0','y':'0'}),('ext',{'cx':'12192000','cy':'6858000'}),('chOff',{'x':'0','y':'0'}),('chExt',{'cx':'12192000','cy':'6858000'})]:E.SubElement(xf,tag('a',n),attrs)
            for c in members:tree.remove(c);group.append(c)
            tree.append(group)
            data=E.tostring(slide,encoding='utf-8',xml_declaration=True)
        dest.writestr(item,data)
with ZipFile(temp) as check:assert check.testzip() is None
os.replace(temp,path)
print('Grouped new appendix; existing slide parts unchanged')
