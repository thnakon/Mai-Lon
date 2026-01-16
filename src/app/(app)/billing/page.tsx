"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Receipt,
  CreditCard,
  Crown,
  Download,
  Calendar,
  TrendingUp,
  Check,
  Sparkles,
} from "lucide-react";

const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

// Mock billing data
const billingHistory = [
  { id: 1, date: "2026-01-15", amount: 0, description: "Mai Lon Free", status: "active" },
];

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceLabel: "ฟรีตลอด",
    features: [
      "จัดการรายจ่าย",
      "ตารางเรียน",
      "สิทธิพิเศษนักศึกษา",
      "แบ่งจ่ายเพื่อน",
    ],
    featuresEn: [
      "Expense tracking",
      "Class schedule",
      "Student privileges",
      "Split with friends",
    ],
    current: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    priceLabel: "฿99/เดือน",
    features: [
      "ทุกอย่างใน Free",
      "AI สรุปเลคเชอร์ไม่จำกัด",
      "สร้าง Resume AI",
      "ไม่มีโฆษณา",
      "Priority Support",
    ],
    featuresEn: [
      "Everything in Free",
      "Unlimited AI lecture summaries",
      "AI Resume builder",
      "Ad-free experience",
      "Priority Support",
    ],
    current: false,
    recommended: true,
  },
];

export default function BillingPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("free");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mailon_plan");
    if (saved) setCurrentPlan(saved);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mailon_plan", currentPlan);
    }
  }, [currentPlan, mounted]);

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={cn("flex items-start justify-between", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {language === "th" ? "การเรียกเก็บเงิน" : "Billing"}
          </h1>
          <p className="text-muted-foreground">
            {language === "th" ? "จัดการแผนสมาชิกและประวัติการชำระเงิน" : "Manage your subscription and payment history"}
          </p>
        </div>
      </div>

      {/* Current Plan */}
      <Card className={cn("border-2 border-primary/20 bg-primary/5", fadeInUp)} style={{ animationDelay: "100ms" }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {currentPlan === "pro" ? (
                  <Crown className="w-6 h-6 text-primary" />
                ) : (
                  <Sparkles className="w-6 h-6 text-primary" />
                )}
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  {language === "th" ? "แผนปัจจุบัน" : "Current Plan"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Mai Lon {currentPlan === "pro" ? "Pro" : "Free"}
              </h2>
              <p className="text-muted-foreground mt-1">
                {currentPlan === "pro" 
                  ? (language === "th" ? "ต่ออายุ 15 ก.พ. 2026" : "Renews Feb 15, 2026")
                  : (language === "th" ? "ใช้งานได้ตลอดไป" : "Free forever")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">
                ฿{currentPlan === "pro" ? "99" : "0"}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === "th" ? "ต่อเดือน" : "per month"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", fadeInUp)} style={{ animationDelay: "200ms" }}>
        {plans.map(plan => (
          <Card
            key={plan.id}
            className={cn(
              "relative overflow-hidden transition-all",
              plan.recommended && "border-2 border-primary shadow-lg",
              currentPlan === plan.id && "ring-2 ring-primary ring-offset-2"
            )}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                {language === "th" ? "แนะนำ" : "Recommended"}
              </div>
            )}
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {plan.price === 0 ? (language === "th" ? "ฟรี" : "Free") : `฿${plan.price}`}
                  {plan.price > 0 && (
                    <span className="text-base font-normal text-muted-foreground">
                      /{language === "th" ? "เดือน" : "mo"}
                    </span>
                  )}
                </p>
              </div>
              <ul className="space-y-3 mb-6">
                {(language === "th" ? plan.features : plan.featuresEn).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {currentPlan === plan.id ? (
                <Button disabled className="w-full rounded-xl">
                  {language === "th" ? "แผนปัจจุบัน" : "Current Plan"}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentPlan(plan.id)}
                  className={cn(
                    "w-full rounded-xl",
                    plan.id === "pro" 
                      ? "bg-primary hover:bg-primary/90 text-white" 
                      : "bg-muted text-foreground hover:bg-muted/80"
                  )}
                >
                  {plan.id === "pro" 
                    ? (language === "th" ? "อัปเกรดเป็น Pro" : "Upgrade to Pro")
                    : (language === "th" ? "ดาวน์เกรด" : "Downgrade")}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment History */}
      <Card className={cn(fadeInUp)} style={{ animationDelay: "300ms" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            {language === "th" ? "ประวัติการชำระเงิน" : "Payment History"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {billingHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {language === "th" ? "ยังไม่มีประวัติการชำระเงิน" : "No payment history yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {billingHistory.map(bill => (
                <div key={bill.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{bill.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(bill.date).toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">฿{bill.amount}</p>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                      {language === "th" ? "ใช้งานอยู่" : "Active"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className={cn(fadeInUp)} style={{ animationDelay: "400ms" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {language === "th" ? "วิธีการชำระเงิน" : "Payment Method"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {language === "th" ? "ยังไม่ได้เพิ่มวิธีการชำระเงิน" : "No payment method added"}
            </p>
            <Button variant="outline" className="mt-4 rounded-xl gap-2">
              <Plus className="w-4 h-4" />
              {language === "th" ? "เพิ่มบัตร" : "Add Card"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14"/>
      <path d="M12 5v14"/>
    </svg>
  );
}
