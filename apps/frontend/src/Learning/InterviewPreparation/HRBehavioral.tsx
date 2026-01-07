import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  MessageSquare,
  Users,
  Star,
  Lightbulb,
  Play,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Circle,
} from "lucide-react";

// Mock data
const COMMON_HR_QUESTIONS = [
  {
    id: "tell-me-about-yourself",
    question: "Tell me about yourself",
    category: "Introduction",
    difficulty: "Easy",
    tips: "Focus on your background, experience, and what makes you unique",
  },
  {
    id: "strengths",
    question: "What are your strengths?",
    category: "Self-Assessment",
    difficulty: "Easy",
    tips: "Be specific with examples from your experience",
  },
  {
    id: "weaknesses",
    question: "What are your weaknesses?",
    category: "Self-Assessment",
    difficulty: "Medium",
    tips: "Show self-awareness and how you're working on improvement",
  },
  {
    id: "why-company",
    question: "Why do you want to work here?",
    category: "Company Interest",
    difficulty: "Medium",
    tips: "Research the company and align your values with theirs",
  },
  {
    id: "where-see-yourself",
    question: "Where do you see yourself in 5 years?",
    category: "Career Goals",
    difficulty: "Medium",
    tips: "Show ambition while being realistic and aligned with the role",
  },
  {
    id: "salary-expectations",
    question: "What are your salary expectations?",
    category: "Compensation",
    difficulty: "Hard",
    tips: "Research market rates and be prepared to negotiate",
  },
];

const BEHAVIORAL_QUESTIONS = [
  {
    id: "conflict-resolution",
    question: "Tell me about a time you resolved a conflict",
    method: "STAR",
    difficulty: "Medium",
    examples: 3,
  },
  {
    id: "leadership",
    question: "Describe a situation where you showed leadership",
    method: "STAR",
    difficulty: "Medium",
    examples: 5,
  },
  {
    id: "failure",
    question: "Tell me about a time you failed and what you learned",
    method: "STAR",
    difficulty: "Hard",
    examples: 4,
  },
  {
    id: "teamwork",
    question: "Give an example of working in a team",
    method: "STAR",
    difficulty: "Easy",
    examples: 6,
  },
  {
    id: "challenge",
    question: "Describe a challenging project you worked on",
    method: "STAR",
    difficulty: "Medium",
    examples: 5,
  },
  {
    id: "achievement",
    question: "What is your greatest achievement?",
    method: "STAR",
    difficulty: "Easy",
    examples: 4,
  },
];

const MOCK_HR_INTERVIEWS = [
  {
    id: "mock-hr-1",
    title: "Standard HR Interview",
    duration: "30 min",
    questions: 10,
    completed: false,
  },
  {
    id: "mock-hr-2",
    title: "Behavioral Interview",
    duration: "45 min",
    questions: 8,
    completed: true,
  },
  {
    id: "mock-hr-3",
    title: "Executive Interview",
    duration: "60 min",
    questions: 12,
    completed: false,
  },
];

export default function HRBehavioralPage() {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Hard":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-[1800px] mx-auto px-6 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 shadow-lg">
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-orange-500/15 to-red-500/15 text-orange-600 border-0 shadow-lg">
              <Users className="h-4 w-4 mr-2" />
              HR & Behavioral Interview
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Ace Your HR Interview
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master common HR questions, behavioral interviews, and communication skills to stand out.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12 space-y-12">
        {/* Common HR Questions Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-orange-500" />
                Common HR Questions
              </h2>
              <p className="text-muted-foreground mt-1">
                Master the most frequently asked HR interview questions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMMON_HR_QUESTIONS.map((item) => (
              <Card
                key={item.id}
                className="group cursor-pointer hover:shadow-lg transition-all border-border/40"
                onClick={() => navigate(`/learning/interview/hr/question/${item.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {item.category}
                      </Badge>
                      <h3 className="text-base font-semibold mb-2">{item.question}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.tips}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getDifficultyColor(item.difficulty)}`}
                    >
                      {item.difficulty}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/learning/interview/hr/question/${item.id}`);
                      }}
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Behavioral Questions Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Star className="h-6 w-6 text-orange-500" />
                Behavioral Questions (STAR Method)
              </h2>
              <p className="text-muted-foreground mt-1">
                Answer behavioral questions using the STAR method (Situation, Task, Action, Result)
              </p>
            </div>
          </div>

          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">STAR Method Guide</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><strong>Situation:</strong> Set the context and background</li>
                  <li><strong>Task:</strong> Describe your responsibility</li>
                  <li><strong>Action:</strong> Explain what you did</li>
                  <li><strong>Result:</strong> Share the outcome and what you learned</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BEHAVIORAL_QUESTIONS.map((item) => (
              <Card
                key={item.id}
                className="group cursor-pointer hover:shadow-lg transition-all border-border/40"
                onClick={() => navigate(`/learning/interview/hr/behavioral/${item.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-600 border-purple-500/20">
                          STAR
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getDifficultyColor(item.difficulty)}`}
                        >
                          {item.difficulty}
                        </Badge>
                      </div>
                      <h3 className="text-base font-semibold mb-2">{item.question}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.examples} example answers
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/learning/interview/hr/behavioral/${item.id}`);
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Examples
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mock HR Interview Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Play className="h-6 w-6 text-orange-500" />
                Mock HR Interviews
              </h2>
              <p className="text-muted-foreground mt-1">
                Practice with simulated HR interview sessions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_HR_INTERVIEWS.map((interview) => (
              <Card
                key={interview.id}
                className="group cursor-pointer hover:shadow-lg transition-all border-border/40"
                onClick={() => navigate(`/learning/interview/hr/mock/${interview.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {interview.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <h3 className="text-lg font-semibold">{interview.title}</h3>
                      </div>
                      <div className="flex gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {interview.duration}
                        </span>
                        <span>•</span>
                        <span>{interview.questions} questions</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                  </div>

                  <Button
                    size="sm"
                    className="w-full"
                    variant={interview.completed ? "outline" : "default"}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/learning/interview/hr/mock/${interview.id}`);
                    }}
                  >
                    {interview.completed ? "Review Session" : "Start Interview"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feedback & Improvement Tips */}
        <Card className="bg-gradient-to-br from-orange-500/5 via-red-500/5 to-transparent border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-orange-500" />
              Feedback & Improvement Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Communication Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Speak clearly and confidently</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Maintain eye contact and positive body language</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Listen carefully before responding</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Ask thoughtful questions at the end</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Common Mistakes to Avoid</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Being too vague or generic in answers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Speaking negatively about previous employers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Not preparing questions to ask the interviewer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Failing to research the company beforehand</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

