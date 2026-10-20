import assert from "node:assert/strict";
import { chromium } from "playwright";
const base=process.argv[2]??"http://localhost:4322";
const browser=await chromium.launch({headless:true,channel:"chrome"});
let count=0;
try {
  for(const locale of ["en","id"]) for(const width of [1440,412]) {
    const page=await browser.newPage({viewport:{width,height:900}});
    const errors=[],requests=[];
    page.on("pageerror",e=>errors.push(e.message));
    page.on("request",r=>requests.push(r.url()));
    const routes=locale==="en"?["/","/services/","/process/","/portfolio/","/about/","/notes/"]:["/id/","/id/layanan/","/id/proses/","/id/karya/","/id/tentang/","/id/catatan/"];
    for(const route of routes) {
      assert.equal((await page.goto(base+route)).status(),200);
      await page.evaluate(()=>document.fonts.ready);
      const heading=page.locator("main h2").first();
      assert.ok((await heading.innerText()).trim().length>0);
      await heading.scrollIntoViewIfNeeded();
      const top=await heading.evaluate(e=>e.getBoundingClientRect().top+scrollY);
      await page.waitForTimeout(700);
      const state=await heading.evaluate(e=>({top:e.getBoundingClientRect().top+scrollY,transform:getComputedStyle(e).transform,opacity:getComputedStyle(e).opacity,animated:e.getAnimations({subtree:true}).length}));
      assert.equal(state.transform,"none",route+": heading never travels");
      assert.equal(state.opacity,"1",route+": heading stays readable");
      assert.equal(state.animated,0,route+": no heading entrance");
      assert.ok(Math.abs(state.top-top)<1,route+": stable text position");
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      if((route==="/"||route==="/id/")&&width>=768) {
        const scene=page.locator(".process-storyboard");
        await scene.scrollIntoViewIfNeeded();
        await page.waitForFunction(()=>document.querySelector(".process-storyboard").classList.contains("is-visible"));
        assert.ok((await scene.locator(".process-art-stage path").first().evaluate(e=>getComputedStyle(e).animationName)).includes("process-ink"));
        await page.waitForTimeout(1200);
        assert.equal(await scene.locator(".process-art-stage path").first().evaluate(e=>e.getAnimations().every(a=>a.playState==="finished")),true);
        await page.locator("#engagement-title").scrollIntoViewIfNeeded();
        await page.screenshot({path:`.work-capture/home-refresh/qa/${locale}-${width}-motion.png`});
      }
      count++;
    }
    assert.deepEqual(errors,[]);
    assert.equal(requests.some(url=>/gsap|ScrollTrigger|SplitText/i.test(url)),false);
    await page.close();
    console.log(`PASS ${locale}/${width}: 6 routes, readable stable headings, finite diagram, no GSAP requests`);
  }
  for(const options of [{reducedMotion:"reduce"},{javaScriptEnabled:false}]) {
    const page=await browser.newPage({...options,viewport:{width:412,height:915}});
    await page.goto(base+"/id/");
    assert.equal(await page.locator(".process-storyboard").isVisible(),false);
    await page.locator(".process-mobile summary").nth(1).click();
    assert.notEqual(await page.locator(".process-mobile details").nth(1).getAttribute("open"),null);
    assert.equal(await page.locator("#engagement-title").evaluate(e=>getComputedStyle(e).opacity),"1");
    await page.close();count++;
  }
  console.log(`PASS ${count} motion scenarios including reduced motion and no JavaScript`);
} finally {await browser.close()}
