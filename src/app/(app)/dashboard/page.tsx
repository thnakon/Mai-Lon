import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Wallet, Rocket, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "จัดการตารางเรียน งานกลุ่ม และรายจ่ายของคุณ",
};

const zones = [
  {
    id: "academic",
    title: "Academic Genius",
    titleTh: "เรียนไม่ให้หลอน",
    description: "AI สรุปเลคเชอร์ ทำบรรณานุกรม ตารางเรียน",
    icon: GraduationCap,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-200 dark:border-orange-900/50",
    href: "/academic",
  },
  {
    id: "teamwork",
    title: "Teamwork Savior",
    titleTh: "งานกลุ่มไม่หลอน",
    description: "Kanban board, แจ้งเตือนเพื่อน, แชร์ไฟล์",
    icon: Users,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-900/50",
    href: "/teamwork",
  },
  {
    id: "survival",
    title: "Survival Kit",
    titleTh: "ใช้ชีวิตไม่หลอน",
    description: "บันทึกรายจ่าย, ดีลส่วนลดนักศึกษา",
    icon: Wallet,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-900/50",
    href: "/survival",
  },
  {
    id: "career",
    title: "Career Launchpad",
    titleTh: "อนาคตไม่หลอน",
    description: "สร้าง Resume, AI แนะนำงาน",
    icon: Rocket,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200 dark:border-purple-900/50",
    href: "/career",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Hero Section */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
            <span className="text-3xl">🧘</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              สวัสดี! 👋
            </h1>
            <p className="text-muted-foreground">
              มาทำให้วันนี้ <span className="text-primary font-semibold">ไม่หลอน</span> กัน
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-3 flex-wrap mt-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">3 งานใกล้ deadline</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground">
            <span className="text-sm">💰 งบเหลือ ฿1,250</span>
          </div>
        </div>
      </section>

      {/* Zones Grid */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-foreground">เลือก Zone ที่ต้องการ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((zone) => (
            <Link key={zone.id} href={zone.href}>
              <Card className={`h-full border-2 ${zone.borderColor} hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl ${zone.color} flex items-center justify-center`}>
                      <zone.icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-3">{zone.title}</CardTitle>
                  <CardDescription className="text-base">{zone.titleTh}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{zone.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/20 border border-primary/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">🚀 พร้อมเริ่มต้นหรือยัง?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              ลองใช้ AI สรุปเลคเชอร์ หรือ จัดการ Kanban งานกลุ่ม
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white px-6">
            เริ่มใช้งานเลย
          </Button>
        </div>
      </section>
    </div>
  );
}
