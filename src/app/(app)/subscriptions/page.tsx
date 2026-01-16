"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Plus,
  CreditCard,
  Calendar,
  TrendingUp,
  Clock,
  MoreVertical,
  Trash2,
  Edit3,
  Search,
  Filter,
  Bell,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";

const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

// Subscription categories
const subCategories = [
  { id: "streaming", name: "สตรีมมิ่ง", nameEn: "Streaming", icon: "🎬" },
  { id: "music", name: "เพลง", nameEn: "Music", icon: "🎵" },
  { id: "productivity", name: "Productivity", nameEn: "Productivity", icon: "💼" },
  { id: "gaming", name: "เกม", nameEn: "Gaming", icon: "🎮" },
  { id: "cloud", name: "Cloud Storage", nameEn: "Cloud", icon: "☁️" },
  { id: "education", name: "การศึกษา", nameEn: "Education", icon: "📚" },
  { id: "other", name: "อื่นๆ", nameEn: "Other", icon: "📦" },
];

// Billing cycles
const billingCycles = [
  { id: "monthly", name: "รายเดือน", nameEn: "Monthly" },
  { id: "yearly", name: "รายปี", nameEn: "Yearly" },
  { id: "weekly", name: "รายสัปดาห์", nameEn: "Weekly" },
];

interface Subscription {
  id: string;
  name: string;
  price: number;
  category: string;
  billingCycle: string;
  startDate: string;
  nextBillingDate: string;
  icon: string;
  color: string;
}

// Popular services for quick add
const popularServices = [
  { name: "Netflix", icon: "🎬", color: "bg-red-100", category: "streaming", price: 139 },
  { name: "Spotify", icon: "🎵", color: "bg-green-100", category: "music", price: 59 },
  { name: "YouTube Premium", icon: "▶️", color: "bg-red-100", category: "streaming", price: 159 },
  { name: "iCloud+", icon: "☁️", color: "bg-blue-100", category: "cloud", price: 35 },
  { name: "Disney+", icon: "🏰", color: "bg-blue-100", category: "streaming", price: 279 },
  { name: "Apple Music", icon: "🍎", color: "bg-pink-100", category: "music", price: 75 },
  { name: "Notion", icon: "📝", color: "bg-gray-100", category: "productivity", price: 0 },
  { name: "ChatGPT Plus", icon: "🤖", color: "bg-teal-100", category: "productivity", price: 700 },
];

export default function SubscriptionsPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "grid">("list");
  const [newSub, setNewSub] = useState({
    name: "",
    price: "",
    category: "streaming",
    billingCycle: "monthly",
    icon: "📦",
    color: "bg-gray-100",
  });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mailon_subscriptions");
    if (saved) setSubscriptions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mailon_subscriptions", JSON.stringify(subscriptions));
    }
  }, [subscriptions, mounted]);

  // Calculate stats
  const monthlyTotal = subscriptions.reduce((sum, s) => {
    if (s.billingCycle === "monthly") return sum + s.price;
    if (s.billingCycle === "yearly") return sum + s.price / 12;
    if (s.billingCycle === "weekly") return sum + s.price * 4;
    return sum;
  }, 0);

  const yearlyProjection = monthlyTotal * 12;
  const activeSubs = subscriptions.length;

  // Upcoming renewals (next 7 days)
  const upcomingRenewals = subscriptions.filter(s => {
    const nextDate = new Date(s.nextBillingDate);
    const now = new Date();
    const diff = (nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });

  const handleAddSubscription = () => {
    if (!newSub.name || !newSub.price) return;

    const today = new Date();
    let nextBilling = new Date();
    if (newSub.billingCycle === "monthly") {
      nextBilling.setMonth(nextBilling.getMonth() + 1);
    } else if (newSub.billingCycle === "yearly") {
      nextBilling.setFullYear(nextBilling.getFullYear() + 1);
    } else {
      nextBilling.setDate(nextBilling.getDate() + 7);
    }

    const sub: Subscription = {
      id: Date.now().toString(),
      name: newSub.name,
      price: Number(newSub.price),
      category: newSub.category,
      billingCycle: newSub.billingCycle,
      startDate: today.toISOString(),
      nextBillingDate: nextBilling.toISOString(),
      icon: newSub.icon,
      color: newSub.color,
    };

    setSubscriptions([sub, ...subscriptions]);
    setNewSub({ name: "", price: "", category: "streaming", billingCycle: "monthly", icon: "📦", color: "bg-gray-100" });
    setIsAddingNew(false);
  };

  const handleQuickAdd = (service: typeof popularServices[0]) => {
    setNewSub({
      name: service.name,
      price: String(service.price),
      category: service.category,
      billingCycle: "monthly",
      icon: service.icon,
      color: service.color,
    });
    setIsAddingNew(true);
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(s => s.id !== id));
  };

  const filteredSubs = subscriptions.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={cn("flex items-start justify-between", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {language === "th" ? "การสมัครสมาชิก" : "My Subscriptions"}
          </h1>
          <p className="text-muted-foreground">
            {language === "th" ? "จัดการและติดตามค่าสมาชิกรายเดือน" : "Manage and track your recurring payments"}
          </p>
        </div>
        <Button
          onClick={() => setIsAddingNew(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          {language === "th" ? "เพิ่มใหม่" : "Add Subscription"}
        </Button>
      </div>

      {/* View Mode Tabs */}
      <div className={cn("flex items-center gap-2", fadeInUp)} style={{ animationDelay: "50ms" }}>
        <div className="flex bg-muted rounded-xl p-1">
          {[
            { id: "list", label: language === "th" ? "รายการ" : "List" },
            { id: "calendar", label: language === "th" ? "ปฏิทิน" : "Calendar" },
            { id: "grid", label: language === "th" ? "กริด" : "Grid" },
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id as any)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                viewMode === mode.id
                  ? "bg-white dark:bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <Button variant="outline" size="sm" className="gap-2 rounded-xl">
          <Filter className="w-4 h-4" />
          {language === "th" ? "กรอง" : "Filters"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", fadeInUp)} style={{ animationDelay: "100ms" }}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{language === "th" ? "รายเดือน" : "Monthly Spend"}</p>
              <RefreshCw className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">฿{Math.round(monthlyTotal).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {activeSubs} {language === "th" ? "บริการ" : "active"} · {language === "th" ? "ต่อเดือน" : "per month"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{language === "th" ? "รายปี" : "Yearly Projection"}</p>
              <DollarSign className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">฿{Math.round(yearlyProjection).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{language === "th" ? "สมาชิก" : "Active Subs"}</p>
              <CreditCard className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">{activeSubs}</p>
            <p className="text-xs text-muted-foreground mt-1">{language === "th" ? "ทั้งหมด" : "total"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{language === "th" ? "ต่ออายุเร็วๆ นี้" : "Upcoming"}</p>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{upcomingRenewals.length}</p>
            <p className="text-xs text-muted-foreground mt-1">{language === "th" ? "ใน 7 วัน" : "in next 7 days"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Subscription Modal */}
      <Modal
        isOpen={isAddingNew}
        onClose={() => setIsAddingNew(false)}
        title={language === "th" ? "เพิ่มการสมัครใหม่" : "Add New Subscription"}
      >
        <div className="space-y-4">
          {/* Quick Add */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {language === "th" ? "เลือกบริการยอดนิยม" : "Quick Add Popular Services"}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {popularServices.slice(0, 8).map(service => (
                <button
                  key={service.name}
                  onClick={() => handleQuickAdd(service)}
                  className={cn("p-2 rounded-xl transition-all text-center", service.color, "hover:ring-2 hover:ring-primary")}
                >
                  <span className="text-xl">{service.icon}</span>
                  <p className="text-[9px] mt-1 font-medium truncate">{service.name}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === "th" ? "ชื่อบริการ" : "Service Name"}
              </label>
              <input
                type="text"
                value={newSub.name}
                onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                placeholder="Netflix"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === "th" ? "ราคา (บาท)" : "Price (THB)"}
              </label>
              <input
                type="number"
                value={newSub.price}
                onChange={(e) => setNewSub({ ...newSub, price: e.target.value })}
                placeholder="0"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === "th" ? "หมวดหมู่" : "Category"}
              </label>
              <select
                value={newSub.category}
                onChange={(e) => setNewSub({ ...newSub, category: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              >
                {subCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {language === "th" ? cat.name : cat.nameEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === "th" ? "รอบการชำระ" : "Billing Cycle"}
              </label>
              <select
                value={newSub.billingCycle}
                onChange={(e) => setNewSub({ ...newSub, billingCycle: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              >
                {billingCycles.map(cycle => (
                  <option key={cycle.id} value={cycle.id}>
                    {language === "th" ? cycle.name : cycle.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsAddingNew(false)} className="flex-1 rounded-xl">
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </Button>
            <Button onClick={handleAddSubscription} className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl">
              {language === "th" ? "บันทึก" : "Save"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === "th" ? "ค้นหา..." : "Search subscriptions..."}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-foreground"
        />
      </div>

      {/* Subscriptions List */}
      <Card className={cn(fadeInUp)} style={{ animationDelay: "200ms" }}>
        <CardContent className="p-0">
          {filteredSubs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground text-lg">
                {language === "th" ? "ยังไม่มีการสมัครสมาชิก" : "No subscriptions yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                {language === "th" 
                  ? "เริ่มติดตามค่าสมาชิกรายเดือนและไม่พลาดวันต่ออายุ" 
                  : "Start tracking your recurring payments and never miss a renewal date"}
              </p>
              <Button
                onClick={() => setIsAddingNew(true)}
                className="mt-6 bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                {language === "th" ? "เพิ่มการสมัครแรก" : "Add Your First Subscription"}
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredSubs.map((sub) => {
                const cat = subCategories.find(c => c.id === sub.category);
                const daysUntilRenewal = Math.ceil(
                  (new Date(sub.nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div key={sub.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", sub.color)}>
                      <span className="text-2xl">{sub.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{sub.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {cat?.icon} {language === "th" ? cat?.name : cat?.nameEn} · {
                          billingCycles.find(c => c.id === sub.billingCycle)?.[language === "th" ? "name" : "nameEn"]
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">฿{sub.price.toLocaleString()}</p>
                      <p className={cn(
                        "text-xs",
                        daysUntilRenewal <= 3 ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {daysUntilRenewal <= 0 
                          ? (language === "th" ? "ถึงวัน!" : "Due today!")
                          : `${daysUntilRenewal} ${language === "th" ? "วัน" : "days"}`}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteSubscription(sub.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          {language === "th" ? "ลบ" : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
