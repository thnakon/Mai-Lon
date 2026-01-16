"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Notification {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  type: "info" | "success" | "warning" | "achievement";
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// Initial welcome notifications
const initialNotifications: Notification[] = [
  {
    id: "welcome",
    title: "ยินดีต้อนรับสู่ Mai Lon!",
    titleEn: "Welcome to Mai Lon!",
    description: "เริ่มจัดการชีวิตนักศึกษาของคุณได้เลยวันนี้",
    descriptionEn: "Start managing your student life today.",
    type: "info",
    read: false,
    createdAt: new Date().toISOString(),
    link: "/dashboard",
  },
  {
    id: "tip",
    title: "💡 เคล็ดลับ",
    titleEn: "💡 Pro Tip",
    description: "ลองใช้ AI Agent ช่วยสรุปบทเรียน หรือตอบคำถามได้เลย!",
    descriptionEn: "Try the AI Agent to summarize lessons or answer questions!",
    type: "info",
    read: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    link: "/ai-agent",
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mailon_notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(initialNotifications);
      localStorage.setItem("mailon_notifications", JSON.stringify(initialNotifications));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mailon_notifications", JSON.stringify(notifications));
    }
  }, [notifications, mounted]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notif: Omit<Notification, "id" | "read" | "createdAt">) => {
    const newNotif: Notification = {
      ...notif,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
