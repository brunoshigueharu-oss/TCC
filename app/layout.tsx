import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";

import { NavigationProgress } from "@/components/navigation-progress";
import { navInitScript } from "@/components/side-nav-init";
import { themeInitScript } from "@/components/theme-init";
import { ThemeRouteSync } from "@/components/theme-route-sync";
import { Toaster } from "@/components/ui/toast";
import { ViewportSwitcher } from "@/components/viewport-switcher";
import { hubFontClasses } from "@/lib/fonts";

import "./globals.css";

/**
 * Só para o efeito ASCII da landing (canvas, `lib/ascii-engine.ts`). Não usar
 * em texto: o site usa Instrument Sans e Figtree, como no brandbook.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const isDevelopment = process.env.NODE_ENV === "development";

export const metadata: Metadata = {
  title: {
    default: "BASE8",
    template: "%s · BASE8",
  },
  description: "Hub para designers aprenderem a usar IA de código.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${hubFontClasses} ${geistMono.variable} antialiased`}
      // A classe `dark` é aplicada pelo script abaixo, antes da hidratação.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `${themeInitScript};${navInitScript}` }} />
      </head>
      <body>
        <NavigationProgress />
        <ThemeRouteSync />
        {children}
        <Toaster />
        {/* Ferramenta de protótipo: só no `next dev`, nunca no site publicado. */}
        {isDevelopment && <ViewportSwitcher />}
      </body>
    </html>
  );
}
