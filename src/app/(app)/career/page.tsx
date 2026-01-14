import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Briefcase, Sparkles, ArrowRight, Download, Eye } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Launchpad",
  description: "สร้างเรซูเม่ และค้นหางานที่ใช่ด้วย AI",
};

const resumeTemplates = [
  { id: 1, name: "Clean Modern", preview: "🎨" },
  { id: 2, name: "Professional", preview: "💼" },
  { id: 3, name: "Creative", preview: "✨" },
];

const jobMatches = [
  {
    id: 1,
    title: "Junior Frontend Developer",
    company: "Tech Startup Co.",
    match: 92,
    salary: "฿25,000 - 35,000",
    tags: ["React", "TypeScript"],
  },
  {
    id: 2,
    title: "UI/UX Designer Intern",
    company: "Digital Agency",
    match: 85,
    salary: "฿15,000 - 20,000",
    tags: ["Figma", "Design"],
  },
];

export default function CareerPage() {
  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Career Launchpad
            </h1>
            <p className="text-muted-foreground">อนาคตไม่หลอน</p>
          </div>
        </div>
      </div>

      {/* Resume Magic */}
      <Card className="mb-6 border-2 border-purple-200 dark:border-purple-900/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Resume Magic
              </CardTitle>
              <CardDescription>สร้างเรซูเม่สไตล์ Minimalist</CardDescription>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
              <Sparkles className="w-4 h-4" />
              สร้างเรซูเม่
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">เลือก Template ที่ชอบ</p>
          <div className="grid grid-cols-3 gap-3">
            {resumeTemplates.map((template) => (
              <div 
                key={template.id} 
                className="aspect-[3/4] rounded-xl border-2 border-dashed border-muted hover:border-purple-400 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-muted/30"
              >
                <span className="text-3xl">{template.preview}</span>
                <span className="text-xs font-medium">{template.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job Match */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                Job Match
              </CardTitle>
              <CardDescription>AI แนะนำงานที่ตรงกับ Skill ของคุณ</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobMatches.map((job) => (
              <div 
                key={job.id} 
                className="p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{job.title}</h4>
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                        {job.match}% Match
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
                    <p className="text-sm font-medium text-primary mt-1">{job.salary}</p>
                    <div className="flex gap-2 mt-2">
                      {job.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
