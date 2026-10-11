import sharp from "sharp";
import { chromium } from "playwright";
import { mkdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const raw = join(process.cwd(), ".work-capture/renoir-visual");
const output = join(process.cwd(), "src/assets/img/editorial");
await mkdir(output, { recursive: true });
const mark = (await readFile("src/components/ui/BrandMark.astro", "utf8"))
  .match(/<path[^>]+\/>/g)!
  .join("");
const font = (
  await readFile("src/assets/fonts/GeneralSans-Semibold.woff2")
).toString("base64");
const browser = await chromium.launch({ headless: true });

async function artwork(
  width: number,
  height: number,
  dark: boolean,
  campaign: boolean,
) {
  const page = await browser.newPage({ viewport: { width, height } });
  try {
    const top = campaign ? 33 : 15;
    await page.setContent(
      `<style>@font-face{font-family:General;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{margin:0;color:${dark ? "#f5f7fb" : "#17191c"};font-family:General,sans-serif}main{position:relative;width:${width}px;height:${height}px}.symbol{position:absolute;left:12%;top:${top}%;width:${dark ? (campaign ? "54" : "40") : "11"}%;color:#1d4ed8}.name{position:absolute;left:12%;top:${top + (dark ? (campaign ? 39 : 49) : 6)}%;font-size:${width * (dark ? 0.125 : 0.145)}px;letter-spacing:-.055em;margin:0;line-height:1}.statement{position:absolute;left:12%;top:${top + 21}%;font-size:${width * 0.075}px;line-height:1.12;margin:0;letter-spacing:-.025em}.rule{position:absolute;left:12%;right:12%;top:${top + 41}%;height:1px;background:#17191c}.scope{position:absolute;left:12%;top:${top + 44}%;font-size:${Math.max(9, width * 0.023)}px;letter-spacing:.025em;line-height:1.5}.number{position:absolute;right:12%;top:${top}%;font-size:${width * 0.021}px}</style><main><svg class="symbol" viewBox="0 0 66 64" fill="currentColor">${mark}</svg><p class="name">Renoir</p>${dark ? "" : `<span class="number">INDEPENDENT DIGITAL STUDIO</span><p class="statement">Design.<br>Build.<br>Run.</p><span class="rule"></span><p class="scope">WEBSITES / BUSINESS SYSTEMS / IDENTITY</p>`}</main>`,
    );
    await page.evaluate(() => document.fonts.ready);
    return await page.screenshot({ omitBackground: true });
  } finally {
    await page.close();
  }
}

async function campaign(
  source: string,
  boxes: [number, number, number, number][],
  dest: string,
  isHero = true,
) {
  const layers = [];
  for (const [index, [left, top, width, height]] of boxes.entries()) {
    layers.push({
      input: await artwork(
        width,
        height,
        index === 1 || dest === "about-result",
        isHero,
      ),
      left,
      top,
    });
  }
  await sharp(join(raw, source))
    .composite(layers)
    .png()
    .toFile(join(raw, `${dest}.png`));
}

async function webp(
  source: string | Buffer,
  name: string,
  width: number,
  height?: number,
  quality = 86,
) {
  const dest = join(output, `${name}.webp`);
  await sharp(source)
    .resize({ width, height, fit: "cover", withoutEnlargement: true })
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(dest);
  const meta = await sharp(dest).metadata();
  console.log(
    `${name}: ${meta.width}x${meta.height}, ${Math.round((await stat(dest)).size / 1024)} KB`,
  );
}

try {
  await campaign(
    "campaign-wall-desktop.png",
    [
      [266, 118, 537, 777],
      [873, 235, 397, 610],
    ],
    "hero-desktop",
  );
  await campaign(
    "campaign-wall-mobile.png",
    [
      [108, 262, 609, 937],
      [757, 748, 225, 451],
    ],
    "hero-mobile",
  );
  for (const [name, width, height] of [
    ["hero-desktop", 1536, 1024],
    ["hero-desktop-small", 960, 640],
    ["hero-mobile", 900, 1125],
    ["hero-mobile-small", 450, 563],
  ] as const) {
    await webp(
      join(
        raw,
        name.startsWith("hero-desktop")
          ? "hero-desktop.png"
          : "hero-mobile.png",
      ),
      name,
      width,
      height,
    );
  }

  const aboutJobs: {
    source: string;
    name: string;
    boxes: [number, number, number, number][];
  }[] = [
    {
      source: "campaign-book.png",
      name: "about-process",
      boxes: [[289, 158, 649, 920]],
    },
    {
      source: "campaign-detail.png",
      name: "about-result",
      boxes: [[121, 110, 1011, 1018]],
    },
  ];
  for (const job of aboutJobs) {
    await campaign(job.source, job.boxes, job.name, false);
    await webp(join(raw, `${job.name}.png`), job.name, 720, 720);
  }
  await sharp(join(raw, "campaign-porcelain.png"))
    .resize({
      width: 720,
      height: 900,
      fit: "contain",
      background: "#f5f7fb",
      withoutEnlargement: true,
    })
    .webp({ quality: 85, effort: 6 })
    .toFile("src/assets/img/about/porcelain-editorial.webp");

  for (const [name, project] of [
    ["home-proof-website", "maxy-ai"],
    ["home-proof-system", "order-sales"],
  ] as const) {
    const input = await sharp(`src/assets/img/work/${project}/desktop.webp`)
      .resize(672, 450, { fit: "inside", withoutEnlargement: true })
      .png()
      .toBuffer();
    const m = await sharp(input).metadata();
    const composite = await sharp({
      create: { width: 720, height: 500, channels: 4, background: "#f5f7fb" },
    })
      .composite([
        {
          input,
          left: Math.round((720 - m.width!) / 2),
          top: Math.round((500 - m.height!) / 2),
        },
      ])
      .png()
      .toBuffer();
    await webp(composite, name, 720);
  }
  for (const [service, project] of [
    ["marketing", "maxy-ai"],
    ["internal", "order-sales"],
    ["design", "expert-profile"],
    ["care", "operations-control"],
  ] as const) {
    await sharp(`src/assets/img/work/${project}/desktop.webp`)
      .resize(720, 720, {
        fit: "contain",
        background: "#f5f7fb",
        withoutEnlargement: true,
      })
      .webp({ quality: 90, effort: 6 })
      .toFile(join(output, `service-${service}-thumb.webp`));
  }
} finally {
  await browser.close();
}
