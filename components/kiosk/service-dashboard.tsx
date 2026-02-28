"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/kiosk-context";
import VoiceControl from "./voice-control";
import {
  Mic,
  Zap,
  Droplets,
  Flame,
  Building2,
  AlertTriangle,
} from "lucide-react";

export default function ServiceDashboard() {
  const router = useRouter();
  const { speak, accessibilityMode } = useKiosk();

  const services = [
    { label: "Electricity", icon: Zap, path: "/electricity" },
    { label: "Water", icon: Droplets, path: "/water" },
    { label: "Gas", icon: Flame, path: "/gas" },
    { label: "Municipal", icon: Building2, path: "/municipal" },
    { label: "Grievance", icon: AlertTriangle, path: "/electricity/grievance" },
  ];

  const handleNavigate = (service: any) => {
    speak(`Opening ${service.label}`);
    router.push(service.path);
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ================= HEADER ================= */}
      <div className="bg-blue-900 text-white py-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-10 flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-wide">
            Smart Utility Kiosk
          </h1>

          <div className="flex items-center gap-3 text-lg font-medium">
            <Mic className="w-5 h-5" />
            Voice Enabled
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-10 py-16 flex gap-12">

        {/* LEFT: SERVICE SECTION */}
        <div className="flex-1">

          <h2 className="text-2xl font-bold text-blue-900 mb-8">
            Select a Service
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">

            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <button
                  key={index}
                  onClick={() => handleNavigate(service)}
                  className="
                    bg-white
                    border-2 border-blue-900
                    text-blue-900
                    h-40
                    rounded-xl
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-4
                    text-xl
                    font-semibold
                    shadow-md
                    transition
                    hover:bg-blue-900
                    hover:text-white
                    focus:outline-none
                    focus:ring-4
                    focus:ring-yellow-400
                  "
                >
                  <Icon className="w-10 h-10" />
                  {service.label}
                </button>
              );
            })}

          </div>
        </div>

        {/* RIGHT: VOICE PANEL */}
        <div className="w-[380px] bg-white border-2 border-blue-900 rounded-xl shadow-lg p-8 flex flex-col">

          <h3 className="text-xl font-bold text-blue-900 mb-4">
            Voice Assistant
          </h3>

          <p className="text-gray-600 mb-6 text-sm">
            Speak your request clearly. Example:
          </p>

          <ul className="text-sm text-gray-700 mb-6 space-y-2">
            <li>• Pay my electricity bill</li>
            <li>• Open water service</li>
            <li>• Register a grievance</li>
          </ul>

          {accessibilityMode !== "standard" && (
            <VoiceControl
              onCommand={(intent) => {
                if (intent === "pay_bill") {
                  router.push("/electricity/pay");
                }
              }}
              isActive={true}
            />
          )}

        </div>

      </div>
    </div>
  );
}