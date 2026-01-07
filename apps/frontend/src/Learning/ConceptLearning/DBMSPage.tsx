import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  Database,
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
    title: "Introduction to DBMS",
    description: "Learn the fundamentals of database management systems",
    topics: ["What is DBMS", "Database Models", "DBMS Architecture"],
    completed: true,
    progress: 100,
  },
  {
    id: "normalization",
    title: "Normalization",
    description: "Understand database normalization and normal forms",
    topics: ["1NF", "2NF", "3NF", "BCNF"],
    completed: true,
    progress: 85,
  },
  {
    id: "transactions",
    title: "Transactions & Concurrency",
    description: "Master transaction management and concurrency control",
    topics: ["ACID Properties", "Locks", "Deadlocks", "Isolation Levels"],
    completed: false,
    progress: 40,
  },
  {
    id: "sql",
    title: "SQL Queries",
    description: "Learn SQL from basics to advanced queries",
    topics: ["SELECT", "JOINs", "Subqueries", "Stored Procedures"],
    completed: false,
    progress: 60,
  },
  {
    id: "indexing",
    title: "Indexing & Hashing",
    description: "Understand database indexing and hashing techniques",
    topics: ["B-Trees", "B+ Trees", "Hash Indexes"],
    completed: false,
    progress: 20,
  },
  {
    id: "query-processing",
    title: "Query Processing",
    description: "Learn how databases process and optimize queries",
    topics: ["Query Optimization", "Execution Plans", "Cost Estimation"],
    completed: false,
    progress: 10,
  },
];

const INTERVIEW_NOTES = [
  { id: "acid", title: "ACID Properties", questions: 15 },
  { id: "normalization", title: "Normalization Interview Q&A", questions: 20 },
  { id: "sql", title: "SQL Interview Questions", questions: 30 },
  { id: "transactions", title: "Transaction Management", questions: 18 },
];

const PRACTICE_MCQS = [
  { id: "mcq-1", title: "DBMS Basics Quiz", questions: 20, completed: true },
  { id: "mcq-2", title: "Normalization Quiz", questions: 15, completed: false },
  { id: "mcq-3", title: "SQL Quiz", questions: 25, completed: false },
  { id: "mcq-4", title: "Transactions Quiz", questions: 18, completed: false },
];

export default function DBMSPage() {
  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-[1800px] mx-auto px-6 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 shadow-lg">
                <Database className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-green-500/15 to-emerald-500/15 text-green-600 border-0 shadow-lg">
              <GraduationCap className="h-4 w-4 mr-2" />
              Concept Learning
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Database Management Systems
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master DBMS concepts with structured lessons, visual diagrams, examples, and interview preparation.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12 space-y-12">
        {/* Overview Section */}
        <Card className="bg-gradient-to-br from-green-500/5 to-transparent border-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Database Management Systems (DBMS) is a software system that allows users to define, create, maintain, and control access to databases. 
              This course covers everything from basic concepts to advanced topics like query optimization and transaction management.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-green-500 mb-1">{CHAPTERS.length}</div>
                <div className="text-sm text-muted-foreground">Chapters</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-green-500 mb-1">50+</div>
                <div className="text-sm text-muted-foreground">Topics</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-green-500 mb-1">100+</div>
                <div className="text-sm text-muted-foreground">MCQs</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-green-500 mb-1">80+</div>
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
                <BookOpen className="h-6 w-6 text-green-500" />
                Chapters
              </h2>
              <p className="text-muted-foreground mt-1">
                Learn DBMS concepts step by step with detailed explanations
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
                  navigate(`/learning/concepts/dbms/chapter/${chapter.id}`);
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
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-green-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </div>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-semibold">{chapter.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
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
                      navigate(`/learning/concepts/dbms/chapter/${chapter.id}`);
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
            <ImageIcon className="h-6 w-6 text-green-500" />
            Visual Diagrams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "ER Diagram",
              "Database Architecture",
              "Normalization Process",
              "Transaction States",
            ].map((diagram) => (
              <Card key={diagram} className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 text-green-500" />
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
            <FileText className="h-6 w-6 text-green-500" />
            Interview Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INTERVIEW_NOTES.map((note) => (
              <Card
                key={note.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/learning/concepts/dbms/interview/${note.id}`)}
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
            <FileQuestion className="h-6 w-6 text-green-500" />
            Practice MCQs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRACTICE_MCQS.map((quiz) => (
              <Card
                key={quiz.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/learning/concepts/dbms/quiz/${quiz.id}`)}
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
        <Card className="bg-gradient-to-br from-green-500/5 to-transparent border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-green-500" />
              Revision Sheet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Quick reference guide for all DBMS concepts, formulas, and key points.
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

