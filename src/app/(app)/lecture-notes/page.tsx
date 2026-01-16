"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Plus,
  Mic,
  FileAudio,
  Play,
  Pause,
  Trash2,
  FileText,
  Sparkles,
  Clock,
  MoreVertical,
  Upload,
  Loader2,
  BookOpen,
  Copy,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";

const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

interface LectureNote {
  id: string;
  title: string;
  subject: string;
  duration: string;
  audioName: string;
  transcript: string;
  summary: string;
  keyPoints: string[];
  createdAt: string;
  status: "processing" | "completed";
}

// Mock summaries for demo
const mockSummaries = [
  {
    transcript: "บทนำเกี่ยวกับ Machine Learning และ Deep Learning ความแตกต่างระหว่าง Supervised และ Unsupervised Learning การประยุกต์ใช้ในโลกจริง เช่น การจำแนกภาพ การแปลภาษา และระบบแนะนำ...",
    summary: "บทเรียนนี้แนะนำพื้นฐานของ Machine Learning โดยแบ่งเป็น 2 ประเภทหลัก: Supervised Learning (มี label) และ Unsupervised Learning (ไม่มี label) พร้อมตัวอย่างการใช้งานจริง",
    keyPoints: [
      "Machine Learning เป็น subset ของ AI",
      "Supervised Learning ใช้ข้อมูลที่มี label",
      "Unsupervised Learning หา pattern เอง",
      "Deep Learning ใช้ Neural Networks หลายชั้น",
    ],
  },
  {
    transcript: "หลักการเขียนโปรแกรมเชิงวัตถุ Object-Oriented Programming ประกอบด้วย 4 หลักการสำคัญ: Encapsulation, Abstraction, Inheritance, Polymorphism...",
    summary: "OOP มี 4 หลักการ: Encapsulation (ซ่อนข้อมูล), Abstraction (แสดงเฉพาะสิ่งจำเป็น), Inheritance (สืบทอด), Polymorphism (หลายรูปแบบ)",
    keyPoints: [
      "Encapsulation = ซ่อนรายละเอียดภายใน",
      "Abstraction = แสดงเฉพาะ interface",
      "Inheritance = สืบทอดคุณสมบัติ",
      "Polymorphism = method ทำงานต่างกันได้",
    ],
  },
  {
    transcript: "เศรษฐศาสตร์มหภาค Macroeconomics ศึกษาเกี่ยวกับระบบเศรษฐกิจโดยรวม GDP, อัตราเงินเฟ้อ, การว่างงาน, นโยบายการเงินและการคลัง...",
    summary: "เศรษฐศาสตร์มหภาคศึกษาระบบเศรษฐกิจในภาพรวม วัดด้วย GDP, อัตราเงินเฟ้อ, การว่างงาน และควบคุมด้วยนโยบายการเงิน/การคลัง",
    keyPoints: [
      "GDP = มูลค่าสินค้าและบริการทั้งหมด",
      "เงินเฟ้อ = ราคาสินค้าเพิ่มขึ้น",
      "นโยบายการเงิน = ควบคุมโดยธนาคารกลาง",
      "นโยบายการคลัง = รัฐบาลใช้จ่ายและเก็บภาษี",
    ],
  },
];

export default function LectureNotesPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState<LectureNote[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedNote, setSelectedNote] = useState<LectureNote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    subject: "",
    file: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mailon_lecture_notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mailon_lecture_notes", JSON.stringify(notes));
    }
  }, [notes, mounted]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm({ ...uploadForm, file });
      if (!uploadForm.title) {
        setUploadForm(prev => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, ""), file }));
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title) {
      toast.error(language === "th" ? "กรุณาเลือกไฟล์และใส่ชื่อ" : "Please select a file and add a title");
      return;
    }

    setIsUploading(true);

    // Simulate processing
    const mockData = mockSummaries[Math.floor(Math.random() * mockSummaries.length)];
    
    // Create new note with "processing" status
    const newNote: LectureNote = {
      id: Date.now().toString(),
      title: uploadForm.title,
      subject: uploadForm.subject || "General",
      duration: `${Math.floor(Math.random() * 45 + 15)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
      audioName: uploadForm.file.name,
      transcript: "",
      summary: "",
      keyPoints: [],
      createdAt: new Date().toISOString(),
      status: "processing",
    };

    setNotes([newNote, ...notes]);
    setIsModalOpen(false);
    setUploadForm({ title: "", subject: "", file: null });

    // Simulate AI processing delay
    setTimeout(() => {
      setNotes(prev => prev.map(n => 
        n.id === newNote.id 
          ? { ...n, ...mockData, status: "completed" as const }
          : n
      ));
      toast.success(language === "th" ? "สรุปเสร็จแล้ว! ✨" : "Summary complete! ✨");
    }, 3000);

    setIsUploading(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote?.id === id) setSelectedNote(null);
    toast.success(language === "th" ? "ลบแล้ว" : "Deleted");
  };

  const handleCopySummary = (note: LectureNote) => {
    const text = `${note.title}\n\n${note.summary}\n\nKey Points:\n${note.keyPoints.map(p => `• ${p}`).join("\n")}`;
    navigator.clipboard.writeText(text);
    toast.success(language === "th" ? "คัดลอกแล้ว!" : "Copied!");
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={cn("flex items-start justify-between", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {language === "th" ? "โน้ตบรรยาย" : "Lecture Notes"}
          </h1>
          <p className="text-muted-foreground">
            {language === "th" ? "อัปโหลดเสียงบรรยาย ให้ AI สรุปให้" : "Upload lecture audio for AI transcription & summary"}
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          {language === "th" ? "อัปโหลด" : "Upload"}
        </Button>
      </div>

      {/* Stats */}
      <div className={cn("grid grid-cols-3 gap-4", fadeInUp)} style={{ animationDelay: "100ms" }}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "โน้ตทั้งหมด" : "Total Notes"}</p>
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{notes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "กำลังประมวลผล" : "Processing"}</p>
              <Loader2 className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {notes.filter(n => n.status === "processing").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "สรุปเสร็จ" : "Completed"}</p>
              <Sparkles className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {notes.filter(n => n.status === "completed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={language === "th" ? "อัปโหลดไฟล์เสียง" : "Upload Audio File"}
      >
        <div className="space-y-4">
          {/* File Drop Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
              uploadForm.file ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            )}
          >
            {uploadForm.file ? (
              <div className="flex items-center justify-center gap-3">
                <FileAudio className="w-8 h-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-foreground">{uploadForm.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadForm.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Mic className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium text-foreground">
                  {language === "th" ? "คลิกเพื่อเลือกไฟล์เสียง" : "Click to select audio file"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  MP3, WAV, M4A, WEBM (max 25MB)
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Title & Subject */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {language === "th" ? "ชื่อบันทึก" : "Note Title"} *
            </label>
            <input
              type="text"
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              placeholder={language === "th" ? "เช่น บทที่ 1 - Introduction" : "e.g. Chapter 1 - Introduction"}
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {language === "th" ? "วิชา" : "Subject"}
            </label>
            <input
              type="text"
              value={uploadForm.subject}
              onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
              placeholder={language === "th" ? "เช่น CS101" : "e.g. CS101"}
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
            />
          </div>

          {/* Info Banner */}
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              ⚠️ {language === "th" 
                ? "นี่เป็นเวอร์ชัน Demo - AI สรุปจะใช้ข้อมูลจำลอง" 
                : "This is a Demo version - AI summary uses mock data"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl">
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || !uploadForm.file}
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl gap-2"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {language === "th" ? "สรุปด้วย AI" : "Summarize with AI"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Notes Grid */}
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", fadeInUp)} style={{ animationDelay: "200ms" }}>
        {notes.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Mic className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground text-lg">
                {language === "th" ? "ยังไม่มีโน้ตบรรยาย" : "No lecture notes yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                {language === "th" 
                  ? "อัปโหลดไฟล์เสียงบรรยายเพื่อให้ AI สรุปให้อัตโนมัติ" 
                  : "Upload lecture audio for automatic AI transcription and summary"}
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                {language === "th" ? "อัปโหลดไฟล์แรก" : "Upload First File"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          notes.map(note => (
            <Card
              key={note.id}
              className={cn(
                "cursor-pointer hover:shadow-lg transition-all",
                note.status === "processing" && "animate-pulse"
              )}
              onClick={() => note.status === "completed" && setSelectedNote(note)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      note.status === "processing" ? "bg-orange-100" : "bg-primary/10"
                    )}>
                      {note.status === "processing" ? (
                        <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                      ) : (
                        <FileText className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{note.title}</p>
                      <p className="text-xs text-muted-foreground">{note.subject}</p>
                    </div>
                  </div>
                  {note.status === "completed" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCopySummary(note); }}>
                          <Copy className="w-4 h-4 mr-2" />
                          {language === "th" ? "คัดลอก" : "Copy"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          {language === "th" ? "ลบ" : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {note.status === "processing" ? (
                  <p className="text-sm text-muted-foreground">
                    {language === "th" ? "กำลังถอดเสียงและสรุป..." : "Transcribing and summarizing..."}
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground line-clamp-2">{note.summary}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {note.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {note.keyPoints.length} key points
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Selected Note Detail Modal */}
      <Modal
        isOpen={!!selectedNote}
        onClose={() => setSelectedNote(null)}
        title={selectedNote?.title || ""}
      >
        {selectedNote && (
          <div className="space-y-4">
            {/* Summary */}
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {language === "th" ? "สรุป" : "Summary"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedNote.summary}
              </p>
            </div>

            {/* Key Points */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {language === "th" ? "ประเด็นสำคัญ" : "Key Points"}
              </h3>
              <ul className="space-y-2">
                {selectedNote.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Transcript Preview */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {language === "th" ? "ตัวอย่างคำบรรยาย" : "Transcript Preview"}
              </h3>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-xl">
                {selectedNote.transcript}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => handleCopySummary(selectedNote)}
                className="flex-1 rounded-xl gap-2"
              >
                <Copy className="w-4 h-4" />
                {language === "th" ? "คัดลอก" : "Copy"}
              </Button>
              <Button
                onClick={() => setSelectedNote(null)}
                className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl"
              >
                {language === "th" ? "ปิด" : "Close"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
