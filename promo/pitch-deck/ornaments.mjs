import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const dir=path.join(path.dirname(fileURLToPath(import.meta.url)),'assets/ornaments');
const inks={light:'#E2EAF8',dark:'#303D57',blue:'#426DE2'};
const paths=[
 [{moveTo:{x:884,y:88}},{cubicBezTo:{x1:1045,y1:88,x2:1117,y2:154,x:1117,y:300}},{cubicBezTo:{x1:1117,y1:468,x2:1182,y2:537,x:1278,y:537}}],
 [{moveTo:{x:985,y:88}},{cubicBezTo:{x1:1148,y1:88,x2:1201,y2:174,x:1201,y:320}},{cubicBezTo:{x1:1201,y1:431,x2:1232,y2:469,x:1278,y:469}}],
 [{moveTo:{x:1113,y:88}},{cubicBezTo:{x1:1234,y1:88,x2:1278,y2:173,x:1278,y:249}}],
];
const commandSvg=commands=>commands.map(c=>c.moveTo?`M${c.moveTo.x} ${c.moveTo.y}`:`C${c.cubicBezTo.x1} ${c.cubicBezTo.y1} ${c.cubicBezTo.x2} ${c.cubicBezTo.y2} ${c.cubicBezTo.x} ${c.cubicBezTo.y}`).join(' ');

export function addOrnaments(slide,tone,index){
 const color=inks[tone];
 // The shared open paths echo the two curved fields of the approved symbol.
 for(const [i,commands] of paths.entries())slide.shapes.add({geometry:'custom',name:`Katalhys background curve ${i+1}`,position:{left:0,top:0,width:1280,height:720},fill:'none',line:{fill:color,width:i===0?3:1.5},customPaths:[{width:1280,height:720,commands}]});
 const offset=index%3*8;
 slide.shapes.add({geometry:'rect',name:'Katalhys section accent',position:{left:28,top:112+offset,width:4,height:48},fill:tone==='light'?'#1D4ED8':tone==='blue'?'#8FACF5':'#4269B5',line:{fill:'none',width:0}});
}

export async function saveOrnamentSvgs(){
 await fs.mkdir(dir,{recursive:true});
 for(const [tone,color] of Object.entries(inks))await fs.writeFile(path.join(dir,`katalhys-flow-${tone}.svg`),`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" fill="none">${paths.map((commands,i)=>`<path d="${commandSvg(commands)}" stroke="${color}" stroke-width="${i===0?3:1.5}" stroke-linecap="round"/>`).join('')}</svg>`);
}

export async function addIcon(slide,name,x,y,size,color){
 const file=path.join(dir,'../icons',name+'.svg');
 const svg=(await fs.readFile(file,'utf8')).replaceAll('currentColor',color);
 return slide.images.add({svg,alt:`Ikon Lucide: ${name}`,position:{left:x,top:y,width:size,height:size}});
}
