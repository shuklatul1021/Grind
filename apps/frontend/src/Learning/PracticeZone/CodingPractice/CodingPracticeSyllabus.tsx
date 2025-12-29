// import { useState } from "react";
// import { Badge } from "@repo/ui/badge";
// import { Code2, ChevronDown, ChevronRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const CODING_TOPICS = [
//   {
//     title: "Arrays",
//     description:
//       "Solve problems involving arrays, traversals, and manipulations.",
//     difficulty: "Easy",
//     subtopics: [
//       { title: "1D Arrays", link: "/learning/practice/coding/arrays?1d" },
//       { title: "2D Arrays", link: "/learning/practice/coding/arrays?2d" },
//       {
//         title: "Sliding Window",
//         link: "/learning/practice/coding/arrays?sliding-window",
//       },
//     ],
//   },
//   {
//     title: "Strings",
//     description:
//       "Work with string manipulation, searching, and pattern matching.",
//     difficulty: "Easy",
//     subtopics: [
//       {
//         title: "String Reversal",
//         link: "/learning/practice/coding/strings?reversal",
//       },
//       {
//         title: "Pattern Matching",
//         link: "/learning/practice/coding/strings?pattern-matching",
//       },
//     ],
//   },
//   {
//     title: "Linked Lists",
//     description:
//       "Implement and solve problems using singly and doubly linked lists.",
//     difficulty: "Medium",
//     subtopics: [
//       {
//         title: "Singly Linked List",
//         link: "/learning/practice/coding/linked-lists?singly",
//       },
//       {
//         title: "Doubly Linked List",
//         link: "/learning/practice/coding/linked-lists?doubly",
//       },
//     ],
//   },
//   // ...add more topics as needed
// ];

// export default function CodingPracticeSyllabus() {
//   const navigate = useNavigate();
//   const [open, setOpen] = useState<string | null>(null);

//   const handleToggle = (title: string) => {
//     setOpen((prev) => (prev === title ? null : title));
//   };

//   return (
//     <div className="container py-12">
//       <div className="flex items-center gap-4 mb-8">
//         <div className="p-4 rounded-full bg-primary/10">
//           <Code2 className="h-8 w-8 text-primary" />
//         </div>
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-left">
//             Coding Practice Syllabus
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Explore all coding practice topics with expandable subtopics.
//           </p>
//         </div>
//       </div>
//       <div className="w-full bg-background rounded-xl border overflow-x-auto">
//         <table className="min-w-full text-left">
//           <thead>
//             <tr className="border-b">
//               <th className="px-6 py-3 font-semibold text-muted-foreground w-1/4">
//                 Topic
//               </th>
//               <th className="px-6 py-3 font-semibold text-muted-foreground w-1/2">
//                 Description
//               </th>
//               <th className="px-6 py-3 font-semibold text-muted-foreground w-1/6 text-center">
//                 Difficulty
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {CODING_TOPICS.map((topic) => (
//               <>
//                 <tr
//                   key={topic.title}
//                   className={`border-b transition cursor-pointer`}
//                   onClick={() => handleToggle(topic.title)}
//                   tabIndex={0}
//                   style={{ userSelect: "none" }}
//                   aria-expanded={open === topic.title}
//                 >
//                   <td className="px-6 py-4 align-middle font-medium whitespace-nowrap flex items-center gap-2">
//                     {topic.subtopics ? (
//                       open === topic.title ? (
//                         <ChevronDown className="h-4 w-4" />
//                       ) : (
//                         <ChevronRight className="h-4 w-4" />
//                       )
//                     ) : null}
//                     {topic.title}
//                   </td>
//                   <td className="px-6 py-4 align-middle text-sm text-muted-foreground">
//                     {topic.description}
//                   </td>
//                   <td className="px-6 py-4 align-middle text-center">
//                     <Badge
//                       variant={
//                         topic.difficulty === "Easy"
//                           ? "success"
//                           : topic.difficulty === "Medium"
//                             ? "default"
//                             : "destructive"
//                       }
//                       className="text-xs px-3 py-1"
//                     >
//                       {topic.difficulty}
//                     </Badge>
//                   </td>
//                 </tr>
//                 {open === topic.title && topic.subtopics && (
//                   <tr>
//                     <td colSpan={3} className="px-0 py-0 bg-transparent">
//                       <div
//                         className="mx-8 my-2 rounded-lg border bg-muted/60 shadow-sm transition-all animate-fade-in"
//                         style={{ overflow: "hidden" }}
//                       >
//                         <ul className="py-3 px-6 space-y-2">
//                           {topic.subtopics.map((sub) => (
//                             <li
//                               key={sub.title}
//                               className="flex items-center gap-2 group cursor-pointer hover:bg-primary/10 rounded px-3 py-2 transition"
//                               onClick={() => navigate(sub.link)}
//                             >
//                               <span className="inline-block w-2 h-2 rounded-full bg-primary group-hover:bg-primary/80 transition" />
//                               <span className="text-base text-primary ">
//                                 {sub.title}
//                               </span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
