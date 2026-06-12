import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from 'next/font/google'
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: "CloudDb - Free PostgreSQL in seconds",
  description: "Instantly provision a free PostgreSQL database. 24-hour TTL, isolated container, insstant connection string. Self-hosted on Raspberry Pi 5.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="antialiased bg-gray-950 text-white min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
