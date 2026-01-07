import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
  Brain,
  Target,
  BookOpen,
  TrendingUp,
  ChevronRight,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@repo/ui/card";

const APTITUDE_TOPICS = [
  {
    title: "Number Series",
    description: "Identify patterns and predict the next number in a sequence.",
    difficulty: "Easy",
    link: "/learning/practice/aptitude/topic?topic=number-series",
    progress: 65,
    easyQuestions: 15,
    mediumQuestions: 10,
    hardQuestions: 5,
  },
  {
    title: "Percentages",
    description: "Calculate percentage increases, decreases, and comparisons.",
    difficulty: "Easy",
    link: "/learning/practice/aptitude/topic?topic=percentages",
    progress: 40,
    easyQuestions: 20,
    mediumQuestions: 12,
    hardQuestions: 8,
  },
  {
    title: "Time & Work",
    description: "Solve problems involving work rates and time management.",
    difficulty: "Medium",
    link: "/learning/practice/aptitude/topic?topic=time-work",
    progress: 30,
    easyQuestions: 10,
    mediumQuestions: 15,
    hardQuestions: 10,
  },
  {
    title: "Probability",
    description:
      "Understand basic probability concepts and solve related problems.",
    difficulty: "Medium",
    link: "/learning/practice/aptitude/topic?topic=probability",
    progress: 20,
    easyQuestions: 8,
    mediumQuestions: 12,
    hardQuestions: 10,
  },
  {
    title: "Averages",
    description: "Find averages and solve weighted average problems.",
    difficulty: "Easy",
    link: "/learning/practice/aptitude/topic?topic=averages",
    progress: 0,
    easyQuestions: 18,
    mediumQuestions: 10,
    hardQuestions: 7,
  },
  {
    title: "Profit & Loss",
    description: "Calculate profit, loss, and related percentages.",
    difficulty: "Easy",
    link: "/learning/practice/aptitude/topic?topic=profit-loss",
    progress: 0,
    easyQuestions: 22,
    mediumQuestions: 15,
    hardQuestions: 8,
  },
  {
    title: "Ratio & Proportion",
    description:
      "Solve problems involving ratios and proportional relationships.",
    difficulty: "Medium",
    link: "/learning/practice/aptitude/topic?topic=ratio-proportion",
    progress: 0,
    easyQuestions: 12,
    mediumQuestions: 18,
    hardQuestions: 10,
  },
  {
    title: "Simple & Compound Interest",
    description: "Calculate interest earned or paid over time.",
    difficulty: "Medium",
    link: "/learning/practice/aptitude/topic?topic=interest",
    progress: 0,
    easyQuestions: 10,
    mediumQuestions: 14,
    hardQuestions: 11,
  },
  {
    title: "Time, Speed & Distance",
    description: "Solve questions on travel, speed, and time.",
    difficulty: "Medium",
    link: "/learning/practice/aptitude/topic?topic=time-speed-distance",
    progress: 0,
    easyQuestions: 15,
    mediumQuestions: 20,
    hardQuestions: 12,
  },
  {
    title: "Mixtures & Alligations",
    description: "Handle problems involving mixing substances or solutions.",
    difficulty: "Medium",
    link: "/learning/practice/aptitude/topic?topic=mixtures-alligations",
    progress: 0,
    easyQuestions: 8,
    mediumQuestions: 12,
    hardQuestions: 10,
  },
  {
    title: "Permutations & Combinations",
    description: "Count arrangements and selections in various scenarios.",
    difficulty: "Hard",
    link: "/learning/practice/aptitude/topic?topic=permutations-combinations",
    progress: 0,
    easyQuestions: 5,
    mediumQuestions: 10,
    hardQuestions: 15,
  },
  {
    title: "Data Interpretation",
    description: "Analyze and interpret data from charts and tables.",
    difficulty: "Medium",
    link: "/learning/practice/aptitude/topic?topic=data-interpretation",
    progress: 0,
    easyQuestions: 10,
    mediumQuestions: 15,
    hardQuestions: 12,
  },
  {
    title: "Ages",
    description: "Solve age-related word problems.",
    difficulty: "Easy",
    link: "/learning/practice/aptitude/topic?topic=ages",
    progress: 0,
    easyQuestions: 16,
    mediumQuestions: 8,
    hardQuestions: 6,
  },
  {
    title: "Partnerships",
    description: "Calculate profit sharing in business partnerships.",
    difficulty: "Medium",
    link: "/learning/practice/aptitude/topic?topic=partnerships",
    progress: 0,
    easyQuestions: 9,
    mediumQuestions: 13,
    hardQuestions: 8,
  },
  {
    title: "Boats & Streams",
    description: "Solve problems involving movement in water.",
    difficulty: "Medium",
    link: "/learning/practice/aptitude/topic?topic=boats-streams",
    progress: 0,
    easyQuestions: 11,
    mediumQuestions: 16,
    hardQuestions: 9,
  },
  {
    title: "Pipes & Cisterns",
    description: "Work with rates of filling and emptying tanks.",
    difficulty: "Medium",
    link: "/learning/practice/aptitude/topic?topic=pipes-cisterns",
    progress: 0,
    easyQuestions: 10,
    mediumQuestions: 14,
    hardQuestions: 11,
  },
  {
    title: "Mensuration",
    description: "Calculate area, volume, and surface area of shapes.",
    difficulty: "Hard",
    link: "/learning/practice/aptitude/topic?topic=mensuration",
    progress: 0,
    easyQuestions: 6,
    mediumQuestions: 12,
    hardQuestions: 17,
  },
  {
    title: "Trains",
    description: "Solve problems involving trains and their speeds.",
    difficulty: "Medium",
    link: "/learning/practice/aptitude/topic?topic=trains",
    progress: 0,
    easyQuestions: 12,
    mediumQuestions: 17,
    hardQuestions: 11,
  },
  {
    title: "Calendar & Clocks",
    description: "Work with dates, days, and time calculations.",
    difficulty: "Easy",
    link: "/learning/practice/aptitude/topic?topic=calendar-clocks",
    progress: 0,
    easyQuestions: 14,
    mediumQuestions: 9,
    hardQuestions: 7,
  },
  {
    title: "Surds & Indices",
    description: "Simplify and calculate with surds and exponents.",
    difficulty: "Medium",
    link: "/learning/practice/aptitude/topic?topic=surds-indices",
    progress: 0,
    easyQuestions: 10,
    mediumQuestions: 13,
    hardQuestions: 9,
  },
  {
    title: "Logarithms",
    description: "Solve equations and problems using logarithms.",
    difficulty: "Medium",
    link: "/learning/practice/aptitude/topic?topic=logarithms",
    progress: 0,
    easyQuestions: 9,
    mediumQuestions: 12,
    hardQuestions: 10,
  },
];

export default function ApptitudeSyllabus() {
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

  const easyTopics = APTITUDE_TOPICS.filter((t) => t.difficulty === "Easy");
  const mediumTopics = APTITUDE_TOPICS.filter((t) => t.difficulty === "Medium");
  const hardTopics = APTITUDE_TOPICS.filter((t) => t.difficulty === "Hard");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-[1800px] mx-auto px-6 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 shadow-lg">
                <Brain className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-blue-500/15 to-cyan-500/15 text-blue-600 border-0 shadow-lg">
              <Target className="h-4 w-4 mr-2" />
              Aptitude
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Aptitude Syllabus
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master quantitative aptitude, reasoning, and mathematical
              problem-solving with our comprehensive topic collection.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <p className="text-muted-foreground">
            {APTITUDE_TOPICS.length} topics covering all essential aptitude
            concepts
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {APTITUDE_TOPICS.map((topic) => (
            <Card
              key={topic.title}
              className="group border-border/40 hover:border-blue-500/50 transition-all hover:shadow-lg"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-base group-hover:text-blue-500 transition-colors flex-1">
                    {topic.title}
                  </h3>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {topic.description}
                </p>
                
                {/* Progress Bar */}
                {topic.progress !== undefined && (
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-semibold">{topic.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${topic.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Questions Count */}
                {topic.easyQuestions !== undefined && (
                  <div className="flex gap-2 mb-3 text-xs text-muted-foreground">
                    <span>Easy: {topic.easyQuestions}</span>
                    <span>•</span>
                    <span>Medium: {topic.mediumQuestions}</span>
                    <span>•</span>
                    <span>Hard: {topic.hardQuestions}</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getDifficultyColor(topic.difficulty)}`}
                  >
                    {topic.difficulty}
                  </Badge>
                  <Button
                    size="sm"
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      topic.link && navigate(topic.link);
                    }}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <Card className="border-border/40 bg-gradient-to-br from-blue-500/5 to-transparent">
            <CardContent className="p-6 text-center space-y-2">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-3xl font-bold text-blue-500">
                {APTITUDE_TOPICS.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Topics</div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-gradient-to-br from-green-500/5 to-transparent">
            <CardContent className="p-6 text-center space-y-2">
              <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-3xl font-bold text-green-500">
                {easyTopics.length}
              </div>
              <div className="text-sm text-muted-foreground">Easy Topics</div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-gradient-to-br from-yellow-500/5 to-transparent">
            <CardContent className="p-6 text-center space-y-2">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-3xl font-bold text-yellow-500">
                {mediumTopics.length}
              </div>
              <div className="text-sm text-muted-foreground">Medium Topics</div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-gradient-to-br from-red-500/5 to-transparent">
            <CardContent className="p-6 text-center space-y-2">
              <Brain className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <div className="text-3xl font-bold text-red-500">
                {hardTopics.length}
              </div>
              <div className="text-sm text-muted-foreground">Hard Topics</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
