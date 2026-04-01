import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";
import Navbar from "../components/Navbar";
import { Brand } from "@/components/Navbar/Brand";
import { NavbarActions } from "@/components/Navbar/NavbarActions";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JOK Ecommerce",
  description: "JOK Ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/30 min-h-screen flex flex-col`}
      >
        <Providers>
          <header className="sticky top-0 z-50 w-full transition-all duration-300">
            <div className="mx-auto px-4 py-3 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
              <Navbar
                leftContent={<Brand />}
                rightContent={<NavbarActions />}
              />
            </div>
          </header>
          <main className="flex-grow mx-auto w-full px-4 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl py-8">
            <PageTransition>{children}</PageTransition>
          </main>
          <footer className="w-full mt-auto">
            <div className="mx-auto px-4 pb-8 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
              <Footer />
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
