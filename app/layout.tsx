import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abdul Samad Babillail | Business & Technology Leadership",
  metadataBase: new URL("https://my-samad-portfolio.vercel.app"),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { title: "Abdul Samad Babillail | Business & Technology Leadership", description: "Business operations, technology strategy, digital transformation and practical innovation.", url: "/", siteName: "Abdul Samad Babillail", type: "website" },
  description: "Business operations, technology strategy, leadership, digital transformation and practical innovation.",
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