import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { story, mainSlideCount } from './story.mjs';
import { prepareAssets, registerFonts, root, buildDir, outputDir, runtimeModules } from './prepare.mjs';
import {addOrnaments,addIcon,saveOrnamentSvgs} from './ornaments.mjs';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const { Canvas } = require(path.join(runtimeModules, '@oai/artifact-tool/node_modules/skia-canvas'));
const measuringContext = new Canvas(1,1).getContext('2d');
const C = { ink: '#17191C', blue: '#1D4ED8', white: '#FFFFFF', paper: '#EEF2F8', muted: '#596273', pale: '#DBEAFE', gray: '#ADB8CA' };
const font = 'General Sans';
let assets;
const assetBytes = new Map();

function text(slide, value, x, y, w, h, size = 24, color = C.ink, bold = false, face = font) {
  const shape = slide.shapes.add({ geometry: 'textbox', name: value.replace(/\n/g, ' ').slice(0, 64), position: { left: x, top: y, width: w, height: h }, fill: 'none', line: { fill: 'none', width: 0 } });
  shape.text = value;
  shape.text.style = { typeface: face, fontSize: size, color, bold, insets: 0, autoFit: 'none', wrap: 'square', verticalAlignment: 'top' };
  return shape;
}

function box(slide, x, y, w, h, fill) {
  return slide.shapes.add({ geometry: 'rect', position: { left: x, top: y, width: w, height: h }, fill, line: { fill: 'none', width: 0 } });
}

async function image(slide, key, x, y, w, h, fit = 'contain') {
  assert.ok(assets[key], `Missing asset ${key}`);
  if (!assetBytes.has(key)) assetBytes.set(key, new Uint8Array(await fs.readFile(assets[key].path)));
  return slide.images.add({ blob: assetBytes.get(key), contentType: 'image/png', alt: key.startsWith('logo') ? 'Simbol asli Katalhys' : key.startsWith('art-') ? `Ilustrasi konseptual layanan ${key}` : `Layar proyek ${key}`, fit, position: { left: x, top: y, width: w, height: h } });
}

async function chrome(slide, item, index, dark) {
  const fg = dark ? C.white : C.ink;
  await image(slide, dark ? 'logo-white' : 'logo', 51, 27, 41, 41);
  text(slide, 'Katalhys', 102, 31, 210, 39, 30, fg, true);
  const section = text(slide, item.section, 742, 37, 474, 26, 16, dark ? C.pale : C.muted);
  section.text.alignment = 'right';
  text(slide, index < mainSlideCount ? 'AI POWERED SOFTWARE HOUSE' : 'LAMPIRAN DISKUSI', 64, 679, 480, 22, 12, dark ? C.pale : C.muted, true, 'Inter');
  const number = text(slide, String(index + 1).padStart(2, '0'), 1136, 672, 80, 30, 21, fg, true);
  number.text.alignment = 'right';
}

function rows(slide, items, { x = 64, y = 260, width = 420, gap = 104, heading = 24, body = 20, color = C.ink, muted = C.muted } = {}) {
  for (const [i, row] of items.entries()) {
    text(slide, row[0], x, y + i * gap, width, 39, heading, color, true);
    text(slide, row[1], x, y + 42 + i * gap, width, gap - 44, body, muted, false, 'Inter');
  }
}

async function renderSlide(slide, item, index) {
  const layout = item.layout;
  const dark = ['cover','position','services','gallery','field-case','order-case','inquiry','web','operations','process','reasons','closing','appendix','scope-ai','faq'].includes(layout);
  const blue = ['position','services','field-case','closing'].includes(layout);
  const fg = dark ? C.white : C.ink;
  const muted = dark ? C.pale : C.muted;
  slide.background.fill = blue ? C.blue : dark ? C.ink : C.white;
  addOrnaments(slide,blue?'blue':dark?'dark':'light',index);
  await chrome(slide,item,index,dark);
  const t=(value,x,y,w,h,size=24,bold=false,color=fg)=>text(slide,value,x,y,w,h,size,color,bold,bold?font:'Inter');
  const title=(x=64,y=106,w=1152,size=52)=>{
    measuringContext.font=`bold ${size}px "General Sans"`;
    let lines=0;
    for(const paragraph of item.title.split('\n')){
      let current=''; lines++;
      for(const word of paragraph.split(' ')){
        const next=current?current+' '+word:word;
        if(current && measuringContext.measureText(next).width>w){lines++;current=word;}else current=next;
      }
    }
    return t(item.title,x,y,w,lines*size*1.22+14,size,true);
  };
  const note=(value,x=64,y=644,w=1152)=>t(value,x,y,w,31,13,false,muted);
  const proof=async(key,x,y,w,h,crop)=>{
    const p=await image(slide,key,x,y,w,h);
    const ratio=assets[key].width/assets[key].height;
    if(crop===undefined && !key.startsWith('operations-control/') && !key.endsWith('/pair') && ratio>1 && w/h>1.8 && ratio<w/h) crop={left:0,top:0,right:0,bottom:1-ratio/(w/h)};
    if(crop)p.crop=crop;
    return p;
  };
  const labels=(values,x,y,w,gap=92)=>values.forEach((r,i)=>{t(r[0],x,y+i*gap,w,42,25,true);t(r[1],x,y+44+i*gap,w,gap-45,19,false,muted);});
  const credit=()=>note('Peran pendiri: '+item.role,64,647);
  switch(layout){
    case 'cover':
      t('AI Powered',64,128,700,90,73,true);
      t('Software House',64,214,900,106,84,true);
      t(item.title,64,346,532,140,34,false,C.pale);
      await proof(item.image,614,343,468,302);
      await proof(item.secondImage,1096,343,120,302);
      t(item.team,64,556,550,40,27,true);
      t('Tim di balik Katalhys',64,601,530,34,20,false,C.pale);
      break;
    case 'problem':
      title(64,109,1130,57);
      for(const [i,r] of item.rows.entries()){
        const x=64+i*400;
        t('0'+(i+1),x,284,90,82,64,true,C.blue);
        t(r[0],x,388,352,62,29,true);
        t(r[1],x,462,352,123,24,false,C.muted);
      }
      await proof('logo',1126,590,70,70);
      break;
    case 'position':
      await proof('logo-white',893,158,300,300);
      t('Katalhys',64,136,830,105,85,true);
      t(item.subtitle,64,276,735,147,58,true);
      t(item.body,64,468,800,105,29);
      note('Website, aplikasi bisnis, integrasi AI, dan operasional',64,622,1000);
      break;
    case 'founder':
      title(64,116,1130,57);
      t(item.subtitle,64,209,520,48,27,false,C.blue);
      t(item.body,64,280,445,177,26);
      labels(item.rows,64,487,465,82);
      await proof(item.image,575,240,641,383);
      note(item.caption,575,638,641);
      break;
    case 'services':
      title(64,110,1120,59);
      for(const [i,r] of item.rows.entries()){
        const x=i%2?682:64,y=i<2?246:455;
        await addIcon(slide,['workflow','panels-top-left','pen-tool','server-cog'][i],x+4,y+7,64,C.white);
        t(r[0],x+53,y+72,36,25,15,true,C.pale);
        t(r[1],x+104,y+3,415,79,31,true);
        t(r[2],x+104,y+91,415,66,21);
      }
      await proof('logo-white',1156,592,60,60);
      break;
    case 'field-intro':
      title(64,109,1135,63);
      t(item.intro,64,277,390,115,27);
      labels(item.rows.slice(0,2),64,420,375,102);
      await proof(item.image,485,274,731,339);
      note(item.caption,485,633,731);
      break;
    case 'catalogue':
      t('Website & landing page',64,112,530,42,25,true,C.blue);
      title(64,169,1120,53);
      box(slide,64,359,736,280,'#070B14');
      await proof(item.image,64,359,736,280,false);
      labels(item.rows,850,359,362,135);
      break;
    case 'design':
      await proof(item.image,65,131,345,508);
      title(475,132,741,55);
      t('Sales bekerja lewat ponsel\nKantor memantau lewat dashboard',475,319,704,100,30,false,C.blue);
      labels(item.rows,475,461,710,93);
      note('Layar aplikasi asli dengan data simulasi',64,647,800);
      break;
    case 'deploy':
      title(64,110,1152,53);
      await proof('operations-control/desktop',64,302,724,326);
      labels(item.rows,840,287,376,116);
      note('Diagram arsitektur dari proyek sebelumnya',64,646);
      break;
    case 'ai':
      t('AI',64,110,285,207,173,true,C.blue);
      t('untuk tugas\nyang jelas',325,129,815,158,64,true);
      for(const [i,label] of ['Claude','MCP','Modul sales'].entries()){
        const x=647+i*199;
        box(slide,x,329,171,77,i===1?C.blue:C.paper);
        t(label,x+12,351,147,40,24,true,i===1?C.white:C.ink);
        if(i<2)t('→',x+174,349,25,42,25,true,C.blue);
      }
      await proof(item.image,647,433,569,191);
      labels(item.rows,64,320,530,105);
      note(item.caption,647,646,569);
      break;
    case 'gallery':
      title(64,108,1150,54);
      for(const [i,[key,label,asset]] of item.projects.entries()){
        const x=64+(i%4)*296,y=283+Math.floor(i/4)*185;
        await proof(asset||key+'/pair',x,y,264,143);
        t(label,x,y+146,275,34,20,true);
      }
      t('Karya pendiri\ntermasuk sebelum Katalhys',952,485,264,125,25,true,C.pale);
      break;
    case 'order-case':
      title(64,108,1140,55);
      t('Gudang, pengiriman, admin, dan keuangan',64,262,1150,40,24,false,C.pale);
      await proof(item.image,64,329,805,279);
      labels([['Status & PIC','Tahap aktif dan penanggung jawab'],['Pembayaran & sales','Jatuh tempo dan aktivitas sales tercatat']],919,326,297,133);
      credit();
      break;
    case 'order-detail':
      title(64,111,480,49);
      labels([['Tahap aktif','Status, PIC, dan deadline pekerjaan'],['Riwayat pesanan','Perpindahan tahap dan catatan tim']],64,347,444,127);
      await proof(item.image,574,201,642,418);
      note('Contoh detail pesanan dengan data simulasi',574,639,642);
      break;
    case 'field-case':
      title(64,105,1150,54);
      await proof(item.image,64,285,1152,308,{left:0,top:0.28,right:0,bottom:0.29});
      t('Progres per zona',64,603,338,38,24,true,C.pale);
      t('Laporan & review',464,603,338,38,24,true,C.pale);
      t('Kontrol biaya',864,603,338,38,24,true,C.pale);
      credit();
      break;
    case 'field-detail':
      t('Monitoring di kantor',64,112,740,65,42,true);
      t('Input di lapangan',935,112,281,65,32,true,C.blue);
      await proof(item.image,64,210,804,411);
      await proof(item.secondImage,935,198,281,427);
      note(item.caption,64,646);
      break;
    case 'coating':
      title(64,114,465,49);
      labels(item.rows,64,390,430,119);
      await proof(item.image,550,220,666,397,{left:0.10,top:0.07,right:0.10,bottom:0.06});
      credit();
      break;
    case 'inquiry':
      title(64,110,1150,57);
      await proof(item.image,64,299,554,310);
      await proof(item.secondImage,662,299,554,310);
      note('Detail produk dan formulir permintaan penawaran asli');
      break;
    case 'web':
      title(64,126,520,60);
      t('Website MAXY AI',64,381,480,60,34,true,C.pale);
      t('Layanan, studi kasus,\ndan jalur konsultasi',64,463,488,110,27);
      await proof(item.image,622,222,465,302);
      await proof(item.secondImage,1101,223,115,373);
      credit();
      break;
    case 'program':
      await proof('ai-ceo-circle/desktop',64,131,687,470);
      title(807,139,409,39);
      t('AI CEO Circle',807,358,409,52,30,true,C.blue);
      t('Informasi program\nArtikel pendukung\nPendaftaran dua tahap',807,440,409,151,25);
      credit();
      break;
    case 'activity':
      title(64,108,1150,55);
      await proof('activity-review/desktop',64,296,793,307);
      labels([['Windows agent','Catatan aktivitas di perangkat'],['Dashboard','Ringkasan dan timeline'],['AI opsional','Hasil analisis ditinjau tim']],909,286,307,111);
      credit();
      break;
    case 'operations':
      title(64,108,1150,55);
      await proof('operations-control/desktop',450,300,766,303);
      t('Deployment\nRouting\nMonitoring\nBackup',64,304,360,298,40,true,C.pale);
      note('Diagram arsitektur deployment');
      break;
    case 'process':
      title(64,111,1150,55);
      for(const [i,r] of item.rows.entries()){
        const x=64+i*296,y=308+i%2*42;
        t(r[0],x,y,264,90,69,true,C.pale);
        t(r[1],x,y+110,264,86,29,true);
        t(r[2],x,y+206,264,100,20,false,C.pale);
      }
      await proof('logo-white',1146,110,70,70);
      break;
    case 'discovery':
      title(64,111,1150,59);
      await proof(item.image,709,322,507,299);
      labels(item.rows,64,320,574,106);
      note('Scope disusun dari alur kerja dan contoh yang Anda gunakan',64,646);
      break;
    case 'review':
      t('Desain',64,136,800,93,72,true);
      t('Build & staging',64,240,1000,93,72,true,C.blue);
      t('Review & perbaikan',64,344,1110,93,72,true);
      t('Anda meninjau alur utama\nsebelum aplikasi diserahkan',64,501,730,114,31);
      await proof(item.image,922,474,294,177);
      break;
    case 'handover': case 'ownership':
      title(64,109,1150,57);
      for(const [i,r] of item.rows.entries()){
        const x=i%2?680:64,y=i<2?327:494;
        await addIcon(slide,['clipboard-check','database','server-cog','panels-top-left'][i],x+8,y+5,49,C.blue);
        t(r[0],x+98,y+3,415,58,29,true);
        t(r[1],x+98,y+69,415,75,21,false,C.muted);
      }
      await proof('logo',1146,101,70,70);
      break;
    case 'offer':
      title(64,111,1150,60);
      t('Proyek',64,307,534,87,65,true);
      t('Maintenance',682,307,534,87,57,true,C.blue);
      t(item.rows[0][1],64,426,520,125,29);
      t(item.rows[1][1],682,426,520,125,29);
      await proof('logo',1146,584,70,70);
      note(item.caption,64,646);
      break;
    case 'reasons':
      title(64,110,1150,55);
      for(const [i,r] of item.rows.entries()){
        const x=64+i%2*602,y=296+Math.floor(i/2)*186;
        await proof(r[2],x,y,190,111);
        t(r[0],x+212,y,338,77,27,true);
        t(r[1],x+212,y+83,338,90,19,false,C.pale);
      }
      break;
    case 'closing':
      title(64,123,1100,78);
      t(item.subtitle,64,373,900,100,34);
      t('Ceritakan kebutuhannya\nKita tentukan scope awal\nLalu susun penawaran',64,516,930,137,27);
      await proof('logo-white',1035,452,181,181);
      break;
    case 'appendix':
      t('Diskusi',64,137,1110,170,133,true);
      t('lanjutan',64,301,1110,170,133,true,C.pale);
      t(item.subtitle,64,535,850,88,32);
      await proof('logo-white',1042,486,174,174);
      break;
    case 'scope-system': case 'cost':
      title(64,111,1150,54);
      labels(item.rows,64,303,534,111);
      await proof(item.image,647,303,569,315);
      note(item.caption,647,643,569);
      break;
    case 'scope-web':
      title(64,111,1150,56);
      await proof(item.image,64,310,575,313);
      labels(item.rows,702,301,514,107);
      break;
    case 'scope-design':
      title(64,123,705,62);
      t(item.body,64,417,702,150,30);
      await proof('logo',892,223,291,291);
      note('UI/UX dan identitas brand bisa menjadi proyek tersendiri');
      break;
    case 'scope-ops':
      title(64,111,1150,56);
      await proof(item.image,64,314,710,303);
      labels(item.rows,830,301,386,110);
      note('Pembagian tanggung jawab mengikuti kesepakatan');
      break;
    case 'scope-ai':
      title(64,111,1150,56);
      labels(item.rows,64,310,575,108);
      await proof(item.image,704,310,512,312);
      note('Sumber data dan hak akses ditentukan sebelum integrasi');
      break;
    case 'faq':
      t('Sebelum kita mulai',64,112,1150,93,69,true);
      labels(item.rows,64,273,913,123);
      await proof('logo-white',1038,440,178,178);
      break;
    default: throw new Error('Unplanned slide layout '+layout);
  }
  const timing=item.seconds?`Durasi sasaran: ${item.seconds} detik. Bagian utama, ${index+1}/${mainSlideCount}.`:'Lampiran opsional, di luar durasi utama.';
  slide.speakerNotes.text=`${timing}\n\n${item.notes}\n\nSumber isi dan visual:\n${item.sources.join('\n')}\nAset: ${[item.image,item.secondImage,...(item.projects||[]).map(p=>p[2]||p[0]+'/pair'),...(layout==='reasons'?item.rows.map(r=>r[2]):[])].filter(Boolean).join(', ')||'public/brand/katalhys-symbol.svg'}\nLayar aplikasi internal memakai database simulasi terpisah. Screenshot website publik direkam 25 Oktober 2026. Data simulasi bukan hasil bisnis klien.`;
}


export function validateStory() {
  assert.equal(story.length, 37);
  assert.equal(mainSlideCount, 28);
  const totalSeconds = story.reduce((sum, slide) => sum + slide.seconds, 0);
  assert.ok(totalSeconds >= 900 && totalSeconds <= 1200, `Timing is ${totalSeconds} seconds`);
  for (const item of story) {
    assert.ok(!/[\u2013\u2014]/u.test(JSON.stringify(item)), 'Long dash in deck copy or notes');
    assert.ok(item.notes.length > 100 && item.sources.length);
    assert.ok(!item.title.endsWith('.'), item.title);
    assert.ok(!/Rp\s?\d|\b500\.000\b|\b300\.000\b/.test(JSON.stringify(item)), 'Unapproved pricing');
  }
  const cases = story.filter(slide => slide.type === 'case');
  assert.equal(cases.length, 7);
  assert.equal(new Set(cases.map(slide => slide.image.split('/')[0])).size, 7);
  assert.ok(!/expert-profile|Isaac|Munandar/i.test(JSON.stringify(story)), 'Excluded portfolio');
  assert.equal(story[5].image, 'field-projects/new-board');
  assert.equal(story[0].image, 'order-sales/new-dashboard');
  assert.equal(story[0].secondImage, 'order-sales/new-mobile');
  assert.equal(story[6].image, 'maxy-ai/new-desktop');
  assert.match(story[3].subtitle, /Elroy/);
  assert.equal(story[15].image,'industrial-coatings/new-leads');
  assert.deepEqual(story.flatMap((s,i)=>s.image?.startsWith('field-projects/')?[i+1]:[]),[4,6,14,15]);
  for(const item of story){
    const displayed=[item.image,item.secondImage,...(item.projects||[]).map(p=>p[2]),...(item.layout==='reasons'?item.rows.map(r=>r[2]):[])].filter(Boolean);
    if(['cover','catalogue','design','ai','gallery','order-case','order-detail','coating','inquiry','web','discovery','review','reasons','scope-system','scope-ai','cost'].includes(item.layout)){
      assert.ok(!displayed.some(key=>/^(maxy-ai|industrial-coatings|order-sales)\/(?!new-)/.test(key)),`Archived asset in ${item.layout}`);
    }
  }
  return { slides: story.length, mainSlides: mainSlideCount, appendixSlides: story.length - mainSlideCount, totalSeconds };
}

export async function buildDeck(presentation, { indices = story.map((_, i) => i), clear = true } = {}) {
  validateStory();
  await registerFonts();
  assets = JSON.parse(await fs.readFile(path.join(buildDir, 'assets.json'), 'utf8'));
  if (clear && presentation.slides.items.length) presentation.slides.keep([]);
  for (const index of indices) {
    const slide = presentation.slides.add({ width: 1280, height: 720 });
    await renderSlide(slide, story[index], index);
    if (globalThis.process?.stdout && (index + 1) % 5 === 0) console.log(`Built ${index + 1}/${story.length}`);
  }
  return validateStory();
}

export async function saveNotes() {
  const info = validateStory();
  const contents = ['# Panduan presentasi Katalhys', '', `${info.mainSlides} slide utama, ${info.appendixSlides} lampiran. Durasi sasaran ${Math.floor(info.totalSeconds / 60)} menit ${info.totalSeconds % 60} detik, sebelum diskusi panjang.`, '', 'Catatan ini juga tersimpan pada speaker notes PPTX. Lampiran dimulai setelah penutup utama. Jangan membacakan semua lampiran dalam slot 15 sampai 20 menit.', '', ...story.flatMap((slide, i) => [`## ${String(i + 1).padStart(2, '0')}. ${slide.title.replace(/\n/g, ' ')}`, '', slide.seconds ? `Sasaran: ${slide.seconds} detik` : 'Opsional saat diskusi', '', slide.notes, ''])].join('\n');
  await fs.writeFile(path.join(outputDir, 'panduan-presentasi.md'), contents);
}

export async function renderFiles(presentation) {
  const dir = path.join(buildDir, 'slides');
  await fs.mkdir(dir, { recursive: true });
  for (const [index, slide] of presentation.slides.items.entries()) {
    const name = `slide-${String(index + 1).padStart(2, '0')}`;
    const png = await presentation.export({ slide, format: 'png', scale: 1 });
    await fs.writeFile(path.join(dir, `${name}.png`), new Uint8Array(await png.arrayBuffer()));
    const layout = await slide.export({ format: 'layout' });
    await fs.writeFile(path.join(dir, `${name}.json`), await layout.text());
  }
  const tiles = await Promise.all(presentation.slides.items.map((_, i) => sharp(path.join(dir, `slide-${String(i + 1).padStart(2, '0')}.png`)).resize(384, 216).png().toBuffer()));
  await sharp({ create: { width: 1616, height: Math.ceil(tiles.length / 4) * 232 + 16, channels: 3, background: '#D8DEE8' } }).composite(tiles.map((input, i) => ({ input, left: 16 + (i % 4) * 400, top: 16 + Math.floor(i / 4) * 232 }))).png().toFile(path.join(buildDir, 'overview.png'));
  const cover = await sharp(path.join(dir, 'slide-01.png')).resize(1280).png().toBuffer();
  await fs.writeFile(path.join(outputDir, 'preview.png'), cover);
}

export async function exportFiles(presentation) {
  const pptx = await presentation.export({ format: 'pptx' });
  await fs.writeFile(path.join(buildDir, 'candidate.pptx'), new Uint8Array(await pptx.arrayBuffer()));
  await saveNotes();
  return { ...validateStory(), candidate: path.join(buildDir, 'candidate.pptx') };
}

if (globalThis.process?.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await prepareAssets();
  await saveOrnamentSvgs();
  const { Presentation } = await import(pathToFileURL(path.join(runtimeModules, '@oai/artifact-tool/dist/artifact_tool.mjs')).href);
  const presentation = Presentation.create({ slideSize: { width: 1280, height: 720 } });
  await buildDeck(presentation);
  console.log('Rendering slides');
  await renderFiles(presentation);
  console.log(JSON.stringify(await exportFiles(presentation)));
  process.exit(0);
}
