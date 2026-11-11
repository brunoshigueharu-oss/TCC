import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl px-3 py-2 text-[15px] file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-texto border border-linha bg-fundo text-texto transition-[border-color,box-shadow,background-color] duration-200 outline-none placeholder:text-texto-secundario/70 hover:border-desativado focus-visible:border-texto focus-visible:ring-3 focus-visible:ring-texto/10 disabled:cursor-not-allowed disabled:border-linha disabled:bg-superficie disabled:text-desativado aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/15",
        className
      )}
      {...props}
    />
  )
}

export { Input }
