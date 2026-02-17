// import { useState } from "react";
// import {
//   Puzzle,
//   ChevronDown,
//   ChevronRight,
//   Target,
//   BookOpen,
//   TrendingUp,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { Badge } from "@repo/ui/badge";
// import { Card, CardContent } from "@repo/ui/card";

// const LOGIC_SECTIONS = [
//   {
//     section: "Verbal Reasoning",
//     description:
//       "Test your ability to understand and reason using concepts framed in words.",
//     topics: [
//       {
//         title: "Analogies",
//         link: "/learning/practice/logical-reasoning/analogies",
//       },
//       {
//         title: "Series Completion",
//         link: "/learning/practice/logical-reasoning/series-completion",
//       },
//       {
//         title: "Blood Relations",
//         link: "/learning/practice/logical-reasoning/blood-relations",
//       },
//       {
//         title: "Logical Sequence of Words",
//         link: "/learning/practice/logical-reasoning/logical-sequence",
//       },
//     ],
//     color: "from-blue-500/10 to-cyan-500/10",
//     borderColor: "border-blue-500/20",
//   },
//   {
//     section: "Non-Verbal Reasoning",
//     description: "Solve problems using visual and spatial reasoning.",
//     topics: [
//       {
//         title: "Pattern Completion",
//         link: "/learning/practice/logical-reasoning/pattern-completion",
//       },
//       {
//         title: "Figure Series",
//         link: "/learning/practice/logical-reasoning/figure-series",
//       },
//       {
//         title: "Mirror & Water Images",
//         link: "/learning/practice/logical-reasoning/mirror-water-images",
//       },
//     ],
//     color: "from-purple-500/10 to-pink-500/10",
//     borderColor: "border-purple-500/20",
//   },
//   {
//     section: "Analytical Reasoning",
//     description: "Sharpen your analytical and critical thinking skills.",
//     topics: [
//       {
//         title: "Seating Arrangement",
//         link: "/learning/practice/logical-reasoning/seating-arrangement",
//       },
//       {
//         title: "Puzzles",
//         link: "/learning/practice/logical-reasoning/puzzles",
//       },
//       {
//         title: "Syllogism",
//         link: "/learning/practice/logical-reasoning/syllogism",
//       },
//       {
//         title: "Data Sufficiency",
//         link: "/learning/practice/logical-reasoning/data-sufficiency",
//       },
//     ],
//     color: "from-green-500/10 to-emerald-500/10",
//     borderColor: "border-green-500/20",
//   },
//   {
//     section: "Critical Reasoning",
//     description: "Evaluate arguments and draw logical conclusions.",
//     topics: [
//       {
//         title: "Statement & Assumptions",
//         link: "/learning/practice/logical-reasoning/statement-assumptions",
//       },
//       {
//         title: "Statement & Conclusions",
//         link: "/learning/practice/logical-reasoning/statement-conclusions",
//       },
//       {
//         title: "Cause & Effect",
//         link: "/learning/practice/logical-reasoning/cause-effect",
//       },
//     ],
//     color: "from-orange-500/10 to-red-500/10",
//     borderColor: "border-orange-500/20",
//   },
// ];

// export default function LogicalReasoningSyllabus() {
//   const navigate = useNavigate();
//   const [openSection, setOpenSection] = useState<string | null>(null);

//   const handleToggle = (section: string) => {
//     setOpenSection((prev) => (prev === section ? null : section));
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Hero Section */}
//       <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-background">
//         <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
//         <div className="max-w-[1800px] mx-auto px-6 py-16 relative">
//           <div className="max-w-3xl mx-auto text-center space-y-4">
//             <div className="flex items-center justify-center gap-3 mb-4">
//               <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 shadow-lg">
//                 <Puzzle className="h-8 w-8 text-orange-500" />
//               </div>
//             </div>
//             <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-orange-500/15 to-red-500/15 text-orange-600 border-0 shadow-lg">
//               <Target className="h-4 w-4 mr-2" />
//               Logical Reasoning
//             </Badge>
//             <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
//               Logical Reasoning Syllabus
//             </h1>
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//               Master logical reasoning with structured topics covering verbal,
//               non-verbal, analytical, and critical reasoning.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-[1400px] mx-auto px-6 py-12">
//         <div className="mb-8 text-center">
//           <p className="text-muted-foreground">
//             Expand a section to see topics and start practicing
//           </p>
//         </div>

//         <div className="space-y-4">
//           {LOGIC_SECTIONS.map((section, index) => (
//             <Card
//               key={section.section}
//               className="border-border/40 overflow-hidden hover:shadow-lg transition-all"
//             >
//               <div
//                 className={`flex items-center justify-between cursor-pointer p-6 bg-gradient-to-r ${section.color} hover:from-opacity-80 hover:to-opacity-80 transition-all group`}
//                 onClick={() => handleToggle(section.section)}
//                 tabIndex={0}
//                 aria-expanded={openSection === section.section}
//               >
//                 <div className="flex items-start gap-4 flex-1">
//                   <div
//                     className={`p-2 rounded-lg bg-background/50 backdrop-blur border ${section.borderColor} group-hover:scale-110 transition-transform`}
//                   >
//                     {openSection === section.section ? (
//                       <ChevronDown className="h-5 w-5 text-orange-500" />
//                     ) : (
//                       <ChevronRight className="h-5 w-5 text-orange-500" />
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-1">
//                       <h3 className="text-lg font-bold">{section.section}</h3>
//                       <Badge variant="outline" className="text-xs">
//                         {section.topics.length} topics
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       {section.description}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {openSection === section.section && (
//                 <CardContent className="p-6 pt-0 animate-in slide-in-from-top-2">
//                   <div className="bg-muted/30 rounded-xl p-6 border border-border/40">
//                     <div className="grid md:grid-cols-2 gap-3">
//                       {section.topics.map((topic) => (
//                         <div
//                           key={topic.title}
//                           className="group flex items-center gap-3 p-3 rounded-lg hover:bg-background border border-transparent hover:border-orange-500/30 cursor-pointer transition-all hover:shadow-md"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(topic.link);
//                           }}
//                         >
//                           <div className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-500 group-hover:scale-125 transition-transform" />
//                           <span className="text-sm font-medium group-hover:text-orange-500 transition-colors">
//                             {topic.title}
//                           </span>
//                           <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               )}
//             </Card>
//           ))}
//         </div>

//         {/* Stats Section */}
//         <div className="mt-16 grid md:grid-cols-3 gap-6">
//           <Card className="border-border/40 bg-gradient-to-br from-orange-500/5 to-transparent">
//             <CardContent className="p-6 text-center space-y-2">
//               <BookOpen className="h-8 w-8 mx-auto mb-2 text-orange-500" />
//               <div className="text-3xl font-bold text-orange-500">15+</div>
//               <div className="text-sm text-muted-foreground">
//                 Topics Covered
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="border-border/40 bg-gradient-to-br from-purple-500/5 to-transparent">
//             <CardContent className="p-6 text-center space-y-2">
//               <Puzzle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
//               <div className="text-3xl font-bold text-purple-500">500+</div>
//               <div className="text-sm text-muted-foreground">
//                 Practice Questions
//               </div>
//             </CardContent>
//           </Card>
//           <Card className="border-border/40 bg-gradient-to-br from-blue-500/5 to-transparent">
//             <CardContent className="p-6 text-center space-y-2">
//               <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
//               <div className="text-3xl font-bold text-blue-500">5K+</div>
//               <div className="text-sm text-muted-foreground">
//                 Students Learning
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
