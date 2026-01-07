import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  ArrowLeft,
  Play,
  BookOpen,
  Image as ImageIcon,
  Video,
  Lightbulb,
  CheckCircle2,
  Target,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";

// Mock data for Number Series topic
const NUMBER_SERIES_CONTENT = {
  title: "Number Series",
  difficulty: "Easy",
  description: "Learn to identify patterns and predict the next number in a sequence",
  overview: "Number series problems test your ability to recognize patterns in sequences of numbers. These patterns can be based on arithmetic operations, geometric progressions, or more complex mathematical relationships.",
  
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      type: "text",
      content: "A number series is a sequence of numbers that follow a specific pattern or rule. To solve number series problems, you need to identify the pattern and apply it to find the missing or next number.",
    },
    {
      id: "types",
      title: "Types of Number Series",
      type: "list",
      content: [
        "Arithmetic Series: Numbers increase or decrease by a constant value (e.g., 2, 5, 8, 11, 14...)",
        "Geometric Series: Numbers are multiplied or divided by a constant value (e.g., 2, 6, 18, 54...)",
        "Square Series: Numbers are squares of natural numbers (e.g., 1, 4, 9, 16, 25...)",
        "Prime Series: Series of prime numbers (e.g., 2, 3, 5, 7, 11...)",
        "Fibonacci Series: Each number is the sum of the two preceding ones (e.g., 1, 1, 2, 3, 5, 8...)",
      ],
    },
    {
      id: "example-1",
      title: "Example 1: Arithmetic Series",
      type: "example",
      content: {
        series: "2, 5, 8, 11, 14, ?",
        explanation: "In this series, each number increases by 3. So the pattern is: +3, +3, +3...",
        solution: "The next number is 14 + 3 = 17",
        steps: [
          "Identify the difference: 5 - 2 = 3",
          "Verify: 8 - 5 = 3, 11 - 8 = 3",
          "Apply: 14 + 3 = 17",
        ],
      },
    },
    {
      id: "example-2",
      title: "Example 2: Geometric Series",
      type: "example",
      content: {
        series: "3, 6, 12, 24, 48, ?",
        explanation: "In this series, each number is multiplied by 2.",
        solution: "The next number is 48 × 2 = 96",
        steps: [
          "Identify the ratio: 6 ÷ 3 = 2",
          "Verify: 12 ÷ 6 = 2, 24 ÷ 12 = 2",
          "Apply: 48 × 2 = 96",
        ],
      },
    },
    {
      id: "tips",
      title: "Key Tips",
      type: "tips",
      content: [
        "Look for the difference between consecutive numbers first",
        "Check if numbers are being multiplied or divided",
        "Consider if numbers are squares, cubes, or other powers",
        "Look for alternating patterns",
        "Break complex series into simpler parts",
      ],
    },
  ],

  images: [
    { id: "img1", title: "Arithmetic Series Pattern", description: "Visual representation of arithmetic progression" },
    { id: "img2", title: "Geometric Series Pattern", description: "Visual representation of geometric progression" },
  ],

  videos: [
    { id: "vid1", title: "Introduction to Number Series", duration: "5:30" },
    { id: "vid2", title: "Solving Complex Patterns", duration: "8:15" },
  ],

  keyPoints: [
    "Always find the pattern first before solving",
    "Check multiple relationships (addition, multiplication, etc.)",
    "Practice with different types of series",
    "Time management is crucial in exams",
  ],
};

export default function TopicLearningPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get("topic") || "number-series";
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  // For now, using Number Series as example
  // Later, you can fetch content based on topicParam
  const content = NUMBER_SERIES_CONTENT;

  const toggleSectionComplete = (sectionId: string) => {
    setCompletedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleStartQuiz = () => {
    navigate(`/learning/practice/aptitude/topic/quiz?topic=${topicParam}`);
  };

  const progressPercentage = (completedSections.length / content.sections.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/learning/practice/aptitude")}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{content.title}</h1>
              <p className="text-sm text-muted-foreground">Learn & Practice</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>~15 min</span>
            </div>
            <Badge
              variant="outline"
              className={
                content.difficulty === "Easy"
                  ? "bg-green-500/10 text-green-600 border-green-500/20"
                  : content.difficulty === "Medium"
                  ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                  : "bg-red-500/10 text-red-600 border-red-500/20"
              }
            >
              {content.difficulty}
            </Badge>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-cyan-500/10 border border-blue-500/20">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="relative p-8 md:p-12">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Learning Module
                  </Badge>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {content.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  {content.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 backdrop-blur border border-border/40">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">
                  {completedSections.length} of {content.sections.length} sections
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 backdrop-blur border border-border/40">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">{Math.round(progressPercentage)}% Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <Card className="mb-8 border-2 border-border/40 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed text-base">
              {content.overview}
            </p>
          </CardContent>
        </Card>

        {/* Learning Sections */}
        <div className="space-y-6 mb-8">
          {content.sections.map((section, index) => {
            const isCompleted = completedSections.includes(section.id);
            return (
              <Card
                key={section.id}
                className={`border-2 transition-all duration-300 hover:shadow-lg ${
                  isCompleted
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-border/40"
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-xl font-semibold text-sm transition-all ${
                          isCompleted
                            ? "bg-green-500 text-white shadow-lg"
                            : "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-blue-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className={isCompleted ? "line-through opacity-60" : ""}>
                        {section.title}
                      </span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSectionComplete(section.id)}
                      className="hover:bg-muted"
                    >
                      {isCompleted ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span className="text-xs text-green-600 font-medium hidden sm:inline">
                            Completed
                          </span>
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground hover:border-blue-500 transition-colors" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                {section.type === "text" && typeof section.content === "string" && (
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {section.content}
                    </p>
                  </div>
                )}

                {section.type === "list" && Array.isArray(section.content) && (
                  <ul className="space-y-3">
                    {section.content.map((item: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className="mt-1 flex-shrink-0">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ChevronRight className="h-3 w-3 text-blue-500" />
                          </div>
                        </div>
                        <span className="text-muted-foreground leading-relaxed flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.type === "example" && typeof section.content === "object" && "series" in section.content && (
                  <div className="space-y-4">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-2 border-blue-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 rounded-lg bg-blue-500/10">
                          <Target className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                          Example
                        </span>
                      </div>
                      <p className="font-mono text-xl font-bold mb-3 text-foreground">
                        {section.content.series}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {section.content.explanation}
                      </p>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/20">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-lg bg-green-500/20">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="font-semibold text-green-600">Solution</p>
                      </div>
                      <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                        {section.content.solution}
                      </p>
                      <div className="space-y-2 pt-4 border-t border-green-500/20">
                        {section.content.steps.map((step: string, stepIdx: number) => (
                          <div
                            key={stepIdx}
                            className="flex items-start gap-3 p-3 rounded-lg bg-background/50"
                          >
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                              <span className="text-xs font-bold text-green-600">{stepIdx + 1}</span>
                            </div>
                            <span className="text-sm text-muted-foreground leading-relaxed flex-1">
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {section.type === "tips" && Array.isArray(section.content) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.content.map((tip: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/20 hover:shadow-md transition-all group"
                      >
                        <div className="p-2 rounded-lg bg-yellow-500/20 group-hover:scale-110 transition-transform">
                          <Lightbulb className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                        </div>
                        <span className="text-sm text-muted-foreground leading-relaxed flex-1 pt-0.5">
                          {tip}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* Visual Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Images Section */}
          <Card className="border-2 border-border/40 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <ImageIcon className="h-5 w-5 text-blue-500" />
                </div>
                Visual Diagrams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.images.map((img) => (
                  <div
                    key={img.id}
                    className="group p-4 rounded-xl border-2 border-border/40 hover:border-blue-500/40 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-background to-muted/20"
                  >
                    <div className="h-40 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-indigo-500/10 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                      <ImageIcon className="h-16 w-16 text-blue-500/50 group-hover:scale-110 transition-transform" />
                    </div>
                    <h4 className="font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                      {img.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{img.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Videos Section */}
          <Card className="border-2 border-border/40 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Video className="h-5 w-5 text-purple-500" />
                </div>
                Video Tutorials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.videos.map((video) => (
                  <div
                    key={video.id}
                    className="group p-4 rounded-xl border-2 border-border/40 hover:border-purple-500/40 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-background to-muted/20"
                  >
                    <div className="h-40 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                          <Play className="h-10 w-10 text-white ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold mb-1 group-hover:text-purple-600 transition-colors">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{video.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Points Summary */}
        <Card className="mb-8 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border-2 border-green-500/20 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              Key Points to Remember
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-green-500/10 hover:border-green-500/30 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-green-500/20 flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm text-muted-foreground leading-relaxed flex-1 pt-0.5">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Start Quiz Button */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-cyan-500/10 border-2 border-blue-500/30 shadow-xl">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <CardContent className="relative p-8 md:p-12">
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 shadow-lg">
                  <Target className="h-10 w-10 text-blue-500" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Ready to Test Your Knowledge?
                </h2>
                <p className="text-lg text-muted-foreground mb-2">
                  You've learned the concepts. Now practice with real questions!
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>{completedSections.length} sections completed</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    <span>Practice makes perfect</span>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90 px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                onClick={handleStartQuiz}
              >
                <Play className="h-6 w-6 mr-2" />
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

