"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Bell,
  Smartphone,
  Download,
  Sparkles,
  Shield,
  Trash2,
  ChevronRight,
  X,
} from "lucide-react";

const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [currency, setCurrency] = useState("THB");
  const [timezone, setTimezone] = useState("Asia/Bangkok");
  const [monthlyBudget, setMonthlyBudget] = useState("5000");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");
  const [profilePicture, setProfilePicture] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser({ email: user.email });
      }
    };
    loadUser();

    const onboardingData = localStorage.getItem("onboarding_data");
    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      setDisplayName(data.displayName || "");
      setCurrency(data.currency || "THB");
      setTimezone(data.timezone || "Asia/Bangkok");
    }

    const settings = localStorage.getItem("mailon_settings");
    if (settings) {
      const data = JSON.parse(settings);
      setMonthlyBudget(data.monthlyBudget || "5000");
      setReduceMotion(data.reduceMotion || false);
    }

    const savedProfilePicture = localStorage.getItem("mailon_profile_picture");
    if (savedProfilePicture) {
      setProfilePicture(savedProfilePicture);
    }
  }, [supabase.auth]);

  const saveToLocalStorage = (key: string, value: string | number | boolean) => {
    if (key === "displayName" || key === "currency" || key === "timezone") {
      const onboardingData = localStorage.getItem("onboarding_data");
      const data = onboardingData ? JSON.parse(onboardingData) : {};
      data[key] = value;
      localStorage.setItem("onboarding_data", JSON.stringify(data));
    }
    
    if (key === "monthlyBudget" || key === "reduceMotion") {
      const settings = localStorage.getItem("mailon_settings");
      const data = settings ? JSON.parse(settings) : {};
      data[key] = value;
      localStorage.setItem("mailon_settings", JSON.stringify(data));
    }
  };

  const handleSaveName = () => {
    saveToLocalStorage("displayName", displayName);
    toast.success(t("toast.nameUpdated"), {
      description: `${t("toast.nameUpdatedDesc")} "${displayName}"`,
    });
  };

  const handleSaveCurrency = () => {
    saveToLocalStorage("currency", currency);
    toast.success(t("toast.currencyUpdated"), {
      description: `${t("toast.currencyUpdatedDesc")} ${currency}`,
    });
  };

  const handleSaveTimezone = () => {
    saveToLocalStorage("timezone", timezone);
    toast.success(t("toast.timezoneUpdated"), {
      description: `${t("toast.timezoneUpdatedDesc")} ${timezone}`,
    });
  };

  const handleSaveBudget = () => {
    saveToLocalStorage("monthlyBudget", monthlyBudget);
    toast.success(t("toast.budgetSaved"), {
      description: `${t("toast.budgetSavedDesc")} ฿${Number(monthlyBudget).toLocaleString()}`,
    });
  };

  const handleToggleReduceMotion = () => {
    const newValue = !reduceMotion;
    setReduceMotion(newValue);
    saveToLocalStorage("reduceMotion", newValue);
    toast.success(newValue ? t("toast.reduceMotionEnabled") : t("toast.reduceMotionDisabled"), {
      description: newValue ? t("toast.animationsMinimized") : t("toast.animationsEnabled"),
    });
  };

  const handleClearCache = () => {
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
    toast.success(t("toast.cacheCleared"), {
      description: t("toast.cacheClearedDesc"),
    });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "confirm delete account") {
      toast.error(t("toast.confirmError"));
      return;
    }
    await supabase.auth.signOut();
    localStorage.clear();
    toast.success(t("toast.accountDeleted"), {
      description: t("toast.accountDeletedDesc"),
    });
    router.push("/");
  };

  const handleExportData = () => {
    const data = {
      user: user,
      preferences: { displayName, currency, timezone, monthlyBudget, reduceMotion },
      exportedAt: new Date().toISOString(),
    };
    
    if (exportFormat === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mailon-data-export.json";
      a.click();
    } else {
      const csvContent = `Field,Value\nName,${displayName}\nEmail,${user?.email || ""}\nCurrency,${currency}\nTimezone,${timezone}\nMonthly Budget,${monthlyBudget}\nExported At,${new Date().toISOString()}`;
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mailon-data-export.csv";
      a.click();
    }
    
    toast.success(t("toast.dataExported"), {
      description: `${t("toast.dataExportedDesc")} ${exportFormat.toUpperCase()}`,
    });
  };

  const handleConfigureSecurity = () => toast.info(t("toast.comingSoon"), { description: t("toast.securityComingSoon") });
  const handleConfigureNotifications = () => toast.info(t("toast.comingSoon"), { description: t("toast.notificationsComingSoon") });
  const handleManageDevices = () => toast.info(t("toast.comingSoon"), { description: t("toast.devicesComingSoon") });

  if (!mounted) return null;

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        localStorage.setItem("mailon_profile_picture", base64);
        setProfilePicture(base64);
        // Trigger event for AppHeader to update
        window.dispatchEvent(new Event("storage"));
        toast.success(t("toast.profileUpdated"), {
          description: t("toast.profileUpdatedDesc"),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="p-4 md:p-6 space-y-8">
        {/* Header */}
        <div className={cn(fadeInUp)} style={{ animationDelay: "0ms" }}>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("settings.title")}</h1>
          <p className="text-muted-foreground">{t("settings.subtitle")}</p>
        </div>

        {/* Profile Picture */}
        <div className={cn("py-4 border-b", fadeInUp)} style={{ animationDelay: "25ms" }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{t("settings.profilePicture")}</h3>
              <p className="text-sm text-muted-foreground">{t("settings.profilePicture.description")}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-background shadow-lg">
                  <Image 
                    src={profilePicture || "/logo.png"} 
                    alt="Profile" 
                    width={80} 
                    height={80} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <label 
                  htmlFor="profile-upload" 
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
                <input 
                  id="profile-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleProfilePictureChange}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => document.getElementById("profile-upload")?.click()}
              >
                {t("settings.changePhoto")}
              </Button>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className={cn("space-y-2", fadeInUp)} style={{ animationDelay: "50ms" }}>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 py-4 border-b">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{t("settings.name")}</h3>
              <p className="text-sm text-muted-foreground">{t("settings.name.description")}</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full md:w-64 h-10 px-3 rounded-lg border border-input bg-background text-foreground" placeholder={t("settings.name.placeholder")} maxLength={32} />
              <Button variant="outline" size="sm" onClick={handleSaveName}>{t("settings.saveChanges")}</Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{t("settings.name.max")}</p>
        </div>

        {/* Base Currency */}
        <div className={cn("py-4 border-b", fadeInUp)} style={{ animationDelay: "100ms" }}>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{t("settings.currency")}</h3>
              <p className="text-sm text-muted-foreground">{t("settings.currency.description")}</p>
            </div>
            <div className="flex items-center gap-2">
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full md:w-64 h-10 px-3 rounded-lg border border-input bg-background text-foreground">
                <option value="THB">🇹🇭 THB - Thai Baht</option>
                <option value="USD">🇺🇸 USD - US Dollar</option>
                <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
              </select>
              <Button variant="outline" size="sm" onClick={handleSaveCurrency}>{t("settings.saveChanges")}</Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{t("settings.currency.note").replace("{currency}", currency)}</p>
        </div>

        {/* Timezone */}
        <div className={cn("py-4 border-b", fadeInUp)} style={{ animationDelay: "150ms" }}>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{t("settings.timezone")}</h3>
              <p className="text-sm text-muted-foreground">{t("settings.timezone.description")}</p>
            </div>
            <div className="flex items-center gap-2">
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full md:w-64 h-10 px-3 rounded-lg border border-input bg-background text-foreground">
                <option value="Asia/Bangkok">Asia/Bangkok (GMT+07:00)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (GMT+09:00)</option>
                <option value="America/New_York">America/New_York (GMT-05:00)</option>
              </select>
              <Button variant="outline" size="sm" onClick={handleSaveTimezone}>{t("settings.saveChanges")}</Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{t("settings.timezone.note")}</p>
        </div>

        {/* Monthly Budget */}
        <div className={cn("py-4 border-b", fadeInUp)} style={{ animationDelay: "200ms" }}>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{t("settings.budget")}</h3>
              <p className="text-sm text-muted-foreground">{t("settings.budget.description")}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">฿</span>
                <input type="number" value={monthlyBudget} onChange={(e) => setMonthlyBudget(e.target.value)} className="w-full md:w-64 h-10 pl-7 pr-3 rounded-lg border border-input bg-background text-foreground" />
              </div>
              <Button variant="outline" size="sm" onClick={handleSaveBudget}>{t("settings.budget.save")}</Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{t("settings.budget.total")} ฿0.00 • <span className="text-primary cursor-pointer">{t("settings.budget.edit")}</span></p>
        </div>

        {/* Security */}
        <div className={cn("py-4 border-b flex items-center justify-between", fadeInUp)} style={{ animationDelay: "250ms" }}>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Shield className="w-4 h-4" />{t("settings.security")}</h3>
            <p className="text-sm text-muted-foreground">{t("settings.security.description")}</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleConfigureSecurity}>{t("settings.configure")} <ChevronRight className="w-4 h-4" /></Button>
        </div>

        {/* Notification Preferences */}
        <div className={cn("py-4 border-b flex items-center justify-between", fadeInUp)} style={{ animationDelay: "300ms" }}>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Bell className="w-4 h-4" />{t("settings.notifications")}</h3>
            <p className="text-sm text-muted-foreground">{t("settings.notifications.description")}</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleConfigureNotifications}>{t("settings.configure")} <ChevronRight className="w-4 h-4" /></Button>
        </div>

        {/* Push Notification Devices */}
        <div className={cn("py-4 border-b flex items-center justify-between", fadeInUp)} style={{ animationDelay: "350ms" }}>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Smartphone className="w-4 h-4" />{t("settings.push")}</h3>
            <p className="text-sm text-muted-foreground">{t("settings.push.description")}</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleManageDevices}>{t("settings.manage")} <ChevronRight className="w-4 h-4" /></Button>
        </div>

        {/* Export Your Data */}
        <div className={cn("py-4 border-b", fadeInUp)} style={{ animationDelay: "400ms" }}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2"><Download className="w-4 h-4" />{t("settings.export")}</h3>
              <p className="text-sm text-muted-foreground">{t("settings.export.description")}</p>
            </div>
            <Button onClick={handleExportData} className="bg-primary hover:bg-primary/90 text-white gap-2"><Download className="w-4 h-4" />{t("settings.export.button")}</Button>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">{t("settings.export.format")}</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="export" checked={exportFormat === "json"} onChange={() => setExportFormat("json")} />
                <span className={exportFormat === "json" ? "text-primary" : ""}>{t("settings.export.json")}</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="radio" name="export" checked={exportFormat === "csv"} onChange={() => setExportFormat("csv")} />
                <span className={exportFormat === "csv" ? "text-primary" : ""}>{t("settings.export.csv")}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Reduce Motion */}
        <div className={cn("py-4 border-b flex items-center justify-between", fadeInUp)} style={{ animationDelay: "450ms" }}>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Sparkles className="w-4 h-4" />{t("settings.reduceMotion")}</h3>
            <p className="text-sm text-muted-foreground">{t("settings.reduceMotion.description")}</p>
          </div>
          <button onClick={handleToggleReduceMotion} className={cn("w-12 h-6 rounded-full relative transition-colors", reduceMotion ? "bg-primary" : "bg-muted")}>
            <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform", reduceMotion ? "left-6" : "left-0.5")} />
          </button>
        </div>

        {/* Clear Cache */}
        <div className={cn("py-4 border-b", fadeInUp)} style={{ animationDelay: "500ms" }}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">{t("settings.clearCache")} <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{t("settings.pwaActive")}</span></h3>
              <p className="text-sm text-muted-foreground">{t("settings.clearCache.description")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("settings.clearCache.items")}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearCache}>{t("settings.clearCache")}</Button>
          </div>
        </div>

        {/* Delete Account */}
        <div className={cn("py-4", fadeInUp)} style={{ animationDelay: "550ms" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2"><Trash2 className="w-4 h-4 text-destructive" />{t("settings.deleteAccount")}</h3>
              <p className="text-sm text-muted-foreground">{t("settings.deleteAccount.description")}</p>
            </div>
          </div>

          {/* Delete Card */}
          <Card className="border-2 border-destructive/30 bg-destructive/5 rounded-2xl max-w-xl">
            <CardContent className="pt-4">
              <p className="font-semibold text-foreground mb-2">{t("settings.deleteAccount.confirm")}</p>
              <p className="text-sm text-muted-foreground mb-4">{t("settings.deleteAccount.warning")}</p>
              <Button variant="destructive" size="sm" className="gap-2 rounded-xl" onClick={() => setShowDeleteModal(true)}>
                <Trash2 className="w-4 h-4" />{t("settings.deleteAccount")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }} />
          
          <div className="relative bg-background rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10">
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-background shadow-lg">
                <Image src="/logo.png" alt="User" width={80} height={80} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{t("settings.deleteAccount")}</h2>
              <p className="text-muted-foreground"><span className="font-semibold text-destructive">{t("settings.deleteAccount.modalWarning")}</span> {t("settings.deleteAccount.modalText")}</p>
            </div>

            <div className="bg-primary p-6">
              <p className="text-white/90 text-center mb-4">{t("settings.deleteAccount.verify")} <span className="font-bold">{t("settings.deleteAccount.verifyText")}</span> {t("settings.deleteAccount.below")}</p>
              <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} placeholder={t("settings.deleteAccount.verifyText")} className="w-full h-12 px-4 rounded-xl border-2 border-white/20 bg-white text-foreground text-center focus:outline-none focus:border-white/50 transition-colors mb-4" />
              <Button variant="destructive" className="w-full h-12 rounded-xl text-base font-semibold bg-red-500 hover:bg-red-600" onClick={handleDeleteAccount} disabled={deleteConfirmText !== "confirm delete account"}>
                {t("settings.deleteAccount.confirmButton")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
