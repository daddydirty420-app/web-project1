/* eslint-disable @next/next/no-page-custom-font */
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
config.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "テスト用サイト（仮）",
  description: "テストテストテスト",
  applicationName: "テスト用サイト（仮）",
  generator: "Next.js",
  keywords: ["テスト"],
  openGraph: {
    type: 'website',
    siteName: 'テスト用サイト（仮）',
    locale: 'ja_JP'
  },
  robots: {
    index: false,
    follow: false
  },
  themeColor: "rgba(107, 114, 128, 0.96)",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap"
        rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        <GoogleAnalytics gaId="G-M08QFX47XZ" />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};
