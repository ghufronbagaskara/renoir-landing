import sharp from 'sharp';
import { resolve } from 'node:path';
const assets = resolve(import.meta.dirname, 'assets');
const source = resolve(assets, 'internal-systems-master.png');
for (const width of [1440, 768]) await sharp(source).resize({width}).webp({quality:84}).toFile(resolve(assets, `internal-${width}.webp`));
for (const [i, left] of [0, 330, 720, 1056].entries()) await sharp(source).extract({left,top:160,width:480,height:740}).resize({height:600}).webp({quality:84}).toFile(resolve(assets, `station-${i}.webp`));
console.log('Prepared two responsive images and four focus crops. Master preserved.');
