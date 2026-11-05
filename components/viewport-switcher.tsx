"use client";

import { Menu } from "@base-ui/react/menu";
import { Check, Menu as MenuIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useRef, useState } from "react";

import { ViewportFrame } from "@/components/viewport-frame";
import { useIsEmbedded, useViewportPreset } from "@/hooks/use-viewport-preset";
import { VIEWPORT_GROUPS, findViewportPreset } from "@/lib/data/viewport-presets";

const REAL_SIZE = "real";

function currentPath() {
  if (typeof window === "undefined") return "/";
  const { pathname, search, hash } = window.location;
  return `${pathname}${search}${hash}`;
}

function readFramePath(iframe: HTMLIFrameElement | null) {
  try {
    const location = iframe?.contentWindow?.location;
    return location ? `${location.pathname}${location.search}${location.hash}` : null;
  } catch {
    return null;
  }
}

const itemClass =
  "flex min-h-9 cursor-default items-center gap-3 rounded-md px-2.5 text-sm outline-hidden select-none data-highlighted:bg-superficie";

/**
 * Ferramenta do protótipo: botão flutuante para ver a tela atual em tamanhos
 * padrão de celular, tablet e computador. Fica no canto superior direito; na
 * Landing desce para o inferior, porque lá o header ocupa a largura toda.
 */
export function ViewportSwitcher() {
  const [presetId, setPresetId] = useViewportPreset();
  // Dentro da prévia o storage é o mesmo: sem isto a moldura abriria outra
  // moldura dentro de si, infinitamente.
  const isEmbedded = useIsEmbedded();
  const [framePath, setFramePath] = useState(currentPath);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();
  const isLanding = usePathname() === "/";

  const preset = findViewportPreset(presetId);

  function handleValueChange(value: unknown) {
    if (typeof value !== "string") return;

    if (value === REAL_SIZE) {
      // Volta para a tela em que a navegação dentro da prévia parou.
      const lastPath = readFramePath(iframeRef.current);
      setPresetId(null);
      if (lastPath && lastPath !== currentPath()) router.push(lastPath);
      return;
    }

    if (!preset) setFramePath(currentPath());
    setPresetId(value);
  }

  return (
    <>
      {preset && !isEmbedded && <ViewportFrame preset={preset} src={framePath} iframeRef={iframeRef} />}

      <Menu.Root>
        <Menu.Trigger
          aria-label="Escolher tamanho da tela"
          className={`fixed z-[60] ${isLanding ? "right-4 bottom-4" : "top-3 right-3"} size-10 items-center justify-center rounded-full text-white shadow-lg ring-1 ring-black/10 outline-offset-2 focus-visible:outline-2 focus-visible:outline-acao ${preset ? "bg-acao" : "bg-texto"} ${isEmbedded ? "hidden" : "flex"}`}
        >
          <MenuIcon aria-hidden className="size-5" strokeWidth={2} />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner className="z-[70] outline-hidden" side={isLanding ? "top" : "bottom"} sideOffset={8} align="end">
            <Menu.Popup className="max-h-(--available-height) w-64 origin-(--transform-origin) overflow-y-auto rounded-xl bg-fundo p-1.5 text-texto shadow-xl ring-1 ring-linha outline-hidden transition-[scale,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
              <Menu.RadioGroup value={preset ? preset.id : REAL_SIZE} onValueChange={handleValueChange}>
                <Menu.RadioItem value={REAL_SIZE} className={itemClass}>
                  <span className="flex-1">Tamanho real da janela</span>
                  <Menu.RadioItemIndicator>
                    <Check aria-hidden className="size-4 text-acao" strokeWidth={2.5} />
                  </Menu.RadioItemIndicator>
                </Menu.RadioItem>

                {VIEWPORT_GROUPS.map((group) => (
                  <Fragment key={group.label}>
                    <Menu.Separator className="mx-1 my-1.5 h-px bg-linha" />
                    <div
                      role="presentation"
                      className="px-2.5 pt-1 pb-0.5 text-xs font-semibold tracking-wide text-texto-secundario uppercase"
                    >
                      {group.label}
                    </div>
                    {group.presets.map((item) => (
                      <Menu.RadioItem key={item.id} value={item.id} className={itemClass}>
                        <span className="flex-1">{item.label}</span>
                        <span className="text-xs text-texto-secundario tabular-nums">
                          {item.width} × {item.height}
                        </span>
                        <Menu.RadioItemIndicator className="w-4">
                          <Check aria-hidden className="size-4 text-acao" strokeWidth={2.5} />
                        </Menu.RadioItemIndicator>
                      </Menu.RadioItem>
                    ))}
                  </Fragment>
                ))}
              </Menu.RadioGroup>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </>
  );
}
