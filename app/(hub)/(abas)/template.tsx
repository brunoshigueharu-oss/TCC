import { PageTransition } from "@/components/page-transition";

/** Remonta a cada troca de tela para a transição de entrada/saída. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
