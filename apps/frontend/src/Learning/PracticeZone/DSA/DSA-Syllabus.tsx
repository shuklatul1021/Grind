
import { useState } from "react";
import { Layers, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DSA_SECTIONS = [
  {
    section: "Basics & Complexity",
    description: "Time complexity, space complexity, and basic programming constructs.",
    topics: [
      { title: "Time Complexity & Space Complexity", link: "/learning/practice/dsa/time-space-complexity" },
      { title: "Bit Manipulation", link: "/learning/practice/dsa/bit-manipulation" },
      { title: "Mathematics", link: "/learning/practice/dsa/mathematics" },
      { title: "Recursion", link: "/learning/practice/dsa/recursion" },
    ],
  },
  {
    section: "Sorting & Searching",
    description: "Sorting algorithms and searching techniques.",
    topics: [
      { title: "Sorting Algorithms", link: "/learning/practice/dsa/sorting" },
      { title: "Binary Search", link: "/learning/practice/dsa/binary-search" },
    ],
  },
  {
    section: "Arrays",
    description: "1D and 2D arrays, sliding window, prefix sum, and more.",
    topics: [
      { title: "1D Arrays", link: "/learning/practice/dsa/arrays-1d" },
      { title: "2D Arrays", link: "/learning/practice/dsa/arrays-2d" },
      { title: "Sliding Window", link: "/learning/practice/dsa/sliding-window" },
      { title: "Prefix Sum", link: "/learning/practice/dsa/prefix-sum" },
    ],
  },
  {
    section: "Strings",
    description: "String manipulation, pattern matching, and related problems.",
    topics: [
      { title: "String Basics", link: "/learning/practice/dsa/strings-basics" },
      { title: "Pattern Matching", link: "/learning/practice/dsa/pattern-matching" },
    ],
  },
  {
    section: "Linked Lists",
    description: "Singly and doubly linked lists, cycle detection, and more.",
    topics: [
      { title: "Singly Linked List", link: "/learning/practice/dsa/singly-linked-list" },
      { title: "Doubly Linked List", link: "/learning/practice/dsa/doubly-linked-list" },
      { title: "Cycle Detection", link: "/learning/practice/dsa/cycle-detection" },
    ],
  },
];

export default function DSASyllabus() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggle = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 rounded-full bg-primary/10">
          <Layers className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-left">
            DSA Syllabus
          </h1>
          <p className="text-muted-foreground mt-1">
            Expand each section to see all topics and start practicing!
          </p>
        </div>
      </div>
      <div className="w-full bg-background rounded-xl border p-4">
        {DSA_SECTIONS.map((section) => (
          <div key={section.section} className="mb-4">
            <div
              className="flex items-center justify-between cursor-pointer rounded-lg px-4 py-3 hover:bg-primary/10 transition"
              onClick={() => handleToggle(section.section)}
              tabIndex={0}
              aria-expanded={openSection === section.section}
            >
              <div>
                <div className="flex items-center gap-2">
                  {openSection === section.section ? (
                    <ChevronDown className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-primary" />
                  )}
                  <span className="text-lg font-semibold">{section.section}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{section.description}</div>
              </div>
            </div>
            {openSection === section.section && (
              <div className="bg-muted/60 rounded-lg mt-2 mx-4 p-4 animate-fade-in">
                <ul className="space-y-2">
                  {section.topics.map((topic) => (
                    <li
                      key={topic.title}
                      className="flex items-center gap-2 group cursor-pointer hover:bg-primary/10 rounded px-3 py-2 transition"
                      onClick={() => navigate(topic.link)}
                    >
                      <span className="inline-block w-2 h-2 rounded-full bg-primary group-hover:bg-primary/80 transition" />
                      <span className="text-base text-primary group-hover:underline">{topic.title}</span>
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