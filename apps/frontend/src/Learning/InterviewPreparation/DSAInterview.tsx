import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  Code,
  Target,
  TrendingUp,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Crown,
} from "lucide-react";

// Mock data
const TOP_TECH_QUESTIONS = {
  totalQuestions: 500,
  freeQuestions: 10,
  description: "Practice coding questions from top tech companies like Google, Amazon, Microsoft, Meta, and more"
};

// Mock questions list
const QUESTIONS = [
  { id: "q1", title: "Two Sum", difficulty: "Easy", company: "Top Tech" },
  { id: "q2", title: "Reverse Linked List", difficulty: "Easy", company: "Top Tech" },
  { id: "q3", title: "Valid Parentheses", difficulty: "Easy", company: "Top Tech" },
  { id: "q4", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", company: "Top Tech" },
  { id: "q5", title: "Maximum Subarray", difficulty: "Medium", company: "Top Tech" },
  { id: "q6", title: "Product of Array Except Self", difficulty: "Medium", company: "Top Tech" },
  { id: "q7", title: "3Sum", difficulty: "Medium", company: "Top Tech" },
  { id: "q8", title: "Merge Intervals", difficulty: "Medium", company: "Top Tech" },
  { id: "q9", title: "Longest Palindromic Substring", difficulty: "Medium", company: "Top Tech" },
  { id: "q10", title: "Container With Most Water", difficulty: "Medium", company: "Top Tech" },
];

export default function DSAInterviewPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-[1800px] mx-auto px-6 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 shadow-lg">
                <Code className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-blue-500/15 to-cyan-500/15 text-blue-600 border-0 shadow-lg">
              <Target className="h-4 w-4 mr-2" />
              DSA Interview Preparation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Master DSA Interviews
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Prepare for technical interviews with top tech company coding questions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12 space-y-12">
        {/* Premium Notification Banner */}
        <Card className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-pink-500/10 border-2 border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                <Crown className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">Unlock Full Access with Premium</h3>
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                    Premium
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Get access to all {TOP_TECH_QUESTIONS.totalQuestions}+ top tech company questions with detailed solutions, hints, and multiple approaches. Premium members also get priority support and exclusive features.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>All questions unlocked</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Full detailed solutions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Multiple solution approaches</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Exclusive mock interviews</span>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/premium/premium-questions")}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Code className="h-6 w-6 text-blue-500" />
                Practice Questions
              </h2>
              <p className="text-muted-foreground mt-1">
                {QUESTIONS.length} free questions available
              </p>
            </div>
          </div>

          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="space-y-3 mb-6">
                {QUESTIONS.map((question, index) => (
                  <div
                    key={question.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/learning/interview/dsa/question/${question.id}`)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-blue-500 transition-colors">
                          {question.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              question.difficulty === "Easy"
                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                : question.difficulty === "Medium"
                                ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                            }`}
                          >
                            {question.difficulty}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{question.company}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>

              {/* Upgrade Button */}
              <div className="pt-6 border-t border-border/40">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-pink-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                      <Crown className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Want More Questions?</h4>
                      <p className="text-sm text-muted-foreground">
                        Unlock {TOP_TECH_QUESTIONS.totalQuestions}+ questions with full solutions
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate("/premium/premium-questions")}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:opacity-90"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Report Section */}
        <Card className="bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-transparent border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-500" />
              Performance Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-3xl font-bold text-blue-500 mb-1">45%</div>
                <div className="text-sm text-muted-foreground">Overall Accuracy</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-3xl font-bold text-green-500 mb-1">120</div>
                <div className="text-sm text-muted-foreground">Questions Solved</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-3xl font-bold text-yellow-500 mb-1">3</div>
                <div className="text-sm text-muted-foreground">Mock Interviews</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background">
                <div className="text-3xl font-bold text-purple-500 mb-1">8</div>
                <div className="text-sm text-muted-foreground">Topics Mastered</div>
              </div>
            </div>
            <Button className="w-full mt-6" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

