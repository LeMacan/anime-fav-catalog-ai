import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/layout/providers";
import { Nav } from "@/components/layout/nav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "AniCatalog — Your Anime Favorites",
  description:
    "Discover, collect, and organize your favorite anime in a beautiful catalog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <Nav />
          <main className="mx-auto min-h-screen max-w-7xl px-4 pb-20 pt-6 md:px-6 md:pb-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
