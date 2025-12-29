import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { BookOpen, Database, ArrowRight, CpuIcon, Network, Computer, Workflow } from "lucide-react";

const CONCEPT_MODULES = [
  {
    id: "cs",
    title: "Computer Science Basics",
    description:
      "Learn fundamentals of computer science from scratch.",
    icon: BookOpen,
    tags: ["CS", "Fundamentals"],
    link: "/learning/concepts/cs",
  },
  {
    id: "oops",
    title: "Object-Oriented Programming",
    description:
      "Understand OOPS concepts with real-world examples.",
    icon: Workflow,
    tags: ["OOPS", "Design"],
    link: "/learning/concepts/oops",
  },
  {
    id: "dbms",
    title: "DBMS",
    description:
      "Learn databases, SQL, and normalization concepts.",
    icon: Database,
    tags: ["DBMS", "SQL"],
    link: "/learning/concepts/dbms",
  },
  {
    id: "os",
    title: "Operating Systems",
    description:
      "Learn about processes, memory management, and file systems.",
    icon: CpuIcon,
    tags: ["OS", "Systems"],
    link: "/learning/concepts/os",
  },
  {
    id: "networks",
    title: "Computer Networks",
    description:
      "Understand the basics of networking, protocols, and communication.",
    icon: Network,
    tags: ["Networks", "Communication"],
    link: "/learning/concepts/networks",
  },
  {
    id : "computer-architecture",
    title: "Computer Architecture",
    description: 
      "Learn about CPU, memory hierarchy, and instruction sets.",
    icon: Computer,
    tags: ["Architecture", "Hardware"],
    link: "/learning/concepts/computer-architecture",
  }
];

export default function ConceptLearningPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold">Concept Learning</h1>
      <p className="text-muted-foreground mt-2">
        Strengthen your core computer science concepts.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {CONCEPT_MODULES.map((item) => {
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
                Start Learning
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
