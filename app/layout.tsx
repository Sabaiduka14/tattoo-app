import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Input } from "@/components/ui/input";

const inter = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tattoo Gallery",
  description: "A Pinterest-like gallery for tattoos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
