"use client";
import React from "react";
import KioskLayout from "@/components/kiosk/kiosk-layout";

export default function NewLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <KioskLayout>{children}</KioskLayout>;
}
