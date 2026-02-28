"use client";

import React, { useState, useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, AlertCircle } from "lucide-react";

type Step = "fetch" | "confirm" | "payment" | "success";

export default function WaterBillPayment() {
  const { speak, setCurrentPage, showNotification } = useKiosk();

  const [step, setStep] = useState<Step>("fetch");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [billDetails, setBillDetails] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // Dummy Water Data
  const mockBills: Record<string, any> = {
    WTR123456: {
      type: "Water",
      consumerName: "Ayesha Khan",
      address: "22 Park Road, Jaipur",
      amount: 380,
      dueDate: "10-Mar-2024",
    },
    WTR789012: {
      type: "Water",
      consumerName: "Rahul Mehta",
      address: "Sector 14, Jaipur",
      amount: 620,
      dueDate: "18-Mar-2024",
    },
  };

  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        handleReset();
        setCurrentPage("home");
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleFetchBill = () => {
    if (!referenceNumber) return;

    setProcessing(true);
    speak(`Fetching water bill for ${referenceNumber}`);

    setTimeout(() => {
      if (mockBills[referenceNumber]) {
        setBillDetails(mockBills[referenceNumber]);
        setStep("confirm");
        speak(
          `Water bill found. Amount due is rupees ${mockBills[referenceNumber].amount}`
        );
      } else {
        speak("Water bill not found");
        alert("Bill not found. Try WTR123456");
      }
      setProcessing(false);
    }, 1500);
  };

  const handleConfirm = () => {
    setStep("payment");
    speak("Proceeding to water bill payment");
  };

  const handlePayment = () => {
    if (!paymentMethod) return;

    setProcessing(true);

    const txn = `WTRPAY${Date.now().toString().slice(-8)}`;
    setTransactionId(txn);

    speak(
      `Processing water payment of rupees ${billDetails.amount} via ${paymentMethod}`
    );

    setTimeout(() => {
      speak(`Water payment successful. Transaction ID ${txn}`);

      // 🔔 GLOBAL NOTIFICATION
      showNotification(
        `Water bill payment successful. Transaction ID: ${txn}`
      );

      setStep("success");
      setProcessing(false);
    }, 2500);
  };

  const handleReset = () => {
    setStep("fetch");
    setReferenceNumber("");
    setBillDetails(null);
    setPaymentMethod("");
    setTransactionId("");
  };

  // FETCH STEP
  if (step === "fetch") {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-2xl p-8 border-2">
          <h2 className="text-3xl font-bold mb-8">Fetch Water Bill</h2>

          <Input
            type="text"
            placeholder="WTR123456"
            value={referenceNumber}
            onChange={(e) =>
              setReferenceNumber(e.target.value.toUpperCase())
            }
            className="py-4 text-lg border-2 mb-6"
          />

          <Button
            onClick={handleFetchBill}
            disabled={!referenceNumber || processing}
            className="w-full py-6 text-lg mb-3"
          >
            {processing ? "Fetching..." : "Fetch Bill"}
          </Button>

          <Button
            variant="ghost"
            onClick={() => setCurrentPage("home")}
            className="w-full"
          >
            Cancel
          </Button>
        </Card>
      </div>
    );
  }

  // CONFIRM STEP
  if (step === "confirm") {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-2xl p-8 border-2">
          <h2 className="text-3xl font-bold mb-8">
            Confirm Water Bill Details
          </h2>

          <div className="space-y-4 mb-8 bg-muted p-6 rounded-lg">
            <div className="flex justify-between">
              <span>Name:</span>
              <span>{billDetails.consumerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="text-2xl font-bold">
                ₹{billDetails.amount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Due Date:</span>
              <span>{billDetails.dueDate}</span>
            </div>
          </div>

          <Button
            onClick={handleConfirm}
            className="w-full py-6 text-lg mb-3"
          >
            Proceed to Payment
          </Button>

          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full"
          >
            Change Bill
          </Button>
        </Card>
      </div>
    );
  }

  // PAYMENT STEP
  if (step === "payment") {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-2xl p-8 border-2">
          <h2 className="text-3xl font-bold mb-8">
            Select Payment Method
          </h2>

          {["Cash", "Debit Card", "UPI", "Net Banking"].map(
            (method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`w-full p-4 border-2 rounded-lg mb-4 font-semibold ${
                  paymentMethod === method
                    ? "border-blue-800 bg-blue-100"
                    : "border-gray-300"
                }`}
              >
                {method}
              </button>
            )
          )}

          <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg mb-6 flex gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm">
              Your payment is secure and encrypted.
            </p>
          </div>

          <Button
            onClick={handlePayment}
            disabled={!paymentMethod || processing}
            className="w-full py-6 text-lg mb-3"
          >
            {processing ? "Processing..." : "Confirm & Pay"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setStep("confirm")}
            className="w-full"
          >
            Back
          </Button>
        </Card>
      </div>
    );
  }

  // SUCCESS STEP
  if (step === "success") {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-2xl p-8 border-2 text-center">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />

          <h2 className="text-3xl font-bold text-green-700 mb-6">
            Water Payment Completed Successfully
          </h2>

          <div className="bg-green-50 border-2 border-green-400 p-6 rounded-lg mb-6 text-left space-y-3">
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-bold">
                ₹{billDetails.amount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span>{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="font-mono">{transactionId}</span>
            </div>
          </div>

          {/* 🔔 Notification Info */}
          <div className="bg-green-100 border border-green-500 p-4 rounded-lg mb-6 text-left">
            <p className="font-semibold text-green-800 mb-2">
              Notification Sent Successfully
            </p>
            <ul className="list-disc pl-5 text-green-900 text-sm space-y-1">
              <li>WhatsApp notification sent</li>
              <li>SMS confirmation sent</li>
              <li>Email receipt delivered</li>
            </ul>
          </div>

          <Button
            onClick={handleReset}
            className="w-full py-6 text-lg mb-3"
          >
            Pay Another Bill
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              handleReset();
              setCurrentPage("home");
            }}
            className="w-full"
          >
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return null;
}