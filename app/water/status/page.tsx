"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";

export default function WaterStatus() {
  const { speak, showNotification } = useKiosk();

  const [referenceNumber, setReferenceNumber] = useState("");
  const [statusChecked, setStatusChecked] = useState(false);
  const [statusData, setStatusData] = useState<any>(null);

  const handleCheckStatus = () => {
    if (!referenceNumber.trim()) return;

    const statuses = [
      "Under Review",
      "Inspection Scheduled",
      "Approved",
      "In Progress",
      "Completed",
    ];

    const randomStatus =
      statuses[Math.floor(Math.random() * statuses.length)];

    const today = new Date();
    const resolutionDate = new Date(
      today.setDate(today.getDate() + 2 + Math.floor(Math.random() * 4))
    );

    const generatedData = {
      status: randomStatus,
      department: "Water Supply Department",
      lastUpdated: new Date().toLocaleDateString(),
      resolutionDate: resolutionDate.toLocaleDateString(),
    };

    setStatusData(generatedData);
    setStatusChecked(true);

    speak(`Water application status is ${randomStatus}`);

    // 🔔 Global Notification
    showNotification(
      `Water service status checked. Current status: ${randomStatus}`
    );
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        Check Water Service Status
      </h1>

      <p className="text-gray-700 text-lg mb-8">
        Enter your application or complaint reference number.
      </p>

      {!statusChecked && (
        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
          <label className="block text-lg font-medium text-gray-900 mb-3">
            Reference Number
          </label>

          <input
            type="text"
            value={referenceNumber}
            onChange={(e) =>
              setReferenceNumber(e.target.value.toUpperCase())
            }
            className="w-full p-4 border border-gray-400 rounded-lg text-lg focus:outline-none focus:ring-4 focus:ring-blue-600"
            placeholder="Enter Water Reference ID"
          />

          <button
            onClick={handleCheckStatus}
            className="mt-6 w-full bg-blue-800 text-white text-lg font-semibold p-4 rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-offset-2"
          >
            Check Status
          </button>
        </div>
      )}

      {statusChecked && statusData && (
        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Water Service Status
          </h2>

          <p className="text-gray-700">
            <strong>Reference:</strong> {referenceNumber}
          </p>

          <p className="text-gray-700">
            <strong>Department:</strong> {statusData.department}
          </p>

          <div className="p-4 bg-blue-100 border border-blue-400 rounded-lg">
            <p className="text-blue-900 font-medium">
              Status: {statusData.status}
            </p>
          </div>

          <p className="text-gray-700">
            <strong>Last Updated:</strong> {statusData.lastUpdated}
          </p>

          <p className="text-gray-700">
            <strong>Expected Resolution:</strong>{" "}
            {statusData.resolutionDate}
          </p>

          {/* Notification Info */}
          <div className="bg-green-100 border border-green-500 p-4 rounded-lg">
            <p className="font-semibold text-green-800 mb-2">
              Notification Sent Successfully
            </p>
            <ul className="list-disc pl-5 text-green-900 text-sm space-y-1">
              <li>Status update sent via WhatsApp</li>
              <li>SMS notification delivered</li>
              <li>Email update sent</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setStatusChecked(false);
              setReferenceNumber("");
            }}
            className="mt-4 w-full bg-gray-200 text-gray-900 font-semibold p-4 rounded-lg hover:bg-gray-300"
          >
            Check Another Status
          </button>
        </div>
      )}
    </div>
  );
}