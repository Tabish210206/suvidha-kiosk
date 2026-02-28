"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";

export default function ServiceStatus() {
  const { showNotification, speak } = useKiosk();

  const [referenceNumber, setReferenceNumber] = useState("");
  const [statusChecked, setStatusChecked] = useState(false);
  const [statusData, setStatusData] = useState<any>(null);

  const handleCheckStatus = () => {
    if (!referenceNumber.trim()) return;

    const statuses = [
      "Under Review",
      "Approved",
      "Rejected",
      "In Progress",
      "Completed",
    ];

    const departments = [
      "Electricity Department",
      "Water Supply Board",
      "Gas Authority",
      "Public Works Department",
    ];

    const randomStatus =
      statuses[Math.floor(Math.random() * statuses.length)];

    const randomDepartment =
      departments[Math.floor(Math.random() * departments.length)];

    const today = new Date();
    const resolutionDate = new Date(
      today.setDate(today.getDate() + 3 + Math.floor(Math.random() * 5))
    );

    const statusResult = {
      status: randomStatus,
      department: randomDepartment,
      lastUpdated: new Date().toLocaleDateString(),
      resolutionDate: resolutionDate.toLocaleDateString(),
    };

    setStatusData(statusResult);
    setStatusChecked(true);

    speak(`Status checked. Current status is ${randomStatus}`);

    // 🔔 GLOBAL NOTIFICATION TRIGGER
    showNotification(
      `Service status checked successfully for reference ${referenceNumber}. Current status: ${randomStatus}`
    );
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        Check Service Status
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
            onChange={(e) => setReferenceNumber(e.target.value)}
            className="w-full p-4 border border-gray-400 rounded-lg text-lg focus:outline-none focus:ring-4 focus:ring-blue-600"
            placeholder="Enter Reference Number"
          />

          <button
            onClick={handleCheckStatus}
            className="mt-6 w-full bg-blue-700 text-white text-lg font-semibold p-4 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:ring-offset-2"
          >
            Check Status
          </button>
        </div>
      )}

      {statusChecked && statusData && (
        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Application Status
          </h2>

          <p className="text-gray-700">
            <strong>Reference:</strong> {referenceNumber}
          </p>

          <p className="text-gray-700">
            <strong>Department:</strong> {statusData.department}
          </p>

          <div className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
            <p className="text-yellow-900 font-medium">
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