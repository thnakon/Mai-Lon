"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// 10 นาที (600,000 milliseconds)
const IDLE_TIMEOUT = 10 * 60 * 1000;

// หน้าที่ไม่ต้องตรวจสอบ (หน้า auth)
const EXCLUDED_PATHS = ["/", "/login", "/register", "/auth"];

export function IdleTimeoutProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  const handleLogout = useCallback(async () => {
    // ลบ session และ redirect ไปหน้า login
    await supabase.auth.signOut();
    router.push("/login?reason=idle");
    router.refresh();
  }, [router, supabase.auth]);

  const resetTimer = useCallback(() => {
    // เคลียร์ timer เดิม
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // ตั้ง timer ใหม่
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, IDLE_TIMEOUT);
  }, [handleLogout]);

  useEffect(() => {
    // ไม่ทำงานในหน้า auth หรือ landing page
    const isExcluded = EXCLUDED_PATHS.some(
      (path) => pathname === path || pathname.startsWith("/auth")
    );
    
    if (isExcluded) {
      return;
    }

    // Events ที่จะ reset timer
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    // ผูก event listeners
    events.forEach((event) => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    // เริ่ม timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [pathname, resetTimer]);

  return <>{children}</>;
}
