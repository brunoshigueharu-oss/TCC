"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent p-0.5 outline-none transition-colors duration-200 after:absolute after:-inset-x-2 after:-inset-y-3 data-[size=default]:h-6 data-[size=default]:w-10 data-[size=sm]:h-5 data-[size=sm]:w-8 data-checked:bg-acao data-unchecked:bg-desativado/60 hover:data-unchecked:bg-desativado focus-visible:ring-2 focus-visible:ring-texto focus-visible:ring-offset-2 focus-visible:ring-offset-fundo aria-invalid:border-destructive data-disabled:cursor-not-allowed data-disabled:opacity-45",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-papel shadow-[0_1px_2px_rgb(0_0_0/0.25)] transition-[translate,width] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[size=default]/switch:size-[18px] group-data-[size=sm]/switch:size-3.5 group-data-[size=default]/switch:data-checked:translate-x-4 group-data-[size=sm]/switch:data-checked:translate-x-3 data-unchecked:translate-x-0 group-active/switch:group-data-[size=default]/switch:w-[22px] group-active/switch:group-data-[size=default]/switch:data-checked:translate-x-3"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
