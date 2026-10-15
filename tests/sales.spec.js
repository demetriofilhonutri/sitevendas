import {test,expect} from '@playwright/test';
for(const width of [390,1440])test(`Fluxo comercial e layout em ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 await expect(page.getByRole('heading',{level:1})).toContainText('Chega de repetir refeições');
 await expect(page.locator('#oferta-combo .price')).toContainText('30,00');
 await expect(page.locator('#oferta-combo')).toContainText('Economia de R$');
 await expect(page.locator('#oferta-assist .price')).toContainText('19,90');
 await expect(page.locator('#oferta-receitas .price')).toContainText('19,90');
 await page.locator('[data-choice="assist"]').click();await expect(page.locator('#recommendation')).toContainText('DF Assist');
 await page.locator('#recommendation a').click();await expect(page).toHaveURL(/#oferta-assist$/);
 await page.locator('[data-choice="receitas"]').click();await expect(page.locator('#recommendation')).toContainText('Filtro de Receitas');
 await page.locator('[data-choice="combo"]').click();await expect(page.locator('#recommendation')).toContainText('Combo DF');
 await page.getByText('Essas ferramentas substituem um nutricionista?',{exact:true}).click();await expect(page.locator('details[open]')).toContainText('Não substituem');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 expect(await page.locator('[data-checkout="true"]').count()).toBe(0);
 expect(await page.evaluate(()=>window.dataLayer.some(e=>e.event==='begin_checkout'))).toBe(false);
 expect(await page.evaluate(()=>window.dataLayer.some(e=>e.event==='cta_click'))).toBe(true);
 const broken=await page.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1))));expect(broken).toEqual([]);expect(errors).toEqual([]);
 await page.goto('/');await page.screenshot({path:`/tmp/df-${width}.png`,fullPage:true});
});

test('Demonstração real carrega e reproduz sem erro',async({page})=>{
 await page.goto('/');
 const video=page.locator('#demonstracao-receitas .demo-video video');
 await video.evaluate(v=>{v.muted=true;v.load();});
 await expect.poll(()=>video.evaluate(v=>v.readyState)).toBeGreaterThanOrEqual(2);
 expect(await video.evaluate(v=>v.videoWidth)).toBe(1160);
 expect(await video.evaluate(v=>v.duration)).toBeGreaterThan(10);
 await video.evaluate(v=>v.play());
 await expect.poll(()=>video.evaluate(v=>v.currentTime)).toBeGreaterThan(0.5);
 await video.evaluate(v=>v.pause());
 await expect(page.locator('#demo-transcript')).toContainText('O vídeo não demonstra a exportação de PDF');
 const image=page.locator('.recipes-panel .real-capture');await image.scrollIntoViewIfNeeded();await image.evaluate(i=>i.decode());
 expect(await image.evaluate(i=>i.naturalWidth)).toBe(1160);
});

for (const [file,width] of [['substituicoes.mp4',530],['compras-calculadoras.mp4',920]]) test(`Vídeo real DF Assist: ${file}`,async({page})=>{
 await page.goto('/');
 const video=page.locator(`#demonstracao-dfassist video:has(source[src$="${file}"])`);
 await video.evaluate(v=>{v.muted=true;v.load();});
 await expect.poll(()=>video.evaluate(v=>v.readyState)).toBeGreaterThanOrEqual(2);
 expect(await video.evaluate(v=>v.videoWidth)).toBe(width);
 await video.evaluate(v=>v.play());
 await expect.poll(()=>video.evaluate(v=>v.currentTime)).toBeGreaterThan(.5);
 await video.evaluate(v=>v.pause());
 await expect(page.locator('#assist-video-description')).toContainText('Substituição com ressalvas');
 await expect(page.locator('#assist-other-description')).toContainText('A gravação não mostra a importação');
});
