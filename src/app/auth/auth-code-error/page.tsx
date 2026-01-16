import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ข้อผิดพลาดการยืนยัน",
  description: "เกิดข้อผิดพลาดในการยืนยันอีเมลหรือเข้าสู่ระบบ",
};

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background font-sans">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Error Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">ลิงก์หมดอายุแล้ว</h1>
          <p className="text-muted-foreground">
            ลิงก์ยืนยันอีเมลหรือ Magic Link ที่คุณใช้ได้หมดอายุแล้ว
            <br />
            กรุณาขอลิงก์ใหม่หรือลองเข้าสู่ระบบอีกครั้ง
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <Link href="/register">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white h-11 rounded-full font-bold gap-2">
              <RefreshCw className="w-4 h-4" />
              สมัครใหม่อีกครั้ง
            </Button>
          </Link>
          
          <Link href="/login">
            <Button variant="outline" className="w-full h-11 rounded-full font-medium gap-2">
              <ArrowLeft className="w-4 h-4" />
              กลับสู่หน้าเข้าสู่ระบบ
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-xs text-muted-foreground pt-4">
          หากปัญหายังคงเกิดขึ้น กรุณาติดต่อ{" "}
          <Link href="#" className="text-primary underline">
            ฝ่ายสนับสนุน
          </Link>
        </p>
      </div>
    </div>
  );
}
