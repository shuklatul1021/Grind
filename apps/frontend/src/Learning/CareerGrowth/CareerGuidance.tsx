import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  Briefcase,
  Map,
  TrendingUp,
  Target,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  BarChart3,
  Lightbulb,
  Clock,
} from "lucide-react";

// Mock data
const CAREER_PATHS = [
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "Build user interfaces and web experiences",
    skills: ["React", "TypeScript", "CSS"],
    demand: "High",
    avgSalary: "$85K - $120K",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "backend",
    title: "Backend Developer",
    description: "Develop server-side applications and APIs",
    skills: ["Node.js", "Python", "Databases"],
    demand: "High",
    avgSalary: "$90K - $130K",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    description: "Manage infrastructure and deployment pipelines",
    skills: ["Docker", "Kubernetes", "AWS"],
    demand: "Very High",
    avgSalary: "$100K - $150K",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    description: "Work on both frontend and backend systems",
    skills: ["React", "Node.js", "MongoDB"],
    demand: "High",
    avgSalary: "$95K - $140K",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "data-science",
    title: "Data Scientist",
    description: "Analyze data and build machine learning models",
    skills: ["Python", "ML", "Statistics"],
    demand: "Very High",
    avgSalary: "$110K - $160K",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "mobile",
    title: "Mobile Developer",
    description: "Create iOS and Android applications",
    skills: ["React Native", "Swift", "Kotlin"],
    demand: "Medium",
    avgSalary: "$85K - $125K",
    color: "from-teal-500 to-cyan-500",
  },
];

const ROADMAPS = [
  {
    id: "frontend-roadmap",
    title: "Frontend Roadmap",
    duration: "6-12 months",
    level: "Beginner to Advanced",
    topics: 25,
  },
  {
    id: "backend-roadmap",
    title: "Backend Roadmap",
    duration: "6-12 months",
    level: "Beginner to Advanced",
    topics: 30,
  },
  {
    id: "devops-roadmap",
    title: "DevOps Roadmap",
    duration: "8-14 months",
    level: "Intermediate to Advanced",
    topics: 35,
  },
];

const INDUSTRY_INSIGHTS = [
  {
    id: "trends-2024",
    title: "Tech Trends 2024",
    description: "Latest technologies and skills in demand",
    views: 12500,
  },
  {
    id: "salary-guide",
    title: "Salary Guide",
    description: "Average salaries by role and experience",
    views: 8900,
  },
  {
    id: "remote-work",
    title: "Remote Work Guide",
    description: "How to excel in remote positions",
    views: 6700,
  },
];

export default function CareerGuidancePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-[1800px] mx-auto px-6 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 shadow-lg">
                <Briefcase className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-orange-500/15 to-red-500/15 text-orange-600 border-0 shadow-lg">
              <Target className="h-4 w-4 mr-2" />
              Career Guidance
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Plan Your Career Path
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get expert guidance on career paths, industry trends, and professional development strategies.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12 space-y-12">
        {/* Career Paths Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Map className="h-6 w-6 text-orange-500" />
                Career Paths
              </h2>
              <p className="text-muted-foreground mt-1">
                Explore different career paths in tech and find your fit
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAREER_PATHS.map((path) => (
              <Card
                key={path.id}
                className="group cursor-pointer hover:shadow-lg transition-all border-border/40"
                onClick={() => navigate(`/learning/career/guidance/path/${path.id}`)}
              >
                <div className={`h-2 bg-gradient-to-r ${path.color}`} />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{path.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {path.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {path.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Demand: </span>
                          <span className="font-semibold">{path.demand}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Salary: </span>
                          <span className="font-semibold">{path.avgSalary}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </div>
                  <Button
                    size="sm"
                    className={`w-full bg-gradient-to-r ${path.color} text-white hover:opacity-90`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/learning/career/guidance/path/${path.id}`);
                    }}
                  >
                    Explore Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Roadmaps Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Map className="h-6 w-6 text-orange-500" />
                Learning Roadmaps
              </h2>
              <p className="text-muted-foreground mt-1">
                Step-by-step guides to master your chosen career path
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ROADMAPS.map((roadmap) => (
              <Card
                key={roadmap.id}
                className="group cursor-pointer hover:shadow-lg transition-all border-border/40"
                onClick={() => navigate(`/learning/career/guidance/roadmap/${roadmap.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{roadmap.title}</h3>
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{roadmap.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span>{roadmap.level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{roadmap.topics} topics</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/learning/career/guidance/roadmap/${roadmap.id}`);
                    }}
                  >
                    View Roadmap
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Industry Insights Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-orange-500" />
                Industry Insights
              </h2>
              <p className="text-muted-foreground mt-1">
                Stay updated with latest trends and market insights
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INDUSTRY_INSIGHTS.map((insight) => (
              <Card
                key={insight.id}
                className="group cursor-pointer hover:shadow-lg transition-all border-border/40"
                onClick={() => navigate(`/learning/career/guidance/insight/${insight.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {insight.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {insight.views.toLocaleString()} views
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/learning/career/guidance/insight/${insight.id}`);
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Skill Gap Analysis & Growth Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-orange-500/5 to-transparent border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-orange-500" />
                Skill Gap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Identify the skills you need to develop for your target role.
              </p>
              <Button variant="outline" className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Analyze My Skills
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/5 to-transparent border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-orange-500" />
                Growth Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get a personalized career growth plan based on your goals.
              </p>
              <Button variant="outline" className="w-full">
                <Map className="h-4 w-4 mr-2" />
                Create Growth Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

