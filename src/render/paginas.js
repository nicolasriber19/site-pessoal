// Gera o HTML de cada seção a partir dos arquivos de conteudo/.
// Roda no Node (plugin do Vite), no dev e no build. Só usa módulos do próprio Node,
// para o plugin poder recarregar este arquivo a cada mudança sem reiniciar o servidor.
//
// Regras de texto do site: português do Brasil, sem travessão visível, números só reais.
// Imagens: todo lugar de imagem aceita um caminho vazio e mostra um espaço reservado.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// espaço inseparável onde uma quebra de linha ficaria feia
const texto = (s) => esc(s).replace(/nº /g, 'nº&nbsp;').replace(/R\$ /g, 'R$&nbsp;');

// em listas "a · b · c", o ponto fica preso à palavra anterior
const metaTexto = (s) => esc(s).replace(/ · /g, '&nbsp;· ');

export const dataCurta = (iso) => {
  const [a, m, d] = String(iso).split('-');
  return `${d}/${m}/${a}`;
};

// "2026-11-12" → "12 nov. 2026" · "2026-08" → "ago. 2026" · "2026" → "2026"
const MESES = ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
export const dataPorExtenso = (iso) => {
  const [a, m, d] = String(iso).split('-');
  return [d && String(+d), m && MESES[+m - 1], a].filter(Boolean).join(' ');
};
const DATA_LIVRE = /^\d{4}(-\d{2}(-\d{2})?)?$/;

// ------------------------------------------------------------------ dados --

function lerJson(dir, nome, padrao) {
  const arq = join(dir, `${nome}.json`);
  if (!existsSync(arq)) return padrao;
  try {
    return JSON.parse(readFileSync(arq, 'utf8'));
  } catch (e) {
    throw new Error(`conteudo/${nome}.json não é um JSON válido: ${e.message}`);
  }
}

export function carregarConteudo(dir) {
  const d = {
    perfil: lerJson(dir, 'perfil', {}),
    agora: lerJson(dir, 'agora', []),
    projetos: lerJson(dir, 'projetos', []),
    certificados: lerJson(dir, 'certificados', []),
    trajetoria: lerJson(dir, 'trajetoria', []),
  };
  const erros = [];
  if (!d.perfil.nome) erros.push('perfil.json precisa de "nome".');
  if (!d.perfil.email) erros.push('perfil.json precisa de "email".');
  d.projetos.forEach((p, i) => { if (!p.titulo) erros.push(`projetos.json, item ${i + 1}: falta "titulo".`); });
  d.trajetoria.forEach((t, i) => {
    if (!t.titulo) erros.push(`trajetoria.json, item ${i + 1}: falta "titulo".`);
    if (!t.data && !t.quando) erros.push(`trajetoria.json, item ${i + 1}: falta "data" (ou "quando").`);
    if (t.data && !DATA_LIVRE.test(t.data)) erros.push(`trajetoria.json, item ${i + 1}: "data" no formato AAAA, AAAA-MM ou AAAA-MM-DD.`);
  });
  d.certificados.forEach((c, i) => {
    if (!c.titulo) erros.push(`certificados.json, item ${i + 1}: falta "titulo".`);
    if (c.data && !/^\d{4}-\d{2}-\d{2}$/.test(c.data)) erros.push(`certificados.json, item ${i + 1}: "data" no formato AAAA-MM-DD.`);
  });
  if (erros.length) throw new Error(`Conteúdo com problema:\n- ${erros.join('\n- ')}`);
  d.certificados = [...d.certificados].sort((a, b) => String(b.data || '').localeCompare(String(a.data || '')));
  // mais recente primeiro; "2026" fica depois de "2026-08" (menos preciso = mais antigo no mesmo ano)
  d.trajetoria = [...d.trajetoria].sort((a, b) => String(b.data || '').localeCompare(String(a.data || '')));
  d.perfil.imagens = d.perfil.imagens || {};
  return d;
}

// ---------------------------------------------------------------- ícones --

const svg = (corpo, tam = 18) =>
  `<svg viewBox="0 0 24 24" width="${tam}" height="${tam}" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${corpo}</svg>`;
const SETA = svg('<path d="M7 17 17 7M9 7h8v8"/>', 16);
const BAIXAR = svg('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', 16);
const ENVELOPE = svg('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>', 20);
// marcas em traço, no mesmo desenho dos outros ícones (Lucide, ISC)
const GITHUB = svg('<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>', 20);
const LINKEDIN = svg('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>', 20);
const ICONES_REDES = { github: GITHUB, linkedin: LINKEDIN };
const FOTO = svg('<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m4.5 18 5-5 4 4 2.5-2.5 3.5 3.5"/>', 26);

// Lugar de imagem: com caminho, a imagem; sem caminho, um espaço reservado limpo.
// posicao: qual parte da foto fica à vista quando ela é cortada (ex.: "50% 20%" = centro, mais para cima)
// recorte: foto sem fundo (PNG/WebP transparente) apoiada na borda de baixo, sobre um fundo cinza
// com luz suave; as duas camadas andam em ritmos diferentes na rolagem (profundidade).
function imagem(src, alt, classe = '', { prioridade = false, posicao = '', recorte = false } = {}) {
  if (src) {
    const estilo = !recorte && /^[\d.]+% [\d.]+%$/.test(posicao) ? ` style="object-position: ${posicao}"` : '';
    // no engine o deslocamento é taxa × (progresso − 0,5) × 100 px: 0.25 = até 12 px para baixo
    const camada = recorte ? ' class="imagem__recorte" data-sc-parallax="0.25"' : '';
    return `<figure class="imagem ${classe}${recorte ? ' imagem--recorte' : ''}"><img${camada} src="${esc(src)}" alt="${esc(alt || '')}"${estilo}${prioridade ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></figure>`;
  }
  return `<figure class="imagem imagem--vazia ${classe}" aria-hidden="true"><span class="imagem__aviso">${FOTO}<span>Imagem em breve</span></span></figure>`;
}

const link = (l, classe = '') =>
  `<a${classe ? ` class="${classe}"` : ''} href="${esc(l.url)}"${/^https?:/.test(l.url) ? ' target="_blank" rel="noopener"' : ''}>${esc(l.rotulo)}</a>`;

// Redes do perfil.json com endereço preenchido (uma rede sem "url" não aparece).
// GitHub e LinkedIn viram ícone com nome para leitor de tela; as outras ficam como texto.
const redesDe = (d) => (d.perfil.redes || []).filter((r) => r && r.rotulo && /^https?:\/\//.test(r.url || ''));
function linkRede(r, classe) {
  const icone = ICONES_REDES[r.rotulo.toLowerCase()];
  const nome = `${r.rotulo} (abre em outra aba)`;
  return icone
    ? `<a class="${classe}" href="${esc(r.url)}" target="_blank" rel="me noopener" aria-label="${esc(nome)}" title="${esc(r.rotulo)}">${icone}</a>`
    : `<a class="${classe} ${classe}--texto" href="${esc(r.url)}" target="_blank" rel="me noopener">${esc(r.rotulo)}</a>`;
}

// ----------------------------------------------------------------- seções --

const NAV = [
  ['sobre', 'Sobre'],
  ['estudos', 'Estudos'],
  ['trajetoria', 'Trajetória'],
  ['projetos', 'Projetos'],
  ['contato', 'Contato'],
];

function barra(d) {
  const links = NAV.map(([id, nome]) => `<a href="#${id}" data-nav="${id}">${nome}</a>`).join('\n      ');
  return `<header class="barra" data-barra>
  <div class="barra__dentro largura">
    <a class="barra__nome" href="#inicio">${esc(d.perfil.nome)}</a>
    <nav class="barra__nav" id="menu" aria-label="Seções" data-menu>
      ${links}
    </nav>
    <div class="barra__lado">
      ${redesDe(d).map((r) => linkRede(r, 'barra__icone barra__icone--rede')).join('\n      ')}
      <a class="barra__icone" href="#contato" aria-label="Contato">${ENVELOPE}</a>
      <button class="barra__menu" type="button" aria-expanded="false" aria-controls="menu" data-menu-botao><span class="sr-only">Abrir menu</span><span class="barra__tracos" aria-hidden="true"></span></button>
    </div>
  </div>
</header>`;
}

function inicio(d) {
  const p = d.perfil;
  const [l1 = p.nome, l2 = ''] = p.titulo || [];
  return `<section id="inicio" class="ato ato--inicio" data-sc-act="flow" aria-labelledby="titulo-inicio">
  <div class="inicio largura">
    <div class="inicio__texto">
      <p class="inicio__quem">${esc([p.nome, p.cidade].filter(Boolean).join(' · '))}</p>
      <h1 id="titulo-inicio" class="titulo-duplo titulo-duplo--hero"><span>${texto(l1)}</span> <span class="tom">${texto(l2)}</span></h1>
      <a class="pilula" href="#sobre">${esc(p.botaoInicio || 'Conheça mais')} ${SETA}</a>
    </div>
    <div class="inicio__imagem" data-sc-parallax="-0.4">
      ${imagem(p.imagens.inicio, p.imagens.inicioAlt || `Foto de ${p.nome}`, 'imagem--inicio', { prioridade: true, posicao: p.imagens.inicioPosicao, recorte: Boolean(p.imagens.inicioRecorte) })}
    </div>
  </div>
</section>`;
}

function destaque({ id, numero, titulo, corpo, img, alt, lado }) {
  return `<section id="${id}" class="ato destaque destaque--${lado}" data-sc-act="flow" aria-labelledby="${id}-titulo">
  <div class="destaque__grade largura">
    <div class="destaque__imagem" data-sc-reveal="${lado === 'esq' ? 'right' : 'left'}" data-sc-reveal-at="0.04 0.3">
      ${imagem(img, alt, 'imagem--destaque')}
    </div>
    <div class="destaque__texto" data-sc-in data-sc-stagger="70">
      <p class="destaque__numero" aria-hidden="true">${numero}</p>
      <h2 id="${id}-titulo" class="destaque__titulo">${texto(titulo)}</h2>
      ${corpo}
    </div>
  </div>
</section>`;
}

function sobre(d) {
  const p = d.perfil;
  return destaque({
    id: 'sobre',
    numero: '01',
    titulo: p.sobreTitulo || 'Sobre mim',
    corpo: (p.sobre || []).map((t) => `<p class="destaque__corpo">${texto(t)}</p>`).join('\n      '),
    img: p.imagens.sobre,
    alt: p.imagens.sobreAlt,
    lado: 'esq',
  });
}

function estudos(d) {
  const lista = d.agora.length
    ? `<ul class="destaque__lista">
        ${d.agora.map((a) => `<li><span class="destaque__tipo">${esc(a.tipo || '')}</span><span>${texto(a.texto)}</span>${a.quando ? `<span class="destaque__quando">${esc(a.quando)}</span>` : ''}</li>`).join('\n        ')}
      </ul>`
    : '<p class="destaque__corpo">O que estou estudando entra aqui em breve.</p>';
  return destaque({
    id: 'estudos',
    numero: '02',
    titulo: 'O que estou estudando agora.',
    corpo: lista,
    img: d.perfil.imagens.estudos,
    alt: d.perfil.imagens.estudosAlt,
    lado: 'dir',
  });
}

// Linha 03: trajetória (marcos datados, do mais recente) e, quando houver, os certificados.
function trajetoria(d) {
  const marcos = d.trajetoria.length
    ? `<ol class="linha-tempo">
        ${d.trajetoria.map((t) => {
          const quando = t.quando || dataPorExtenso(t.data);
          return `<li class="linha-tempo__item">${t.data ? `<time class="linha-tempo__quando" datetime="${esc(t.data)}">${esc(quando)}</time>` : `<span class="linha-tempo__quando">${esc(quando)}</span>`}<strong class="linha-tempo__titulo">${texto(t.titulo)}</strong>${t.texto ? `<span class="linha-tempo__texto">${texto(t.texto)}</span>` : ''}</li>`;
        }).join('\n        ')}
      </ol>`
    : '';
  const certs = d.certificados.length
    ? `${marcos ? '<h3 class="destaque__subtitulo">Certificados</h3>' : ''}
      <ul class="destaque__lista destaque__lista--cert">
        ${d.certificados.map((c) => {
          const meta = [c.instituicao, c.cargaHoraria, c.data ? dataCurta(c.data) : ''].filter(Boolean).join(' · ');
          const links = [c.arquivo && { rotulo: 'Ver certificado', url: c.arquivo }, c.verificacao && { rotulo: 'Verificar', url: c.verificacao }].filter(Boolean);
          return `<li><strong>${texto(c.titulo)}</strong>${meta ? `<span class="destaque__quando">${metaTexto(meta)}</span>` : ''}${links.length ? `<span class="destaque__links">${links.map((l) => link(l)).join('')}</span>` : ''}</li>`;
        }).join('\n        ')}
      </ul>`
    : '';
  const titulo = marcos && certs ? 'Trajetória e certificados.' : marcos ? 'Minha trajetória até aqui.' : 'Cursos e certificados.';
  const img = d.perfil.imagens;
  return destaque({
    id: 'trajetoria',
    numero: '03',
    titulo,
    corpo: marcos + certs || '<p class="destaque__corpo">Os marcos e certificados entram aqui em breve.</p>',
    img: img.trajetoria ?? img.certificados,
    alt: img.trajetoriaAlt ?? img.certificadosAlt,
    lado: 'esq',
  });
}

function projetos(d) {
  const reais = d.projetos.map((p) => {
    const meta = [...(p.ficha || []), p.ano].filter(Boolean).join(' · ');
    const principal = (p.links || []).find((l) => l && l.url && l.rotulo);
    return `<li class="cartao">
        ${imagem(p.imagem, p.imagemAlt || p.titulo, 'imagem--cartao')}
        <h3 class="cartao__titulo">${principal ? `<a class="cartao__link" href="${esc(principal.url)}"${/^https?:/.test(principal.url) ? ' target="_blank" rel="noopener"' : ''}>${texto(p.titulo)}</a>` : texto(p.titulo)}</h3>
        ${p.descricao ? `<p class="cartao__texto">${texto(p.descricao)}</p>` : ''}
        ${meta ? `<p class="cartao__meta">${metaTexto(meta)}</p>` : ''}
      </li>`;
  });
  // completa a fileira de 4 com espaços reservados
  const faltam = reais.length % 4 === 0 && reais.length ? 0 : 4 - (reais.length % 4);
  const reservados = Array.from({ length: faltam }, () => `<li class="cartao cartao--reservado">
        ${imagem('', '', 'imagem--cartao')}
        <p class="cartao__titulo">Projeto em breve</p>
      </li>`);
  return `<section id="projetos" class="ato ato--projetos" data-sc-act="flow" aria-labelledby="projetos-titulo">
  <div class="largura">
    <div class="projetos__cabeca">
      <h2 id="projetos-titulo" class="titulo-duplo titulo-duplo--secao"><span>Projetos.</span> <span class="tom">O que eu construo.</span></h2>
    </div>
    <ul class="cartoes" data-sc-in data-sc-stagger="70">
      ${[...reais, ...reservados].join('\n      ')}
    </ul>
  </div>
</section>`;
}

function contato(d) {
  const email = d.perfil.email;
  const mailto = `mailto:${email}?subject=${encodeURIComponent('Contato pelo site')}`;
  return `<section id="contato" class="ato ato--contato" data-sc-act="flow" aria-labelledby="contato-titulo">
  <div class="largura">
    <div class="faixa" data-sc-in>
      <div class="faixa__texto">
        <h2 id="contato-titulo" class="titulo-duplo titulo-duplo--faixa"><span>Vamos conversar.</span> <span class="tom">Escreva para mim.</span></h2>
        <p>A mensagem chega no meu e-mail: <a href="${esc(mailto)}">${esc(email)}</a></p>
      </div>
      <div class="faixa__acoes">
        <a class="pilula" href="${esc(mailto)}">Enviar e-mail ${SETA}</a>
        ${d.perfil.curriculo ? `<a class="pilula pilula--baixar" href="${esc(d.perfil.curriculo)}" download>Baixar currículo ${BAIXAR}</a>` : ''}
        ${redesDe(d).map((r) => linkRede(r, 'pilula pilula--icone')).join('\n        ')}
      </div>
    </div>
  </div>
</section>`;
}

function rodape(d) {
  const links = NAV.slice(0, 4).map(([id, nome]) => `<a href="#${id}">${nome}</a>`).join('');
  const redes = redesDe(d);
  return `<footer class="rodape">
  <div class="rodape__dentro largura">
    <nav class="rodape__links" aria-label="Rodapé">${links}</nav>
    <div class="rodape__redes">
      <a href="mailto:${esc(d.perfil.email)}" aria-label="E-mail">${ENVELOPE}</a>
      ${redes.map((r) => linkRede(r, 'rodape__rede')).join('')}
    </div>
    <p class="rodape__fim">© ${new Date().getFullYear()} ${esc(d.perfil.nome)}${d.perfil.atualizadoEm ? ` · Atualizado em ${dataCurta(d.perfil.atualizadoEm)}` : ''}</p>
  </div>
</footer>`;
}

// Prévia do link no WhatsApp, LinkedIn etc. (Open Graph). Só sai quando perfil.json tem "site":
// as redes exigem endereço absoluto para a imagem.
function compartilhar(d) {
  const p = d.perfil;
  if (!/^https?:\/\//.test(p.site || '')) return '';
  const url = p.site.endsWith('/') ? p.site : `${p.site}/`;
  const img = p.previa ? new URL(p.previa, url).href : '';
  const titulo = p.tituloCompartilhar || p.nome;
  const desc = p.descricao || '';
  const tags = [
    `<link rel="canonical" href="${esc(url)}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="pt_BR">',
    `<meta property="og:site_name" content="${esc(p.nome)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:title" content="${esc(titulo)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta name="twitter:card" content="${img ? 'summary_large_image' : 'summary'}">`,
    `<meta name="twitter:title" content="${esc(titulo)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
  ];
  if (img) {
    tags.push(
      `<meta property="og:image" content="${esc(img)}">`,
      `<meta property="og:image:alt" content="${esc(p.previaAlt || titulo)}">`,
      `<meta name="twitter:image" content="${esc(img)}">`,
    );
    if (p.previaLargura && p.previaAltura) {
      tags.push(`<meta property="og:image:width" content="${+p.previaLargura}">`, `<meta property="og:image:height" content="${+p.previaAltura}">`);
    }
  }
  return tags.join('\n');
}

// ---------------------------------------------------------------- página --

export function renderizar(html, d, { exemplo = false } = {}) {
  const blocos = {
    compartilhar: compartilhar(d),
    barra: barra(d),
    inicio: inicio(d),
    sobre: sobre(d),
    estudos: estudos(d),
    trajetoria: trajetoria(d),
    projetos: projetos(d),
    contato: contato(d),
    rodape: rodape(d),
    exemplo: exemplo ? '<p class="aviso-exemplo">Prévia com conteúdo de exemplo. Não é publicado.</p>' : '',
  };
  const vars = {
    titulo: d.perfil.nome,
    descricao: d.perfil.descricao || `Site pessoal de ${d.perfil.nome}.`,
  };
  return html
    .replace(/<!--\s*secao:([a-z]+)\s*-->/g, (_, k) => blocos[k] ?? '')
    .replace(/\{\{(\w+)\}\}/g, (_, k) => esc(vars[k] ?? ''));
}
