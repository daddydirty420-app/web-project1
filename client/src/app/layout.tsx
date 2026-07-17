/* eslint-disable @next/next/no-page-custom-font */
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE } from "../config/site";
import "../styles/globals.css";
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
    title: SITE.appName,
    description: "テストテストテスト",
    applicationName: SITE.appName,
    generator: "Next.js",
    keywords: ["テスト"],
    openGraph: {
        type: "website",
        siteName: SITE.appName,
        locale: "ja_JP",
    },
    robots: {
        index: false,
        follow: false,
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
                    href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}

                <GoogleAnalytics gaId="G-M08QFX47XZ" />

                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
