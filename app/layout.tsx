import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "코메론 만찬회 100주년 초대장",
  description: "코메론 만찬회 창립 100주년 기념 만찬 참석 신청",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
