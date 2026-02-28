import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { KioskProvider } from "@/lib/kiosk-context";
import KioskModeController from "@/components/kiosk/kiosk-mode-controller";
import NotificationCloud from "@/components/kiosk/notification-cloud"; // 🔔 ADDED

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SUVIDHA 4.0 Kiosk",
  description:
    "Government Smart Service Platform - Digital Bill Payments, Citizen Services",
  generator: "v0.app",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <KioskProvider>
          {/* 🔔 GLOBAL NOTIFICATION SYSTEM */}
          <NotificationCloud />

          <KioskModeController
            enableKioskMode={true}
            autoFullscreen={true}
            inactivityTimeout={60000}
            warningThreshold={10000}
          >
            {children}
          </KioskModeController>
        </KioskProvider>

        <Analytics />
      </body>
    </html>
  );
}