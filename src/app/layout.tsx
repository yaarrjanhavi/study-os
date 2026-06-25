import type { Metadata } from "next";
import { Averia_Serif_Libre, Geist_Mono } from "next/font/google";
import "./globals.css";

const averiaSerif = Averia_Serif_Libre({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-averia-serif",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "StudyOS — Calm, AI-Powered Study Space",
  description: "Eliminate distractions and study beautifully with StudyOS. Take notes, watch lectures, organize tasks, and query AI, all in one peaceful workspace.",
  keywords: ["study", "notes", "pomodoro", "knowledge graph", "ai study assistant", "distraction free youtube"],
  authors: [{ name: "StudyOS Team" }],
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${averiaSerif.variable} ${geistMono.variable} font-mono antialiased h-full min-h-screen bg-shell`}
      >
        {children}
      </body>
    </html>
  );
}
