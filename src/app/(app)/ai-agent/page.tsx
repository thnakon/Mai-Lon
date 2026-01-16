"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Trash2,
  Copy,
  RotateCcw,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Code,
} from "lucide-react";
import { toast } from "sonner";

const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Mock AI responses
const mockResponses: Record<string, string[]> = {
  greeting: [
    "สวัสดีครับ! ผมเป็น AI ช่วยเรียนของคุณ มีอะไรให้ช่วยไหมครับ? 😊",
    "ยินดีต้อนรับครับ! ผมพร้อมช่วยคุณเรื่องการเรียนแล้ว วันนี้จะถามอะไรดี?",
    "Hi! ผมเป็น AI tutor ของคุณ ถามได้เลยครับ ไม่ว่าจะเป็นเรื่องอะไร!",
  ],
  study: [
    "การเรียนที่มีประสิทธิภาพนั้นควรใช้เทคนิค Active Recall - คือการทดสอบตัวเองบ่อยๆ แทนที่จะแค่อ่านซ้ำ นอกจากนี้ Spaced Repetition ก็ช่วยได้มาก โดยทบทวนเนื้อหาเป็นช่วงๆ เช่น 1 วัน, 3 วัน, 1 สัปดาห์",
    "แนะนำให้ใช้วิธี Pomodoro: เรียน 25 นาที พัก 5 นาที ทำ 4 รอบแล้วพักยาว 15-30 นาที จะช่วยให้สมาธิดีขึ้นครับ",
    "เทคนิค Feynman ก็ดีมาก: ลองอธิบายสิ่งที่เรียนให้คนอื่นฟังเหมือนเขาไม่รู้อะไรเลย ถ้าอธิบายไม่ได้ แสดงว่าเรายังไม่เข้าใจจริง",
  ],
  code: [
    "การเขียนโค้ดที่ดีควรเริ่มจากการเข้าใจปัญหาก่อน แล้วค่อยวาง pseudocode จากนั้นค่อยเขียนโค้ดจริง สำคัญคืออย่าลืม test และ refactor",
    "Tips สำหรับ debug: 1) ใช้ console.log หรือ print ดูค่า 2) อ่าน error message ให้ละเอียด 3) ลอง rubber duck debugging - อธิบายปัญหาออกมาดังๆ",
    "Clean code สำคัญมาก: ตั้งชื่อตัวแปรให้ชัดเจน, แยก function ย่อยๆ, เขียน comment เฉพาะที่จำเป็น, และทำ DRY (Don't Repeat Yourself)",
  ],
  math: [
    "คณิตศาสตร์นั้นต้องเข้าใจ concept ก่อนท่องสูตร ลองวาดภาพ ใช้ตัวอย่างจริง และทำโจทย์บ่อยๆ จะช่วยให้เข้าใจลึกมากขึ้น",
    "ถ้าติดเรื่อง Calculus: derivation มองว่าคือ 'อัตราการเปลี่ยนแปลง' ส่วน integration คือ 'การรวมสะสม' พอเข้าใจ concept แล้วสูตรจะจำง่ายขึ้น",
    "Linear Algebra สำคัญมากสำหรับ CS และ Data Science - Matrix คือการแปลงข้อมูล, Eigenvalue/Eigenvector บอกทิศทางหลัก",
  ],
  default: [
    "คำถามน่าสนใจครับ! ลองอธิบายเพิ่มเติมได้ไหมว่าอยากรู้เรื่องนี้ในแง่ไหน?",
    "ผมเข้าใจคำถามแล้ว แต่อยากให้ลองถามเฉพาะเจาะจงกว่านี้ได้ไหมครับ จะได้ช่วยได้ตรงจุดมากขึ้น",
    "น่าสนใจเลย! ถ้าอยากได้คำตอบที่ละเอียด ลองถามแบบระบุหัวข้อหรือวิชาที่ต้องการได้นะครับ",
  ],
};

// Quick prompts
const quickPrompts = [
  { icon: Lightbulb, label: "วิธีเรียนให้เก่ง", labelEn: "Study tips", query: "มีเทคนิคการเรียนให้มีประสิทธิภาพไหม" },
  { icon: Code, label: "ถาม coding", labelEn: "Coding help", query: "ช่วยอธิบายวิธีเขียนโค้ดที่ดีหน่อย" },
  { icon: BookOpen, label: "สรุปบทเรียน", labelEn: "Summarize lesson", query: "ช่วยสรุปวิธีจำเนื้อหาให้ได้นาน" },
  { icon: HelpCircle, label: "ถามทั่วไป", labelEn: "General question", query: "สวัสดี แนะนำตัวหน่อย" },
];

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes("สวัสดี") || lower.includes("hello") || lower.includes("hi") || lower.includes("แนะนำ")) {
    return mockResponses.greeting[Math.floor(Math.random() * mockResponses.greeting.length)];
  }
  if (lower.includes("เรียน") || lower.includes("study") || lower.includes("สอบ") || lower.includes("จำ")) {
    return mockResponses.study[Math.floor(Math.random() * mockResponses.study.length)];
  }
  if (lower.includes("code") || lower.includes("โค้ด") || lower.includes("programming") || lower.includes("debug")) {
    return mockResponses.code[Math.floor(Math.random() * mockResponses.code.length)];
  }
  if (lower.includes("math") || lower.includes("คณิต") || lower.includes("calculus") || lower.includes("สูตร")) {
    return mockResponses.math[Math.floor(Math.random() * mockResponses.math.length)];
  }
  
  return mockResponses.default[Math.floor(Math.random() * mockResponses.default.length)];
}

export default function AIAgentPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mailon_ai_chat");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      // Add welcome message
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: language === "th" 
          ? "สวัสดีครับ! 👋 ผมเป็น AI ช่วยเรียนของคุณ ถามได้เลยครับ ไม่ว่าจะเป็นเรื่องการเรียน เขียนโค้ด หรือเรื่องอื่นๆ!"
          : "Hello! 👋 I'm your AI study assistant. Feel free to ask me anything about studying, coding, or anything else!",
        timestamp: new Date().toISOString(),
      }]);
    }
  }, []);

  useEffect(() => {
    if (mounted && messages.length > 0) {
      localStorage.setItem("mailon_ai_chat", JSON.stringify(messages));
    }
  }, [messages, mounted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getAIResponse(userMessage.content),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleQuickPrompt = (query: string) => {
    setInput(query);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: language === "th" 
        ? "ล้างประวัติแชทแล้ว! มีอะไรให้ช่วยไหมครับ? 😊"
        : "Chat cleared! How can I help you? 😊",
      timestamp: new Date().toISOString(),
    }]);
    toast.success(language === "th" ? "ล้างประวัติแล้ว" : "Chat cleared");
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success(language === "th" ? "คัดลอกแล้ว!" : "Copied!");
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className={cn("flex items-start justify-between mb-4", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {language === "th" ? "AI ช่วยเรียน" : "AI Study Assistant"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === "th" ? "ถามได้ทุกเรื่อง พร้อมช่วยเสมอ" : "Ask anything, always ready to help"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearChat}
          className="rounded-xl gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {language === "th" ? "ล้างแชท" : "Clear"}
        </Button>
      </div>

      {/* Demo Banner */}
      <div className="mb-4 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800">
        <p className="text-sm text-violet-700 dark:text-violet-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {language === "th" 
            ? "Demo Mode - ตอบด้วย template (เชื่อม GPT-4 จะตอบได้ดีกว่านี้)" 
            : "Demo Mode - Uses template responses (Connect GPT-4 for better answers)"}
        </p>
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className={cn("mb-4", fadeInUp)} style={{ animationDelay: "100ms" }}>
          <p className="text-sm text-muted-foreground mb-2">
            {language === "th" ? "ลองถาม:" : "Try asking:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleQuickPrompt(prompt.query)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
              >
                <prompt.icon className="w-4 h-4 text-primary" />
                {language === "th" ? prompt.label : prompt.labelEn}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-4 h-full overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 group relative",
                    msg.role === "user"
                      ? "bg-primary text-white"
                      : "bg-muted text-foreground"
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <p className={cn(
                    "text-[10px] mt-1",
                    msg.role === "user" ? "text-white/60" : "text-muted-foreground"
                  )}>
                    {new Date(msg.timestamp).toLocaleTimeString(language === "th" ? "th-TH" : "en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {msg.role === "assistant" && (
                    <button
                      onClick={() => handleCopyMessage(msg.content)}
                      className="absolute -right-2 top-2 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-background" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Input */}
      <div className={cn("mt-4 flex gap-2", fadeInUp)} style={{ animationDelay: "200ms" }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder={language === "th" ? "พิมพ์ข้อความ..." : "Type a message..."}
          className="flex-1 h-12 px-4 rounded-xl border border-input bg-background text-foreground"
          disabled={isTyping}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 text-white"
        >
          {isTyping ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
