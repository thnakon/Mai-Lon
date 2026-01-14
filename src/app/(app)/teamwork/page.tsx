import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, Bell, FolderOpen } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teamwork Savior",
  description: "จัดการงานกลุ่ม แบ่งงานเพื่อน และแชร์ไฟล์อย่างเป็นระบบ",
};

const kanbanColumns = [
  { id: "todo", title: "📝 To Do", count: 3, color: "bg-slate-100 dark:bg-slate-800" },
  { id: "doing", title: "⏳ Doing", count: 2, color: "bg-amber-50 dark:bg-amber-900/20" },
  { id: "done", title: "✅ Done", count: 5, color: "bg-emerald-50 dark:bg-emerald-900/20" },
];

const features = [
  {
    id: "kanban",
    title: "Minimal Kanban",
    description: "กระดานจัดการงาน Drag & Drop ง่ายๆ",
    icon: LayoutGrid,
    status: "active",
  },
  {
    id: "nudge",
    title: "Auto-Nudge",
    description: "แจ้งเตือนเพื่อนร่วมทีมแบบสุภาพ",
    icon: Bell,
    status: "coming-soon",
  },
  {
    id: "file-drop",
    title: "File Drop",
    description: "พื้นที่แชร์ไฟล์ที่ไม่หมดอายุ",
    icon: FolderOpen,
    status: "coming-soon",
  },
];

export default function TeamworkPage() {
  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <span className="text-2xl">🤝</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Teamwork Savior
            </h1>
            <p className="text-muted-foreground">งานกลุ่มไม่หลอน</p>
          </div>
        </div>
      </div>

      {/* Quick Kanban Preview */}
      <Card className="mb-6 border-2 border-emerald-200 dark:border-emerald-900/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>📋 โปรเจค: Database Final</CardTitle>
              <CardDescription>กลุ่ม: เพื่อนร่วมชั้น 4 คน</CardDescription>
            </div>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1">
              <Plus className="w-4 h-4" />
              เพิ่มงาน
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {kanbanColumns.map((col) => (
              <div key={col.id} className={`p-3 rounded-xl ${col.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{col.title}</span>
                  <span className="text-xs bg-white dark:bg-black/20 px-2 py-0.5 rounded-full">
                    {col.count}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-900 p-2 rounded-lg text-xs shadow-sm">
                    ตัวอย่างงาน...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <h2 className="text-lg font-semibold mb-4">เครื่องมือทั้งหมด</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Card key={feature.id} className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
                </div>
                {feature.status === "coming-soon" && (
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    เร็วๆ นี้
                  </span>
                )}
              </div>
              <CardTitle className="text-base mt-3">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
