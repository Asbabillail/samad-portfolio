import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAMAD-OS v3.0 | Portfolio",
  description: "Personal Command Center & Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}