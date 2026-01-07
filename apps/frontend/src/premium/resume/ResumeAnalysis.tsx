import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import {
  FileText,
  AlertCircle,
  Upload,
  CheckCircle,
  ChevronLeft,
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  Brain,
  XCircle,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle2,
  Award,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Progress } from "@repo/ui/progress";

const MOCK_ANALYSIS_RESULT = {
  score: 78,
  grade: "B+",
  sections: [
    {
      title: "ATS Compatibility",
      score: 85,
      status: "good",
      icon: Target,
      insights: [
        "Resume format is ATS-friendly",
        "Good keyword density for your role",
        "Standard section headers detected",
      ],
      suggestions: [
        "Add 3-4 more industry-specific keywords",
        "Consider using a cleaner font like Arial or Calibri",
      ],
    },
    {
      title: "Content Quality",
      score: 72,
      status: "warning",
      icon: Brain,
      insights: [
        "Strong action verbs used effectively",
        "Good quantification of achievements",
      ],
      suggestions: [
        "Add more measurable results (e.g., percentages, numbers)",
        "Expand on leadership experiences",
        "Include 2-3 more technical skills",
      ],
    },
    {
      title: "Formatting & Structure",
      score: 80,
      status: "good",
      icon: FileText,
      insights: [
        "Clean and professional layout",
        "Consistent formatting throughout",
        "Appropriate use of white space",
      ],
      suggestions: [
        "Reduce margins slightly to fit more content",
        "Consider adding a skills summary section",
      ],
    },
    {
      title: "Impact & Achievements",
      score: 65,
      status: "warning",
      icon: TrendingUp,
      insights: [
        "Some achievements quantified",
        "Good use of project highlights",
      ],
      suggestions: [
        "Add more specific metrics (revenue, time saved, etc.)",
        "Highlight leadership roles more prominently",
        "Include awards or recognition received",
      ],
    },
  ],
  keywordAnalysis: {
    found: ["JavaScript", "React", "Node.js", "TypeScript", "Git", "Agile"],
    missing: ["Docker", "Kubernetes", "CI/CD", "AWS", "Testing", "GraphQL"],
    frequency: 24,
  },
  improvements: [
    {
      priority: "high",
      title: "Add Missing Technical Skills",
      description:
        "Your resume is missing key technologies like Docker, Kubernetes, and AWS that are commonly required for senior developer roles.",
    },
    {
      priority: "high",
      title: "Quantify More Achievements",
      description:
        "Add specific numbers and metrics to at least 60% of your bullet points. For example, 'Improved performance by 45%' instead of 'Improved performance'.",
    },
    {
      priority: "medium",
      title: "Strengthen Action Verbs",
      description:
        "Replace passive language with strong action verbs like 'Led', 'Architected', 'Optimized', 'Spearheaded'.",
    },
    {
      priority: "low",
      title: "Add Certifications Section",
      description:
        "If you have relevant certifications, create a dedicated section to showcase them.",
    },
  ],
};

export function ResumeAnalysisPage() {
  const navigate = useNavigate();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setShowResults(true);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        const raw = (event.loaded / event.total) * 100;
        const safe = Math.min(100, Math.max(0, raw));
        setUploadProgress(safe);
      } else {
        setUploadProgress(0);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status === 200) {
        // Handle successful upload here (e.g., show a message or update state)
        // const response = JSON.parse(xhr.responseText);
        // You can set file URL or name here if needed
      } else {
        alert("Upload failed. Please try again.");
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      alert("Upload failed. Please try again.");
    };

    xhr.send(formData);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setUploadedFile(file);
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Navbar */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 rounded-full hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-4 py-2 text-sm font-medium mb-6">
              <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
              AI-Powered Analysis
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4">
              Premium Resume{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Analysis
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Upload your resume and get instant AI-powered insights. Discover
              what's working and what needs improvement.
            </p>
          </div>

          {/* Upload Card */}
          <div>
            <Card className="mb-8 border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      Upload Your Resume
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Drag and drop your file here, or click to browse. Maximum
                      file size: 100MB
                    </CardDescription>
                  </div>
                  {uploadedFile && (
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle className="h-3 w-3" /> Ready
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
                    ${
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    }
                    ${isUploading ? "pointer-events-none" : ""}
                  `}
                >
                  <input {...getInputProps()} />

                  {!isUploading && !uploadedFile && (
                    <div>
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {isDragActive
                          ? "Drop your file here"
                          : "Upload your document"}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Support for PDF, DOCX, DOC, JPEG, PNG files
                      </p>
                      <Button variant="outline">Browse Files</Button>
                    </div>
                  )}

                  {uploadedFile && !isUploading && (
                    <div className="space-y-4">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          File Uploaded Successfully!
                        </h3>
                        <p className="text-muted-foreground mb-2">
                          {uploadedFile.name} (
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                        <div className="flex gap-2 justify-center mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFile(null);
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {isUploading && (
                    <div className="space-y-4">
                      <div className="h-12 w-12 mx-auto mb-4 animate-pulse">
                        <Upload className="h-full w-full text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">Uploading...</h3>
                      <div className="max-w-md mx-auto">
                        <Progress
                          value={Math.min(
                            100,
                            Math.max(
                              0,
                              Number.isFinite(uploadProgress)
                                ? uploadProgress
                                : 0
                            )
                          )}
                          max={100}
                          className="mb-2"
                        />
                        <p className="text-sm text-muted-foreground">
                          {uploadProgress.toFixed(0)}% uploaded
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Button */}
          {uploadedFile && !isUploading && !showResults && (
            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                className="gap-2 text-base"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                <Sparkles className="h-5 w-5" />
                {isAnalyzing ? "Analyzing..." : "Analyze My Resume"}
              </Button>
            </div>
          )}

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="mt-8">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 animate-pulse">
                      <Brain className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      Analyzing Your Resume...
                    </h3>
                    <p className="text-muted-foreground">
                      Our AI is reviewing your resume for ATS compatibility,
                      content quality, and improvement opportunities
                    </p>
                    <div className="max-w-md mx-auto">
                      <Progress value={analysisProgress} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {analysisProgress}% complete
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analysis Results */}
          {showResults && (
            <div className="mt-8 space-y-8">
              {/* Overall Score Card */}
              <Card className="border-border/40 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 text-center md:text-left">
                      <Badge className="mb-4">Analysis Complete</Badge>
                      <h2 className="text-3xl font-bold mb-2">Resume Score</h2>
                      <p className="text-muted-foreground">
                        Your resume has been analyzed against industry standards
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 p-1">
                        <div className="flex items-center justify-center w-full h-full rounded-full bg-background">
                          <div>
                            <div className="text-5xl font-bold">
                              {MOCK_ANALYSIS_RESULT.score}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              out of 100
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Badge
                          variant="secondary"
                          className="text-lg px-4 py-1"
                        >
                          Grade: {MOCK_ANALYSIS_RESULT.grade}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download Report
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section Scores */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Detailed Analysis</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {MOCK_ANALYSIS_RESULT.sections.map((section, idx) => {
                    const Icon = section.icon;
                    const statusColor =
                      section.status === "good"
                        ? "text-green-500"
                        : "text-yellow-500";
                    const statusBg =
                      section.status === "good"
                        ? "bg-green-500/10"
                        : "bg-yellow-500/10";

                    return (
                      <Card
                        key={idx}
                        className="border-border/40 bg-card/50 backdrop-blur"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${statusBg} ${statusColor}`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {section.title}
                                </CardTitle>
                                <CardDescription>
                                  Score: {section.score}/100
                                </CardDescription>
                              </div>
                            </div>
                            <Badge
                              variant={
                                section.status === "good"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {section.status === "good"
                                ? "Good"
                                : "Needs Work"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <Progress value={section.score} className="mb-2" />
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <ThumbsUp className="h-4 w-4 text-green-500" />
                                What's Working
                              </h4>
                              <ul className="space-y-1">
                                {section.insights.map((insight, i) => (
                                  <li
                                    key={i}
                                    className="text-sm text-muted-foreground flex items-start gap-2"
                                  >
                                    <CheckCircle2 className="h-3 w-3 mt-1 flex-shrink-0 text-green-500" />
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <ThumbsDown className="h-4 w-4 text-orange-500" />
                                Suggestions
                              </h4>
                              <ul className="space-y-1">
                                {section.suggestions.map((suggestion, i) => (
                                  <li
                                    key={i}
                                    className="text-sm text-muted-foreground flex items-start gap-2"
                                  >
                                    <AlertTriangle className="h-3 w-3 mt-1 flex-shrink-0 text-orange-500" />
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Keyword Analysis */}
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Keyword Analysis
                  </CardTitle>
                  <CardDescription>
                    Keywords found vs. commonly required for your role
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Keywords Found (
                        {MOCK_ANALYSIS_RESULT.keywordAnalysis.found.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {MOCK_ANALYSIS_RESULT.keywordAnalysis.found.map(
                          (keyword, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="bg-green-500/10 text-green-700 dark:text-green-400"
                            >
                              {keyword}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-orange-500" />
                        Missing Keywords (
                        {MOCK_ANALYSIS_RESULT.keywordAnalysis.missing.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {MOCK_ANALYSIS_RESULT.keywordAnalysis.missing.map(
                          (keyword, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="border-orange-500/50 text-orange-700 dark:text-orange-400"
                            >
                              {keyword}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <p className="text-sm text-muted-foreground">
                      <strong>Tip:</strong> Including these missing keywords
                      (where relevant) can significantly improve your ATS score
                      and increase your chances of getting past automated
                      screening.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Priority Improvements */}
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    Priority Improvements
                  </CardTitle>
                  <CardDescription>
                    Action items to boost your resume score
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_ANALYSIS_RESULT.improvements.map(
                      (improvement, idx) => {
                        const priorityColors = {
                          high: "border-red-500/50 bg-red-500/5",
                          medium: "border-yellow-500/50 bg-yellow-500/5",
                          low: "border-blue-500/50 bg-blue-500/5",
                        };

                        const priorityBadgeVariant = {
                          high: "destructive",
                          medium: "outline",
                          low: "secondary",
                        } as const;

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg border ${priorityColors[improvement.priority as keyof typeof priorityColors]}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    variant={
                                      priorityBadgeVariant[
                                        improvement.priority as keyof typeof priorityBadgeVariant
                                      ]
                                    }
                                  >
                                    {improvement.priority.toUpperCase()}{" "}
                                    Priority
                                  </Badge>
                                </div>
                                <h4 className="font-semibold mb-1">
                                  {improvement.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {improvement.description}
                                </p>
                              </div>
                              <Button size="sm" variant="ghost">
                                Fix Now
                              </Button>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* CTA Section */}
              <Card className="border-border/40 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur">
                <CardContent className="p-8 text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-2xl font-bold mb-2">
                    Want to Optimize Your Resume?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Use our professional templates designed to pass ATS systems
                    and impress recruiters
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      onClick={() => navigate("/premium/resume")}
                    >
                      Browse Pro Templates
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        setShowResults(false);
                        setUploadedFile(null);
                      }}
                    >
                      Analyze Another Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Features Grid */}
          {!showResults && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <Card className="border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 mx-auto mb-4">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Multiple Formats</h3>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOCX, DOC files up to 100MB
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10 text-green-500 mx-auto mb-4">
                      <Brain className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">AI-Powered</h3>
                    <p className="text-sm text-muted-foreground">
                      Advanced analysis with GPT-4
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50 backdrop-blur hover:border-blue-500/50 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10 text-purple-500 mx-auto mb-4">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Secure & Private</h3>
                    <p className="text-sm text-muted-foreground">
                      End-to-end encryption and secure processing
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* What You'll Get Section */}
              <div className="mt-16">
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Zap className="h-6 w-6 text-yellow-500" />
                      What You'll Get
                    </CardTitle>
                    <CardDescription>
                      Comprehensive insights to improve your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Target className="h-5 w-5 text-blue-500" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">ATS Score</h4>
                          <p className="text-sm text-muted-foreground">
                            See how well your resume passes Applicant Tracking
                            Systems
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">
                            Improvement Tips
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Actionable suggestions to make your resume stronger
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Brain className="h-5 w-5 text-purple-500" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">
                            Keyword Analysis
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Identify missing keywords for your target role
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-orange-500" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Content Review</h4>
                          <p className="text-sm text-muted-foreground">
                            Grammar, formatting, and structure analysis
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
