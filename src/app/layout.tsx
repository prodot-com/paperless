import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paperless",
  description: "your personal vault",
  icons: {
    icon: [
      {url: "/logo.svg", type: "image/svg+xml"}
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          <Providers>
            {children}
            <Analytics/>
            <Toaster/>
          </Providers>
        </ThemeProvider>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="b3be62b3-ee13-4c49-a27f-bc8412337d24"></script>
      </body>
    </html>
  );
}
