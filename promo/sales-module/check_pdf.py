import hashlib
import json
import re
from pathlib import Path
from pypdf import PdfReader
from lxml import html
root=Path(__file__).resolve().parents[2]
build=root/'.work-capture/sales-module'
public=root/'public/resources/sales-playbook'
reader=PdfReader(public/'modul-sales.pdf')
texts=[page.extract_text() for page in reader.pages]
full='\n'.join(texts)
for phrase in ['Kondisi kita sekarang','Yang kita jual','Perjalanan satu proyek','Perkiraan durasi pekerjaan','Harga dan margin','Deal yang rawan batal','Klien langganan','Aksi minggu ini','Kuis cepat','Sepuluh pegangan untuk tim sales','Sumber dan batasan data','Klien 36','42 hari kerja','19 hari kerja','65 kontrak','66 catatan']:
    assert phrase in full,phrase
assert not re.search(r'proteksindo|fanos|isaac|munandar',full,re.I)
assert all(len(text.strip())>75 for text in texts),'An unexpectedly empty PDF page'
assert 11<=len(reader.pages)<=22,len(reader.pages)
source=Path('C:/Users/ghufr/Downloads/modul-sales-proteksindo.html')
assert hashlib.sha256(source.read_bytes()).digest()==hashlib.sha256((build/'source.html').read_bytes()).digest(),'Source HTML changed'
tree=html.fromstring((public/'index.html').read_text(encoding='utf-8'))
ids=tree.xpath('//@id');assert len(ids)==len(set(ids)),'Duplicate IDs'
for href in tree.xpath('//a/@href'):
    if href.startswith('#'):assert href[1:] in ids,href
    elif href.startswith('./'):assert (public/href[2:]).exists(),href
for node in tree.xpath('//h1 | //h2 | //h3 | //h4'):
    assert not node.text_content().strip().endswith('.'),node.text_content()
result={'pdf_pages':len(reader.pages),'chapters':10,'source_unchanged':True,'public_client_names':'anonymous','data':'owner-confirmed simulation'}
(build/'checks.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result))
