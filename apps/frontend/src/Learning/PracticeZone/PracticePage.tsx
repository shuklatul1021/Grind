import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import { Brain, Code2, Layers, Puzzle, ArrowRight, Target } from "lucide-react";

const PRACTICE_MODULES = [
  {
    id: "aptitude",
    title: "Aptitude",
    description:
      "Improve quantitative aptitude, reasoning, and problem-solving skills.",
    icon: Brain,
    tags: ["Quant", "Math", "Reasoning"],
    link: "/learning/practice/aptitude",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500",
  },
  {
    id: "coding",
    title: "Coding Practice",
    description:
      "Practice coding problems and improve your programming skills.",
    icon: Code2,
    tags: ["C++", "Java", "Python"],
    link: "/learning/practice/coding",
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-500",
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description: "Master arrays, linked lists, trees, graphs, and algorithms.",
    icon: Layers,
    tags: ["DSA", "Algorithms"],
    link: "/learning/practice/dsa",
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500",
  },
  {
    id: "logic",
    title: "Logical Reasoning",
    description: "Enhance logical thinking and analytical reasoning ability.",
    icon: Puzzle,
    tags: ["Logic", "Puzzles"],
    link: "/learning/practice/logical-reasoning",
    color: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-500",
  },
];

export default function PracticePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-[1800px] mx-auto px-6 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-blue-500/15 to-cyan-500/15 text-blue-600 border-0 shadow-lg">
              <Target className="h-4 w-4 mr-2" />
              Practice Zone
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Practice Zone
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Strengthen your fundamentals by solving curated problems designed
              for interviews, placements, and real-world problem solving.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRACTICE_MODULES.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                onClick={() => navigate(item.link)}
                className="group border-border/40 cursor-pointer hover:border-blue-500/50 transition-all hover:shadow-xl overflow-hidden"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Icon Header */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${item.color} border border-border/20`}
                    >
                      <Icon className={`h-6 w-6 ${item.iconColor}`} />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-blue-500 transition-all" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold group-hover:text-blue-500 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-border/40 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant="ghost"
                    className="w-full justify-between mt-4 group-hover:bg-blue-500/10 group-hover:text-blue-600"
                  >
                    <span>Start Practicing</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <Card className="border-border/40 bg-gradient-to-br from-blue-500/5 to-transparent">
            <CardContent className="p-6 text-center space-y-2">
              <div className="text-3xl font-bold text-blue-500">1000+</div>
              <div className="text-sm text-muted-foreground">
                Practice Questions
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-gradient-to-br from-green-500/5 to-transparent">
            <CardContent className="p-6 text-center space-y-2">
              <div className="text-3xl font-bold text-green-500">50+</div>
              <div className="text-sm text-muted-foreground">
                Topics Covered
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-gradient-to-br from-purple-500/5 to-transparent">
            <CardContent className="p-6 text-center space-y-2">
              <div className="text-3xl font-bold text-purple-500">10K+</div>
              <div className="text-sm text-muted-foreground">
                Students Learning
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
