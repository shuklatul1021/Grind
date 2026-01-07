import { useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import {
  LayoutTemplate,
  Eye,
  Zap,
  ArrowRight,
  FileText,
  ChevronLeft,
  Target,
  Shield,
  Rocket,
  TrendingUp,
  Award,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const MOCK_TEMPLATES = [
  {
    id: 1,
    name: "The FAANG Standard",
    description: "Optimized for Google & Meta",
    color: "from-blue-500/20",
    badge: "Most Popular",
  },
  {
    id: 2,
    name: "Executive Minimalist",
    description: "Best for Senior Roles",
    color: "from-purple-500/20",
    badge: "Professional",
  },
  {
    id: 3,
    name: "Startup Disruptor",
    description: "Creative yet ATS friendly",
    color: "from-cyan-500/20",
    badge: "Modern",
  },
  {
    id: 4,
    name: "Tech Innovator",
    description: "Perfect for Software Engineers",
    color: "from-green-500/20",
    badge: "New",
  },
  {
    id: 5,
    name: "Data Scientist Pro",
    description: "Showcase your ML expertise",
    color: "from-orange-500/20",
    badge: "Trending",
  },
  {
    id: 6,
    name: "Product Manager Elite",
    description: "Leadership focused design",
    color: "from-pink-500/20",
    badge: "Premium",
  },
];

const FEATURES = [
  {
    icon: Target,
    title: "ATS Optimization",
    description: "99% pass rate with Applicant Tracking Systems",
  },
  {
    icon: Shield,
    title: "Proven Results",
    description: "Used by 50K+ successful job seekers",
  },
  {
    icon: Rocket,
    title: "Quick Setup",
    description: "Create your resume in under 10 minutes",
  },
  {
    icon: TrendingUp,
    title: "Data-Driven",
    description: "Based on analysis of 1M+ resumes",
  },
];

const STATS = [
  { value: "95%", label: "Interview Rate" },
  { value: "50K+", label: "Happy Users" },
  { value: "1M+", label: "Resumes Analyzed" },
  { value: "99%", label: "ATS Pass Rate" },
];

export function PrimiumResume() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Navbar with Back Button */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 rounded-full hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/premium/resume/analyze")}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" /> Analyze Resume
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-28 text-center">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6">
          <div className="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-4 py-2 text-sm font-medium animate-pulse">
            <Zap className="mr-2 h-4 w-4 text-yellow-500 fill-yellow-500/20" />
            Resume Intelligence 2.0
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Land your dream role with
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              {" "}
              Elite Templates
            </span>
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg leading-relaxed">
            Analyze your resume against FAANG standards and use templates proven
            to bypass ATS filters. Join thousands who landed their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              size="lg"
              onClick={() => navigate("/premium/resume/analyze")}
              className="text-base group"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Analyze My Resume
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              <LayoutTemplate className="mr-2 h-5 w-5" />
              Browse Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, idx) => (
              <Card
                key={idx}
                className="text-center border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 transition-all"
              >
                <CardContent className="pt-6 pb-6">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16 border-t border-border/40">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Resume Templates?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built with industry insights and proven to get results
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="border-border/40 bg-card/50 backdrop-blur hover:shadow-lg transition-all group"
                >
                  <CardContent className="pt-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 mb-4 group-hover:bg-blue-500/20 transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Template Gallery */}
      <section className="container px-4 py-16 border-t border-border/40">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3 mb-2">
                <LayoutTemplate className="text-blue-500" /> Pro Templates
              </h2>
              <p className="text-muted-foreground">
                Carefully crafted designs that stand out
              </p>
            </div>
            <Button variant="outline" className="gap-2 w-full md:w-auto">
              View All Templates <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_TEMPLATES.map((tpl) => (
              <Card
                key={tpl.id}
                className="group overflow-hidden border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`aspect-[3/4] bg-gradient-to-br ${tpl.color} to-transparent flex items-center justify-center relative overflow-hidden`}
                >
                  <FileText className="h-20 w-20 text-muted-foreground/30 group-hover:scale-110 transition-transform duration-500" />
                  {tpl.badge && (
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="secondary"
                        className="bg-background/80 backdrop-blur"
                      >
                        {tpl.badge}
                      </Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                    <div className="flex flex-col gap-2">
                      <Button variant="secondary" className="gap-2">
                        <Eye className="h-4 w-4" /> Preview
                      </Button>
                      <Button variant="default" className="gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Use Template
                      </Button>
                    </div>
                  </div>
                </div>
                <CardHeader className="p-6">
                  <CardTitle className="text-lg mb-2">{tpl.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {tpl.description}
                  </CardDescription>
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-500 hover:text-blue-600 group/link"
                    >
                      Learn more
                      <ArrowRight className="ml-1 h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                    </Button>
                    <Award className="h-4 w-4 text-yellow-500" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <Card className="border-border/40 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur">
            <CardContent className="p-12 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-6 text-blue-500" />
              <h2 className="text-3xl font-bold mb-4">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start with a free resume analysis and discover what's holding
                you back from getting interviews.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/premium/resume/analyze")}
                  className="gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Analyze My Resume Free
                </Button>
                <Button size="lg" variant="outline">
                  Talk to Expert
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
