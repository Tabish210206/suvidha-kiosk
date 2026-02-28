"use client";

import React from "react";
import Header from "./header";
import { useKiosk } from "@/lib/kiosk-context";

export default function KioskLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { accessibilityMode } = useKiosk();

    return (
        <div
            className={`min-h-screen bg-gradient-to-br from-background via-blue-50 to-background flex flex-col ${accessibilityMode === "blind" ? "text-lg" : ""}`}
        >
            <Header />
            <main className="flex-1 overflow-auto">{children}</main>
            <footer className="bg-primary text-primary-foreground py-3 px-6 text-center text-sm">
                <p>
                    SUVIDHA 4.0 Kiosk - Government Smart Service Platform |
                    Press ESC to return home
                </p>
            </footer>
        </div>
    );
}
