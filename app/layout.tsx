import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abdul Samad Babillail | IT Infrastructure & Technology",
  description: "Professional portfolio covering enterprise IT operations, Microsoft 365, Apple and Windows device management, classroom technology, and practical automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}