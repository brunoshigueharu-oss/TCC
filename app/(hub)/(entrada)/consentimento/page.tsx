import type { Metadata } from "next";

import { SurfaceCard } from "@/components/surface-card";
import { BrandHeader } from "../_components/brand-header";
import { ConsentForm } from "./_components/consent-form";
import { getConsentData } from "./_data-access/get-consent";

export const metadata: Metadata = { title: "Seus dados" };

/**
 * Consentimento (Figma: "Consentimento"). A pessoa escolhe o que compartilhar
 * e segue para o nivelamento.
 */
export default async function ConsentPage() {
  const { items, termsSummary } = await getConsentData();

  return (
    <>
      <BrandHeader />
      <main className="flex flex-1 flex-col gap-5 pt-2 pb-6 lg:flex-none lg:gap-6 lg:px-6 lg:pt-0 lg:pb-0">
        <SurfaceCard className="flex flex-col gap-1 p-4 lg:gap-1.5 lg:p-6">
          <h1 className="font-display text-[22px] leading-tight font-bold lg:text-[28px]">Seus dados</h1>
          <p className="text-sm text-texto-secundario">
            Você escolhe o que compartilhar. Tudo pode ser alterado depois nas configurações da
            conta.
          </p>
        </SurfaceCard>

        <ConsentForm items={items} termsSummary={termsSummary} />
      </main>
    </>
  );
}
