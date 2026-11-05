import type { LandingData } from "@/lib/data/landing";
import { BrowserFrame } from "./browser-frame";
import { ShowcaseStrip, type ShowcaseStripItem } from "./showcase-strip";

type ShowcaseCanvasProps = {
  showcase: LandingData["showcase"];
};

/**
 * Vitrine "o que dá pra criar": um canvas estilo Figma com sites reais,
 * arrastável para o lado e sem fim. Os prints são montados aqui (no
 * servidor) e só a faixa que rola é client.
 */
export function ShowcaseCanvas({ showcase }: ShowcaseCanvasProps) {
  const items: ShowcaseStripItem[] = showcase.items.map((item) => ({
    id: item.id,
    caption: item.caption,
    url: item.url,
    content: <BrowserFrame url={item.url} image={item.image} imageAlt={item.imageAlt} />,
  }));
  const initialIndex = Math.max(
    0,
    showcase.items.findIndex((item) => item.id === showcase.initialId),
  );

  return (
    <section aria-labelledby="vitrine" className="px-2 sm:px-4 lg:px-6">
      <div className="overflow-hidden rounded-[28px] bg-superficie sm:rounded-[36px]">
        <ShowcaseStrip title={showcase.title} items={items} initialIndex={initialIndex} />
      </div>
    </section>
  );
}
