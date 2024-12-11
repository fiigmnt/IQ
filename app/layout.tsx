import type { Metadata } from "next";
import "./globals.css";

import Info from "@/components/Info";

export const metadata: Metadata = {
  title: "IQ CHECK",
  description: "Check your IQ from X",
};

export const viewport = {
  initialScale: 0.8,
  width: "device-width",
  viewportFit: "cover",
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
