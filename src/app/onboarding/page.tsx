"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  GraduationCap,
  Users,
  Wallet,
  Rocket,
  User,
  Home,
  Bell,
  BellRing,
  BellOff,
  Mail,
  Smartphone,
  LayoutDashboard,
  Sparkles,
  Crown,
  Check,
} from "lucide-react";

// Total steps
const TOTAL_STEPS = 9;

// Step definitions
const steps = {
  1: {
    message: "เหนื่อยกับชีวิตนักศึกษาไหม? ตารางยุ่ง งานกลุ่มเยอะ เงินหมด... Mai Lon จะช่วยให้ทุกอย่างไม่หลอน!",
    type: "welcome",
  },
  2: {
    message: "เป้าหมายหลักของคุณคืออะไร?",
    type: "options",
    options: [
      { id: "study", label: "จัดการเรียนให้เป็นระบบ", desc: "สรุปเลคเชอร์ ตารางเรียน", icon: GraduationCap, color: "bg-orange-100 text-orange-600" },
      { id: "teamwork", label: "งานกลุ่มราบรื่น", desc: "Kanban, แจ้งเตือนเพื่อน", icon: Users, color: "bg-blue-100 text-blue-600" },
      { id: "finance", label: "จัดการการเงิน", desc: "บันทึกรายจ่าย, งบประมาณ", icon: Wallet, color: "bg-purple-100 text-purple-600" },
      { id: "career", label: "เตรียมพร้อมอนาคต", desc: "Resume, หางาน", icon: Rocket, color: "bg-pink-100 text-pink-600" },
    ],
  },
  3: {
    message: "คุณใช้งานคนเดียวหรือเป็นกลุ่ม?",
    type: "options",
    options: [
      { id: "solo", label: "ใช้คนเดียว", desc: "จัดการทุกอย่างด้วยตัวเอง", icon: User, color: "bg-gray-100 text-gray-600" },
      { id: "friends", label: "ใช้กับเพื่อน", desc: "แชร์กับเพื่อนร่วมห้อง", icon: Users, color: "bg-blue-100 text-blue-600" },
      { id: "team", label: "ใช้กับทีมงานกลุ่ม", desc: "จัดการงานกลุ่มทั้งหมด", icon: Home, color: "bg-green-100 text-green-600" },
    ],
  },
  4: {
    message: "คุณเรียนอยู่ระดับไหน?",
    type: "options",
    options: [
      { id: "highschool", label: "มัธยมปลาย", desc: "ม.4 - ม.6", icon: GraduationCap, color: "bg-yellow-100 text-yellow-600" },
      { id: "bachelor", label: "ปริญญาตรี", desc: "ปี 1 - ปี 4+", icon: GraduationCap, color: "bg-blue-100 text-blue-600" },
      { id: "graduate", label: "ปริญญาโท/เอก", desc: "บัณฑิตศึกษา", icon: GraduationCap, color: "bg-purple-100 text-purple-600" },
      { id: "other", label: "อื่นๆ", desc: "เรียนรู้ตลอดชีวิต", icon: Sparkles, color: "bg-pink-100 text-pink-600" },
    ],
  },
  5: {
    message: "อยู่ที่ไหน? เราจะแสดงเวลาและสกุลเงินที่ถูกต้อง",
    type: "location",
  },
  6: {
    message: "ต้องการให้เตือนบ่อยแค่ไหน?",
    type: "options",
    options: [
      { id: "daily", label: "Keep me updated", desc: "Daily digest of upcoming renewals", icon: Bell, color: "bg-orange-100 text-orange-600" },
      { id: "important", label: "Just the important ones", desc: "Only urgent (24hr) + weekly summary", icon: BellRing, color: "bg-blue-100 text-blue-600" },
      { id: "none", label: "Don't remind me", desc: "I'll check manually", icon: BellOff, color: "bg-gray-100 text-gray-600" },
    ],
  },
  7: {
    message: "ส่งการแจ้งเตือนไปที่ไหน?",
    type: "channels",
    options: [
      { id: "email", label: "Email", desc: "Get reminders in your inbox", icon: Mail },
      { id: "push", label: "Push notifications", desc: "Set up in Settings after onboarding", icon: Smartphone },
      { id: "inApp", label: "In-app", desc: "See alerts in your dashboard", icon: LayoutDashboard },
    ],
  },
  8: {
    message: "สุดท้าย — เราควรเรียกคุณว่าอะไร?",
    type: "name",
  },
  9: {
    message: "เลือกแพลนที่เหมาะกับคุณ",
    type: "subscription",
  },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    goal: "",
    userType: "",
    education: "",
    timezone: "Asia/Bangkok",
    currency: "THB",
    reminderFrequency: "",
    channels: [] as string[],
    displayName: "",
    subscription: "free",
  });
  const supabase = createClient();

  useEffect(() => {
    const checkOnboarding = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.onboarding_complete) {
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    };
    checkOnboarding();
  }, [router, supabase.auth]);

  const step = steps[currentStep as keyof typeof steps];

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save onboarding data to localStorage (legacy/fast access)
      localStorage.setItem("onboarding_complete", "true");
      localStorage.setItem("onboarding_data", JSON.stringify(data));
      localStorage.setItem("show_celebration", "true");
      localStorage.setItem("show_welcome_toast", "true");

      // Save onboarding status to Supabase (permanent)
      await supabase.auth.updateUser({
        data: {
          onboarding_complete: true,
          display_name: data.displayName,
          onboarding_info: data
        }
      });

      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOptionSelect = (key: string, value: string) => {
    setData({ ...data, [key]: value });
    // Auto-advance after selection (except for channels and name)
    if (step.type === "options") {
      setTimeout(() => handleNext(), 300);
    }
  };

  const handleChannelToggle = (channel: string) => {
    setData((prevData) => ({
      ...prevData,
      channels: prevData.channels.includes(channel)
        ? prevData.channels.filter((c) => c !== channel)
        : [...prevData.channels, channel],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-muted rounded-full" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-background selection:bg-primary/20 font-line-seed flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {currentStep > 1 && (
            <button onClick={handleBack} className="absolute left-6 top-8 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                i + 1 <= currentStep ? "bg-primary" : "bg-gray-200"
              )}
            />
          ))}
        </div>

        {/* Mascot + Message */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-primary/10">
            <Image src="/logo.png" alt="Mai Lon" width={80} height={80} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-none p-4">
            <p className="text-foreground font-medium">{(step as any).message}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-4">
          {/* Welcome Step */}
          {step.type === "welcome" && (
            <div className="space-y-3 pt-8">
              <Button
                onClick={() => handleNext()}
                className="w-full h-14 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 text-white"
              >
                ช่วยฉันด้วย! 🙏
              </Button>
              <Button
                variant="outline"
                onClick={() => handleNext()}
                className="w-full h-14 rounded-2xl text-base font-medium"
              >
                แค่ดูๆ ก่อน
              </Button>
            </div>
          )}

          {/* Options Step */}
          {step.type === "options" && (step as any).options && (
            <div className="space-y-3">
              {(step as any).options.map((option: any) => {
                const Icon = option.icon;
                const fieldKey = currentStep === 2 ? "goal" : currentStep === 3 ? "userType" : currentStep === 4 ? "education" : "reminderFrequency";
                const isSelected = data[fieldKey as keyof typeof data] === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(fieldKey, option.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-100 hover:border-gray-200 bg-white"
                    )}
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", option.color)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Location Step */}
          {step.type === "location" && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Timezone</label>
                <select
                  value={data.timezone}
                  onChange={(e) => setData({ ...data, timezone: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground"
                >
                  <option value="Asia/Bangkok">Asia/Bangkok (GMT+07:00)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (GMT+09:00)</option>
                  <option value="America/New_York">America/New_York (GMT-05:00)</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1.5">เราตรวจจับอัตโนมัติ ถ้าไม่แน่ใจให้ใช้ค่าเริ่มต้น</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Currency</label>
                <select
                  value={data.currency}
                  onChange={(e) => setData({ ...data, currency: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground"
                >
                  <option value="THB">🇹🇭 THB - บาทไทย</option>
                  <option value="USD">🇺🇸 USD - US Dollar</option>
                  <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
                </select>
              </div>
              <Button onClick={() => handleNext()} className="w-full h-14 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 text-white mt-4">
                Continue
              </Button>
            </div>
          )}

          {/* Channels Step */}
          {step.type === "channels" && (step as any).options && (
            <div className="space-y-4">
              {(step as any).options.map((option: any) => {
                const Icon = option.icon;
                const isSelected = data.channels.includes(option.id);

                return (
                  <button
                    key={option.id}
                    onClick={() => handleChannelToggle(option.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left",
                      isSelected ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200 bg-white"
                    )}
                  >
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", isSelected ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500")}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                    <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all", isSelected ? "bg-primary border-primary" : "border-gray-300")}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                );
              })}
              <p className="text-xs text-muted-foreground text-center pt-2">You can change these anytime in settings</p>
              <Button onClick={() => handleNext()} className="w-full h-14 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 text-white mt-2">
                Continue
              </Button>
            </div>
          )}

          {/* Name Step */}
          {step.type === "name" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="ชื่อเล่นของคุณ"
                value={data.displayName}
                onChange={(e) => setData({ ...data, displayName: e.target.value })}
                className="w-full h-14 px-4 rounded-2xl border-2 border-gray-100 bg-white text-foreground text-lg focus:outline-none focus:border-primary transition-colors"
              />
              <Button
                onClick={handleNext}
                disabled={!data.displayName.trim()}
                className="w-full h-14 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Subscription Step */}
          {step.type === "subscription" && (
            <div className="space-y-4">
              {/* Pro Plan */}
              <button
                onClick={() => {
                  setData({ ...data, subscription: "pro" });
                  handleNext();
                }}
                className="w-full p-5 rounded-2xl border-2 border-primary bg-primary/5 text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  แนะนำ
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">Mai Lon Pro</p>
                    <p className="text-sm text-muted-foreground">฿99/เดือน</p>
                  </div>
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> AI สรุปเลคเชอร์ไม่จำกัด</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> สร้าง Resume แบบ Pro</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> ไม่มีโฆษณา</li>
                </ul>
              </button>

              {/* Free Plan */}
              <button
                onClick={() => {
                  setData({ ...data, subscription: "free" });
                  handleNext();
                }}
                className="w-full p-5 rounded-2xl border-2 border-gray-100 hover:border-gray-200 bg-white text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">Mai Lon Free</p>
                    <p className="text-sm text-muted-foreground">ฟรีตลอดไป</p>
                  </div>
                </div>
              </button>

              <p className="text-xs text-center text-muted-foreground pt-2">
                ตอนนี้คุณกำลังใช้แบบ <span className="font-semibold text-foreground">ฟรี</span> อยู่
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
