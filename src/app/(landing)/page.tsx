import Link from "next/link";
import { LandingNavbar } from "@/components/layout/landing-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GraduationCap, 
  Users, 
  Wallet, 
  Rocket, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  Star
} from "lucide-react";

const zones = [
  {
    id: "academic",
    title: "Academic Genius",
    titleTh: "📚 เรียนไม่ให้หลอน",
    description: "AI สรุปเลคเชอร์ สร้างบรรณานุกรม จัดตารางเรียน",
    icon: GraduationCap,
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "teamwork",
    title: "Teamwork Savior",
    titleTh: "🤝 งานกลุ่มไม่หลอน",
    description: "Kanban board แจ้งเตือนเพื่อน พื้นที่แชร์ไฟล์",
    icon: Users,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "survival",
    title: "Survival Kit",
    titleTh: "💰 ใช้ชีวิตไม่หลอน",
    description: "บันทึกรายจ่าย ดูงบประมาณ รวมส่วนลดนักศึกษา",
    icon: Wallet,
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "career",
    title: "Career Launchpad",
    titleTh: "🚀 อนาคตไม่หลอน",
    description: "สร้าง Resume AI แนะนำงานที่เหมาะกับคุณ",
    icon: Rocket,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
  },
];

const features = [
  "ฟรี 100% สำหรับนักศึกษา",
  "ใช้งานง่าย ไม่ซับซ้อน",
  "รองรับภาษาไทยเต็มรูปแบบ",
  "Dark Mode สบายตา",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Super App สำหรับนักศึกษา</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
            เรียน สอบ ใช้ชีวิต
            <br />
            <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
              ไม่หลอน
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            แพลตฟอร์มที่จะช่วยให้คุณจัดการทุกอย่างในชีวิตนักศึกษาได้อย่างง่ายดาย 
            ตั้งแต่การเรียน งานกลุ่ม ไปจนถึงการเงินและอนาคต
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl gap-2">
                เริ่มต้นใช้งานฟรี
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-xl">
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>
          
          {/* Features List */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zones Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              4 Zones ช่วยให้ชีวิตไม่หลอน
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              เราออกแบบมาให้ครอบคลุมทุกด้านของชีวิตนักศึกษา
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {zones.map((zone) => (
              <Card key={zone.id} className="group hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-primary/30">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${zone.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <zone.icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{zone.titleTh}</CardTitle>
                      <CardDescription className="text-sm mt-1">{zone.title}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{zone.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-primary/10 via-orange-500/10 to-amber-500/10 border border-primary/20">
            <Star className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              พร้อมที่จะไม่หลอนแล้วหรือยัง?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              เริ่มต้นใช้งานได้ทันที ไม่ต้องใส่บัตรเครดิต ฟรีตลอดไปสำหรับนักศึกษา
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 py-6 text-lg rounded-xl gap-2">
                สร้างบัญชีฟรี
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm">🧘</span>
            </div>
            <span className="font-semibold text-foreground">Mai Lon</span>
            <span className="text-muted-foreground text-sm">ไม่หลอน</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Mai Lon. Made with ❤️ for students.
          </p>
        </div>
      </footer>
    </div>
  );
}
