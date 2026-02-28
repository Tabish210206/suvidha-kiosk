"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/kiosk-context";

export default function MunicipalApply() {
  const router = useRouter();
  const { showNotification, speak } = useKiosk();

  const [certificateType, setCertificateType] = useState("Birth Certificate");
  const [applicantName, setApplicantName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  const handleSubmit = () => {
    if (!applicantName.trim()) return;

    const randomId =
      "MUNI-" + Math.floor(100000 + Math.random() * 900000);

    setApplicationId(randomId);
    setSubmitted(true);

    speak(`${certificateType} application submitted successfully`);

    // 🔔 GLOBAL NOTIFICATION
    showNotification(
      `${certificateType} application submitted successfully. Application ID: ${randomId}`
    );
  };

  return (
    <div className="p-10 max-w-3xl mx-auto">
      {!submitted && (
        <>
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            Apply for Certificate
          </h1>

          <div className="border border-gray-300 rounded-xl p-8 bg-white shadow-sm">
            <label className="block text-lg font-medium mb-3">
              Select Certificate Type
            </label>

            <select
              value={certificateType}
              onChange={(e) => setCertificateType(e.target.value)}
              className="w-full border border-gray-400 p-4 rounded-lg mb-6"
            >
              <option>Birth Certificate</option>
              <option>Death Certificate</option>
            </select>

            <label className="block text-lg font-medium mb-3">
              Applicant Name
            </label>

            <input
              type="text"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="Enter Full Name"
              className="w-full border border-gray-400 p-4 rounded-lg mb-6 focus:ring-4 focus:ring-blue-600 focus:outline-none"
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition mb-4"
            >
              Submit Application
            </button>

            <button
              onClick={() => router.push("/municipal")}
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
            {certificateType} Submitted Successfully
          </h3>

          <p className="mb-2 text-gray-700">Your Application ID:</p>

          <div className="text-2xl font-bold text-blue-800 mb-4">
            {applicationId}
          </div>

          <p className="text-gray-700 mb-6">
            Municipal department will process your request within
            3–5 working days.
          </p>

          <button
            onClick={() => {
              setSubmitted(false);
              setApplicantName("");
            }}
            className="bg-gray-200 px-6 py-3 rounded font-semibold hover:bg-gray-300"
          >
            Apply Another Certificate
          </button>
        </div>
      )}
    </div>
  );
}