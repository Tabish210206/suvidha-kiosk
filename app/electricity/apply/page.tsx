"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";

export default function ApplyConnection() {
  const { showNotification, speak } = useKiosk();

  const [docsFetched, setDocsFetched] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  const fetchDigiLockerDocs = () => {
    setLoadingDocs(true);

    setTimeout(() => {
      setDocsFetched(true);
      setLoadingDocs(false);
      speak("Documents fetched successfully from DigiLocker");
    }, 1500);
  };

  const submitApplication = () => {
    const randomId =
      "ELEC-" + Math.floor(100000 + Math.random() * 900000);

    setApplicationId(randomId);
    setApplicationSubmitted(true);

    speak("Electricity connection application submitted successfully");

    // 🔔 GLOBAL NOTIFICATION TRIGGER
    showNotification(
      `New electricity connection application submitted successfully. Application ID: ${randomId}`
    );
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Apply for New Electricity Connection
      </h2>

      {!applicationSubmitted && (
        <>
          <input
            type="text"
            placeholder="Full Name"
            className="border p-3 rounded w-full mb-4 text-lg"
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded w-full mb-4 text-lg"
          />

          <button
            onClick={fetchDigiLockerDocs}
            disabled={loadingDocs}
            className="bg-purple-700 text-white px-6 py-3 rounded w-full text-lg font-semibold hover:bg-purple-800 disabled:opacity-60"
          >
            {loadingDocs
              ? "Fetching Documents..."
              : "Fetch Documents from DigiLocker"}
          </button>

          {docsFetched && (
            <div className="mt-4 bg-green-100 border border-green-400 p-4 rounded">
              <p className="font-semibold text-green-800 mb-2">
                Documents Retrieved Successfully
              </p>
              <ul className="list-disc pl-5 text-green-900">
                <li>Aadhaar Card</li>
                <li>Address Proof</li>
                <li>Identity Verification</li>
              </ul>
            </div>
          )}

          <button
            onClick={submitApplication}
            disabled={!docsFetched}
            className="bg-blue-600 text-white w-full mt-6 px-6 py-3 rounded text-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            Submit Application
          </button>
        </>
      )}

      {applicationSubmitted && (
        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm text-center">
          <h3 className="text-xl font-semibold mb-4 text-green-700">
            Application Submitted Successfully
          </h3>

          <p className="mb-2">Your Application ID:</p>

          <div className="text-2xl font-bold text-blue-800 mb-4">
            {applicationId}
          </div>

          <p className="text-gray-700 mb-4">
            Our team will review your application within 3-5 working days.
          </p>

          <button
            onClick={() => {
              setApplicationSubmitted(false);
              setDocsFetched(false);
            }}
            className="bg-gray-200 px-6 py-3 rounded font-semibold hover:bg-gray-300"
          >
            Apply Another Connection
          </button>
        </div>
      )}
    </div>
  );
}