"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Plus,
  Users,
  Receipt,
  Split,
  MoreVertical,
  Trash2,
  Check,
  User,
  DollarSign,
  Share2,
  Copy,
  ArrowRight,
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

interface Member {
  id: string;
  name: string;
  paid: number;
  owes: number;
}

interface Party {
  id: string;
  name: string;
  totalAmount: number;
  members: Member[];
  createdAt: string;
  isSettled: boolean;
}

export default function SplitPartyPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [parties, setParties] = useState<Party[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newParty, setNewParty] = useState({
    name: "",
    totalAmount: "",
    memberNames: ["", ""],
  });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mailon_split_parties");
    if (saved) setParties(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mailon_split_parties", JSON.stringify(parties));
    }
  }, [parties, mounted]);

  // Stats
  const totalParties = parties.length;
  const activeParties = parties.filter(p => !p.isSettled).length;
  const totalOwed = parties
    .filter(p => !p.isSettled)
    .reduce((sum, p) => {
      const myShare = p.totalAmount / p.members.length;
      return sum + myShare;
    }, 0);

  const handleAddMember = () => {
    setNewParty({
      ...newParty,
      memberNames: [...newParty.memberNames, ""],
    });
  };

  const handleRemoveMember = (index: number) => {
    if (newParty.memberNames.length <= 2) return;
    setNewParty({
      ...newParty,
      memberNames: newParty.memberNames.filter((_, i) => i !== index),
    });
  };

  const handleCreateParty = () => {
    if (!newParty.name || !newParty.totalAmount) return;
    const validMembers = newParty.memberNames.filter(n => n.trim());
    if (validMembers.length < 2) {
      toast.error(language === "th" ? "ต้องมีสมาชิกอย่างน้อย 2 คน" : "Need at least 2 members");
      return;
    }

    const total = Number(newParty.totalAmount);
    const perPerson = total / validMembers.length;

    const party: Party = {
      id: Date.now().toString(),
      name: newParty.name,
      totalAmount: total,
      members: validMembers.map((name, i) => ({
        id: `${Date.now()}-${i}`,
        name,
        paid: i === 0 ? total : 0, // First person paid
        owes: perPerson,
      })),
      createdAt: new Date().toISOString(),
      isSettled: false,
    };

    setParties([party, ...parties]);
    setNewParty({ name: "", totalAmount: "", memberNames: ["", ""] });
    setIsCreating(false);
    toast.success(language === "th" ? "สร้างปาร์ตี้สำเร็จ!" : "Party created!");
  };

  const handleSettleParty = (id: string) => {
    setParties(parties.map(p => p.id === id ? { ...p, isSettled: true } : p));
    toast.success(language === "th" ? "ปิดบิลเรียบร้อย!" : "Party settled!");
  };

  const handleDeleteParty = (id: string) => {
    setParties(parties.filter(p => p.id !== id));
  };

  const copyShareLink = (party: Party) => {
    const text = `${party.name}\nยอดรวม: ฿${party.totalAmount.toLocaleString()}\nคนละ: ฿${Math.round(party.totalAmount / party.members.length).toLocaleString()}\n\nสมาชิก:\n${party.members.map(m => `- ${m.name}`).join("\n")}`;
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
            {language === "th" ? "แบ่งจ่าย" : "Split Party"}
          </h1>
          <p className="text-muted-foreground">
            {language === "th" ? "หารค่าใช้จ่ายกับเพื่อนง่ายๆ" : "Split expenses with friends easily"}
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          {language === "th" ? "สร้างปาร์ตี้" : "New Party"}
        </Button>
      </div>

      {/* Stats */}
      <div className={cn("grid grid-cols-3 gap-4", fadeInUp)} style={{ animationDelay: "100ms" }}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "ปาร์ตี้ทั้งหมด" : "Total Parties"}</p>
              <Users className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalParties}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "ยังไม่ปิด" : "Active"}</p>
              <Receipt className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{activeParties}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "ยอดรวม" : "Total Owed"}</p>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">฿{Math.round(totalOwed).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Party Modal */}
      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title={language === "th" ? "สร้างปาร์ตี้ใหม่" : "Create New Party"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === "th" ? "ชื่อปาร์ตี้" : "Party Name"}
              </label>
              <input
                type="text"
                value={newParty.name}
                onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                placeholder={language === "th" ? "เช่น กินบุฟเฟต์" : "e.g. Dinner split"}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
                autoFocus
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === "th" ? "ยอดรวม (บาท)" : "Total Amount (THB)"}
              </label>
              <input
                type="number"
                value={newParty.totalAmount}
                onChange={(e) => setNewParty({ ...newParty, totalAmount: e.target.value })}
                placeholder="0"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
          </div>

          {/* Members */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {language === "th" ? "สมาชิก" : "Members"} ({newParty.memberNames.length})
            </label>
            <div className="space-y-2">
              {newParty.memberNames.map((name, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-8 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-medium">
                    {i + 1}
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const updated = [...newParty.memberNames];
                      updated[i] = e.target.value;
                      setNewParty({ ...newParty, memberNames: updated });
                    }}
                    placeholder={i === 0 ? (language === "th" ? "คุณ (คนจ่าย)" : "You (payer)") : (language === "th" ? "ชื่อเพื่อน" : "Friend's name")}
                    className="flex-1 h-10 px-4 rounded-xl border border-input bg-background text-foreground"
                  />
                  {newParty.memberNames.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(i)}
                      className="h-10 w-10 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={handleAddMember}
              className="mt-3 w-full rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" />
              {language === "th" ? "เพิ่มสมาชิก" : "Add Member"}
            </Button>
          </div>

          {/* Preview */}
          {newParty.totalAmount && newParty.memberNames.filter(n => n).length >= 2 && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">
                {language === "th" ? "ค่าหัวคนละ" : "Per person"}
              </p>
              <p className="text-2xl font-bold text-primary">
                ฿{Math.round(Number(newParty.totalAmount) / newParty.memberNames.filter(n => n).length).toLocaleString()}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsCreating(false)} className="flex-1 rounded-xl">
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </Button>
            <Button onClick={handleCreateParty} className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl">
              {language === "th" ? "สร้างปาร์ตี้" : "Create Party"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Parties List */}
      <Card className={cn(fadeInUp)} style={{ animationDelay: "200ms" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {language === "th" ? "รายการปาร์ตี้" : "Your Parties"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {parties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">
                {language === "th" ? "ยังไม่มีปาร์ตี้" : "No parties yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "th" ? "สร้างปาร์ตี้แรกเพื่อเริ่มหารค่าใช้จ่าย" : "Create your first party to start splitting"}
              </p>
              <Button
                onClick={() => setIsCreating(true)}
                className="mt-4 bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                {language === "th" ? "สร้างปาร์ตี้แรก" : "Create First Party"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {parties.map(party => {
                const perPerson = party.totalAmount / party.members.length;
                return (
                  <div
                    key={party.id}
                    className={cn(
                      "p-4 rounded-xl border transition-all",
                      party.isSettled ? "bg-muted/30 border-border" : "border-primary/20 bg-primary/5"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{party.name}</h3>
                          {party.isSettled && (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                              {language === "th" ? "ปิดบิลแล้ว" : "Settled"}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {party.members.length} {language === "th" ? "คน" : "members"} · {
                            new Date(party.createdAt).toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
                              day: "numeric",
                              month: "short",
                            })
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyShareLink(party)}
                          className="h-8 w-8"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!party.isSettled && (
                              <DropdownMenuItem onClick={() => handleSettleParty(party.id)}>
                                <Check className="w-4 h-4 mr-2" />
                                {language === "th" ? "ปิดบิล" : "Settle"}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDeleteParty(party.id)} className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              {language === "th" ? "ลบ" : "Delete"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground">{language === "th" ? "ยอดรวม" : "Total"}</p>
                        <p className="text-xl font-bold text-foreground">฿{party.totalAmount.toLocaleString()}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{language === "th" ? "คนละ" : "Per person"}</p>
                        <p className="text-xl font-bold text-primary">฿{Math.round(perPerson).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Members */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                      {party.members.map(m => (
                        <div
                          key={m.id}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm"
                        >
                          <User className="w-3 h-3" />
                          <span>{m.name}</span>
                        </div>
                      ))}
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
