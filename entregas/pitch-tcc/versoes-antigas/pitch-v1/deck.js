// Navegação do pitch: slides, passos dentro do slide, notas e cronômetro.
const stage = document.getElementById('stage');
const slides = [...document.querySelectorAll('.slide')];
const prog = document.querySelector('#prog i');
const conta = document.getElementById('conta');
const notas = document.getElementById('notas');
const notaTxt = document.getElementById('nota-txt');
const relogio = document.getElementById('relogio');

let atual = 0;
let passo = 0;
let inicio = null;

const passosDe = (s) =>
  Math.max(0, ...[...s.querySelectorAll('[data-step]')].map((e) => +e.dataset.step));

function ajusta() {
  const barra = 46;
  const k = Math.min(innerWidth / 1920, (innerHeight - barra) / 1080);
  const x = (innerWidth - 1920 * k) / 2;
  const y = (innerHeight - barra - 1080 * k) / 2;
  stage.style.transform = `translate(${x}px,${y}px) scale(${k})`;
}

// Liga e desliga os passos de um slide (destaques, exemplos, vídeos).
function aplicaPassos(s, p) {
  for (let n = 1; n <= 9; n++) s.classList.toggle('s' + n, p >= n);
  s.querySelectorAll('[data-step]').forEach((e) => {
    const n = +e.dataset.step;
    e.classList.toggle('on', n <= p);
    e.classList.toggle('cur', n === p);
  });
  const exs = [...s.querySelectorAll('[data-ex]')];
  const maxEx = Math.max(0, ...exs.map((e) => +e.dataset.ex));
  exs.forEach((e) => {
    const cur = +e.dataset.ex === Math.min(p, maxEx);
    e.classList.toggle('cur', cur);
    const v = e.querySelector('video');
    if (v) cur && s === slides[atual] ? v.play().catch(() => {}) : v.pause();
  });
}

function desenha() {
  slides.forEach((s, i) => s.classList.toggle('ativo', i === atual));
  aplicaPassos(slides[atual], passo);
  const total = slides.reduce((t, s) => t + passosDe(s) + 1, 0);
  const feito = slides.slice(0, atual).reduce((t, s) => t + passosDe(s) + 1, 0) + passo + 1;
  prog.style.width = (feito / total) * 100 + '%';
  conta.textContent = `${String(atual + 1).padStart(2, '0')} / ${slides.length}`;
  notaTxt.textContent = slides[atual].dataset.notes || '';
}

const semMovimento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function entra() {
  const s = slides[atual];
  const d = s.querySelector('#digita');
  if (d) digita(d, passo > 0);
  const m = document.getElementById('manifesto');
  if (m && !s.contains(m)) m.pause();
}

function digita(el, pronto) {
  const texto = el.dataset.texto;
  clearInterval(el._t);
  if (pronto || semMovimento()) { el.textContent = texto; return; }
  el.textContent = '';
  let i = 0;
  el._t = setInterval(() => {
    el.textContent = texto.slice(0, ++i);
    if (i >= texto.length) clearInterval(el._t);
  }, 45);
}

// Um clique por slide: os destaques entram sozinhos, logo depois do slide,
// no tempo de data-auto (milissegundos desde a entrada, um valor por passo).
// Só as listas com exemplo (.lista) continuam com um clique por item.
let relogios = [];
const manual = (s) => s.classList.contains('lista');

function tocaSozinho() {
  const s = slides[atual];
  const total = passosDe(s);
  const tempos = (s.dataset.auto || '').split(',').map((t) => parseInt(t, 10));
  for (let n = 1; n <= total; n++) {
    const t = tempos[n - 1];
    const quando = semMovimento() ? 0 : (Number.isFinite(t) ? t : 450 + (n - 1) * 400);
    relogios.push(setTimeout(() => { passo = Math.max(passo, n); desenha(); }, quando));
  }
}

function vai(n, p = 0) {
  relogios.forEach(clearTimeout);
  relogios = [];
  const antes = atual;
  atual = Math.max(0, Math.min(slides.length - 1, n));
  const s = slides[atual];
  passo = p === 'fim' ? passosDe(s) : Math.min(p, passosDe(s));
  if (inicio === null && atual > 0) inicio = Date.now();
  // o slide de destino é arrumado sem transição antes de aparecer,
  // para não mostrar o estado da visita anterior
  s.classList.add('sem-anim');
  aplicaPassos(s, passo);
  void s.offsetWidth;
  s.classList.remove('sem-anim');
  desenha();
  entra();
  if (passo === 0 && !manual(s)) tocaSozinho();
  if (antes !== atual || location.hash !== '#' + (atual + 1)) {
    try { history.replaceState(null, '', '#' + (atual + 1)); } catch (e) { /* Safari limita a frequência */ }
  }
}
function avanca() {
  if (manual(slides[atual]) && passo < passosDe(slides[atual])) { passo++; desenha(); }
  else if (atual < slides.length - 1) vai(atual + 1);
}
function volta() {
  if (manual(slides[atual]) && passo > 0) { passo--; desenha(); }
  else if (atual > 0) vai(atual - 1, 'fim');
}

addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
  const k = e.key;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); avanca(); }
  else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); volta(); }
  else if (k === 'Home') vai(0);
  else if (k === 'End') vai(slides.length - 1, 'fim');
  else if (k === 'n' || k === 'N') notas.hidden = !notas.hidden;
  else if (k === 'f' || k === 'F') {
    document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {});
  }
});
// os botões soltam o foco para o espaço/enter não agirem duas vezes
document.getElementById('prox').onclick = (e) => { e.currentTarget.blur(); avanca(); };
document.getElementById('ant').onclick = (e) => { e.currentTarget.blur(); volta(); };
document.getElementById('zera').onclick = () => { inicio = Date.now(); };

// clicar num item da lista pula direto para o exemplo dele
document.querySelectorAll('.itens li').forEach((li) => {
  li.addEventListener('click', () => { passo = +li.dataset.step; desenha(); });
});

// clicar em qualquer área livre do slide avança (botões, itens de lista e vídeo têm ação própria)
stage.addEventListener('click', (e) => {
  if (e.target.closest('button, a, video, .itens li, .no.base')) return;
  avanca();
});

// slide 15: destrancar as expansões
const exps = document.getElementById('exps');
const pular = document.getElementById('pular');
function destranca(abre) {
  exps.classList.toggle('aberto', abre);
  pular.classList.toggle('feito', abre);
  pular.textContent = abre ? 'expansões liberadas' : 'já tenho a base, quero pular';
}
pular?.addEventListener('click', () => destranca(!exps.classList.contains('aberto')));
document.querySelector('.no.base')?.addEventListener('click', () => destranca(true));

// vídeo manifesto: se o arquivo não existir, mostra o aviso no lugar
const man = document.getElementById('manifesto');
man?.addEventListener('error', () => man.parentElement.classList.add('vazia'));

setInterval(() => {
  const s = inicio === null ? 0 : Math.floor((Date.now() - inicio) / 1000);
  relogio.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  relogio.classList.toggle('passou', s > 600);
}, 500);

addEventListener('resize', ajusta);
ajusta();
// endereço: #7 abre o slide 7; #7.3 abre o slide 7 já no passo 3
function doEndereco() {
  const [h1, h2] = location.hash.slice(1).split('.');
  vai(Math.max(0, (parseInt(h1, 10) || 1) - 1), Math.max(0, parseInt(h2, 10) || 0));
}
addEventListener('hashchange', doEndereco);
doEndereco();
