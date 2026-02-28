"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/kiosk-context";
import ServiceDashboard from "@/components/kiosk/service-dashboard";

export default function Dashboard() {
  const router = useRouter();
  const { isLoggedIn, language } = useKiosk();

  useEffect(() => {
    if (!language) {
      router.replace("/language");
      return;
    }

    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, language, router]);

  return <ServiceDashboard />;
}