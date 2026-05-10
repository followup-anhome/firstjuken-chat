import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ファースト住建 現場チャット",
  description: "ファースト住建 3言語AI自動翻訳チャット by フォローアップ株式会社",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
