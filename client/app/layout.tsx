import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers/provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Red_Hat_Text } from "next/font/google";
import { RoleProvider } from "./_contexts/roleContext";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const redHatText = Red_Hat_Text({
  variable: "--font-red-hat-text",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StoryBoard",
  description: "Bring your ideas to life and share them with the world!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${redHatText.variable} antialiased bg-grid`}
      >
        <RoleProvider>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            </Providers>
          <Toaster />
        </RoleProvider>
      </body>
    </html>
  );
}
