import type { Metadata } from "next";
import "./globals.css";


import Info from "@/components/Info";

// TODO: update metadata
export const metadata: Metadata = {
  title: "IQ",
  description: "IQ twitter generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Info />
        {children}
      </body>
    </html>
  );
}
