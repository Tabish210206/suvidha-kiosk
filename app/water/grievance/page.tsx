"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";

export default function WaterGrievance() {
  const { showNotification, speak } = useKiosk();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!description.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const randomId =
        "WTR-GRV-" + Math.floor(100000 + Math.random() * 900000);

      setComplaintId(randomId);
      setLoading(false);
      setSubmitted(true);

      speak("Water grievance submitted successfully");

      // 🔔 GLOBAL NOTIFICATION
      showNotification(
        `Water grievance submitted successfully. Complaint ID: ${randomId}`
      );
    }, 2000);
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      {!submitted && (
        <>
          <h2 className="text-2xl font-bold mb-6">
            Lodge Water Grievance
          </h2>

          <textarea
            placeholder="Describe your water supply issue..."
            className="border p-4 rounded w-full mb-4 text-lg"
            rows={5}
            disabled={loading}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-800 text-white w-full px-6 py-3 rounded text-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-900 disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Submitting...
              </>
            ) : (
              "Submit Water Complaint"
            )}
          </button>
        </>
      )}

      {submitted && (
        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm text-center">
          <h3 className="text-xl font-semibold text-green-700 mb-4">
            Water Complaint Submitted Successfully
          </h3>

          <p className="mb-2 text-gray-700">Your Complaint ID:</p>

          <div className="text-2xl font-bold text-blue-800 mb-4">
            {complaintId}
          </div>

          <p className="text-gray-700 mb-4">
            Water department will review your grievance within
            2–4 working days.
          </p>

          {/* 🔔 Notification Status UI */}
          <div className="bg-green-50 border border-green-400 p-4 rounded-lg mb-6 text-left">
            <p className="font-semibold text-green-700 mb-2">
              Notification Sent Successfully
            </p>
            <ul className="text-green-800 list-disc pl-5 text-sm space-y-1">
              <li>WhatsApp notification sent</li>
              <li>SMS confirmation sent</li>
              <li>Email update delivered</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setSubmitted(false);
              setDescription("");
            }}
            className="bg-gray-200 px-6 py-3 rounded font-semibold hover:bg-gray-300"
          >
            Lodge Another Complaint
          </button>
        </div>
      )}
    </div>
  );
}