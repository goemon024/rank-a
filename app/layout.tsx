import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense } from "react";
import RouteLoadingHandler from "@/app/components/LoadingModal/RouteLoadingHandler";
import LoadingModal from "@/app/components/LoadingModal/LoadingModal";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "プログラミング質問掲示板",
  description: "プログラミングの質問と回答を共有するプラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <Suspense fallback={<LoadingModal />}>
          <RouteLoadingHandler />
        </Suspense>

        <Suspense fallback={<LoadingModal />}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
