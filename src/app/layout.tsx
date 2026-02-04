import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import AppWalletProvider from "@/components/AppWalletProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GivePump - Trade Fees Auto-Donate to Charities",
  description: "Pump for Good. Trade memecoins and auto-donate fees to charities you vote on.",
  icons: {
    icon: "/de.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-noise" />
        <AppWalletProvider>
          {children}
          <Footer />
        </AppWalletProvider>
      </body>
    </html>
  );
}
