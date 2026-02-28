"use client";

import React, { useState } from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QrLogin from "./qr-login";
import OtpVerification from "./otp-verification";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { setCurrentPage, setUser, resetSessionTimer, speak } = useKiosk();
    const [loginMethod, setLoginMethod] = useState<"qr" | "phone">("qr");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const router = useRouter();

    const handlePhoneSubmit = () => {
        if (phone.length !== 10) {
            speak("Please enter a valid 10-digit phone number");
            return;
        }
        setShowOtp(true);
        speak(`OTP sent to ${phone}`);
    };

    const handleOtpSubmit = () => {
        if (otp === "123456") {
            const mockUser = {
                id: "user_" + phone,
                phone: phone,
                name: "Rajesh Kumar",
            };
            setUser(mockUser);
            resetSessionTimer();
            speak("Login successful. Welcome!");
        } else {
            speak("Invalid OTP. Please try again");
        }
        router.push("/dashboard");
    };

    const handleQrScan = (userId: string) => {
        const mockUser = {
            id: userId,
            phone: "9876543210",
            name: "Rajesh Kumar",
        };
        setUser(mockUser);
        resetSessionTimer();
        speak("QR verified. Welcome to SUVIDHA");
    };

    return (
        <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-2xl">
                <Card className="p-8 border-2">
                    <h2 className="text-3xl font-bold text-primary mb-8 text-center">
                        Citizen Login
                    </h2>

                    <div className="flex gap-4 mb-8">
                        <Button
                            variant={
                                loginMethod === "qr" ? "default" : "outline"
                            }
                            onClick={() => setLoginMethod("qr")}
                            className="flex-1 py-6 text-lg"
                        >
                            Smart Card / QR
                        </Button>
                        <Button
                            variant={
                                loginMethod === "phone" ? "default" : "outline"
                            }
                            onClick={() => setLoginMethod("phone")}
                            className="flex-1 py-6 text-lg"
                        >
                            Phone & OTP
                        </Button>
                    </div>

                    {loginMethod === "qr" ? (
                        <QrLogin onScan={handleQrScan} />
                    ) : (
                        <div className="space-y-6">
                            {!showOtp ? (
                                <>
                                    <div>
                                        <label className="block text-lg font-semibold mb-3">
                                            Phone Number
                                        </label>
                                        <Input
                                            type="tel"
                                            placeholder="10-digit phone number"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(
                                                    e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 10),
                                                )
                                            }
                                            className="py-3 text-lg border-2"
                                            maxLength={10}
                                        />
                                    </div>
                                    <Button
                                        onClick={handlePhoneSubmit}
                                        className="w-full py-6 text-lg"
                                        disabled={phone.length !== 10}
                                    >
                                        Send OTP
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <OtpVerification
                                        phone={phone}
                                        otp={otp}
                                        onChange={setOtp}
                                        onSubmit={handleOtpSubmit}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowOtp(false);
                                            setOtp("");
                                        }}
                                        className="w-full"
                                    >
                                        Back
                                    </Button>
                                </>
                            )}
                        </div>
                    )}

                    <div className="mt-8 p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            <strong>Demo Mode:</strong> Use phone 9876543210
                            with OTP 123456 to test the system.
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => setCurrentPage("home")}
                        className="w-full mt-6"
                    >
                        Back to Home
                    </Button>
                </Card>
            </div>
        </div>
    );
}
