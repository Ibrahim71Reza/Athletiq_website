import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Athlytiq - AI-Powered Fitness Tracking",
  description:
    "Transform your fitness journey with AI-powered tracking, personalized nutrition, and a supportive community.",
  keywords: "fitness, workout tracking, AI nutrition, health monitoring, fitness community",
  authors: [{ name: "Athlytiq Team" }],
  openGraph: {
    title: "Athlytiq - AI-Powered Fitness Tracking",
    description:
      "Transform your fitness journey with AI-powered tracking, personalized nutrition, and a supportive community.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Athlytiq - AI-Powered Fitness Tracking",
    description:
      "Transform your fitness journey with AI-powered tracking, personalized nutrition, and a supportive community.",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Responsive favicons for light and dark mode */}
        <link
          rel="icon"
          href="/logo.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/logo.png"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
