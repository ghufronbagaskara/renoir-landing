"""Validate source preservation and the requested single-beat page animation."""
import hashlib
import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
from pypdf import PdfReader

root = Path(__file__).resolve().parent.parent
ns = {'p':'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a':'http://schemas.openxmlformats.org/drawingml/2006/main',
      'r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
rel_ns = {'x':'http://schemas.openxmlformats.org/package/2006/relationships'}
manifest = json.loads((root/'.build/v6/manifest.json').read_text(encoding='utf-8'))
base = root/'output/katalhys-pitch-id-v5.pptx'
assert hashlib.sha256(base.read_bytes()).hexdigest() == manifest['baseSha256']
deck = root/'output/katalhys-pitch-id-v6.pptx'
with zipfile.ZipFile(base) as source:
    old_ids = {s.get('id') for s in ET.fromstring(source.read('ppt/presentation.xml')).findall('p:sldIdLst/p:sldId',ns)}
with zipfile.ZipFile(deck) as package:
    presentation = ET.fromstring(package.read('ppt/presentation.xml'))
    ids = presentation.findall('p:sldIdLst/p:sldId',ns)
    assert len(ids) == 39 and old_ids.issubset({s.get('id') for s in ids})
    rels = {r.get('Id'):r.get('Target') for r in ET.fromstring(package.read('ppt/_rels/presentation.xml.rels'))}
    text_count = image_count = svg_count = 0
    all_text = []
    for number, slide_id in enumerate(ids,1):
        target = rels[slide_id.get('{'+ns['r']+'}id')]
        name = target.lstrip('/') if target.startswith('/') else 'ppt/'+target
        slide = ET.fromstring(package.read(name))
        texts = [t.text or '' for t in slide.findall('.//a:t',ns)]
        assert 'Katalhys' in texts and str(number).zfill(2) in texts, (number,'chrome')
        assert not re.search(r'[\u2013\u2014]', ' '.join(texts)), (number,'long dash')
        assert not re.search(r'Isaac|Munandar|Renoir|Catalyst|studio digital', ' '.join(texts),re.I)
        groups = slide.findall('p:cSld/p:spTree/p:grpSp',ns)
        assert len(groups) == 1, (number,'one visual group')
        assert not slide.findall('p:cSld/p:spTree/p:sp',ns), (number,'ungrouped foreground')
        effects = [e for e in slide.findall('.//p:cTn',ns) if e.get('presetClass') == 'entr']
        assert len(effects) == 1, (number,'one entrance effect')
        assert effects[0].get('nodeType') == 'withEffect', (number,'automatic concurrent start')
        assert not slide.findall('.//p:cTn[@nodeType="clickEffect"]',ns), (number,'extra click')
        assert not slide.findall('.//p:cTn[@nodeType="afterEffect"]',ns), (number,'staggered effect')
        assert effects[0].find('p:stCondLst/p:cond',ns).get('delay') == '0', (number,'delay')
        transitions = slide.findall('.//p:transition',ns)
        assert transitions and all(t.find('p:fade',ns) is not None for t in transitions)
        assert all(t.get('advTm') is None for t in transitions)
        assert len(slide.findall('.//p:pic',ns)) >= 2
        assert len(slide.findall('.//p:sp/p:txBody',ns)) >= 5
        assert any('Ornamen Katalhys' in (n.get('descr') or '') for n in slide.findall('.//p:cNvPr',ns))
        text_count += len(slide.findall('.//p:sp/p:txBody',ns))
        image_count += len(slide.findall('.//p:pic',ns))
        all_text.extend(texts)
    assert any('Alur inquiry dan follow-up' in t for t in all_text)
    assert any('Persiapan penggunaan sistem' in t for t in all_text)
    assert any('Elroy' in t for t in all_text)
    for name in package.namelist():
        if re.fullmatch(r'ppt/notesSlides/notesSlide\d+\.xml',name):
            notes = ' '.join(t.text or '' for t in ET.fromstring(package.read(name)).findall('.//a:t',ns))
            assert 'Sumber isi dan visual' in notes
            assert not re.search(r'[\u2013\u2014]',notes)
    assert presentation.find('p:embeddedFontLst',ns) is not None
    svg_count = sum(n.endswith('.svg') for n in package.namelist())
    assert svg_count >= 18, 'SVG masters should remain embedded'
    assert not any(n.endswith('vbaProject.bin') for n in package.namelist())
pdf = PdfReader(root/'output/katalhys-pitch-id-v6.pdf')
assert len(pdf.pages) == 39
assert len(list((root/'.build/v6/powerpoint-preview').glob('slide-*.png'))) == 39
receipt = json.loads((root/'.build/v6/powerpoint-check.json').read_text(encoding='utf-8-sig'))
assert 900 <= receipt['seconds'] <= 1200
result = {'slides':39,'preserved_original_slide_ids':len(old_ids),'editable_text_boxes':text_count,
          'picture_objects':image_count,'svg_media':svg_count,'whole_slide_effects':39,
          'extra_animation_clicks':0,'pdf_pages':39,'target_seconds':receipt['seconds'],'source_unchanged':True}
(root/'.build/v6/content-check.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result))
