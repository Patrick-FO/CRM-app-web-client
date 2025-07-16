import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'reflect-metadata';
import { setupRepositories } from "@/lib/di/repositories";
import { setupUseCases } from "@/lib/di/usecases";
import { DIProvider } from "@/lib/di/DIProvider";

console.log('Setting up repositories...');
setupRepositories();
console.log('Setting up use cases...');
setupUseCases();
console.log('DI setup complete...');

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRM Web Client",
  description: "CRM application for managing people and notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DIProvider>
          {children}
        </DIProvider>
      </body>
    </html>
  );
}
