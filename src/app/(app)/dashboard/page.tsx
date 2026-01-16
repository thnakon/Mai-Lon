"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import confetti from "canvas-confetti";
import {
  GraduationCap,
  Users,
  Wallet,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  ArrowRight,
  Plus,
  CreditCard,
  BookOpen,
  FolderKanban,
  Flame,
  Trophy,
  AlertCircle,
} from "lucide-react";

const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

interface Task { id: string; status: string; createdAt: string; }
interface LectureNote { id: string; status: string; }
interface Expense { id: string; amount: number; category: string; description: string; date: string; }
interface Subscription { id: string; name: string; price: number; nextBilling: string; status: string; }
interface Exam { id: string; name: string; date: string; time: string; room: string; }
interface UserStats { streak: number; totalXP: number; level: number; }

export default function DashboardPage() {
  const [displayName, setDisplayName] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const { t, language } = useLanguage();
  
  // Real data states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<LectureNote[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({ streak: 0, totalXP: 0, level: 1 });

  useEffect(() => {
    setMounted(true);
    
    // Get onboarding data
    const onboardingData = localStorage.getItem("onboarding_data");
    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      setDisplayName(data.displayName || "");
    }

    // Load real data from localStorage
    const savedTasks = localStorage.getItem("mailon_tasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));

    const savedNotes = localStorage.getItem("mailon_lecture_notes");
    if (savedNotes) setNotes(JSON.parse(savedNotes));

    const savedExpenses = localStorage.getItem("mailon_wallet_expenses");
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

    const savedSubs = localStorage.getItem("mailon_subscriptions");
    if (savedSubs) setSubscriptions(JSON.parse(savedSubs));

    const savedExams = localStorage.getItem("mailon_exams");
    if (savedExams) setExams(JSON.parse(savedExams));

    const savedStats = localStorage.getItem("mailon_user_stats");
    if (savedStats) setUserStats(JSON.parse(savedStats));

    // Check for celebration
    const shouldCelebrate = localStorage.getItem("show_celebration");
    if (shouldCelebrate === "true") {
      localStorage.removeItem("show_celebration");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D97706", "#FBBF24", "#F59E0B", "#EAB308", "#ffffff"],
      });
    }
  }, []);

  // Calculate stats from real data
  const activeTasks = tasks.filter(t => t.status === "in-progress" || t.status === "todo").length;
  const completedTasksThisWeek = tasks.filter(t => {
    if (t.status !== "done") return false;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return new Date(t.createdAt).getTime() > weekAgo;
  }).length;

  const lectureNotesCount = notes.filter(n => n.status === "completed").length;

  // Calculate this month's expenses
  const now = new Date();
  const thisMonthExpenses = expenses.filter(e => {
    const expDate = new Date(e.date);
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Calculate last month's expenses for comparison
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  const lastMonthExpenses = expenses.filter(e => {
    const expDate = new Date(e.date);
    return expDate.getMonth() === lastMonth.getMonth() && expDate.getFullYear() === lastMonth.getFullYear();
  });
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const changePercent = lastMonthTotal > 0 ? Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100) : 0;

  // Budget settings
  const budget = 15000; // Default budget
  const budgetPercent = Math.min(Math.round((thisMonthTotal / budget) * 100), 100);
  const daysRemaining = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
  const projectedSpend = Math.round((thisMonthTotal / now.getDate()) * new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());

  // Active subscriptions
  const activeSubscriptions = subscriptions.filter(s => s.status === "active");
  const monthlySubsTotal = activeSubscriptions.reduce((sum, s) => sum + s.price, 0);

  // Upcoming exams (within 30 days)
  const upcomingExams = exams
    .filter(e => {
      const examDate = new Date(e.date);
      const daysUntil = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 30;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Next deadline
  const nextExam = upcomingExams[0];
  const daysUntilNext = nextExam ? Math.ceil((new Date(nextExam.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={cn("flex items-start justify-between", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden">
            <Image src="/logo.png" alt="Mai Lon" width={56} height={56} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {t("dashboard.welcome")} {displayName || "User"}!
            </h1>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">{userStats.streak} {language === "th" ? "วัน Streak" : "day streak"}</span>
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Lv.{userStats.level}</span>
              </span>
            </div>
          </div>
        </div>
        <Link href="/projects">
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl hidden md:flex">
            <Plus className="w-4 h-4" />
            {t("dashboard.addTask")}
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", fadeInUp)} style={{ animationDelay: "100ms" }}>
        {/* Active Tasks */}
        <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{t("dashboard.activeTasks")}</p>
              <FolderKanban className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{activeTasks}</p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +{completedTasksThisWeek} {t("dashboard.thisWeek")}
            </p>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{language === "th" ? "Streak" : "Streak"}</p>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{userStats.streak}</p>
            <p className="text-xs text-muted-foreground">{language === "th" ? "วันติดต่อกัน 🔥" : "consecutive days 🔥"}</p>
          </CardContent>
        </Card>

        {/* Lecture Notes */}
        <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{t("dashboard.lectureNotes")}</p>
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{lectureNotesCount}</p>
            <p className="text-xs text-muted-foreground">{t("dashboard.aiSummaries")}</p>
          </CardContent>
        </Card>

        {/* Next Deadline */}
        <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{t("dashboard.nextDeadline")}</p>
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            {nextExam ? (
              <>
                <p className="text-3xl font-bold text-foreground mb-1">{daysUntilNext} {t("dashboard.days")}</p>
                <p className="text-xs text-muted-foreground truncate">{nextExam.name}</p>
              </>
            ) : (
              <>
                <p className="text-3xl font-bold text-foreground mb-1">-</p>
                <p className="text-xs text-muted-foreground">{language === "th" ? "ไม่มีกำหนดส่ง" : "No upcoming"}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className={cn("grid md:grid-cols-2 gap-6", fadeInUp)} style={{ animationDelay: "200ms" }}>
        {/* Monthly Budget */}
        <Card className="border-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {t("dashboard.monthlyBudget")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{t("dashboard.trackBudget")}</p>
              </div>
              <Link href="/wallet" className="text-sm text-muted-foreground hover:text-foreground">
                {t("dashboard.budget")} ฿{budget.toLocaleString()}
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-2xl font-bold">฿{thisMonthTotal.toLocaleString()} {t("dashboard.of")} ฿{budget.toLocaleString()}</p>
                <span className="text-sm text-muted-foreground">{budgetPercent}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    budgetPercent > 80 ? "bg-red-500" : budgetPercent > 50 ? "bg-yellow-500" : "bg-green-500"
                  )} 
                  style={{ width: `${budgetPercent}%` }} 
                />
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("dashboard.vsLastMonth")}</span>
                <span className={cn("flex items-center gap-1", changePercent > 0 ? "text-red-500" : "text-green-500")}>
                  {changePercent > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {changePercent > 0 ? "+" : ""}{changePercent}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("dashboard.daysRemaining")}</span>
                <span className="font-medium">{daysRemaining} {t("dashboard.days")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("dashboard.monthlyProjection")}</span>
                <span className="font-medium">฿{projectedSpend.toLocaleString()}</span>
              </div>
            </div>

            {/* Tip */}
            <div className={cn(
              "flex items-center gap-2 p-3 rounded-xl",
              budgetPercent > 80 
                ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
            )}>
              {budgetPercent > 80 ? <AlertCircle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              <p className="text-sm">
                {budgetPercent > 80 
                  ? (language === "th" ? "ใช้ไปเยอะแล้ว ระวังงบไม่พอนะ!" : "Watch out! You've used most of your budget.")
                  : t("dashboard.budgetTip")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card className="border-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{language === "th" ? "สอบที่กำลังจะมา" : "Upcoming Exams"}</CardTitle>
                <p className="text-sm text-muted-foreground">{language === "th" ? "ภายใน 30 วัน" : "Within 30 days"}</p>
              </div>
              <Link href="/schedule" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                {t("dashboard.viewAll")} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingExams.length > 0 ? (
              <div className="space-y-3">
                {upcomingExams.map(exam => {
                  const examDate = new Date(exam.date);
                  const daysUntil = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={exam.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          daysUntil <= 7 ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
                        )}>
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{exam.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {examDate.toLocaleDateString(language === "th" ? "th-TH" : "en-US", { 
                              day: "numeric", month: "short" 
                            })} · {exam.time} · {exam.room}
                          </p>
                        </div>
                      </div>
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        daysUntil <= 7 ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"
                      )}>
                        {daysUntil} {language === "th" ? "วัน" : "days"}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-24 h-24 mb-4">
                  <Image src="/logo.png" alt="No exams" width={96} height={96} className="opacity-50" />
                </div>
                <p className="text-muted-foreground text-center">
                  {language === "th" ? "ไม่มีสอบใน 30 วันนี้ 🎉" : "No exams in the next 30 days 🎉"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Subscriptions */}
      <Card className={cn("border-2", fadeInUp)} style={{ animationDelay: "300ms" }}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {t("dashboard.activeSubscriptions")}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {activeSubscriptions.length} {language === "th" ? "บริการ" : "services"} · ฿{monthlySubsTotal.toLocaleString()}/{language === "th" ? "เดือน" : "mo"}
              </p>
            </div>
            <Link href="/subscriptions" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              {t("settings.manage")} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {activeSubscriptions.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {activeSubscriptions.slice(0, 4).map(sub => (
                <div key={sub.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{sub.name}</p>
                    <p className="text-xs text-muted-foreground">฿{sub.price}/{language === "th" ? "เดือน" : "mo"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{t("dashboard.maiLonFree")}</p>
                  <p className="text-xs text-muted-foreground">{t("dashboard.basicFeatures")}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-muted-foreground">฿0.00/mo</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Zone Cards */}
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", fadeInUp)} style={{ animationDelay: "400ms" }}>
        {[
          { title: t("dashboard.academic"), subtitle: t("dashboard.academicSub"), icon: GraduationCap, color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400", href: "/schedule" },
          { title: t("dashboard.teamwork"), subtitle: t("dashboard.teamworkSub"), icon: Users, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", href: "/projects" },
          { title: t("dashboard.wallet"), subtitle: t("dashboard.walletSub"), icon: Wallet, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", href: "/wallet" },
          { title: t("dashboard.schedule"), subtitle: t("dashboard.scheduleSub"), icon: Calendar, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", href: "/schedule" },
        ].map((zone) => (
          <Link key={zone.title} href={zone.href}>
            <Card className="h-full border-2 hover:border-primary/30 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className={cn("w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center", zone.color)}>
                  <zone.icon className="w-6 h-6" />
                </div>
                <p className="font-semibold">{zone.title}</p>
                <p className="text-xs text-muted-foreground">{zone.subtitle}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
