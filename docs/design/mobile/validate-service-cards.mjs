import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch();const results=[];
for(const route of ['services','id/layanan']){
 const context=await browser.newContext({viewport:{width:394,height:852},isMobile:true,hasTouch:true});
 const page=await context.newPage();await page.goto(`http://127.0.0.1:4392/${route}/`);
 const cards=page.locator('.si-service-2-box');assert.equal(await cards.count(),4);
 for(let i=0;i<4;i++){
  const card=cards.nth(i);await card.scrollIntoViewIfNeeded();const text=await card.innerText();
  const box=await card.boundingBox();await page.touchscreen.tap(box.x+8,box.y+8);await page.waitForTimeout(350);
  const colors=await card.evaluate(el=>({background:getComputedStyle(el).backgroundColor,text:[...el.querySelectorAll('h3 a,h3 a i,.si-service-2-p p,.service-card-lead,.service-card-detail')].map(node=>getComputedStyle(node).color)}));
  assert.equal(colors.background,'rgb(23, 25, 28)');assert(colors.text.every(color=>color==='rgb(255, 255, 255)'),JSON.stringify(colors));assert.equal(await card.innerText(),text);
  results.push({route,card:i+1,...colors});
  if(i===0)await card.screenshot({path:`docs/design/mobile/qa/service-card-touch-${route.replace('/','-')}.png`});
 }
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await context.close();
}
const context=await browser.newContext({viewport:{width:394,height:852},javaScriptEnabled:false});
const page=await context.newPage();await page.goto('http://127.0.0.1:4392/services/');
const link=page.locator('.si-service-2-box h3 a').first();await link.focus();await page.waitForTimeout(350);
assert.equal(await link.evaluate(el=>getComputedStyle(el).color),'rgb(255, 255, 255)');
const destination=await link.getAttribute('href');await link.press('Enter');assert(new URL(page.url()).pathname===destination);
await browser.close();
await writeFile('docs/design/mobile/qa/service-card-touch.json',JSON.stringify({results,keyboardAndNoJs:'PASS'},null,2));
console.log('PASS: 8 EN/ID touch states, complete descriptions, white title/arrow/body, no overflow; keyboard link works without JavaScript.');
