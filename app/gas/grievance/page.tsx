"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/kiosk-context";

export default function GasGrievance() {
  const router = useRouter();
  const { showNotification, speak } = useKiosk();

  const [formData, setFormData] = useState({
    consumerId: "",
    issueType: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.consumerId || !formData.issueType || !formData.description)
      return;

    const randomId =
      "GAS-GRV-" + Math.floor(100000 + Math.random() * 900000);

    setComplaintId(randomId);
    setSubmitted(true);

    speak("Gas grievance submitted successfully");

    // 🔔 GLOBAL NOTIFICATION TRIGGER
    showNotification(
      `Gas grievance submitted successfully. Complaint ID: ${randomId}`
    );
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      {!submitted && (
        <>
          {/* Header */}
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Lodge Gas Grievance
          </h1>

          <p className="text-gray-700 text-lg mb-8">
            Report gas supply issues, billing problems, or other complaints.
          </p>

          {/* Form Card */}
          <div className="border border-gray-300 rounded-xl p-8 bg-white shadow-sm space-y-6">
            {/* Consumer ID */}
            <div>
              <label className="block font-medium mb-2">
                Consumer ID / Connection Number
              </label>
              <input
                type="text"
                name="consumerId"
                value={formData.consumerId}
                onChange={handleChange}
                placeholder="Enter Consumer ID"
                className="w-full border border-gray-400 p-4 rounded-lg focus:ring-4 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Issue Type */}
            <div>
              <label className="block font-medium mb-2">
                Issue Type
              </label>
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className="w-full border border-gray-400 p-4 rounded-lg focus:ring-4 focus:ring-blue-600 focus:outline-none"
              >
                <option value="">Select Issue Type</option>
                <option value="no_supply">No Gas Supply</option>
                <option value="low_pressure">Low Gas Pressure</option>
                <option value="billing_issue">Billing Issue</option>
                <option value="leakage">Gas Leakage</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-2">
                Issue Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your issue..."
                className="w-full border border-gray-400 p-4 rounded-lg focus:ring-4 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition"
            >
              Submit Grievance
            </button>

            {/* Cancel */}
            <button
              onClick={() => router.push("/gas")}
              className="w-full text-gray-600 underline"
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {submitted && (
        <div className="bg-white border border-gray-300 rounded-xl p-8 shadow-sm text-center">
          <h3 className="text-xl font-semibold text-green-700 mb-4">
            Gas Grievance Submitted Successfully
          </h3>

          <p className="mb-2 text-gray-700">Your Complaint ID:</p>

          <div className="text-2xl font-bold text-blue-800 mb-4">
            {complaintId}
          </div>

          <p className="text-gray-700 mb-6">
            Our gas authority will review your complaint within 2–4 working
            days.
          </p>

          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                consumerId: "",
                issueType: "",
                description: "",
              });
            }}
            className="bg-gray-200 px-6 py-3 rounded font-semibold hover:bg-gray-300"
          >
            Lodge Another Grievance
          </button>
        </div>
      )}
    </div>
  );
}