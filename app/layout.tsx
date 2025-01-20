import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import "react-toastify/dist/ReactToastify.css"; // Import des styles par défaut de react-toastify
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Randomaize",
  description: "Create a playback queue based on your prompt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-spotify-black text-white h-[100dvh] w-full m-0 p-0 max-w-[500px] mx-auto ${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          <main className="w-full h-[100dvh]">
            {children}
            <Toaster />
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
