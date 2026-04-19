import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Script from 'next/script';
import "@/styles/globals.css";
import { PageTransition } from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/sections/Footer";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL('https://greenhire.io'),
  title: {
    default: 'GreenHire — Climate Tech Jobs',
    template: '%s | GreenHire',
  },
  description:
    'The premium job board for climate tech champions. Connect with the most innovative clean energy, sustainability, and green tech companies building the future.',
  keywords: [
    'climate tech jobs',
    'clean energy careers',
    'sustainability jobs',
    'green tech hiring',
    'environmental jobs',
    'net zero careers',
    'solar jobs',
    'battery engineer jobs',
  ],
  authors: [{ name: 'GreenHire', url: 'https://greenhire.io' }],
  creator: 'GreenHire',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://greenhire.io',
    siteName: 'GreenHire',
    title: 'GreenHire — Climate Tech Jobs',
    description:
      'The premium job board for climate tech champions. Connect with the most innovative clean energy and sustainability companies.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GreenHire — Climate Tech Jobs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GreenHire — Climate Tech Jobs',
    description:
      'The premium job board for climate tech champions. Browse roles at top clean energy and sustainability companies.',
    images: ['/og-image.png'],
    creator: '@greenhire',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <head>
        {/* Preconnect to GA domains for faster loading */}
        {GA_ID && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://www.google-analytics.com" />
          </>
        )}
      </head>
      <body className="bg-bg-base text-text-primary font-body relative selection:bg-accent-primary/30">

        {/* Google Analytics 4 */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Global Atmosphere Background */}
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute inset-0 bg-mesh-1" />
          <div className="absolute inset-0 bg-mesh-2" />
          <div className="absolute inset-0 bg-mesh-3" />
          <div className="absolute inset-0 bg-grid line-mask" />
          <div className="absolute inset-0 bg-noise" />
        </div>

        {/* SVG Filter for noise texture */}
        <svg className="hidden" aria-hidden="true">
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
