import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import SessionProvider from "@/components/SessionProvider";
import AppShell from "@/components/AppShell";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CupsLog — CS2 Tournament Platform",
  description: "Manage CS2 LAN tournaments with live scores and MatchZy integration",
};

export const viewport: Viewport = {
  themeColor: "#030712",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${geist.variable} h-full antialiased`}>
      <body className="bg-canvas text-prose">
        <SessionProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg"
          >
            Перейти к содержимому
          </a>
          <AppShell>{children}</AppShell>
          <Toaster richColors theme="dark" position="bottom-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
