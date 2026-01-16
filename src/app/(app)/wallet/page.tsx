"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  PiggyBank,
  Calendar,
  MoreVertical,
  Trash2,
  Edit3,
  Filter,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";

// Animation
const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

// Expense categories with Thai names
const categories = [
  { id: "food", name: "อาหาร", nameEn: "Food", icon: "🍜", color: "bg-orange-100 text-orange-600" },
  { id: "transport", name: "ค่าเดินทาง", nameEn: "Transport", icon: "🚗", color: "bg-blue-100 text-blue-600" },
  { id: "education", name: "การศึกษา", nameEn: "Education", icon: "📚", color: "bg-purple-100 text-purple-600" },
  { id: "entertainment", name: "ความบันเทิง", nameEn: "Entertainment", icon: "🎮", color: "bg-pink-100 text-pink-600" },
  { id: "shopping", name: "ช้อปปิ้ง", nameEn: "Shopping", icon: "🛒", color: "bg-yellow-100 text-yellow-600" },
  { id: "health", name: "สุขภาพ", nameEn: "Health", icon: "💊", color: "bg-green-100 text-green-600" },
  { id: "bills", name: "ค่าบิล", nameEn: "Bills", icon: "📄", color: "bg-gray-100 text-gray-600" },
  { id: "other", name: "อื่นๆ", nameEn: "Other", icon: "📦", color: "bg-slate-100 text-slate-600" },
];

interface Expense {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
}

export default function WalletPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState(5000);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ amount: "", category: "food", note: "" });
  const [searchQuery, setSearchQuery] = useState("");

  // Load data from localStorage
  useEffect(() => {
    setMounted(true);
    const savedExpenses = localStorage.getItem("mailon_expenses");
    const savedBudget = localStorage.getItem("mailon_budget");
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedBudget) setBudget(Number(savedBudget));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mailon_expenses", JSON.stringify(expenses));
      localStorage.setItem("mailon_budget", String(budget));
    }
  }, [expenses, budget, mounted]);

  // Calculate totals
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalSpent;
  const percentUsed = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

  // Get current month expenses
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Category breakdown
  const categoryTotals = categories.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.id).reduce((sum, e) => sum + e.amount, 0),
    count: expenses.filter(e => e.category === cat.id).length,
  })).filter(c => c.total > 0);

  // Add expense
  const handleAddExpense = () => {
    if (!newExpense.amount || Number(newExpense.amount) <= 0) return;
    
    const expense: Expense = {
      id: Date.now().toString(),
      amount: Number(newExpense.amount),
      category: newExpense.category,
      note: newExpense.note,
      date: new Date().toISOString(),
    };
    
    setExpenses([expense, ...expenses]);
    setNewExpense({ amount: "", category: "food", note: "" });
    setIsAddingExpense(false);
  };

  // Delete expense
  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Filter expenses
  const filteredExpenses = expenses.filter(e => 
    e.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
    categories.find(c => c.id === e.category)?.name.includes(searchQuery)
  );

  if (!mounted) return null;

  const getCategoryInfo = (categoryId: string) => categories.find(c => c.id === categoryId) || categories[7];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={cn("flex items-start justify-between", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {language === "th" ? "กระเป๋าเงิน" : "Wallet"}
          </h1>
          <p className="text-muted-foreground">
            {language === "th" ? "จัดการรายจ่ายและงบประมาณของคุณ" : "Manage your expenses and budget"}
          </p>
        </div>
        <Button 
          onClick={() => setIsAddingExpense(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          {language === "th" ? "เพิ่มรายจ่าย" : "Add Expense"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", fadeInUp)} style={{ animationDelay: "100ms" }}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{language === "th" ? "งบเดือนนี้" : "Monthly Budget"}</p>
              <PiggyBank className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">฿{budget.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "th" ? "ตั้งงบไว้" : "Budget set"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{language === "th" ? "ใช้ไปแล้ว" : "Spent"}</p>
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">฿{monthlyTotal.toLocaleString()}</p>
            <p className="text-xs text-red-500 flex items-center gap-1">
              {percentUsed}% {language === "th" ? "ของงบ" : "of budget"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{language === "th" ? "คงเหลือ" : "Remaining"}</p>
              <Wallet className="w-5 h-5 text-green-500" />
            </div>
            <p className={cn("text-3xl font-bold", remaining >= 0 ? "text-green-600" : "text-red-600")}>
              ฿{remaining.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {remaining >= 0 
                ? (language === "th" ? "ใช้ได้อีก" : "Available") 
                : (language === "th" ? "เกินงบ!" : "Over budget!")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{language === "th" ? "รายการทั้งหมด" : "Total Entries"}</p>
              <Receipt className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">{expenses.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "th" ? "รายการ" : "transactions"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddingExpense}
        onClose={() => setIsAddingExpense(false)}
        title={language === "th" ? "เพิ่มรายจ่ายใหม่" : "Add New Expense"}
      >
        <div className="space-y-4">
          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {language === "th" ? "จำนวนเงิน (บาท)" : "Amount (THB)"}
            </label>
            <input
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              placeholder="0"
              className="w-full h-12 px-4 rounded-xl border border-input bg-background text-2xl font-bold text-foreground"
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {language === "th" ? "หมวดหมู่" : "Category"}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setNewExpense({ ...newExpense, category: cat.id })}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all text-center",
                    newExpense.category === cat.id
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-muted hover:bg-muted/80"
                  )}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <p className="text-xs mt-1 font-medium">{language === "th" ? cat.name : cat.nameEn}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {language === "th" ? "โน้ต (ไม่บังคับ)" : "Note (optional)"}
            </label>
            <input
              type="text"
              value={newExpense.note}
              onChange={(e) => setNewExpense({ ...newExpense, note: e.target.value })}
              placeholder={language === "th" ? "เช่น ข้าวมันไก่" : "e.g. Lunch"}
              className="w-full h-12 px-4 rounded-xl border border-input bg-background text-foreground"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsAddingExpense(false)}
              className="flex-1 rounded-xl"
            >
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </Button>
            <Button
              onClick={handleAddExpense}
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl"
            >
              {language === "th" ? "บันทึก" : "Save"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Category Breakdown */}
      {categoryTotals.length > 0 && (
        <Card className={cn(fadeInUp)} style={{ animationDelay: "200ms" }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {language === "th" ? "สรุปตามหมวดหมู่" : "Category Breakdown"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categoryTotals.map((cat) => (
                <div key={cat.id} className={cn("p-4 rounded-xl", cat.color.split(" ")[0])}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-medium text-sm">{language === "th" ? cat.name : cat.nameEn}</span>
                  </div>
                  <p className="text-xl font-bold">฿{cat.total.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{cat.count} {language === "th" ? "รายการ" : "items"}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Expenses */}
      <Card className={cn(fadeInUp)} style={{ animationDelay: "300ms" }}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {language === "th" ? "รายจ่ายล่าสุด" : "Recent Expenses"}
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === "th" ? "ค้นหา..." : "Search..."}
                className="h-9 pl-9 pr-4 rounded-lg border border-input bg-background text-sm w-48"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">
                {language === "th" ? "ยังไม่มีรายจ่าย" : "No expenses yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "th" ? "เริ่มบันทึกรายจ่ายของคุณเลย" : "Start tracking your expenses"}
              </p>
              <Button
                onClick={() => setIsAddingExpense(true)}
                className="mt-4 bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                {language === "th" ? "เพิ่มรายจ่ายแรก" : "Add Your First Expense"}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredExpenses.slice(0, 10).map((expense) => {
                const cat = getCategoryInfo(expense.category);
                return (
                  <div
                    key={expense.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", cat.color.split(" ")[0])}>
                      <span className="text-lg">{cat.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {expense.note || (language === "th" ? cat.name : cat.nameEn)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <p className="font-bold text-foreground">-฿{expense.amount.toLocaleString()}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-destructive"
                        >
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

      {/* Budget Settings */}
      <Card className={cn(fadeInUp)} style={{ animationDelay: "400ms" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {language === "th" ? "ตั้งค่างบประมาณ" : "Budget Settings"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === "th" ? "งบประมาณรายเดือน (บาท)" : "Monthly Budget (THB)"}
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-12 px-4 rounded-xl border border-input bg-background text-xl font-bold text-foreground"
              />
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{language === "th" ? "ใช้ไปแล้ว" : "Spent"}</span>
              <span className="font-medium">{percentUsed}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  percentUsed > 100 ? "bg-red-500" : percentUsed > 80 ? "bg-yellow-500" : "bg-primary"
                )}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
