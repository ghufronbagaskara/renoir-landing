export function estimateDuration(area, primer, body, finish) {
  const values=[area,primer,body,finish];
  if(!values.every(Number.isFinite)||area<=0||area>1e7||values.slice(1).some(v=>v<0||v>100||!Number.isInteger(v)))return null;
  const coverage=[area,area*primer,area*body,area*finish];
  const normal=[175,175,159.8,140],slow=[64.3,64.3,115.6,66.8];
  const days=speeds=>Math.ceil(coverage.reduce((sum,v,i)=>sum+v/speeds[i],0)*.76);
  return {median:days(normal),slow:days(slow)};
}

export function opportunities(rows,index) {
  if(!Number.isInteger(index)||index<0||index>4)return {never:[],cancelled:[]};
  const repeat=rows.filter(row=>row.slice(1).includes('done'));
  return {never:repeat.filter(row=>row[index+1]==='').map(row=>row[0]),cancelled:repeat.filter(row=>row[index+1]==='cancel').map(row=>row[0])};
}

if(typeof document!=='undefined'){
  const data=JSON.parse(document.getElementById('module-data').textContent);
  const $=id=>document.getElementById(id);
  const toc=document.querySelector('.toc-shell');
  if(matchMedia('(max-width:800px)').matches)toc.open=false;
  const links=[...document.querySelectorAll('#toc a')];
  const sections=links.map(link=>document.querySelector(link.getAttribute('href')));
  let scheduled=false;
  function updateNavigation(){
    scheduled=false;
    let current=0;
    sections.forEach((section,i)=>{if(section.getBoundingClientRect().top<170)current=i;});
    links.forEach((link,i)=>{link.classList.toggle('on',i===current);if(i===current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    const available=document.documentElement.scrollHeight-innerHeight;
    $('progress').style.width=(available>0?Math.min(100,scrollY/available*100):0)+'%';
  }
  function scheduleNavigation(){if(!scheduled){scheduled=true;requestAnimationFrame(updateNavigation);}}
  addEventListener('scroll',scheduleNavigation,{passive:true});addEventListener('resize',scheduleNavigation);updateNavigation();
  links.forEach(link=>link.addEventListener('click',()=>{if(matchMedia('(max-width:800px)').matches)toc.open=false;}));

  const inputs=['luas','lPrimer','lBody','lFinish'].map($);
  inputs.forEach((input,i)=>{input.max=i?100:1e7;input.min=0;});
  function calculate(){
    const result=estimateDuration(...inputs.map(input=>Number(input.value)));
    inputs.forEach((input,i)=>input.setAttribute('aria-invalid',String(!input.validity.valid||(i===0&&Number(input.value)<=0))));
    if(!result){
      $('outMed').textContent='Periksa input';$('outPes').textContent='Periksa input';
      $('outMedSub').textContent='Isi luas lebih dari nol dan jumlah lapis bulat 0 sampai 100.';
      $('outPesSub').textContent='Skenario dapat dihitung setelah input valid.';return;
    }
    $('outMed').textContent=result.median+' hari kerja';$('outPes').textContent=result.slow+' hari kerja';
    $('outMedSub').textContent='Skenario median, sekitar '+Math.ceil(result.median/6)+' minggu.';
    $('outPesSub').textContent='Skenario lambat, sekitar '+Math.ceil(result.slow/6)+' minggu. Validasi bersama tim proyek.';
  }
  inputs.forEach(input=>input.addEventListener('input',calculate));calculate();

  function tagList(parent,names,cancelled=false){
    const list=document.createElement('ul');list.className='chips';
    names.forEach(name=>{const item=document.createElement('li');item.textContent=name;if(cancelled)item.className='batal';list.append(item);});
    parent.append(list);
  }
  function filterClients(){
    const index=Number($('pilihProduk').value),result=opportunities(data.klien,index),box=$('hasilMatriks');
    box.replaceChildren();
    const title=document.createElement('p');title.textContent=result.never.length+' klien lama belum memakai '+data.products[index]+':';box.append(title);
    if(result.never.length)tagList(box,result.never);else{const p=document.createElement('p');p.textContent='Tidak ada klien pada kategori ini.';box.append(p);}
    if(result.cancelled.length){const p=document.createElement('p');p.style.marginTop='18px';p.textContent='Pernah batal pada lini ini; periksa konteks sebelum menghubungi:';box.append(p);tagList(box,result.cancelled,true);}
  }
  $('pilihProduk').addEventListener('change',filterClients);filterClients();

  const storageKey='katalhys-sales-demo-checklist-v1';
  function readChecks(){try{const value=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(value)?value.filter(n=>Number.isInteger(n)&&n>=0&&n<data.tugas.length):[];}catch{return [];}}
  function saveChecks(value){try{localStorage.setItem(storageKey,JSON.stringify(value));}catch{/* shortcut: storage can be denied; checkbox state lasts until reload in that case. */}}
  const checked=readChecks(),boxes=[...document.querySelectorAll('[data-task]')];
  boxes.forEach((box,i)=>{box.checked=checked.includes(i);box.addEventListener('change',()=>saveChecks(boxes.flatMap((b,j)=>b.checked?[j]:[])));});
  $('resetCek').addEventListener('click',()=>{boxes.forEach(box=>box.checked=false);saveChecks([]);});

  const quiz=$('quiz'),printCopy=quiz.cloneNode(true);printCopy.removeAttribute('id');printCopy.className='quiz-print';
  printCopy.querySelector('.quiz-intro')?.remove();printCopy.querySelectorAll('details').forEach(detail=>detail.open=true);quiz.after(printCopy);
  let question=0,score=0;
  function showQuestion(){
    quiz.replaceChildren();
    const heading=document.createElement('h3');quiz.append(heading);
    if(question===data.soal.length){
      heading.textContent='Hasil kuis';
      const result=document.createElement('p');result.className='question';result.textContent=score+' dari '+data.soal.length+' jawaban benar';quiz.append(result);
      const text=document.createElement('p');text.textContent=score===data.soal.length?'Seluruh pertanyaan terjawab. Anda bisa melanjutkan ke checklist.':'Tinjau kembali penjelasan pada bab terkait, lalu coba lagi.';quiz.append(text);
      const retry=document.createElement('button');retry.type='button';retry.className='btn';retry.textContent='Ulangi kuis';retry.addEventListener('click',()=>{question=0;score=0;showQuestion();});quiz.append(retry);return;
    }
    const item=data.soal[question];heading.textContent='Pertanyaan '+(question+1)+' dari '+data.soal.length;
    const progress=document.createElement('progress');progress.max=data.soal.length;progress.value=question;progress.setAttribute('aria-label','Pertanyaan yang sudah dijawab');quiz.append(progress);
    const prompt=document.createElement('p');prompt.className='question';prompt.textContent=item.q;quiz.append(prompt);
    let answered=false;
    const options=item.o.map((value,i)=>{
      const button=document.createElement('button');button.type='button';button.className='opsi';button.textContent=value;
      button.addEventListener('click',()=>{
        if(answered)return;answered=true;
        options.forEach((option,j)=>{option.disabled=true;if(j===item.a)option.classList.add('benar');});
        if(i===item.a)score++;else button.classList.add('salah');
        const feedback=document.createElement('p');feedback.className='umpan';feedback.setAttribute('role','status');feedback.textContent=(i===item.a?'Benar. ':'Belum tepat. ')+item.e;quiz.append(feedback);
        const next=document.createElement('button');next.className='btn';next.type='button';next.textContent=question===data.soal.length-1?'Lihat hasil':'Pertanyaan berikutnya';next.addEventListener('click',()=>{question++;showQuestion();});quiz.append(next);next.focus();
      });quiz.append(button);return button;
    });
  }
  showQuestion();
  document.querySelectorAll('[data-print]').forEach(button=>button.addEventListener('click',()=>print()));
}
