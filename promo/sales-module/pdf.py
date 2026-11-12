"""Build a complete static companion to the interactive HTML module."""
import json
import math
import subprocess
from html import escape
from pathlib import Path
from lxml import html
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, CondPageBreak, Table, TableStyle, KeepTogether
from reportlab.graphics.shapes import Drawing, Rect

ROOT=Path(__file__).resolve().parents[2]
BUILD=ROOT/'.work-capture/sales-module'
OUT=ROOT/'public/resources/sales-playbook/modul-sales.pdf'
RUNTIME=Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies'
INK=colors.HexColor('#17191C');BLUE=colors.HexColor('#1D4ED8');MUTED=colors.HexColor('#596273');PALE=colors.HexColor('#EEF2F8');LINE=colors.HexColor('#D8DEE8')
WIDTH=A4[0]-88
font_sources=[('Inter',ROOT/'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')]
font_code="const fs=require('node:fs/promises');const{createRequire}=require('node:module');const path=require('node:path');const convert=createRequire(path.join(process.argv[1],'package.json'))('fontverter');(async()=>{for(const[n,p]of JSON.parse(process.argv[3]))await fs.writeFile(path.join(process.argv[2],n+'.ttf'),await convert.convert(await fs.readFile(p),'sfnt'))})().catch(e=>{console.error(e);process.exit(1)})"
subprocess.run([str(RUNTIME/'node/bin/node.exe'),'-e',font_code,str(ROOT),str(BUILD),json.dumps([(name,str(src)) for name,src in font_sources])],check=True)
for name,source in font_sources:
    dest=BUILD/(name+'.ttf')
    pdfmetrics.registerFont(TTFont(name,str(dest)))
# shortcut: ReportLab cannot embed the brand's CFF display face; the PDF uses the existing Inter body face until a TrueType General Sans is supplied.
for alias in ['General','GeneralBold']:
    pdfmetrics.registerFont(TTFont(alias,str(BUILD/'Inter.ttf')))
pdfmetrics.registerFontFamily('Inter',normal='Inter',bold='GeneralBold',italic='Inter',boldItalic='GeneralBold')
pdfmetrics.registerFontFamily('General',normal='General',bold='GeneralBold',italic='General',boldItalic='GeneralBold')
node_code="const{createRequire}=require('node:module');const path=require('node:path');const sharp=createRequire(path.join(process.argv[1],'node/node_modules/_pdf.cjs'))('sharp');Promise.all([['','logo'],['-white','logo-white']].map(([v,n])=>sharp(path.join(process.argv[2],'public/brand/katalhys-symbol'+v+'.svg')).resize(300,300).png().toFile(path.join(process.argv[3],n+'.png')))).catch(e=>{console.error(e);process.exit(1)})"
subprocess.run([str(RUNTIME/'node/bin/node.exe'),'-e',node_code,str(RUNTIME),str(ROOT),str(BUILD)],check=True)

styles={
 'body':ParagraphStyle('Body',fontName='Inter',fontSize=9,leading=13,textColor=INK,spaceAfter=8),
 'small':ParagraphStyle('Small',fontName='Inter',fontSize=8,leading=12,textColor=MUTED,spaceAfter=8),
 'h2':ParagraphStyle('Chapter',fontName='GeneralBold',fontSize=27,leading=30,textColor=INK,spaceAfter=16,keepWithNext=True),
 'h3':ParagraphStyle('Subheading',fontName='GeneralBold',fontSize=14,leading=17,textColor=INK,spaceBefore=12,spaceAfter=7,keepWithNext=True),
 'h4':ParagraphStyle('Label',fontName='GeneralBold',fontSize=10,leading=14,textColor=INK,spaceAfter=5,keepWithNext=True),
 'lead':ParagraphStyle('Lead',fontName='Inter',fontSize=11,leading=17,textColor=MUTED,spaceAfter=16),
 'value':ParagraphStyle('Value',fontName='GeneralBold',fontSize=25,leading=30,textColor=BLUE),
 'valueSmall':ParagraphStyle('ValueSmall',fontName='GeneralBold',fontSize=18,leading=24,textColor=BLUE),
 'th':ParagraphStyle('TableHeader',fontName='GeneralBold',fontSize=8,leading=11,textColor=colors.white),
 'cell':ParagraphStyle('Cell',fontName='Inter',fontSize=8,leading=11.5,textColor=INK),
 'cover':ParagraphStyle('Cover',fontName='GeneralBold',fontSize=42,leading=45,textColor=colors.white,spaceAfter=23),
 'coverbody':ParagraphStyle('CoverBody',fontName='Inter',fontSize=12,leading=19,textColor=colors.HexColor('#DBEAFE'),spaceAfter=14),
}
def text(node):
    return ' '.join(' '.join(node.itertext()).split())
def p(value,style='body'):
    return Paragraph(escape(value),styles[style])
def table(rows,widths=None,header=False):
    result=Table(rows,colWidths=widths,repeatRows=1 if header else 0,hAlign='LEFT')
    instructions=[('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6),('LINEBELOW',(0,0),(-1,-1),.4,LINE)]
    if header:
        instructions.extend([('BACKGROUND',(0,0),(-1,0),INK),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#F7F9FC')])])
    result.setStyle(TableStyle(instructions))
    return result

def walk(node):
    tag=node.tag if isinstance(node.tag,str) else ''
    cls=node.get('class','').split()
    id_=node.get('id','')
    if tag in ('svg','script','button','input','select','noscript') or tag=='span' and 'tag' in cls:return []
    if tag in ('h2','h3','h4'):
        return [p(text(node),tag)]
    if tag=='p':return [p(text(node),'lead' if 'lead' in cls else 'small' if 'kecil' in cls else 'body')]
    if tag=='dl':
        rows=[]
        for item in node:
            value=text(item.find('dt'))
            rows.append([p(value,'valueSmall' if len(value)>3 else 'value'),p(text(item.find('dd')))])
        return [table(rows,[105,WIDTH-105]),Spacer(1,12)]
    if 'bars' in cls:
        rows=[]
        for row in node:
            width=float(row.xpath('.//*[@class="fill" or starts-with(@class,"fill ")]')[0].get('style').split(':')[1].strip('%'))
            fill=row.xpath('.//*[contains(@class,"fill")]')[0]
            color=colors.HexColor('#B42318') if 'merah' in fill.get('class') else colors.HexColor('#21664F') if 'hijau' in fill.get('class') else BLUE
            bar=Drawing(165,12);bar.add(Rect(0,2,165,8,fillColor=PALE,strokeColor=None));bar.add(Rect(0,2,165*width/100,8,fillColor=color,strokeColor=None))
            rows.append([p(text(row.find('div')),'cell'),bar,p(text(row.xpath('./div[@class="nilai"]')[0]),'cell')])
        return [table(rows,[WIDTH-235,175,60]),Spacer(1,10)]
    if id_=='stack':
        drawing=Drawing(WIDTH,20);x=0
        for child in node:
            style=dict(item.split(':',1) for item in child.get('style').split(';') if item)
            width=float(style['width'].strip('%'))/100*WIDTH
            drawing.add(Rect(x,0,width,17,fillColor=colors.HexColor(style['background']),strokeColor=colors.white,strokeWidth=1));x+=width
        return [drawing,Spacer(1,6)]
    if id_=='stackLegend':
        values=[p(text(item),'small') for item in node]
        values += ['']*((3-len(values)%3)%3)
        return [table([values[i:i+3] for i in range(0,len(values),3)],[WIDTH/3]*3),Spacer(1,10)]
    if 'produk' in cls:
        return [KeepTogether([p(text(node.xpath('./div/h3')[0]),'h3'),p(text(node.xpath('./div/p')[0])),p(text(node.xpath('./div[@class="angka"]')[0]),'small')])]
    if tag=='details' and 'langkah' in cls:
        heading=p(text(node.find('summary')),'h3')
        cells=[]
        for col in node.xpath('./div/div'):
            cells.append([p(text(col.find('h4')),'h4'),p(text(col.find('p')))])
        return [KeepTogether([heading,table([cells],[WIDTH*.52,WIDTH*.48]),Spacer(1,4)])]
    if tag=='details' and 'quiz-static' in cls:
        content=[p(text(node.find('summary')),'h3')]
        for child in node:
            if child.tag!='summary':content.extend(walk(child))
        return [KeepTogether(content)]
    if 'estimator' in cls:
        return [p('Contoh perhitungan: 1.000 m², satu lapis primer, body coat, dan finish coat.'),
                table([[p('Skenario median','h4'),p('Skenario lambat','h4')],[p('19 hari kerja','value'),p('42 hari kerja','value')]], [WIDTH/2]*2),
                p('Input PDF memakai nilai awal modul. Ubah luas dan jumlah lapis melalui HTML. Mobilisasi, pengeringan, serta hambatan lokasi belum dihitung; jadwal perlu dikonfirmasi tim proyek.','small')]
    if tag=='table':
        rows=[]
        for i,row in enumerate(node.xpath('./thead/tr | ./tbody/tr')):
            rows.append([p(text(cell),'th' if i==0 else 'cell') for cell in row])
        widths=[76]+[(WIDTH-76)/5]*5 if id_=='matriks' else [WIDTH*.36,WIDTH*.32,WIDTH*.32]
        result=table(rows,widths,True)
        if id_=='matriks':result.setStyle(TableStyle([('TOPPADDING',(0,0),(-1,-1),2),('BOTTOMPADDING',(0,0),(-1,-1),2)]))
        return [result,Spacer(1,12)]
    if tag in ('ul','ol'):
        if 'chips' in cls:
            return [p(', '.join(text(item) for item in node))]
        items=[p(('□  ' if id_=='checklist' else str(i+1)+'.  ' if tag=='ol' else '•  ')+text(item)) for i,item in enumerate(node)]
        return [KeepTogether(items)] if 'aturan' in cls else items
    if 'pesan' in cls or 'data-note' in cls:
        content=[]
        if node.text and node.text.strip():content.append(p(node.text.strip(),'small'))
        for child in node:
            content.extend([p(text(child),'h4')] if child.tag=='strong' else walk(child))
        callout=Table([[content]],colWidths=[WIDTH]);callout.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE),('LEFTPADDING',(0,0),(-1,-1),15),('RIGHTPADDING',(0,0),(-1,-1),15),('TOPPADDING',(0,0),(-1,-1),13),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
        return [Spacer(1,8),callout,Spacer(1,10)]
    if tag=='summary':return []
    result=[]
    for child in node:result.extend(walk(child))
    return result

def page(canvas,doc):
    canvas.saveState()
    if doc.page==1:
        canvas.setFillColor(INK);canvas.rect(0,0,*A4,fill=1,stroke=0)
        canvas.drawImage(str(BUILD/'logo-white.png'),44,A4[1]-79,29,29,mask='auto')
        canvas.setFillColor(colors.white);canvas.setFont('GeneralBold',22);canvas.drawString(83,A4[1]-70,'Katalhys')
        canvas.setStrokeColor(colors.HexColor('#35445D'));canvas.setLineWidth(1)
        for offset in (0,32,64):
            path=canvas.beginPath();path.moveTo(430+offset,620);path.curveTo(430+offset,410,510+offset,290,595,290-offset);canvas.drawPath(path)
        canvas.setFillColor(colors.HexColor('#DBEAFE'));canvas.setFont('Inter',8);canvas.drawString(44,34,'DATA SIMULASI   /   SNAPSHOT 28 OKTOBER 2026')
    else:
        canvas.drawImage(str(BUILD/'logo.png'),44,A4[1]-43,22,22,mask='auto')
        canvas.setFillColor(INK);canvas.setFont('GeneralBold',12);canvas.drawString(74,A4[1]-36,'Katalhys')
        canvas.setFillColor(MUTED);canvas.setFont('Inter',8);canvas.drawRightString(A4[0]-44,A4[1]-35,'Modul sales berbasis data proyek')
        canvas.setStrokeColor(LINE);canvas.line(44,43,A4[0]-44,43)
        canvas.setFont('Inter',7);canvas.drawString(44,29,'Contoh keluaran dengan data simulasi. Bukan dashboard live.')
        canvas.drawRightString(A4[0]-44,29,str(doc.page).zfill(2))
    canvas.restoreState()

body=html.fromstring((BUILD/'body.html').read_text(encoding='utf-8'))
flow=[Spacer(1,80),Paragraph('Data proyek menjadi<br/>panduan sales',styles['cover']),
      Paragraph('Contoh materi pendamping sistem internal',styles['coverbody']),
      Paragraph('Baca kondisi proyek, periksa benchmark, dan susun tindak lanjut. Sepuluh bab ini memperlihatkan bentuk panduan yang dapat disusun dari data proyek.',styles['coverbody']),
      Spacer(1,28),Paragraph('Dalam modul ini',ParagraphStyle('CoverLabel',parent=styles['coverbody'],fontName='GeneralBold',fontSize=14)),
      Paragraph('Kondisi proyek dan produk<br/>Alur kerja, durasi, harga, dan margin<br/>Pembatalan, klien lama, serta aksi sales<br/>Kuis, ringkasan, dan batas data',styles['coverbody']),
      Spacer(1,30),Paragraph('Versi PDF memuat materi lengkap dengan nilai estimator awal. Filter klien, perhitungan yang dapat diubah, penyimpanan checklist, dan kuis berskor tersedia di HTML.',styles['coverbody'])]
for i,section in enumerate(body.xpath('./section'),1):
    flow.extend([PageBreak() if i in (1,9,10) else CondPageBreak(180),Spacer(1,0 if i in (1,9,10) else 18),p(f'Bab {i:02}','small')])
    heading=p(text(section.find('h2')),'h2');heading.chapter=section.get('id');flow.append(heading)
    for child in section:
        if child.tag not in ('h2','span'):flow.extend(walk(child))
flow.extend([PageBreak(),p('Sumber dan batasan data','h2'),p('Semua catatan pada contoh ini adalah data simulasi, sesuai konfirmasi pemilik. Materi berasal dari HTML yang diberikan pada 28 Oktober 2026. Nama klien dibuat anonim.'),
 p('Ringkasan mencakup 80 catatan proyek setelah empat catatan Demo RAP dikeluarkan. Benchmark durasi memakai 59 catatan selesai. Skor kesehatan, margin, dan RAP berasal dari brief 25 September; data tersebut tidak diperlakukan sebagai pengukuran baru pada 28 Oktober.'),
 p('Grafik pembatalan memakai subsampel 65 kontrak dengan 6 pembatalan. Ringkasan status memuat 66 catatan selesai atau batal dengan 7 pembatalan. Selisih belum dijelaskan sumber, sehingga perbandingan tidak dianggap mencakup seluruh catatan.'),
 p('Data proyek tidak memuat seluruh aktivitas prospek, kunjungan, atau penawaran yang ditolak. Angka dan benchmark tidak menunjukkan conversion, kenaikan penjualan, atau jaminan jadwal. Rekomendasi perlu ditinjau terhadap kondisi bisnis yang sebenarnya.'),
 p('Dokumen disiapkan untuk demonstrasi kemampuan dan pembahasan dengan calon klien. Halaman HTML menampilkan versi interaktif; PDF ini merupakan pendamping statis.','small')])
doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=44,leftMargin=44,topMargin=67,bottomMargin=58,title='Modul sales berbasis data proyek',author='Katalhys',subject='Contoh modul dengan data simulasi',pageCompression=1)
def bookmark(item):
    if hasattr(item,'chapter'):
        doc.canv.bookmarkPage(item.chapter);doc.canv.addOutlineEntry(item.getPlainText(),item.chapter,0)
doc.afterFlowable=bookmark
doc.afterPage=lambda:page(doc.canv,doc) if doc.page>1 else None
doc.build(flow,onFirstPage=page)
print(json.dumps({'pdf':str(OUT),'bytes':OUT.stat().st_size}))
