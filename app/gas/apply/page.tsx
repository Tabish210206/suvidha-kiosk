"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/kiosk-context";

export default function GasApply() {
  const router = useRouter();
  const { showNotification, speak } = useKiosk();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDigiLocker = () => {
    alert("Fetching documents from DigiLocker (Demo Mode)");
    speak("Documents fetched successfully from DigiLocker");
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.address) return;

    const randomId =
      "GAS-" + Math.floor(100000 + Math.random() * 900000);

    setApplicationId(randomId);
    setApplicationSubmitted(true);

    speak("Gas connection application submitted successfully");

    // 🔔 GLOBAL NOTIFICATION TRIGGER
    showNotification(
      `New gas connection application submitted successfully. Application ID: ${randomId}`
    );
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">
        Apply for New Gas Connection
      </h1>

      {!applicationSubmitted && (
        <div className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-4 rounded-lg focus:ring-4 focus:ring-blue-600 focus:outline-none"
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border border-gray-300 p-4 rounded-lg focus:ring-4 focus:ring-blue-600 focus:outline-none"
          />

          {/* DigiLocker Button */}
          <button
            onClick={handleDigiLocker}
            className="w-full py-4 rounded-lg text-white font-semibold text-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition"
          >
            Fetch Documents from DigiLocker
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-lg text-white font-semibold text-lg bg-blue-700 hover:bg-blue-800 transition"
          >
            Submit Application
          </button>

          <button
            onClick={() => router.push("/gas")}
            className="w-full text-gray-600 underline mt-2"
          >
            Cancel
          </button>
        </div>
      )}

      {applicationSubmitted && (
        <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm text-center">
          <h3 className="text-xl font-semibold mb-4 text-green-700">
            Gas Connection Application Submitted Successfully
          </h3>

          <p className="mb-2">Your Application ID:</p>

          <div className="text-2xl font-bold text-blue-800 mb-4">
            {applicationId}
          </div>

          <p className="text-gray-700 mb-4">
            Our gas authority will review your application within
            3–5 working days.
          </p>

          <button
            onClick={() => {
              setApplicationSubmitted(false);
              setFormData({ name: "", address: "" });
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