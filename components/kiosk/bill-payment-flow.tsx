"use client";

import React, { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, AlertCircle } from "lucide-react";

type Step = "fetch" | "confirm" | "payment" | "success";

export default function BillPaymentFlow() {
    const { speak, setCurrentPage, accessibilityMode } = useKiosk();
    const [step, setStep] = useState<Step>("fetch");
    const [referenceNumber, setReferenceNumber] = useState("");
    const [billDetails, setBillDetails] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [processing, setProcessing] = useState(false);

    const mockBills: Record<string, any> = {
        RJ123456: {
            type: "Electricity",
            consumerName: "Rajesh Kumar",
            address: "123 Main Street, Jaipur",
            amount: 1250,
            dueDate: "15-Mar-2024",
            periodFrom: "01-Feb-2024",
            periodTo: "29-Feb-2024",
            lastPaidAmount: 1200,
            lastPaidDate: "01-Feb-2024",
        },
        WTR987654: {
            type: "Water",
            consumerName: "Rajesh Kumar",
            address: "123 Main Street, Jaipur",
            amount: 380,
            dueDate: "10-Mar-2024",
            periodFrom: "01-Feb-2024",
            periodTo: "29-Feb-2024",
        },
    };

    const handleFetchBill = () => {
        if (!referenceNumber) return;

        setProcessing(true);
        speak(`Fetching bill for reference ${referenceNumber}`);

        setTimeout(() => {
            if (mockBills[referenceNumber]) {
                setBillDetails(mockBills[referenceNumber]);
                speak(
                    `Bill fetched. Amount due is rupees ${mockBills[referenceNumber].amount}`,
                );
                setStep("confirm");
            } else {
                speak("Bill not found. Please check the reference number");
            }
            setProcessing(false);
        }, 1500);
    };

    const handleConfirm = () => {
        speak("Proceeding to payment");
        setStep("payment");
    };

    const handlePayment = () => {
        if (!paymentMethod) return;

        setProcessing(true);
        speak(
            `Processing payment of rupees ${billDetails.amount} via ${paymentMethod}`,
        );

        setTimeout(() => {
            speak("Payment successful. Your reference number is PAY202425001");
            setStep("success");
            setProcessing(false);
        }, 2500);
    };

    const handleReset = () => {
        setStep("fetch");
        setReferenceNumber("");
        setBillDetails(null);
        setPaymentMethod("");
    };

    if (step === "fetch") {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <Card className="w-full max-w-2xl p-8 border-2">
                    <h2 className="text-3xl font-bold text-primary mb-8">
                        Fetch Your Bill
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-lg font-semibold mb-3">
                                Reference Number or Consumer ID
                            </label>
                            <Input
                                type="text"
                                placeholder="e.g., RJ123456 or WTR987654"
                                value={referenceNumber}
                                onChange={(e) =>
                                    setReferenceNumber(
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                className="py-3 text-lg border-2"
                                autoFocus
                            />
                            <p className="text-sm text-muted-foreground mt-2">
                                Found on your bill or meter
                            </p>
                        </div>

                        <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-lg">
                            <p className="text-sm font-semibold mb-2">
                                Demo Reference Numbers:
                            </p>
                            <p className="text-xs text-muted-foreground">
                                RJ123456 (Electricity) • WTR987654 (Water)
                            </p>
                        </div>

                        <Button
                            onClick={handleFetchBill}
                            disabled={!referenceNumber || processing}
                            className="w-full py-6 text-lg"
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
                    </div>
                </Card>
            </div>
        );
    }

    if (step === "confirm") {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <Card className="w-full max-w-2xl p-8 border-2">
                    <h2 className="text-3xl font-bold text-primary mb-8">
                        Confirm Bill Details
                    </h2>

                    <div className="space-y-4 mb-8 bg-muted p-6 rounded-lg">
                        <div className="flex justify-between">
                            <span className="font-semibold">Type:</span>
                            <span>{billDetails.type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Name:</span>
                            <span>{billDetails.consumerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Amount:</span>
                            <span className="text-2xl font-bold text-primary">
                                ₹{billDetails.amount}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Due Date:</span>
                            <span>{billDetails.dueDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Period:</span>
                            <span>
                                {billDetails.periodFrom} -{" "}
                                {billDetails.periodTo}
                            </span>
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

    if (step === "payment") {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <Card className="w-full max-w-2xl p-8 border-2">
                    <h2 className="text-3xl font-bold text-primary mb-8">
                        Select Payment Method
                    </h2>

                    <div className="space-y-4 mb-8">
                        {[
                            "Cash",
                            "Debit Card",
                            "Credit Card",
                            "Net Banking",
                            "Mobile Wallet",
                            "Check",
                        ].map((method) => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={`w-full p-4 border-2 rounded-lg text-left font-semibold transition-all ${
                                    paymentMethod === method
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-border hover:border-primary text-foreground"
                                }`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>

                    <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-lg mb-6">
                        <div className="flex gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-semibold text-yellow-900">
                                    Secure Payment
                                </p>
                                <p className="text-yellow-800">
                                    Your payment is encrypted and secure
                                </p>
                            </div>
                        </div>
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

    if (step === "success") {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <Card className="w-full max-w-2xl p-8 border-2 text-center">
                    <div className="flex justify-center mb-6">
                        <CheckCircle className="w-20 h-20 text-green-600" />
                    </div>

                    <h2 className="text-3xl font-bold text-primary mb-4">
                        Payment Successful!
                    </h2>

                    <div className="bg-green-50 border-2 border-green-300 p-6 rounded-lg mb-8 text-left space-y-3">
                        <div className="flex justify-between">
                            <span className="font-semibold">Type:</span>
                            <span>{billDetails.type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Amount Paid:</span>
                            <span className="text-xl font-bold text-primary">
                                ₹{billDetails.amount}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">
                                Transaction ID:
                            </span>
                            <span className="font-mono">PAY202425001</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Status:</span>
                            <span className="text-green-600 font-bold">
                                Completed
                            </span>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6">
                        A receipt has been sent to your registered email and
                        phone number.
                    </p>

                    <Button
                        onClick={handleReset}
                        className="w-full py-6 text-lg mb-3"
                    >
                        Pay Another Bill
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => {
                            setCurrentPage("home");
                            handleReset();
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
