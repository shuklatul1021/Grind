import { useState } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/ui/tooltip";
import { 
  Lightbulb, User, MessageCircle, Smile, EyeOff, Maximize2, Info
} from "lucide-react";

const HR_SECTIONS = [
  {
    title: "What is the HR Round?",
    icon: <User className="h-5 w-5" />,
    badge: "Overview",
    description: "The evaluation of personality and cultural fit.",
    content: (
      <p className="leading-relaxed">
        The HR (Human Resources) round is the final step in most interview processes. It evaluates your personality, communication, attitude, and cultural fit for the company.
      </p>
    )
  },
  {
    title: "Common HR Questions",
    icon: <MessageCircle className="h-5 w-5" />,
    badge: "Questions",
    description: "Prepare for the most frequent queries.",
    content: (
      <ul className="space-y-3">
        {["Tell me about yourself.", "Why do you want to join our company?", "What are your strengths and weaknesses?", "Where do you see yourself in 5 years?", "Why should we hire you?"].map((q, i) => (
          <li key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
            <span className="text-xs font-bold text-primary bg-primary/10 h-5 w-5 flex items-center justify-center rounded-full mt-0.5">{i + 1}</span>
            <span className="font-medium text-sm">{q}</span>
          </li>
        ))}
      </ul>
    )
  },
  {
    title: "Tips for Success",
    icon: <Smile className="h-5 w-5" />,
    badge: "Tips",
    description: "How to stand out in the conversation.",
    content: (
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Listen carefully and answer thoughtfully.</li>
        <li>Be confident, but not arrogant.</li>
        <li>Highlight your soft skills and teamwork.</li>
        <li>Share real-life examples and experiences.</li>
      </ul>
    )
  }
];

export default function HrRoundInteractive() {
  const [activeTab, setActiveTab] = useState(0);
  const [isZenMode, setIsZenMode] = useState(false);

  const section = HR_SECTIONS[activeTab];

  return (
    <div className={`flex h-screen w-full transition-colors duration-500 ${isZenMode ? "bg-background" : "bg-muted/20"}`}>

      <aside className={`w-16 flex flex-col items-center py-6 gap-4 border-r bg-background transition-transform ${isZenMode ? "-translate-x-full absolute" : "relative"}`}>
        
        <TooltipProvider delayDuration={0}>
          {HR_SECTIONS.map((item, idx) => (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab(idx)}
                  className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all
                    ${activeTab === idx 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  {item.icon}
                  {activeTab === idx && (
                    <div className="absolute -left-0.5 h-6 w-1 rounded-r-full bg-primary" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs font-bold">{item.title}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative">
        {/* ZEN TOGGLE */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsZenMode(!isZenMode)}
          className="fixed bottom-6 right-6 z-50 rounded-full shadow-xl gap-2 bg-background"
        >
          {isZenMode ? <Maximize2 className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {isZenMode ? "Exit Focus" : "Focus Mode"}
        </Button>

        <div className="max-w-5xl mx-auto p-8 lg:p-12">
          {/* HEADER SECTION */}
          {!isZenMode && (
            <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
              <Badge variant="outline" className="mb-4 px-3 py-1 text-primary border-primary/20 bg-primary/5">
                {section.badge}
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{section.title}</h1>
              <p className="text-muted-foreground mt-4 text-lg">{section.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT: Content Card (Quiz-like) */}
            <div className="lg:col-span-7">
              <Card className="border-none shadow-2xl shadow-primary/5 overflow-hidden">
                <div className="h-1.5 w-full bg-primary/10">
                  <div 
                    className="h-full bg-primary transition-all duration-700" 
                    style={{ width: `${((activeTab + 1) / HR_SECTIONS.length) * 100}%` }} 
                  />
                </div>
                <CardContent className="p-8 min-h-[400px]">
                  {section.content}
                </CardContent>
              </Card>
            </div>

            {/* RIGHT: Quick Tips / Insights */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="bg-primary/5 border-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    Expert Insight
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-4">
                  <div className="flex gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <p>Be yourself and stay calm. Authenticity is the most valued trait in HR rounds.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <p>Prepare "STARR" stories (Situation, Task, Action, Result, Reflection) for every answer.</p>
                  </div>
                </CardContent>
              </Card>

              <div className="p-6 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                <Info className="h-6 w-6 text-muted-foreground" />
                <p className="text-xs font-medium max-w-[200px]">
                  Click the square icons on the left to navigate through all HR preparation topics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}