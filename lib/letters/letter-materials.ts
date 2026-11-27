import {
  Color,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  type Material,
  type Texture,
} from "three";

import { lerp } from "@/lib/math";
import { createGlass, GLASS_PROFILES } from "@/lib/three-materials/glass";
import type { OrbPalette } from "@/lib/three-materials/palette";
import {
  createBrassMaps,
  createGrainTexture,
  createScuffTexture,
  type TextureSettings,
} from "@/lib/three-materials/textures";
import type { Letter3D } from "./letter-geometry";

/**
 * Do que as letras de BASE8 podem ser feitas. São os materiais dos objetos de
 * `lib/orb` (latão da bússola, vidro da bolinha de gude, resina e marfim da
 * bola 8, feltro da bola de tênis) mais o cromado. Sempre a cor do objeto de
 * verdade, nunca uma cor da marca chapada.
 */
export const LETTER_MATERIAL_IDS = ["latao", "vidro", "cromo", "feltro", "resina", "marfim"] as const;

export type LetterMaterialId = (typeof LETTER_MATERIAL_IDS)[number];

/** Quantas vezes cada textura se repete por altura de letra. */
const REPEAT = { brass: 1.3, scuffs: 2, grain: 1 } as const;
const BRASS = { roughness: 0.62, bump: 1.1 } as const;
/** Vidro grosso, como o da bolinha de gude; `thickness` em alturas de letra. */
const GLASS_LOOK = { tint: 1, film: 0, thickness: 0.34, rim: 0.6, wear: 0.035, time: 0 } as const;
/**
 * Ajustes do vidro para letra. A gude tem os fios coloridos por dentro; a
 * letra, não: sem mais cor no próprio vidro ela some no branco da página. E as
 * faces planas mostram como ruído a ondulação que, na esfera, parece vidro
 * soprado.
 */
const GLASS = { tint: "#7db4ee", tintDistance: 0.42, waviness: 0.08, rimOversize: 1.004 } as const;
const CHROME = { color: "#eef1f5", roughness: 0.05, reflection: 1.15 } as const;
const RESIN = { color: "#0c0c0f", roughness: 0.35, coatRoughness: 0.1 } as const;
const IVORY = { color: "#efe7d6", roughness: 0.5, coat: 0.5, coatRoughness: 0.3, bump: 0.15 } as const;
/** Feltro da bola de tênis: cor, brilho aveludado e os fios (cascas, como em `orb-tennis`). */
const FELT = {
  color: "#cbe226",
  sheen: "#f2f7a8",
  bump: 0.6,
  shells: 14,
  /** Comprimento dos fios, em alturas de letra. */
  length: 0.03,
  /** Sombra na raiz dos fios e claro nas pontas. */
  shade: { root: 0.55, tip: 1.08 },
  /** Quanto mais para fora, menos pontos passam: o fio afina até sumir. */
  alphaTest: { root: 0.3, tip: 0.93 },
} as const;

/**
 * Casca de feltro: a mesma letra, empurrada um pouco para fora ao longo das
 * normais. O `scale` que a bola de tênis usa só serve para esfera; numa letra,
 * é preciso mexer no shader.
 */
function createShellMaterial(height: number, grain: Texture) {
  const material = new MeshStandardMaterial({
    color: new Color(FELT.color).multiplyScalar(lerp(FELT.shade.root, FELT.shade.tip, height ** 0.7)),
    alphaMap: grain,
    alphaTest: lerp(FELT.alphaTest.root, FELT.alphaTest.tip, height),
    roughness: 1,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uShellOffset = { value: FELT.length * height };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uShellOffset;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed += normalize( objectNormal ) * uShellOffset;");
  };
  // Todas as cascas usam o mesmo programa; só o valor do deslocamento muda.
  material.customProgramCacheKey = () => "letter-felt-shell";
  return material;
}

export function createLetterMaterials(palette: OrbPalette, textures: TextureSettings) {
  const scuffs = createScuffTexture();
  scuffs.repeat.set(REPEAT.scuffs, REPEAT.scuffs);
  const grain = createGrainTexture(1877);
  grain.repeat.set(REPEAT.grain, REPEAT.grain);
  const brassMaps = createBrassMaps(textures);
  for (const texture of Object.values(brassMaps)) texture.repeat.set(REPEAT.brass, REPEAT.brass);
  const glass = createGlass(palette, scuffs, GLASS_PROFILES.page);
  glass.setLook(GLASS_LOOK);
  glass.material.attenuationColor.set(GLASS.tint);
  glass.material.attenuationDistance = GLASS.tintDistance;
  glass.material.bumpScale = GLASS.waviness;

  const surface: Record<LetterMaterialId, MeshStandardMaterial> = {
    latao: new MeshStandardMaterial({ ...brassMaps, metalness: 1, roughness: BRASS.roughness, bumpScale: BRASS.bump }),
    vidro: glass.material,
    cromo: new MeshStandardMaterial({
      color: CHROME.color,
      metalness: 1,
      roughness: CHROME.roughness,
      roughnessMap: scuffs,
      envMapIntensity: CHROME.reflection,
    }),
    feltro: new MeshPhysicalMaterial({
      color: FELT.color,
      roughness: 1,
      sheen: 1,
      sheenRoughness: 0.6,
      sheenColor: new Color(FELT.sheen),
      bumpMap: grain,
      bumpScale: FELT.bump,
    }),
    resina: new MeshPhysicalMaterial({
      color: RESIN.color,
      roughness: RESIN.roughness,
      clearcoat: 1,
      clearcoatRoughness: RESIN.coatRoughness,
      clearcoatRoughnessMap: scuffs,
    }),
    marfim: new MeshPhysicalMaterial({
      color: IVORY.color,
      roughness: IVORY.roughness,
      clearcoat: IVORY.coat,
      clearcoatRoughness: IVORY.coatRoughness,
      bumpMap: grain,
      bumpScale: IVORY.bump,
    }),
  };
  const shells = Array.from({ length: FELT.shells }, (_, index) => createShellMaterial((index + 1) / FELT.shells, grain));
  const all: Material[] = [...Object.values(surface), ...shells];

  return {
    surface,
    shells,
    /** Contorno escuro do vidro, desenhado por cima dele (como na esfera de `lib/orb`). */
    glassRim: glass.rimMaterial,
    /** Liga o estúdio de reflexos em todos os materiais. */
    setEnvironment(texture: Texture | null) {
      for (const material of all) {
        if (!(material instanceof MeshStandardMaterial)) continue;
        material.envMap = texture;
        material.needsUpdate = true;
      }
    },
    dispose() {
      for (const material of all) material.dispose();
      for (const texture of Object.values(brassMaps)) texture.dispose();
      glass.dispose();
      scuffs.dispose();
      grain.dispose();
    },
  };
}

export type LetterMaterials = ReturnType<typeof createLetterMaterials>;

/**
 * Uma letra pronta para a cena: o corpo e, por cima, o que só alguns
 * materiais têm: as cascas do feltro e o contorno do vidro. `setMaterial`
 * troca do que ela é feita.
 */
export function createLetterObject(letter: Letter3D, materials: LetterMaterials) {
  const group = new Group();
  const body = new Mesh(letter.geometry, materials.surface.latao);
  const fuzz = new Group();
  for (const shell of materials.shells) fuzz.add(new Mesh(letter.softGeometry, shell));
  fuzz.visible = false;
  const rim = new Mesh(letter.geometry, materials.glassRim);
  rim.scale.setScalar(GLASS.rimOversize);
  rim.visible = false;
  group.add(body, fuzz, rim);
  group.position.x = letter.x;

  return {
    group,
    setMaterial(id: LetterMaterialId) {
      const isFelt = id === "feltro";
      body.material = materials.surface[id];
      body.geometry = isFelt ? letter.softGeometry : letter.geometry;
      fuzz.visible = isFelt;
      rim.visible = id === "vidro";
    },
  };
}

export type LetterObject = ReturnType<typeof createLetterObject>;
