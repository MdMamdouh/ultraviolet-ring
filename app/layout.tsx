import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BlogProvider } from '@/contexts/BlogContext';
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jahez | Your Next Job Starts Here",
  description: "Connecting Egyptian talent with the best opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Providers>
          <BlogProvider>
            {children}
          </BlogProvider>
        </Providers>
      </body>
    </html>
  );
}
