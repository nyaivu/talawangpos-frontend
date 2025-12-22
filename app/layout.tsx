import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TalawangPOS – Modern Point of Sale for Restaurants & Cafés",
    template: "%s | TalawangPOS",
  },

  description:
    "TalawangPOS is a modern, fast, and secure point of sale system designed for restaurants and cafés. Manage sales, staff, and reports easily in one platform.",

  keywords: [
  "POS system",
  "point of sale",
  "point of sale system",
  "POS restoran",
  "POS cafe",
  "aplikasi kasir",
  "kasir digital",
  "software kasir",
  "restaurant POS",
  "cafe POS",
  "cloud POS",
  "POS Indonesia",
  "aplikasi POS",
  "POS online",
  "sistem kasir restoran",
],


  openGraph: {
    title: "TalawangPOS – Modern Point of Sale System",
    description:
      "A fast, secure, and flexible POS platform for restaurants & cafés.",
    url: "https://talawangpos.com",
    siteName: "TalawangPOS",
    images: [
      {
        url: "/hero-pos.jpg",
        width: 1200,
        height: 630,
        alt: "TalawangPOS – Point of Sale System",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "TalawangPOS – Modern Point of Sale",
    description:
      "Modern POS system for restaurants & cafés. Secure, flexible, and fast.",
    images: ["/hero-pos.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lexend.variable} text-foreground`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
