import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "@/styles/globals.css";
import { PageTransition } from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "GreenHire | Climate Tech Jobs",
  description: "The premium job board destination for climate tech professionals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <body className="bg-bg-base text-text-primary font-body relative selection:bg-accent-primary/30">
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute inset-0 bg-mesh-1" />
          <div className="absolute inset-0 bg-mesh-2" />
          <div className="absolute inset-0 bg-mesh-3" />
          <div className="absolute inset-0 bg-grid line-mask" />
          <div className="absolute inset-0 bg-noise" />
        </div>

        {/* SVG Filter for noise */}
        <svg className="hidden">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
        </svg>

        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
