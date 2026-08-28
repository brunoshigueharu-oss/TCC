"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollShellProps = {
  children: ReactNode;
  "aria-label": string;
};

export function ScrollShell({ children, "aria-label": ariaLabel }: ScrollShellProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function updateProgress() {
      if (!container) return;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setProgress(maxScrollLeft > 0 ? container.scrollLeft / maxScrollLeft : 0);
    }

    updateProgress();
    container.addEventListener("scroll", updateProgress, { passive: true });

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let handleWheel: ((event: WheelEvent) => void) | undefined;

    if (!prefersReducedMotion) {
      handleWheel = (event: WheelEvent) => {
        if (event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

        const LINE_HEIGHT = 16;
        const delta =
          event.deltaMode === 1
            ? event.deltaY * LINE_HEIGHT
            : event.deltaMode === 2
              ? event.deltaY * container.clientHeight
              : event.deltaY;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        const maxScrollLeft = scrollWidth - clientWidth;
        const scrollingForward = delta > 0;
        const atStart = scrollLeft <= 0;
        const atEnd = scrollLeft >= maxScrollLeft - 1;

        if ((scrollingForward && atEnd) || (!scrollingForward && atStart)) {
          return;
        }

        event.preventDefault();
        container.scrollLeft += delta;
      };
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      container.removeEventListener("scroll", updateProgress);
      if (handleWheel) container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        role="group"
        aria-label={ariaLabel}
        tabIndex={0}
        className="w-full overflow-x-auto focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-journey-accent"
      >
        {children}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-journey-line">
        <div
          className="h-full bg-journey-accent transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
