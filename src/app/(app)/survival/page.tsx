import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, PiggyBank, Tag, TrendingUp, TrendingDown } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Survival Kit",
  description: "จัดการงบประมาณ รายจ่าย และรวมส่วนลดสำหรับนักศึกษา",
};

const expenseCategories = [
  { name: "🍜 อาหาร", amount: 2450, color: "bg-orange-400" },
  { name: "🚗 ค่าเดินทาง", amount: 800, color: "bg-blue-400" },
  { name: "📚 การศึกษา", amount: 350, color: "bg-purple-400" },
  { name: "🎮 ความบันเทิง", amount: 600, color: "bg-pink-400" },
];

const totalBudget = 5000;
const totalSpent = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
const remaining = totalBudget - totalSpent;

export default function SurvivalPage() {
  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Survival Kit
            </h1>
            <p className="text-muted-foreground">ใช้ชีวิตไม่ให้หลอน</p>
          </div>
        </div>
      </div>

      {/* Wallet Summary */}
      <Card className="mb-6 border-2 border-blue-200 dark:border-blue-900/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">💵 งบเดือนนี้เหลือ</p>
              <p className="text-4xl font-bold text-foreground mt-1">
                ฿{remaining.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                จาก ฿{totalBudget.toLocaleString()} · ใช้ไป ฿{totalSpent.toLocaleString()}
              </p>
            </div>
            
            {/* Mini Pie Chart Visualization */}
            <div className="flex gap-4 items-center">
              <div className="w-24 h-24 rounded-full bg-muted relative overflow-hidden">
                {/* Simple visual representation */}
                <div 
                  className="absolute inset-0 bg-primary"
                  style={{ 
                    clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% ${(totalSpent/totalBudget) * 100}%)` 
                  }}
                />
                <div className="absolute inset-2 bg-card rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">{Math.round((totalSpent/totalBudget) * 100)}%</span>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-1">
                <Plus className="w-4 h-4" />
                บันทึกรายจ่าย
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              รายจ่ายเดือนนี้
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenseCategories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                    <span className="text-sm">{cat.name}</span>
                  </div>
                  <span className="font-medium">฿{cat.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              Privilege Hub
            </CardTitle>
            <CardDescription>ส่วนลดสำหรับนักศึกษา</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-accent flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">🍔 McDonald&apos;s</p>
                  <p className="text-xs text-muted-foreground">ลด 10% ทุกเมนู</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">ใช้ได้</span>
              </div>
              <div className="p-3 rounded-xl bg-accent flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">🎬 Major Cineplex</p>
                  <p className="text-xs text-muted-foreground">ลด 50 บาท</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">ใช้ได้</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
