"use client";

import KioskLayout from "@/components/kiosk/kiosk-layout";
import { useRouter } from "next/navigation";

export default function Electricity() {
    const router = useRouter();

    const services = [
        {
            title: "Fetch & Pay Bill",
            description:
                "View your latest electricity bill and make secure payment.",
            path: "/electricity/pay",
        },
        {
            title: "Apply for New Connection",
            description: "Submit application for a new electricity connection.",
            path: "/electricity/apply",
        },
        {
            title: "Lodge Grievance",
            description:
                "Report power outage, billing issues, or other complaints.",
            path: "/electricity/grievance",
        },

        {
            title: "Check Service Status",
            description:
                "Track the status of your applications and complaints.",
            path: "/electricity/status",
        },
    ];

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Electricity Services
            </h1>

            <p className="text-gray-700 text-lg mb-8">
                Select a service below to continue.
            </p>

            <div className="space-y-5">
                {services.map((service, index) => (
                    <button
                        key={index}
                        onClick={() => router.push(service.path)}
                        className="
                w-full 
                text-left 
                p-6 
                rounded-xl 
                border 
                border-gray-300 
                bg-white 
                shadow-sm 
                transition
                hover:bg-blue-50 
                hover:border-blue-600
                focus:outline-none
                focus:ring-4
                focus:ring-blue-600
                focus:ring-offset-2
                accessible-btn
              "
                    >
                        <h3 className="text-xl font-semibold text-gray-900">
                            {service.title}
                        </h3>
                        <p className="text-gray-700 mt-2 text-base">
                            {service.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
