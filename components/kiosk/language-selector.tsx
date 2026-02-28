"use client";

import React from "react";
import { useKiosk } from "@/lib/kiosk-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";

const LANGUAGES = [
    { code: "en", name: "English", nativeName: "English", flag: "🇮🇳" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
    { code: "ka", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
];

export default function LanguageSelector() {
    const { setLanguage, setCurrentPage, speak } = useKiosk();
    const router = useRouter();

    const handleLanguageSelect = (langCode: any) => {
        setLanguage(langCode);
        const selectedLang = LANGUAGES.find((l) => l.code === langCode);
        speak(`Language selected: ${selectedLang?.name}`, langCode);
        setTimeout(() => setCurrentPage("home"), 500);

        router.push("/login");
    };

    return (
        <div className="w-full h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col items-center justify-center p-6">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Globe className="w-12 h-12 text-primary" />
                    <h1 className="text-4xl font-bold text-primary">
                        SUVIDHA 4.0
                    </h1>
                </div>
                <p className="text-xl text-muted-foreground">
                    Select Your Language
                </p>
            </div>

            {/* Language Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl w-full">
                {LANGUAGES.map((lang) => (
                    <Button
                        key={lang.code}
                        onClick={() => handleLanguageSelect(lang.code)}
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2 text-base border-2 hover:border-primary hover:bg-primary/10 transition-all transform hover:scale-105"
                    >
                        <span className="text-3xl">{lang.flag}</span>
                        <div className="text-center">
                            <p className="font-semibold">{lang.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {lang.nativeName}
                            </p>
                        </div>
                    </Button>
                ))}
            </div>

            {/* Info Card */}
            <Card className="mt-12 p-6 max-w-2xl border-2">
                <h3 className="font-semibold text-lg mb-2">
                    Welcome to SUVIDHA 4.0
                </h3>
                <p className="text-sm text-muted-foreground">
                    A unified self-service kiosk for civic services. Select your
                    preferred language to continue. You can access electricity,
                    water, gas, municipal services, and file complaints all in
                    one place.
                </p>
            </Card>
        </div>
    );
}
