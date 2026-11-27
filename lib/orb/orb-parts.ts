import {
  BufferGeometry,
  CircleGeometry,
  Color,
  Curve,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  LatheGeometry,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  type Texture,
} from "three";

import { lerp } from "@/lib/math";
import type { OrbPalette } from "@/lib/three-materials/palette";
import {
  createBrassMaps,
  createGrainTexture,
  createRandom,
  FULL_TEXTURES,
  type TextureSettings,
} from "@/lib/three-materials/textures";

import { createDialTexture, createEightBallTexture } from "./orb-textures";

/**
 * Peças do render 3D: miolo da bolinha de gude, bússola e bola 8.
 * Todas são medidas em "raios da esfera" (a bolinha de gude tem raio 1) e
 * montadas de frente para +z. A bola de tênis tem arquivo próprio.
 */

type Point = readonly [number, number, number];
type Facet = readonly [Point, Point, Point];

/**
 * Malha de facetas planas. Os vértices não são compartilhados, então cada
 * face pega luz por inteiro (visual lapidado).
 */
function createFacetGeometry(facets: readonly Facet[]) {
  const positions: number[] = [];
  const edgeA = new Vector3();
  const edgeB = new Vector3();

  for (const [first, second, third] of facets) {
    edgeA.set(second[0] - first[0], second[1] - first[1], second[2] - first[2]);
    edgeB.set(third[0] - first[0], third[1] - first[1], third[2] - first[2]);
    // Toda faceta precisa olhar para a frente (+z); se não olhar, inverte a ordem.
    const isFacingFront = edgeA.cross(edgeB).z >= 0;
    for (const corner of isFacingFront ? [first, second, third] : [first, third, second]) positions.push(...corner);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/* ------------------------------------------- miolo da bolinha de gude */

const SWIRL_GLOW = 0.4;
/** Vidro dentro de vidro reflete pouco: só um fio de brilho do estúdio aparece em cada fio. */
const SWIRL_REFLECTION = 0.5;

/**
 * Miolo da bolinha de gude: oito pares de fios finíssimos de vidro torcidos em
 * volta do eixo, como nas bolinhas de miolo rendado. O feixe é estrangulado no meio,
 * então tem dois bojos, um em cima do outro. O 8 é só isso: a silhueta do
 * feixe. Não há número desenhado; ele aparece no contorno, onde os fios se
 * acumulam, e some quando a bolinha vira.
 */
const CORE = {
  threads: 16,
  /** Voltas que cada fio dá em torno do eixo, de uma ponta à outra. */
  turns: 1.15,
  halfHeight: 0.62,
  /** Altura do estrangulamento (0 = base, 1 = topo): o bojo de baixo é o maior. */
  waist: 0.54,
  lowerRadius: 0.36,
  upperRadius: 0.29,
  /** Raio mínimo do feixe, nas pontas e no estrangulamento. */
  pinch: 0.022,
  /** Menor que 1 deixa os bojos mais cheios (menos pontudos). */
  roundness: 0.7,
  /** Fios grossos e finos se alternam. */
  thickRadius: 0.0085,
  thinRadius: 0.0045,
  segments: 220,
  sides: 6,
} as const;
/** Os fios finos são um tom mais leitoso que os grossos. */
const CORE_THIN_LIGHTEN = 0.4;

/** Raio do feixe em cada altura (0 = base, 1 = topo). */
function coreRadiusAt(along: number) {
  const isLower = along < CORE.waist;
  const withinLobe = isLower ? along / CORE.waist : (along - CORE.waist) / (1 - CORE.waist);
  const bulge = Math.sin(Math.PI * withinLobe) ** CORE.roundness;
  return CORE.pinch + (isLower ? CORE.lowerRadius : CORE.upperRadius) * bulge;
}

/** Caminho de um fio do miolo: sobe pelo eixo girando, na superfície dos dois bojos. */
class CoreThreadCurve extends Curve<Vector3> {
  constructor(private readonly phase: number) {
    super();
  }

  override getPoint(along: number, target = new Vector3()) {
    const angle = this.phase + along * CORE.turns * Math.PI * 2;
    const radius = coreRadiusAt(along);
    return target.set(Math.cos(angle) * radius, lerp(-CORE.halfHeight, CORE.halfHeight, along), Math.sin(angle) * radius);
  }
}

/** Miolo da bolinha de gude: os fios torcidos do centro. */
export function createSwirl(palette: OrbPalette) {
  const material = new MeshPhysicalMaterial({
    color: palette.comunidade,
    // Luz própria: dentro do vidro o fio recebe pouca luz e a cor morreria.
    emissive: palette.comunidade,
    emissiveIntensity: SWIRL_GLOW,
    // Vidro colorido é liso: o fio pega o brilho das luzes do estúdio.
    roughness: 0.3,
    envMapIntensity: SWIRL_REFLECTION,
    side: DoubleSide,
    // Some em granulado, e não por transparência: só peças opacas aparecem
    // refratadas através do vidro.
    alphaHash: true,
  });

  const thinColor = new Color(palette.comunidade).lerp(new Color("#ffffff"), CORE_THIN_LIGHTEN);
  const thinMaterial = material.clone();
  thinMaterial.color.copy(thinColor);
  thinMaterial.emissive.copy(thinColor);

  const core = new Group();
  for (let thread = 0; thread < CORE.threads; thread += 1) {
    const isThick = thread % 2 === 0;
    const curve = new CoreThreadCurve((thread / CORE.threads) * Math.PI * 2);
    const geometry = new TubeGeometry(curve, CORE.segments, isThick ? CORE.thickRadius : CORE.thinRadius, CORE.sides);
    core.add(new Mesh(geometry, isThick ? material : thinMaterial));
  }

  return {
    core,
    setOpacity(opacity: number) {
      material.opacity = opacity;
      thinMaterial.opacity = opacity;
    },
  };
}

const AIR_BUBBLE_COUNT = 26;
const AIR_BUBBLE_SEED = 88;

/** Bolhinhas de ar presas no vidro, como em toda bolinha de gude de verdade. */
export function createAirBubbles() {
  const material = new MeshStandardMaterial({ color: "#ffffff", metalness: 1, roughness: 0.05 });
  const mesh = new InstancedMesh(new SphereGeometry(1, 12, 8), material, AIR_BUBBLE_COUNT);
  const placement = new Matrix4();
  const direction = new Vector3();
  const random = createRandom(AIR_BUBBLE_SEED);

  for (let bubble = 0; bubble < AIR_BUBBLE_COUNT; bubble += 1) {
    direction.set(random() - 0.5, random() - 0.5, random() - 0.5).normalize();
    const distance = lerp(0.3, 0.92, random());
    const size = lerp(0.005, 0.022, random() ** 2);
    placement.makeScale(size, size, size).setPosition(direction.multiplyScalar(distance));
    mesh.setMatrixAt(bubble, placement);
  }
  return { mesh };
}

/* -------------------------------------------------------------- bússola */

/** Aspereza máxima do latão; o mapa decide onde ela aparece. */
const BRASS_ROUGHNESS = 0.62;
/** Altura do relevo do latão (escovado, corrosão, amassados). */
const BRASS_BUMP = 1.4;
/** Quantas vezes os mapas do latão se repetem em volta da caixa. */
const BRASS_REPEAT = [3, 1] as const;
/** Coroa serrilhada na haste, para girar com os dedos. */
const CROWN = { radius: 0.105, height: 0.075, flutes: 22, position: 1.1 } as const;
/** Altura (em z) de cada camada da bússola, de trás para a frente. */
const COMPASS_LAYERS = { dial: 0.1, needle: 0.15, cap: 0.17 } as const;
const COMPASS_DIAL_RADIUS = 0.905;
/** Grão do papel do mostrador: repetição e altura do relevo. */
const PAPER_GRAIN_REPEAT = [5, 5] as const;
const PAPER_BUMP = 0.35;
const NEEDLE = { length: 0.74, tail: 0.6, halfWidth: 0.028, ridge: 0.02, arrow: 0.17, arrowHalfWidth: 0.06 } as const;

/**
 * Perfil da caixa, girado em torno do eixo: fundo plano, lateral arredondada,
 * aro saliente na frente e o degrau interno onde o mostrador encaixa.
 * Pares [raio, profundidade].
 */
const COMPASS_CASE_PROFILE: readonly (readonly [number, number])[] = [
  [0, -0.13],
  [0.84, -0.13],
  [0.93, -0.115],
  [0.985, -0.07],
  [1, -0.02],
  // Dois sulcos torneados na lateral.
  [1, 0],
  [0.99, 0.007],
  [0.99, 0.015],
  [1, 0.022],
  [1, 0.05],
  [0.99, 0.057],
  [0.99, 0.065],
  [1, 0.072],
  // Friso saliente antes do aro.
  [1.014, 0.084],
  [1.02, 0.104],
  [1.008, 0.126],
  [0.985, 0.142],
  [0.955, 0.16],
  [0.925, 0.155],
  [COMPASS_DIAL_RADIUS, 0.13],
  [COMPASS_DIAL_RADIUS, COMPASS_LAYERS.dial],
];

/** Agulha fina, com seta na ponta norte: um losango comprido dobrado ao meio. */
function createNeedleGeometry() {
  const ridge: Point = [0, 0, NEEDLE.ridge];
  const left: Point = [-NEEDLE.halfWidth, 0, 0];
  const right: Point = [NEEDLE.halfWidth, 0, 0];
  const northTip: Point = [0, NEEDLE.length, 0];
  const southTip: Point = [0, -NEEDLE.tail, 0];
  const arrowBack: Point = [0, NEEDLE.length - NEEDLE.arrow, 0];
  const arrowMiddle = NEEDLE.length - NEEDLE.arrow * 0.6;
  const arrowRidge: Point = [0, arrowMiddle, NEEDLE.ridge];
  const arrowLeft: Point = [-NEEDLE.arrowHalfWidth, arrowMiddle, 0];
  const arrowRight: Point = [NEEDLE.arrowHalfWidth, arrowMiddle, 0];

  return createFacetGeometry([
    [ridge, left, northTip],
    [ridge, northTip, right],
    [ridge, left, southTip],
    [ridge, southTip, right],
    [arrowRidge, arrowLeft, northTip],
    [arrowRidge, northTip, arrowRight],
    [arrowRidge, arrowLeft, arrowBack],
    [arrowRidge, arrowBack, arrowRight],
  ]);
}

/**
 * Bússola de bolso antiga: caixa e argola de latão, mostrador de papel
 * impresso e agulha escura. A rosa dos ventos de oito pontas está impressa no
 * mostrador.
 */
export function createCompass(scuffs: Texture, textures: TextureSettings = FULL_TEXTURES) {
  const facingFront = Math.PI / 2;
  const brassMaps = createBrassMaps(textures);
  for (const texture of Object.values(brassMaps)) texture.repeat.set(...BRASS_REPEAT);
  const brass = new MeshStandardMaterial({
    ...brassMaps,
    metalness: 1,
    roughness: BRASS_ROUGHNESS,
    bumpScale: BRASS_BUMP,
  });
  // Mesma liga, facetada: a coroa serrilhada.
  const brassFluted = brass.clone();
  brassFluted.flatShading = true;
  // Aço azulado da agulha, com os riscos de uso.
  const darkSteel = new MeshStandardMaterial({
    color: "#2c2f3a",
    metalness: 1,
    roughness: 0.6,
    roughnessMap: scuffs,
    flatShading: true,
  });
  const paperGrain = createGrainTexture(411);
  paperGrain.repeat.set(...PAPER_GRAIN_REPEAT);

  const caseProfile = COMPASS_CASE_PROFILE.map(([radius, depth]) => new Vector2(radius, depth));
  const caseBody = new Mesh(new LatheGeometry(caseProfile, 128), brass);
  caseBody.rotation.x = facingFront;

  const dial = new Mesh(
    new CircleGeometry(COMPASS_DIAL_RADIUS, 96),
    new MeshStandardMaterial({ map: createDialTexture(textures), roughness: 0.95, bumpMap: paperGrain, bumpScale: PAPER_BUMP }),
  );
  dial.position.z = COMPASS_LAYERS.dial;

  const needle = new Group();
  const blade = new Mesh(createNeedleGeometry(), darkSteel);
  const tailRing = new Mesh(new TorusGeometry(0.05, 0.013, 12, 40), darkSteel);
  tailRing.position.y = -NEEDLE.tail - 0.045;
  needle.add(blade, tailRing);
  needle.position.z = COMPASS_LAYERS.needle;

  const cap = new Mesh(new SphereGeometry(0.075, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), brass);
  cap.rotation.x = facingFront;
  cap.scale.y = 0.55;
  cap.position.z = COMPASS_LAYERS.cap;

  const stem = new Mesh(new CylinderGeometry(0.085, 0.1, 0.13, 32), brass);
  stem.position.y = 1.05;
  const bow = new Mesh(new TorusGeometry(0.21, 0.03, 20, 80), brass);
  bow.position.y = 1.32;

  const crown = new Mesh(new CylinderGeometry(CROWN.radius, CROWN.radius, CROWN.height, CROWN.flutes), brassFluted);
  crown.position.y = CROWN.position;

  const group = new Group();
  group.add(caseBody, dial, needle, cap, stem, crown, bow);
  return {
    group,
    needle,
    dispose() {
      for (const texture of Object.values(brassMaps)) texture.dispose();
      paperGrain.dispose();
    },
  };
}

/* --------------------------------------------------------------- bola 8 */

/**
 * Bola 8 de sinuca: resina preta polida, com riscos finos na camada de
 * verniz. Some em granulado quando vira a bola de tênis.
 */
export function createEightBall(scuffs: Texture, textures: TextureSettings = FULL_TEXTURES) {
  const material = new MeshPhysicalMaterial({
    map: createEightBallTexture(textures),
    roughness: 0.35,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    clearcoatRoughnessMap: scuffs,
    alphaHash: true,
  });
  const mesh = new Mesh(new SphereGeometry(1, 96, 64), material);
  return { mesh, material };
}
