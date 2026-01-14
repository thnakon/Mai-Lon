"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "th", label: "TH", flag: "🇹🇭" },
  { code: "en", label: "EN", flag: "🇺🇸" },
];

export function LanguageSwitch() {
  const [currentLang, setCurrentLang] = useState<"th" | "en">("th");

  const handleToggle = () => {
    const newLang = currentLang === "th" ? "en" : "th";
    setCurrentLang(newLang);
    // TODO: Integrate with next-intl when backend is ready
  };

  const current = languages.find((l) => l.code === currentLang);
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="h-9 px-3 rounded-full hover:bg-accent transition-colors gap-1.5"
      aria-label={`Switch to ${currentLang === "th" ? "English" : "Thai"}`}
    >
      <span className="text-base">{current?.flag}</span>
      <span className="text-sm font-medium">{current?.label}</span>
    </Button>
  );
}
