import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const routes=[['services','/services/'],['marketing','/services/marketing-sites/'],['internal','/services/internal-systems/'],['design','/services/uiux-identity/'],['care','/services/deployment-care/'],['about','/about/'],['process','/process/'],['work','/portfolio/'],['work-detail','/portfolio/order-sales/'],['notes','/notes/'],['note-detail','/notes/speed-is-a-specification/'],['contact','/contact/'],['services-id','/id/layanan/'],['internal-id','/id/layanan/sistem-internal/'],['contact-id','/id/kontak/']];
const browser=await chromium.launch({headless:true});
const results=[];
try{for(const [id,route] of routes){for(const width of [390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  try{const response=await page.goto('http://127.0.0.1:4390'+route,{waitUntil:'domcontentloaded',timeout:30000});
    await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=800){scrollTo(0,y);await new Promise(r=>setTimeout(r,20));}scrollTo(0,0);});
    await page.waitForTimeout(350);
    const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...document.images].filter(i=>i.currentSrc&&(!i.complete||!i.naturalWidth)).map(i=>i.getAttribute('src')),headings:[...document.querySelectorAll('main h1,main h2,main h3')].map(x=>x.textContent.trim())}));
    if(width!==768)await page.screenshot({path:resolve(import.meta.dirname,`audit/${id}-${width}.jpg`),type:'jpeg',quality:65,fullPage:true,timeout:10000});
    results.push({id,route,width,status:response.status(),...data});
  }catch(e){results.push({id,route,width,error:String(e)});}finally{await page.close();}
}console.log(`Audited ${id}`);}
}finally{await browser.close();await writeFile(resolve(import.meta.dirname,'audit/measurements.json'),JSON.stringify(results,null,2));}
console.log(JSON.stringify({checked:results.length,issues:results.filter(r=>r.error||r.status!==200||r.overflow||r.broken.length)}));
