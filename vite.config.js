import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Plugin "edicao": lê conteudo/*.json e escreve o HTML pronto de cada seção no index.html.
// Assim a página chega completa ao navegador (funciona sem JavaScript) e você só edita os JSON.
// CONTEUDO=exemplo usa conteudo-exemplo/ (prévia local, nunca publicada).
function edicao() {
  const raiz = process.cwd();
  const exemplo = process.env.CONTEUDO === 'exemplo';
  const dir = resolve(raiz, exemplo ? 'conteudo-exemplo' : 'conteudo');
  const render = resolve(raiz, 'src/render/paginas.js');

  return {
    name: 'edicao',
    configureServer(server) {
      server.watcher.add([dir, render]);
      const recarregar = (arq) => {
        const a = arq.replace(/\\/g, '/');
        if (a.startsWith(dir.replace(/\\/g, '/')) || a === render.replace(/\\/g, '/')) server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('change', recarregar);
      server.watcher.on('add', recarregar);
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const m = await import(`${pathToFileURL(render).href}?t=${Date.now()}`);
        return m.renderizar(html, m.carregarConteudo(dir), { exemplo });
      },
    },
  };
}

export default defineConfig({
  // caminhos relativos: o build funciona em qualquer endereço (GitHub Pages com ou sem subpasta)
  base: './',
  plugins: [edicao()],
  build: { target: 'es2020' },
});
