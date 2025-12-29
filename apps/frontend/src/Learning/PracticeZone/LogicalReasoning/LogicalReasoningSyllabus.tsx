import { useState } from "react";
import { Puzzle, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LOGIC_SECTIONS = [
  {
    section: "Verbal Reasoning",
    description: "Test your ability to understand and reason using concepts framed in words.",
    topics: [
      { title: "Analogies", link: "/learning/practice/logical-reasoning/analogies" },
      { title: "Series Completion", link: "/learning/practice/logical-reasoning/series-completion" },
      { title: "Blood Relations", link: "/learning/practice/logical-reasoning/blood-relations" },
      { title: "Logical Sequence of Words", link: "/learning/practice/logical-reasoning/logical-sequence" },
    ],
  },
  {
    section: "Non-Verbal Reasoning",
    description: "Solve problems using visual and spatial reasoning.",
    topics: [
      { title: "Pattern Completion", link: "/learning/practice/logical-reasoning/pattern-completion" },
      { title: "Figure Series", link: "/learning/practice/logical-reasoning/figure-series" },
      { title: "Mirror & Water Images", link: "/learning/practice/logical-reasoning/mirror-water-images" },
    ],
  },
  {
    section: "Analytical Reasoning",
    description: "Sharpen your analytical and critical thinking skills.",
    topics: [
      { title: "Seating Arrangement", link: "/learning/practice/logical-reasoning/seating-arrangement" },
      { title: "Puzzles", link: "/learning/practice/logical-reasoning/puzzles" },
      { title: "Syllogism", link: "/learning/practice/logical-reasoning/syllogism" },
      { title: "Data Sufficiency", link: "/learning/practice/logical-reasoning/data-sufficiency" },
    ],
  },
  {
    section: "Critical Reasoning",
    description: "Evaluate arguments and draw logical conclusions.",
    topics: [
      { title: "Statement & Assumptions", link: "/learning/practice/logical-reasoning/statement-assumptions" },
      { title: "Statement & Conclusions", link: "/learning/practice/logical-reasoning/statement-conclusions" },
      { title: "Cause & Effect", link: "/learning/practice/logical-reasoning/cause-effect" },
    ],
  },
];

export default function LogicalReasoningSyllabus() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggle = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-primary/10 shadow">
          <Puzzle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-left">
            Logical Reasoning Syllabus
          </h1>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Expand a section to see topics and start practicing.
          </p>
        </div>
      </div>
      <div className="w-full bg-background rounded-2xl border p-4 shadow-sm">
        {LOGIC_SECTIONS.map((section) => (
          <div key={section.section} className="mb-3">
            <div
              className="flex items-center cursor-pointer rounded-lg px-4 py-3 hover:bg-primary/10 transition group"
              onClick={() => handleToggle(section.section)}
              tabIndex={0}
              aria-expanded={openSection === section.section}
            >
              {openSection === section.section ? (
                <ChevronDown className="h-5 w-5 text-primary mr-2 transition-transform group-hover:scale-110" />
              ) : (
                <ChevronRight className="h-5 w-5 text-primary mr-2 transition-transform group-hover:scale-110" />
              )}
              <span className="text-base font-semibold">{section.section}</span>
              <span className="ml-3 text-xs text-muted-foreground font-normal">{section.description}</span>
            </div>
            {openSection === section.section && (
              <div className="bg-muted/60 rounded-lg mt-2 mx-4 p-4 animate-fade-in shadow">
                <ul className="space-y-2">
                  {section.topics.map((topic) => (
                    <li
                      key={topic.title}
                      className="flex items-center gap-2 group cursor-pointer hover:bg-primary/10 rounded px-3 py-2 transition"
                      onClick={() => navigate(topic.link)}
                    >
                      <span className="inline-block w-2 h-2 rounded-full bg-primary group-hover:bg-primary/80 transition" />
                      <span className="text-sm text-primary group-hover:underline">{topic.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}