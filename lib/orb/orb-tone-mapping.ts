import { BlendFunction, Effect, EffectAttribute } from "postprocessing";
import { Uniform, type WebGLRenderer, type WebGLRenderTarget } from "three";

/**
 * Curva de exposição de foto de produto (a "Neutral" do Khronos: segura o
 * estouro dos brilhos sem lavar as cores), aplicada só no objeto.
 *
 * O fundo fica de fora de propósito: ele é a cor da página, e qualquer curva
 * mexeria nela (o branco puro viraria cinza-claro). Fundo é o pixel em que
 * nada foi desenhado, ou seja, profundidade no máximo.
 *
 * O grão de filme entra aqui pelo mesmo motivo: só no objeto, nunca na página.
 */
const fragmentShader = /* glsl */ `
  vec3 neutralToneMapping(vec3 color) {
    const float startCompression = 0.76;
    const float desaturation = 0.15;

    float darkest = min(color.r, min(color.g, color.b));
    float offset = darkest < 0.08 ? darkest - 6.25 * darkest * darkest : 0.04;
    color -= offset;

    float peak = max(color.r, max(color.g, color.b));
    if (peak < startCompression) return color;

    float headroom = 1.0 - startCompression;
    float newPeak = 1.0 - headroom * headroom / (peak + headroom - startCompression);
    color *= newPeak / peak;

    float gray = 1.0 - 1.0 / (desaturation * (peak - newPeak) + 1.0);
    return mix(color, vec3(newPeak), gray);
  }

  uniform float uGrain;
  uniform float uSeed;

  float grainAt(vec2 point) {
    return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
    if (depth >= 0.9999) {
      outputColor = vec4(min(inputColor.rgb, vec3(1.0)), inputColor.a);
      return;
    }
    vec3 color = neutralToneMapping(inputColor.rgb);
    // Grão mais forte nos meios-tons, quase nenhum no preto e no branco, como em filme.
    float brightness = dot(color, vec3(0.299, 0.587, 0.114));
    float midtones = 4.0 * brightness * (1.0 - brightness);
    color += grainAt(uv * resolution + uSeed) * uGrain * (0.35 + 0.65 * midtones);
    outputColor = vec4(color, inputColor.a);
  }
`;

/** O grão muda a cada quadro; a semente volta a zero para o número não crescer sem fim. */
const SEED_WRAP = 100;

type PageToneMappingOptions = {
  /** Força do grão de filme (0 = sem grão). */
  grain?: number;
};

export class PageToneMappingEffect extends Effect {
  constructor({ grain = 0 }: PageToneMappingOptions = {}) {
    super("PageToneMappingEffect", fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      attributes: EffectAttribute.DEPTH,
      uniforms: new Map([
        ["uGrain", new Uniform(grain)],
        ["uSeed", new Uniform(0)],
      ]),
    });
  }

  override update(_renderer: WebGLRenderer, _inputBuffer: WebGLRenderTarget, deltaTime = 0) {
    const seed = this.uniforms.get("uSeed");
    if (seed) seed.value = (seed.value + deltaTime * 60) % SEED_WRAP;
  }
}
