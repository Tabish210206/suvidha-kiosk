"use client";

import { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";

export default function Grievance() {
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
        "GRV-" + Math.floor(100000 + Math.random() * 900000);

      setComplaintId(randomId);
      setLoading(false);
      setSubmitted(true);

      speak("Electricity grievance submitted successfully");

      // 🔔 GLOBAL NOTIFICATION TRIGGER
      showNotification(
        `Electricity grievance submitted successfully. Complaint ID: ${randomId}`
      );
    }, 2000);
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      {!submitted && (
        <>
          <h2 className="text-2xl font-bold mb-6">
            Lodge Electricity Grievance
          </h2>

          <textarea
            placeholder="Describe your issue..."
            className="border p-4 rounded w-full mb-4 text-lg"
            rows={5}
            disabled={loading}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-red-700 text-white w-full px-6 py-3 rounded text-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-800 disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Submitting...
              </>
            ) : (
              "Submit Complaint"
            )}
          </button>
        </>
      )}

      {submitted && (
        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm text-center">
          <h3 className="text-xl font-semibold text-green-700 mb-4">
            Complaint Submitted Successfully
          </h3>

          <p className="mb-2 text-gray-700">Your Complaint ID:</p>

          <div className="text-2xl font-bold text-blue-800 mb-4">
            {complaintId}
          </div>

          <p className="text-gray-700 mb-6">
            Our electricity department will review your grievance
            within 2–4 working days.
          </p>

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