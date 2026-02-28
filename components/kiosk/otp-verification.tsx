'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useKiosk } from '@/lib/kiosk-context';

interface OtpVerificationProps {
  phone: string;
  otp: string;
  onChange: (otp: string) => void;
  onSubmit: () => void;
}

export default function OtpVerification({ phone, otp, onChange, onSubmit }: OtpVerificationProps) {
  const [timeLeft, setTimeLeft] = useState(60);
  const { accessibilityMode } = useKiosk();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">OTP sent to:</p>
        <p className="text-lg font-semibold text-foreground">+91 {phone.slice(0, 5)}****</p>
        <p className="text-xs text-muted-foreground mt-2">Expires in: <span className="font-bold text-primary">{timeLeft}s</span></p>
      </div>

      <div>
        <label className="block text-lg font-semibold mb-3">Enter OTP</label>
        <Input
          type="text"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="py-3 text-lg text-center tracking-widest border-2"
          maxLength={6}
          autoFocus
        />
        <p className="text-xs text-muted-foreground mt-2">
          {accessibilityMode === 'blind' ? 'Enter 6 digits' : '6 digits required'}
        </p>
      </div>

      <Button
        onClick={onSubmit}
        className="w-full py-6 text-lg"
        disabled={otp.length !== 6 || timeLeft === 0}
      >
        Verify & Login
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Demo: Use OTP <strong>123456</strong>
      </p>

      {timeLeft < 10 && (
        <Button
          variant="outline"
          onClick={() => setTimeLeft(60)}
          className="w-full"
        >
          Resend OTP
        </Button>
      )}
    </div>
  );
}
