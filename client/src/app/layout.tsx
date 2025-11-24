import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import '@fortawesome/fontawesome-svg-core/styles.css';
import Script from "next/script";
import { config } from '@fortawesome/fontawesome-svg-core';
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
  title: "FLEX OUTDOOR",
  description: "動画で魅力を伝える！アウトドア専門フリマ「FLEX OUTDOOR」。新品からヴィンテージ品まで、あらゆる自慢のギアを動画で紹介＆販売！動画だから、商品の状態や使い方も一目瞭然。自慢のギアで、アウトドア好き同士がつながる、新しい売買体験を！",
  applicationName: "FLEX OUTDOOR",
  generator: "Next.js",
  keywords: ['アウトドア', 'フリマ', '動画投稿', '動画配信', 'ネットショップ', 'ギア販売', 'キャンプ', '登山', 'ハイキング', 'ウェア', 'アウトドア用品', 'バーベキュー', 'ノースフェイス', 'コールマン'],
  openGraph: {
    type: 'website',
    siteName: 'FLEX OUTDOOR',
    locale: 'ja_JP'
  },
  robots: {
    index: false,
    follow: false
  },
  themeColor: "#368606",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive"></Script>
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
};
