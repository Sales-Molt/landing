import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// JSON-LD Structured Data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://salesmolt.com/#organization",
      "name": "SalesMolt",
      "url": "https://salesmolt.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://salesmolt.com/images/logo.png",
        "width": 512,
        "height": 512
      },
      "description": "SalesMolt is an autonomous AI that sells for you 24/7. No scripts. No templates. Just results.",
      "sameAs": []
    },
    {
      "@type": "WebSite",
      "@id": "https://salesmolt.com/#website",
      "url": "https://salesmolt.com",
      "name": "SalesMolt",
      "publisher": { "@id": "https://salesmolt.com/#organization" }
    },
    {
      "@type": "Product",
      "@id": "https://salesmolt.com/#product",
      "name": "SalesMolt AI Sales Rep",
      "description": "An autonomous AI assistant that handles sales outreach, lead qualification, and deal closing 24/7 across email, WhatsApp, LinkedIn, SMS, and more.",
      "brand": { "@id": "https://salesmolt.com/#organization" },
      "offers": {
        "@type": "Offer",
        "price": "49",
        "priceCurrency": "USD",
        "priceValidUntil": "2026-12-31",
        "availability": "https://schema.org/PreOrder",
        "url": "https://salesmolt.com"
      },
      "image": "https://salesmolt.com/images/hero-banner.png"
    },
    {
      "@type": "SoftwareApplication",
      "name": "SalesMolt",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "49",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "5",
        "ratingCount": "1",
        "bestRating": "5",
        "worstRating": "1"
      }
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL("https://salesmolt.com"),
  title: {
    default: "SalesMolt — Your AI Sales Rep",
    template: "%s | SalesMolt"
  },
  description: "SalesMolt is an autonomous AI that sells for you 24/7. No scripts. No templates. Just results. Join the waitlist for $49.",
  keywords: ["AI sales", "sales automation", "AI SDR", "sales rep AI", "autonomous sales", "AI sales assistant", "automated outreach", "lead generation AI", "sales bot", "AI closer"],
  authors: [{ name: "SalesMolt" }],
  creator: "SalesMolt",
  publisher: "SalesMolt",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/images/logo.png",
    shortcut: "/favicon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "SalesMolt — Your AI Sales Rep",
    description: "SalesMolt is an autonomous AI that sells for you 24/7. No scripts. No templates. Just results.",
    type: "website",
    url: "https://salesmolt.com",
    siteName: "SalesMolt",
    locale: "en_US",
    images: [
      {
        url: "/images/hero-banner.png",
        width: 1792,
        height: 1024,
        alt: "SalesMolt - AI Sales Rep",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SalesMolt — Your AI Sales Rep",
    description: "SalesMolt is an autonomous AI that sells for you 24/7. No scripts. No templates. Just results.",
    images: ["/images/hero-banner.png"],
    creator: "@salesmolt",
  },
  alternates: {
    canonical: "https://salesmolt.com",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
