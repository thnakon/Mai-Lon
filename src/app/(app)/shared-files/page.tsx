"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import { createClient } from "@/lib/supabase/client";
import {
  Upload,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Trash2,
  Download,
  Copy,
  Link2,
  MoreVertical,
  Search,
  FolderOpen,
  CloudUpload,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const fadeInUp = "animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both";

interface SharedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: string;
}

const BUCKET_NAME = "shared-files";

// Get file icon based on type
function getFileIcon(type: string) {
  if (type.startsWith("image/")) return FileImage;
  if (type.startsWith("video/")) return FileVideo;
  if (type.startsWith("audio/")) return FileAudio;
  if (type.includes("pdf") || type.includes("document") || type.includes("text")) return FileText;
  return File;
}

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function SharedFilesPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Load files
  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(user.id, {
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      const filesWithUrls = await Promise.all(
        (data || []).map(async (file) => {
          const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(`${user.id}/${file.name}`);

          return {
            id: file.id,
            name: file.name,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || "application/octet-stream",
            url: urlData.publicUrl,
            createdAt: file.created_at,
          };
        })
      );

      setFiles(filesWithUrls);
    } catch (error: any) {
      console.error("Error loading files:", error);
      toast.error(language === "th" ? "ไม่สามารถโหลดไฟล์ได้" : "Failed to load files");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setMounted(true);
    loadFiles();
  }, []);

  // Handle file upload
  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error(language === "th" ? "กรุณาเข้าสู่ระบบ" : "Please login first");
        return;
      }

      for (const file of Array.from(fileList)) {
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `${user.id}/${fileName}`;

        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) throw error;
      }

      toast.success(
        language === "th" 
          ? `อัปโหลด ${fileList.length} ไฟล์สำเร็จ!` 
          : `${fileList.length} file(s) uploaded!`
      );
      loadFiles();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(language === "th" ? "อัปโหลดไม่สำเร็จ" : "Upload failed");
    }
    setIsUploading(false);
  };

  // Handle file delete
  const handleDelete = async (file: SharedFile) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([`${user.id}/${file.name}`]);

      if (error) throw error;

      setFiles(files.filter(f => f.id !== file.id));
      toast.success(language === "th" ? "ลบไฟล์แล้ว" : "File deleted");
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(language === "th" ? "ลบไม่สำเร็จ" : "Delete failed");
    }
  };

  // Copy link
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success(language === "th" ? "คัดลอกลิงก์แล้ว!" : "Link copied!");
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  // Filter files
  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={cn("flex items-start justify-between", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {language === "th" ? "ไฟล์ที่แชร์" : "Shared Files"}
          </h1>
          <p className="text-muted-foreground">
            {language === "th" ? "อัปโหลดและแชร์ไฟล์กับทีม" : "Upload and share files with your team"}
          </p>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {language === "th" ? "อัปโหลด" : "Upload"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* Stats */}
      <div className={cn("grid grid-cols-2 gap-4", fadeInUp)} style={{ animationDelay: "100ms" }}>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "ไฟล์ทั้งหมด" : "Total Files"}</p>
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{files.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{language === "th" ? "ขนาดรวม" : "Total Size"}</p>
              <CloudUpload className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{formatFileSize(totalSize)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 text-center transition-all",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
          fadeInUp
        )}
        style={{ animationDelay: "150ms" }}
      >
        <CloudUpload className={cn(
          "w-12 h-12 mx-auto mb-4 transition-colors",
          dragActive ? "text-primary" : "text-muted-foreground"
        )} />
        <p className="font-medium text-foreground">
          {dragActive
            ? (language === "th" ? "วางไฟล์ที่นี่!" : "Drop files here!")
            : (language === "th" ? "ลากไฟล์มาวางที่นี่" : "Drag and drop files here")}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {language === "th" ? "หรือ" : "or"}{" "}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-primary hover:underline"
          >
            {language === "th" ? "เลือกไฟล์" : "browse files"}
          </button>
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === "th" ? "ค้นหาไฟล์..." : "Search files..."}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-foreground"
        />
      </div>

      {/* Files List */}
      <Card className={cn(fadeInUp)} style={{ animationDelay: "200ms" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {language === "th" ? "ไฟล์ของฉัน" : "My Files"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground">
                {language === "th" ? "ยังไม่มีไฟล์" : "No files yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {language === "th" ? "อัปโหลดไฟล์เพื่อเริ่มแชร์" : "Upload files to start sharing"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.type);
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} · {new Date(file.createdAt).toLocaleDateString(
                          language === "th" ? "th-TH" : "en-US"
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyLink(file.url)}
                        className="h-8 w-8"
                        title={language === "th" ? "คัดลอกลิงก์" : "Copy link"}
                      >
                        <Link2 className="w-4 h-4" />
                      </Button>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted"
                        title={language === "th" ? "ดาวน์โหลด" : "Download"}
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCopyLink(file.url)}>
                            <Copy className="w-4 h-4 mr-2" />
                            {language === "th" ? "คัดลอกลิงก์" : "Copy Link"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(file)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            {language === "th" ? "ลบ" : "Delete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
