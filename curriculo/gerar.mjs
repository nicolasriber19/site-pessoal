// Gera o currículo em PDF (A4, 1 página) a partir de curriculo/curriculo.html, pelo Chrome.
// Uso, na pasta site-pessoal: node curriculo/gerar.mjs
// Saída: public/curriculo-nicolas-ribeiro.pdf (vai junto no site) + curriculo/previa.png (para conferir).
import { chromium } from 'playwright-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';

const aqui = dirname(fileURLToPath(import.meta.url));
const html = join(aqui, 'curriculo.html');
const pdf = join(aqui, '..', 'public', 'curriculo-nicolas-ribeiro.pdf');

const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 2 });
await p.goto(pathToFileURL(html).href);
await p.evaluate(() => document.fonts.ready);
await p.emulateMedia({ media: 'print' });

// cabe numa página? (A4 = 297 mm ≈ 1123 px a 96 dpi)
const altura = await p.evaluate(() => document.body.scrollHeight);
const fonte = await p.evaluate(() => [...document.fonts].map((f) => `${f.family} ${f.status}`).join(', '));
await p.screenshot({ path: join(aqui, 'previa.png'), fullPage: true });
await p.pdf({ path: pdf, format: 'A4', printBackground: true, preferCSSPageSize: true });
await b.close();

const paginas = (readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
console.log(JSON.stringify({ pdf, paginas, alturaPx: altura, cabeEmUmaPagina: altura <= 1123, fonte }));
