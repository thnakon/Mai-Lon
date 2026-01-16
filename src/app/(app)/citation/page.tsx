"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Plus,
  BookOpen,
  Copy,
  Trash2,
  FileText,
  Globe,
  Newspaper,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";

const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

type SourceType = "book" | "website" | "journal" | "thesis";
type CitationStyle = "apa" | "mla" | "chicago";

interface Citation {
  id: string;
  type: SourceType;
  authors: string;
  title: string;
  year: string;
  publisher?: string;
  url?: string;
  journal?: string;
  volume?: string;
  pages?: string;
  accessDate?: string;
  university?: string;
  createdAt: string;
}

const sourceTypes = [
  { id: "book", icon: BookOpen, name: "หนังสือ", nameEn: "Book" },
  { id: "website", icon: Globe, name: "เว็บไซต์", nameEn: "Website" },
  { id: "journal", icon: Newspaper, name: "บทความวิชาการ", nameEn: "Journal" },
  { id: "thesis", icon: GraduationCap, name: "วิทยานิพนธ์", nameEn: "Thesis" },
];

const citationStyles = [
  { id: "apa", name: "APA 7th" },
  { id: "mla", name: "MLA 9th" },
  { id: "chicago", name: "Chicago" },
];

// Format citation based on style
function formatCitation(citation: Citation, style: CitationStyle): string {
  const { authors, title, year, publisher, url, journal, volume, pages, university, accessDate } = citation;
  
  if (style === "apa") {
    switch (citation.type) {
      case "book":
        return `${authors} (${year}). *${title}*. ${publisher || ""}.`;
      case "website":
        return `${authors} (${year}). ${title}. Retrieved ${accessDate || new Date().toLocaleDateString()} from ${url || ""}`;
      case "journal":
        return `${authors} (${year}). ${title}. *${journal || ""}*, ${volume || ""}${pages ? `, ${pages}` : ""}.`;
      case "thesis":
        return `${authors} (${year}). *${title}* [Doctoral dissertation, ${university || ""}].`;
      default:
        return `${authors} (${year}). ${title}.`;
    }
  } else if (style === "mla") {
    switch (citation.type) {
      case "book":
        return `${authors}. *${title}*. ${publisher || ""}, ${year}.`;
      case "website":
        return `${authors}. "${title}." *${publisher || "Web"}*, ${year}, ${url || ""}.`;
      case "journal":
        return `${authors}. "${title}." *${journal || ""}*, vol. ${volume || ""}, ${year}, pp. ${pages || ""}.`;
      case "thesis":
        return `${authors}. "${title}." ${year}. ${university || ""}, PhD dissertation.`;
      default:
        return `${authors}. "${title}." ${year}.`;
    }
  } else {
    // Chicago
    switch (citation.type) {
      case "book":
        return `${authors}. *${title}*. ${publisher || ""}, ${year}.`;
      case "website":
        return `${authors}. "${title}." Accessed ${accessDate || new Date().toLocaleDateString()}. ${url || ""}.`;
      case "journal":
        return `${authors}. "${title}." *${journal || ""}* ${volume || ""} (${year}): ${pages || ""}.`;
      case "thesis":
        return `${authors}. "${title}." PhD diss., ${university || ""}, ${year}.`;
      default:
        return `${authors}. "${title}." ${year}.`;
    }
  }
}

export default function CitationPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<CitationStyle>("apa");
  const [selectedType, setSelectedType] = useState<SourceType>("book");
  const [newCitation, setNewCitation] = useState({
    authors: "",
    title: "",
    year: new Date().getFullYear().toString(),
    publisher: "",
    url: "",
    journal: "",
    volume: "",
    pages: "",
    accessDate: "",
    university: "",
  });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mailon_citations");
    if (saved) setCitations(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mailon_citations", JSON.stringify(citations));
    }
  }, [citations, mounted]);

  const handleAddCitation = () => {
    if (!newCitation.authors || !newCitation.title) {
      toast.error(language === "th" ? "กรุณากรอกชื่อผู้แต่งและชื่อเรื่อง" : "Please enter author and title");
      return;
    }

    const citation: Citation = {
      id: Date.now().toString(),
      type: selectedType,
      ...newCitation,
      createdAt: new Date().toISOString(),
    };

    setCitations([citation, ...citations]);
    setNewCitation({
      authors: "",
      title: "",
      year: new Date().getFullYear().toString(),
      publisher: "",
      url: "",
      journal: "",
      volume: "",
      pages: "",
      accessDate: "",
      university: "",
    });
    setIsAdding(false);
    toast.success(language === "th" ? "เพิ่มแหล่งอ้างอิงแล้ว!" : "Citation added!");
  };

  const handleCopyCitation = (citation: Citation) => {
    const formatted = formatCitation(citation, selectedStyle);
    navigator.clipboard.writeText(formatted.replace(/\*/g, "")); // Remove markdown
    toast.success(language === "th" ? "คัดลอกแล้ว!" : "Copied!");
  };

  const handleCopyAll = () => {
    const all = citations.map(c => formatCitation(c, selectedStyle).replace(/\*/g, "")).join("\n\n");
    navigator.clipboard.writeText(all);
    toast.success(language === "th" ? "คัดลอกทั้งหมดแล้ว!" : "All citations copied!");
  };

  const handleDeleteCitation = (id: string) => {
    setCitations(citations.filter(c => c.id !== id));
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={cn("flex items-start justify-between", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {language === "th" ? "สร้างบรรณานุกรม" : "Citation Generator"}
          </h1>
          <p className="text-muted-foreground">
            {language === "th" ? "สร้างรายการอ้างอิงแบบ APA, MLA, Chicago" : "Generate APA, MLA, Chicago citations"}
          </p>
        </div>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          {language === "th" ? "เพิ่มแหล่งอ้างอิง" : "Add Source"}
        </Button>
      </div>

      {/* Stats & Style Selector */}
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", fadeInUp)} style={{ animationDelay: "100ms" }}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "แหล่งอ้างอิง" : "Sources"}</p>
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{citations.length}</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-2">{language === "th" ? "รูปแบบ" : "Citation Style"}</p>
            <div className="flex gap-2">
              {citationStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id as CitationStyle)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    selectedStyle === style.id
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {style.name}
                </button>
              ))}
              {citations.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleCopyAll}
                  className="ml-auto rounded-xl gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {language === "th" ? "คัดลอกทั้งหมด" : "Copy All"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Citation Modal */}
      <Modal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        title={language === "th" ? "เพิ่มแหล่งอ้างอิง" : "Add Citation Source"}
      >
        <div className="space-y-4">
          {/* Source Type */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {language === "th" ? "ประเภทแหล่งอ้างอิง" : "Source Type"}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {sourceTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as SourceType)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all text-center",
                    selectedType === type.id
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-muted hover:bg-muted/80"
                  )}
                >
                  <type.icon className="w-5 h-5 mx-auto mb-1" />
                  <p className="text-xs font-medium">{language === "th" ? type.name : type.nameEn}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === "th" ? "ผู้แต่ง" : "Author(s)"} *
              </label>
              <input
                type="text"
                value={newCitation.authors}
                onChange={(e) => setNewCitation({ ...newCitation, authors: e.target.value })}
                placeholder="Smith, J., & Johnson, M."
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === "th" ? "ชื่อเรื่อง" : "Title"} *
              </label>
              <input
                type="text"
                value={newCitation.title}
                onChange={(e) => setNewCitation({ ...newCitation, title: e.target.value })}
                placeholder="Introduction to Machine Learning"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === "th" ? "ปี" : "Year"}
              </label>
              <input
                type="text"
                value={newCitation.year}
                onChange={(e) => setNewCitation({ ...newCitation, year: e.target.value })}
                placeholder="2024"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
            {(selectedType === "book" || selectedType === "website") && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {language === "th" ? "สำนักพิมพ์" : "Publisher"}
                </label>
                <input
                  type="text"
                  value={newCitation.publisher}
                  onChange={(e) => setNewCitation({ ...newCitation, publisher: e.target.value })}
                  placeholder="Cambridge University Press"
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
                />
              </div>
            )}
          </div>

          {/* Website Fields */}
          {selectedType === "website" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-sm font-medium text-foreground mb-2 block">URL</label>
                <input
                  type="url"
                  value={newCitation.url}
                  onChange={(e) => setNewCitation({ ...newCitation, url: e.target.value })}
                  placeholder="https://example.com/article"
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {language === "th" ? "วันที่เข้าถึง" : "Access Date"}
                </label>
                <input
                  type="date"
                  value={newCitation.accessDate}
                  onChange={(e) => setNewCitation({ ...newCitation, accessDate: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
                />
              </div>
            </div>
          )}

          {/* Journal Fields */}
          {selectedType === "journal" && (
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {language === "th" ? "ชื่อวารสาร" : "Journal Name"}
                </label>
                <input
                  type="text"
                  value={newCitation.journal}
                  onChange={(e) => setNewCitation({ ...newCitation, journal: e.target.value })}
                  placeholder="Nature"
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Volume</label>
                <input
                  type="text"
                  value={newCitation.volume}
                  onChange={(e) => setNewCitation({ ...newCitation, volume: e.target.value })}
                  placeholder="12(3)"
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {language === "th" ? "หน้า" : "Pages"}
                </label>
                <input
                  type="text"
                  value={newCitation.pages}
                  onChange={(e) => setNewCitation({ ...newCitation, pages: e.target.value })}
                  placeholder="123-145"
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
                />
              </div>
            </div>
          )}

          {/* Thesis Fields */}
          {selectedType === "thesis" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === "th" ? "มหาวิทยาลัย" : "University"}
              </label>
              <input
                type="text"
                value={newCitation.university}
                onChange={(e) => setNewCitation({ ...newCitation, university: e.target.value })}
                placeholder="Chulalongkorn University"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1 rounded-xl">
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </Button>
            <Button onClick={handleAddCitation} className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl">
              {language === "th" ? "เพิ่ม" : "Add"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Citations List */}
      <Card className={cn(fadeInUp)} style={{ animationDelay: "200ms" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {language === "th" ? "รายการอ้างอิง" : "Bibliography"} ({selectedStyle.toUpperCase()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {citations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">
                {language === "th" ? "ยังไม่มีแหล่งอ้างอิง" : "No citations yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "th" ? "เพิ่มแหล่งอ้างอิงเพื่อสร้างบรรณานุกรม" : "Add sources to generate bibliography"}
              </p>
              <Button
                onClick={() => setIsAdding(true)}
                className="mt-4 bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                {language === "th" ? "เพิ่มแหล่งอ้างอิงแรก" : "Add First Source"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {citations.map((citation, index) => {
                const type = sourceTypes.find(t => t.id === citation.type);
                const formatted = formatCitation(citation, selectedStyle);
                return (
                  <div
                    key={citation.id}
                    className="p-4 rounded-xl bg-muted/50 group hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {type && <type.icon className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm text-foreground leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: formatted.replace(/\*(.*?)\*/g, "<em>$1</em>"),
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyCitation(citation)}
                          className="h-8 w-8"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCitation(citation.id)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
