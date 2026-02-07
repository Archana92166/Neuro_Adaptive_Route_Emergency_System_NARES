"use client";

import "./globals.css";
import "./fonts.css";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* ✅ Load Google Maps ONCE for entire app */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />

        {/* ✅ Auth state available everywhere */}
        <AuthProvider>
          {children}
        </AuthProvider>

        <Toaster />
      </body>
    </html>
  );
}
