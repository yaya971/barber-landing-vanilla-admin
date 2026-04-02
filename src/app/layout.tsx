import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "O Barbeiro Lisboeta | Premium Barber Shop",
  description: "Experience premium grooming at O Barbeiro Lisboeta in Lisbon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} bg-[#0f1012] text-[#e2e4e9] antialiased`}>
        {children}
      </body>
    </html>
  );
}
