"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ScrollShellProps = {
  children: ReactNode;
  "aria-label": string;
};

export function ScrollShell({ children, "aria-label": ariaLabel }: ScrollShellProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    function handleWheel(event: WheelEvent) {
      if (!container) return;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScrollLeft = scrollWidth - clientWidth;
      const scrollingForward = event.deltaY > 0;
      const atStart = scrollLeft <= 0;
      const atEnd = scrollLeft >= maxScrollLeft - 1;

      if ((scrollingForward && atEnd) || (!scrollingForward && atStart)) {
        return;
      }

      event.preventDefault();
      container.scrollLeft += event.deltaY;
    }

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={ariaLabel}
      tabIndex={0}
      className="h-full w-full overflow-x-auto overflow-y-hidden focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-journey-accent"
    >
      {children}
    </div>
  );
}
