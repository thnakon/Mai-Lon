"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "th" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Settings Page
    "settings.title": "Settings",
    "settings.subtitle": "Manage account and app preferences.",
    
    // Name
    "settings.profilePicture": "Profile Picture",
    "settings.profilePicture.description": "Upload a new profile picture to personalize your account.",
    "settings.changePhoto": "Change Photo",
    "settings.name": "Name",
    "settings.name.description": "Please enter your full name or a display name you are comfortable with.",
    "settings.name.placeholder": "Your name",
    "settings.name.max": "Max 32 characters",
    "settings.saveChanges": "Save Changes",
    
    // Currency
    "settings.currency": "Base Currency",
    "settings.currency.description": "Select the currency for displaying prices.",
    "settings.currency.note": "Your data will be displayed in {currency}. You can still add items in other currencies.",
    
    // Timezone
    "settings.timezone": "Timezone",
    "settings.timezone.description": "Set your local timezone for accurate notification timing and date displays.",
    "settings.timezone.note": "All scheduled notifications and deadline dates will use this timezone.",
    
    // Budget
    "settings.budget": "Monthly Budget",
    "settings.budget.description": "Set your monthly spending limit.",
    "settings.budget.save": "Save Budget",
    "settings.budget.total": "Category budgets total:",
    "settings.budget.edit": "Edit category budgets",
    
    // Security
    "settings.security": "Security",
    "settings.security.description": "Manage your password and authentication methods",
    "settings.configure": "Configure",
    
    // Notifications
    "settings.notifications": "Notification Preferences",
    "settings.notifications.description": "Configure when and how you receive alerts about your tasks",
    
    // Push Notifications
    "settings.push": "Push Notification Devices",
    "settings.push.description": "Enable push notifications to receive instant alerts",
    "settings.manage": "Manage",
    
    // Export
    "settings.export": "Export Your Data",
    "settings.export.description": "Download all your data including tasks, notes, and preferences",
    "settings.export.button": "Export Data",
    "settings.export.format": "Export Format",
    "settings.export.json": "JSON (Complete data with all relationships)",
    "settings.export.csv": "CSV (Data only, spreadsheet compatible)",
    
    // Reduce Motion
    "settings.reduceMotion": "Reduce Motion",
    "settings.reduceMotion.description": "Minimize animations and transitions for accessibility or to reduce distractions",
    
    // Clear Cache
    "settings.clearCache": "Clear Cache",
    "settings.clearCache.description": "Clear cached data from your device to free up space or fix loading issues",
    "settings.clearCache.items": "Cached items: 12 across 2 cache(s)",
    "settings.pwaActive": "PWA Active",
    
    // Delete Account
    "settings.deleteAccount": "Delete Account",
    "settings.deleteAccount.description": "Permanently delete your account and all associated data.",
    "settings.deleteAccount.confirm": "Are you absolutely sure?",
    "settings.deleteAccount.warning": "This action cannot be undone. This will permanently delete your account and all associated data.",
    "settings.deleteAccount.modalWarning": "Warning:",
    "settings.deleteAccount.modalText": "This will permanently delete your account and all your data!",
    "settings.deleteAccount.verify": "To verify, type",
    "settings.deleteAccount.verifyText": "confirm delete account",
    "settings.deleteAccount.below": "below",
    "settings.deleteAccount.confirmButton": "Confirm delete account",
    
    // Toasts
    "toast.nameUpdated": "Name updated successfully!",
    "toast.nameUpdatedDesc": "Your display name is now",
    "toast.currencyUpdated": "Currency updated!",
    "toast.currencyUpdatedDesc": "Base currency changed to",
    "toast.timezoneUpdated": "Timezone updated!",
    "toast.timezoneUpdatedDesc": "Your timezone is now",
    "toast.budgetSaved": "Budget saved!",
    "toast.budgetSavedDesc": "Monthly budget set to",
    "toast.reduceMotionEnabled": "Reduce Motion enabled",
    "toast.reduceMotionDisabled": "Reduce Motion disabled",
    "toast.animationsMinimized": "Animations are now minimized",
    "toast.animationsEnabled": "Animations are now enabled",
    "toast.cacheCleared": "Cache cleared!",
    "toast.cacheClearedDesc": "All cached data has been removed",
    "toast.accountDeleted": "Account deleted",
    "toast.accountDeletedDesc": "Your account has been permanently deleted",
    "toast.dataExported": "Data exported!",
    "toast.dataExportedDesc": "Your data has been exported as",
    "toast.profileUpdated": "Profile picture updated!",
    "toast.profileUpdatedDesc": "Your profile picture has been changed successfully",
    "toast.comingSoon": "Coming soon!",
    "toast.securityComingSoon": "Security settings will be available in a future update",
    "toast.notificationsComingSoon": "Notification preferences will be available in a future update",
    "toast.devicesComingSoon": "Device management will be available in a future update",
    "toast.confirmError": "Please type the confirmation text correctly",
    
    // Dashboard
    "dashboard.welcome": "Welcome back,",
    "dashboard.subtitle": "Here's your study overview and quick insights",
    "dashboard.addTask": "Add Task",
    "dashboard.activeTasks": "Active Tasks",
    "dashboard.thisWeek": "this week",
    "dashboard.studyHours": "Study Hours",
    "dashboard.hrsThisWeek": "hrs this week",
    "dashboard.lectureNotes": "Lecture Notes",
    "dashboard.aiSummaries": "AI summaries ready",
    "dashboard.nextDeadline": "Next Deadline",
    "dashboard.monthlyBudget": "Monthly Budget",
    "dashboard.trackBudget": "Track your spending against your budget",
    "dashboard.budget": "Budget:",
    "dashboard.of": "of",
    "dashboard.vsLastMonth": "vs. Last month",
    "dashboard.daysRemaining": "Days remaining",
    "dashboard.days": "days",
    "dashboard.monthlyProjection": "Monthly projection",
    "dashboard.budgetTip": "Great job! You're well within your budget.",
    "dashboard.upcomingDeadlines": "Upcoming Deadlines",
    "dashboard.next7Days": "Next 7 days",
    "dashboard.viewAll": "View All",
    "dashboard.noDeadlines": "No deadlines in the next 7 days 🎉",
    "dashboard.activeSubscriptions": "Active Subscriptions",
    "dashboard.yourSubscriptions": "Your active subscription services",
    "dashboard.maiLonFree": "Mai Lon Free",
    "dashboard.basicFeatures": "Basic features included",
    "dashboard.academic": "Academic",
    "dashboard.academicSub": "เรียนไม่หลอน",
    "dashboard.teamwork": "Teamwork",
    "dashboard.teamworkSub": "งานกลุ่มไม่หลอน",
    "dashboard.wallet": "Wallet",
    "dashboard.walletSub": "การเงินไม่หลอน",
    "dashboard.schedule": "Schedule",
    "dashboard.scheduleSub": "ตารางไม่หลอน",
  },
  th: {
    // Settings Page
    "settings.title": "ตั้งค่า",
    "settings.subtitle": "จัดการบัญชีและการตั้งค่าแอป",
    
    // Name
    "settings.profilePicture": "รูปโปรไฟล์",
    "settings.profilePicture.description": "อัปโหลดรูปโปรไฟล์ใหม่เพื่อปรับแต่งบัญชีของคุณ",
    "settings.changePhoto": "เปลี่ยนรูป",
    "settings.name": "ชื่อ",
    "settings.name.description": "กรุณากรอกชื่อเต็มหรือชื่อเล่นที่คุณต้องการใช้",
    "settings.name.placeholder": "ชื่อของคุณ",
    "settings.name.max": "สูงสุด 32 ตัวอักษร",
    "settings.saveChanges": "บันทึก",
    
    // Currency
    "settings.currency": "สกุลเงินหลัก",
    "settings.currency.description": "เลือกสกุลเงินสำหรับแสดงราคา",
    "settings.currency.note": "ข้อมูลจะแสดงเป็น {currency} คุณยังสามารถเพิ่มรายการในสกุลเงินอื่นได้",
    
    // Timezone
    "settings.timezone": "เขตเวลา",
    "settings.timezone.description": "ตั้งเขตเวลาท้องถิ่นเพื่อแสดงเวลาแจ้งเตือนและวันที่ที่ถูกต้อง",
    "settings.timezone.note": "การแจ้งเตือนและวันกำหนดส่งทั้งหมดจะใช้เขตเวลานี้",
    
    // Budget
    "settings.budget": "งบประมาณรายเดือน",
    "settings.budget.description": "กำหนดวงเงินใช้จ่ายรายเดือน",
    "settings.budget.save": "บันทึกงบ",
    "settings.budget.total": "รวมงบหมวดหมู่:",
    "settings.budget.edit": "แก้ไขงบหมวดหมู่",
    
    // Security
    "settings.security": "ความปลอดภัย",
    "settings.security.description": "จัดการรหัสผ่านและวิธีการยืนยันตัวตน",
    "settings.configure": "ตั้งค่า",
    
    // Notifications
    "settings.notifications": "การตั้งค่าการแจ้งเตือน",
    "settings.notifications.description": "กำหนดเวลาและวิธีการรับแจ้งเตือนเกี่ยวกับงานของคุณ",
    
    // Push Notifications
    "settings.push": "อุปกรณ์รับการแจ้งเตือน",
    "settings.push.description": "เปิดใช้การแจ้งเตือนแบบ Push เพื่อรับการแจ้งเตือนทันที",
    "settings.manage": "จัดการ",
    
    // Export
    "settings.export": "ส่งออกข้อมูล",
    "settings.export.description": "ดาวน์โหลดข้อมูลทั้งหมดรวมถึงงาน, โน้ต, และการตั้งค่า",
    "settings.export.button": "ส่งออก",
    "settings.export.format": "รูปแบบการส่งออก",
    "settings.export.json": "JSON (ข้อมูลครบถ้วนพร้อมความสัมพันธ์)",
    "settings.export.csv": "CSV (ข้อมูลอย่างเดียว, ใช้กับ spreadsheet ได้)",
    
    // Reduce Motion
    "settings.reduceMotion": "ลดการเคลื่อนไหว",
    "settings.reduceMotion.description": "ลดแอนิเมชันและทรานซิชันเพื่อการเข้าถึงที่ดีขึ้นหรือลดสิ่งรบกวน",
    
    // Clear Cache
    "settings.clearCache": "ล้างแคช",
    "settings.clearCache.description": "ล้างข้อมูลแคชเพื่อเพิ่มพื้นที่หรือแก้ปัญหาการโหลด",
    "settings.clearCache.items": "รายการแคช: 12 จาก 2 แคช",
    "settings.pwaActive": "PWA ทำงาน",
    
    // Delete Account
    "settings.deleteAccount": "ลบบัญชี",
    "settings.deleteAccount.description": "ลบบัญชีและข้อมูลทั้งหมดอย่างถาวร",
    "settings.deleteAccount.confirm": "คุณแน่ใจหรือไม่?",
    "settings.deleteAccount.warning": "การกระทำนี้ไม่สามารถยกเลิกได้ บัญชีและข้อมูลทั้งหมดจะถูกลบอย่างถาวร",
    "settings.deleteAccount.modalWarning": "คำเตือน:",
    "settings.deleteAccount.modalText": "บัญชีและข้อมูลทั้งหมดของคุณจะถูกลบอย่างถาวร!",
    "settings.deleteAccount.verify": "เพื่อยืนยัน พิมพ์",
    "settings.deleteAccount.verifyText": "confirm delete account",
    "settings.deleteAccount.below": "ด้านล่าง",
    "settings.deleteAccount.confirmButton": "ยืนยันการลบบัญชี",
    
    // Toasts
    "toast.nameUpdated": "อัปเดตชื่อเรียบร้อย!",
    "toast.nameUpdatedDesc": "ชื่อที่แสดงของคุณคือ",
    "toast.currencyUpdated": "อัปเดตสกุลเงินแล้ว!",
    "toast.currencyUpdatedDesc": "เปลี่ยนสกุลเงินหลักเป็น",
    "toast.timezoneUpdated": "อัปเดตเขตเวลาแล้ว!",
    "toast.timezoneUpdatedDesc": "เขตเวลาของคุณคือ",
    "toast.budgetSaved": "บันทึกงบแล้ว!",
    "toast.budgetSavedDesc": "งบรายเดือนตั้งไว้ที่",
    "toast.reduceMotionEnabled": "เปิดใช้ลดการเคลื่อนไหว",
    "toast.reduceMotionDisabled": "ปิดใช้ลดการเคลื่อนไหว",
    "toast.animationsMinimized": "แอนิเมชันถูกลดลงแล้ว",
    "toast.animationsEnabled": "เปิดใช้แอนิเมชันแล้ว",
    "toast.cacheCleared": "ล้างแคชแล้ว!",
    "toast.cacheClearedDesc": "ข้อมูลแคชทั้งหมดถูกลบแล้ว",
    "toast.accountDeleted": "ลบบัญชีแล้ว",
    "toast.accountDeletedDesc": "บัญชีของคุณถูกลบอย่างถาวรแล้ว",
    "toast.dataExported": "ส่งออกข้อมูลแล้ว!",
    "toast.dataExportedDesc": "ข้อมูลถูกส่งออกเป็น",
    "toast.profileUpdated": "อัปเดตรูปโปรไฟล์แล้ว!",
    "toast.profileUpdatedDesc": "เปลี่ยนรูปโปรไฟล์ของคุณเรียบร้อยแล้ว",
    "toast.comingSoon": "เร็วๆ นี้!",
    "toast.securityComingSoon": "การตั้งค่าความปลอดภัยจะมีในอัปเดตถัดไป",
    "toast.notificationsComingSoon": "การตั้งค่าการแจ้งเตือนจะมีในอัปเดตถัดไป",
    "toast.devicesComingSoon": "การจัดการอุปกรณ์จะมีในอัปเดตถัดไป",
    "toast.confirmError": "กรุณาพิมพ์ข้อความยืนยันให้ถูกต้อง",
    
    // Dashboard
    "dashboard.welcome": "ยินดีต้อนรับ,",
    "dashboard.subtitle": "ภาพรวมการเรียนและข้อมูลเชิงลึก",
    "dashboard.addTask": "เพิ่มงาน",
    "dashboard.activeTasks": "งานที่กำลังทำ",
    "dashboard.thisWeek": "สัปดาห์นี้",
    "dashboard.studyHours": "ชั่วโมงเรียน",
    "dashboard.hrsThisWeek": "ชม. สัปดาห์นี้",
    "dashboard.lectureNotes": "โน้ตบรรยาย",
    "dashboard.aiSummaries": "สรุป AI พร้อม",
    "dashboard.nextDeadline": "กำหนดส่งถัดไป",
    "dashboard.monthlyBudget": "งบรายเดือน",
    "dashboard.trackBudget": "ติดตามการใช้จ่ายเทียบกับงบ",
    "dashboard.budget": "งบ:",
    "dashboard.of": "จาก",
    "dashboard.vsLastMonth": "เทียบเดือนก่อน",
    "dashboard.daysRemaining": "วันที่เหลือ",
    "dashboard.days": "วัน",
    "dashboard.monthlyProjection": "คาดการณ์รายเดือน",
    "dashboard.budgetTip": "ยอดเยี่ยม! คุณใช้จ่ายอยู่ในงบ",
    "dashboard.upcomingDeadlines": "กำหนดส่งที่จะถึง",
    "dashboard.next7Days": "7 วันข้างหน้า",
    "dashboard.viewAll": "ดูทั้งหมด",
    "dashboard.noDeadlines": "ไม่มีกำหนดส่งใน 7 วันข้างหน้า 🎉",
    "dashboard.activeSubscriptions": "การสมัครสมาชิก",
    "dashboard.yourSubscriptions": "บริการสมัครสมาชิกที่ใช้งานอยู่",
    "dashboard.maiLonFree": "Mai Lon Free",
    "dashboard.basicFeatures": "ฟีเจอร์พื้นฐานรวมอยู่",
    "dashboard.academic": "Academic",
    "dashboard.academicSub": "เรียนไม่หลอน",
    "dashboard.teamwork": "Teamwork",
    "dashboard.teamworkSub": "งานกลุ่มไม่หลอน",
    "dashboard.wallet": "Wallet",
    "dashboard.walletSub": "การเงินไม่หลอน",
    "dashboard.schedule": "Schedule",
    "dashboard.scheduleSub": "ตารางไม่หลอน",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("th");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("mailon_language") as Language;
    if (savedLanguage && (savedLanguage === "th" || savedLanguage === "en")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("mailon_language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
