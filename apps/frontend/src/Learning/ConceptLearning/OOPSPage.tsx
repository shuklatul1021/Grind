import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  Workflow,
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
    title: "Introduction to OOP",
    description: "Learn the fundamentals of object-oriented programming",
    topics: ["What is OOP", "Classes & Objects", "Principles of OOP"],
    completed: true,
    progress: 100,
  },
  {
    id: "encapsulation",
    title: "Encapsulation",
    description: "Understand data hiding and access modifiers",
    topics: ["Access Modifiers", "Getters & Setters", "Data Hiding"],
    completed: true,
    progress: 90,
  },
  {
    id: "inheritance",
    title: "Inheritance",
    description: "Master class inheritance and code reusability",
    topics: ["Single Inheritance", "Multiple Inheritance", "Method Overriding"],
    completed: false,
    progress: 70,
  },
  {
    id: "polymorphism",
    title: "Polymorphism",
    description: "Learn runtime and compile-time polymorphism",
    topics: ["Method Overloading", "Method Overriding", "Dynamic Binding"],
    completed: false,
    progress: 60,
  },
  {
    id: "abstraction",
    title: "Abstraction",
    description: "Understand abstract classes and interfaces",
    topics: ["Abstract Classes", "Interfaces", "Abstract Methods"],
    completed: false,
    progress: 50,
  },
  {
    id: "design-patterns",
    title: "Design Patterns",
    description: "Learn common OOP design patterns",
    topics: ["Singleton", "Factory", "Observer", "Strategy"],
    completed: false,
    progress: 30,
  },
];

const INTERVIEW_NOTES = [
  { id: "oops-basics", title: "OOPS Fundamentals Q&A", questions: 20 },
  { id: "inheritance", title: "Inheritance Interview Questions", questions: 18 },
  { id: "polymorphism", title: "Polymorphism Q&A", questions: 22 },
  { id: "design-patterns", title: "Design Patterns Interview", questions: 25 },
];

const PRACTICE_MCQS = [
  { id: "mcq-1", title: "OOPS Basics Quiz", questions: 20, completed: true },
  { id: "mcq-2", title: "Inheritance Quiz", questions: 18, completed: false },
  { id: "mcq-3", title: "Polymorphism Quiz", questions: 22, completed: false },
  { id: "mcq-4", title: "Design Patterns Quiz", questions: 25, completed: false },
];

export default function OOPSPage() {
  const navigate = useNavigate();
  const [, setSelectedChapter] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-[1800px] mx-auto px-6 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 shadow-lg">
                <Workflow className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-purple-500/15 to-pink-500/15 text-purple-600 border-0 shadow-lg">
              <GraduationCap className="h-4 w-4 mr-2" />
              Concept Learning
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Object-Oriented Programming
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master OOPS concepts with structured lessons, real-world examples, design patterns, and interview preparation.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12 space-y-12">
        {/* Overview Section */}
        <Card className="bg-gradient-to-br from-purple-500/5 to-transparent border-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Object-Oriented Programming (OOP) is a programming paradigm based on the concept of objects. 
              This course covers the four pillars of OOP: Encapsulation, Inheritance, Polymorphism, and Abstraction, along with design patterns.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-purple-500 mb-1">{CHAPTERS.length}</div>
                <div className="text-sm text-muted-foreground">Chapters</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-purple-500 mb-1">30+</div>
                <div className="text-sm text-muted-foreground">Topics</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-purple-500 mb-1">85+</div>
                <div className="text-sm text-muted-foreground">MCQs</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-2xl font-bold text-purple-500 mb-1">85+</div>
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
                <BookOpen className="h-6 w-6 text-purple-500" />
                Chapters
              </h2>
              <p className="text-muted-foreground mt-1">
                Learn OOPS concepts step by step with detailed explanations
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
                  navigate(`/learning/concepts/oops/chapter/${chapter.id}`);
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
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </div>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-semibold">{chapter.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
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
                      navigate(`/learning/concepts/oops/chapter/${chapter.id}`);
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
            <ImageIcon className="h-6 w-6 text-purple-500" />
            Visual Diagrams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "Class Hierarchy",
              "Inheritance Tree",
              "Polymorphism Flow",
              "Design Pattern UML",
            ].map((diagram) => (
              <Card key={diagram} className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-3 text-purple-500" />
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
            <FileText className="h-6 w-6 text-purple-500" />
            Interview Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INTERVIEW_NOTES.map((note) => (
              <Card
                key={note.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/learning/concepts/oops/interview/${note.id}`)}
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
            <FileQuestion className="h-6 w-6 text-purple-500" />
            Practice MCQs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRACTICE_MCQS.map((quiz) => (
              <Card
                key={quiz.id}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/learning/concepts/oops/quiz/${quiz.id}`)}
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
        <Card className="bg-gradient-to-br from-purple-500/5 to-transparent border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-purple-500" />
              Revision Sheet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Quick reference guide for all OOPS concepts, principles, and design patterns.
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

