import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "VnComply Dashboard",
  description: "Privacy Compliance and Web Security Assessment Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${inter.variable} ${manrope.variable} bg-background text-on-background min-h-screen antialiased overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
