"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { LandingNavbar } from "@/components/layout/landing-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";
import { 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  Star,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Bell,
  PieChart,
  CreditCard,
  Users,
  TrendingUp,
  Calendar,
  BookOpen,
  Bot,
  FolderKanban,
  MessageCircle,
  Wallet,
  FileText,
  Brain,
  Clock,
  Trophy,
} from "lucide-react";

// Mai Lon Translations
const t = {
  th: {
    badge: "🎓 Super App สำหรับนักศึกษา - ใช้ฟรี!",
    heroTitle1: "เรียน สอบ ใช้ชีวิต",
    heroTitle2: "ไม่หลอน",
    heroDesc: "แพลตฟอร์มที่จะช่วยให้คุณจัดการทุกอย่างในชีวิตนักศึกษาได้อย่างง่ายดาย ตั้งแต่การเรียน งานกลุ่ม ไปจนถึงการเงินและอนาคต",
    ctaPrimary: "เริ่มต้นใช้งานฟรี",
    ctaSecondary: "ดู Demo",
    noBankNeeded: "ฟรี 100% สำหรับนักศึกษา ไม่ต้องใส่บัตรเครดิต",
    
    problemTitle: "ชีวิตนักศึกษา",
    problemHighlight: "ยุ่งเหยิงมาก",
    problemDesc: "จำได้ไหมตอนเปิดเทอม? ตอนนี้มีทั้งการบ้าน สอบ งานกลุ่ม และค่าใช้จ่ายล้นมือ",
    problem1Title: "ข้อมูลกระจัดกระจาย",
    problem1Desc: "ตารางเรียนอยู่ที่หนึ่ง การบ้านอยู่อีกที่ บันทึกเลคเชอร์หาไม่เจอ",
    problem2Title: "ลืมสิ่งสำคัญ",
    problem2Desc: "ลืมส่งงาน ลืมวันสอบ ลืมต่ออายุ Netflix ที่แชร์กับเพื่อน",
    problem3Title: "เงินหมดไม่รู้ตัว",
    problem3Desc: "ค่ากาแฟทีละนิด ค่า subscription ต่างๆ รวมกันแล้วเจ็บตัวทุกเดือน",
    problemBanner: "นักศึกษา 70% บอกว่า stress จากการจัดการเรื่องต่างๆ",
    problemBannerSub: "Mai Lon ช่วยให้คุณจัดการทุกอย่างในที่เดียว ไม่ต้องสลับไปมาหลายแอป",

    stepsTitle: "Mai Lon ช่วยคุณได้ยังไง",
    stepsDesc: "3 ขั้นตอนง่ายๆ ที่จะทำให้ชีวิตนักศึกษาของคุณไม่หลอนอีกต่อไป",
    step1Badge: "ขั้นตอน 1",
    step1Title: "จัดการตารางเรียนและสอบ",
    step1Desc: "เพิ่มวิชา ตารางเรียน วันสอบ ได้ในไม่กี่วินาที ระบบจะแจ้งเตือนให้คุณไม่พลาด",
    step1Feature1: "ตารางเรียนรายสัปดาห์",
    step1Feature2: "นับถอยหลังวันสอบ",
    step2Badge: "ขั้นตอน 2",
    step2Title: "AI สรุปเลคเชอร์ให้",
    step2Desc: "อัปโหลดไฟล์เสียงหรือบันทึกการเรียน AI จะสรุปประเด็นสำคัญให้อัตโนมัติ",
    step2Feature1: "ถอดเสียงอัตโนมัติ",
    step2Feature2: "สรุป Key Points",
    step3Badge: "ขั้นตอน 3",
    step3Title: "ติดตามการเงินและ Subscriptions",
    step3Desc: "ดูว่าเงินไปไหน จัดการ subscriptions แชร์ค่าใช้จ่ายกับเพื่อน",
    step3Feature1: "กราฟค่าใช้จ่าย",
    step3Feature2: "Split Bill กับเพื่อน",

    featuresTitle: "ทุกอย่างที่คุณต้องการ",
    featuresSub: "อยู่ในแอปเดียว",
    featuresDesc: "ออกแบบมาให้ครอบคลุมทุกด้านของชีวิตนักศึกษา ใช้ง่าย ครบ จบ ในที่เดียว",
    feature1: "📅 ตารางเรียน & สอบ",
    feature1Desc: "จัดตารางเรียน นับถอยหลังวันสอบ แจ้งเตือนไม่ให้พลาด",
    feature2: "📝 AI สรุปเลคเชอร์",
    feature2Desc: "อัปโหลดเสียง AI ถอดความและสรุปประเด็นสำคัญให้",
    feature3: "📚 บรรณานุกรม",
    feature3Desc: "สร้าง citation APA, MLA, Chicago อัตโนมัติ",
    feature4: "📊 Kanban Board",
    feature4Desc: "จัดการงานกลุ่มและโปรเจกต์แบบมืออาชีพ",
    feature5: "💰 ติดตามค่าใช้จ่าย",
    feature5Desc: "บันทึกรายจ่าย ตั้งงบ ดูสถิติการใช้เงิน",
    feature6: "📱 Subscriptions",
    feature6Desc: "จัดการ subscriptions แจ้งเตือนก่อนต่ออายุ",
    feature7: "👥 Split Party",
    feature7Desc: "หารค่าใช้จ่ายกับเพื่อน ไม่มีใครหนีได้",
    feature8: "🤖 AI Agent",
    feature8Desc: "ถามได้ทุกเรื่อง AI ช่วยตอบและแนะนำ",

    testimonialsTitle: "นักศึกษาพูดถึงเรา",
    testimonial1: "ใช้มา 2 เดือน ชีวิตเปลี่ยนมาก ไม่เคยลืมส่งงานอีกเลย AI สรุปเลคเชอร์ช่วยได้มากตอนอ่านสอบ",
    testimonial2: "ฟีเจอร์ Kanban ช่วยจัดการงานกลุ่มได้ดีมาก เพื่อนในกลุ่มก็เห็นว่าใครทำอะไร ไม่มีใครหนีงานได้",
    testimonial3: "ฟีเจอร์ Wallet ทำให้รู้ว่าเงินหายไปไหน ก่อนหน้านี้ไม่รู้ตัวเลยว่าใช้เยอะขนาดนี้ ตอนนี้ประหยัดได้เดือนละ 2,000",

    pricingTitle: "ใช้ฟรีตลอดไป",
    pricingDesc: "ไม่มีค่าใช้จ่าย ไม่มีเงื่อนไข",
    pricingBadge: "🎉 ฟรี 100% สำหรับนักศึกษา",
    pricingFeature1: "ตารางเรียนและสอบ ไม่จำกัด",
    pricingFeature2: "AI สรุปเลคเชอร์ไม่จำกัด",
    pricingFeature3: "บรรณานุกรมอัตโนมัติ",
    pricingFeature4: "Kanban Board สำหรับงานกลุ่ม",
    pricingFeature5: "ติดตามค่าใช้จ่าย",
    pricingFeature6: "จัดการ Subscriptions",
    pricingFeature7: "AI Agent ช่วยตอบคำถาม",
    pricingFeature8: "รับ update ใหม่ๆ ตลอด",
    priceFree: "ฟรีตลอดไป",
    priceFreeDesc: "ไม่มีค่าใช้จ่าย ไม่ต้องใส่บัตรเครดิต",
    pricePro: "Pro (เร็วๆ นี้)",
    priceProDesc: "ฟีเจอร์พิเศษเพิ่มเติมสำหรับ power users",
    popular: "แนะนำ",

    faqTitle: "คำถามที่พบบ่อย",
    faqSubtitle: "เรามีคำตอบ",
    faq1Q: "Mai Lon คืออะไร?",
    faq1A: "Mai Lon เป็น Super App สำหรับนักศึกษา ช่วยจัดการทุกอย่างในชีวิตนักศึกษา ตั้งแต่ตารางเรียน งานกลุ่ม ไปจนถึงการเงิน",
    faq2Q: "ใช้ฟรีจริงไหม?",
    faq2A: "จริง! ฟรี 100% สำหรับนักศึกษา ไม่มีค่าใช้จ่ายแอบแฝง",
    faq3Q: "AI สรุปเลคเชอร์ทำงานยังไง?",
    faq3A: "อัปโหลดไฟล์เสียงหรือบันทึกเสียง AI จะถอดความและสรุปประเด็นสำคัญให้อัตโนมัติ",
    faq4Q: "ใช้กับเพื่อนได้ไหม?",
    faq4A: "ได้! มีฟีเจอร์ Kanban Board สำหรับงานกลุ่ม และ Split Party สำหรับหารค่าใช้จ่าย",
    faq5Q: "ข้อมูลปลอดภัยไหม?",
    faq5A: "ปลอดภัย! เราใช้ Supabase และเข้ารหัสข้อมูลทั้งหมด",
    faq6Q: "รองรับภาษาอะไรบ้าง?",
    faq6A: "รองรับภาษาไทยและอังกฤษ สามารถสลับได้ตลอดเวลา",
    faq7Q: "มี Dark Mode ไหม?",
    faq7A: "มี! รองรับทั้ง Light และ Dark Mode ตามความชอบ",

    communityTitle: "มาร่วมเป็นส่วนหนึ่งของเรา",
    communityBtn: "เข้าร่วม Community",

    ctaFinalTitle: "พร้อมที่จะไม่หลอนแล้วหรือยัง?",
    ctaFinalSub: "เริ่มต้นจัดการชีวิตนักศึกษาวันนี้",
    ctaFinalDesc: "เข้าร่วมกับนักศึกษากว่า 500+ คนที่ใช้ Mai Lon จัดการชีวิตนักศึกษาได้อย่างมีประสิทธิภาพ",
    ctaFinalBtn: "สร้างบัญชีฟรี",
    ctaDemoBtn: "ดู Demo",

    footerDesc: "Super App สำหรับนักศึกษา จัดการทุกอย่างในที่เดียว",
    footerLinks: "ลิงก์",
    footerLegal: "กฎหมาย",
    footerSocial: "โซเชียล",
    login: "เข้าสู่ระบบ",
    dashboard: "Dashboard",
    features: "ฟีเจอร์",
    pricing: "ราคา",
    terms: "เงื่อนไขการใช้งาน",
    privacy: "นโยบายความเป็นส่วนตัว",
    copyright: "© 2026 Mai Lon - สงวนลิขสิทธิ์",
  },
  en: {
    badge: "🎓 Super App for Students - Free Forever!",
    heroTitle1: "Study, Exam, Life",
    heroTitle2: "Made Easy",
    heroDesc: "The platform that helps you manage everything in student life. From studying, group projects, to finances and your future.",
    ctaPrimary: "Get Started Free",
    ctaSecondary: "View Demo",
    noBankNeeded: "100% Free for students. No credit card required.",
    
    problemTitle: "Student life is",
    problemHighlight: "overwhelming",
    problemDesc: "Remember the first day of semester? Now you have assignments, exams, group projects, and expenses everywhere.",
    problem1Title: "Data Scattered Everywhere",
    problem1Desc: "Class schedule in one place, assignments in another, lecture notes nowhere to be found.",
    problem2Title: "Forgetting Important Things",
    problem2Desc: "Missing deadlines, forgetting exam dates, forgetting to renew Netflix you share with friends.",
    problem3Title: "Money Disappearing",
    problem3Desc: "Coffee here, subscriptions there. They add up and hurt every month.",
    problemBanner: "70% of students report stress from managing various tasks",
    problemBannerSub: "Mai Lon helps you manage everything in one place. No more switching between apps.",

    stepsTitle: "How Mai Lon Helps You",
    stepsDesc: "3 simple steps to make your student life stress-free.",
    step1Badge: "STEP 1",
    step1Title: "Manage Schedule & Exams",
    step1Desc: "Add classes, schedule, exam dates in seconds. Get reminders so you never miss anything.",
    step1Feature1: "Weekly class schedule",
    step1Feature2: "Exam countdown",
    step2Badge: "STEP 2",
    step2Title: "AI Summarizes Lectures",
    step2Desc: "Upload audio files or recordings. AI automatically transcribes and summarizes key points.",
    step2Feature1: "Automatic transcription",
    step2Feature2: "Key points summary",
    step3Badge: "STEP 3",
    step3Title: "Track Finances & Subscriptions",
    step3Desc: "See where your money goes. Manage subscriptions. Split bills with friends.",
    step3Feature1: "Expense charts",
    step3Feature2: "Split bills with friends",

    featuresTitle: "Everything you need",
    featuresSub: "in one app",
    featuresDesc: "Designed to cover all aspects of student life. Easy to use, complete, all in one place.",
    feature1: "📅 Schedule & Exams",
    feature1Desc: "Manage class schedule, exam countdown, get reminders.",
    feature2: "📝 AI Lecture Summary",
    feature2Desc: "Upload audio, AI transcribes and summarizes key points.",
    feature3: "📚 Bibliography",
    feature3Desc: "Generate APA, MLA, Chicago citations automatically.",
    feature4: "📊 Kanban Board",
    feature4Desc: "Manage group projects professionally.",
    feature5: "💰 Expense Tracking",
    feature5Desc: "Log expenses, set budget, view spending stats.",
    feature6: "📱 Subscriptions",
    feature6Desc: "Manage subscriptions, get renewal reminders.",
    feature7: "👥 Split Party",
    feature7Desc: "Split expenses with friends. No one can escape.",
    feature8: "🤖 AI Agent",
    feature8Desc: "Ask anything. AI helps answer and guide.",

    testimonialsTitle: "What Students Say",
    testimonial1: "Been using for 2 months, life changed. Never missed a deadline again. AI lecture summary helps so much during exam prep.",
    testimonial2: "The Kanban feature helps manage group projects so well. Everyone sees who does what. No one can slack off.",
    testimonial3: "The Wallet feature showed me where my money goes. Didn't realize I was spending this much. Now saving 2,000 baht per month.",

    pricingTitle: "Free Forever",
    pricingDesc: "No costs. No conditions.",
    pricingBadge: "🎉 100% Free for Students",
    pricingFeature1: "Unlimited schedule & exams",
    pricingFeature2: "Unlimited AI lecture summaries",
    pricingFeature3: "Automatic bibliography",
    pricingFeature4: "Kanban Board for group projects",
    pricingFeature5: "Expense tracking",
    pricingFeature6: "Subscription management",
    pricingFeature7: "AI Agent for questions",
    pricingFeature8: "All future updates included",
    priceFree: "Free Forever",
    priceFreeDesc: "No costs. No credit card required.",
    pricePro: "Pro (Coming Soon)",
    priceProDesc: "Extra features for power users.",
    popular: "RECOMMENDED",

    faqTitle: "Got questions?",
    faqSubtitle: "We've got answers",
    faq1Q: "What is Mai Lon?",
    faq1A: "Mai Lon is a Super App for students. It helps manage everything in student life, from schedule, group projects, to finances.",
    faq2Q: "Is it really free?",
    faq2A: "Yes! 100% free for students. No hidden costs.",
    faq3Q: "How does AI lecture summary work?",
    faq3A: "Upload audio files or recordings. AI automatically transcribes and summarizes key points.",
    faq4Q: "Can I use with friends?",
    faq4A: "Yes! We have Kanban Board for group projects and Split Party for splitting expenses.",
    faq5Q: "Is my data safe?",
    faq5A: "Yes! We use Supabase and encrypt all data.",
    faq6Q: "What languages are supported?",
    faq6A: "Thai and English. You can switch anytime.",
    faq7Q: "Is there Dark Mode?",
    faq7A: "Yes! Both Light and Dark Mode are supported.",

    communityTitle: "Join our growing community",
    communityBtn: "Join Our Community",

    ctaFinalTitle: "Ready to make life easier?",
    ctaFinalSub: "Start managing your student life today.",
    ctaFinalDesc: "Join 500+ students who use Mai Lon to manage their student life effectively.",
    ctaFinalBtn: "Create Free Account",
    ctaDemoBtn: "View Demo",

    footerDesc: "Super App for students. Manage everything in one place.",
    footerLinks: "Links",
    footerLegal: "Legal",
    footerSocial: "Social",
    login: "Log in",
    dashboard: "Dashboard",
    features: "Features",
    pricing: "Pricing",
    terms: "Terms of service",
    privacy: "Privacy policy",
    copyright: "© 2026 Mai Lon - All rights reserved",
  }
};

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

// Animation classes
const fadeInUp = "animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both";
const fadeIn = "animate-in fade-in duration-700 fill-mode-both";
const scaleIn = "animate-in fade-in zoom-in-95 duration-500 fill-mode-both";

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-primary shrink-0 transition-transform" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
        )}
      </button>
      <div className={cn(
        "grid transition-all duration-300 ease-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden">
          <p className="pb-5 text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { language } = useLanguage();
  const supabase = createClient();
  const lang = t[language] || t.en;

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkUser();
  }, [supabase.auth]);

  const faqs = [
    { q: lang.faq1Q, a: lang.faq1A },
    { q: lang.faq2Q, a: lang.faq2A },
    { q: lang.faq3Q, a: lang.faq3A },
    { q: lang.faq4Q, a: lang.faq4A },
    { q: lang.faq5Q, a: lang.faq5A },
    { q: lang.faq6Q, a: lang.faq6A },
    { q: lang.faq7Q, a: lang.faq7A },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section id="hero" className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary mb-8 border border-primary/20", fadeInUp)} style={{ animationDelay: "0ms" }}>
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">{lang.badge}</span>
          </div>
          
          {/* Main Heading */}
          <h1 className={cn("text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight", fadeInUp)} style={{ animationDelay: "100ms" }}>
            {lang.heroTitle1}
            <br />
            <span className="bg-gradient-to-r from-primary via-amber-500 to-yellow-400 bg-clip-text text-transparent">
              {lang.heroTitle2}
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className={cn("text-lg text-muted-foreground mb-10 max-w-2xl mx-auto", fadeInUp)} style={{ animationDelay: "200ms" }}>
            {lang.heroDesc}
          </p>
          
          {/* CTA Buttons */}
          <div className={cn("flex flex-col sm:flex-row items-center justify-center gap-4 mb-8", fadeInUp)} style={{ animationDelay: "300ms" }}>
            <Link href={isLoggedIn ? "/dashboard" : "/register"}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                {lang.ctaPrimary}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-xl gap-2 hover:scale-105 transition-all">
                <Sparkles className="w-5 h-5" />
                {lang.ctaSecondary}
              </Button>
            </Link>
          </div>
          
          <p className={cn("text-sm text-muted-foreground", fadeIn)} style={{ animationDelay: "400ms" }}>{lang.noBankNeeded}</p>
          
          {/* App Preview */}
          <div className={cn("mt-16 relative", fadeInUp)} style={{ animationDelay: "500ms" }}>
            <div className="rounded-2xl border border-border shadow-2xl overflow-hidden bg-card hover:shadow-3xl transition-shadow duration-500">
              <Image 
                src="/app-preview.png" 
                alt="Mai Lon App Preview" 
                width={1200} 
                height={600}
                className="w-full opacity-80 hover:opacity-100 transition-opacity duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Row */}
      <section className="py-12 px-4 bg-muted/30 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className={cn("flex items-center justify-center gap-1 mb-4", fadeIn)}>
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
          <p className="text-center text-muted-foreground mb-8">{lang.testimonialsTitle}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[lang.testimonial1, lang.testimonial2, lang.testimonial3].map((text, i) => (
              <Card key={i} className={cn("bg-background hover:shadow-lg transition-all duration-300 hover:-translate-y-1", scaleIn)} style={{ animationDelay: `${i * 150}ms` }}>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">"{text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {["ก", "ป", "ม"][i]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{["กานต์", "ปิยะ", "มีน"][i]}</p>
                      <p className="text-xs text-muted-foreground">{language === "th" ? "นักศึกษา ปี 3" : "3rd Year Student"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {lang.problemTitle}
            </h2>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
              {lang.problemHighlight}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{lang.problemDesc}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FolderKanban, title: lang.problem1Title, desc: lang.problem1Desc },
              { icon: Bell, title: lang.problem2Title, desc: lang.problem2Desc },
              { icon: Wallet, title: lang.problem3Title, desc: lang.problem3Desc },
            ].map((item, i) => (
              <Card key={i} className={cn("bg-background hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group", scaleIn)} style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <item.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Problem Banner */}
          <div className="mt-12 p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center shrink-0">
                <span className="text-xl">💡</span>
              </div>
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-200">{lang.problemBanner}</p>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">{lang.problemBannerSub}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">{lang.stepsTitle}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{lang.stepsDesc}</p>
          </div>

          <div className="space-y-20">
            {[
              { badge: lang.step1Badge, title: lang.step1Title, desc: lang.step1Desc, f1: lang.step1Feature1, f2: lang.step1Feature2, icon: Calendar },
              { badge: lang.step2Badge, title: lang.step2Title, desc: lang.step2Desc, f1: lang.step2Feature1, f2: lang.step2Feature2, icon: Brain },
              { badge: lang.step3Badge, title: lang.step3Title, desc: lang.step3Desc, f1: lang.step3Feature1, f2: lang.step3Feature2, icon: Wallet },
            ].map((step, i) => (
              <div key={i} className={cn("grid md:grid-cols-2 gap-8 items-center", i % 2 === 1 && "md:flex-row-reverse")}>
                <div className={i % 2 === 1 ? "md:order-2" : ""}>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                    {step.badge}
                  </span>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                  <p className="text-muted-foreground mb-6">{step.desc}</p>
                  <div className="space-y-3">
                    {[step.f1, step.f2].map((f, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <span className="text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Card className={cn("bg-background", i % 2 === 1 ? "md:order-1" : "")}>
                  <CardContent className="p-8 flex items-center justify-center h-64">
                    <step.icon className="w-24 h-24 text-primary/20" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">{lang.featuresTitle}</h2>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">{lang.featuresSub}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{lang.featuresDesc}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: lang.feature1, desc: lang.feature1Desc },
              { title: lang.feature2, desc: lang.feature2Desc },
              { title: lang.feature3, desc: lang.feature3Desc },
              { title: lang.feature4, desc: lang.feature4Desc },
              { title: lang.feature5, desc: lang.feature5Desc },
              { title: lang.feature6, desc: lang.feature6Desc },
              { title: lang.feature7, desc: lang.feature7Desc },
              { title: lang.feature8, desc: lang.feature8Desc },
            ].map((f, i) => (
              <Card key={i} className={cn("bg-background hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 group", scaleIn)} style={{ animationDelay: `${i * 50}ms` }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">{lang.pricingTitle}</h2>
            <p className="text-muted-foreground mb-6">{lang.pricingDesc}</p>
            <div className="inline-block px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
              {lang.pricingBadge}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <Card className="bg-background border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-white text-xs font-medium">
                {lang.popular}
              </div>
              <CardContent className="p-8 pt-10">
                <h3 className="font-bold text-xl mb-2">{lang.priceFree}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-primary">฿0</span>
                  <span className="text-muted-foreground">/{language === "th" ? "ตลอดไป" : "forever"}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{lang.priceFreeDesc}</p>
                <div className="space-y-3 mb-6">
                  {[lang.pricingFeature1, lang.pricingFeature2, lang.pricingFeature3, lang.pricingFeature4, lang.pricingFeature5, lang.pricingFeature6, lang.pricingFeature7, lang.pricingFeature8].map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                </div>
                <Link href={isLoggedIn ? "/dashboard" : "/register"}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl">
                    {lang.ctaPrimary}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan - Coming Soon */}
            <Card className="bg-background opacity-60">
              <CardContent className="p-8">
                <h3 className="font-bold text-xl mb-2">{lang.pricePro}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-muted-foreground">?</span>
                  <span className="text-muted-foreground">/{language === "th" ? "เดือน" : "month"}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{lang.priceProDesc}</p>
                <Button disabled className="w-full rounded-xl">
                  {language === "th" ? "เร็วๆ นี้" : "Coming Soon"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">{lang.faqTitle}</h2>
            <p className="text-muted-foreground">{lang.faqSubtitle}</p>
          </div>

          <Card className="bg-background">
            <CardContent className="p-6">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openFAQ === i}
                  onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="py-12 px-4 text-center scroll-mt-20">
        <p className="text-muted-foreground mb-4">{lang.communityTitle}</p>
        <Link href="https://discord.gg/mailon">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl gap-2">
            <MessageCircle className="w-4 h-4" />
            {lang.communityBtn}
          </Button>
        </Link>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-muted/50">
            <CardContent className="p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">{lang.ctaFinalTitle}</h2>
                <p className="text-primary font-medium mb-4">{lang.ctaFinalSub}</p>
                <p className="text-muted-foreground text-sm mb-6">{lang.ctaFinalDesc}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href={isLoggedIn ? "/dashboard" : "/register"}>
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl gap-2">
                      {lang.ctaFinalBtn} <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="rounded-xl gap-2">
                      {lang.ctaDemoBtn} <Sparkles className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <Image src="/logo.png" alt="Mai Lon" width={200} height={200} className="opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-5 gap-8">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Mai Lon" width={32} height={32} />
              <span className="font-bold text-foreground">Mai Lon</span>
              <span className="text-muted-foreground text-sm">{language === "th" ? "ไม่หลอน" : "Not Stressful"}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{lang.footerDesc}</p>
            <p className="text-xs text-muted-foreground">{lang.copyright}</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">{lang.footerLinks}</h4>
            <div className="space-y-2 text-sm">
              <Link href="/login" className="block text-muted-foreground hover:text-foreground">{lang.login}</Link>
              <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground">{lang.dashboard}</Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground">{lang.features}</Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground">{lang.pricing}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">{lang.footerLegal}</h4>
            <div className="space-y-2 text-sm">
              <Link href="#" className="block text-muted-foreground hover:text-foreground">{lang.terms}</Link>
              <Link href="#" className="block text-muted-foreground hover:text-foreground">{lang.privacy}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">{lang.footerSocial}</h4>
            <div className="space-y-2 text-sm">
              <Link href="https://discord.gg/mailon" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <MessageCircle className="w-4 h-4" /> Discord
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
