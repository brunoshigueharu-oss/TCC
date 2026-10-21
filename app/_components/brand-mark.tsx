import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  href: string;
  className?: string;
};

/** Logo provisório: círculo cinza + "código & design". */
export function BrandMark({ href, className }: BrandMarkProps) {
  return (
    <Link href={href} className={cn("flex min-h-11 items-center gap-2.5", className)}>
      <span aria-hidden className="size-[26px] rounded-full bg-superficie-forte" />
      <span className="font-display text-[15px] font-bold">código &amp; design</span>
    </Link>
  );
}
