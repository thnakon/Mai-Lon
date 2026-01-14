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
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "หน้าแรก",
  description: "แพลตฟอร์มที่จะช่วยให้คุณจัดการทุกอย่างในชีวิตนักศึกษาได้อย่างง่ายดาย",
};

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
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-orange-500/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20 animate-fade-in shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">Super App สำหรับนักศึกษา</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-foreground mb-8 tracking-tight leading-[1.1]">
            เรียน สอบ ใช้ชีวิต
            <br />
            <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
              ไม่หลอน
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            แพลตฟอร์มที่จะช่วยให้คุณจัดการทุกอย่างในชีวิตนักศึกษาได้อย่างง่ายดาย 
            <span className="hidden sm:inline"><br /></span>
            ตั้งแต่การเรียน งานกลุ่ม ไปจนถึงการเงินและอนาคต
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="group w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-10 py-7 text-lg rounded-2xl gap-2 shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 font-bold active:scale-[0.98]">
                เริ่มต้นใช้งานฟรี
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 py-7 text-lg rounded-2xl font-bold bg-background/50 backdrop-blur-sm border-2 hover:bg-muted transition-all duration-300 active:scale-[0.98]">
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>
          
          {/* Features List */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2.5 text-muted-foreground/80 font-medium">
                <CheckCircle className="w-5 h-5 text-primary/80" />
                <span className="text-sm sm:text-base">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zones Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              4 Zones ช่วยให้ชีวิตไม่หลอน
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              เราออกแบบมาให้ครอบคลุมทุกด้านของชีวิตนักศึกษา ใช้ง่าย ครบ จบ ในที่เดียว
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {zones.map((zone) => (
              <Card key={zone.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-border/50 bg-background/50 backdrop-blur-sm rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8">
                  <div className="flex items-start gap-5">
                    <div className={`w-16 h-16 rounded-[1.25rem] ${zone.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                      <zone.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="pt-1">
                      <CardTitle className="text-2xl font-bold">{zone.titleTh}</CardTitle>
                      <CardDescription className="text-base font-medium mt-1 uppercase tracking-wider text-muted-foreground/70">{zone.title}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <p className="text-muted-foreground text-lg leading-relaxed">{zone.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-10 sm:p-16 rounded-[3rem] bg-gradient-to-br from-primary/10 via-orange-500/5 to-amber-500/10 border border-primary/20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner ring-1 ring-primary/20">
                <Star className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
                พร้อมที่จะไม่หลอนแล้วหรือยัง?
              </h2>
              <p className="text-muted-foreground text-lg sm:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
                เริ่มต้นใช้งานได้ทันที ไม่ต้องใส่บัตรเครดิต <br className="hidden sm:block" />
                <span className="text-primary font-semibold">สร้างบัญชีฟรีตลอดไปสำหรับนักศึกษา</span>
              </p>
              <Link href="/register">
                <Button size="lg" className="group bg-primary hover:bg-primary/90 text-white px-12 py-8 text-xl rounded-2xl gap-3 shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 font-bold active:scale-[0.98]">
                  สร้างบัญชีฟรี
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
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
