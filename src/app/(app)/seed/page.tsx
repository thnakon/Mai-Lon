"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Database, Trash2, CheckCircle, Loader2 } from "lucide-react";

// Helper to generate dates
const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
const daysFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

// ============================================
// WALLET EXPENSES (4 months of tech expenses)
// ============================================
const walletExpenses = [
  // Recent (this month - January 2026)
  { id: "w1", amount: 590, category: "subscriptions", description: "Netflix Premium", date: daysAgo(2) },
  { id: "w2", amount: 299, category: "subscriptions", description: "Spotify Family", date: daysAgo(5) },
  { id: "w3", amount: 1290, category: "education", description: "Udemy - React Masterclass", date: daysAgo(8) },
  { id: "w4", amount: 85, category: "food", description: "Starbucks - Study Session", date: daysAgo(10) },
  { id: "w5", amount: 450, category: "transportation", description: "Grab to Campus", date: daysAgo(12) },
  { id: "w6", amount: 2500, category: "education", description: "CS Books - Clean Code, Design Patterns", date: daysAgo(15) },
  { id: "w7", amount: 159, category: "subscriptions", description: "iCloud 200GB", date: daysAgo(18) },
  
  // Last month (December 2025)
  { id: "w8", amount: 3990, category: "shopping", description: "Mechanical Keyboard - Keychron K2", date: daysAgo(35) },
  { id: "w9", amount: 590, category: "subscriptions", description: "Netflix Premium", date: daysAgo(32) },
  { id: "w10", amount: 299, category: "subscriptions", description: "Spotify Family", date: daysAgo(35) },
  { id: "w11", amount: 890, category: "education", description: "Coursera - Machine Learning", date: daysAgo(38) },
  { id: "w12", amount: 1200, category: "food", description: "Christmas Party with Friends", date: daysAgo(22) },
  { id: "w13", amount: 350, category: "entertainment", description: "Steam Winter Sale Games", date: daysAgo(25) },
  { id: "w14", amount: 159, category: "subscriptions", description: "GitHub Copilot", date: daysAgo(40) },
  
  // 2 months ago (November 2025)
  { id: "w15", amount: 590, category: "subscriptions", description: "Netflix Premium", date: daysAgo(62) },
  { id: "w16", amount: 4500, category: "shopping", description: "Monitor - Dell 27\" 4K", date: daysAgo(65) },
  { id: "w17", amount: 1990, category: "education", description: "AWS Certification Prep Course", date: daysAgo(70) },
  { id: "w18", amount: 299, category: "subscriptions", description: "Spotify Family", date: daysAgo(65) },
  { id: "w19", amount: 250, category: "transportation", description: "BTS Monthly Pass", date: daysAgo(75) },
  { id: "w20", amount: 159, category: "subscriptions", description: "Notion Plus", date: daysAgo(68) },
  
  // 3 months ago (October 2025)
  { id: "w21", amount: 590, category: "subscriptions", description: "Netflix Premium", date: daysAgo(92) },
  { id: "w22", amount: 8900, category: "shopping", description: "AirPods Pro 2", date: daysAgo(95) },
  { id: "w23", amount: 299, category: "subscriptions", description: "Spotify Family", date: daysAgo(95) },
  { id: "w24", amount: 1500, category: "education", description: "Docker & Kubernetes Course", date: daysAgo(100) },
  { id: "w25", amount: 450, category: "food", description: "Team Lunch - Hackathon", date: daysAgo(105) },
  
  // 4 months ago (September 2025)
  { id: "w26", amount: 590, category: "subscriptions", description: "Netflix Premium", date: daysAgo(122) },
  { id: "w27", amount: 299, category: "subscriptions", description: "Spotify Family", date: daysAgo(125) },
  { id: "w28", amount: 2990, category: "education", description: "Figma Course - UI/UX Design", date: daysAgo(130) },
  { id: "w29", amount: 890, category: "shopping", description: "USB-C Hub + Cables", date: daysAgo(135) },
];

// ============================================
// SUBSCRIPTIONS (tech services)
// ============================================
const subscriptions = [
  { id: "s1", name: "Netflix Premium", price: 590, billingCycle: "monthly", category: "entertainment", startDate: daysAgo(365), nextBilling: daysFromNow(12), status: "active" },
  { id: "s2", name: "Spotify Family", price: 299, billingCycle: "monthly", category: "entertainment", startDate: daysAgo(300), nextBilling: daysFromNow(8), status: "active" },
  { id: "s3", name: "GitHub Copilot", price: 159, billingCycle: "monthly", category: "productivity", startDate: daysAgo(180), nextBilling: daysFromNow(15), status: "active" },
  { id: "s4", name: "iCloud 200GB", price: 99, billingCycle: "monthly", category: "storage", startDate: daysAgo(400), nextBilling: daysFromNow(5), status: "active" },
  { id: "s5", name: "Notion Plus", price: 159, billingCycle: "monthly", category: "productivity", startDate: daysAgo(120), nextBilling: daysFromNow(18), status: "active" },
  { id: "s6", name: "ChatGPT Plus", price: 690, billingCycle: "monthly", category: "ai", startDate: daysAgo(90), nextBilling: daysFromNow(3), status: "active" },
  { id: "s7", name: "Figma Professional", price: 450, billingCycle: "monthly", category: "design", startDate: daysAgo(60), nextBilling: daysFromNow(22), status: "active" },
];

// ============================================
// SCHEDULE (CS/Tech classes)
// ============================================
const scheduleClasses = [
  { id: "c1", name: "Data Structures & Algorithms", code: "CS201", day: 1, startTime: "09:00", endTime: "12:00", room: "ENG-401", instructor: "Dr. Somchai", color: 0 },
  { id: "c2", name: "Database Systems", code: "CS301", day: 2, startTime: "13:00", endTime: "16:00", room: "ENG-302", instructor: "Dr. Pranee", color: 1 },
  { id: "c3", name: "Web Development", code: "CS321", day: 3, startTime: "09:00", endTime: "12:00", room: "LAB-201", instructor: "Aj. Nattapong", color: 2 },
  { id: "c4", name: "Machine Learning", code: "CS401", day: 4, startTime: "13:00", endTime: "16:00", room: "ENG-501", instructor: "Dr. Kittisak", color: 3 },
  { id: "c5", name: "Software Engineering", code: "CS311", day: 5, startTime: "09:00", endTime: "12:00", room: "ENG-401", instructor: "Dr. Apinya", color: 4 },
  { id: "c6", name: "Computer Networks", code: "CS341", day: 1, startTime: "13:00", endTime: "16:00", room: "LAB-301", instructor: "Aj. Surasak", color: 5 },
  { id: "c7", name: "Cloud Computing", code: "CS421", day: 3, startTime: "13:00", endTime: "16:00", room: "LAB-401", instructor: "Dr. Wichai", color: 6 },
];

// Exams (upcoming 6 months)
const scheduleExams = [
  { id: "e1", name: "Midterm - Data Structures", date: daysFromNow(14), time: "09:00", room: "EXAM-101" },
  { id: "e2", name: "Midterm - Database Systems", date: daysFromNow(16), time: "13:00", room: "EXAM-102" },
  { id: "e3", name: "Midterm - Machine Learning", date: daysFromNow(18), time: "09:00", room: "EXAM-103" },
  { id: "e4", name: "Final - Data Structures", date: daysFromNow(90), time: "09:00", room: "EXAM-201" },
  { id: "e5", name: "Final - Database Systems", date: daysFromNow(92), time: "13:00", room: "EXAM-202" },
  { id: "e6", name: "Final - Web Development", date: daysFromNow(94), time: "09:00", room: "EXAM-203" },
  { id: "e7", name: "Final - Machine Learning", date: daysFromNow(96), time: "13:00", room: "EXAM-204" },
  { id: "e8", name: "Final - Software Engineering", date: daysFromNow(98), time: "09:00", room: "EXAM-205" },
];

// ============================================
// LECTURE NOTES (tech lectures with summaries)
// ============================================
const lectureNotes = [
  {
    id: "n1", title: "Big-O Notation & Time Complexity", subject: "CS201", duration: "45:23", audioName: "dsa_week1.mp3",
    transcript: "วันนี้เราจะเรียนเรื่อง Big-O Notation ซึ่งเป็นวิธีวัดประสิทธิภาพของ algorithm...",
    summary: "Big-O Notation ใช้วัด Time Complexity ของ algorithm โดย O(1) = constant, O(n) = linear, O(n²) = quadratic, O(log n) = logarithmic",
    keyPoints: ["O(1) - ไม่ขึ้นกับ input size", "O(n) - เพิ่มตาม input", "O(log n) - Binary Search", "O(n²) - Nested loops"],
    createdAt: daysAgo(100), status: "completed"
  },
  {
    id: "n2", title: "SQL Joins & Subqueries", subject: "CS301", duration: "52:10", audioName: "db_week3.mp3",
    transcript: "JOIN เป็นคำสั่งที่ใช้รวมข้อมูลจากหลาย table...",
    summary: "SQL JOIN มี 4 แบบหลัก: INNER JOIN (เฉพาะที่ match), LEFT JOIN (ซ้ายทั้งหมด), RIGHT JOIN (ขวาทั้งหมด), FULL JOIN (ทั้งหมด) Subquery คือ query ซ้อน query",
    keyPoints: ["INNER JOIN - เฉพาะ rows ที่ match", "LEFT JOIN - Table ซ้ายทั้งหมด", "Subquery ใช้ใน WHERE/FROM", "Correlated subquery อ้างถึง outer query"],
    createdAt: daysAgo(85), status: "completed"
  },
  {
    id: "n3", title: "React Hooks Deep Dive", subject: "CS321", duration: "68:45", audioName: "web_week5.mp3",
    transcript: "React Hooks เปลี่ยนวิธีเขียน components จาก class เป็น function...",
    summary: "Hooks ให้ function components มี state และ lifecycle ได้ useState สำหรับ state, useEffect สำหรับ side effects, useContext สำหรับ global state",
    keyPoints: ["useState - จัดการ local state", "useEffect - side effects & cleanup", "useCallback/useMemo - optimization", "Custom hooks - reuse logic"],
    createdAt: daysAgo(60), status: "completed"
  },
  {
    id: "n4", title: "Neural Networks Fundamentals", subject: "CS401", duration: "75:30", audioName: "ml_week4.mp3",
    transcript: "Neural network ประกอบด้วย layers: input, hidden, output...",
    summary: "Neural Network มี 3 layers หลัก เรียนรู้ผ่าน forward propagation และ backpropagation Activation function เช่น ReLU, Sigmoid ทำให้เรียนรู้ non-linear patterns ได้",
    keyPoints: ["Neurons รับ input คูณ weights", "Activation functions: ReLU, Sigmoid", "Loss function วัด error", "Gradient descent ปรับ weights"],
    createdAt: daysAgo(45), status: "completed"
  },
  {
    id: "n5", title: "Agile & Scrum Methodology", subject: "CS311", duration: "55:20", audioName: "se_week2.mp3",
    transcript: "Agile เป็น mindset ที่เน้น iteration และการปรับตัว Scrum เป็น framework หนึ่งของ Agile...",
    summary: "Scrum แบ่งงานเป็น Sprint (2-4 สัปดาห์) มี Daily Standup, Sprint Planning, Review, Retrospective Roles: Product Owner, Scrum Master, Dev Team",
    keyPoints: ["Sprint = iteration 2-4 weeks", "Daily Standup 15 นาที", "Product Backlog -> Sprint Backlog", "Velocity วัดความเร็วทีม"],
    createdAt: daysAgo(30), status: "completed"
  },
  {
    id: "n6", title: "Docker & Containerization", subject: "CS421", duration: "62:15", audioName: "cloud_week3.mp3",
    transcript: "Container คือ lightweight virtualization ที่ share OS kernel...",
    summary: "Docker ทำให้ deploy app เหมือนกันทุก environment Dockerfile กำหนดวิธี build image Docker Compose จัดการ multi-container app",
    keyPoints: ["Image = template, Container = running instance", "Dockerfile: FROM, RUN, COPY, CMD", "docker-compose.yml สำหรับ multi-service", "Volumes สำหรับ persistent data"],
    createdAt: daysAgo(15), status: "completed"
  },
];

// ============================================
// CITATIONS (tech papers/books)
// ============================================
const citations = [
  { id: "cite1", type: "book", authors: "Martin, R. C.", title: "Clean Code: A Handbook of Agile Software Craftsmanship", year: "2008", publisher: "Prentice Hall", createdAt: daysAgo(100) },
  { id: "cite2", type: "book", authors: "Gamma, E., Helm, R., Johnson, R., & Vlissides, J.", title: "Design Patterns: Elements of Reusable Object-Oriented Software", year: "1994", publisher: "Addison-Wesley", createdAt: daysAgo(95) },
  { id: "cite3", type: "journal", authors: "Vaswani, A., et al.", title: "Attention Is All You Need", year: "2017", journal: "NeurIPS", volume: "30", pages: "5998-6008", createdAt: daysAgo(80) },
  { id: "cite4", type: "website", authors: "React Team", title: "React Documentation - Hooks", year: "2024", url: "https://react.dev/reference/react", accessDate: daysAgo(60), createdAt: daysAgo(60) },
  { id: "cite5", type: "book", authors: "Fowler, M.", title: "Refactoring: Improving the Design of Existing Code", year: "2018", publisher: "Addison-Wesley", createdAt: daysAgo(50) },
  { id: "cite6", type: "journal", authors: "LeCun, Y., Bengio, Y., & Hinton, G.", title: "Deep Learning", year: "2015", journal: "Nature", volume: "521", pages: "436-444", createdAt: daysAgo(40) },
  { id: "cite7", type: "thesis", authors: "Thanakon, D.", title: "Real-time Collaboration in Web Applications using WebSocket", year: "2026", university: "Chulalongkorn University", createdAt: daysAgo(20) },
];

// ============================================
// PROJECTS (Kanban with tasks)
// ============================================
const projects = [
  { id: "p1", name: "Mai Lon App Development", color: "bg-blue-500", createdAt: daysAgo(120) },
  { id: "p2", name: "CS401 ML Final Project", color: "bg-purple-500", createdAt: daysAgo(45) },
  { id: "p3", name: "Startup Weekend Hackathon", color: "bg-green-500", createdAt: daysAgo(30) },
];

const tasks = [
  // Mai Lon Project
  { id: "t1", title: "Design System Setup", description: "Create color palette and typography", status: "done", priority: "high", projectId: "p1", createdAt: daysAgo(115) },
  { id: "t2", title: "Authentication Flow", description: "Implement login/signup with Supabase", status: "done", priority: "high", projectId: "p1", createdAt: daysAgo(110) },
  { id: "t3", title: "Dashboard UI", description: "Build main dashboard components", status: "done", priority: "high", projectId: "p1", createdAt: daysAgo(100) },
  { id: "t4", title: "Wallet Feature", description: "Expense tracking and budget", status: "done", priority: "medium", projectId: "p1", createdAt: daysAgo(90) },
  { id: "t5", title: "AI Integration", description: "Connect OpenAI API for summaries", status: "in-progress", priority: "high", projectId: "p1", createdAt: daysAgo(20) },
  { id: "t6", title: "Push Notifications", description: "Implement FCM for reminders", status: "todo", priority: "medium", projectId: "p1", createdAt: daysAgo(10) },
  { id: "t7", title: "Performance Optimization", description: "Code splitting and lazy loading", status: "todo", priority: "low", projectId: "p1", createdAt: daysAgo(5) },
  
  // ML Project
  { id: "t8", title: "Dataset Collection", description: "Gather and clean training data", status: "done", priority: "high", projectId: "p2", createdAt: daysAgo(40) },
  { id: "t9", title: "Model Architecture", description: "Design CNN for image classification", status: "done", priority: "high", projectId: "p2", createdAt: daysAgo(35) },
  { id: "t10", title: "Training Pipeline", description: "Set up PyTorch training loop", status: "in-progress", priority: "high", projectId: "p2", createdAt: daysAgo(25) },
  { id: "t11", title: "Evaluation Metrics", description: "Calculate accuracy, precision, recall", status: "todo", priority: "medium", projectId: "p2", createdAt: daysAgo(15) },
  { id: "t12", title: "Final Report", description: "Write paper and create presentation", status: "todo", priority: "high", projectId: "p2", createdAt: daysAgo(5) },
  
  // Hackathon
  { id: "t13", title: "Ideation", description: "Brainstorm project ideas", status: "done", priority: "high", projectId: "p3", createdAt: daysAgo(28) },
  { id: "t14", title: "MVP Development", description: "Build core features in 48 hours", status: "done", priority: "high", projectId: "p3", createdAt: daysAgo(26) },
  { id: "t15", title: "Pitch Deck", description: "Create slides for demo", status: "done", priority: "high", projectId: "p3", createdAt: daysAgo(25) },
];

// ============================================
// SPLIT PARTY (shared expenses)
// ============================================
const splitParties = [
  {
    id: "sp1", name: "ค่า Netflix หาร 4", totalAmount: 590, members: [
      { name: "Thanakon", paid: true, amount: 147.5 },
      { name: "Beam", paid: true, amount: 147.5 },
      { name: "Golf", paid: false, amount: 147.5 },
      { name: "Mint", paid: true, amount: 147.5 },
    ], createdAt: daysAgo(30)
  },
  {
    id: "sp2", name: "Hackathon Food & Drinks", totalAmount: 2400, members: [
      { name: "Thanakon", paid: true, amount: 600 },
      { name: "Poom", paid: true, amount: 600 },
      { name: "Fern", paid: true, amount: 600 },
      { name: "Top", paid: false, amount: 600 },
    ], createdAt: daysAgo(25)
  },
  {
    id: "sp3", name: "AWS Credits - Team Project", totalAmount: 1500, members: [
      { name: "Thanakon", paid: true, amount: 375 },
      { name: "Beam", paid: true, amount: 375 },
      { name: "Poom", paid: true, amount: 375 },
      { name: "Fern", paid: false, amount: 375 },
    ], createdAt: daysAgo(15)
  },
];

// ============================================
// AI CHAT HISTORY
// ============================================
const aiChatHistory = [
  { id: "ai1", role: "assistant", content: "สวัสดีครับ! 👋 ผมเป็น AI ช่วยเรียนของคุณ ถามได้เลยครับ!", timestamp: daysAgo(90) },
  { id: "ai2", role: "user", content: "อธิบาย Big-O Notation หน่อย", timestamp: daysAgo(90) },
  { id: "ai3", role: "assistant", content: "Big-O Notation ใช้วัดความซับซ้อนของ algorithm ครับ เช่น O(1) คือ constant time ไม่ว่า input จะใหญ่แค่ไหนก็เร็วเท่าเดิม, O(n) คือ linear time เวลาเพิ่มตาม input, O(n²) คือ quadratic time เช่น nested loop", timestamp: daysAgo(90) },
  { id: "ai4", role: "user", content: "React Hooks useState กับ useEffect ต่างกันยังไง", timestamp: daysAgo(60) },
  { id: "ai5", role: "assistant", content: "useState ใช้เก็บ state ใน function component เช่น const [count, setCount] = useState(0) ส่วน useEffect ใช้จัดการ side effects เช่น API calls, subscriptions โดยจะ run หลัง render", timestamp: daysAgo(60) },
  { id: "ai6", role: "user", content: "SQL INNER JOIN กับ LEFT JOIN ต่างกันยังไง", timestamp: daysAgo(45) },
  { id: "ai7", role: "assistant", content: "INNER JOIN จะ return เฉพาะ rows ที่ match ทั้งสอง table ส่วน LEFT JOIN จะ return ทุก rows จาก table ซ้าย และ rows ที่ match จาก table ขวา ถ้าไม่ match จะเป็น NULL", timestamp: daysAgo(45) },
  { id: "ai8", role: "user", content: "อธิบาย Neural Network แบบง่ายๆ", timestamp: daysAgo(30) },
  { id: "ai9", role: "assistant", content: "Neural Network เลียนแบบสมองคนครับ ประกอบด้วย neurons ที่เชื่อมกันเป็น layers: Input -> Hidden -> Output แต่ละ neuron รับ input คูณ weights แล้วผ่าน activation function เช่น ReLU เพื่อเรียนรู้ patterns ที่ซับซ้อน", timestamp: daysAgo(30) },
  { id: "ai10", role: "user", content: "Docker Compose ใช้ยังไง", timestamp: daysAgo(15) },
  { id: "ai11", role: "assistant", content: "Docker Compose ใช้จัดการ multi-container app ครับ สร้างไฟล์ docker-compose.yml กำหนด services แต่ละตัว แล้วใช้ docker-compose up เพื่อ start ทุก service พร้อมกัน เช่น web server + database + cache", timestamp: daysAgo(15) },
];

// ============================================
// NOTIFICATIONS
// ============================================
const notifications = [
  { id: "notif1", title: "🎉 ปลดล็อค: Early Adopter", titleEn: "🎉 Unlocked: Early Adopter", description: "คุณเป็นผู้ใช้รุ่นแรก!", descriptionEn: "You're one of the first users!", type: "achievement", read: true, createdAt: daysAgo(120), link: "/achievements" },
  { id: "notif2", title: "📚 สรุปบทเรียนเสร็จแล้ว", titleEn: "📚 Lecture summary ready", description: "Big-O Notation & Time Complexity พร้อมอ่านแล้ว", descriptionEn: "Big-O Notation & Time Complexity is ready", type: "success", read: true, createdAt: daysAgo(100), link: "/lecture-notes" },
  { id: "notif3", title: "🏆 ปลดล็อค: นักบัญชี", titleEn: "🏆 Unlocked: Budget Tracker", description: "บันทึกค่าใช้จ่ายครั้งแรก!", descriptionEn: "Logged your first expense!", type: "achievement", read: true, createdAt: daysAgo(90), link: "/achievements" },
  { id: "notif4", title: "⏰ เตือน: Midterm DSA ใน 2 สัปดาห์", titleEn: "⏰ Reminder: DSA Midterm in 2 weeks", description: "อย่าลืมทบทวนเนื้อหานะ!", descriptionEn: "Don't forget to review!", type: "warning", read: false, createdAt: daysAgo(2), link: "/schedule" },
  { id: "notif5", title: "💳 เตือน: Netflix ต่ออายุใน 12 วัน", titleEn: "💳 Reminder: Netflix renews in 12 days", description: "฿590/เดือน", descriptionEn: "฿590/month", type: "info", read: false, createdAt: daysAgo(1), link: "/subscriptions" },
];

// ============================================
// USER STATS & ACHIEVEMENTS
// ============================================
const userStats = {
  totalXP: 1350,
  level: 8,
  streak: 45,
  lastActiveDate: new Date().toISOString().split("T")[0],
};

const achievements = [
  { id: "first_note", unlocked: true, unlockedAt: daysAgo(100), progress: 6 },
  { id: "note_master", unlocked: false, progress: 6 },
  { id: "citation_pro", unlocked: true, unlockedAt: daysAgo(40), progress: 7 },
  { id: "schedule_keeper", unlocked: true, unlockedAt: daysAgo(85), progress: 7 },
  { id: "budget_tracker", unlocked: true, unlockedAt: daysAgo(90), progress: 29 },
  { id: "money_master", unlocked: false, progress: 29 },
  { id: "subscription_manager", unlocked: true, unlockedAt: daysAgo(60), progress: 7 },
  { id: "split_master", unlocked: true, unlockedAt: daysAgo(15), progress: 3 },
  { id: "project_starter", unlocked: true, unlockedAt: daysAgo(120), progress: 3 },
  { id: "task_crusher", unlocked: true, unlockedAt: daysAgo(25), progress: 10 },
  { id: "file_sharer", unlocked: false, progress: 0 },
  { id: "ai_friend", unlocked: true, unlockedAt: daysAgo(45), progress: 11 },
  { id: "feedback_giver", unlocked: true, unlockedAt: daysAgo(30), progress: 2 },
  { id: "streak_3", unlocked: true, unlockedAt: daysAgo(117), progress: 45 },
  { id: "streak_7", unlocked: true, unlockedAt: daysAgo(113), progress: 45 },
  { id: "streak_30", unlocked: true, unlockedAt: daysAgo(90), progress: 45 },
  { id: "early_adopter", unlocked: true, unlockedAt: daysAgo(120), progress: 1 },
];

// ============================================
// FEEDBACK
// ============================================
const feedbacks = [
  { id: "fb1", title: "เพิ่ม Dark Mode สำหรับ Calendar", description: "Calendar ควรมี dark mode แยกต่างหาก", type: "feature", status: "completed", author: "Thanakon", authorInitial: "T", comments: 3, votes: 12, createdAt: daysAgo(60) },
  { id: "fb2", title: "Bug: AI Chat ไม่ตอบภาษาไทย", description: "บางครั้ง AI ตอบเป็นภาษาอังกฤษแม้ถามเป็นไทย", type: "bug", status: "completed", author: "Thanakon", authorInitial: "T", comments: 5, votes: 8, createdAt: daysAgo(30) },
];

// ============================================
// ONBOARDING DATA
// ============================================
const onboardingData = {
  displayName: "Thanakon",
  university: "Chulalongkorn University",
  faculty: "Engineering",
  year: "4",
  interests: ["coding", "ai", "startup"],
};

export default function SeedDataPage() {
  const [mounted, setMounted] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeeded = localStorage.getItem("mailon_data_seeded");
    if (hasSeeded) setSeeded(true);
  }, []);

  const handleSeedData = async () => {
    setIsSeeding(true);
    await new Promise(r => setTimeout(r, 1500));

    // Seed all data
    localStorage.setItem("mailon_wallet_expenses", JSON.stringify(walletExpenses));
    localStorage.setItem("mailon_subscriptions", JSON.stringify(subscriptions));
    localStorage.setItem("mailon_schedule", JSON.stringify(scheduleClasses));
    localStorage.setItem("mailon_exams", JSON.stringify(scheduleExams));
    localStorage.setItem("mailon_lecture_notes", JSON.stringify(lectureNotes));
    localStorage.setItem("mailon_citations", JSON.stringify(citations));
    localStorage.setItem("mailon_projects", JSON.stringify(projects));
    localStorage.setItem("mailon_tasks", JSON.stringify(tasks));
    localStorage.setItem("mailon_split_parties", JSON.stringify(splitParties));
    localStorage.setItem("mailon_ai_chat", JSON.stringify(aiChatHistory));
    localStorage.setItem("mailon_notifications", JSON.stringify(notifications));
    localStorage.setItem("mailon_user_stats", JSON.stringify(userStats));
    localStorage.setItem("mailon_achievements", JSON.stringify(achievements));
    localStorage.setItem("mailon_community_feedback", JSON.stringify(feedbacks));
    localStorage.setItem("onboarding_data", JSON.stringify(onboardingData));
    localStorage.setItem("onboarding_complete", "true");
    localStorage.setItem("mailon_data_seeded", "true");

    setIsSeeding(false);
    setSeeded(true);
    toast.success("🎉 Seed ข้อมูลเสร็จแล้ว!", {
      description: "ข้อมูล 4 เดือนย้อนหลัง + 6 เดือนล่วงหน้า พร้อมใช้งาน"
    });
  };

  const handleClearData = async () => {
    setIsClearing(true);
    await new Promise(r => setTimeout(r, 1000));

    const keysToRemove = [
      "mailon_wallet_expenses", "mailon_subscriptions", "mailon_schedule", "mailon_exams",
      "mailon_lecture_notes", "mailon_citations", "mailon_projects", "mailon_tasks",
      "mailon_split_parties", "mailon_ai_chat", "mailon_notifications", "mailon_user_stats",
      "mailon_achievements", "mailon_community_feedback", "mailon_data_seeded"
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));

    setIsClearing(false);
    setSeeded(false);
    toast.success("ล้างข้อมูลเสร็จแล้ว");
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          🌱 Data Seeder
        </h1>
        <p className="text-muted-foreground mt-2">
          สร้างข้อมูลจำลองสำหรับ Demo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Seed Data สำหรับ thnakon.d@gmail.com
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>ข้อมูลที่จะสร้าง:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>💰 Wallet: {walletExpenses.length} รายการค่าใช้จ่าย (4 เดือน)</li>
              <li>📱 Subscriptions: {subscriptions.length} บริการสมัครใช้</li>
              <li>📅 Schedule: {scheduleClasses.length} วิชา + {scheduleExams.length} สอบ</li>
              <li>📝 Lecture Notes: {lectureNotes.length} บันทึกพร้อมสรุป</li>
              <li>📚 Citations: {citations.length} รายการอ้างอิง</li>
              <li>🗂️ Projects: {projects.length} โปรเจกต์ + {tasks.length} tasks</li>
              <li>👥 Split Party: {splitParties.length} รายการหาร</li>
              <li>🤖 AI Chat: {aiChatHistory.length} ข้อความ</li>
              <li>🏆 Achievements: Unlocked ไปแล้วหลายรายการ</li>
              <li>🔥 Streak: 45 วันติดต่อกัน</li>
            </ul>
          </div>

          {seeded && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">ข้อมูล Seed แล้ว!</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSeedData}
              disabled={isSeeding || seeded}
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl gap-2"
            >
              {isSeeding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Database className="w-4 h-4" />
              )}
              {isSeeding ? "กำลัง Seed..." : seeded ? "Seed แล้ว" : "Seed Data"}
            </Button>
            
            {seeded && (
              <Button
                onClick={handleClearData}
                disabled={isClearing}
                variant="outline"
                className="rounded-xl gap-2 text-destructive hover:text-destructive"
              >
                {isClearing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                ล้างข้อมูล
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
