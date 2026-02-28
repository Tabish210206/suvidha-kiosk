"use client";

import React, { useState, useEffect } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, AlertCircle } from "lucide-react";

type Step = "fetch" | "confirm" | "payment" | "success";

export default function BillPaymentFlow() {
  const { speak, setCurrentPage, showNotification } = useKiosk();

  const [step, setStep] = useState<Step>("fetch");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [billDetails, setBillDetails] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const mockBills: Record<string, any> = {
    RJ123456: {
      type: "Electricity",
      consumerName: "Rajesh Kumar",
      address: "123 Main Street, Jaipur",
      amount: 1250,
      dueDate: "15-Mar-2024",
      periodFrom: "01-Feb-2024",
      periodTo: "29-Feb-2024",
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
    speak(`Fetching bill for ${referenceNumber}`);

    setTimeout(() => {
      if (mockBills[referenceNumber]) {
        setBillDetails(mockBills[referenceNumber]);
        setStep("confirm");
        speak(
          `Bill found. Amount due is rupees ${mockBills[referenceNumber].amount}`
        );
      } else {
        speak("Bill not found");
        alert("Bill not found. Try RJ123456");
      }
      setProcessing(false);
    }, 1500);
  };

  const handleConfirm = () => {
    setStep("payment");
    speak("Proceeding to payment");
  };

  const handlePayment = () => {
    if (!paymentMethod) return;

    setProcessing(true);

    const txn = `PAY${Date.now().toString().slice(-8)}`;
    setTransactionId(txn);

    speak(
      `Processing payment of rupees ${billDetails.amount} via ${paymentMethod}`
    );

    setTimeout(() => {
      speak(`Payment successful. Transaction ID ${txn}`);

      // 🔔 GLOBAL NOTIFICATION TRIGGER
      showNotification(
        `Electricity bill payment of ₹${billDetails.amount} completed successfully. Transaction ID: ${txn}`
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

  // ---------------- FETCH ----------------
  if (step === "fetch") {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-2xl p-8 border-2">
          <h2 className="text-3xl font-bold mb-8">Fetch Your Bill</h2>

          <Input
            type="text"
            placeholder="RJ123456"
            value={referenceNumber}
            onChange={(e) =>
              setReferenceNumber(e.target.value.toUpperCase())
            }
            className="py-4 text-lg border-2 mb-6"
            autoFocus
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

  // ---------------- CONFIRM ----------------
  if (step === "confirm") {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-2xl p-8 border-2">
          <h2 className="text-3xl font-bold mb-8">
            Confirm Bill Details
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

  // ---------------- PAYMENT ----------------
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
                    ? "border-primary bg-primary/10"
                    : "border-gray-300"
                }`}
              >
                {method}
              </button>
            )
          )}

          <Button
            onClick={handlePayment}
            disabled={!paymentMethod || processing}
            className="w-full py-6 text-lg"
          >
            {processing ? "Processing..." : "Confirm & Pay"}
          </Button>
        </Card>
      </div>
    );
  }

  // ---------------- SUCCESS ----------------
  if (step === "success") {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-2xl p-8 border-2 text-center">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />

          <h2 className="text-3xl font-bold text-green-700 mb-6">
            Payment Completed Successfully
          </h2>

          <div className="bg-green-50 border-2 border-green-400 p-6 rounded-lg mb-8 text-left space-y-3">
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-bold">
                ₹{billDetails.amount}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span className="font-mono">{transactionId}</span>
            </div>
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