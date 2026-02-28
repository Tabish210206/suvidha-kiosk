"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useKiosk } from "@/lib/kiosk-context";
import { CheckCircle, AlertCircle } from "lucide-react";

type Step = "fetch" | "confirm" | "payment" | "success";

export default function GasPay() {
  const router = useRouter();
  const { showNotification, speak } = useKiosk();

  const [step, setStep] = useState<Step>("fetch");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [billData, setBillData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState("");

  // Dummy Bill Data
  const mockBills: Record<string, any> = {
    GAS123: {
      consumerName: "Imran Khan",
      address: "45 MG Road, Jaipur",
      amount: 980,
      dueDate: "18-Mar-2024",
    },
    GAS456: {
      consumerName: "Sunita Sharma",
      address: "12 Park Street, Jaipur",
      amount: 1250,
      dueDate: "22-Mar-2024",
    },
  };

  const handleFetch = () => {
    if (!consumerNumber) return;

    if (mockBills[consumerNumber]) {
      setBillData(mockBills[consumerNumber]);
      setStep("confirm");
      speak("Gas bill fetched successfully");
    } else {
      alert("Bill not found. Try GAS123 or GAS456");
    }
  };

  const handlePayment = () => {
    if (!paymentMethod) return;

    const txn =
      "GASPAY-" + Math.floor(100000 + Math.random() * 900000);

    setTransactionId(txn);
    setStep("success");

    speak("Gas bill payment successful");

    // 🔔 GLOBAL NOTIFICATION
    showNotification(
      `Gas bill payment of ₹${billData.amount} completed successfully. Transaction ID: ${txn}`
    );
  };

  // ---------------- FETCH ----------------
  if (step === "fetch") {
    return (
      <div className="p-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Fetch & Pay Gas Bill
        </h1>

        <p className="text-gray-700 text-lg mb-8">
          Enter your consumer number to view and pay your latest gas bill.
        </p>

        <div className="border border-gray-300 rounded-xl p-8 bg-white shadow-sm">
          <label className="block text-lg font-medium mb-3">
            Consumer Number
          </label>

          <input
            type="text"
            value={consumerNumber}
            onChange={(e) => setConsumerNumber(e.target.value.toUpperCase())}
            placeholder="Try GAS123 or GAS456"
            className="w-full border border-gray-400 p-4 rounded-lg mb-6 focus:ring-4 focus:ring-blue-600 focus:outline-none"
          />

          <button
            onClick={handleFetch}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition mb-4"
          >
            Fetch Bill
          </button>

          <button
            onClick={() => router.push("/gas")}
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
      <div className="p-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          Confirm Gas Bill Details
        </h2>

        <div className="border border-gray-300 rounded-xl p-8 bg-white shadow-sm space-y-4">
          <p><strong>Name:</strong> {billData.consumerName}</p>
          <p><strong>Address:</strong> {billData.address}</p>
          <p className="text-xl font-bold">Amount: ₹{billData.amount}</p>
          <p><strong>Due Date:</strong> {billData.dueDate}</p>

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
      <div className="p-10 max-w-4xl mx-auto">
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
      <div className="p-10 max-w-4xl mx-auto text-center">
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />

        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Gas Payment Successful
        </h2>

        <p className="text-lg mb-2">
          Amount Paid: ₹{billData.amount}
        </p>

        <p className="text-lg mb-2">
          Transaction ID: {transactionId}
        </p>

        <button
          onClick={() => router.push("/gas")}
          className="mt-6 bg-blue-900 text-white px-6 py-3 rounded-lg"
        >
          Return to Gas Services
        </button>
      </div>
    );
  }

  return null;
}