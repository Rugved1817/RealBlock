import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RealBlock - Real Estate Token Investment",
  description: "Invest in tokenized real estate with blockchain technology",
};

import Navbar from "@/components/Navbar";
import AIAssistantWidget from "@/components/AIAssistantWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <AIAssistantWidget />
        {children}
      </body>
    </html>
  );
}
