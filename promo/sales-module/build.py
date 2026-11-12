"""Restyle the supplied module and prerender its evidence without running its scripts."""
import base64
import copy
import hashlib
import html as escape_html
import json
import re
from pathlib import Path
from lxml import html, etree

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
OUT = ROOT / 'public/resources/sales-playbook'
BUILD = ROOT / '.work-capture/sales-module'
SOURCE = BUILD / 'source.html'
for folder in (OUT, BUILD):
    folder.mkdir(parents=True, exist_ok=True)
source = SOURCE.read_text(encoding='utf-8-sig')
e = escape_html.escape

def array(name):
    match = re.search(r'var\s+'+re.escape(name)+r'\s*=\s*(\[.*?\]);', source, re.S)
    assert match, name
    # Quote object keys, preserving all quoted text. No source JavaScript executes.
    literal = re.sub(r'"(?:\\.|[^"\\])*"|\b([A-Za-z_]\w*)\s*:',
                     lambda m: '"'+m[1]+'":' if m[1] else m[0], match[1])
    return json.loads(literal)

data = {name: array(name) for name in ('status','health','produk','langkah','klien','tugas','soal')}
names = {row[0]: f'Klien {i+1:02}' for i,row in enumerate(data['klien'])}
names['Samudera Logistik'] = 'Klien 37'

def clean(text):
    for old,new in sorted(names.items(), key=lambda kv:-len(kv[0])):
        text = re.sub(r'(?:PT\s+)?'+re.escape(old),new,text)
    text = re.sub(r'Proteksindo','sistem monitoring proyek',text,flags=re.I)
    text = text.replace('kamu','Anda').replace('Kamu','Anda').replace('Janji waktu yang aman','Perkiraan durasi pekerjaan')
    text = text.replace('Penjualan terbesar kita datang dari klien lama.',
                        'Sebagian besar proyek selesai pada data demo berasal dari klien yang memesan kembali.')
    text = text.replace('Janjikan durasi dari angka pesimis. Kalau selesai lebih cepat, klien senang. Kalau lebih lambat, klien kecewa.',
                        'Gunakan benchmark sebagai bahan pembahasan. Kondisi lokasi dan jadwal tetap perlu dikonfirmasi tim proyek.')
    text = text.replace('Janjikan durasi dari angka pesimis.',
                        'Bahas skenario lambat dan konfirmasikan jadwal dengan tim proyek.')
    return text.replace('\u2014',', ').replace('\u2013',' sampai ')

data = json.loads(clean(json.dumps(data,ensure_ascii=False)))
data['soal'][2].update(q='Klien meminta perkiraan durasi. Apa dasar pembahasan awalnya?',
    o=['Median tanpa review tim','Skenario lambat, lalu validasi tim proyek','Kecepatan tercepat yang pernah ada'],a=1,
    e='Benchmark membantu menyusun skenario. Kondisi lokasi, pengeringan, akses, dan kapasitas tim tetap perlu diperiksa sebelum menyepakati jadwal.')
data['soal'][1]['q']='Pada subsampel kontrak yang ditampilkan, kategori mana lebih sering batal?'
data['soal'][1]['e']='Lima dari 21 kontrak besar dan satu dari 44 kontrak kecil batal. Subsampel berisi 65 kontrak; selisih terhadap 66 proyek selesai atau batal belum dijelaskan sumber. Ini pola contoh, bukan prediksi.'
data['soal'][2]['e']=clean(data['soal'][2]['e'])
data['soal'][0]['e']+=' Nilai ini berasal dari brief 25 September, bukan pengukuran baru pada 28 Oktober.'

doc = html.fromstring(source)
main = copy.deepcopy(doc.xpath('//main')[0])
for node in main.iter():
    for attr in list(node.attrib):
        if attr.lower().startswith('on'):
            del node.attrib[attr]
    if node.text:
        node.text=clean(node.text)
    if node.tail:
        node.tail=clean(node.tail)
for node in main.xpath('.//*[@id="ringkas"]/h2'):
    node.text='Sepuluh pegangan untuk tim sales'
main.xpath('.//*[@id="kondisi"]/dl/div[1]/dd')[0].text='catatan proyek dalam data demo. Empat catatan Demo RAP dikeluarkan dari ringkasan ini.'
main.xpath('.//*[@id="waktu"]/h2')[0].text='Perkiraan durasi pekerjaan'
main.xpath('.//*[@id="waktu"]/p[@class="lead"]')[0].text='Gunakan benchmark untuk membahas durasi, lalu periksa kondisi lokasi dan kapasitas tim sebelum menyepakati jadwal.'
for node in main.xpath('.//*[@id="outPesSub"]'):
    node.text='Skenario lambat; validasi bersama tim proyek.'
for node in main.xpath('.//button[contains(@class,"kuning")]'):
    node.set('data-print','');node.text='Cetak modul'
main.xpath('.//*[@id="aksi"]/p')[0].text='Checklist contoh berdasarkan snapshot demo 28 Oktober 2026. Centang tersimpan hanya pada browser Anda.'
main.xpath('.//*[@id="langganan"]/p[@class="kecil"]')[0].text='Selesai, Diproses, Batal, dan Belum menunjukkan riwayat lini produk dalam data demo. Peluang dari pola data ini belum merupakan prospek yang dikonfirmasi.'
main.xpath('.//*[@id="kondisi"]/h3[2]')[0].text='Skor kesehatan pada brief: 65'

def replace_content(id_, markup):
    node=main.get_element_by_id(id_)
    for child in list(node):
        node.remove(child)
    node.text=None
    for child in html.fragments_fromstring(markup):
        if isinstance(child,str):
            node.text=(node.text or '')+child
        else:
            node.append(child)

colors=['#17191C','#334155','#64748B','#1D4ED8','#9A6700','#93B4F5','#769CEE','#426EDC','#B42318']
data['status']=[s[:2]+[colors[i]] for i,s in enumerate(data['status'])]
replace_content('stack',''.join(f'<i style="width:{s[1]/80*100}%;background:{s[2]}" title="{e(s[0])}: {s[1]}"></i>' for s in data['status']))
replace_content('stackLegend',''.join(f'<li style="--c:{s[2]}">{e(s[0])}<b>{s[1]}</b></li>' for s in data['status']))

def bars(rows):
    return ''.join(f'<div class="bar-row"><div class="nama">{e(name)}</div><div class="track" aria-hidden="true"><div class="fill {tone}" style="width:{width}%"></div></div><div class="nilai">{e(value)}</div></div>' for name,width,value,tone in rows)

replace_content('healthBars',bars([(h[0],h[1],f'{h[1]:.1f}%'.replace('.',','),'merah' if h[0]=='Pipeline' else '') for h in data['health']]))
replace_content('sizeBars',bars([('Di bawah Rp 150 jt',12/31*100,'12 proyek',''),('Rp 150 sampai 400 jt',100,'31 proyek',''),('Rp 400 jt ke atas',16/31*100,'16 proyek','')]))
replace_content('marginBars',bars([('Negatif',4/7*100,'4 proyek','merah'),('0 sampai 25%',3/7*100,'3 proyek',''),('25 sampai 50%',1/7*100,'1 proyek',''),('Di atas 50%',100,'7 proyek','hijau')]))
replace_content('batalBars',bars([('Rp 400 jt ke atas: 5 dari 21',5/21*100,'23,8%','merah'),('Di bawah Rp 400 jt: 1 dari 44',1/44*100,'2,3%','')]))
cancel_note=html.fragment_fromstring('<p class="data-note">Batas sampel: dua kelompok di atas mencakup 65 kontrak dan 6 pembatalan. Ringkasan status mencatat 66 proyek selesai atau batal, termasuk 7 pembatalan. Dokumen sumber belum menjelaskan selisihnya; pembandingan ini belum mencakup seluruh catatan.</p>')
main.get_element_by_id('batalBars').addnext(cancel_note)

replace_content('produkList',''.join(f'<article class="produk"><div><h3>{e(p["n"])}</h3><p>{e(p["d"])}</p></div><div class="angka"><b>{p["j"]} proyek selesai</b><p>Median Rp {p["med"]} jt<br>Rentang Rp {p["min"]} sampai {p["max"]} jt</p></div></article>' for p in data['produk']))
replace_content('langkahList',''.join(f'<details class="langkah" {"open" if i==0 else ""}><summary>{e(s["n"])}<span>{e(s["c"])}</span></summary><div class="langkah-isi"><div><h4>Tugas sales</h4><p>{e(s["t"])}</p></div><div><h4>Yang perlu dijaga</h4><p>{e(s["a"])}</p></div></div></details>' for i,s in enumerate(data['langkah'])))
products=['Anti-Slip','Coating Lantai','Epoxy Lantai','Self-Leveling','Polyurethane']
replace_content('pilihProduk',''.join(f'<option value="{i}">{e(p)}</option>' for i,p in enumerate(products)))
data['products']=products
symbols={'done':'Selesai','open':'Diproses','cancel':'Batal','':'Belum'}
replace_content('matriks','<caption>Hubungan klien dan lini produk pada data demo</caption><thead><tr><th scope="col">Klien</th>'+''.join(f'<th scope="col">{e(p)}</th>' for p in products)+'</tr></thead><tbody>'+''.join('<tr><th scope="row">'+e(k[0])+'</th>'+''.join(f'<td class="s {v}"><span>{symbols[v]}</span></td>' for v in k[1:])+'</tr>' for k in data['klien'])+'</tbody>')
replace_content('hasilMatriks','<p>Klien lama yang belum pernah memakai Anti-Slip:</p><ul class="chips">'+''.join(f'<li>{e(k[0])}</li>' for k in data['klien'] if 'done' in k[1:] and not k[1])+'</ul>')
replace_content('checklist',''.join(f'<li><label><input type="checkbox" data-task="{i}"><span><b>{e(t[0])}</b><br>{e(t[1])}</span></label></li>' for i,t in enumerate(data['tugas'])))
replace_content('quiz','<p class="quiz-intro">Aktifkan JavaScript untuk mengerjakan kuis interaktif. Seluruh pertanyaan tetap bisa dibaca di bawah.</p>'+''.join(f'<details class="quiz-static"><summary>{i+1}. {e(s["q"])}</summary><ol>'+''.join(f'<li>{e(o)}</li>' for o in s['o'])+f'</ol><p><b>Jawaban:</b> {e(s["o"][s["a"]])}</p><p>{e(s["e"])}</p></details>' for i,s in enumerate(data['soal'])))
main.get_element_by_id('outMed').text='19 hari kerja'
main.get_element_by_id('outPes').text='42 hari kerja'
main.get_element_by_id('outMedSub').text='Skenario median, sekitar 4 minggu.'
main.get_element_by_id('outPesSub').text='Skenario lambat, sekitar 7 minggu. Validasi bersama tim proyek.'

icon_files=['database','panels-top-left','workflow','target','clipboard-check','target','users-round','clipboard-check','clipboard-check','workflow']
def icon(name):
    raw=(ROOT/f'promo/pitch-deck/assets/icons/{name}.svg').read_text(encoding='utf-8')
    return re.sub(r'<svg[^>]*>','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',raw,count=1)

for i,section in enumerate(main.xpath('./section')):
    section.set('aria-labelledby',f'heading-{i+1}')
    section.xpath('./h2')[0].set('id',f'heading-{i+1}')
    tag=section.xpath('./span[@class="tag"]')[0]
    tag.append(html.fragment_fromstring(icon(icon_files[i])))
    for node in section.xpath('.//table'):
        for th in node.xpath('./thead/tr/th'):
            th.set('scope','col')
for scroll in main.xpath('.//div[@class="scroll-x"]'):
    scroll.set('tabindex','0');scroll.set('role','region');scroll.set('aria-label','Tabel yang dapat digeser horizontal')
main_markup=html.tostring(main,encoding='unicode')
assert not re.search(r'proteksindo|fanos|isaac|munandar',main_markup,re.I)

brand=(ROOT/'public/brand/katalhys-symbol.svg').read_text(encoding='utf-8').replace('katalhys-','module-brand-')
white=(ROOT/'public/brand/katalhys-symbol-white.svg').read_text(encoding='utf-8').replace('<svg ','<svg aria-hidden="true" focusable="false" ',1)
fonts=[]
for family,weight,src in [('GeneralSans',600,ROOT/'src/assets/fonts/GeneralSans-Semibold.woff2'),('GeneralSans',400,ROOT/'src/assets/fonts/GeneralSans-Regular.woff2'),('Inter', '100 900',ROOT/'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')]:
    fonts.append('@font-face{font-family:'+family+';font-weight:'+str(weight)+';font-display:swap;src:url(data:font/woff2;base64,'+base64.b64encode(src.read_bytes()).decode()+') format("woff2")}')
css='\n'.join(fonts)+'\n'+(HERE/'style.css').read_text(encoding='utf-8')
links=''.join(f'<a href="#{s.get("id")}"><span>{i+1:02}</span>{e(s.xpath("./h2")[0].text)}</a>' for i,s in enumerate(main.xpath('./section')))
payload=json.dumps(data,ensure_ascii=False).replace('<','\\u003c')
client=(HERE/'client.mjs').read_text(encoding='utf-8')
page=f'''<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Modul sales berbasis data proyek | Katalhys</title>
<meta name="description" content="Contoh modul sales berbasis data simulasi: baca kondisi proyek, coba estimator durasi, petakan klien, dan susun tindak lanjut bersama Katalhys.">
<meta name="robots" content="noindex,follow"><meta name="theme-color" content="#17191C"><style>{css}</style></head>
<body><a class="skip" href="#kondisi">Lewati ke materi</a><div class="progress" id="progress" aria-hidden="true"></div>
<header class="site-head"><div class="head-inner"><a class="brand" href="#top" aria-label="Katalhys, kembali ke awal">{brand}<span>Katalhys</span></a><span class="resource-label">Contoh hasil kerja</span><a class="download" href="./modul-sales.pdf" download>Unduh PDF {icon('clipboard-check')}</a></div></header>
<section class="hero" id="top" aria-labelledby="page-title"><div class="hero-inner"><div class="hero-copy"><p class="kicker">Modul sales berbasis data proyek</p><h1 id="page-title">Data proyek menjadi<br><em>panduan sales</em></h1><p class="hero-description">Contoh materi pendamping sistem internal. Data proyek dibaca menjadi prioritas, bahan pembahasan dengan klien, dan langkah kerja tim sales.</p><div class="hero-actions"><a class="button" href="#kondisi">Jelajahi modul <span aria-hidden="true">↗</span></a><a href="#sumber" class="text-link">Lihat sumber dan batasan</a></div><p class="snapshot">Data simulasi <span aria-hidden="true">/</span> Snapshot 28 Oktober 2026</p></div>
<figure class="report-preview"><div class="preview-top">{icon('clipboard-check')}<span>Catatan untuk tim sales</span><span class="preview-label">Contoh keluaran</span></div><h2>Apa yang perlu<br>ditindaklanjuti?</h2><div class="finding"><span class="finding-no">3</span><p><b>Deal terbuka</b><span>Perlu dijaga sampai keputusan dan serah ke tim proyek</span></p></div><div class="finding"><span class="finding-no">7<span>/10</span></span><p><b>Proyek berjalan lewat tenggat</b><span>Periksa progres terverifikasi sebelum memberi kabar</span></p></div><div class="finding"><span class="finding-no">20<span>/24</span></span><p><b>Klien memesan kembali</b><span>Riwayat pekerjaan membantu memilih tindak lanjut</span></p></div><figcaption>Angka dari dataset demo, bukan hasil bisnis Katalhys</figcaption></figure></div><div class="hero-mark" aria-hidden="true">{white}</div></section>
<aside class="context-note"><div><b>Materi yang bisa dibaca dan dicoba</b><p>Sepuluh bab, estimator durasi, peta klien, checklist, dan kuis. Dokumen ini adalah contoh panduan berbasis snapshot, bukan dashboard live atau CRM yang terhubung.</p></div><span>HTML interaktif<br>PDF untuk dibagikan</span></aside>
<noscript><p class="context-note">Materi, tabel, dan jawaban kuis tetap dapat dibaca. Aktifkan JavaScript untuk estimator, filter klien, dan checklist yang tersimpan.</p></noscript><div class="layout"><details class="toc-shell" open><summary>Daftar isi</summary><nav id="toc" class="toc" aria-label="Daftar bab">{links}<a href="#sumber"><span>↗</span>Sumber dan batasan</a></nav></details>{main_markup}</div>
<footer id="sumber"><div class="footer-inner"><div class="footer-brand">{white}<b>Katalhys</b><span>AI Powered Software House</span></div><div><h2>Sumber dan batasan data</h2><p>Materi diadaptasi dari HTML yang diberikan pemilik pada 28 Oktober 2026. Pemilik mengonfirmasi seluruh data sebagai simulasi. Nama klien dianonimkan pada versi showcase.</p><ul><li>Ringkasan 80 catatan proyek setelah empat catatan Demo RAP dikeluarkan.</li><li>Benchmark durasi dari 59 catatan proyek selesai. Skor kesehatan, margin, dan RAP memakai brief 25 September, bukan snapshot baru.</li><li>Data laporan harian menggunakan periode 28 September sampai 28 Oktober 2026.</li><li>Subsampel pembatalan berisi 65 kontrak; selisih terhadap 66 catatan selesai atau batal belum dijelaskan dokumen sumber.</li></ul><p>Data proyek tidak memuat seluruh aktivitas prospek dan penawaran yang ditolak. Karena itu, tahap proyek digunakan sebagai bahan pembahasan sales, bukan ukuran conversion atau jaminan hasil.</p><a href="./modul-sales.pdf" download>Unduh versi PDF <span aria-hidden="true">↗</span></a></div></div></footer>
<script type="application/json" id="module-data">{payload}</script><script type="module">{client}</script></body></html>'''
assert not re.search(r'proteksindo|fanos|isaac|munandar|https?://fonts\.',page,re.I)
assert not re.search(r'[\u2013\u2014]',page)
(OUT/'index.html').write_text(page,encoding='utf-8')
(BUILD/'data.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
(BUILD/'body.html').write_text(main_markup,encoding='utf-8')
(BUILD/'provenance.json').write_text(json.dumps({'source':str(SOURCE),'sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'simulation_confirmed_by_owner':'2026-10-28','built':'2026-10-29','client_names':len(names)},indent=2),encoding='utf-8')
(OUT/'lucide-license.txt').write_text((ROOT/'promo/pitch-deck/assets/icons/LICENSE.txt').read_text(),encoding='utf-8')
print(json.dumps({'html':str(OUT/'index.html'),'chapters':10,'anonymized_clients':len(names),'external_requests':0}))
