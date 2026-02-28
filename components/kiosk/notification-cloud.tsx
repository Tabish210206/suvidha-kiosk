"use client";

import { useKiosk } from "@/lib/kiosk-context";
import { Smartphone, MessageSquare, Mail } from "lucide-react";

export default function NotificationCloud() {
  const { notification, user } = useKiosk();

  if (!notification) return null;

  return (
    <div className="fixed top-6 right-6 w-96 bg-white shadow-2xl rounded-xl border-2 border-green-600 z-50 p-6 animate-in fade-in duration-300">

      <h2 className="text-lg font-bold text-green-700 mb-4">
        🔔 Notification Sent Successfully
      </h2>

      <div className="space-y-3 text-sm">

        <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
          <Smartphone className="text-green-600 w-4 h-4" />
          <span>
            WhatsApp sent to {user?.phone || "registered number"}
          </span>
        </div>

        <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg">
          <MessageSquare className="text-blue-600 w-4 h-4" />
          <span>
            SMS sent successfully
          </span>
        </div>

        <div className="flex items-center gap-3 bg-yellow-50 p-3 rounded-lg">
          <Mail className="text-yellow-600 w-4 h-4" />
          <span>
            Email sent to {user?.email || "registered email ID"}
          </span>
        </div>

      </div>

      <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm">
        <strong>Update:</strong> {notification}
      </div>

    </div>
  );
}