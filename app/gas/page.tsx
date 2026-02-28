"use client";

import { useRouter } from "next/navigation";

export default function Gas() {
  const router = useRouter();

  const services = [
    {
      title: "Fetch & Pay Bill",
      description:
        "View your latest gas bill and make secure payment.",
      path: "/gas/pay",
    },
    {
      title: "Apply for New Connection",
      description:
        "Submit application for a new gas connection.",
      path: "/gas/apply",
    },
    {
      title: "Lodge Grievance",
      description:
        "Report supply issues, billing errors, or other complaints.",
      path: "/gas/grievance",
    },
    {
      title: "Check Service Status",
      description:
        "Track the status of your applications and complaints.",
      path: "/gas/status",
    },
  ];

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Gas Services
      </h1>

      <p className="text-lg text-gray-700 mb-10">
        Select a service below to continue.
      </p>

      <div className="space-y-8">
        {services.map((service, index) => (
          <div
            key={index}
            onClick={() => router.push(service.path)}
            className="cursor-pointer bg-white border border-gray-300 rounded-2xl p-8 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-2xl font-semibold mb-3">
              {service.title}
            </h2>

            <p className="text-gray-700 text-lg">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
