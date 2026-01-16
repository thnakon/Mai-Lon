"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Gift,
  ExternalLink,
  Search,
  Star,
  Tag,
  Percent,
  ShoppingBag,
  Utensils,
  Film,
  Bus,
  BookOpen,
  Laptop,
  Coffee,
  Dumbbell,
} from "lucide-react";

const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

// Privilege categories
const privilegeCategories = [
  { id: "all", name: "ทั้งหมด", nameEn: "All", icon: Gift },
  { id: "food", name: "อาหาร", nameEn: "Food", icon: Utensils },
  { id: "entertainment", name: "ความบันเทิง", nameEn: "Entertainment", icon: Film },
  { id: "transport", name: "การเดินทาง", nameEn: "Transport", icon: Bus },
  { id: "education", name: "การศึกษา", nameEn: "Education", icon: BookOpen },
  { id: "tech", name: "เทคโนโลยี", nameEn: "Tech", icon: Laptop },
  { id: "lifestyle", name: "ไลฟ์สไตล์", nameEn: "Lifestyle", icon: Coffee },
];

// Student privileges data
const privileges = [
  {
    id: 1,
    name: "Spotify Premium",
    description: "ลด 50% สำหรับนักศึกษา",
    descriptionEn: "50% off for students",
    category: "entertainment",
    discount: "50%",
    logo: "🎵",
    color: "bg-green-100",
    link: "https://spotify.com/student",
    isPopular: true,
  },
  {
    id: 2,
    name: "Apple Music",
    description: "ลด 50% พร้อม Apple TV+",
    descriptionEn: "50% off with Apple TV+",
    category: "entertainment",
    discount: "50%",
    logo: "🍎",
    color: "bg-gray-100",
    link: "https://apple.com/student",
    isPopular: true,
  },
  {
    id: 3,
    name: "GitHub Pro",
    description: "ฟรีสำหรับนักศึกษา",
    descriptionEn: "Free for students",
    category: "tech",
    discount: "ฟรี",
    logo: "🐙",
    color: "bg-purple-100",
    link: "https://education.github.com",
    isPopular: true,
  },
  {
    id: 4,
    name: "Figma",
    description: "ฟรีสำหรับการศึกษา",
    descriptionEn: "Free for education",
    category: "tech",
    discount: "ฟรี",
    logo: "🎨",
    color: "bg-pink-100",
    link: "https://figma.com/education",
    isPopular: false,
  },
  {
    id: 5,
    name: "McDonald's",
    description: "ลด 10% ทุกเมนู (แสดงบัตรนักศึกษา)",
    descriptionEn: "10% off all items",
    category: "food",
    discount: "10%",
    logo: "🍔",
    color: "bg-yellow-100",
    link: "#",
    isPopular: true,
  },
  {
    id: 6,
    name: "Major Cineplex",
    description: "ลด 50 บาท ทุกวันพุธ",
    descriptionEn: "50 THB off on Wednesdays",
    category: "entertainment",
    discount: "฿50",
    logo: "🎬",
    color: "bg-blue-100",
    link: "https://majorcineplex.com",
    isPopular: false,
  },
  {
    id: 7,
    name: "BTS/MRT",
    description: "บัตร Rabbit สำหรับนักศึกษา",
    descriptionEn: "Student Rabbit Card",
    category: "transport",
    discount: "ลดพิเศษ",
    logo: "🚇",
    color: "bg-green-100",
    link: "#",
    isPopular: false,
  },
  {
    id: 8,
    name: "Notion",
    description: "Plus Plan ฟรีสำหรับนักศึกษา",
    descriptionEn: "Free Plus Plan",
    category: "tech",
    discount: "ฟรี",
    logo: "📝",
    color: "bg-gray-100",
    link: "https://notion.so/students",
    isPopular: true,
  },
  {
    id: 9,
    name: "Adobe Creative Cloud",
    description: "ลด 60% สำหรับนักศึกษา",
    descriptionEn: "60% off for students",
    category: "tech",
    discount: "60%",
    logo: "🎭",
    color: "bg-red-100",
    link: "https://adobe.com/education",
    isPopular: true,
  },
  {
    id: 10,
    name: "Canva Pro",
    description: "ฟรีสำหรับการศึกษา",
    descriptionEn: "Free for education",
    category: "tech",
    discount: "ฟรี",
    logo: "✨",
    color: "bg-cyan-100",
    link: "https://canva.com/education",
    isPopular: false,
  },
  {
    id: 11,
    name: "Amazon Prime Student",
    description: "ลด 50% + ทดลองใช้ 6 เดือน",
    descriptionEn: "50% off + 6 month trial",
    category: "lifestyle",
    discount: "50%",
    logo: "📦",
    color: "bg-orange-100",
    link: "https://amazon.com/student",
    isPopular: false,
  },
  {
    id: 12,
    name: "Grammarly Premium",
    description: "ลดพิเศษสำหรับนักศึกษา",
    descriptionEn: "Student discount",
    category: "education",
    discount: "ลดพิเศษ",
    logo: "📖",
    color: "bg-emerald-100",
    link: "https://grammarly.com",
    isPopular: false,
  },
];

export default function PrivilegesPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedPrivileges, setSavedPrivileges] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mailon_saved_privileges");
    if (saved) setSavedPrivileges(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mailon_saved_privileges", JSON.stringify(savedPrivileges));
    }
  }, [savedPrivileges, mounted]);

  const toggleSave = (id: number) => {
    setSavedPrivileges(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const filteredPrivileges = privileges.filter(p => {
    const matchCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.includes(searchQuery) ||
      p.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const popularPrivileges = privileges.filter(p => p.isPopular);

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={cn("flex items-start justify-between", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {language === "th" ? "สิทธิพิเศษ" : "Privileges"}
          </h1>
          <p className="text-muted-foreground">
            {language === "th" ? "รวมส่วนลดและสิทธิพิเศษสำหรับนักศึกษา" : "Student discounts and benefits"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className={cn("grid grid-cols-3 gap-4", fadeInUp)} style={{ animationDelay: "100ms" }}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "สิทธิพิเศษทั้งหมด" : "Total Privileges"}</p>
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{privileges.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "ฟรี" : "Free"}</p>
              <Tag className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {privileges.filter(p => p.discount === "ฟรี").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "บันทึกไว้" : "Saved"}</p>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{savedPrivileges.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className={cn("flex flex-col md:flex-row gap-4", fadeInUp)} style={{ animationDelay: "150ms" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "th" ? "ค้นหาสิทธิพิเศษ..." : "Search privileges..."}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-foreground"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className={cn("flex gap-2 overflow-x-auto pb-2", fadeInUp)} style={{ animationDelay: "200ms" }}>
        {privilegeCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all",
              selectedCategory === cat.id
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <cat.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{language === "th" ? cat.name : cat.nameEn}</span>
          </button>
        ))}
      </div>

      {/* Popular Section */}
      {selectedCategory === "all" && searchQuery === "" && (
        <Card className={cn(fadeInUp)} style={{ animationDelay: "250ms" }}>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              {language === "th" ? "ยอดนิยม" : "Popular"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {popularPrivileges.slice(0, 4).map(p => (
                <button
                  key={p.id}
                  onClick={() => toggleSave(p.id)}
                  className={cn(
                    "p-4 rounded-xl text-left transition-all",
                    p.color,
                    savedPrivileges.includes(p.id) && "ring-2 ring-primary"
                  )}
                >
                  <span className="text-3xl">{p.logo}</span>
                  <p className="font-semibold mt-2 text-foreground">{p.name}</p>
                  <p className="text-sm text-primary font-bold mt-1">{p.discount}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Privileges */}
      <Card className={cn(fadeInUp)} style={{ animationDelay: "300ms" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {language === "th" ? "สิทธิพิเศษทั้งหมด" : "All Privileges"}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filteredPrivileges.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPrivileges.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">
                {language === "th" ? "ไม่พบสิทธิพิเศษ" : "No privileges found"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrivileges.map(p => (
                <div
                  key={p.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all hover:shadow-md",
                    savedPrivileges.includes(p.id) ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", p.color)}>
                      <span className="text-2xl">{p.logo}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSave(p.id)}
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                          savedPrivileges.includes(p.id)
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Star className={cn("w-4 h-4", savedPrivileges.includes(p.id) && "fill-current")} />
                      </button>
                      {p.link !== "#" && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{p.name}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                        {p.discount}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === "th" ? p.description : p.descriptionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
