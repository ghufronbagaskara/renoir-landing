import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {story} from '../story.mjs';
import {registerFonts} from '../prepare.mjs';

const require=createRequire(import.meta.url);
const sharp=require('sharp');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const build=path.join(root,'.build/v6');
const assets=JSON.parse(await fs.readFile(path.join(root,'.build/assets.json'),'utf8'));
const runtime=path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies');
await fs.mkdir(build,{recursive:true});
await fs.mkdir(path.join(root,'assets/ornaments-v6'),{recursive:true});
await registerFonts();
const C={ink:'#17191C',blue:'#1D4ED8',white:'#FFFFFF',muted:'#596273',pale:'#DBEAFE',paper:'#EEF2F8'};
const file=key=>assets[key].path;
const crops={
  dashboard:['order-sales/new-dashboard',{left:280,top:95,width:1280,height:455}],
  board:['field-projects/new-board',{left:620,top:150,width:900,height:500}],
  stage:['order-sales/new-order-detail',{left:330,top:275,width:700,height:465}],
  action:['order-sales/new-order-detail',{left:1058,top:275,width:510,height:305}],
  lead:['industrial-coatings/new-leads',{left:200,top:185,width:1200,height:255}],
  leadStatus:['industrial-coatings/new-leads',{left:963,top:242,width:435,height:197}],
  leadContext:['industrial-coatings/new-leads',{left:310,top:242,width:650,height:197}],
};
for(const [name,[key,rect]] of Object.entries(crops)){
  const dest=path.join(build,`${name}.png`);
  await sharp(file(key)).extract(rect).png().toFile(dest);
  crops[name]=dest;
}

// Explicitly requested ornaments: SVG masters plus lossless compatibility previews.
const ornaments={};
const icons={};
for(const name of ['workflow','server-cog','panels-top-left','database','pen-tool','target','users-round','clipboard-check']){
 icons[name]={};
 for(const color of [C.blue,C.white,C.pale]){
  const svg=(await fs.readFile(path.join(root,'assets/icons',`${name}.svg`),'utf8')).replaceAll('currentColor',color);
  const stem=`icon-${name}-${color.slice(1)}`;
  const svgPath=path.join(build,stem+'.svg'),pngPath=path.join(build,stem+'.png');
  await fs.writeFile(svgPath,svg);await sharp(Buffer.from(svg)).resize(256,256).png().toFile(pngPath);
  icons[name][color]={svg:svgPath,png:pngPath};
 }
}
for(const [tone,stroke,fill] of [['light','#B8CBE8','#F4F7FC'],['dark','#35445D','#1D2430'],['blue','#6B8DEB','#2758D9']]){
  ornaments[tone]=[];
  for(let variant=0;variant<6;variant++){
    const icon=['workflow','server-cog','panels-top-left','database','pen-tool','target'][variant];
    const raw=await fs.readFile(path.join(root,'assets/icons',`${icon}.svg`),'utf8');
    const inner=raw.replace(/<svg[^>]*>/,'').replace('</svg>','').replaceAll('currentColor',stroke);
    const dots=Array.from({length:24},(_,i)=>`<circle cx="${30+i%4*8}" cy="${510+Math.floor(i/4)*17}" r="1.5" fill="${stroke}"/>`).join('');
    const grid=Array.from({length:7},(_,i)=>`<path d="M${960+i*36} 526V644 M952 ${526+i*18}H1216"/>`).join('');
    const patterns=[
      `<path d="M970 603h72v-29h85v-29h89 M970 620h92v-29h94v-29h60"/><circle cx="970" cy="603" r="4"/><circle cx="1127" cy="545" r="4"/>`,
      `<path d="M1005 118l-24 24 24 24 M1167 118l24 24-24 24 M1100 99l-28 85"/><path d="M1030 611h185 M1070 594h145 M1110 577h105"/>`,
      `<path d="M1000 585h56v-28h76v-28h84 M1016 611h56v-28h76v-28h68"/><circle cx="1000" cy="585" r="5"/><circle cx="1211" cy="529" r="5"/>`,
      grid,
      `<path d="M1060 114h28 M1060 114v28 M1214 114h-28 M1214 114v28 M1060 248h28 M1060 248v-28 M1214 248h-28 M1214 248v-28"/><path d="M985 610h230 M1035 592h180"/>`,
      `<path d="M1000 610c0-95 75-160 210-160 M1040 610c0-70 57-120 170-120 M1080 610c0-46 40-80 130-80"/><circle cx="1210" cy="450" r="5"/>`,
    ];
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><path d="M1280 410c-95 9-167 101-167 225h167z" fill="${fill}"/><g stroke="${stroke}" stroke-width="1.5" fill="none" opacity=".68">${patterns[variant]}</g><g opacity=".65">${dots}</g><g transform="translate(1130 97) scale(3.1)" opacity=".48" stroke="${stroke}" fill="none" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
    const svgPath=path.join(root,'assets/ornaments-v6',`${tone}-${variant+1}.svg`);
    const pngPath=path.join(build,`${tone}-${variant+1}.png`);
    await fs.writeFile(svgPath,svg);
    await sharp(Buffer.from(svg)).png().toFile(pngPath);
    ornaments[tone].push({svg:svgPath,png:pngPath});
  }
}

const T=(text,x,y,w,h,size=26,color=C.ink,bold=false)=>({kind:'text',text,x,y,w,h,size,color,bold});
const P=(src,x,y,w,h)=>({kind:'image',src,x,y,w,h});
const B=(x,y,w,h,fill,line=null)=>({kind:'box',x,y,w,h,fill,line});
const L=(x,y,w,h,color=C.blue)=>({kind:'line',x,y,w,h,color});
const I=(icon,x,y,size=46,color=C.blue)=>({kind:'icon',icon,x,y,w:size,h:size,color});
const N=(text,x=64,y=646,w=1152)=>T(text,x,y,w,28,13,C.muted);
const title=text=>T(text,64,109,1135,137,54,C.ink,true);
const captionRole=n=>N(`Peran pendiri: ${story[n-1].role}`);
const originals={};
const edit=(n,items,notes)=>{originals[n]={items,notes};};

edit(6,[title(story[5].title),T('Tahap pekerjaan terlihat bersama konteksnya',64,270,365,110,29),I('workflow',64,407),T('Status proyek',130,407,300,40,25,C.ink,true),T('Tahap aktif dan progres setiap proyek',130,451,300,72,21,C.muted),I('clipboard-check',64,536),T('Tindak lanjut',130,536,300,38,25,C.ink,true),T('Peringatan dan tenggat tetap terlihat',130,576,300,58,21,C.muted),P(crops.board,470,272,746,346),N('Detail papan proyek asli dengan data simulasi',470,637,746)],
 'Papan ini memperlihatkan tahap, progres, dan hal yang perlu ditindaklanjuti. Perhatikan dua kolom yang diperbesar: setiap kartu tetap membawa konteks proyeknya. Angka dan peringatan berasal dari database simulasi, bukan hasil bisnis klien.');

edit(10,[T('AI',64,116,260,180,156,C.blue,true),T('untuk tugas\nyang jelas',325,132,870,150,61,C.ink,true),I('database',64,331),T('Sumber data yang dibatasi',132,333,470,45,27,C.ink,true),T('Contoh: pipeline, prospek, dan aktivitas sales',132,380,465,74,23,C.muted),I('users-round',64,481),T('Hasil ditinjau tim Anda',132,483,470,45,27,C.ink,true),T('Ringkasan dan bahan follow-up sesuai akses',132,530,465,82,23,C.muted),B(668,327,548,122,C.paper),T('Permintaan pengguna',692,345,498,35,24,C.ink,true),T('Ringkas prospek yang perlu ditindaklanjuti',692,389,492,54,23),L(942,451,0,32),B(668,490,548,122,C.blue),T('AI membaca data yang diizinkan',692,509,498,37,25,C.white,true),T('Tim meninjau ringkasan sebelum bertindak',692,554,492,47,23,C.white),N('Ilustrasi penggunaan berdasarkan integrasi MCP sales yang sudah diaudit')],
 'Contoh ini menjelaskan pekerjaan AI pada integrasi sales yang sudah diperiksa. Permintaannya berupa ringkasan prospek yang perlu ditindaklanjuti. Sumber dan hak akses dibatasi terlebih dahulu. Hasilnya membantu tim membaca data, sementara keputusan yang berdampak tetap ditinjau manusia. Rincian konektor dan kemampuan tersedia di lampiran.');

edit(12,[T(story[11].title,64,108,1135,139,54,C.white,true),T('Gudang, pengiriman, admin, dan keuangan',64,263,1150,40,24,C.pale),P(crops.dashboard,64,327,820,292),T('01',927,328,80,55,40,C.pale,true),T('Status & PIC',927,390,288,43,26,C.white,true),T('Tahap dan penanggung jawab pekerjaan',927,435,288,80,22,C.pale),T('02',927,517,80,50,40,C.pale,true),T('Pembayaran & sales',927,572,288,44,25,C.white,true),T('Jatuh tempo dan aktivitas tercatat',927,613,288,35,18,C.pale),T(`Peran pendiri: ${story[11].role}`,64,647,1152,28,13,C.pale)],story[11].notes);

edit(13,[title('Tahap pesanan dan PIC\nbisa ditelusuri'),T('Detail pekerjaan dan tindakan berikutnya berada dalam konteks pesanan yang sama',64,245,1140,42,25,C.muted),P(crops.stage,64,306,700,310),P(crops.action,810,306,406,243),I('workflow',64,624,24),T('Tahap, PIC, dan waktu tercatat',104,623,660,32,21,C.ink,true),T('Tindakan sesuai tahap dan hak akses',810,566,406,65,24,C.ink,true),N('Potongan layar asli dari satu detail pesanan dengan data simulasi')],
 'Perhatikan bagian yang diperbesar. Di kiri, tahap pekerjaan mencatat PIC serta waktu penyelesaiannya. Di kanan, aplikasi memperlihatkan tindakan yang tersedia sesuai tahap dan kewenangan pengguna. Riwayat pesanan tetap bisa ditinjau pada detail yang sama. Ini contoh fungsi aplikasi dengan data simulasi, bukan ukuran dampak operasional klien.');

edit(16,[title('Lead dari website\nsiap ditindaklanjuti'),T('Lead tracker admin',64,245,1120,44,28,C.ink,true),T('01  Kontak',64,309,350,40,25,C.blue,true),T('02  Kebutuhan proyek',432,309,410,40,25,C.blue,true),T('03  Status follow-up',862,309,354,40,25,C.blue,true),P(crops.lead,64,370,1152,245),N('Kontak, kebutuhan, asal inquiry, dan status pada admin asli; lead simulasi',64,623),captionRole(16)],
 'Satu lead diperbesar supaya konteksnya bisa dibaca. Kontak, kebutuhan proyek, asal inquiry, dan statusnya tersedia pada admin. Tim dapat menandai lead yang sudah dihubungi atau mengarsipkannya. Nama dan alamat pada contoh ini merupakan data simulasi. Tampilan tersebut membuktikan fungsi pencatatan, bukan klaim jumlah penjualan.');

edit(22,[T('Progres bisa Anda tinjau\ndi setiap tahap',64,109,1135,137,54,C.white,true),L(100,333,1075,0,C.pale),...[
 ['Pahami kebutuhan','Alur dan pengguna','workflow'],['Sepakati scope','Hasil dan batas pekerjaan','target'],['Desain & build','Review pada alur utama','panels-top-left'],['Siapkan handover','File, panduan, dan akses','clipboard-check'],
].flatMap(([heading,body,icon],i)=>[I(icon,76+i*293,284,56,C.white),T(String(i+1).padStart(2,'0'),76+i*293,373,100,65,49,C.pale,true),T(heading,76+i*293,461,255,81,30,C.white,true),T(body,76+i*293,554,255,76,23,C.pale)]),T('Hasil review menjadi dasar untuk melanjutkan tahap berikutnya',64,646,1120,28,15,C.pale)],
 'Cara kerja dimulai dari memahami alur dan pengguna. Setelah itu kita menyepakati hasil, batas pekerjaan, biaya, dan jadwal. Desain serta build ditinjau melalui alur utama yang disepakati. Handover mencakup hasil, panduan, dan akses sesuai scope. Bentuk review dan urutan rinci mengikuti kebutuhan proyek.');

edit(24,[title('Review pada alur\nyang akan dipakai tim'),I('workflow',64,291),T('Desain',132,291,415,42,31,C.ink,true),T('Alur dan tampilan dibahas bersama',132,342,440,68,23,C.muted),I('panels-top-left',64,425),T('Build & staging',132,425,440,45,31,C.blue,true),T('Tim meninjau skenario utama pada aplikasi',132,477,440,68,23,C.muted),I('clipboard-check',64,561),T('Review & perbaikan',132,560,445,48,31,C.ink,true),P(crops.stage,650,283,566,307),T('Contoh alur: tahap dan PIC pada pesanan',650,606,566,42,23,C.ink,true),N('Contoh layar aplikasi; bentuk dan tahap review mengikuti scope proyek')],
 'Review perlu menggunakan pekerjaan yang memang akan dilakukan pengguna. Contoh di kanan memperlihatkan tahap dan PIC pada pesanan. Untuk proyek Anda, kita tentukan skenario yang perlu diperiksa, lalu catat masukan dan perbaikan sebelum rilis. Gambar ini merupakan contoh aplikasi, bukan bukti bahwa seluruh proyek memakai satu prosedur review yang sama.');

edit(25,[title('File, akses,\ndan panduan penggunaan'),...[
 ['Hasil proyek','Desain atau aplikasi sesuai scope dan hasil review','clipboard-check'],['Source code & akses','Kode, file desain, data, serta akun yang disepakati','database'],['Panduan penggunaan','Petunjuk untuk pengguna dan admin','users-round'],['Maintenance lanjutan','Dukungan dan pembagian tanggung jawab sesuai kesepakatan','server-cog'],
].flatMap(([heading,body,icon],i)=>{const x=i%2?684:64,y=i<2?318:494;return[I(icon,x,y,52),T(heading,x+80,y,440,46,29,C.ink,true),T(body,x+80,y+61,440,91,23,C.muted)];}),N('Daftar hasil dan akses dirinci sebelum serah terima')],story[24].notes);

edit(26,[title('Mulai dengan proyek\nLanjutkan dengan maintenance'),I('panels-top-left',64,298,56),T('Proyek',64,381,510,62,51,C.ink,true),T('Desain atau pembangunan dengan hasil dan batas pekerjaan yang disepakati',64,466,510,105,28),I('server-cog',704,298,56),T('Maintenance',704,381,510,62,51,C.blue,true),T('Monitoring, pembaruan, dan dukungan teknis sesuai scope layanan',704,466,510,105,28),L(634,304,0,284,'#CBD5E1'),N('Biaya proyek, infrastruktur, dan layanan pihak ketiga dibahas terpisah')],story[25].notes);

edit(28,[T('Bagian mana yang ingin\nAnda perbaiki lebih dulu?',64,110,1152,161,63,C.white,true),T('Kita bahas satu alur kerja atau satu kebutuhan website sebagai dasar scope awal',64,319,830,112,32,C.white),L(64,471,1152,0,C.pale),T('Yang dapat Anda bawa',64,503,730,45,27,C.white,true),T('Contoh alur, formulir, spreadsheet, atau aplikasi yang digunakan sekarang',64,558,720,79,27,C.white),T('Hubungi Katalhys',866,505,350,43,25,C.white,true),T('WhatsApp [isi nomor]',866,561,350,38,21,C.white),T('Email [isi alamat email]',866,610,350,38,21,C.white)],
 'Pilih satu bagian yang paling perlu diperbaiki. Contoh alur, formulir, spreadsheet, atau aplikasi yang digunakan sekarang akan membantu kita membahas kebutuhan secara konkret. Hasil pembicaraan menjadi dasar untuk menyusun scope awal dan penawaran. Biaya, jadwal, serta tanggung jawab ditentukan setelah batas pekerjaan cukup jelas.');

const extra=[
 {after:17,title:'Alur inquiry dan follow-up',section:'Proyek 03 / Alur inquiry',seconds:45,tone:'light',notes:'Rangkaian ini memperlihatkan fungsi yang tersedia pada website produk dan admin. Pengunjung meninjau produk lalu mengisi permintaan penawaran. Admin menyediakan pencatatan lead dan status tindak lanjut. Gambar menggunakan layar asli dan data lead simulasi. Rangkaian ini adalah ilustrasi alur, bukan rekaman satu sesi pengguna atau bukti bahwa semua tindakan berjalan otomatis.',items:[
 title('Alur inquiry dan follow-up'),T('Konteks produk, kebutuhan proyek, dan tindak lanjut',64,230,1152,45,28,C.muted),
 P(file('industrial-coatings/new-product'),64,307,337,231),P(file('industrial-coatings/new-quote'),451,307,330,231),P(crops.leadStatus,831,307,385,231),
 ...[['Detail produk','Informasi yang dibutuhkan calon pelanggan',64],['Permintaan penawaran','Kebutuhan proyek ikut dicantumkan',451],['Lead tracker admin','Status untuk tindak lanjut tim',831]].flatMap(([a,b,x],i)=>[T('0'+(i+1),x,553,55,43,27,C.blue,true),T(a,x+55,554,300,43,25,C.ink,true),T(b,x,601,350,48,20,C.muted)]),
 N('Ilustrasi alur memakai layar asli; data lead simulasi',64,655),L(407,418,31,0),L(788,418,30,0),
 ]},
 {after:25,title:'Persiapan penggunaan sistem',section:'Cara bekerja / Penggunaan sistem',seconds:40,tone:'light',notes:'Perpindahan ke sistem baru perlu dibahas sejak penyusunan scope. Kita memeriksa sumber data dan pengguna, menentukan alur prioritas untuk diuji, lalu menyiapkan akses dan panduan. Pembagian pengelolaan setelah rilis disepakati sesuai kebutuhan. Ini pendekatan yang ditawarkan, bukan jaminan semua data dapat dipindahkan atau proses bisnis tidak akan mengalami gangguan. Pekerjaan dan biayanya perlu masuk kesepakatan proyek.',items:[
 title('Persiapan penggunaan sistem'),T('Kebutuhan perpindahan dibahas sejak penyusunan scope',64,226,1090,64,29,C.muted),
 L(89,342,0,267,'#D9E5F7'),
 ...[['Periksa data dan alur','Sumber data, pengguna, dan batas pemindahan'],['Uji alur prioritas','Skenario yang ditinjau bersama pengguna'],['Siapkan penggunaan','Panduan, akses, serta penanggung jawab'],['Sepakati pengelolaan','Monitoring, backup, dan dukungan setelah rilis']].flatMap(([a,b],i)=>{const y=308+i*85;return[B(64,y-1,65,52,C.white),T('0'+(i+1),64,y,65,47,33,C.blue,true),T(a,150,y,650,43,28,C.ink,true),T(b,150,y+42,650,44,22,C.muted)];}),
 I('users-round',900,294,42),T('Uji bersama tim',956,299,260,39,25,C.blue,true),P(file('order-sales/new-mobile'),928,353,255,269),T('Contoh tampilan mobile',880,634,336,31,18,C.muted),
 N('Cakupan, biaya, dan tanggung jawab mengikuti kesepakatan proyek',64,661),
 ]},
];

const {Presentation,PresentationFile}=await import(pathToFileURL(path.join(runtime,'node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs')).href);
const presentation=Presentation.create({slideSize:{width:1280,height:720}});
async function addCommand(slide,item){
 const position={left:item.x,top:item.y,width:item.w,height:item.h};
 if(item.kind==='text'){
  const shape=slide.shapes.add({geometry:'textbox',name:item.text.replaceAll('\n',' ').slice(0,64),position,fill:'none',line:{fill:'none',width:0}});
  shape.text=item.text;shape.text.style={typeface:item.bold?'General Sans':'Inter',fontSize:item.size,color:item.color,bold:item.bold,insets:0,autoFit:'none',wrap:'square',verticalAlignment:'top'};
 }else if(item.kind==='image'){
  await slide.images.add({blob:new Uint8Array(await fs.readFile(item.src)),contentType:'image/png',alt:'Layar proyek asli; data simulasi jika aplikasi internal',fit:'contain',position});
 }else if(item.kind==='icon'){
  const svg=(await fs.readFile(path.join(root,'assets/icons',item.icon+'.svg'),'utf8')).replaceAll('currentColor',item.color);
  await slide.images.add({svg,alt:'Ikon Lucide '+item.icon,position});
 }else if(item.kind==='line'){
  slide.shapes.add({geometry:'rect',position:{...position,width:Math.max(2,item.w),height:Math.max(2,item.h)},fill:item.color,line:{fill:'none',width:0}});
 }else slide.shapes.add({geometry:'rect',position,fill:item.fill,line:{fill:item.line||'none',width:item.line?1:0}});
}
for(const [i,item] of extra.entries()){
 const slide=presentation.slides.add();slide.background.fill=C.white;
 await addCommand(slide,P(file('logo'),51,27,41,41));
 await addCommand(slide,T('Katalhys',102,31,210,39,30,C.ink,true));
 await addCommand(slide,T(item.section,742,37,474,26,16,C.muted));
 await addCommand(slide,T('AI POWERED SOFTWARE HOUSE',64,679,480,22,12,C.muted,true));
 await addCommand(slide,T('00',1136,672,80,30,21,C.ink,true));
 for(const command of item.items)await addCommand(slide,command);
 slide.speakerNotes.text=`${item.notes}\n\nSumber isi dan visual:\nRiset docs/research/pitch-deck-enhancement-2026-10-28.md\nScreenshot asli promo/pitch-deck/assets, capture 25 Oktober 2026\nPendekatan penggunaan sistem adalah penawaran sesuai scope, bukan hasil bisnis klien.`;
}
await (await PresentationFile.exportPptx(presentation)).save(path.join(build,'additions.pptx'));
const manifest={root,build,base:path.join(root,'output/katalhys-pitch-id-v5.pptx'),baseSha256:'b68b134d3edbb9a81abf6173c6dc22ef42d44f082572664947e35cec31dd4b5e',ornaments,icons,originals,extra,originalStory:story};
assert.equal(story.length,37);assert.equal(extra.length,2);
assert(!/[\u2013\u2014]/.test(JSON.stringify({originals,extra})),'Long dash in new copy');
await fs.writeFile(path.join(build,'manifest.json'),JSON.stringify(manifest,null,2));
console.log(JSON.stringify({originalSlides:37,additions:2,totalSlides:39,editedOriginalSlides:Object.keys(originals),svgOrnaments:18}));
process.exit(0);
