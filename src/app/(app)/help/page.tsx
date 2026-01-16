"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Search,
  Sparkles,
} from "lucide-react";

const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

const faqs = [
  {
    question: "Mai Lon คืออะไร?",
    questionEn: "What is Mai Lon?",
    answer: "Mai Lon (ไม่หลอน) เป็น Super App สำหรับนักศึกษา ช่วยจัดการชีวิตการเรียน การเงิน และงานกลุ่มให้ง่ายขึ้น",
    answerEn: "Mai Lon is a Super App for students that helps manage academic life, finances, and teamwork easily.",
    category: "general",
  },
  {
    question: "ข้อมูลของฉันปลอดภัยไหม?",
    questionEn: "Is my data safe?",
    answer: "ข้อมูลทั้งหมดถูกเก็บไว้ในเครื่องของคุณ (Local Storage) และเข้ารหัสผ่าน Supabase เราไม่แชร์ข้อมูลกับบุคคลที่สาม",
    answerEn: "All data is stored locally and encrypted through Supabase. We never share your data with third parties.",
    category: "privacy",
  },
  {
    question: "ฉันจะลบบัญชีได้อย่างไร?",
    questionEn: "How do I delete my account?",
    answer: "ไปที่ Settings > เลื่อนลงไปที่ 'ลบบัญชี' แล้วยืนยันการลบ ข้อมูลทั้งหมดจะถูกลบถาวร",
    answerEn: "Go to Settings > Scroll down to 'Delete Account' and confirm. All data will be permanently deleted.",
    category: "account",
  },
  {
    question: "Free และ Pro ต่างกันอย่างไร?",
    questionEn: "What's the difference between Free and Pro?",
    answer: "Pro มีฟีเจอร์ AI สรุปเลคเชอร์ไม่จำกัด, สร้าง Resume AI, และไม่มีโฆษณา ในขณะที่ Free ใช้งานฟีเจอร์พื้นฐานได้ทั้งหมด",
    answerEn: "Pro includes unlimited AI lecture summaries, AI Resume builder, and ad-free experience. Free includes all basic features.",
    category: "billing",
  },
  {
    question: "ฉันจะติดต่อทีมพัฒนาได้อย่างไร?",
    questionEn: "How can I contact the team?",
    answer: "ส่ง Feedback ผ่านหน้า Feedback หรือติดต่อผ่าน Discord/Facebook ของเรา",
    answerEn: "Send feedback through the Feedback page or reach out via our Discord/Facebook.",
    category: "support",
  },
  {
    question: "AI Lecture Note ทำงานอย่างไร?",
    questionEn: "How does AI Lecture Note work?",
    answer: "อัดเสียงหรืออัปโหลดไฟล์เสียง AI จะถอดความและสรุปประเด็นสำคัญให้อัตโนมัติ (เฉพาะ Pro)",
    answerEn: "Record audio or upload files. AI will transcribe and summarize key points automatically (Pro only).",
    category: "features",
  },
];

const categories = [
  { id: "all", name: "ทั้งหมด", nameEn: "All" },
  { id: "general", name: "ทั่วไป", nameEn: "General" },
  { id: "features", name: "ฟีเจอร์", nameEn: "Features" },
  { id: "account", name: "บัญชี", nameEn: "Account" },
  { id: "billing", name: "การชำระเงิน", nameEn: "Billing" },
];

export default function HelpPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredFaqs = faqs.filter(faq => {
    const matchCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.questionEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={cn("flex items-start justify-between", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {language === "th" ? "ศูนย์ช่วยเหลือ" : "Help Center"}
          </h1>
          <p className="text-muted-foreground">
            {language === "th" ? "คำถามที่พบบ่อยและวิธีใช้งาน" : "FAQs and how to use Mai Lon"}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className={cn("relative", fadeInUp)} style={{ animationDelay: "100ms" }}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === "th" ? "ค้นหาคำถาม..." : "Search questions..."}
          className="w-full h-12 pl-12 pr-4 rounded-xl border border-input bg-background text-foreground text-lg"
        />
      </div>

      {/* Quick Links */}
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", fadeInUp)} style={{ animationDelay: "150ms" }}>
        <Card className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="font-medium text-foreground">{language === "th" ? "คู่มือการใช้งาน" : "User Guide"}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6" />
            </div>
            <p className="font-medium text-foreground">Discord</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <p className="font-medium text-foreground">{language === "th" ? "อีเมล" : "Email"}</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="font-medium text-foreground">{language === "th" ? "ขอฟีเจอร์" : "Request Feature"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className={cn("flex gap-2 overflow-x-auto", fadeInUp)} style={{ animationDelay: "200ms" }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              selectedCategory === cat.id
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {language === "th" ? cat.name : cat.nameEn}
          </button>
        ))}
      </div>

      {/* FAQs */}
      <Card className={cn(fadeInUp)} style={{ animationDelay: "300ms" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            {language === "th" ? "คำถามที่พบบ่อย" : "Frequently Asked Questions"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {language === "th" ? "ไม่พบคำถามที่ค้นหา" : "No questions found"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFaqs.map((faq, i) => (
                <div
                  key={i}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium text-foreground">
                      {language === "th" ? faq.question : faq.questionEn}
                    </span>
                    {expandedFaq === i ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {expandedFaq === i && (
                    <div className="px-4 pb-4 text-muted-foreground">
                      {language === "th" ? faq.answer : faq.answerEn}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className={cn("bg-primary/5 border-primary/20", fadeInUp)} style={{ animationDelay: "400ms" }}>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">
            {language === "th" ? "ยังไม่พบคำตอบ?" : "Still need help?"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {language === "th" 
              ? "ติดต่อทีมพัฒนาได้ตลอด 24 ชั่วโมง" 
              : "Contact our team anytime"}
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" className="rounded-xl gap-2">
              <MessageCircle className="w-4 h-4" />
              Discord
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl gap-2">
              <Mail className="w-4 h-4" />
              {language === "th" ? "ส่งอีเมล" : "Send Email"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
