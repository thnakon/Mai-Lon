"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Plus,
  FolderKanban,
  MoreVertical,
  Trash2,
  Edit3,
  CheckCircle2,
  Circle,
  Clock,
  Users,
  CalendarDays,
  GripVertical,
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

type TaskStatus = "todo" | "in-progress" | "done";
type Priority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: string;
  dueDate?: string;
  projectId: string;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

const statusConfig = {
  todo: { label: "To Do", labelTh: "รอทำ", icon: Circle, color: "text-muted-foreground" },
  "in-progress": { label: "In Progress", labelTh: "กำลังทำ", icon: Clock, color: "text-blue-500" },
  done: { label: "Done", labelTh: "เสร็จแล้ว", icon: CheckCircle2, color: "text-green-500" },
};

const priorityConfig = {
  low: { label: "Low", labelTh: "ต่ำ", color: "bg-gray-100 text-gray-600" },
  medium: { label: "Medium", labelTh: "กลาง", color: "bg-yellow-100 text-yellow-600" },
  high: { label: "High", labelTh: "สูง", color: "bg-red-100 text-red-600" },
};

const projectColors = [
  "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500",
  "bg-pink-500", "bg-cyan-500", "bg-indigo-500", "bg-rose-500",
];

export default function ProjectsPage() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", color: projectColors[0] });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Priority,
    assignee: "",
    dueDate: "",
  });

  useEffect(() => {
    setMounted(true);
    const savedProjects = localStorage.getItem("mailon_projects");
    const savedTasks = localStorage.getItem("mailon_tasks");
    if (savedProjects) {
      const p = JSON.parse(savedProjects);
      setProjects(p);
      if (p.length > 0) setSelectedProject(p[0].id);
    }
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mailon_projects", JSON.stringify(projects));
      localStorage.setItem("mailon_tasks", JSON.stringify(tasks));
    }
  }, [projects, tasks, mounted]);

  const currentProject = projects.find(p => p.id === selectedProject);
  const projectTasks = tasks.filter(t => t.projectId === selectedProject);
  const todoTasks = projectTasks.filter(t => t.status === "todo");
  const inProgressTasks = projectTasks.filter(t => t.status === "in-progress");
  const doneTasks = projectTasks.filter(t => t.status === "done");

  const handleAddProject = () => {
    if (!newProject.name.trim()) return;
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      color: newProject.color,
      createdAt: new Date().toISOString(),
    };
    setProjects([...projects, project]);
    setSelectedProject(project.id);
    setNewProject({ name: "", color: projectColors[0] });
    setIsAddingProject(false);
    toast.success(language === "th" ? "สร้างโปรเจกต์แล้ว!" : "Project created!");
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !selectedProject) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      priority: newTask.priority,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
      projectId: selectedProject,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, task]);
    setNewTask({ title: "", description: "", priority: "medium", assignee: "", dueDate: "" });
    setIsAddingTask(false);
    toast.success(language === "th" ? "เพิ่มงานแล้ว!" : "Task added!");
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    setTasks(tasks.filter(t => t.projectId !== projectId));
    if (selectedProject === projectId) {
      setSelectedProject(projects.filter(p => p.id !== projectId)[0]?.id || null);
    }
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const priority = priorityConfig[task.priority];
    return (
      <div className="p-3 bg-background rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground text-sm leading-tight">{task.title}</p>
            {task.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {task.status !== "todo" && (
                <DropdownMenuItem onClick={() => handleUpdateTaskStatus(task.id, "todo")}>
                  <Circle className="w-4 h-4 mr-2" />
                  {language === "th" ? "ย้ายไป รอทำ" : "Move to To Do"}
                </DropdownMenuItem>
              )}
              {task.status !== "in-progress" && (
                <DropdownMenuItem onClick={() => handleUpdateTaskStatus(task.id, "in-progress")}>
                  <Clock className="w-4 h-4 mr-2" />
                  {language === "th" ? "ย้ายไป กำลังทำ" : "Move to In Progress"}
                </DropdownMenuItem>
              )}
              {task.status !== "done" && (
                <DropdownMenuItem onClick={() => handleUpdateTaskStatus(task.id, "done")}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {language === "th" ? "ย้ายไป เสร็จแล้ว" : "Move to Done"}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                {language === "th" ? "ลบ" : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", priority.color)}>
            {language === "th" ? priority.labelTh : priority.label}
          </span>
          {task.dueDate && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString(language === "th" ? "th-TH" : "en-US", {
                day: "numeric",
                month: "short",
              })}
            </span>
          )}
          {task.assignee && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3" />
              {task.assignee}
            </span>
          )}
        </div>
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className={cn("flex items-start justify-between", fadeInUp)} style={{ animationDelay: "0ms" }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {language === "th" ? "โปรเจกต์" : "Projects"}
          </h1>
          <p className="text-muted-foreground">
            {language === "th" ? "จัดการงานกลุ่มด้วย Kanban Board" : "Manage team tasks with Kanban Board"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsAddingProject(true)}
            variant="outline"
            className="gap-2 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            {language === "th" ? "สร้างโปรเจกต์" : "New Project"}
          </Button>
          {selectedProject && (
            <Button
              onClick={() => setIsAddingTask(true)}
              className="bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              {language === "th" ? "เพิ่มงาน" : "Add Task"}
            </Button>
          )}
        </div>
      </div>

      {/* Projects Tabs */}
      {projects.length > 0 && (
        <div className={cn("flex gap-2 overflow-x-auto pb-2", fadeInUp)} style={{ animationDelay: "100ms" }}>
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2",
                selectedProject === project.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <div className={cn("w-3 h-3 rounded-full", project.color)} />
              {project.name}
              <span className="text-xs opacity-60">
                ({tasks.filter(t => t.projectId === project.id).length})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      <Modal
        isOpen={isAddingProject}
        onClose={() => setIsAddingProject(false)}
        title={language === "th" ? "สร้างโปรเจกต์ใหม่" : "Create New Project"}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {language === "th" ? "ชื่อโปรเจกต์" : "Project Name"}
            </label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              placeholder={language === "th" ? "เช่น งานกลุ่ม CS101" : "e.g. CS101 Group Project"}
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {language === "th" ? "สี" : "Color"}
            </label>
            <div className="flex gap-2">
              {projectColors.map(color => (
                <button
                  key={color}
                  onClick={() => setNewProject({ ...newProject, color })}
                  className={cn(
                    "w-8 h-8 rounded-lg",
                    color,
                    newProject.color === color && "ring-2 ring-primary ring-offset-2"
                  )}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsAddingProject(false)} className="flex-1 rounded-xl">
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </Button>
            <Button onClick={handleAddProject} className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl">
              {language === "th" ? "สร้าง" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddingTask}
        onClose={() => setIsAddingTask(false)}
        title={language === "th" ? "เพิ่มงานใหม่" : "Add New Task"}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {language === "th" ? "ชื่องาน" : "Task Title"} *
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder={language === "th" ? "เช่น ทำ Slide นำเสนอ" : "e.g. Create presentation slides"}
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {language === "th" ? "รายละเอียด" : "Description"}
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder={language === "th" ? "รายละเอียดเพิ่มเติม..." : "Additional details..."}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === "th" ? "ความสำคัญ" : "Priority"}
              </label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              >
                <option value="low">{language === "th" ? "ต่ำ" : "Low"}</option>
                <option value="medium">{language === "th" ? "กลาง" : "Medium"}</option>
                <option value="high">{language === "th" ? "สูง" : "High"}</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === "th" ? "มอบหมาย" : "Assignee"}
              </label>
              <input
                type="text"
                value={newTask.assignee}
                onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                placeholder="ชื่อ"
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {language === "th" ? "กำหนดส่ง" : "Due Date"}
              </label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-input bg-background text-foreground"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsAddingTask(false)} className="flex-1 rounded-xl">
              {language === "th" ? "ยกเลิก" : "Cancel"}
            </Button>
            <Button onClick={handleAddTask} className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl">
              {language === "th" ? "เพิ่ม" : "Add"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Kanban Board */}
      {projects.length === 0 ? (
        <Card className={cn(fadeInUp)} style={{ animationDelay: "200ms" }}>
          <CardContent className="py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FolderKanban className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground text-lg">
              {language === "th" ? "ยังไม่มีโปรเจกต์" : "No projects yet"}
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              {language === "th" 
                ? "สร้างโปรเจกต์แรกเพื่อเริ่มจัดการงานกลุ่ม" 
                : "Create your first project to start managing tasks"}
            </p>
            <Button
              onClick={() => setIsAddingProject(true)}
              className="mt-6 bg-primary hover:bg-primary/90 text-white gap-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              {language === "th" ? "สร้างโปรเจกต์แรก" : "Create First Project"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", fadeInUp)} style={{ animationDelay: "200ms" }}>
          {/* To Do Column */}
          <div className="bg-muted/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Circle className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">
                {language === "th" ? "รอทำ" : "To Do"}
              </h3>
              <span className="ml-auto text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {todoTasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {todoTasks.map(task => <TaskCard key={task.id} task={task} />)}
              {todoTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {language === "th" ? "ไม่มีงาน" : "No tasks"}
                </p>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-blue-500" />
              <h3 className="font-semibold text-foreground">
                {language === "th" ? "กำลังทำ" : "In Progress"}
              </h3>
              <span className="ml-auto text-sm text-muted-foreground bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">
                {inProgressTasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)}
              {inProgressTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {language === "th" ? "ไม่มีงาน" : "No tasks"}
                </p>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="bg-green-50/50 dark:bg-green-950/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <h3 className="font-semibold text-foreground">
                {language === "th" ? "เสร็จแล้ว" : "Done"}
              </h3>
              <span className="ml-auto text-sm text-muted-foreground bg-green-100 dark:bg-green-900/50 px-2 py-0.5 rounded-full">
                {doneTasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {doneTasks.map(task => <TaskCard key={task.id} task={task} />)}
              {doneTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {language === "th" ? "ไม่มีงาน" : "No tasks"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
