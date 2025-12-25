import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://archetypeorigindynamics.com"),
  title: "ARCHETYPE ORIGIN DYNAMICS | Intelligence. Distilled.",
  description: "Mobile Architecture & Software Engineering. Building the infrastructure for tomorrow's intelligence. Industrial sci-fi design meets cutting-edge technology.",
  keywords: ["software engineering", "mobile architecture", "AI", "machine learning", "Toronto", "technology company"],
  authors: [{ name: "ARCHETYPE ORIGIN DYNAMICS INC." }],
  creator: "ARCHETYPE ORIGIN DYNAMICS INC.",
  publisher: "ARCHETYPE ORIGIN DYNAMICS INC.",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://archetypeorigindynamics.com",
    siteName: "ARCHETYPE ORIGIN DYNAMICS",
    title: "ARCHETYPE ORIGIN DYNAMICS | Intelligence. Distilled.",
    description: "Mobile Architecture & Software Engineering. Building the infrastructure for tomorrow's intelligence.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ARCHETYPE ORIGIN DYNAMICS - Intelligence. Distilled.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARCHETYPE ORIGIN DYNAMICS",
    description: "Intelligence. Distilled. Mobile Architecture & Software Engineering.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${jetbrainsMono.variable} antialiased bg-void text-starlight`}
        suppressHydrationWarning
      >
        {/* Noise Texture Overlay */}
        <div className="noise-overlay" />

        {/* Main Content */}
        {children}
      </body>
    </html>
  );
}
