import { chromium } from 'playwright';
import sharp from 'sharp';

const browser = await chromium.launch();
const shots = [];
try {
  for (const [route, selector] of [['portfolio', '.work-featured'], ['notes', '.notes-layout'], ['contact', '#project-form']]) {
    const page = await browser.newPage({ viewport: { width: 394, height: 852 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await page.goto(`http://127.0.0.1:4392/${route}/`);
    await page.evaluate(async () => { for (const img of document.images) { img.loading = 'eager'; try { await img.decode(); } catch {} } await document.fonts.ready; });
    await page.locator(selector).evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - 84));
    await page.waitForTimeout(250);
    const shot = await page.screenshot({ path: `docs/design/mobile/qa/phone-${route}.png` });
    shots.push({ input: shot, left: shots.length * 410 + 12, top: 44 });
    await page.close();
  }
  const labels = Buffer.from('<svg width="1230" height="36"><style>text{font:600 18px Arial;fill:#15181e}</style><text x="12" y="27">Work · 394px</text><text x="422" y="27">Notes · 394px</text><text x="832" y="27">Contact · 394px</text></svg>');
  await sharp({ create: { width: 1230, height: 908, channels: 3, background: '#e9edf5' } }).composite([{ input: labels, top: 0, left: 0 }, ...shots]).png().toFile('docs/design/mobile/qa/mobile-preview.png');
  console.log('Saved three mobile previews and montage.');
} finally { await browser.close(); }
