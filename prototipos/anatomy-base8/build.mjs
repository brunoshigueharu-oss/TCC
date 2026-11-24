// Fig 1 do BASE8: como um agente de código trabalha, desenhado como uma bancada.
// Um carro corre num trilho e visita, em ordem, as quatro estações do ciclo:
// setup (lê o CLAUDE.md) → skill (puxa um cartucho) → MCP (pluga num conector) → repositório (abre a gaveta).
// Rodar: node build.mjs [--light]
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL = join(homedir(), ".claude/skills/anatomy");
const k = await import(join(SKILL, "kit/iso-kit.mjs"));
const { kitScript } = await import(join(SKILL, "scripts/inline-kit.mjs"));

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";

const WIDTH = 620;
const HEIGHT = 420;

// ---------- modelo: o ciclo do agente ----------
const STEPS = [
  { name: "setup", say: "lê o CLAUDE.md" },
  { name: "skill", say: "carrega a skill" },
  { name: "mcp", say: "chama a ferramenta via MCP" },
  { name: "repo", say: "edita o repositório" },
];
const STATION_X = [-112, -44, 24, 100];
const STATION_Y = -42;

// ---------- mundo ----------
const PLATE = { x: -160, y: -74, w: 320, d: 124, r: 8 };
const PLATE_H = 12;
const FOOT_H = 5;
const RAILS = [-4, 20];
const RAIL_FROM = -142;
const RAIL_TO = 142;

const CAR = { x: -18, y: -8, w: 36, d: 36, r: 3 };
const CAR_Z = 3;
const CAR_TOP = 9;
const MAST = { x: -5, y: -6, w: 10, d: 10, r: 1.5 };
const MAST_TOP = 104;
const ARM_REST = 94; // altura do braço em repouso
const ARM_H = 6;
const HOUSING_H = 12;
const TIP_LEN = 5;
const TIP_BELOW = HOUSING_H + TIP_LEN; // ponta fica TIP_BELOW abaixo da base do braço

const SETUP_TOP = 15;
const CART_TOP = 34;
const CART_LIFT = 10;
const PANEL_TOP = 26;
const CHEST_TOP = 37;
const DRAWER_TOP = 48;
const DRAWER_OUT = 14;
const TOUCH = [SETUP_TOP, CART_TOP, PANEL_TOP + 1, DRAWER_TOP].map((top) => top + TIP_BELOW);

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [RAIL_FROM, 0, MAST_TOP + 2], [RAIL_TO, 0, MAST_TOP + 2], [STATION_X[3], -48, ARM_REST + ARM_H]],
  WIDTH,
  HEIGHT,
  { pad: 28, azimuth: 40 },
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
const screws = (plan, inset, z) => D(k.corners(plan, inset).map(([x, y]) => at([x, y, z])), { size: 0.45 });

// ---------- base ----------
function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid", inner: L(k.sideSeam(PLATE, -PLATE_H / 2, P), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const corners = k.corners(PLATE, 10);
  out.push(L(corners.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(corners.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // régua na frente: 8 marcas maiores, uma por vertente
  const strip = { x: -140, y: PLATE.y + PLATE.d - 15, w: 280, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4.5, 8, strip.y + 0.8, 0.6, [2, 3.8], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  // placa de identificação com três linhas
  const tag = { x: 118, y: PLATE.y + PLATE.d - 34, w: 26, d: 14, r: 1.2 };
  out.push(S(k.slabOf(tag, 0, 0.8, P, 3, 0.3), { tone: "lo", crease: "none" }));
  [3.5, 7, 10.5].forEach((dy, index) => out.push(L(k.lineOnTop([tag.x + 4, tag.y + dy], [tag.x + (index === 2 ? 14 : 22), tag.y + dy], 0.8, P), { tone: "faint", free: true })));
  out.push(screws(tag, 1.6, 0.8));
  return out.join("");
}

function rails() {
  const out = [];
  for (const y of RAILS) {
    out.push(S(k.slabOf({ x: RAIL_FROM, y, w: RAIL_TO - RAIL_FROM, d: 5, r: 1 }, 0, 3, P, 3, 0.4), { tone: "mid" }));
    out.push(D([RAIL_FROM + 6, -40, 60, RAIL_TO - 6].map((x) => at([x, y + 2.5, 3])), { size: 0.4 }));
  }
  for (const x of [RAIL_FROM - 6, RAIL_TO + 1]) {
    out.push(S(k.slabOf({ x, y: RAILS[0] - 3, w: 5, d: RAILS[1] - RAILS[0] + 11, r: 1.2 }, 0, 8, P, 3, 0.5), { tone: "mid" }));
    out.push(D([at([x + 2.5, RAILS[0] + 1, 8]), at([x + 2.5, RAILS[1] + 4, 8])], { size: 0.45 }));
  }
  return out.join("");
}

// ---------- estação 1: setup (CLAUDE.md) ----------
function setup() {
  const x = STATION_X[0];
  const base = { x: x - 20, y: STATION_Y - 18, w: 40, d: 34, r: 3 };
  const card = { x: x - 15, y: STATION_Y - 13, w: 30, d: 24, r: 1 };
  const out = [`<path class="iso-halo" d="${k.haloOf(base, 0, 8, P)}" style="filter:blur(3px)"/>`];
  out.push(S(k.slabOf(base, 0, 8, P, 5, 0.8), { tone: "mid", inner: L(k.sideSeam(base, 3, P, 5), { tone: "faint" }) }));
  out.push(screws(base, 3, 8));
  out.push(S(k.slabOf(k.insetPlan(base, 3), 8, SETUP_TOP - 1 - 8, P, 4, 0.5), { tone: "mid" }));
  out.push(S(k.slabOf(card, SETUP_TOP - 1, 1, P, 2, 0.3), { tone: "hi", crease: "lo" }));
  out.push(k.faceTextSvg(k.topMatrix([card.x + 3, card.y + 6], SETUP_TOP, P, "x"), "CLAUDE.md", { size: 3, tone: "mid" }));
  [10, 13.5, 17, 20.5].forEach((dy, index) => out.push(L(k.lineOnTop([card.x + 3, card.y + dy], [card.x + [24, 20, 26, 14][index], card.y + dy], SETUP_TOP, P), { tone: "faint", free: true })));
  // presilha que segura a folha
  const clip = { x: card.x - 1, y: card.y - 2, w: card.w + 2, d: 4, r: 1 };
  out.push(S(k.slabOf(clip, SETUP_TOP, 1.6, P, 3, 0.3), { tone: "mid" }));
  out.push(D([at([clip.x + 2, clip.y + 2, SETUP_TOP + 1.6]), at([clip.x + clip.w - 2, clip.y + 2, SETUP_TOP + 1.6])], { size: 0.45 }));
  return out.join("");
}

// ---------- estação 2: rack de skills ----------
const CARTS = [-12, 0, 12].map((dx) => STATION_X[1] + dx);
const ACTIVE_CART = 1;
function rack() {
  const x = STATION_X[1];
  const base = { x: x - 22, y: STATION_Y - 16, w: 44, d: 30, r: 3 };
  const out = [`<path class="iso-halo" d="${k.haloOf(base, 0, 10, P)}" style="filter:blur(3px)"/>`];
  out.push(S(k.slabOf(base, 0, 10, P, 5, 0.8), { tone: "mid", inner: L(k.sideSeam(base, 4, P, 5), { tone: "faint" }) }));
  out.push(screws(base, 3, 10));
  CARTS.forEach((cx) => out.push(L(k.planOutline({ x: cx - 5, y: STATION_Y - 12, w: 10, d: 24, r: 1 }, 10, P, 3), { tone: "lo" })));
  return out.join("");
}
function cartridge(cx) {
  const plan = { x: cx - 4, y: STATION_Y - 11, w: 8, d: 22, r: 1.2 };
  const out = [S(k.slabOf(plan, 10, CART_TOP - 10, P, 3, 0.4), { tone: "hi", crease: "lo", inner: L(k.sideSeam(plan, CART_TOP - 6, P, 3), { tone: "faint" }) })];
  out.push(L(k.planOutline(k.insetPlan(plan, 1.6), CART_TOP, P, 3), { tone: "faint" }));
  out.push(D([at([cx, plan.y + 4, CART_TOP]), at([cx, plan.y + plan.d - 4, CART_TOP])], { size: 0.45, tone: "lo" }));
  return out.join("");
}

// ---------- estação 3: painel MCP ----------
const JACKS = [-12, 0, 12].map((dx) => STATION_X[2] + dx);
function hub() {
  // bloco de serviços externos, atrás do painel
  const x = STATION_X[2];
  const block = { x: x - 22, y: STATION_Y - 30, w: 44, d: 8, r: 1.5 };
  const out = [S(k.slabOf(block, 0, 42, P, 3, 0.6), { tone: "lo", inner: L(k.sideSeam(block, 14, P, 3), { tone: "faint" }) })];
  out.push(screws(block, 2, 42));
  return out.join("");
}
function panel() {
  const x = STATION_X[2];
  const box = { x: x - 22, y: STATION_Y - 18, w: 44, d: 34, r: 3 };
  const out = [`<path class="iso-halo" d="${k.haloOf(box, 0, PANEL_TOP, P)}" style="filter:blur(3px)"/>`];
  out.push(S(k.slabOf(box, 0, PANEL_TOP, P, 5, 1), { tone: "mid", inner: L(k.sideSeam(box, 6, P, 5) + k.sideSeam(box, PANEL_TOP - 6, P, 5), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(box, 4), PANEL_TOP, P, 4), { tone: "lo" }));
  out.push(screws(box, 3, PANEL_TOP));
  JACKS.forEach((jx) => {
    out.push(L(k.ring(jx, STATION_Y, 3.6, PANEL_TOP, P, 24), { tone: "mid" }));
    out.push(L(k.ring(jx, STATION_Y, 1.8, PANEL_TOP, P, 16), { tone: "lo" }));
    out.push(D([at([jx, STATION_Y, PANEL_TOP])], { size: 0.8, tone: "lo" }));
  });
  // conectores na borda de trás, com cabos até o bloco de serviços
  JACKS.forEach((jx) => {
    out.push(S(k.cylinder(jx, STATION_Y - 12, 2.2, PANEL_TOP, 3, P, 16), { tone: "mid" }));
    out.push(k.wireSvg(at([jx, STATION_Y - 12, PANEL_TOP + 3]), at([jx, STATION_Y - 22, 36]), { via: [at([jx, STATION_Y - 13, PANEL_TOP + 8]), at([jx, STATION_Y - 18, 37])], tone: "lo", size: 0.9 }));
  });
  return out.join("");
}

// ---------- estação 4: repositório (gaveteiro) ----------
function chest() {
  const x = STATION_X[3];
  const body = { x: x - 24, y: STATION_Y - 20, w: 48, d: 38, r: 2.5 };
  const out = [`<path class="iso-halo" d="${k.haloOf(body, 0, CHEST_TOP, P)}" style="filter:blur(3px)"/>`];
  out.push(S(k.slabOf(body, 0, CHEST_TOP, P, 4, 0.8), { tone: "mid", inner: L([12.5, 25].map((z) => k.sideSeam(body, z, P, 4)).join(""), { tone: "lo" }) }));
  // puxadores das gavetas fechadas, na face da frente
  [6.25, 18.75, 31].forEach((z) => out.push(S(k.slabOf({ x: x - 6, y: body.y + body.d, w: 12, d: 1.6, r: 0.6 }, z - 1, 2, P, 2), { tone: "mid", crease: "none" })));
  return out.join("");
}
function drawer() {
  const x = STATION_X[3];
  const plan = { x: x - 23, y: STATION_Y - 19, w: 46, d: 36, r: 2 };
  const out = [S(k.slabOf(plan, CHEST_TOP, DRAWER_TOP - CHEST_TOP, P, 4, 0.6), { tone: "hi", crease: "lo" })];
  const tray = k.insetPlan(plan, 3);
  out.push(L(k.planOutline(tray, DRAWER_TOP, P, 3), { tone: "lo" }));
  // fichas de arquivo vistas de cima: uma linha por arquivo
  for (let index = 1; index < 8; index++) out.push(L(k.lineOnTop([tray.x + 2, tray.y + index * (tray.d / 8)], [tray.x + tray.w - 2, tray.y + index * (tray.d / 8)], DRAWER_TOP, P), { tone: "faint", free: true }));
  out.push(S(k.slabOf({ x: x - 7, y: plan.y + plan.d, w: 14, d: 2, r: 0.8 }, CHEST_TOP + 4, 3, P, 2), { tone: "mid", crease: "none" }));
  return out.join("");
}

// ---------- o agente: carro, mastro e braço ----------
function carriage() {
  const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(CAR, 3), CAR_Z, 0.1, P)}" style="filter:blur(4px)"/>`];
  out.push(S(k.slabOf(CAR, CAR_Z, CAR_TOP - CAR_Z, P, 5, 0.6), { tone: "mid", inner: L(k.sideSeam(CAR, CAR_Z + 3, P, 5), { tone: "faint" }) }));
  out.push(screws(CAR, 3, CAR_TOP));
  for (const y of RAILS) out.push(L(k.lineOnTop([CAR.x, y + 2.5], [CAR.x + CAR.w, y + 2.5], CAR_TOP, P), { tone: "faint" }));
  // manopla de trava na frente
  const knob = [CAR.x + CAR.w - 8, CAR.y + CAR.d + 3];
  out.push(S(k.slabOf({ x: knob[0] - 2, y: CAR.y + CAR.d - 1, w: 4, d: 4, r: 1 }, CAR_Z + 1, 3, P, 2), { tone: "mid", crease: "none" }));
  out.push(S(k.cylinder(knob[0], knob[1] + 1, 3, CAR_Z, 5, P, 20), { tone: "mid" }));
  out.push(L(k.knurl(knob[0], knob[1] + 1, 3, CAR_Z, CAR_Z + 5, 18, P), { tone: "lo" }));
  return out.join("");
}
function mast() {
  const out = [S(k.slabOf(MAST, CAR_TOP, MAST_TOP - CAR_TOP, P, 3, 0.5), { tone: "mid", crease: "none" })];
  out.push(L(k.rise([MAST.x + MAST.w, MAST.y + MAST.d - 2.5, 0], CAR_TOP, MAST_TOP, P), { tone: "faint" }));
  out.push(S(k.slabOf(k.insetPlan(MAST, -1), MAST_TOP, 2, P, 3, 0.4), { tone: "mid" }));
  return out.join("");
}
// braço desenhado na altura 0 e movido em z
function arm() {
  const plan = { x: -4, y: STATION_Y - 6, w: 8, d: -STATION_Y + 2, r: 1.5 };
  const out = [S(k.slabOf(plan, 0, ARM_H, P, 3, 0.4), { tone: "mid" })];
  out.push(D([at([0, STATION_Y + 12, ARM_H]), at([0, STATION_Y + 24, ARM_H])], { size: 0.45 }));
  out.push(S(k.cylinder(0, STATION_Y, 4.5, -HOUSING_H, HOUSING_H, P, 28), { tone: "mid", inner: L(k.sideArc(0, STATION_Y, 4.5, -HOUSING_H + 4, P, 16), { tone: "faint" }) }));
  out.push(L(k.knurl(0, STATION_Y, 4.5, -HOUSING_H + 5, -1, 24, P), { tone: "lo" }));
  out.push(S(k.cylinder(0, STATION_Y, 1.6, -TIP_BELOW + 1.2, TIP_LEN - 1.2, P, 16), { tone: "hi", crease: "none", lit: true }));
  out.push(S(k.cylinder(0, STATION_Y, 2.4, -TIP_BELOW, 1.2, P, 20), { tone: "hi", lit: true }));
  return out.join("");
}
function collar() {
  const plan = k.insetPlan(MAST, -2.5);
  return S(k.slabOf(plan, -1, ARM_H + 4, P, 3, 0.5), { tone: "mid" }) + D([at([plan.x + plan.w, plan.y + 3, ARM_H + 1]), at([plan.x + plan.w, plan.y + plan.d - 3, ARM_H + 1])], { size: 0.45 });
}

// ---------- montagem ----------
const startX = STATION_X[0];
const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "Uma bancada com quatro estações e um carro sobre trilhos. O carro leva um braço com uma ponta de leitura. Ele visita em ordem: uma folha presa com a etiqueta CLAUDE.md (o setup), um rack de três cartuchos (as skills), um painel com três conectores ligados por cabos a um bloco de serviços (o MCP) e um gaveteiro de arquivos (o repositório). Em cada estação o braço desce, toca e volta.",
  body: [
    plate(),
    hub(),
    setup(),
    rack(),
    ...CARTS.map((cx, index) => (index === ACTIVE_CART ? `<g data-part="cart">${cartridge(cx)}</g>` : cartridge(cx))),
    panel(),
    chest(),
    `<g data-part="drawer">${drawer()}</g>`,
    rails(),
    `<g data-part="carriage" transform="${k.translateAlong(P, [startX, 0, 0])}">${carriage()}<g data-part="arm" transform="${k.translateAlong(P, [0, 0, ARM_REST])}">${arm()}</g>${mast()}<g data-part="collar" transform="${k.translateAlong(P, [0, 0, ARM_REST])}">${collar()}</g></g>`,
  ],
});

const live = `
const P = ${JSON.stringify(P)};
const STEPS = ${JSON.stringify(STEPS)};
const STATION_X = ${JSON.stringify(STATION_X)};
const TOUCH = ${JSON.stringify(TOUCH)};
const ARM_REST = ${ARM_REST}, CART_LIFT = ${CART_LIFT}, DRAWER_OUT = ${DRAWER_OUT};
const STEP_T = 3.4;
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const part = (name) => svg.querySelector('[data-part="' + name + '"]');
const carriage = part("carriage"), armEl = part("arm"), collarEl = part("collar"), cart = part("cart"), drawerEl = part("drawer");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (cur, want, dt, s, calm) => calm ? want : cur + (want - cur) * (1 - Math.exp(-dt / s));
let station = 0, local = 0, touring = true, visible = false, frame = 0, last = 0, idle = 0;
const s = { x: STATION_X[0], arm: ARM_REST, lift: 0, out: 0 };
// fases dentro de uma estação: viagem → desce → age → sobe
function targets() {
  const t = local;
  const arrived = Math.abs(s.x - STATION_X[station]) < 0.6;
  const down = arrived && t > 1.1 && t < 2.5;
  const want = { x: STATION_X[station], arm: down ? TOUCH[station] : ARM_REST, lift: 0, out: 0 };
  if (station === 1 && t > 1.9 && t < 3.0) want.lift = CART_LIFT;
  if (station === 1 && t > 1.9) want.arm = t < 3.0 ? TOUCH[1] + CART_LIFT + 6 : ARM_REST;
  if (station === 3 && t > 0.2 && t < 3.1) want.out = DRAWER_OUT;
  return want;
}
function phase() {
  const t = local;
  if (Math.abs(s.x - STATION_X[station]) > 0.6) return "indo";
  if (Math.abs(s.arm - TOUCH[station]) < 1.2 || s.lift > 1) return "agindo";
  return t < 1.5 ? "descendo" : "pronto";
}
function draw() {
  carriage.setAttribute("transform", translateAlong(P, [s.x, 0, 0]));
  armEl.setAttribute("transform", translateAlong(P, [0, 0, s.arm]));
  collarEl.setAttribute("transform", translateAlong(P, [0, 0, s.arm]));
  cart.setAttribute("transform", translateAlong(P, [0, 0, s.lift]));
  drawerEl.setAttribute("transform", translateAlong(P, [0, s.out, 0]));
  const text = (station + 1) + "/4 · " + STEPS[station].say + " · " + phase();
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuenow", String(station + 1));
  stage.setAttribute("aria-valuetext", text);
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  local += dt;
  if (touring && local > STEP_T) { local = 0; station = (station + 1) % STEPS.length; }
  const want = targets();
  s.x = ease(s.x, want.x, dt, 0.32, calm);
  s.arm = ease(s.arm, want.arm, dt, 0.16, calm);
  s.lift = ease(s.lift, want.lift, dt, 0.16, calm);
  s.out = ease(s.out, want.out, dt, 0.22, calm);
  draw();
  const settled = !touring && local > STEP_T + 1;
  frame = visible && !settled ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const go = (next) => {
  next = clamp(next, 0, STEPS.length - 1);
  if (next !== station || touring) { station = next; local = 0; }
  touring = false;
  clearTimeout(idle);
  idle = setTimeout(() => { touring = !still.matches; local = STEP_T; run(); }, 4200);
  run();
};
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
if (still.matches) touring = false;
stage.addEventListener("pointermove", (event) => {
  const box = svg.getBoundingClientRect();
  const share = clamp((event.clientX - box.left) / box.width, 0, 0.999);
  const next = Math.floor(share * STEPS.length);
  if (next !== station || touring) go(next);
});
stage.addEventListener("keydown", (event) => {
  let to = null;
  if (event.key === "ArrowRight" || event.key === "ArrowUp") to = station + 1;
  if (event.key === "ArrowLeft" || event.key === "ArrowDown") to = station - 1;
  if (event.key === "Home") to = 0;
  if (event.key === "End") to = STEPS.length - 1;
  if (to === null) return;
  event.preventDefault();
  station = -1;
  go(to);
});
draw();
`;

const body = k.plateHtml({
  fig: "Fig 1",
  title: "Como um agente trabalha",
  hint: "Passe o mouse para escolher a estação",
  readout: `1/4 · ${STEPS[0].say} · indo`,
  keys: [
    { mark: "lit", label: "A ponta do agente: o que lê e o que escreve" },
    { mark: "raised", label: "Estações: setup, skill, MCP e repositório" },
  ],
  caption:
    "O agente não sabe tudo de cabeça: ele segue um ciclo. Lê as instruções do projeto (CLAUDE.md), carrega a skill que serve à tarefa, chama ferramentas externas pelos conectores MCP e só então escreve no repositório. Cada estação é uma parte do sistema que o BASE8 ensina a montar.",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Ciclo do agente: as setas passam de uma estação para outra" aria-valuemin="1" aria-valuemax="4" aria-valuenow="1">${svg}</div>`,
});

const file = theme === "light" ? "agente-base8-light.html" : "agente-base8.html";
writeFileSync(join(HERE, file), k.pageHtml({ title: "Como um agente trabalha", theme, body, script: kitScript() + live }));
console.log("wrote", file);
