import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-xl px-3 py-2.5 text-[15px] leading-relaxed border border-linha bg-fundo text-texto transition-[border-color,box-shadow,background-color] duration-200 outline-none placeholder:text-texto-secundario/70 hover:border-desativado focus-visible:border-texto focus-visible:ring-3 focus-visible:ring-texto/10 disabled:cursor-not-allowed disabled:border-linha disabled:bg-superficie disabled:text-desativado aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/15",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
