"""Check continuity, companion links, and one automatic animation per page."""
from pathlib import Path
from zipfile import ZipFile
from hashlib import sha256
from lxml import etree as E
from pypdf import PdfReader
import json
import re
root=Path(__file__).resolve().parent.parent
build=root/'.build/v7'
manifest=json.loads((build/'manifest.json').read_text())
base=Path(manifest['base'])
assert sha256(base.read_bytes()).hexdigest()==manifest['baseHash']
ns={'p':'http://schemas.openxmlformats.org/presentationml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
def slides(z):
    ids=E.fromstring(z.read('ppt/presentation.xml')).findall('p:sldIdLst/p:sldId',ns)
    rels={r.get('Id'):r.get('Target') for r in E.fromstring(z.read('ppt/_rels/presentation.xml.rels'))}
    return [(s.get('id'), rels[s.get('{'+ns['r']+'}id')]) for s in ids]
def read(z,target):return E.fromstring(z.read(target.lstrip('/') if target.startswith('/') else 'ppt/'+target))
def text(t):return re.sub(r'\s+',' ',' '.join(t.xpath('//a:t/text()',namespaces=ns))).strip()
with ZipFile(base) as old,ZipFile(root/'output/katalhys-pitch-id-v7.pptx') as new:
    before=slides(old);after=slides(new)
    assert len(before)==39 and len(after)==40
    assert [i for i,t in before]==[i for i,t in after[:39]]
    for a,b in zip(before,after):assert text(read(old,a[1]))==text(read(new,b[1])),a[0]
    count=0
    for number,(ident,target) in enumerate(after,1):
        slide=read(new,target);copy=text(slide)
        assert 'Katalhys' in copy and str(number).zfill(2) in copy
        assert not re.search(r'Isaac|Munandar|studio digital|[\u2013\u2014]',copy,re.I)
        assert len(slide.findall('p:cSld/p:spTree/p:grpSp',ns))==1
        effects=slide.xpath('//p:cTn[@presetClass="entr"]',namespaces=ns)
        assert len(effects)==1 and effects[0].get('nodeType')=='withEffect'
        assert effects[0].find('p:stCondLst/p:cond',ns).get('delay')=='0'
        assert not slide.xpath('//p:cTn[@nodeType="clickEffect" or @nodeType="afterEffect"]',namespaces=ns)
        transitions=slide.findall('.//p:transition',ns)
        assert transitions and all(t.find('p:fade',ns) is not None and t.get('advTm') is None for t in transitions)
        count+=len(slide.findall('.//p:sp/p:txBody',ns))
    assert E.fromstring(new.read('ppt/presentation.xml')).find('p:embeddedFontLst',ns) is not None
    targets=[r.get('Target') for n in new.namelist() if n.endswith('.rels') for r in E.fromstring(new.read(n)) if r.get('TargetMode')=='External']
    assert 'sales-playbook/index.html' in targets and 'sales-playbook/modul-sales.pdf' in targets,targets
    assert not any(n.endswith('vbaProject.bin') for n in new.namelist())
    last=text(read(new,after[-1][1]));assert 'data simulasi' in last
assert len(PdfReader(root/'output/katalhys-pitch-id-v7.pdf').pages)==40
assert len(list((build/'powerpoint-preview').glob('slide-*.png')))==40
for file in ['index.html','modul-sales.pdf','lucide-license.txt']:
    assert (root/'output/sales-playbook'/file).read_bytes()==(root.parents[1]/'public/resources/sales-playbook'/file).read_bytes()
native=json.loads((build/'native-check.json').read_text(encoding='utf-8-sig'))
assert native['seconds']==1069 and native['mainSlides']==30
result={'slides':40,'main_slides':30,'target_seconds':1069,'original_39_slide_ids_and_text_preserved':True,'editable_text_boxes':count,'whole_page_effects':40,'extra_animation_clicks':0,'pdf_pages':40,'companion_files_match':True,'source_unchanged':True}
(build/'content-check.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result))
