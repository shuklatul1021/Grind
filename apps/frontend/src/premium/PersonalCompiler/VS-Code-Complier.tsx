import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/button";
import LogoLoop from "../../components/react-bits/LogoLoop";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiGo,
  SiRust,
  SiRuby,
  SiPhp,
  SiSwift,
  SiKotlin,
  SiR,
  SiDart,
  SiScala,
  SiPerl,
  SiHaskell,
  SiElixir,
  SiClojure,
  SiLua,
  SiAssemblyscript,
  SiFsharp,
  SiOcaml,
  SiReact,
  SiNextdotjs,
  SiDocker,
} from "react-icons/si";
import { Card, CardContent } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import {
  ChevronLeft,
  Code2,
  Terminal,
  FileCode,
  Maximize2,
  Minimize2,
  AlertCircle,
  Save,
  Play,
  FolderGit2,
  Settings,
  Download,
  Upload,
  GitBranch,
  Package,
  Lock,
  Sparkles,
  Zap,
  CheckCircle2,
  Cloud,
  Database,
  Boxes,
  Cpu,
  HardDrive,
  Network,
  Shield,
} from "lucide-react";
import { Alert, AlertDescription } from "@repo/ui/alert";

interface PersonalCompilerProps {
  codeServerUrl?: string; 
  userId?: string;
  workspaceId?: string;
}

const FEATURES = [
  {
    icon: Code2,
    title: "Full VS Code Experience",
    description: "Complete IDE with IntelliSense, debugging, and extensions",
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    icon: Terminal,
    title: "Integrated Terminal",
    description: "Run commands, scripts, and build tools directly in browser",
    color: "text-green-500 bg-green-500/10",
  },
  {
    icon: Cloud,
    title: "Cloud Workspace",
    description: "Access your code from anywhere, automatically synced",
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    icon: GitBranch,
    title: "Git Integration",
    description: "Full Git support with commits, branches, and merges",
    color: "text-orange-500 bg-orange-500/10",
  },
  {
    icon: Package,
    title: "Package Management",
    description: "Install and manage npm, pip, and other packages",
    color: "text-cyan-500 bg-cyan-500/10",
  },
  {
    icon: Shield,
    title: "Secure & Isolated",
    description: "Your own private environment with enterprise security",
    color: "text-red-500 bg-red-500/10",
  },
];


const LANGUAGES = [
  {
    node: <SiJavascript className="text-yellow-400" />,
    title: "JavaScript",
    href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    node: <SiTypescript className="text-blue-500" />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: <SiPython className="text-blue-400" />,
    title: "Python",
    href: "https://www.python.org",
  },
  // {
  //   node: <SiJava className="text-red-500" />,
  //   title: "Java",
  //   href: "https://www.java.com",
  // },
  {
    node: <SiCplusplus className="text-blue-600" />,
    title: "C++",
    href: "https://isocpp.org",
  },
  {
    node: <SiGo className="text-cyan-400" />,
    title: "Go",
    href: "https://go.dev",
  },
  {
    node: <SiRust className="text-orange-600" />,
    title: "Rust",
    href: "https://www.rust-lang.org",
  },
  {
    node: <SiRuby className="text-red-600" />,
    title: "Ruby",
    href: "https://www.ruby-lang.org",
  },
  {
    node: <SiPhp className="text-indigo-500" />,
    title: "PHP",
    href: "https://www.php.net",
  },
  {
    node: <SiNextdotjs className="text-white" />,
    title: "Next.js",
    href: "https://nextjs.org",
  },
  {
    node: <SiReact className="text-blue-500" />,
    title: "React",
    href: "https://reactjs.org",
  },
  // {
  //   node: <SiCsharp className="text-purple-600" />,
  //   title: "C#",
  //   href: "https://docs.microsoft.com/en-us/dotnet/csharp",
  // },
  {
    node: <SiR className="text-blue-500" />,
    title: "R",
    href: "https://www.r-project.org",
  },
  {
    node: <SiDart className="text-cyan-500" />,
    title: "Dart",
    href: "https://dart.dev",
  },
  {
    node: <SiScala className="text-red-600" />,
    title: "Scala",
    href: "https://www.scala-lang.org",
  },
  {
    node: <SiPerl className="text-blue-400" />,
    title: "Perl",
    href: "https://www.perl.org",
  },
  {
    node: <SiDocker className="text-blue-500" />,
    title: "Docker",
    href: "https://www.docker.com",
  },
  {
    node: <SiElixir className="text-purple-600" />,
    title: "Elixir",
    href: "https://elixir-lang.org",
  },
  {
    node: <SiClojure className="text-blue-500" />,
    title: "Clojure",
    href: "https://clojure.org",
  },
  {
    node: <SiLua className="text-blue-600" />,
    title: "Lua",
    href: "https://www.lua.org",
  },
  {
    node: <SiAssemblyscript className="text-blue-500" />,
    title: "AssemblyScript",
    href: "https://www.assemblyscript.org",
  },
  {
    node: <SiFsharp className="text-blue-500" />,
    title: "F#",
    href: "https://fsharp.org",
  },
  {
    node: <SiOcaml className="text-orange-500" />,
    title: "OCaml",
    href: "https://ocaml.org",
  },
];

export default function PersonalCompiler({
  codeServerUrl = "http://localhost:8080",
  userId,
  workspaceId,
}: PersonalCompilerProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string>("");

  useEffect(() => {
    const constructUrl = () => {
      try {
        let url = codeServerUrl;
        if (workspaceId) {
          url += `/?folder=/home/coder/workspaces/${workspaceId}`;
        } else if (userId) {
          url += `/?folder=/home/coder/workspaces/user-${userId}`;
        }

        setIframeUrl(url);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to initialize VS Code environment");
        setIsLoading(false);
      }
    };

    constructUrl();
  }, [codeServerUrl, userId, workspaceId]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setError("Failed to load VS Code. Please check if code-server is running.");
    setIsLoading(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="h-14 border-b border-border/40 bg-background/95 backdrop-blur flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
              <Lock className="h-3 w-3 mr-1" />
              Premium
            </Badge>
            <span className="text-sm font-medium">Personal Compiler</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save All
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              <Minimize2 className="h-4 w-4 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
        </div>

        {/* VS Code Iframe */}
        <div className="h-[calc(100vh-56px)]">
          {isLoading && (
            <div className="flex items-center justify-center h-full bg-muted">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">
                  Loading VS Code environment...
                </p>
              </div>
            </div>
          )}

          {iframeUrl && (
            <iframe
              src={iframeUrl}
              className="w-full h-full border-0"
              title="VS Code Personal Compiler"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-modals allow-popups"
              allow="clipboard-read; clipboard-write"
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Navbar */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6 max-w-[1800px] mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 rounded-full hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <FolderGit2 className="h-4 w-4" />
              My Workspaces
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto px-6 py-12 md:py-20 max-w-[1800px]">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-4 py-2 text-sm font-medium mb-6">
            <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
            Premium Feature - Full Cloud IDE
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Personal{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Compiler
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Your own VS Code environment in the cloud. Code, compile, and deploy
            from anywhere with enterprise-grade infrastructure.
          </p>
        </div>
        {error && (
          <Alert variant="destructive" className="mb-8 max-w-4xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* VS Code Editor Section */}
        <div className="mb-16">
          <Card className="border-border/40 bg-card/50 backdrop-blur mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Play className="h-4 w-4" />
                    Run
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Terminal className="h-4 w-4" />
                    Terminal
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileCode className="h-4 w-4" />
                    New File
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <GitBranch className="h-4 w-4" />
                    Git
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={toggleFullscreen}
                  >
                    <Maximize2 className="h-4 w-4" />
                    Fullscreen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* VS Code Iframe */}
          <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur h-[600px] lg:h-[700px]">
            {isLoading && (
              <div className="flex items-center justify-center h-full bg-muted">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">
                    Initializing your workspace...
                  </p>
                </div>
              </div>
            )}

            {iframeUrl && (
              <iframe
                src={iframeUrl}
                className="w-full h-full border-0"
                title="VS Code Personal Compiler"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-modals allow-popups"
                allow="clipboard-read; clipboard-write"
              />
            )}
          </Card>
        </div>

        {/* Supported Languages */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Supported Languages
          </h2>
          <div className="max-w-6xl mx-auto">
            <div
              style={{
                height: "120px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <LogoLoop
                logos={LANGUAGES}
                speed={60}
                direction="left"
                logoHeight={56}
                gap={48}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                ariaLabel="Supported programming languages"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Code
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional development environment with enterprise features
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="border-border/40 bg-card/50 backdrop-blur hover:shadow-lg transition-all group"
                >
                  <CardContent className="pt-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.color} mb-4 group-hover:scale-110 transition-transform`}
                    >
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

        {/* Keyboard Shortcuts */}
        <Card className="border-border/40 bg-card/50 backdrop-blur mb-16 max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-500" />
              Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Save File
                  </span>
                  <kbd className="px-3 py-1.5 bg-muted rounded text-sm font-mono">
                    Ctrl+S
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Quick Open
                  </span>
                  <kbd className="px-3 py-1.5 bg-muted rounded text-sm font-mono">
                    Ctrl+P
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Toggle Terminal
                  </span>
                  <kbd className="px-3 py-1.5 bg-muted rounded text-sm font-mono">
                    Ctrl+`
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Find</span>
                  <kbd className="px-3 py-1.5 bg-muted rounded text-sm font-mono">
                    Ctrl+F
                  </kbd>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Command Palette
                  </span>
                  <kbd className="px-3 py-1.5 bg-muted rounded text-sm font-mono">
                    Ctrl+Shift+P
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Multi-cursor
                  </span>
                  <kbd className="px-3 py-1.5 bg-muted rounded text-sm font-mono">
                    Ctrl+D
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Comment Line
                  </span>
                  <kbd className="px-3 py-1.5 bg-muted rounded text-sm font-mono">
                    Ctrl+/
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Format Document
                  </span>
                  <kbd className="px-3 py-1.5 bg-muted rounded text-sm font-mono">
                    Shift+Alt+F
                  </kbd>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits CTA */}
        <Card className="border-border/40 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur mb-16">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4">
                  <Zap className="h-3 w-3 mr-1" />
                  Premium Workspace
                </Badge>
                <h2 className="text-3xl font-bold mb-4">
                  Code Anywhere, Anytime
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your personal cloud IDE with powerful compute resources,
                  automatic backups, and seamless synchronization across
                  devices.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Persistent workspace with automatic saves</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Pre-installed compilers and runtimes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Unlimited extensions and customization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>24/7 availability with 99.9% uptime</span>
                  </div>
                </div>
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Learn More
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-border/40 bg-background/50">
                  <CardContent className="p-6 text-center">
                    <Boxes className="h-10 w-10 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold mb-1">50+</div>
                    <div className="text-sm text-muted-foreground">
                      Extensions
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/40 bg-background/50">
                  <CardContent className="p-6 text-center">
                    <Cloud className="h-10 w-10 mx-auto mb-2 text-cyan-500" />
                    <div className="text-2xl font-bold mb-1">100GB</div>
                    <div className="text-sm text-muted-foreground">Storage</div>
                  </CardContent>
                </Card>
                <Card className="border-border/40 bg-background/50">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-10 w-10 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold mb-1">Secure</div>
                    <div className="text-sm text-muted-foreground">
                      Enterprise
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/40 bg-background/50">
                  <CardContent className="p-6 text-center">
                    <Cpu className="h-10 w-10 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold mb-1">8 vCPU</div>
                    <div className="text-sm text-muted-foreground">Power</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final CTA */}
        <Card className="border-border/40 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6">
              <Code2 className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Start Coding in the Cloud Today
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get your own personal compiler with full VS Code functionality.
              Perfect for learning, practicing, and building projects from
              anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <FolderGit2 className="h-5 w-5" />
                View Documentation
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Included with Premium • Enterprise-grade security • 24/7 support
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
