import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ViewportSwitcher } from "@/components/viewport-switcher";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TCC",
    template: "%s · TCC",
  },
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        {children}
        <ViewportSwitcher />
      </body>
    </html>
  );
}
