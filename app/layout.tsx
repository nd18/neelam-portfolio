import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neelam Malaviya — Shopify & WordPress Developer",
  description:
    "Portfolio of Neelam Malaviya — senior Shopify & WordPress developer building high-converting e-commerce stores and custom CMS solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <head>
        {/* always start at the top (hero) on reload — never restore scroll */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history){history.scrollRestoration='manual';}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
