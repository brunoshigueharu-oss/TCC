// Navegação do pitch: um clique por slide, texto entrando em ordem de leitura,
// notas do apresentador e cronômetro.
const stage = document.getElementById('stage');
const slides = [...document.querySelectorAll('.slide')];
const prog = document.querySelector('#prog i');
const conta = document.getElementById('conta');
const notas = document.getElementById('notas');
const notaTxt = document.getElementById('nota-txt');
const relogio = document.getElementById('relogio');

const PASSO = 34;      // ms entre uma palavra e a seguinte
const ENTRE = 140;     // ms de respiro entre um bloco e o próximo
const INICIO = 260;    // ms depois que o slide aparece
const LETRA = 45;      // ms por letra no texto digitado (slide 2)

let atual = 0;
let inicio = null;
let relogios = [];

const semMovimento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function ajusta() {
  const barra = 46;
  const k = Math.min(innerWidth / 1920, (innerHeight - barra) / 1080);
  const x = (innerWidth - 1920 * k) / 2;
  const y = (innerHeight - barra - 1080 * k) / 2;
  stage.style.transform = `translate(${x}px,${y}px) scale(${k})`;
}

// ---------- texto em ordem de leitura ----------
// Cada bloco [data-ler] vira uma fila de unidades: palavras soltas (.w) ou
// elementos inteiros (.u). As unidades entram uma depois da outra, e os
// blocos entram na ordem do HTML. Assim nada aparece fora de ordem.
function quebra(no, fila) {
  for (const filho of [...no.childNodes]) {
    if (filho.nodeType === Node.TEXT_NODE) {
      const partes = filho.textContent.split(/(\s+)/);
      if (!partes.some((p) => p.trim())) continue;
      const frag = document.createDocumentFragment();
      for (const p of partes) {
        if (!p) continue;
        if (!p.trim()) { frag.append(p); continue; }
        const w = document.createElement('span');
        w.className = 'w';
        w.textContent = p;
        frag.append(w);
        fila.push(w);
      }
      filho.replaceWith(frag);
    } else if (filho.nodeType === Node.ELEMENT_NODE) {
      if (filho.hasAttribute('data-fixo')) continue;
      if (filho.classList.contains('u')) fila.push(filho);
      else if (!['svg', 'img', 'video', 'i'].includes(filho.localName)) quebra(filho, fila);
    }
  }
}

function prepara(s) {
  s._blocos = [...s.querySelectorAll('[data-ler]')].map((b) => {
    const fila = [];
    if (b.classList.contains('u')) fila.push(b);
    else quebra(b, fila);
    const passo = +b.dataset.passo || PASSO;
    return { b, fila, passo };
  });
}
slides.forEach(prepara);

// Entrada de cada unidade com Web Animations: o atraso de cada palavra é do
// próprio JS (fill "backwards" segura a palavra escondida até a vez dela).
// Antes era transition-delay por palavra em CSS, e o Safari soltava a primeira
// palavra do bloco por último, de uma vez.
const ENTRADA = [
  { opacity: 0, translate: '0 .32em' },
  { opacity: 1, translate: '0 0' },
];
const EASE = 'cubic-bezier(.2,.8,.2,1)';
// O WebKit (Safari) não pinta a camada de uma animação que começa no mesmo
// quadro em que é criada: a palavra de atraso zero só aparecia quando a
// animação terminava. Toda unidade espera ARMA ms escondida antes de subir.
const ARMA = 50;
function entra(fila, passo) {
  fila.forEach((u, i) => {
    u._anim = u.animate(ENTRADA, { duration: 420, delay: ARMA + i * passo, easing: EASE, fill: 'backwards' });
  });
}

function limpa(s) {
  s.classList.remove('pronto');
  s._blocos.forEach(({ b, fila }) => {
    b.classList.remove('on');
    fila.forEach((u) => { u._anim?.cancel(); u._anim = null; });
  });
}

function mostraTudo(s) {
  s.classList.add('pronto');
  s._blocos.forEach(({ b }) => b.classList.add('on'));
  const d = s.querySelector('#digita');
  if (d) { clearInterval(d._t); d.textContent = d.dataset.texto; }
}

function le(s) {
  if (semMovimento()) { mostraTudo(s); return; }
  let t = +s.dataset.inicio || INICIO;
  for (const { b, fila, passo } of s._blocos) {
    t += +b.dataset.pausa || 0;
    relogios.push(setTimeout(() => {
      entra(fila, passo);
      b.classList.add('on');
      const d = b.querySelector('#digita');
      if (d) digita(d);
    }, t));
    const extra = b.hasAttribute('data-digita')
      ? (b.querySelector('#digita').dataset.texto.length * LETRA + 250)
      : 0;
    t += Math.max(fila.length - 1, 0) * passo + 300 + extra + (+b.dataset.dur || 0) + ENTRE;
  }
}

function digita(el) {
  const texto = el.dataset.texto;
  clearInterval(el._t);
  el.textContent = '';
  let i = 0;
  el._t = setInterval(() => {
    el.textContent = texto.slice(0, ++i);
    if (i >= texto.length) clearInterval(el._t);
  }, LETRA);
}

// ---------- navegação ----------
function desenha() {
  slides.forEach((s, i) => s.classList.toggle('ativo', i === atual));
  prog.style.width = ((atual + 1) / slides.length) * 100 + '%';
  conta.textContent = `${String(atual + 1).padStart(2, '0')} / ${slides.length}`;
  notaTxt.textContent = slides[atual].dataset.notes || '';
}

// pronto = já chega com tudo à mostra (quando se volta um slide)
function vai(n, pronto = false) {
  relogios.forEach(clearTimeout);
  relogios = [];
  atual = Math.max(0, Math.min(slides.length - 1, n));
  const s = slides[atual];
  if (inicio === null && atual > 0) inicio = Date.now();
  // o slide de destino é zerado sem transição antes de aparecer,
  // para não mostrar o estado da visita anterior
  s.classList.add('sem-anim');
  limpa(s);
  if (pronto) mostraTudo(s);
  void s.offsetWidth;
  s.classList.remove('sem-anim');
  desenha();
  if (!pronto) le(s);
  if (!s.contains(video)) pausa();
  try { history.replaceState(null, '', '#' + (atual + 1)); } catch (e) { /* Safari limita a frequência */ }
}
const avanca = () => { if (atual < slides.length - 1) vai(atual + 1); };
const volta = () => { if (atual > 0) vai(atual - 1, true); };

addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
  const k = e.key;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); avanca(); }
  else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); volta(); }
  else if (k === 'Home') vai(0);
  else if (k === 'End') vai(slides.length - 1, true);
  else if (k === 'n' || k === 'N') notas.hidden = !notas.hidden;
  else if (k === 'p' || k === 'P') { if (slides[atual].contains(video)) alterna(); }
  else if (k === 'f' || k === 'F') {
    document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {});
  }
});
// os botões soltam o foco para o espaço/enter não agirem duas vezes
document.getElementById('prox').onclick = (e) => { e.currentTarget.blur(); avanca(); };
document.getElementById('ant').onclick = (e) => { e.currentTarget.blur(); volta(); };
document.getElementById('zera').onclick = () => { inicio = Date.now(); };

// clicar em área livre do slide avança (botões e o vídeo têm ação própria)
stage.addEventListener('click', (e) => {
  if (e.target.closest('button, a, .tela, .no.base')) return;
  avanca();
});

// ---------- vídeo manifesto ----------
const video = document.getElementById('manifesto');
const tela = video.closest('.tela');
function pausa() { video.pause(); }
function alterna() {
  if (video.paused || video.ended) video.play().catch(() => {});
  else video.pause();
}
tela.addEventListener('click', (e) => { e.currentTarget.blur?.(); alterna(); });
video.addEventListener('play', () => tela.classList.add('tocando'));
video.addEventListener('pause', () => tela.classList.remove('tocando'));
video.addEventListener('ended', () => { tela.classList.remove('tocando'); video.currentTime = 0; });
video.addEventListener('error', () => tela.classList.add('vazia'));

// ---------- slide 15: destrancar as expansões ----------
const exps = document.getElementById('exps');
const pular = document.getElementById('pular');
function destranca(abre) {
  exps.classList.toggle('aberto', abre);
  pular.classList.toggle('feito', abre);
  pular.textContent = abre ? 'expansões liberadas' : 'já tenho a base, quero pular';
}
pular?.addEventListener('click', (e) => { e.currentTarget.blur(); destranca(!exps.classList.contains('aberto')); });
document.querySelector('.no.base')?.addEventListener('click', () => destranca(true));

setInterval(() => {
  const s = inicio === null ? 0 : Math.floor((Date.now() - inicio) / 1000);
  relogio.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  relogio.classList.toggle('passou', s > 600);
}, 500);

addEventListener('resize', ajusta);
ajusta();
// endereço: #7 abre o slide 7 do começo; #7.1 abre o slide 7 já completo
function doEndereco() {
  const [h1, h2] = location.hash.slice(1).split('.');
  vai(Math.max(0, (parseInt(h1, 10) || 1) - 1), h2 !== undefined);
}
addEventListener('hashchange', () => {
  if (location.hash !== '#' + (atual + 1)) doEndereco();
});
doEndereco();
