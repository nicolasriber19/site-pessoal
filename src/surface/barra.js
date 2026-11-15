// Barra do topo: marca a seção atual, ganha uma linha fina ao rolar e,
// no celular, abre e fecha o menu.
export function iniciarBarra() {
  const barra = document.querySelector('[data-barra]');
  if (!barra) return;
  const menu = barra.querySelector('[data-menu]');
  const botao = barra.querySelector('[data-menu-botao]');
  const links = new Map([...barra.querySelectorAll('[data-nav]')].map((a) => [a.dataset.nav, a]));
  const secoes = [...links.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  let marcada;

  function atualizar() {
    barra.classList.toggle('barra--rolou', scrollY > 8);
    const linha = innerHeight * 0.45;
    let achou = null;
    for (const s of secoes) if (s.getBoundingClientRect().top <= linha) achou = s;
    // no fim da página, a última seção é a atual mesmo que não chegue à linha
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) achou = secoes[secoes.length - 1];
    if (achou === marcada) return;
    marcada = achou;
    links.forEach((a, id) => (achou && id === achou.id ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
  }

  function abrir(aberto) {
    menu.classList.toggle('barra__nav--aberta', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
    botao.querySelector('.sr-only').textContent = aberto ? 'Fechar menu' : 'Abrir menu';
  }
  botao?.addEventListener('click', () => abrir(botao.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) abrir(false); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && botao?.getAttribute('aria-expanded') === 'true') { abrir(false); botao.focus(); }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) abrir(false); });

  addEventListener('scroll', () => requestAnimationFrame(atualizar), { passive: true });
  addEventListener('resize', () => { marcada = undefined; atualizar(); }, { passive: true });
  atualizar();
}
