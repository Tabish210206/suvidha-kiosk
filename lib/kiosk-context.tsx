"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export type AccessibilityMode = "standard" | "blind" | "deaf" | "motor";
export type Language =
  | "en"
  | "hi"
  | "ta"
  | "te"
  | "ka"
  | "mr"
  | "bn"
  | "gu"
  | "ml"
  | "pa"
  | "ur";
export type KioskMode = "standard" | "kiosk" | "admin";
export type Orientation = "landscape" | "portrait";

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string; // 🔥 added for notification display
  avatar?: string;
}

interface KioskContextType {
  user: User | null;
  isLoggedIn: boolean;
  currentPage: string;
  accessibilityMode: AccessibilityMode;
  language: Language;
  sessionTimeLeft: number;
  kioskMode: KioskMode;
  orientation: Orientation;
  showSessionWarning: boolean;

  // 🔔 Notification
  notification: string | null;
  showNotification: (message: string) => void;

  setUser: (user: User | null) => void;
  setCurrentPage: (page: string) => void;
  setAccessibilityMode: (mode: AccessibilityMode) => void;
  setLanguage: (lang: Language) => void;
  setKioskMode: (mode: KioskMode) => void;
  logout: () => void;
  resetSessionTimer: () => void;
  speak: (text: string, lang?: Language) => void;
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export function KioskProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState("language");
  const [accessibilityMode, setAccessibilityMode] =
    useState<AccessibilityMode>("blind");
  const [language, setLanguage] = useState<Language>("en");
  const [sessionTimeLeft, setSessionTimeLeft] = useState(60);
  const [sessionTimeout, setSessionTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [kioskMode, setKioskMode] = useState<KioskMode>("standard");
  const [orientation, setOrientation] =
    useState<Orientation>("landscape");
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  // 🔔 Notification state
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);

    // Auto hide after 6 seconds
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  const logout = useCallback(() => {
    setUser(null);
    setCurrentPage("language");
    setSessionTimeLeft(60);
    setShowSessionWarning(false);
    if (sessionTimeout) clearInterval(sessionTimeout);
  }, [sessionTimeout]);

  const resetSessionTimer = useCallback(() => {
    const initialTime = kioskMode === "kiosk" ? 60 : 900;
    setSessionTimeLeft(initialTime);
    setShowSessionWarning(false);

    if (sessionTimeout) clearInterval(sessionTimeout);

    const newTimeout = setInterval(() => {
      setSessionTimeLeft((prev) => {
        const warningThreshold = kioskMode === "kiosk" ? 10 : 60;

        if (prev <= 1) {
          logout();
          return initialTime;
        }

        if (prev === warningThreshold) {
          setShowSessionWarning(true);
        }

        return prev - 1;
      });
    }, 1000);

    setSessionTimeout(newTimeout);
  }, [sessionTimeout, logout, kioskMode]);

  const speak = useCallback(
    (text: string, lang?: Language) => {
      if (
        "speechSynthesis" in window &&
        accessibilityMode !== "standard"
      ) {
        const utterance = new SpeechSynthesisUtterance(text);
        const langCode = lang || language;
        const langMap: Record<Language, string> = {
          en: "en-IN",
          hi: "hi-IN",
          ta: "ta-IN",
          te: "te-IN",
          ka: "ka-IN",
          mr: "mr-IN",
          bn: "bn-IN",
          gu: "gu-IN",
          ml: "ml-IN",
          pa: "pa-IN",
          ur: "ur-IN",
        };
        utterance.lang = langMap[langCode];
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    },
    [accessibilityMode, language]
  );

  useEffect(() => {
    return () => {
      if (sessionTimeout) clearInterval(sessionTimeout);
    };
  }, [sessionTimeout]);

  return (
    <KioskContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        currentPage,
        accessibilityMode,
        language,
        sessionTimeLeft,
        kioskMode,
        orientation,
        showSessionWarning,

        notification,
        showNotification,

        setUser,
        setCurrentPage,
        setAccessibilityMode,
        setLanguage,
        setKioskMode,
        logout,
        resetSessionTimer,
        speak,
      }}
    >
      {children}
    </KioskContext.Provider>
  );
}

export function useKiosk() {
  const context = useContext(KioskContext);
  if (!context) {
    throw new Error("useKiosk must be used within KioskProvider");
  }
  return context;
}