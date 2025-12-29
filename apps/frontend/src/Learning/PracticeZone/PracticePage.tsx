import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import {
  Brain,
  Code2,
  Layers,
  Puzzle,
  ArrowRight,
} from "lucide-react";

const PRACTICE_MODULES = [
  {
    id: "aptitude",
    title: "Aptitude",
    description:
      "Improve quantitative aptitude, reasoning, and problem-solving skills.",
    icon: Brain,
    tags: ["Quant", "Math", "Reasoning"],
    link: "/learning/practice/aptitude",
  },
  {
    id: "coding",
    title: "Coding Practice",
    description:
      "Practice coding problems and improve your programming skills.",
    icon: Code2,
    tags: ["C++", "Java", "Python"],
    link: "/learning/practice/coding",
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description:
      "Master arrays, linked lists, trees, graphs, and algorithms.",
    icon: Layers,
    tags: ["DSA", "Algorithms"],
    link: "/learning/practice/dsa",
  },
  {
    id: "logic",
    title: "Logical Reasoning",
    description:
      "Enhance logical thinking and analytical reasoning ability.",
    icon: Puzzle,
    tags: ["Logic", "Puzzles"],
    link: "/learning/practice/logical-reasoning",
  },
];

export default function PracticePage() {
  const navigate = useNavigate();

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Practice Zone
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl flex justify-center text-center mx-auto">
          Strengthen your fundamentals by solving curated problems designed
          for interviews, placements, and real-world problem solving.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRACTICE_MODULES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => navigate(item.link)}
              className="group border rounded-xl p-6 cursor-pointer 
                         hover:shadow-xl transition-all bg-background"
            >
              {/* Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold">{item.title}</h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground mt-2">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* CTA */}
              <Button
                variant="ghost"
                className="mt-5 w-full justify-between"
              >
                Start Practicing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
