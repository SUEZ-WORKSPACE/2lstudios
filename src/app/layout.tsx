import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "2L Studio | Comunicação, marketing e produção audiovisual",
  description:
    "Agência de comunicação, marketing e produção audiovisual: estratégia, branding, design, fotografia, vídeo, redes sociais e publicidade.",
  openGraph: {
    title: "2L Studio",
    description: "Quem não é visto, não é lembrado. Agência de comunicação, marketing e produção audiovisual.",
    type: "website",
    locale: "pt_PT",
  },
};

export const viewport: Viewport = { themeColor: "#231f20" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${display.variable} ${mono.variable}`}>
      <body>
        <noscript>
          <style>{`.in,.cursor,.vf,.vf-dot{display:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
