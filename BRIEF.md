# BRIEF: site pessoal do Nicolas

Entrevista em 13/11/2026, no chat, com as skills scroll-craft e tipografia-premium.
Respostas dele sem paráfrase; **[decisão de autoria]** marca o que eu propus e ele aprovou.

## 1. Respostas

| Pergunta | Resposta dele |
|---|---|
| Para que serve | "Um site pessoal completo e quero um espaço para mostrar certificados e outras coisas" |
| Estética (1ª rodada) | Editorial / revista |
| Comportamento | Um sistema que funciona |
| Material | Nada ainda |
| Seções extras | Metas e aprendendo |
| Assinatura (1ª rodada) | Edição do dia |
| Ação final | Me mandar e-mail |
| Sensação | Curiosa, quer mais |
| Nome e e-mail | Nicolas Ribeiro, nicolas.riber@gmail.com |
| Projetos agora | "Nenhum ainda" |

## 2. Revisões de direção (13/11/2026)

1. Depois de ver a versão em forma de jornal: "O site está em estilo de jornal, está muito poluída a
   tela. Faça sem ser em forma de jornal". Sobre as edições: **"Tirar de vez"**.
2. Mandou uma referência (vitrine de fones: fundo cinza claro, título grande em duas cores, pílula
   branca, linhas 01/02/03 alternando imagem e texto, quatro cartões, faixa final):
   "Quero fazer nesse estilo aqui... quero que ele fique assim".
3. Imagens: "Consegue deixar um espaço para adicionar depois? Não quero adicionar agora".
4. Fonte: Geist (no lugar de Newsreader + IBM Plex Mono).

A referência dele manda mais que as regras padrão da skill: os números 01/02/03 e as três linhas em
zigue-zague ficam porque estão na referência.

## 3. Estrutura atual

| # | Seção | O que faz | Device |
|---|---|---|---|
| 1 | Topo | nome e cidade, título em duas cores, pílula "Conheça mais", lugar de imagem grande | `parallax` leve na imagem |
| 2 | 01 Sobre | imagem + número + título + texto | `reveal` na imagem, `in` no texto |
| 3 | 02 Estudos | lista do que estuda agora | `reveal` + `in` |
| 4 | 03 Certificados | lista de certificados ou frase de espera | `reveal` + `in` |
| 5 | Projetos | quatro cartões (os vazios viram "Projeto em breve") | `in` em sequência |
| 6 | Contato | faixa "Vamos conversar. Escreva para mim." + pílula "Enviar e-mail" | `in` |

## 4. Sensação

```
1  Calma e clareza   o título grande em duas cores e muito espaço
2  Proximidade       quem ele é, em primeira pessoa
3  Movimento         o que ele estuda agora
4  Confiança         os certificados
5  Curiosidade       os projetos (o ponto alto quando houver imagens)
6  Vontade de falar  a faixa final com uma ação só
```

Pico: os cartões de projetos, quando tiverem imagem. Hoje, sem imagens, o site é deliberadamente
uma estrutura pronta com espaços reservados.

## 5. Tipografia

Geist variável (OFL, 29 KB, local). Escala fluida 390 → 1440 px: corpo 16→17, título do topo 44→76,
números 40→60, títulos de linha 24→32. Segunda frase dos títulos em `#7D8188` (3,6:1, texto grande).
Texto secundário `#5F636A` (5,6:1). Cobalto só no foco do teclado e na seleção.

## 6. Verificado em 13/11/2026

Build ok; 1440 e 390 px sem rolagem lateral nem erro no console; menu do celular abre, fecha e fecha
ao escolher; sem JavaScript nada some; com movimento reduzido tudo aparece; foco visível no Tab;
conteúdo de exemplo renderiza projetos, certificados e estudos.
