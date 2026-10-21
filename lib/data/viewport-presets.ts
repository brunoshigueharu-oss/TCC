/**
 * Tamanhos de tela do seletor de pré-visualização (ferramenta de protótipo).
 * Os valores seguem os presets de frame do Figma, para o design e o código
 * falarem dos mesmos tamanhos.
 */
export type ViewportPreset = {
  id: string;
  label: string;
  width: number;
  height: number;
};

export type ViewportGroup = {
  label: string;
  presets: ViewportPreset[];
};

export const VIEWPORT_GROUPS: ViewportGroup[] = [
  {
    label: "Celular",
    presets: [
      { id: "iphone-se", label: "iPhone SE", width: 375, height: 667 },
      { id: "iphone-16", label: "iPhone 16", width: 393, height: 852 },
      { id: "android", label: "Android", width: 412, height: 917 },
      { id: "iphone-16-pro-max", label: "iPhone 16 Pro Max", width: 440, height: 956 },
    ],
  },
  {
    label: "Tablet",
    presets: [
      { id: "ipad-mini", label: "iPad mini", width: 744, height: 1133 },
      { id: "ipad-pro-11", label: "iPad Pro 11”", width: 834, height: 1194 },
    ],
  },
  {
    label: "Computador",
    presets: [
      { id: "macbook-air", label: "MacBook Air", width: 1280, height: 832 },
      { id: "desktop", label: "Desktop", width: 1440, height: 1024 },
      { id: "full-hd", label: "Full HD", width: 1920, height: 1080 },
    ],
  },
];

const ALL_PRESETS = VIEWPORT_GROUPS.flatMap((group) => group.presets);

export function findViewportPreset(id: string | null): ViewportPreset | null {
  return ALL_PRESETS.find((preset) => preset.id === id) ?? null;
}
