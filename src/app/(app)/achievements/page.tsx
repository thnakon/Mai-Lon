"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Trophy,
  Star,
  Flame,
  Target,
  BookOpen,
  Wallet,
  Users,
  Calendar,
  Sparkles,
  Lock,
  CheckCircle2,
  Zap,
  Crown,
  Medal,
  Award,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

interface Achievement {
  id: string;
  icon: any;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: "learning" | "finance" | "social" | "productivity" | "special";
  xp: number;
  requirement: string;
  requirementEn: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface UserStats {
  totalXP: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  tasksCompleted: number;
  expensesLogged: number;
  notesCreated: number;
  projectsCreated: number;
  aiChats: number;
}

// Achievement definitions
const achievementsList: Omit<Achievement, "unlocked" | "unlockedAt" | "progress">[] = [
  // Learning
  { id: "first_note", icon: BookOpen, name: "นักเรียนใหม่", nameEn: "First Steps", description: "สร้างโน้ตบทเรียนแรก", descriptionEn: "Create your first lecture note", category: "learning", xp: 50, requirement: "สร้างโน้ต 1 อัน", requirementEn: "Create 1 note" },
  { id: "note_master", icon: Sparkles, name: "ยอดนักสรุป", nameEn: "Note Master", description: "สร้างโน้ตบทเรียน 10 อัน", descriptionEn: "Create 10 lecture notes", category: "learning", xp: 200, requirement: "สร้างโน้ต 10 อัน", requirementEn: "Create 10 notes", maxProgress: 10 },
  { id: "citation_pro", icon: Award, name: "นักอ้างอิง", nameEn: "Citation Pro", description: "เพิ่มแหล่งอ้างอิง 5 รายการ", descriptionEn: "Add 5 citation sources", category: "learning", xp: 100, requirement: "เพิ่มอ้างอิง 5 รายการ", requirementEn: "Add 5 citations", maxProgress: 5 },
  { id: "schedule_keeper", icon: Calendar, name: "ตรงเวลา", nameEn: "Schedule Keeper", description: "เพิ่มวิชาเรียน 5 วิชา", descriptionEn: "Add 5 classes to schedule", category: "learning", xp: 100, requirement: "เพิ่มวิชา 5 วิชา", requirementEn: "Add 5 classes", maxProgress: 5 },

  // Finance
  { id: "budget_tracker", icon: Wallet, name: "นักบัญชี", nameEn: "Budget Tracker", description: "บันทึกค่าใช้จ่ายครั้งแรก", descriptionEn: "Log your first expense", category: "finance", xp: 50, requirement: "บันทึกค่าใช้จ่าย 1 รายการ", requirementEn: "Log 1 expense" },
  { id: "money_master", icon: TrendingUp, name: "เจ้าแห่งการเงิน", nameEn: "Money Master", description: "บันทึกค่าใช้จ่าย 50 รายการ", descriptionEn: "Log 50 expenses", category: "finance", xp: 300, requirement: "บันทึกค่าใช้จ่าย 50 รายการ", requirementEn: "Log 50 expenses", maxProgress: 50 },
  { id: "subscription_manager", icon: Zap, name: "จัดการ Subscription", nameEn: "Sub Manager", description: "เพิ่ม subscription 3 รายการ", descriptionEn: "Add 3 subscriptions", category: "finance", xp: 100, requirement: "เพิ่ม subscription 3 รายการ", requirementEn: "Add 3 subscriptions", maxProgress: 3 },
  { id: "split_master", icon: Users, name: "หารเก่ง", nameEn: "Split Master", description: "สร้างปาร์ตี้หาร 3 ครั้ง", descriptionEn: "Create 3 split parties", category: "finance", xp: 150, requirement: "สร้างปาร์ตี้ 3 ครั้ง", requirementEn: "Create 3 parties", maxProgress: 3 },

  // Productivity
  { id: "project_starter", icon: Target, name: "ผู้นำทีม", nameEn: "Project Starter", description: "สร้างโปรเจกต์แรก", descriptionEn: "Create your first project", category: "productivity", xp: 50, requirement: "สร้างโปรเจกต์ 1 อัน", requirementEn: "Create 1 project" },
  { id: "task_crusher", icon: CheckCircle2, name: "ทำงานเสร็จ", nameEn: "Task Crusher", description: "ทำ task เสร็จ 10 อัน", descriptionEn: "Complete 10 tasks", category: "productivity", xp: 200, requirement: "ทำ task เสร็จ 10 อัน", requirementEn: "Complete 10 tasks", maxProgress: 10 },
  { id: "file_sharer", icon: Sparkles, name: "นักแชร์", nameEn: "File Sharer", description: "อัปโหลดไฟล์ 5 ไฟล์", descriptionEn: "Upload 5 files", category: "productivity", xp: 100, requirement: "อัปโหลดไฟล์ 5 ไฟล์", requirementEn: "Upload 5 files", maxProgress: 5 },

  // Social
  { id: "ai_friend", icon: Sparkles, name: "เพื่อน AI", nameEn: "AI Friend", description: "คุยกับ AI 10 ครั้ง", descriptionEn: "Chat with AI 10 times", category: "social", xp: 100, requirement: "คุยกับ AI 10 ครั้ง", requirementEn: "Chat with AI 10 times", maxProgress: 10 },
  { id: "feedback_giver", icon: Medal, name: "ผู้ให้ Feedback", nameEn: "Feedback Giver", description: "ส่ง feedback ครั้งแรก", descriptionEn: "Submit your first feedback", category: "social", xp: 50, requirement: "ส่ง feedback 1 ครั้ง", requirementEn: "Submit 1 feedback" },

  // Special
  { id: "streak_3", icon: Flame, name: "ติดต่อกัน 3 วัน", nameEn: "3-Day Streak", description: "ใช้งานติดต่อกัน 3 วัน", descriptionEn: "Use app for 3 consecutive days", category: "special", xp: 100, requirement: "ใช้งาน 3 วันติดต่อกัน", requirementEn: "3-day streak", maxProgress: 3 },
  { id: "streak_7", icon: Flame, name: "ติดต่อกัน 7 วัน", nameEn: "7-Day Streak", description: "ใช้งานติดต่อกัน 7 วัน", descriptionEn: "Use app for 7 consecutive days", category: "special", xp: 250, requirement: "ใช้งาน 7 วันติดต่อกัน", requirementEn: "7-day streak", maxProgress: 7 },
  { id: "streak_30", icon: Crown, name: "ติดต่อกัน 30 วัน", nameEn: "30-Day Streak", description: "ใช้งานติดต่อกัน 30 วัน", descriptionEn: "Use app for 30 consecutive days", category: "special", xp: 1000, requirement: "ใช้งาน 30 วันติดต่อกัน", requirementEn: "30-day streak", maxProgress: 30 },
  { id: "early_adopter", icon: Star, name: "Early Adopter", nameEn: "Early Adopter", description: "ผู้ใช้งานรุ่นแรก", descriptionEn: "One of the first users", category: "special", xp: 500, requirement: "ลงทะเบียนก่อน 2026", requirementEn: "Registered before 2026" },
];

const categoryConfig = {
  learning: { label: "การเรียน", labelEn: "Learning", color: "text-blue-500", bg: "bg-blue-100" },
  finance: { label: "การเงิน", labelEn: "Finance", color: "text-green-500", bg: "bg-green-100" },
  social: { label: "สังคม", labelEn: "Social", color: "text-pink-500", bg: "bg-pink-100" },
  productivity: { label: "productivity", labelEn: "Productivity", color: "text-orange-500", bg: "bg-orange-100" },
  special: { label: "พิเศษ", labelEn: "Special", color: "text-purple-500", bg: "bg-purple-100" },
};

// Calculate level from XP
function calculateLevel(xp: number): { level: number; currentXP: number; nextLevelXP: number } {
  const baseXP = 100;
  const multiplier = 1.5;
  let level = 1;
  let totalXPForLevel = baseXP;

  while (xp >= totalXPForLevel) {
    level++;
    totalXPForLevel += Math.floor(baseXP * Math.pow(multiplier, level - 1));
  }

  const previousLevelXP = totalXPForLevel - Math.floor(baseXP * Math.pow(multiplier, level - 1));
  const currentXP = xp - previousLevelXP;
  const nextLevelXP = Math.floor(baseXP * Math.pow(multiplier, level - 1));

  return { level, currentXP, nextLevelXP };
}

export default function AchievementsPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalXP: 0,
    level: 1,
    streak: 0,
    lastActiveDate: "",
    tasksCompleted: 0,
    expensesLogged: 0,
    notesCreated: 0,
    projectsCreated: 0,
    aiChats: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    setMounted(true);
    loadAchievements();
    updateStreak();
  }, []);

  const loadAchievements = () => {
    // Load saved achievements
    const saved = localStorage.getItem("mailon_achievements");
    const savedStats = localStorage.getItem("mailon_user_stats");

    // Count actual data from localStorage
    const expenses = JSON.parse(localStorage.getItem("mailon_wallet_expenses") || "[]");
    const notes = JSON.parse(localStorage.getItem("mailon_lecture_notes") || "[]");
    const projects = JSON.parse(localStorage.getItem("mailon_projects") || "[]");
    const tasks = JSON.parse(localStorage.getItem("mailon_tasks") || "[]");
    const citations = JSON.parse(localStorage.getItem("mailon_citations") || "[]");
    const subscriptions = JSON.parse(localStorage.getItem("mailon_subscriptions") || "[]");
    const parties = JSON.parse(localStorage.getItem("mailon_split_parties") || "[]");
    const schedule = JSON.parse(localStorage.getItem("mailon_schedule") || "[]");
    const aiChat = JSON.parse(localStorage.getItem("mailon_ai_chat") || "[]");
    const feedback = JSON.parse(localStorage.getItem("mailon_feedback") || "[]");
    const files = JSON.parse(localStorage.getItem("mailon_shared_files") || "[]");

    const doneTasks = tasks.filter((t: any) => t.status === "done").length;
    const userMessages = aiChat.filter((m: any) => m.role === "user").length;

    // Build achievement progress
    const achievementsWithProgress: Achievement[] = achievementsList.map(a => {
      let unlocked = false;
      let progress = 0;

      switch (a.id) {
        case "first_note": unlocked = notes.length >= 1; progress = notes.length; break;
        case "note_master": progress = notes.length; unlocked = notes.length >= 10; break;
        case "citation_pro": progress = citations.length; unlocked = citations.length >= 5; break;
        case "schedule_keeper": progress = schedule.length; unlocked = schedule.length >= 5; break;
        case "budget_tracker": unlocked = expenses.length >= 1; progress = expenses.length; break;
        case "money_master": progress = expenses.length; unlocked = expenses.length >= 50; break;
        case "subscription_manager": progress = subscriptions.length; unlocked = subscriptions.length >= 3; break;
        case "split_master": progress = parties.length; unlocked = parties.length >= 3; break;
        case "project_starter": unlocked = projects.length >= 1; progress = projects.length; break;
        case "task_crusher": progress = doneTasks; unlocked = doneTasks >= 10; break;
        case "file_sharer": progress = files.length; unlocked = files.length >= 5; break;
        case "ai_friend": progress = userMessages; unlocked = userMessages >= 10; break;
        case "feedback_giver": unlocked = feedback.length >= 1; progress = feedback.length; break;
        case "early_adopter": unlocked = true; break;
        default: break;
      }

      return { ...a, unlocked, progress };
    });

    // Check for newly unlocked achievements
    if (saved) {
      const oldAchievements = JSON.parse(saved);
      achievementsWithProgress.forEach(a => {
        const old = oldAchievements.find((o: Achievement) => o.id === a.id);
        if (a.unlocked && (!old || !old.unlocked)) {
          // New unlock!
          a.unlockedAt = new Date().toISOString();
          toast.success(
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-bold">{language === "th" ? "ปลดล็อค!" : "Unlocked!"}</p>
                <p className="text-sm">{language === "th" ? a.name : a.nameEn}</p>
              </div>
            </div>
          );
          // Celebration!
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else if (old?.unlockedAt) {
          a.unlockedAt = old.unlockedAt;
        }
      });
    } else {
      // First time - mark early adopter
      const earlyAdopter = achievementsWithProgress.find(a => a.id === "early_adopter");
      if (earlyAdopter) {
        earlyAdopter.unlocked = true;
        earlyAdopter.unlockedAt = new Date().toISOString();
      }
    }

    setAchievements(achievementsWithProgress);
    localStorage.setItem("mailon_achievements", JSON.stringify(achievementsWithProgress));

    // Calculate stats
    const totalXP = achievementsWithProgress
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.xp, 0);

    const { level } = calculateLevel(totalXP);

    setStats(prev => ({
      ...prev,
      totalXP,
      level,
      expensesLogged: expenses.length,
      notesCreated: notes.length,
      projectsCreated: projects.length,
      tasksCompleted: doneTasks,
      aiChats: userMessages,
    }));
  };

  const updateStreak = () => {
    const savedStats = localStorage.getItem("mailon_user_stats");
    const today = new Date().toISOString().split("T")[0];
    
    let newStreak = 1;
    if (savedStats) {
      const oldStats = JSON.parse(savedStats);
      const lastDate = oldStats.lastActiveDate;
      
      if (lastDate === today) {
        newStreak = oldStats.streak;
      } else {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        if (lastDate === yesterday) {
          newStreak = oldStats.streak + 1;
        }
      }
    }

    setStats(prev => ({ ...prev, streak: newStreak, lastActiveDate: today }));
    localStorage.setItem("mailon_user_stats", JSON.stringify({ ...stats, streak: newStreak, lastActiveDate: today }));
  };

  const { level, currentXP, nextLevelXP } = calculateLevel(stats.totalXP);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const filteredAchievements = selectedCategory === "all"
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={cn("flex items-start justify-between", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {language === "th" ? "ความสำเร็จ" : "Achievements"}
          </h1>
          <p className="text-muted-foreground">
            {language === "th" ? "สะสม XP และปลดล็อค badges" : "Earn XP and unlock badges"}
          </p>
        </div>
      </div>

      {/* Level & XP Card */}
      <Card className={cn("bg-gradient-to-br from-violet-500 to-purple-600 text-white border-0", fadeInUp)} style={{ animationDelay: "100ms" }}>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
              <span className="text-4xl font-bold">{level}</span>
            </div>
            <div className="flex-1">
              <p className="text-white/80 text-sm">Level {level}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${(currentXP / nextLevelXP) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{currentXP}/{nextLevelXP} XP</span>
              </div>
              <p className="text-white/80 text-sm mt-2">
                {language === "th" ? `รวม ${stats.totalXP} XP` : `Total ${stats.totalXP} XP`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", fadeInUp)} style={{ animationDelay: "150ms" }}>
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.streak}</p>
            <p className="text-xs text-muted-foreground">{language === "th" ? "วันติดต่อกัน" : "Day Streak"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{unlockedCount}</p>
            <p className="text-xs text-muted-foreground">{language === "th" ? "ปลดล็อค" : "Unlocked"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.totalXP}</p>
            <p className="text-xs text-muted-foreground">XP</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{achievements.length - unlockedCount}</p>
            <p className="text-xs text-muted-foreground">{language === "th" ? "รออีก" : "Remaining"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs */}
      <div className={cn("flex gap-2 overflow-x-auto pb-2", fadeInUp)} style={{ animationDelay: "200ms" }}>
        <button
          onClick={() => setSelectedCategory("all")}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
            selectedCategory === "all"
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {language === "th" ? "ทั้งหมด" : "All"} ({achievements.length})
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              selectedCategory === key
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {language === "th" ? config.label : config.labelEn}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", fadeInUp)} style={{ animationDelay: "250ms" }}>
        {filteredAchievements.map((achievement) => {
          const Icon = achievement.icon;
          const category = categoryConfig[achievement.category];
          const progress = achievement.progress || 0;
          const maxProgress = achievement.maxProgress || 1;

          return (
            <Card
              key={achievement.id}
              className={cn(
                "relative overflow-hidden transition-all",
                achievement.unlocked
                  ? "border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30"
                  : "opacity-70"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative",
                    achievement.unlocked ? category.bg : "bg-muted"
                  )}>
                    <Icon className={cn(
                      "w-7 h-7",
                      achievement.unlocked ? category.color : "text-muted-foreground"
                    )} />
                    {!achievement.unlocked && (
                      <div className="absolute inset-0 bg-background/50 rounded-2xl flex items-center justify-center">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    {achievement.unlocked && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-yellow-900" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">
                        {language === "th" ? achievement.name : achievement.nameEn}
                      </p>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        +{achievement.xp} XP
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === "th" ? achievement.description : achievement.descriptionEn}
                    </p>
                    {achievement.maxProgress && !achievement.unlocked && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">
                            {language === "th" ? achievement.requirement : achievement.requirementEn}
                          </span>
                          <span className="font-medium text-foreground">
                            {Math.min(progress, maxProgress)}/{maxProgress}
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${Math.min((progress / maxProgress) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {achievement.unlockedAt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {language === "th" ? "ปลดล็อค" : "Unlocked"}: {new Date(achievement.unlockedAt).toLocaleDateString(
                          language === "th" ? "th-TH" : "en-US"
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
