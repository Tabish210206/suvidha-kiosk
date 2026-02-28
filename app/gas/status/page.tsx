"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GasStatus() {
  const router = useRouter();

  const [referenceId, setReferenceId] = useState("");
  const [statusResult, setStatusResult] = useState<null | {
    status: string;
    message: string;
  }>(null);

  const handleCheckStatus = () => {
    // Demo Logic (Hackathon Mode)
    if (!referenceId) {
      alert("Please enter Application / Complaint ID");
      return;
    }

    // Fake demo statuses
    const demoStatuses = [
      {
        status: "Under Review",
        message: "Your request is currently being processed.",
      },
      {
        status: "Approved",
        message: "Your gas connection request has been approved.",
      },
      {
        status: "Resolved",
        message: "Your grievance has been successfully resolved.",
      },
    ];

    const randomStatus =
      demoStatuses[Math.floor(Math.random() * demoStatuses.length)];

    setStatusResult(randomStatus);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">

      {/* Header */}
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        Check Gas Service Status
      </h1>

      <p className="text-gray-700 text-lg mb-8">
        Track your gas connection application or grievance status.
      </p>

      {/* Status Card */}
      <div className="border border-gray-300 rounded-xl p-8 bg-white shadow-sm">

        <label className="block font-medium mb-2">
          Application / Complaint ID
        </label>

        <input
          type="text"
          value={referenceId}
          onChange={(e) => setReferenceId(e.target.value)}
          placeholder="Enter Reference ID (e.g., GAS12345)"
          className="w-full border border-gray-400 p-4 rounded-lg mb-6 focus:ring-4 focus:ring-blue-600 focus:outline-none"
        />

        <button
          onClick={handleCheckStatus}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
        >
          Check Status
        </button>

        <button
          onClick={() => router.push("/gas")}
          className="w-full text-gray-600 underline mt-4"
        >
          Cancel
        </button>

        {/* Status Result */}
        {statusResult && (
          <div className="mt-8 p-6 rounded-lg border border-blue-300 bg-blue-50">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Status: {statusResult.status}
            </h3>
            <p className="text-gray-700">
              {statusResult.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}