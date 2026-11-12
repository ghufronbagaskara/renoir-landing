import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../public/resources/sales-playbook');
const files={'/':'index.html','/index.html':'index.html','/modul-sales.pdf':'modul-sales.pdf','/lucide-license.txt':'lucide-license.txt'};
const types={'.html':'text/html; charset=utf-8','.pdf':'application/pdf','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
 const file=files[new URL(req.url,'http://localhost').pathname];
 if(!file){res.writeHead(404);res.end('Not found');return;}
 try{const bytes=await fs.readFile(path.join(root,file));res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store'});res.end(bytes);}
 catch{res.writeHead(503);res.end('The local document has not been built yet');}
}).listen(4393,'127.0.0.1',()=>console.log('Sales module preview: http://127.0.0.1:4393'));
