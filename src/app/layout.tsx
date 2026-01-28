import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SalesMolt — Your AI Sales Rep",
  description: "SalesMolt is an autonomous AI that sells for you 24/7. No scripts. No templates. Just results. Join the waitlist for $49.",
  keywords: ["AI sales", "sales automation", "AI SDR", "sales rep AI", "autonomous sales"],
  openGraph: {
    title: "SalesMolt — Your AI Sales Rep",
    description: "SalesMolt is an autonomous AI that sells for you 24/7. No scripts. No templates. Just results.",
    type: "website",
    url: "https://salesmolt.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "SalesMolt — Your AI Sales Rep",
    description: "SalesMolt is an autonomous AI that sells for you 24/7. No scripts. No templates. Just results.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
