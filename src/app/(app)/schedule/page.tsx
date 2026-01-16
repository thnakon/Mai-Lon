"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Plus,
  Calendar,
  Clock,
  MoreVertical,
  Trash2,
  Edit3,
  AlertTriangle,
  BookOpen,
  MapPin,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";

const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
const daysEn = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const colors = [
  "bg-orange-100 text-orange-700 border-orange-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-green-100 text-green-700 border-green-200",
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-pink-100 text-pink-700 border-pink-200",
  "bg-yellow-100 text-yellow-700 border-yellow-200",
  "bg-cyan-100 text-cyan-700 border-cyan-200",
];

interface ClassItem {
  id: string;
  name: string;
  code: string;
  day: number; // 0-6 (Mon-Sun)
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
  color: number;
}

interface Exam {
  id: string;
  name: string;
  date: string;
  time: string;
  room: string;
}

export default function SchedulePage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [isAddingExam, setIsAddingExam] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [newClass, setNewClass] = useState({
    name: "",
    code: "",
    day: 0,
    startTime: "09:00",
    endTime: "12:00",
    room: "",
    instructor: "",
    color: 0,
  });
  const [newExam, setNewExam] = useState({
    name: "",
    date: "",
    time: "",
    room: "",
  });

  useEffect(() => {
    setMounted(true);
    const savedClasses = localStorage.getItem("mailon_schedule");
    const savedExams = localStorage.getItem("mailon_exams");
    if (savedClasses) setClasses(JSON.parse(savedClasses));
    if (savedExams) setExams(JSON.parse(savedExams));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mailon_schedule", JSON.stringify(classes));
      localStorage.setItem("mailon_exams", JSON.stringify(exams));
    }
  }, [classes, exams, mounted]);

  // Get today's classes
  const todayClasses = classes.filter(c => c.day === selectedDay).sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Get upcoming exams (next 30 days)
  const upcomingExams = exams
    .filter(e => {
      const examDate = new Date(e.date);
      const now = new Date();
      const diff = (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 30;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAddClass = () => {
    if (!newClass.name) return;
    const classItem: ClassItem = {
      id: Date.now().toString(),
      ...newClass,
    };
    setClasses([...classes, classItem]);
    setNewClass({ name: "", code: "", day: 0, startTime: "09:00", endTime: "12:00", room: "", instructor: "", color: 0 });
    setIsAddingClass(false);
  };

  const handleAddExam = () => {
    if (!newExam.name || !newExam.date) return;
    const exam: Exam = {
      id: Date.now().toString(),
      ...newExam,
    };
    setExams([...exams, exam]);
    setNewExam({ name: "", date: "", time: "", room: "" });
    setIsAddingExam(false);
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const handleDeleteExam = (id: string) => {
    setExams(exams.filter(e => e.id !== id));
  };

  const getDaysUntil = (date: string) => {
    const examDate = new Date(date);
    const now = new Date();
    return Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={cn("flex items-start justify-between", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {language === "th" ? "ตารางเรียน" : "Schedule"}
          </h1>
          <p className="text-muted-foreground">
            {language === "th" ? "จัดการตารางเรียนและกำหนดการสอบ" : "Manage your class schedule and exams"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddingClass(true)}
            variant="outline"
            className="gap-2 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            {language === "th" ? "เพิ่มวิชา" : "Add Class"}
          </Button>
          <Button
            onClick={() => setIsAddingExam(true)}
            className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            {language === "th" ? "เพิ่มสอบ" : "Add Exam"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className={cn("grid grid-cols-3 gap-4", fadeInUp)} style={{ animationDelay: "100ms" }}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "วิชาทั้งหมด" : "Total Classes"}</p>
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{classes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "วันนี้" : "Today"}</p>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{todayClasses.length}</p>
            <p className="text-xs text-muted-foreground">{language === "th" ? "คาบ" : "classes"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "สอบใกล้ถึง" : "Upcoming Exams"}</p>
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{upcomingExams.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Exam Countdown */}
      {upcomingExams.length > 0 && (
        <Card className={cn("border-2 border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20", fadeInUp)} style={{ animationDelay: "150ms" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              {language === "th" ? "สอบที่กำลังจะถึง" : "Upcoming Exams"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {upcomingExams.slice(0, 3).map(exam => {
                const daysLeft = getDaysUntil(exam.date);
                return (
                  <div key={exam.id} className="p-4 rounded-xl bg-white dark:bg-background border border-red-200 dark:border-red-900">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{exam.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(exam.date).toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })} {exam.time && `· ${exam.time}`}
                        </p>
                        {exam.room && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> {exam.room}
                          </p>
                        )}
                      </div>
                      <div className={cn(
                        "px-3 py-1 rounded-full text-sm font-bold",
                        daysLeft <= 3 ? "bg-red-500 text-white" : daysLeft <= 7 ? "bg-orange-500 text-white" : "bg-muted text-foreground"
                      )}>
                        {daysLeft === 0 ? (language === "th" ? "วันนี้!" : "Today!") : `${daysLeft}d`}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteExam(exam.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          {language === "th" ? "ลบ" : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day Selector */}
      <div className={cn("flex items-center gap-2", fadeInUp)} style={{ animationDelay: "200ms" }}>
        <Button variant="ghost" size="icon" onClick={() => setSelectedDay(prev => prev === 0 ? 6 : prev - 1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 flex gap-1 overflow-x-auto">
          {days.map((day, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm font-medium transition-all min-w-[60px]",
                selectedDay === i
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {language === "th" ? day : daysEn[i]}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelectedDay(prev => prev === 6 ? 0 : prev + 1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Add Class Modal */}
      <Modal
        isOpen={isAddingClass}
        onClose={() => setIsAddingClass(false)}
        title={language === "th" ? "เพิ่มวิชาเรียน" : "Add Class"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{language === "th" ? "ชื่อวิชา" : "Subject"}</label>
              <input
                type="text"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                placeholder="Data Structures"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{language === "th" ? "รหัสวิชา" : "Code"}</label>
              <input
                type="text"
                value={newClass.code}
                onChange={(e) => setNewClass({ ...newClass, code: e.target.value })}
                placeholder="CS201"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{language === "th" ? "วัน" : "Day"}</label>
              <select
                value={newClass.day}
                onChange={(e) => setNewClass({ ...newClass, day: Number(e.target.value) })}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              >
                {days.map((d, i) => <option key={i} value={i}>{language === "th" ? d : daysEn[i]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{language === "th" ? "เริ่ม" : "Start"}</label>
              <input
                type="time"
                value={newClass.startTime}
                onChange={(e) => setNewClass({ ...newClass, startTime: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{language === "th" ? "จบ" : "End"}</label>
              <input
                type="time"
                value={newClass.endTime}
                onChange={(e) => setNewClass({ ...newClass, endTime: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{language === "th" ? "ห้อง" : "Room"}</label>
              <input
                type="text"
                value={newClass.room}
                onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                placeholder="SC-401"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{language === "th" ? "อาจารย์" : "Instructor"}</label>
              <input
                type="text"
                value={newClass.instructor}
                onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                placeholder="Dr. Smith"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">{language === "th" ? "สี" : "Color"}</label>
            <div className="flex gap-2">
              {colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setNewClass({ ...newClass, color: i })}
                  className={cn("w-8 h-8 rounded-lg border-2", c, newClass.color === i && "ring-2 ring-primary ring-offset-2")}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsAddingClass(false)} className="flex-1 rounded-xl">
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </Button>
            <Button onClick={handleAddClass} className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl">
              {language === "th" ? "บันทึก" : "Save"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Exam Modal */}
      <Modal
        isOpen={isAddingExam}
        onClose={() => setIsAddingExam(false)}
        title={language === "th" ? "เพิ่มกำหนดการสอบ" : "Add Exam"}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">{language === "th" ? "ชื่อวิชา/สอบ" : "Subject/Exam"}</label>
            <input
              type="text"
              value={newExam.name}
              onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
              placeholder="Midterm - Data Structures"
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{language === "th" ? "วันที่" : "Date"}</label>
              <input
                type="date"
                value={newExam.date}
                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{language === "th" ? "เวลา" : "Time"}</label>
              <input
                type="time"
                value={newExam.time}
                onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">{language === "th" ? "ห้องสอบ" : "Room"}</label>
              <input
                type="text"
                value={newExam.room}
                onChange={(e) => setNewExam({ ...newExam, room: e.target.value })}
                placeholder="MLC-301"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsAddingExam(false)} className="flex-1 rounded-xl">
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </Button>
            <Button onClick={handleAddExam} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl">
              {language === "th" ? "บันทึก" : "Save"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Today's Schedule */}
      <Card className={cn(fadeInUp)} style={{ animationDelay: "300ms" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {language === "th" ? `ตาราง${days[selectedDay]}` : `${daysEn[selectedDay]}'s Schedule`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayClasses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">
                {language === "th" ? "ไม่มีคาบเรียน" : "No classes"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "th" ? "วันนี้ว่าง!" : "Free day!"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayClasses.map(c => (
                <div key={c.id} className={cn("p-4 rounded-xl border-2 relative", colors[c.color])}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold">{c.name}</p>
                      <p className="text-sm opacity-80">{c.code}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteClass(c.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          {language === "th" ? "ลบ" : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {c.startTime} - {c.endTime}
                    </span>
                    {c.room && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {c.room}
                      </span>
                    )}
                  </div>
                  {c.instructor && (
                    <p className="text-sm mt-2 flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" /> {c.instructor}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
