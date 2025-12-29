import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Briefcase, Code, MessageSquare, ArrowRight } from "lucide-react";

const INTERVIEW_MODULES = [
  {
    id: "dsa-interview",
    title: "DSA Interview",
    description:
      "Prepare data structures and algorithms questions asked in interviews.",
    icon: Code,
    tags: ["Arrays", "Trees", "Graphs"],
    link: "/learning/interview/dsa",
  },
  {
    id: "coding-round",
    title: "Coding Round",
    description:
      "Practice real interview coding questions with test cases.",
    icon: Briefcase,
    tags: ["Problem Solving", "Logic"],
    link: "/learning/interview/coding",
  },
  {
    id: "hr-round",
    title: "HR & Behavioral",
    description:
      "Prepare HR questions, communication, and behavioral answers.",
    icon: MessageSquare,
    tags: ["HR", "Communication"],
    link: "/learning/interview/hr",
  },
];

export default function InterviewPreparationPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold">Interview Preparation</h1>
      <p className="text-muted-foreground mt-2">
        Get ready for technical and HR interviews with structured preparation.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {INTERVIEW_MODULES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => navigate(item.link)}
              className="group border rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
            >
              <div className="flex justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition" />
              </div>

              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button variant="ghost" className="mt-5 w-full">
                Start Preparation
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
