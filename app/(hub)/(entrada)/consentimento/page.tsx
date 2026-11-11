import type { Metadata } from "next";

import { BrandHeader } from "../_components/brand-header";
import { ConsentForm } from "./_components/consent-form";
import { getConsentData } from "./_data-access/get-consent";

export const metadata: Metadata = { title: "Seus dados" };

/** Consentimento: a pessoa escolhe o que compartilhar e segue para o nivelamento. */
export default async function ConsentPage() {
  const { items, termsSummary } = await getConsentData();

  return (
    <>
      <BrandHeader />
      <main className="flex flex-1 flex-col px-4 pt-6 pb-8 lg:flex-none lg:px-0 lg:pt-0 lg:pb-0">
        <ConsentForm items={items} termsSummary={termsSummary} />
      </main>
    </>
  );
}
