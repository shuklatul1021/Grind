import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  CpuIcon,
  BookOpen,
  FileText,
  Target,
  CheckCircle2,
  Circle,
  ArrowRight,
  Play,
  Image as ImageIcon,
  FileQuestion,
  GraduationCap,
} from "lucide-react";

// Mock data
const CHAPTERS = [
  {
    id: "introduction",
    title: "Introduction to OS",
    description: "Learn the fundamentals of operating systems",
    topics: ["What is OS", "OS Types", "OS Functions"],
    completed: true,
    progress: 100,
  },
  {
    id: "processes",
    title: "Process Management",
    description: "Understand process scheduling and management",
    topics: ["Process States", "Scheduling Algorithms", "Context Switching"],
    completed: true,
    progress: 85,
  },
  {
    id: "threads",
    title: "Threads & Concurrency",
    description: "Master thread management and synchronization",
    topics: ["Threads vs Processes", "Thread Synchronization", "Deadlocks"],
    completed: false,
    progress: 60,
  },
  {
    id: "memory",
    title: "Memory Management",
    description: "Learn memory allocation and virtual memory",
    topics: ["Paging", "Segmentation", "Virtual Memory", "Page Replacement"],
    completed: false,
    progress: 50,
  },
  {
    id: "file-systems",
    title: "File Systems",
    description: "Understand file system organization and management",
    topics: ["File Organization", "Directory Structure", "File Operations"],
    completed: false,
    progress: 40,
  },
  {
    id: "i-o",
    title: "I/O Management",
    description: "Learn input/output device management",
    topics: ["I/O Devices", "Device Drivers", "I/O Scheduling"],
    completed: false,
    progress: 25,
  },
];

const INTERVIEW_NOTES = [
  { id: "processes", title: "Process Management Q&A", questions: 25 },
  { id: "memory", title: "Memory Management Interview", questions: 22 },
  { id: "threads", title: "Threads & Concurrency Q&A", questions: 20 },
  { id: "scheduling", title: "Scheduling Algorithms", questions: 18 },
];

const PRACTICE_MCQS = [
  { id: "mcq-1", title: "OS Basics Quiz", questions: 20, completed: true },
  { id: "mcq-2", title: "Process Management Quiz", questions: 25, completed: false },
  { id: "mcq-3", title: "Memory Management Quiz", questions: 22, completed: false },
  { id: "mcq-4", title: "File Systems Quiz", questions: 18, completed: false },
];

export default function OSPage() {
  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-[1800px] mx-auto px-6 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 shadow-lg">
                <CpuIcon className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-orange-500/15 to-red-500/15 text-orange-600 border-0 shadow-lg">
              <GraduationCap className="h-4 w-4 mr-2" />
              Concept Learning
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Operating Systems
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understand processes, threads, memory management, and file systems in depth with structured lessons and examples.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12 space-y-12">
        {/* Overview Section */}
        <Card className="bg-gradient-to-br from-orange-500/5 to-transparent border-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              An Operating System (OS) is system software that manages computer hardware and software resources. 
              This course covers process management, memory management, file systems, and I/O management.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-orange-500 mb-1">{CHAPTERS.length}</div>
                <div className="text-sm text-muted-foreground">Chapters</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-orange-500 mb-1">40+</div>
                <div className="text-sm text-muted-foreground">Topics</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-orange-500 mb-1">85+</div>
                <div className="text-sm text-muted-foreground">MCQs</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-orange-500 mb-1">85+</div>
                <div className="text-sm text-muted-foreground">Interview Q&A</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chapters Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-orange-500" />
                Chapters
              </h2>
              <p className="text-muted-foreground mt-1">
                Learn OS concepts step by step with detailed explanations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHAPTERS.map((chapter) => (
              <Card
                key={chapter.id}
                className="group cursor-pointer hover:shadow-lg transition-all border-border/40"
                onClick={() => {
                  setSelectedChapter(chapter.id);
                  navigate(`/learning/concepts/os/chapter/${chapter.id}`);
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {chapter.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <h3 className="text-lg font-semibold">{chapter.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {chapter.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {chapter.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {chapter.topics.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{chapter.topics.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </div>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-semibold">{chapter.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${chapter.progress}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/learning/concepts/os/chapter/${chapter.id}`);
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Visual Diagrams Section */}
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <ImageIcon className="h-6 w-6 text-orange-500" />
            Visual Diagrams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Process State Diagram",
              "Memory Layout",
              "File System Structure",
              "Scheduling Algorithms",
            ].map((diagram) => (
              <Card key={diagram} className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 text-orange-500" />
                  <h3 className="font-semibold">{diagram}</h3>
                  <Button size="sm" variant="ghost" className="mt-3">
                    View Diagram
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Interview Notes Section */}
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <FileText className="h-6 w-6 text-orange-500" />
            Interview Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INTERVIEW_NOTES.map((note) => (
              <Card
                key={note.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/learning/concepts/os/interview/${note.id}`)}
              >
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{note.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {note.questions} questions
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    View Notes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Practice MCQs Section */}
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <FileQuestion className="h-6 w-6 text-orange-500" />
            Practice MCQs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRACTICE_MCQS.map((quiz) => (
              <Card
                key={quiz.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/learning/concepts/os/quiz/${quiz.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {quiz.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <h3 className="font-semibold">{quiz.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {quiz.questions} questions
                  </p>
                  <Button size="sm" className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Revision Sheet */}
        <Card className="bg-gradient-to-br from-orange-500/5 to-transparent border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-orange-500" />
              Revision Sheet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Quick reference guide for all OS concepts, algorithms, and key points.
            </p>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Download Revision Sheet
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

