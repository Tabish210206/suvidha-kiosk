"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/kiosk-context";
import { CheckCircle, AlertCircle } from "lucide-react";

type Step = "fetch" | "confirm" | "payment" | "success";

export default function MunicipalPay() {
  const router = useRouter();
  const { showNotification, speak } = useKiosk();

  const [step, setStep] = useState<Step>("fetch");
  const [taxId, setTaxId] = useState("");
  const [taxData, setTaxData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Dummy Tax Records
  const mockTaxes: Record<string, any> = {
    PROP123: {
      owner: "Rahul Sharma",
      address: "Sector 10, Jaipur",
      amount: 3500,
      dueDate: "25-Mar-2024",
      type: "Property Tax",
    },
    WTR555: {
      owner: "Neha Verma",
      address: "MG Road, Jaipur",
      amount: 1200,
      dueDate: "20-Mar-2024",
      type: "Water Tax",
    },
  };

  const handleFetch = () => {
    if (!taxId) return;

    if (mockTaxes[taxId]) {
      setTaxData(mockTaxes[taxId]);
      setStep("confirm");
      speak("Municipal tax details fetched successfully");
    } else {
      alert("Record not found. Try PROP123 or WTR555");
    }
  };

  const handlePayment = () => {
    if (!paymentMethod) return;

    const txn =
      "MUNI-PAY-" + Math.floor(100000 + Math.random() * 900000);

    setTransactionId(txn);
    setStep("success");

    speak("Municipal tax payment successful");

    // 🔔 GLOBAL NOTIFICATION
    showNotification(
      `${taxData.type} payment of ₹${taxData.amount} completed successfully. Transaction ID: ${txn}`
    );
  };

  // ---------------- FETCH ----------------
  if (step === "fetch") {
    return (
      <div className="p-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          Pay Municipal Tax
        </h1>

        <div className="border border-gray-300 rounded-xl p-8 bg-white shadow-sm">
          <label className="block text-lg font-medium mb-3">
            Enter Property ID / Water Tax ID
          </label>

          <input
            type="text"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value.toUpperCase())}
            placeholder="Try PROP123 or WTR555"
            className="w-full border border-gray-400 p-4 rounded-lg mb-6 focus:ring-4 focus:ring-blue-600 focus:outline-none"
          />

          <button
            onClick={handleFetch}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition mb-4"
          >
            Fetch Tax Details
          </button>

          <button
            onClick={() => router.push("/municipal")}
            className="w-full text-gray-600 underline"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ---------------- CONFIRM ----------------
  if (step === "confirm") {
    return (
      <div className="p-10 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Confirm Tax Details
        </h2>

        <div className="border border-gray-300 rounded-xl p-8 bg-white shadow-sm space-y-4">
          <p><strong>Owner:</strong> {taxData.owner}</p>
          <p><strong>Address:</strong> {taxData.address}</p>
          <p><strong>Tax Type:</strong> {taxData.type}</p>
          <p className="text-xl font-bold">Amount: ₹{taxData.amount}</p>
          <p><strong>Due Date:</strong> {taxData.dueDate}</p>

          <button
            onClick={() => setStep("payment")}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg"
          >
            Proceed to Payment
          </button>

          <button
            onClick={() => setStep("fetch")}
            className="w-full text-gray-600 underline"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // ---------------- PAYMENT ----------------
  if (step === "payment") {
    return (
      <div className="p-10 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Select Payment Method
        </h2>

        <div className="border border-gray-300 rounded-xl p-8 bg-white shadow-sm space-y-4">
          {["Cash", "UPI", "Debit Card", "Net Banking"].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`w-full p-3 border rounded-lg ${
                paymentMethod === method
                  ? "bg-blue-100 border-blue-600"
                  : "border-gray-300"
              }`}
            >
              {method}
            </button>
          ))}

          <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p>Your payment is secure and encrypted.</p>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg"
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    );
  }

  // ---------------- SUCCESS ----------------
  if (step === "success") {
    return (
      <div className="p-10 max-w-3xl mx-auto text-center">
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />

        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Municipal Tax Payment Successful
        </h2>

        <p className="text-lg mb-2">
          Amount Paid: ₹{taxData.amount}
        </p>

        <p className="text-lg mb-4">
          Transaction ID: {transactionId}
        </p>

        <button
          onClick={() => router.push("/municipal")}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg"
        >
          Return to Municipal Services
        </button>
      </div>
    );
  }

  return null;
}