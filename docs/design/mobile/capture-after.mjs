import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const targets={services:['.si-service-2-main','.si-service-2-box','[data-hover-engagements]','.engagement-panel'],process:['.si-process-area','.si-faq-area'],portfolio:['.work-intro','.work-featured-grid','.work-catalog-head'],about:['.si-breadcumb-area','.studio-work','.si-counter-area','.about-fit'],notes:['.notes-grid','.si-blog-sidebar-text','.si-blog-sidebar-post'],contact:['#project-form']};
const metrics=[];
try {
for(const [route,selectors] of Object.entries(targets)) {
 const page=await browser.newPage({viewport:{width:394,height:852},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:4392/'+route+'/');await page.evaluate(async()=>{for(const image of document.images)image.loading='eager';await document.fonts.ready;});await page.waitForTimeout(300);
 for(const selector of [...selectors,'footer'])metrics.push({route,selector,...await page.locator(selector).first().evaluate(el=>({height:Math.round(el.getBoundingClientRect().height),heading:[...el.querySelectorAll('h1,h2,h3')].slice(0,2).map(h=>({text:h.textContent,font:getComputedStyle(h).fontSize}))}))});
 await page.screenshot({path:`docs/design/mobile/qa/after-${route}.png`,fullPage:true});await page.close();
}
for(const width of [394,1440]){
 const page=await browser.newPage({viewport:{width,height:852},reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4392/');await page.evaluate(async()=>{for(const image of document.images)image.loading='eager';await document.fonts.ready;});await page.waitForTimeout(700);await page.screenshot({path:`docs/design/mobile/qa/home-after-${width}.png`,fullPage:true});await page.close();
}
await writeFile('docs/design/mobile/qa/after-metrics.json',JSON.stringify(metrics,null,2));console.log('Updated screens captured for six inner pages and homepage isolation.');
}finally{await browser.close();}
