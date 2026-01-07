import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import {
  FileText,
  CheckCircle2,
  Download,
  FileCheck,
  ArrowRight,
  Eye,
  X,
  Sparkles,
  BookOpen,
  Target,
} from "lucide-react";

// Mock data
const RESUME_BASICS = [
  {
    id: "structure",
    title: "Resume Structure",
    description: "Learn the essential sections and layout of a professional resume",
    completed: true,
  },
  {
    id: "formatting",
    title: "Formatting Guidelines",
    description: "Best practices for formatting and styling your resume",
    completed: true,
  },
  {
    id: "content",
    title: "Content Writing",
    description: "How to write compelling bullet points and descriptions",
    completed: false,
  },
  {
    id: "keywords",
    title: "Keyword Optimization",
    description: "Use the right keywords to pass ATS systems",
    completed: false,
  },
];

const ATS_OPTIMIZATION = [
  {
    id: "ats-basics",
    title: "What is ATS?",
    description: "Understanding Applicant Tracking Systems",
  },
  {
    id: "ats-tips",
    title: "ATS Optimization Tips",
    description: "10 essential tips to pass ATS screening",
  },
  {
    id: "ats-testing",
    title: "Test Your Resume",
    description: "Check if your resume is ATS-friendly",
  },
];

const TEMPLATES = [
  {
    id: "template-1",
    name: "Modern Professional",
    category: "Tech",
    preview: "Modern design with clean sections",
    downloads: 1250,
  },
  {
    id: "template-2",
    name: "Classic Executive",
    category: "Business",
    preview: "Traditional format for senior roles",
    downloads: 890,
  },
  {
    id: "template-3",
    name: "Creative Designer",
    category: "Design",
    preview: "Eye-catching design for creative roles",
    downloads: 650,
  },
  {
    id: "template-4",
    name: "ATS Optimized",
    category: "All",
    preview: "Designed specifically for ATS systems",
    downloads: 2100,
  },
];

const EXAMPLES = [
  {
    id: "good-example",
    title: "Good Resume Example",
    description: "See what makes a resume stand out",
    type: "good",
  },
  {
    id: "bad-example",
    title: "Bad Resume Example",
    description: "Learn from common mistakes",
    type: "bad",
  },
  {
    id: "before-after",
    title: "Before & After",
    description: "Transformation examples",
    type: "comparison",
  },
];

export default function ResumeBuildingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-[1800px] mx-auto px-6 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 shadow-lg">
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <Badge className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-blue-500/15 to-cyan-500/15 text-blue-600 border-0 shadow-lg">
              <Target className="h-4 w-4 mr-2" />
              Resume Building
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Build Your Perfect Resume
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create an ATS-friendly resume that stands out to recruiters and hiring managers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto px-6 py-12 space-y-12">
        {/* Resume Basics Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-500" />
                Resume Basics
              </h2>
              <p className="text-muted-foreground mt-1">
                Learn the fundamentals of creating a professional resume
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {RESUME_BASICS.map((item) => (
              <Card
                key={item.id}
                className="group cursor-pointer hover:shadow-lg transition-all border-border/40"
                onClick={() => navigate(`/learning/career/resume/basics/${item.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {item.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                        )}
                        <h3 className="text-base font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/learning/career/resume/basics/${item.id}`);
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ATS Optimization Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileCheck className="h-6 w-6 text-blue-500" />
                ATS Optimization
              </h2>
              <p className="text-muted-foreground mt-1">
                Make sure your resume passes Applicant Tracking Systems
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ATS_OPTIMIZATION.map((item) => (
              <Card
                key={item.id}
                className="group cursor-pointer hover:shadow-lg transition-all border-border/40"
                onClick={() => navigate(`/learning/career/resume/ats/${item.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/learning/career/resume/ats/${item.id}`);
                    }}
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Templates Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-500" />
                Resume Templates
              </h2>
              <p className="text-muted-foreground mt-1">
                Choose from professionally designed templates
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className="group cursor-pointer hover:shadow-lg transition-all border-border/40"
                onClick={() => navigate(`/learning/career/resume/template/${template.id}`)}
              >
                <CardContent className="p-6">
                  <div className="h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg mb-4 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{template.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.preview}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{template.downloads} downloads</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/learning/career/resume/template/${template.id}`);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/learning/career/resume/template/${template.id}`);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Examples Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Eye className="h-6 w-6 text-blue-500" />
                Resume Examples
              </h2>
              <p className="text-muted-foreground mt-1">
                Learn from good and bad resume examples
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EXAMPLES.map((example) => (
              <Card
                key={example.id}
                className="group cursor-pointer hover:shadow-lg transition-all border-border/40"
                onClick={() => navigate(`/learning/career/resume/example/${example.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {example.type === "good" ? (
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                    ) : example.type === "bad" ? (
                      <div className="p-2 rounded-lg bg-red-500/10">
                        <X className="h-6 w-6 text-red-500" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Sparkles className="h-6 w-6 text-blue-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{example.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {example.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/learning/career/resume/example/${example.id}`);
                    }}
                  >
                    View Example
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resume Checker Section */}
        <Card className="bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-transparent border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-6 w-6 text-blue-500" />
              Resume Checker (Coming Soon)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Upload your resume and get instant feedback on ATS compatibility, formatting, content quality, and more.
            </p>
            <Button disabled variant="outline">
              <FileCheck className="h-4 w-4 mr-2" />
              Upload Resume (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

