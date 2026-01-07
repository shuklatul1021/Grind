import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import {
  Briefcase,
  Code,
  MessageSquare,
  ArrowRight,
  Target,
  TrendingUp,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const INTERVIEW_MODULES = [
  {
    id: "dsa-interview",
    title: "DSA Interview",
    description:
      "Master data structures and algorithms questions asked in top tech companies.",
    icon: Code,
    tags: ["Arrays", "Trees", "Graphs", "Dynamic Programming"],
    link: "/learning/interview/dsa",
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    questions: "500+",
  },
  {
    id: "hr-behavioral",
    title: "HR & Behavioral",
    description:
      "Ace HR questions, behavioral interviews, and communication rounds with confidence.",
    icon: MessageSquare,
    tags: ["HR", "Communication", "Soft Skills"],
    link: "/learning/interview/hr",
    color: "from-orange-500 to-red-500",
    bgGradient: "from-orange-500/10 to-red-500/10",
    questions: "200+",
  },
];

export default function InterviewPreparationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-rose-700 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20" />

        <div className="relative max-w-[1800px] mx-auto px-6 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <Briefcase className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Interview Preparation
              </h1>
              <p className="text-white/90 text-lg mt-2">
                Get ready for technical and HR interviews with structured
                preparation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-white/10">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">3</p>
                    <p className="text-white/80 text-sm">Interview Modules</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-white/10">
                    <Code className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">1000+</p>
                    <p className="text-white/80 text-sm">Practice Questions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-white/10">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">25K+</p>
                    <p className="text-white/80 text-sm">Students Prepared</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-white/10">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">95%</p>
                    <p className="text-white/80 text-sm">Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12">
        {/* Key Features */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold">
              Why Choose Our Interview Prep?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Real Interview Questions
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Questions asked in top companies like Google, Microsoft,
                      Amazon
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Detailed Solutions</h3>
                    <p className="text-sm text-muted-foreground">
                      Step-by-step explanations with multiple approaches
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Track Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor your improvement and identify weak areas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Interview Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Choose Your Interview Track
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INTERVIEW_MODULES.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  onClick={() => navigate(item.link)}
                  className={`group cursor-pointer border-2 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden`}
                >
                  <div className={`h-2 bg-gradient-to-r ${item.color}`} />

                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`p-4 rounded-xl bg-gradient-to-r ${item.bgGradient}`}
                      >
                        <Icon
                          className="h-8 w-8 text-primary"
                        />
                      </div>
                      <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:translate-x-2 group-hover:text-primary transition-all duration-300" />
                    </div>

                    <h3
                      className={`text-2xl font-bold mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                    >
                      {item.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 min-h-[60px]">
                      {item.description}
                    </p>

                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${item.bgGradient} mb-4`}
                    >
                      <Code className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {item.questions} Questions
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      className={`w-full bg-gradient-to-r ${item.color} text-white hover:opacity-90 transition-opacity`}
                    >
                      Start Preparation
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Success Stats */}
        <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 border-2">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                Join Thousands of Successful Candidates
              </h2>
              <p className="text-muted-foreground">
                Our students have cracked interviews at top tech companies
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                <p className="text-4xl font-bold text-purple-600 mb-2">1000+</p>
                <p className="text-sm text-muted-foreground">Total Questions</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                <p className="text-4xl font-bold text-pink-600 mb-2">25K+</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                <p className="text-4xl font-bold text-rose-600 mb-2">95%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                <p className="text-4xl font-bold text-orange-600 mb-2">50+</p>
                <p className="text-sm text-muted-foreground">Companies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
