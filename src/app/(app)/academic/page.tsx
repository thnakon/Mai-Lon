import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileAudio, Quote, Calendar, ArrowRight, Mic, Upload } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academic Genius",
  description: "AI สรุปเลคเชอร์ สร้างบรรณานุกรม และจัดการตารางเรียน",
};

const features = [
  {
    id: "lecture-note",
    title: "AI Lecture Note",
    description: "อัดเสียง หรือ อัปโหลดไฟล์ แล้วให้ AI สรุปประเด็นสำคัญให้",
    icon: FileAudio,
    status: "coming-soon",
  },
  {
    id: "citation",
    title: "Easy Citation",
    description: "สร้างบรรณานุกรม APA, MLA, IEEE อัตโนมัติ",
    icon: Quote,
    status: "coming-soon",
  },
  {
    id: "schedule",
    title: "Smart Schedule",
    description: "ตารางเรียน Card View พร้อม Countdown สอบ",
    icon: Calendar,
    status: "coming-soon",
  },
];

export default function AcademicPage() {
  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Academic Genius
            </h1>
            <p className="text-muted-foreground">เรียนยังไงไม่ให้หลอน</p>
          </div>
        </div>
      </div>

      {/* Quick Action: Record Lecture */}
      <Card className="mb-6 border-2 border-orange-200 dark:border-orange-900/50 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Mic className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold text-foreground">🎙️ เริ่มอัดเสียงเลคเชอร์</h3>
              <p className="text-sm text-muted-foreground mt-1">
                กดปุ่มเพื่อเริ่มอัดเสียง แล้วให้ AI สรุปให้อัตโนมัติ
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                <Mic className="w-4 h-4" />
                เริ่มอัดเสียง
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                อัปโหลดไฟล์
              </Button>
            </div>
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
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-orange-600 dark:text-orange-400" strokeWidth={1.5} />
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
