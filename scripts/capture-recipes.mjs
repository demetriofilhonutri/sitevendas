// Captura somente uma cópia local intacta do produto. Não altera o original.
import {chromium} from '@playwright/test';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
const source=process.env.RECIPES_SOURCE;
if(!source)throw Error('Informe RECIPES_SOURCE com o checkout público original.');
const server=spawn('python3',['-m','http.server','8137','--bind','127.0.0.1','--directory',source],{stdio:'ignore'});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1160,height:820},deviceScaleFactor:1});
// Recursos externos indisponíveis não são substituídos por telas ou dados simulados.
await page.route('https://**/*',route=>route.abort());
await mkdir('/tmp/df-recipe-frames',{recursive:true});
let running=false,frame=0;
try{
 await page.goto('http://127.0.0.1:8137');
 await page.locator('#recipesBody tr').first().waitFor();
 const count=await page.locator('#resultsCount').innerText();
 if(Number(count)<1)throw Error('Base de receitas não carregada.');
 await page.locator('.filters').scrollIntoViewIfNeeded();
 await page.evaluate(()=>window.scrollTo(0,document.querySelector('.filters').getBoundingClientRect().top+scrollY-24));
 await page.screenshot({path:'public/media/receitas-filtros.png'});
 running=true;
 const recording=(async()=>{while(running){const start=Date.now();await page.screenshot({path:`/tmp/df-recipe-frames/frame-${String(frame++).padStart(5,'0')}.png`});await new Promise(r=>setTimeout(r,Math.max(0,250-(Date.now()-start))));}})();
 await page.waitForTimeout(1600);
 await page.locator('#searchName').pressSequentially('Crepioca',{delay:220});
 await page.waitForTimeout(1500);
 await page.locator('#caloriesMax').pressSequentially('300',{delay:200});
 await page.locator('#proteinMin').pressSequentially('17',{delay:200});
 await page.locator('#filterDoce').uncheck();
 await page.waitForTimeout(1800);
 if(!(await page.locator('#recipesBody').innerText()).includes('Crepioca'))throw Error('Fluxo de filtros falhou.');
 await page.screenshot({path:'public/media/receitas-resultado.png'});
 await page.locator('#recipesBody').getByRole('button',{name:'Ver Detalhes'}).first().click();
 await page.locator('#viewRecipeModal').waitFor({state:'visible'});
 await page.waitForTimeout(2500);
 await page.screenshot({path:'public/media/receitas-detalhes.png'});
 await page.locator('.modal-content').evaluate(e=>e.scrollTo({top:350,behavior:'smooth'}));
 await page.waitForTimeout(2500);
 running=false;await recording;
 await writeFile('public/media/proveniencia.json',JSON.stringify({product:'Filtro de Receitas',officialUrl:'https://demetriofilhonutri.github.io/receitasnutri/',repository:'https://github.com/demetriofilhonutri/receitasnutri',commit:'940b557488bd69936224b3877516547ac389eab6',capture:'Navegação real em cópia local intacta do código público; acesso ao site oficial bloqueado pela rede. Recursos externos indisponíveis: fontes, logotipo e bibliotecas de PDF. O vídeo não demonstra exportação PDF.',flow:'Busca Crepioca, máximo 300 kcal, proteína mínima 17g, desmarcar doces, abrir detalhes.',frames:frame,fps:4},null,2)+'\n');
 console.log(`${frame} quadros capturados; ${count} receitas carregadas.`);
}finally{running=false;await browser.close();server.kill();}
