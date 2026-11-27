"use client";

import { usePaperBreeze } from "@/hooks/use-paper-breeze";
import type { LandingNote } from "@/lib/data/landing";
import { DottedArrow } from "./dotted-arrow";
import { noteRowClass, PinnedNote } from "./pinned-note";

type SequenceNotesProps = {
  notes: LandingNote[];
};

/**
 * Fileira de post-its que conta uma sequência: setas pontilhadas ligam um
 * papel ao próximo. Quando o mouse cruza a fileira, os papéis balançam em
 * volta do pino, como se passasse um vento.
 */
export function SequenceNotes({ notes }: SequenceNotesProps) {
  const { containerRef, noteRef, handlers } = usePaperBreeze<HTMLOListElement>();

  return (
    <ol ref={containerRef} {...handlers} className={noteRowClass}>
      {notes.map((note, index) => (
        <PinnedNote key={note.title} note={note} index={index} paperRef={noteRef(index)}>
          {index < notes.length - 1 ? (
            <>
              <DottedArrow className="top-1/2 left-full hidden w-10 -translate-y-1/2 lg:block" />
              <DottedArrow className="top-[calc(100%+2rem)] left-1/2 w-10 -translate-x-1/2 -translate-y-1/2 rotate-90 lg:hidden" />
            </>
          ) : null}
        </PinnedNote>
      ))}
    </ol>
  );
}
