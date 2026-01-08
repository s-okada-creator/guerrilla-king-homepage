import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ゲリラ王 メンバーシップ",
  description: "ゲリラ王メンバーシップ限定ポイント管理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

