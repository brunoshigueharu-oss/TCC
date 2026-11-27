import { clamp, lerp, smoothstep } from "@/lib/math";

/**
 * Linha do tempo do render 3D: cinco objetos redondos que viram um no outro.
 * O progresso vai de 0 (bolinha de gude) a 4 (bola de tênis); os valores
 * inteiros são os objetos prontos e o que fica entre eles é a transformação.
 */

export const ORB_STAGE_IDS = ["gude", "bolha", "bussola", "bola-8", "bola-de-tenis"] as const;

export const ORB_STAGE_COUNT = ORB_STAGE_IDS.length;
export const ORB_LAST_STAGE = ORB_STAGE_COUNT - 1;

/** Um valor por objeto, na ordem de `ORB_STAGE_IDS`. */
export type OrbTrack = readonly [number, number, number, number, number];

/**
 * Parte de cada trecho em que o objeto fica parado, pronto, antes de começar
 * a virar o próximo (e depois de terminar de virar). 0.18 = 18% em cada ponta.
 */
const HOLD = 0.18;

/**
 * Largura e altura da cena, em raios da esfera, que precisam caber na tela:
 * a esfera mais a folga para a bolha inflada e a argola da bússola.
 */
export const ORB_FIT_SIZE = 3.6;

/** Índice do objeto de partida do trecho em que o progresso está. */
function segmentOf(progress: number) {
  return Math.min(Math.floor(progress), ORB_LAST_STAGE - 1);
}

/**
 * Segura o progresso perto de cada objeto pronto e acelera no meio: assim a
 * rolagem tem "degraus" em que dá para ver cada objeto sem ele já estar
 * derretendo.
 */
export function easeOrbProgress(progress: number) {
  const bounded = clamp(progress, 0, ORB_LAST_STAGE);
  const segment = segmentOf(bounded);
  return segment + smoothstep(HOLD, 1 - HOLD, bounded - segment);
}

/** Lê uma trilha no ponto `eased` (já passado por `easeOrbProgress`). */
export function sampleTrack(track: OrbTrack, eased: number) {
  const segment = segmentOf(eased);
  return lerp(track[segment], track[segment + 1], eased - segment);
}
