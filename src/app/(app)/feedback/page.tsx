"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import {
  MessageSquare,
  Bug,
  Lightbulb,
  Send,
  Filter,
  ChevronDown,
  Plus,
  MoreVertical,
  Heart,
  ThumbsUp,
  Trash2,
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

type FeedbackType = "bug" | "improvement" | "feature";
type FeedbackStatus = "pending" | "in-progress" | "completed";

interface FeedbackItem {
  id: string;
  title: string;
  description: string;
  type: FeedbackType;
  status: FeedbackStatus;
  author: string;
  authorInitial: string;
  comments: number;
  votes: number;
  createdAt: string;
}

const typeConfig = {
  bug: { label: "Bug Report", labelTh: "รายงานบัค", color: "bg-red-500 text-white" },
  improvement: { label: "Improvement", labelTh: "ปรับปรุง", color: "bg-amber-500 text-white" },
  feature: { label: "Feature", labelTh: "ฟีเจอร์ใหม่", color: "bg-blue-500 text-white" },
};

const statusConfig = {
  pending: { label: "Pending", labelTh: "รอพิจารณา", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  "in-progress": { label: "In Progress", labelTh: "กำลังดำเนินการ", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" },
  completed: { label: "Completed", labelTh: "เสร็จแล้ว", color: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400" },
};

// Sample community feedback
const sampleFeedback: FeedbackItem[] = [
  {
    id: "1",
    title: "Analytics and spending trends don't include cancelled subscriptions",
    description: "When I cancel a subscription, it should still show in my spending history for that month.",
    type: "improvement",
    status: "completed",
    author: "Planxnx",
    authorInitial: "P",
    comments: 0,
    votes: 5,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Wrong Redirect URL for Email Verification",
    description: "After clicking the email verification link, it redirects to a 404 page instead of the dashboard.",
    type: "bug",
    status: "completed",
    author: "Planxnx",
    authorInitial: "P",
    comments: 2,
    votes: 8,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Changed my frequency and working our currency incorrectly",
    description: "The currency conversion doesn't work properly when changing payment frequency.",
    type: "bug",
    status: "completed",
    author: "OCD",
    authorInitial: "O",
    comments: 1,
    votes: 3,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "Unable to add payment method to any subscriptions",
    description: "The add payment button doesn't respond when clicked in the subscription management page.",
    type: "bug",
    status: "completed",
    author: "Curt",
    authorInitial: "C",
    comments: 1,
    votes: 4,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function timeAgo(dateStr: string, lang: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diff < 60) return lang === "th" ? "เมื่อสักครู่" : "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} ${lang === "th" ? "นาทีที่แล้ว" : "min ago"}`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ${lang === "th" ? "ชั่วโมงที่แล้ว" : "hours ago"}`;
  return `${Math.floor(diff / 86400)} ${lang === "th" ? "วันที่แล้ว" : "days ago"}`;
}

export default function FeedbackPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [newFeedback, setNewFeedback] = useState({
    title: "",
    description: "",
    type: "improvement" as FeedbackType,
  });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mailon_community_feedback");
    if (saved) {
      setFeedbacks(JSON.parse(saved));
    } else {
      setFeedbacks(sampleFeedback);
      localStorage.setItem("mailon_community_feedback", JSON.stringify(sampleFeedback));
    }
  }, []);

  useEffect(() => {
    if (mounted && feedbacks.length > 0) {
      localStorage.setItem("mailon_community_feedback", JSON.stringify(feedbacks));
    }
  }, [feedbacks, mounted]);

  const handleSubmit = () => {
    if (!newFeedback.title.trim()) {
      toast.error(language === "th" ? "กรุณาใส่หัวข้อ" : "Please enter a title");
      return;
    }

    const onboardingData = localStorage.getItem("onboarding_data");
    const userName = onboardingData ? JSON.parse(onboardingData).displayName : "User";

    const feedback: FeedbackItem = {
      id: Date.now().toString(),
      title: newFeedback.title,
      description: newFeedback.description,
      type: newFeedback.type,
      status: "pending",
      author: userName,
      authorInitial: userName.charAt(0).toUpperCase(),
      comments: 0,
      votes: 0,
      createdAt: new Date().toISOString(),
    };

    setFeedbacks([feedback, ...feedbacks]);
    setNewFeedback({ title: "", description: "", type: "improvement" });
    setIsModalOpen(false);
    toast.success(language === "th" ? "ส่ง Feedback แล้ว!" : "Feedback submitted!");
  };

  const handleVote = (id: string) => {
    setFeedbacks(feedbacks.map(f => 
      f.id === id ? { ...f, votes: f.votes + 1 } : f
    ));
  };

  const handleDelete = (id: string) => {
    setFeedbacks(feedbacks.filter(f => f.id !== id));
    toast.success(language === "th" ? "ลบแล้ว" : "Deleted");
  };

  // Filter and sort
  let filteredFeedbacks = feedbacks;
  if (filterType !== "all") {
    filteredFeedbacks = filteredFeedbacks.filter(f => f.type === filterType);
  }
  if (filterStatus !== "all") {
    filteredFeedbacks = filteredFeedbacks.filter(f => f.status === filterStatus);
  }
  if (sortBy === "newest") {
    filteredFeedbacks = [...filteredFeedbacks].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (sortBy === "votes") {
    filteredFeedbacks = [...filteredFeedbacks].sort((a, b) => b.votes - a.votes);
  }

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={cn("flex items-start justify-between", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {language === "th" ? "Feedback & Suggestions" : "Feedback & Suggestions"}
          </h1>
          <p className="text-muted-foreground">
            {language === "th" 
              ? "ช่วยเราปรับปรุงโดยแชร์ feedback, รายงานบัค, หรือเสนอฟีเจอร์" 
              : "Help us improve by sharing your feedback, reporting bugs, or requesting features."}
          </p>
        </div>
      </div>

      {/* Filters & Submit Button */}
      <div className={cn("flex flex-wrap items-center gap-3", fadeInUp)} style={{ animationDelay: "100ms" }}>
        {/* Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-xl gap-2">
              {filterType === "all" ? (language === "th" ? "ประเภททั้งหมด" : "All Types") : typeConfig[filterType as FeedbackType]?.label}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="rounded-xl">
            <DropdownMenuItem onClick={() => setFilterType("all")} className="rounded-lg">
              {language === "th" ? "ทั้งหมด" : "All Types"}
            </DropdownMenuItem>
            {Object.entries(typeConfig).map(([key, config]) => (
              <DropdownMenuItem key={key} onClick={() => setFilterType(key)} className="rounded-lg">
                {language === "th" ? config.labelTh : config.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-xl gap-2">
              {filterStatus === "all" ? (language === "th" ? "สถานะทั้งหมด" : "All Statuses") : statusConfig[filterStatus as FeedbackStatus]?.label}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="rounded-xl">
            <DropdownMenuItem onClick={() => setFilterStatus("all")} className="rounded-lg">
              {language === "th" ? "ทั้งหมด" : "All Statuses"}
            </DropdownMenuItem>
            {Object.entries(statusConfig).map(([key, config]) => (
              <DropdownMenuItem key={key} onClick={() => setFilterStatus(key)} className="rounded-lg">
                {language === "th" ? config.labelTh : config.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-xl gap-2">
              {sortBy === "newest" ? (language === "th" ? "ใหม่สุด" : "Newest") : (language === "th" ? "โหวตสูง" : "Most Voted")}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="rounded-xl">
            <DropdownMenuItem onClick={() => setSortBy("newest")} className="rounded-lg">
              {language === "th" ? "ใหม่สุด" : "Newest"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("votes")} className="rounded-lg">
              {language === "th" ? "โหวตสูง" : "Most Voted"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />

        {/* Submit Button */}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white rounded-xl gap-2"
        >
          <Plus className="w-4 h-4" />
          {language === "th" ? "ส่ง Feedback" : "Submit Feedback"}
        </Button>
      </div>

      {/* Submit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={language === "th" ? "ส่ง Feedback" : "Submit Feedback"}
      >
        <div className="space-y-4">
          {/* Type Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {language === "th" ? "ประเภท" : "Type"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(typeConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setNewFeedback({ ...newFeedback, type: key as FeedbackType })}
                  className={cn(
                    "py-2 px-3 rounded-xl text-sm font-medium transition-all border-2",
                    newFeedback.type === key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {language === "th" ? config.labelTh : config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {language === "th" ? "หัวข้อ" : "Title"} *
            </label>
            <input
              type="text"
              value={newFeedback.title}
              onChange={(e) => setNewFeedback({ ...newFeedback, title: e.target.value })}
              placeholder={language === "th" ? "อธิบายสั้นๆ..." : "Brief description..."}
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {language === "th" ? "รายละเอียด" : "Description"}
            </label>
            <textarea
              value={newFeedback.description}
              onChange={(e) => setNewFeedback({ ...newFeedback, description: e.target.value })}
              placeholder={language === "th" ? "อธิบายเพิ่มเติม (ถ้ามี)..." : "Additional details (optional)..."}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl">
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl gap-2">
              <Send className="w-4 h-4" />
              {language === "th" ? "ส่ง" : "Submit"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Feedback List */}
      <div className={cn("space-y-4", fadeInUp)} style={{ animationDelay: "200ms" }}>
        {filteredFeedbacks.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-semibold text-foreground">
                {language === "th" ? "ยังไม่มี Feedback" : "No feedback yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "th" ? "เป็นคนแรกที่แชร์ความคิดเห็น!" : "Be the first to share your thoughts!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFeedbacks.map(feedback => {
            const type = typeConfig[feedback.type];
            const status = statusConfig[feedback.status];
            
            return (
              <Card key={feedback.id} className="border-l-4 border-l-transparent hover:border-l-primary transition-colors">
                <CardContent className="p-4 md:p-6">
                  {/* Title & Badges */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="font-semibold text-foreground text-lg leading-tight">
                      {feedback.title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", type.color)}>
                        {language === "th" ? type.labelTh : type.label}
                      </span>
                      <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", status.color)}>
                        {language === "th" ? status.labelTh : status.label}
                      </span>
                    </div>
                  </div>

                  {feedback.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {feedback.description}
                    </p>
                  )}

                  {/* Author & Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                        {feedback.authorInitial}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">{feedback.author}</span>
                        <span>·</span>
                        <span>{timeAgo(feedback.createdAt, language)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Vote Button */}
                      <button
                        onClick={() => handleVote(feedback.id)}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm font-medium">{feedback.votes}</span>
                      </button>

                      {/* Comments */}
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">{feedback.comments}</span>
                      </div>

                      {/* More Options */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem
                            onClick={() => handleDelete(feedback.id)}
                            className="rounded-lg text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {language === "th" ? "ลบ" : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
