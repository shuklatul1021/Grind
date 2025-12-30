// import { Badge } from "@repo/ui/badge";
// import { Brain } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const APTITUDE_TOPICS = [
//   {
//     title: "Number Series",
//     description: "Identify patterns and predict the next number in a sequence.",
//     difficulty: "Easy",
//     link: "/learning/practice/aptitude/topic?number-series",
//   },
//   {
//     title: "Percentages",
//     description: "Calculate percentage increases, decreases, and comparisons.",
//     difficulty: "Easy",
//     link: "/learning/practice/aptitude/topic?percentages",
//   },
//   {
//     title: "Time & Work",
//     description: "Solve problems involving work rates and time management.",
//     difficulty: "Medium",
//     link: "/learning/practice/aptitude/topic?time-work",
//   },
//   {
//     title: "Probability",
//     description:
//       "Understand basic probability concepts and solve related problems.",
//     difficulty: "Medium",
//     link: "/learning/practice/aptitude/topic?probability",
//   },
//   {
//     title: "Averages",
//     description: "Find averages and solve weighted average problems.",
//     difficulty: "Easy",
//     link: "/learning/practice/aptitude/topic?averages",
//   },
//   {
//     title: "Profit & Loss",
//     description: "Calculate profit, loss, and related percentages.",
//     difficulty: "Easy",
//     link: "/learning/practice/aptitude/topic?profit-loss",
//   },
//   {
//     title: "Ratio & Proportion",
//     description:
//       "Solve problems involving ratios and proportional relationships.",
//     difficulty: "Medium",
//     link: "/learning/practice/aptitude/topic?ratio-proportion",
//   },
//   {
//     title: "Simple & Compound Interest",
//     description: "Calculate interest earned or paid over time.",
//     difficulty: "Medium",
//     link: "/learning/practice/aptitude/topic?interest",
//   },
//   {
//     title: "Time, Speed & Distance",
//     description: "Solve questions on travel, speed, and time.",
//     difficulty: "Medium",
//     link: "/learning/practice/aptitude/topic?time-speed-distance",
//   },
//   {
//     title: "Mixtures & Alligations",
//     description: "Handle problems involving mixing substances or solutions.",
//     difficulty: "Medium",
//     link: "/learning/practice/aptitude/topic?mixtures-alligations",
//   },
//   {
//     title: "Permutations & Combinations",
//     description: "Count arrangements and selections in various scenarios.",
//     difficulty: "Hard",
//     link: "/learning/practice/aptitude/topic?permutations-combinations",
//   },
//   {
//     title: "Data Interpretation",
//     description: "Analyze and interpret data from charts and tables.",
//     difficulty: "Medium",
//     link: "/learning/practice/aptitude/topic?data-interpretation",
//   },
//   {
//     title: "Ages",
//     description: "Solve age-related word problems.",
//     difficulty: "Easy",
//     link: "/learning/practice/aptitude/topic?ages",
//   },
//   {
//     title: "Partnerships",
//     description: "Calculate profit sharing in business partnerships.",
//     difficulty: "Medium",
//     link: "/learning/practice/aptitude/topic?partnerships",
//   },
//   {
//     title: "Boats & Streams",
//     description: "Solve problems involving movement in water.",
//     difficulty: "Medium",
//     link: "/learning/practice/aptitude/topic?boats-streams",
//   },
//   {
//     title: "Pipes & Cisterns",
//     description: "Work with rates of filling and emptying tanks.",
//     difficulty: "Medium",
//     link: "/learning/practice/aptitude/topic?pipes-cisterns",
//   },
//   {
//     title: "Mensuration",
//     description: "Calculate area, volume, and surface area of shapes.",
//     difficulty: "Hard",
//     link: "/learning/practice/aptitude/topic?mensuration",
//   },
//   {
//     title: "Trains",
//     description: "Solve problems involving trains and their speeds.",
//     difficulty: "Medium",
//     link: "/learning/practice/aptitude/topic?trains",
//   },
//   {
//     title: "Calendar & Clocks",
//     description: "Work with dates, days, and time calculations.",
//     difficulty: "Easy",
//     link: "/learning/practice/aptitude/topic?calendar-clocks",
//   },
//   {
//     title: "Surds & Indices",
//     description: "Simplify and calculate with surds and exponents.",
//     difficulty: "Medium",
//     link: "/learning/practice/aptitude/topic?surds-indices",
//   },
//   {
//     title: "Logarithms",
//     description: "Solve equations and problems using logarithms.",
//     difficulty: "Medium",
//     link: "/learning/practice/aptitude/topic?logarithms",
//   },
// ];

// export default function ApptitudeSyllabus() {
//   const navigate = useNavigate();
  
//   return (
//     <div className="container py-12">
//       <div className="flex items-center gap-4 mb-8">
//         <div className="p-4 rounded-full bg-primary/10">
//           <Brain className="h-8 w-8 text-primary" />
//         </div>
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-left">
//             Aptitude Syllabus
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Explore all aptitude topics with descriptions and difficulty levels.
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
//             {APTITUDE_TOPICS.map((topic) => (
//               <tr
//                 key={topic.title}
//                 className={`border-b last:border-b-0 transition cursor-pointer ${topic.link ? "hover:bg-primary/5" : "opacity-60 cursor-not-allowed"}`}
//                 onClick={() => topic.link && navigate(topic.link)}
//                 tabIndex={topic.link ? 0 : -1}
//                 style={
//                   topic.link
//                     ? { userSelect: "none" }
//                     : { pointerEvents: "none", userSelect: "none" }
//                 }
//                 aria-disabled={!topic.link}
//               >
//                 <td className="px-6 py-4 align-middle font-medium whitespace-nowrap">
//                   {topic.title}
//                 </td>
//                 <td className="px-6 py-4 align-middle text-sm text-muted-foreground">
//                   {topic.description}
//                 </td>
//                 <td className="px-6 py-4 align-middle text-center">
//                   <Badge
//                     variant={
//                       topic.difficulty === "Easy"
//                         ? "success"
//                         : topic.difficulty === "Medium"
//                           ? "default"
//                           : "destructive"
//                     }
//                     className="text-xs px-3 py-1"
//                   >
//                     {topic.difficulty}
//                   </Badge>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
