import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Briefcase, FileText, Users, ArrowRight } from "lucide-react";

const CAREER_MODULES = [
  {
    id: "resume",
    title: "Resume Building",
    description:
      "Learn how to create an ATS-friendly resume.",
    icon: FileText,
    tags: ["Resume", "ATS"],
    link: "/learning/career/resume",
  },
  {
    id: "hr",
    title: "HR Interview",
    description:
      "Prepare common HR questions and best answers.",
    icon: Users,
    tags: ["HR", "Communication"],
    link: "/learning/career/hr",
  },
  {
    id: "growth",
    title: "Career Guidance",
    description:
      "Get guidance on career paths and industry trends.",
    icon: Briefcase,
    tags: ["Career", "Growth"],
    link: "/learning/career/growth",
  },
];

export default function CareerGrowthPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold">Career Growth</h1>
      <p className="text-muted-foreground mt-2">
        Build your career with guidance, skills, and confidence.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {CAREER_MODULES.map((item) => {
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
                Explore
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
