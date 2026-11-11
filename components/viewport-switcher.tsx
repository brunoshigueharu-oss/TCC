"use client";

import { Menu } from "@base-ui/react/menu";
import { Check, MonitorSmartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useRef, useState } from "react";

import { ViewportFrame } from "@/components/viewport-frame";
import { useIsEmbedded, useViewportPreset } from "@/hooks/use-viewport-preset";
import { VIEWPORT_GROUPS, findViewportPreset } from "@/lib/data/viewport-presets";
import { cn } from "@/lib/utils";

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
 * Ferramenta do protótipo: botão flutuante, discreto (semitransparente até o
 * hover), para ver a tela atual em tamanhos padrão de celular, tablet e
 * computador. Fica num canto inferior, longe dos cabeçalhos.
 */
export function ViewportSwitcher() {
  const [presetId, setPresetId] = useViewportPreset();
  // Dentro da prévia o storage é o mesmo: sem isto a moldura abriria outra
  // moldura dentro de si, infinitamente.
  const isEmbedded = useIsEmbedded();
  const [framePath, setFramePath] = useState(currentPath);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

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
          className={cn(
            "fixed z-[60] size-9 items-center justify-center rounded-full border outline-none backdrop-blur-md transition-[color,background-color,border-color,opacity] duration-200 focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-offset-2 focus-visible:ring-offset-fundo",
            // Fica no canto inferior esquerdo; no celular sobe acima da barra inferior.
            "bottom-[calc(76px+env(safe-area-inset-bottom))] left-3 lg:bottom-4 lg:left-auto lg:right-4",
            preset
              ? "border-acao bg-acao text-tinta opacity-100"
              : "border-linha bg-fundo/80 text-texto-secundario opacity-60 hover:text-texto hover:opacity-100 data-popup-open:opacity-100",
            isEmbedded ? "hidden" : "flex",
          )}
        >
          <MonitorSmartphone aria-hidden className="size-4" strokeWidth={1.75} />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner className="z-[70] outline-hidden" side="top" sideOffset={8} align="end">
            <Menu.Popup className="max-h-(--available-height) w-64 border border-linha origin-(--transform-origin) overflow-y-auto rounded-xl bg-fundo p-1.5 text-texto shadow-[0_16px_40px_-16px_rgb(0_0_0/0.35)] outline-hidden transition-[scale,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
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
