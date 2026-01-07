import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent } from "@repo/ui/card";
import {
  Briefcase,
  FileText,
  Users,
  ArrowRight,
  TrendingUp,
  Target,
  Award,
  Sparkles,
  CheckCircle2,
  Rocket,
} from "lucide-react";

const CAREER_MODULES = [
  {
    id: "resume",
    title: "Resume Building",
    description:
      "Learn how to create an ATS-friendly resume that stands out to recruiters and hiring managers.",
    icon: FileText,
    tags: ["Resume", "ATS", "Templates"],
    link: "/learning/career/resume",
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    resources: "20+",
  },
  {
    id: "guidance",
    title: "Career Guidance",
    description:
      "Get expert guidance on career paths, industry trends, and professional development strategies.",
    icon: Briefcase,
    tags: ["Career", "Growth", "Planning"],
    link: "/learning/career/guidance",
    color: "from-orange-500 to-red-500",
    bgGradient: "from-orange-500/10 to-red-500/10",
    resources: "30+",
  },
  {
    id: "hr",
    title: "HR Interview",
    description:
      "Master common HR questions with best answers and behavioral interview techniques.",
    icon: Users,
    tags: ["HR", "Communication", "Behavioral"],
    link: "/learning/career/hr",
    color: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    resources: "50+",
  },
  {
    id: "guidance",
    title: "Career Guidance",
    description:
      "Get expert guidance on career paths, industry trends, and professional development strategies.",
    icon: Briefcase,
    tags: ["Career", "Growth", "Planning"],
    link: "/learning/career/guidance",
    color: "from-orange-500 to-red-500",
    bgGradient: "from-orange-500/10 to-red-500/10",
    resources: "30+",
  },
];

export default function CareerGrowthPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20" />

        <div className="relative max-w-[1800px] mx-auto px-6 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <Rocket className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Career Growth
              </h1>
              <p className="text-white/90 text-lg mt-2">
                Build your career with expert guidance, skills, and confidence
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-white/10">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">
                      {CAREER_MODULES.length}
                    </p>
                    <p className="text-white/80 text-sm">Career Modules</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-white/10">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">100+</p>
                    <p className="text-white/80 text-sm">Career Resources</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-white/10">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">30K+</p>
                    <p className="text-white/80 text-sm">
                      Career Success Stories
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-white/10">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">92%</p>
                    <p className="text-white/80 text-sm">Placement Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12">
        {/* Why Career Growth Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold">Why Focus on Career Growth?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Stand Out from Crowd</h3>
                    <p className="text-sm text-muted-foreground">
                      Build a compelling professional profile that attracts top
                      employers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Expert Guidance</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn from industry experts and successful professionals
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Accelerate Your Journey
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Fast-track your career with proven strategies and insights
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Career Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Choose Your Career Path</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAREER_MODULES.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  onClick={() => navigate(item.link)}
                  className="group cursor-pointer border-2 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${item.color}`} />

                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`p-4 rounded-xl bg-gradient-to-r ${item.bgGradient}`}
                      >
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:translate-x-2 group-hover:text-primary transition-all duration-300" />
                    </div>

                    <h3
                      className={`text-2xl font-bold mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                    >
                      {item.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4 min-h-[60px]">
                      {item.description}
                    </p>

                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${item.bgGradient} mb-4`}
                    >
                      <Award className="h-4 w-4" />
                      <span className="text-sm font-semibold">
                        {item.resources} Resources
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      className={`w-full bg-gradient-to-r ${item.color} text-white hover:opacity-90 transition-opacity`}
                    >
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Success Stats */}
        <Card className="bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 border-2">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                Transform Your Career Today
              </h2>
              <p className="text-muted-foreground">
                Join thousands of professionals who have accelerated their
                careers with us
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                <p className="text-4xl font-bold text-orange-600 mb-2">100+</p>
                <p className="text-sm text-muted-foreground">Resources</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                <p className="text-4xl font-bold text-red-600 mb-2">30K+</p>
                <p className="text-sm text-muted-foreground">Success Stories</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                <p className="text-4xl font-bold text-pink-600 mb-2">92%</p>
                <p className="text-sm text-muted-foreground">Placement Rate</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-white/50 dark:bg-black/20">
                <p className="text-4xl font-bold text-rose-600 mb-2">200+</p>
                <p className="text-sm text-muted-foreground">
                  Partner Companies
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
