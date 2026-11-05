import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";

import { ViewportSwitcher } from "@/components/viewport-switcher";
import { hubFontClasses } from "@/lib/fonts";

import "./globals.css";

/** Só para trechos de código; o texto do site usa Figtree e Instrument Sans. */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    >
      <body>
        {children}
        <ViewportSwitcher />
      </body>
    </html>
  );
}
