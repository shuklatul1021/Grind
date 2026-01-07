import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import {
  BookOpen,
  Database,
  ArrowRight,
  CpuIcon,
  Network,
  Computer,
  Workflow,
  GraduationCap,
  Target,
  Users,
  TrendingUp,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const CONCEPT_MODULES = [
  {
    id: "cs",
    title: "Computer Science Basics",
    description:
      "Learn fundamentals of computer science from scratch with comprehensive tutorials.",
    icon: BookOpen,
    tags: ["CS", "Fundamentals", "Basics"],
    link: "/learning/concepts/cs",
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    topics: "25+",
  },
  {
    id: "oops",
    title: "Object-Oriented Programming",
    description:
      "Master OOPS concepts with real-world examples and practical implementations.",
    icon: Workflow,
    tags: ["OOPS", "Design", "Patterns"],
    link: "/learning/concepts/oops",
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    topics: "30+",
  },
  {
    id: "dbms",
    title: "DBMS",
    description:
      "Learn databases, SQL queries, normalization, and transaction management.",
    icon: Database,
    tags: ["DBMS", "SQL", "Normalization"],
    link: "/learning/concepts/dbms",
    color: "from-green-500 to-emerald-500",
    bgGradient: "from-green-500/10 to-emerald-500/10",
    topics: "35+",
  },
  {
    id: "os",
    title: "Operating Systems",
    description:
      "Understand processes, threads, memory management, and file systems in depth.",
    icon: CpuIcon,
    tags: ["OS", "Systems", "Processes"],
    link: "/learning/concepts/os",
    color: "from-orange-500 to-red-500",
    bgGradient: "from-orange-500/10 to-red-500/10",
    topics: "40+",
  },
  {
    id: "networks",
    title: "Computer Networks",
    description:
      "Master networking fundamentals, protocols, OSI model, and communication systems.",
    icon: Network,
    tags: ["Networks", "Protocols", "Communication"],
    link: "/learning/concepts/networks",
    color: "from-teal-500 to-cyan-500",
    bgGradient: "from-teal-500/10 to-cyan-500/10",
    topics: "30+",
  },
  {
    id: "computer-architecture",
    title: "Computer Architecture",
    description:
      "Deep dive into CPU design, memory hierarchy, instruction sets, and pipelining.",
    icon: Computer,
    tags: ["Architecture", "Hardware", "CPU"],
    link: "/learning/concepts/computer-architecture",
    color: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-500/10 to-purple-500/10",
    topics: "28+",
  },
];

export default function ConceptLearningPage() {
  const navigate = useNavigate();

  const totalTopics = CONCEPT_MODULES.reduce(
    (acc, module) => acc + parseInt(module.topics),
    0
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-[1800px] mx-auto px-6 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 shadow-lg">
                <GraduationCap className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-blue-500/15 to-indigo-500/15 text-blue-600 border-0 shadow-lg">
              <Target className="h-4 w-4 mr-2" />
              Concept Learning
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Concept Learning
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Strengthen your core computer science concepts with in-depth tutorials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <Card className="border-border/40 bg-gradient-to-br from-blue-500/5 to-transparent">
              <CardContent className="p-6 text-center space-y-2">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-3xl font-bold text-blue-500">
                  {CONCEPT_MODULES.length}
                </div>
                <div className="text-sm text-muted-foreground">Core Subjects</div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-gradient-to-br from-indigo-500/5 to-transparent">
              <CardContent className="p-6 text-center space-y-2">
                <Target className="h-8 w-8 mx-auto mb-2 text-indigo-500" />
                <div className="text-3xl font-bold text-indigo-500">{totalTopics}+</div>
                <div className="text-sm text-muted-foreground">Topics Covered</div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-gradient-to-br from-purple-500/5 to-transparent">
              <CardContent className="p-6 text-center space-y-2">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-3xl font-bold text-purple-500">40K+</div>
                <div className="text-sm text-muted-foreground">Active Learners</div>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-gradient-to-br from-pink-500/5 to-transparent">
              <CardContent className="p-6 text-center space-y-2">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-pink-500" />
                <div className="text-3xl font-bold text-pink-500">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12">
        {/* Why Learn Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Why Master CS Fundamentals?</h2>
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
                      Build Strong Foundation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Essential concepts for technical interviews and career
                      growth
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
                    <h3 className="font-semibold mb-1">Real-World Examples</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn with practical examples and industry applications
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
                    <h3 className="font-semibold mb-1">
                      Structured Learning Path
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Follow curated curriculum from basics to advanced topics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Concept Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Choose Your Subject</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONCEPT_MODULES.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  onClick={() => navigate(item.link)}
                  className="group cursor-pointer border-2 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${item.color}`} />

                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`p-4 rounded-xl bg-gradient-to-r ${item.bgGradient}`}
                      >
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:translate-x-2 group-hover:text-primary transition-all duration-300" />
                    </div>

                    <h3
                      className={`text-xl font-bold mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                    >
                      {item.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 min-h-[60px]">
                      {item.description}
                    </p>

                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${item.bgGradient} mb-4`}
                    >
                      <Target className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {item.topics} Topics
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
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Success Stats */}
        <Card className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-2">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                Join the Learning Revolution
              </h2>
              <p className="text-muted-foreground">
                Thousands of students have mastered CS fundamentals with our
                platform
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {CONCEPT_MODULES.length}
                </p>
                <p className="text-sm text-muted-foreground">Core Subjects</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                <p className="text-4xl font-bold text-indigo-600 mb-2">
                  {totalTopics}+
                </p>
                <p className="text-sm text-muted-foreground">Topics</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                <p className="text-4xl font-bold text-purple-600 mb-2">40K+</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                <p className="text-4xl font-bold text-pink-600 mb-2">98%</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
