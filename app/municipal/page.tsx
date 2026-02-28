"use client";

import { useRouter } from "next/navigation";

export default function Municipal() {
    const router = useRouter();

    const services = [
        {
            title: "Pay Municipal Tax",
            description:
                "Pay your water tax, property tax and other municipal charges.",
            path: "/municipal/pay",
        },
        {
            title: "Apply for Certificates",
            description:
                "Apply for birth, death, or other municipal certificates.",
            path: "/municipal/apply",
        },
        {
            title: "Lodge Grievance",
            description:
                "Report waste management, drainage, or civic issues.",
            path: "/municipal/grievance",
        },
        {
            title: "Check Service Status",
            description:
                "Track the status of your tax payments and certificate applications.",
            path: "/municipal/status",
        },
    ];

    return (
        <div className="p-12 max-w-5xl mx-auto">

            {/* HEADER */}
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Municipal Services
            </h1>

            <p className="text-gray-700 text-lg mb-10">
                Select a service below to continue.
            </p>

            {/* SERVICE LIST */}
            <div className="space-y-6">
                {services.map((service, index) => (
                    <button
                        key={index}
                        onClick={() => router.push(service.path)}
                        className="
                            w-full 
                            text-left 
                            p-8 
                            rounded-2xl 
                            border 
                            border-gray-300 
                            bg-white 
                            shadow-sm 
                            transition
                            hover:bg-blue-50 
                            hover:border-blue-700
                            hover:shadow-md
                            focus:outline-none
                            focus:ring-4
                            focus:ring-blue-600
                            focus:ring-offset-2
                        "
                    >
                        <h3 className="text-2xl font-semibold text-gray-900">
                            {service.title}
                        </h3>

                        <p className="text-gray-700 mt-3 text-base leading-relaxed">
                            {service.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}