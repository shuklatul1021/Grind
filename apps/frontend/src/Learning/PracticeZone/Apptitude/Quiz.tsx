import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, SquareChevronRight, Settings, Sun, Moon,
  CheckCircle2, XCircle, Info,
  Calculator, PenTool, Bookmark, Lightbulb, Maximize2, EyeOff, Clock,
  ChevronRight, Zap, AlertCircle, Keyboard
} from "lucide-react";

import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { Progress } from "@repo/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { useTheme } from "../../../contexts/ThemeContext";

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which of the following sorting algorithms has the best worst-case time complexity?",
    options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Selection Sort"],
    answer: 0,
    explanation: "Merge Sort has a guaranteed O(n log n) time complexity in the worst case, whereas Quick Sort can degrade to O(n²) if pivot selection is poor.",
    tags: ["Algorithms", "Computer Science"],
    difficulty: "Medium"
  },
  {
    id: 2,
    question: "In React, what is the primary purpose of the 'useMemo' hook?",
    options: ["To create a memoized component", "To memoize expensive calculations", "To synchronize with external systems", "To manage global state"],
    answer: 1,
    explanation: "useMemo is used to cache the result of a calculation between re-renders, preventing unnecessary heavy computations.",
    tags: ["React", "Frontend"],
    difficulty: "Easy"
  },
  {
    id: 3,
    question: "What does the 'A' in ACID properties of a database stand for?",
    options: ["Availability", "Authority", "Atomicity", "Agreement"],
    answer: 2,
    explanation: "Atomicity ensures that a transaction is treated as a single unit, which either completely succeeds or completely fails.",
    tags: ["Databases", "Backend"],
    difficulty: "Hard"
  }
];

export default function PremiumQuizPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [confidence, setConfidence] = useState<string | null>(null);

  const question = QUIZ_QUESTIONS[current];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const progress = ((current + 1) / totalQuestions) * 100;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showResult) {
        if (e.key === "Enter") handleContinue();
        return;
      }
      if (["1", "2", "3", "4"].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (idx < question.options.length) handleOptionClick(idx);
      }
      if (e.key === "Enter" && selected !== null) handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, showResult, current]);

  useEffect(() => {
    if (showResult) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [current, showResult]);

  const handleOptionClick = (idx: number) => {
    if (!showResult) setSelected(idx);
  };

  const handleNext = () => {
    if (selected === question.answer) setScore((s) => s + 1);
    setShowResult(true);
  };

  const handleContinue = () => {
    if (current < totalQuestions - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
      setTimeLeft(60);
      setConfidence(null);
      setIsBookmarked(false);
    } else {
      alert(`Quiz Finished! Final Score: ${score + (selected === question.answer ? 1 : 0)}/${totalQuestions}`);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-slate-50 text-slate-900'}`}>
      {!isZenMode && (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/40 bg-background/95 px-4 sticky top-0 z-50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8 rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                <SquareChevronRight className="h-5 w-5 text-primary" />
                <span className="font-bold tracking-tight">Grind</span>
              </div>
              <div className="h-4 w-[1px] bg-border/50" />
              <span className="text-sm font-medium opacity-70 truncate max-w-[150px]">
                {question.tags[0]} Assessment
              </span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center w-1/4 gap-1">
            <div className="flex justify-between w-full text-[10px] uppercase tracking-tighter font-bold opacity-60">
              <span>Progress</span>
              <span>{current + 1} of {totalQuestions}</span>
            </div>
            <Progress value={progress} className="h-1.5 w-full bg-primary/10" />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => toggleTheme(theme === "dark" ? "light" : "dark")} className="h-8 w-8">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-60"><Settings className="h-4 w-4" /></Button>
            <div className="h-4 w-[1px] bg-border/50 mx-1" />
            <Button size="sm" variant="outline" className="h-8 px-4 text-xs font-bold border-primary/20 hover:bg-primary/5">Finish</Button>
          </div>
        </header>
      )}
      <main className="flex-1 flex flex-col lg:flex-row p-4 md:p-8 gap-8 max-w-7xl mx-auto w-full animate-in fade-in duration-700">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none px-3">{question.difficulty}</Badge>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border ${timeLeft < 15 ? 'border-red-500/50 text-red-500 bg-red-500/5 animate-pulse' : 'border-border'}`}>
                <Clock className="h-3.5 w-3.5" />
                00:{String(timeLeft).padStart(2, '0')}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`text-xs gap-2 ${isBookmarked ? 'text-yellow-500 bg-yellow-500/5' : 'opacity-60'}`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? "Bookmarked" : "Review Later"}
            </Button>
          </div>

          <Card className={`border-none shadow-2xl ${theme === 'dark' ? 'bg-card/40 backdrop-blur-xl ring-1 ring-white/10' : 'bg-white ring-1 ring-gray-200'} overflow-hidden`}>
            <div className={`h-1 w-full ${theme === 'dark' ? 'bg-muted/30' : 'bg-gray-200'}`}> 
              <div className={`h-full bg-primary transition-all duration-1000`} style={{ width: `${(timeLeft/60)*100}%` }} />
            </div>
            <CardHeader className="pt-8 px-8">
              <CardTitle className={`text-2xl md:text-3xl font-semibold leading-snug tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}> 
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-4">
              <div className="grid gap-3">
                {question.options.map((opt, idx) => {
                  const isCorrect = showResult && idx === question.answer;
                  const isWrong = showResult && selected === idx && selected !== question.answer;
                  return (
                    <button
                      key={idx}
                      disabled={showResult}
                      onClick={() => handleOptionClick(idx)}
                      className={`
                        group flex items-center p-4 rounded-xl border-2 transition-all duration-200 text-left
                        ${selected === idx ? (theme === 'dark' ? 'border-primary bg-primary/5 shadow-lg translate-x-1' : 'border-primary bg-primary/10 shadow-lg translate-x-1') : (theme === 'dark' ? 'border-white/5 bg-white/5 hover:border-primary/40' : 'border-gray-200 bg-gray-50 hover:border-primary/40')}
                        ${isCorrect ? 'border-green-500 bg-green-500/10 text-green-600' : ''}
                        ${isWrong ? 'border-red-500 bg-red-500/10 text-red-600' : ''}
                      `}
                    >
                      <div className={`h-8 w-8 rounded-lg border flex items-center justify-center mr-4 text-xs font-bold transition-all
                        ${selected === idx ? 'bg-primary text-white scale-110' : (theme === 'dark' ? 'bg-muted/50 text-muted-foreground' : 'bg-gray-200 text-gray-700')}
                      `}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className={`flex-1 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{opt}</span>
                      {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                      {showResult && isWrong && <XCircle className="h-5 w-5 text-red-500" />}
                    </button>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div className={`pt-8 flex justify-between items-center border-t mt-6 ${theme === 'dark' ? 'border-white/5' : 'border-gray-200'}`}>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                  <Keyboard className="h-3 w-3 mr-1" /> Use 1-4 to select
                </div>
                {!showResult ? (
                  <Button onClick={handleNext} disabled={selected === null} className={`px-10 h-11 font-bold shadow-lg shadow-primary/20 ${theme === 'dark' ? 'bg-primary hover:bg-primary/90' : 'bg-primary text-white hover:bg-primary/90'}`}>
                    Check Answer
                  </Button>
                ) : (
                  <Button onClick={handleContinue} className={`px-10 h-11 font-bold shadow-xl ${theme === 'dark' ? 'bg-white text-black hover:bg-slate-200' : 'bg-primary text-white hover:bg-primary/90'}`}>
                    Next Question <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          {showResult && (
            <div className="animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2 mb-3 text-primary font-bold text-sm uppercase tracking-wider">
                <AlertCircle className="h-4 w-4" /> Explanation
              </div>
              <p className="text-muted-foreground leading-relaxed p-4 bg-white/5 rounded-xl border border-white/5">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
        <div className="w-full lg:w-80 space-y-6">
          <Tabs defaultValue="tools" className="w-full">
            <TabsList className="w-full bg-white/5 border border-white/10 p-1 h-12">
              <TabsTrigger value="tools" className="flex-1 gap-2"><PenTool className="h-4 w-4" /> Tools</TabsTrigger>
              <TabsTrigger value="stats" className="flex-1 gap-2"><Zap className="h-4 w-4" /> Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex-col h-20 gap-2 border-white/5 hover:bg-white/5">
                  <Calculator className="h-5 w-5 opacity-70" />
                  <span className="text-[10px] uppercase font-bold">Calculator</span>
                </Button>
                <Button variant="outline" className="flex-col h-20 gap-2 border-white/5 hover:bg-white/5">
                  <Info className="h-5 w-5 opacity-70" />
                  <span className="text-[10px] uppercase font-bold">Scratchpad</span>
                </Button>
              </div>
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex gap-3">
                <Lightbulb className="h-5 w-5 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground leading-tight italic">
                  Tip: Look for the most optimal complexity if multiple answers seem "correct".
                </p>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-4 space-y-4">
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                    <div className="text-2xl font-bold">{score}</div>
                    <div className="text-[10px] uppercase text-muted-foreground font-bold">Score</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                    <div className="text-2xl font-bold">{totalQuestions - current}</div>
                    <div className="text-[10px] uppercase text-muted-foreground font-bold">Remaining</div>
                  </div>
               </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground px-1">Navigation</h4>
            <div className="grid grid-cols-5 gap-2">
              {QUIZ_QUESTIONS.map((_, i) => (
                <div 
                  key={i}
                  className={`h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold border transition-all
                    ${current === i ? "border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" : "border-white/5 bg-white/5 opacity-40"}
                    ${i < current ? "bg-green-500/10 border-green-500/30 text-green-500 opacity-100" : ""}
                  `}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsZenMode(!isZenMode)}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-xl gap-2 bg-background"
        >
        {isZenMode ? <Maximize2 className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        {isZenMode ? "Exit Focus" : "Focus Mode"}
        </Button>
    </div>
  );
}