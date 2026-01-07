import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
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
    title: "Introduction to Computer Science",
    description: "Learn the fundamentals and history of computer science",
    topics: ["What is CS", "History of Computing", "Computer Components"],
    completed: true,
    progress: 100,
  },
  {
    id: "data-structures",
    title: "Data Structures",
    description: "Understand fundamental data structures and their applications",
    topics: ["Arrays", "Linked Lists", "Stacks", "Queues", "Trees"],
    completed: true,
    progress: 80,
  },
  {
    id: "algorithms",
    title: "Algorithms",
    description: "Master algorithm design and analysis techniques",
    topics: ["Sorting", "Searching", "Dynamic Programming", "Greedy Algorithms"],
    completed: false,
    progress: 50,
  },
  {
    id: "complexity",
    title: "Time & Space Complexity",
    description: "Learn Big O notation and complexity analysis",
    topics: ["Big O Notation", "Time Complexity", "Space Complexity", "Analysis"],
    completed: false,
    progress: 40,
  },
  {
    id: "recursion",
    title: "Recursion",
    description: "Understand recursive thinking and problem solving",
    topics: ["Recursive Functions", "Base Cases", "Recursive Trees"],
    completed: false,
    progress: 30,
  },
  {
    id: "sorting",
    title: "Sorting Algorithms",
    description: "Master various sorting techniques and their trade-offs",
    topics: ["Bubble Sort", "Quick Sort", "Merge Sort", "Heap Sort"],
    completed: false,
    progress: 20,
  },
];

const INTERVIEW_NOTES = [
  { id: "data-structures", title: "Data Structures Interview Q&A", questions: 25 },
  { id: "algorithms", title: "Algorithms Interview Questions", questions: 30 },
  { id: "complexity", title: "Complexity Analysis Q&A", questions: 18 },
  { id: "sorting", title: "Sorting Algorithms Interview", questions: 15 },
];

const PRACTICE_MCQS = [
  { id: "mcq-1", title: "CS Basics Quiz", questions: 20, completed: true },
  { id: "mcq-2", title: "Data Structures Quiz", questions: 25, completed: false },
  { id: "mcq-3", title: "Algorithms Quiz", questions: 30, completed: false },
  { id: "mcq-4", title: "Complexity Analysis Quiz", questions: 18, completed: false },
];

export default function CSPage() {
  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-[1800px] mx-auto px-6 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 shadow-lg">
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-blue-500/15 to-cyan-500/15 text-blue-600 border-0 shadow-lg">
              <GraduationCap className="h-4 w-4 mr-2" />
              Concept Learning
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Computer Science Basics
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master fundamental computer science concepts with structured lessons, visual diagrams, examples, and interview preparation.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12 space-y-12">
        {/* Overview Section */}
        <Card className="bg-gradient-to-br from-blue-500/5 to-transparent border-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Computer Science is the study of algorithms, data structures, and computational systems. 
              This course covers everything from basic concepts to advanced algorithms and data structures used in software development.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-blue-500 mb-1">{CHAPTERS.length}</div>
                <div className="text-sm text-muted-foreground">Chapters</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-blue-500 mb-1">25+</div>
                <div className="text-sm text-muted-foreground">Topics</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-blue-500 mb-1">90+</div>
                <div className="text-sm text-muted-foreground">MCQs</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-blue-500 mb-1">88+</div>
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
                <BookOpen className="h-6 w-6 text-blue-500" />
                Chapters
              </h2>
              <p className="text-muted-foreground mt-1">
                Learn CS concepts step by step with detailed explanations
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
                  navigate(`/learning/concepts/cs/chapter/${chapter.id}`);
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
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </div>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-semibold">{chapter.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
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
                      navigate(`/learning/concepts/cs/chapter/${chapter.id}`);
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
            <ImageIcon className="h-6 w-6 text-blue-500" />
            Visual Diagrams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Data Structure Types",
              "Algorithm Flowcharts",
              "Complexity Graphs",
              "Recursion Trees",
            ].map((diagram) => (
              <Card key={diagram} className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 text-blue-500" />
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
            <FileText className="h-6 w-6 text-blue-500" />
            Interview Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INTERVIEW_NOTES.map((note) => (
              <Card
                key={note.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/learning/concepts/cs/interview/${note.id}`)}
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
            <FileQuestion className="h-6 w-6 text-blue-500" />
            Practice MCQs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRACTICE_MCQS.map((quiz) => (
              <Card
                key={quiz.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/learning/concepts/cs/quiz/${quiz.id}`)}
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
        <Card className="bg-gradient-to-br from-blue-500/5 to-transparent border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-500" />
              Revision Sheet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Quick reference guide for all CS concepts, algorithms, and key points.
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

