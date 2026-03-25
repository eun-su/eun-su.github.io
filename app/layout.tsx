import type { Metadata } from "next";
import "./globals.css";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "EUNSU Portfolio",
  description: "Portfolio site by EUNSU",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body data-initial-loading="true">
        <PageTransition />

        <div
          id="app-shell"
          style={{
            visibility: "hidden",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}