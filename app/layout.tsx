import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talawang - Point of Sale App",
  description: "A web-base point of sale app with fast and easy usage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lexend.variable} text-foreground`}>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
