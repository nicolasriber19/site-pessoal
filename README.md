# Site pessoal do Nicolas

Site de uma página, claro e arejado (inspirado em vitrine de produto): topo com título em duas cores,
três linhas numeradas (Sobre, Estudos, Trajetória), cartões de projetos e uma faixa de contato.
Feito com Vite, HTML, CSS e JavaScript puros, fonte Geist (local) e o engine de rolagem scroll-craft.

## Rodar

```bash
npm install
npm run dev        # http://localhost:5173 (no painel do Claude: entrada "site-pessoal", porta 5190)
npm run build      # gera dist/, pronto para publicar
```

Prévia com conteúdo de exemplo (nunca publicada): entrada `site-pessoal-exemplo` (porta 5191),
ou `set CONTEUDO=exemplo&& npm run dev`.

## Publicar

O site fica em https://nicolasriber19.github.io/site-pessoal/ (repositório `nicolasriber19/site-pessoal`).
Cada `git push` na `main` publica sozinho: o GitHub Actions roda `npm run build` e sobe a pasta `dist/`
(`.github/workflows/pages.yml`). Leva uns 2 minutos. Antes de enviar, rode `/antes-de-publicar`.

## Como atualizar

Tudo o que aparece no site sai de `conteudo/`. Você só edita esses JSON; o HTML é gerado sozinho.

| Arquivo | O que tem |
|---|---|
| `conteudo/perfil.json` | nome, e-mail, cidade, título do topo, texto do Sobre, imagens, redes, data de atualização |
| `conteudo/agora.json` | o que está estudando agora (linha 02) |
| `conteudo/trajetoria.json` | marcos da trajetória, linha do tempo da linha 03 |
| `conteudo/certificados.json` | certificados (entram na linha 03, abaixo da trajetória) |
| `conteudo/projetos.json` | cartões de projetos |

### Imagens

Todo lugar de imagem mostra "Imagem em breve" enquanto o caminho estiver vazio.

1. Coloque o arquivo em `public/imagens/` (ex.: `public/imagens/eu.jpg`).
2. Escreva o caminho **sem** `public/` e sem barra no começo, e uma descrição curta:

```json
"imagens": {
  "inicio": "imagens/eu.jpg",
  "inicioAlt": "Nicolas sorrindo, de camiseta preta",
  "sobre": "imagens/mesa.jpg",
  "sobreAlt": "Mesa com notebook e caderno"
}
```

Lugares: `inicio` (quadrado grande do topo), `sobre`, `estudos`, `trajetoria` (retângulos 16:10).

O topo hoje usa `imagens/nicolas-recorte.webp`, a sua foto sem fundo, com `"inicioRecorte": true`:
ela fica apoiada na borda de baixo, sobre um fundo cinza de estúdio, em camadas que se movem um pouco
diferente na rolagem. Para usar uma foto comum (com fundo), tire o `inicioRecorte` e, se precisar,
ajuste o corte com `"inicioPosicao": "50% 30%"` (horizontal, vertical).

A foto original (com a casa) e o recorte em PNG ficam em `originais/`, fora de `public/`: não vão para
o site publicado e estão no `.gitignore`.
Nos projetos, cada item tem `"imagem"` e `"imagemAlt"`. Fica melhor com fotos claras, fundo neutro.

### Um projeto novo

```json
{
  "titulo": "Minha Garagem",
  "descricao": "App para cuidar de veículos, na web e no Android.",
  "ficha": ["TypeScript", "React Native"],
  "ano": "2026",
  "imagem": "imagens/garagem.png",
  "imagemAlt": "Tela inicial do app Minha Garagem",
  "links": [{ "rotulo": "Ver o app", "url": "https://..." }]
}
```

A fileira sempre fecha em 4 cartões: os que faltam aparecem como "Projeto em breve".

### Um marco novo na trajetória

Em `conteudo/trajetoria.json`. A ordem não importa: o site mostra do mais recente para o mais antigo.

```json
{
  "data": "2027-03-10",
  "titulo": "Estágio na Empresa X",
  "texto": "Uma frase curta sobre o que você faz lá."
}
```

`data` aceita `AAAA-MM-DD` (vira "10 mar. 2027"), `AAAA-MM` ("mar. 2027") ou só `AAAA`.
Para mostrar outra coisa no lugar da data, use `"quando"` (ex.: `"quando": "2026.1"`).

O título da linha 03 se ajusta sozinho: "Minha trajetória até aqui." só com marcos,
"Trajetória e certificados." quando também houver certificados.

### Um certificado novo

```json
{
  "titulo": "Nome do curso",
  "instituicao": "Onde fez",
  "cargaHoraria": "40 h",
  "data": "2026-11-20",
  "arquivo": "certificados/curso.pdf",
  "verificacao": "https://link-de-verificacao"
}
```

O PDF ou a imagem vai em `public/certificados/`. `arquivo` e `verificacao` podem ficar vazios.

### Redes (LinkedIn, GitHub)

Em `perfil.json`:

```json
"redes": [
  { "rotulo": "LinkedIn", "url": "https://www.linkedin.com/in/seu-perfil" },
  { "rotulo": "GitHub", "url": "https://github.com/nicolasriber19" }
]
```

Cada rede aparece em três lugares: na barra do topo (só no computador), ao lado do botão
"Enviar e-mail" e no rodapé. GitHub e LinkedIn viram ícone; outra rede aparece com o nome escrito.
Uma rede com `"url"` vazio não aparece em lugar nenhum.

Depois de mudar qualquer coisa, troque `"atualizadoEm"` em `perfil.json` para a data do dia.

## Estrutura

```
conteudo/            os dados do site (é aqui que você mexe)
conteudo-exemplo/    dados de exemplo para prévia
src/render/          gera o HTML a partir dos JSON (roda no build)
src/styles/          tokens.css (cores, fonte, escala), base, cromo (barra), secoes
src/surface/         barra.js (menu do celular e seção atual)
src/vendor/          engine scroll-craft, cópia intacta (não editar)
public/fonts/        Geist (OFL), public/imagens/ e public/certificados/
```
