import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const fontverter = require('fontverter');
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const buildDir = path.join(root, 'promo/pitch-deck/.build');
export const outputDir = path.join(root, 'promo/pitch-deck/output');
export const runtimeModules = globalThis.process?.env?.KATALHYS_RUNTIME_MODULES || path.join(os.homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');

export async function prepareAssets() {
  await fs.mkdir(path.join(buildDir, 'assets'), { recursive: true });
  await fs.mkdir(path.join(buildDir, 'fonts'), { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });
  const metadata = {};
  for (const project of await fs.readdir(path.join(root, 'src/assets/img/work'))) {
    if (project === 'expert-profile') continue;
    const dir = path.join(root, 'src/assets/img/work', project);
    if (!(await fs.stat(dir)).isDirectory()) continue;
    for (const file of await fs.readdir(dir)) {
      if (!file.endsWith('.webp') || /thumb|pair-mobile/.test(file)) continue;
      const key = `${project}/${file.replace('.webp', '')}`;
      const dest = path.join(buildDir, 'assets', `${project}-${file.replace('.webp', '.png')}`);
      await sharp(path.join(dir, file)).resize({ width: 1800, height: 1500, fit: 'inside', withoutEnlargement: true }).png().toFile(dest);
      const { width, height } = await sharp(dest).metadata();
      metadata[key] = { path: dest, width, height };
    }
  }
  const captureRoot = path.join(root, 'promo/pitch-deck/assets');
  for (const project of await fs.readdir(captureRoot, {withFileTypes:true})) {
   if (!project.isDirectory()) continue;
   const captured=path.join(captureRoot,project.name);
   for (const file of await fs.readdir(captured)) {
    if (!file.endsWith('.png')) continue;
    const assetPath = path.join(captured,file);
    const {width,height} = await sharp(assetPath).metadata();
    metadata[`${project.name}/${file.slice(0,-4)}`] = {path:assetPath,width,height};
   }
  }
  for (const variant of ['', '-white', '-mono']) {
    const key = `logo${variant}`;
    const dest = path.join(buildDir, 'assets', `${key}.png`);
    await sharp(path.join(root, `public/brand/katalhys-symbol${variant}.svg`), { density: 288 }).png().toFile(dest);
    metadata[key] = { path: dest, width: 768, height: 768 };
  }
  for (const service of ['marketing', 'internal', 'design', 'care']) {
    const dest = path.join(buildDir, 'assets', `art-${service}.png`);
    await sharp(path.join(root, `src/assets/img/home-refresh/service-${service}.webp`)).png().toFile(dest);
    metadata[`art-${service}`] = { path: dest, width: 800, height: 533 };
  }
  for (const weight of ['Regular', 'Semibold', 'Bold']) {
    const source = await fs.readFile(path.join(root, `src/assets/fonts/GeneralSans-${weight}.woff2`));
    await fs.writeFile(path.join(buildDir, 'fonts', `GeneralSans-${weight}.ttf`), await fontverter.convert(source, 'sfnt'));
  }
  const interDir = path.join(root, 'node_modules/@fontsource-variable/inter/files');
  const inter = (await fs.readdir(interDir)).find(file => /^inter-latin-wght-normal\.woff2$/.test(file));
  if (!inter) throw new Error('Inter Latin font is missing');
  await fs.writeFile(path.join(buildDir, 'fonts/Inter.ttf'), await fontverter.convert(await fs.readFile(path.join(interDir, inter)), 'sfnt'));
  await fs.writeFile(path.join(buildDir, 'assets.json'), JSON.stringify(metadata, null, 2));
  const selected = Object.entries(metadata).filter(([key]) => key.endsWith('/pair'));
  const tiles = await Promise.all(selected.map(async ([, item]) => sharp(item.path).resize(480, 270, { fit: 'contain', background: '#EEF2F8' }).png().toBuffer()));
  await sharp({ create: { width: 960, height: 1080, channels: 3, background: '#EEF2F8' } }).composite(tiles.map((input, i) => ({ input, left: (i % 2) * 480, top: Math.floor(i / 2) * 270 }))).png().toFile(path.join(buildDir, 'source-review.png'));
  return metadata;
}

export async function registerFonts() {
  const { FontLibrary } = require(path.join(runtimeModules, '@oai/artifact-tool/node_modules/skia-canvas'));
  FontLibrary.use('General Sans', ['Regular', 'Semibold', 'Bold'].map(weight => path.join(buildDir, `fonts/GeneralSans-${weight}.ttf`)));
  FontLibrary.use('Inter', path.join(buildDir, 'fonts/Inter.ttf'));
  return { GeneralSans: FontLibrary.has('General Sans'), Inter: FontLibrary.has('Inter') };
}

if (globalThis.process?.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const assets = await prepareAssets();
  console.log(JSON.stringify({ assets: Object.keys(assets).length, fonts: await registerFonts(), metadata: Object.fromEntries(Object.entries(assets).filter(([key]) => /\/pair$|\/chat$|\/desktop$/.test(key)).map(([key, item]) => [key, [item.width, item.height]])) }));
}
