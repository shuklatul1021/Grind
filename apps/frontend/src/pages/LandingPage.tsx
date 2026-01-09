import { useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/accordion";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiDiscord,
} from "react-icons/si";
import {
  Zap,
  Trophy,
  Moon,
  Sun,
  SquareChevronRight,
  Bot,
  Code2,
  Globe,
  ArrowRight,
  CheckCircle2,
  Layout,
  GitBranch,
  Search,
  Star,
  Quote,
  Sparkles,
  Users,
  Github,
  Twitter,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuthentication } from "../hooks/useAuthentication";
import { useEffect, useState } from "react";
import ShinyText from "../components/react-bits/ShinyText";

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { authState } = useAuthentication();
  const user = authState.user;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/problems");
    }
  }, [authState, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary font-sans">
      {/* Refined Background */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>

      {/* Navbar - Bolt style: Clean, minimal, sticky */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/40 h-14"
            : "bg-transparent h-16"
        }`}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-7xl">
          <div
            className="flex items-center gap-2 font-bold text-lg tracking-tight cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg text-white">
              <SquareChevronRight className="h-5 w-5" />
            </div>
            <span>Grind</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="hover:text-foreground transition-colors"
            >
              Testimonials
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-8 h-8 text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            {user ? (
              <Button
                size="sm"
                onClick={() => navigate("/problems")}
                className="rounded-full px-4"
              >
                Dashboard
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="rounded-full px-4 shadow-sm"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pt-32 pb-16">
        {/* Hero Section - Centered, clean typography */}
        <section className="container mx-auto px-4 mb-24 max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-8 mb-16">
            <div className="inline-flex items-center rounded-full border border-border/50 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Grind is now live
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.1] animate-in fade-in slide-in-from-bottom-5 duration-700">
              <ShinyText
                text="Master algorithms."
                className="pb-[12px]"
                speed={2}
                delay={0}
                color="#b5b5b5"
                shineColor="#ffffff"
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={false}
              />
              <br className="hidden md:block" />
              <span className="text-muted-foreground">Build your future.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
              The most advanced platform to practice coding, prepare for
              interviews, and compete with developers worldwide.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 animate-in fade-in slide-in-from-bottom-7 duration-1000">
              <Button
                size="lg"
                className="h-11 px-6 text-base rounded-full"
                onClick={() => navigate("/auth")}
              >
                Start Coding <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-6 text-base rounded-full bg-background/50 backdrop-blur-sm"
                onClick={() => navigate("/problems")}
              >
                <Search className="mr-2 h-4 w-4" /> Explore Problems
              </Button>
            </div>
          </div>

          {/* Hero Visual - Sleek IDE Interface - Laptop Style */}
          <div className="relative mx-auto mt-24 max-w-[1024px] animate-in fade-in zoom-in-95 duration-1000 delay-200">
            <div className="relative rounded-3xl border border-white/10 bg-black p-4 md:p-10 shadow-2xl backdrop-blur-sm">
              {/* Header Text */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                  Meet Grind Editor. The pro code editor.
                </h2>
                <p className="text-lg text-muted-foreground">
                  Designed to elevate your code editing experience.
                </p>
              </div>

              {/* Laptop Bezel */}
              <div className="relative bg-[#0d0d0d] rounded-[24px] p-[10px] md:p-[14px] shadow-2xl ring-1 ring-white/10">
                {/* Camera */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-32 bg-[#0d0d0d] rounded-b-xl z-20 flex justify-center items-center border-b border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] ring-1 ring-white/5" />
                  <div className="w-1 h-1 rounded-full bg-[#0f0f0f] ml-2 opacity-50" />
                </div>

                {/* Screen Content */}
                <div className="relative bg-[#1e1e1e] rounded-[14px] overflow-hidden border border-white/5 aspect-[16/10] flex flex-col">
                  {/* Window Controls & Title Bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e1e1e] border-b border-white/5 select-none">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="text-xs text-muted-foreground/60 font-medium font-mono absolute left-1/2 -translate-x-1/2">
                      Grind Editor - two_sum.ts
                    </div>
                    <div className="w-16"></div>
                  </div>

                  <div className="flex flex-1 min-h-0">
                    {/* Activity Bar */}
                    <div className="w-12 bg-[#1e1e1e] flex flex-col items-center py-4 gap-4 border-r border-white/5 hidden sm:flex">
                      <div className="p-2 text-white/80 hover:text-white cursor-pointer relative group">
                        <Layout className="h-5 w-5" />
                      </div>
                      <div className="p-2 text-white/40 hover:text-white cursor-pointer">
                        <Search className="h-5 w-5" />
                      </div>
                      <div className="p-2 text-white/40 hover:text-white cursor-pointer">
                        <GitBranch className="h-5 w-5" />
                      </div>
                      <div className="p-2 text-white/40 hover:text-white cursor-pointer">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="mt-auto p-2 text-white/40 hover:text-white cursor-pointer">
                        <Users className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Sidebar - Explorer */}
                    <div className="w-60 bg-[#1e1e1e] hidden md:flex flex-col border-r border-white/5">
                      <div className="px-4 py-3 text-xs font-bold text-white/40 uppercase tracking-wider flex justify-between items-center group cursor-pointer hover:text-white/60">
                        <span>Explorer</span>
                      </div>
                      <div className="px-2 space-y-0.5">
                        <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-white bg-[#37373d]/50 rounded-sm cursor-pointer border-l-2 border-primary/50">
                          <SiTypescript className="h-3.5 w-3.5 text-blue-400" />
                          <span>two_sum.ts</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-white/50 hover:text-white/80 cursor-pointer hover:bg-white/5 rounded-sm border-l-2 border-transparent">
                          <SiJavascript className="h-3.5 w-3.5 text-yellow-400" />
                          <span>sum.js</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-white/50 hover:text-white/80 cursor-pointer hover:bg-white/5 rounded-sm border-l-2 border-transparent">
                          <SiPython className="h-3.5 w-3.5 text-blue-400" />
                          <span>valid_anagram.py</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-white/50 hover:text-white/80 cursor-pointer hover:bg-white/5 rounded-sm border-l-2 border-transparent">
                          <SiPython className="h-3.5 w-3.5 text-orange-400" />
                          <span>MergeSort.java</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-white/50 hover:text-white/80 cursor-pointer hover:bg-white/5 rounded-sm border-l-2 border-transparent">
                          <SiCplusplus className="h-3.5 w-3.5 text-blue-400" />
                          <span>binary_search.c</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-white/50 hover:text-white/80 cursor-pointer hover:bg-white/5 rounded-sm border-l-2 border-transparent">
                          <SiCplusplus className="h-3.5 w-3.5 text-blue-600" />
                          <span>linear_search.cpp</span>
                        </div>
                      </div>
                    </div>

                    {/* Main Editor Area */}
                    <div className="flex-1 flex flex-col bg-[#1e1e1e] min-w-0">
                      {/* Tabs */}
                      <div className="flex bg-[#1e1e1e] border-b border-white/5">
                        <div className="px-4 py-2 text-sm text-white bg-[#1e1e1e] border-t border-blue-500/50 flex items-center gap-2 min-w-fit">
                          <Code2 className="h-4 w-4 text-blue-400" />
                          two_sum.ts
                          <span className="ml-2 text-white/40 hover:text-white cursor-pointer rounded-full p-0.5 hover:bg-white/10">
                            ×
                          </span>
                        </div>
                      </div>

                      {/* Code */}
                      <div className="flex-1 p-4 font-mono text-sm overflow-hidden relative leading-6">
                        <div className="space-y-0.5">
                          <div className="flex items-start">
                            <span className="text-[#858585] w-8 select-none text-right mr-4 text-xs mt-1">
                              1
                            </span>
                            <div>
                              <span className="text-[#569cd6]">function</span>{" "}
                              <span className="text-[#dcdcaa]">twoSum</span>
                              <span className="text-[#d4d4d4]">(</span>
                              <span className="text-[#9cdcfe]">nums</span>
                              <span className="text-[#d4d4d4]">:</span>{" "}
                              <span className="text-[#4ec9b0]">number</span>
                              <span className="text-[#d4d4d4]">[],</span>{" "}
                              <span className="text-[#9cdcfe]">target</span>
                              <span className="text-[#d4d4d4]">:</span>{" "}
                              <span className="text-[#4ec9b0]">number</span>
                              <span className="text-[#d4d4d4]">):</span>{" "}
                              <span className="text-[#4ec9b0]">number</span>
                              <span className="text-[#d4d4d4]">[] {"{"}</span>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[#858585] w-8 select-none text-right mr-4 text-xs mt-1">
                              2
                            </span>
                            <span className="text-[#6a9955] italic">
                              // Create a map to store complements
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[#858585] w-8 select-none text-right mr-4 text-xs mt-1">
                              3
                            </span>
                            <div>
                              <span className="text-[#569cd6]">const</span>{" "}
                              <span className="text-[#9cdcfe]">map</span>{" "}
                              <span className="text-[#d4d4d4]">=</span>{" "}
                              <span className="text-[#569cd6]">new</span>{" "}
                              <span className="text-[#4ec9b0]">Map</span>
                              <span className="text-[#d4d4d4]">&lt;</span>
                              <span className="text-[#4ec9b0]">number</span>
                              <span className="text-[#d4d4d4]">,</span>{" "}
                              <span className="text-[#4ec9b0]">number</span>
                              <span className="text-[#d4d4d4]">&gt;();</span>
                            </div>
                          </div>
                          <div className="flex items-start h-6">
                            <span className="text-[#858585] w-8 select-none text-right mr-4 text-xs mt-1">
                              4
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[#858585] w-8 select-none text-right mr-4 text-xs mt-1">
                              5
                            </span>
                            <div>
                              <span className="text-[#c586c0]">for</span>{" "}
                              <span className="text-[#d4d4d4]">(</span>
                              <span className="text-[#569cd6]">let</span>{" "}
                              <span className="text-[#9cdcfe]">i</span>{" "}
                              <span className="text-[#d4d4d4]">=</span>{" "}
                              <span className="text-[#b5cea8]">0</span>
                              <span className="text-[#d4d4d4]">;</span>{" "}
                              <span className="text-[#9cdcfe]">i</span>{" "}
                              <span className="text-[#d4d4d4]">&lt;</span>{" "}
                              <span className="text-[#9cdcfe]">nums</span>
                              <span className="text-[#d4d4d4]">.</span>
                              <span className="text-[#9cdcfe]">length</span>
                              <span className="text-[#d4d4d4]">;</span>{" "}
                              <span className="text-[#9cdcfe]">i</span>
                              <span className="text-[#d4d4d4]">++) {"{"}</span>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[#858585] w-8 select-none text-right mr-4 text-xs mt-1">
                              6
                            </span>
                            <div className="pl-4">
                              <span className="text-[#569cd6]">const</span>{" "}
                              <span className="text-[#9cdcfe]">complement</span>{" "}
                              <span className="text-[#d4d4d4]">=</span>{" "}
                              <span className="text-[#9cdcfe]">target</span>{" "}
                              <span className="text-[#d4d4d4]">-</span>{" "}
                              <span className="text-[#9cdcfe]">nums</span>
                              <span className="text-[#d4d4d4]">[</span>
                              <span className="text-[#9cdcfe]">i</span>
                              <span className="text-[#d4d4d4]">];</span>
                            </div>
                          </div>
                          <div className="flex items-start h-6">
                            <span className="text-[#858585] w-8 select-none text-right mr-4 text-xs mt-1">
                              7
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[#858585] w-8 select-none text-right mr-4 text-xs mt-1">
                              8
                            </span>
                            <div className="pl-4">
                              <span className="text-[#c586c0]">if</span>{" "}
                              <span className="text-[#d4d4d4]">(</span>
                              <span className="text-[#9cdcfe]">map</span>
                              <span className="text-[#d4d4d4]">.</span>
                              <span className="text-[#dcdcaa]">has</span>
                              <span className="text-[#d4d4d4]">(</span>
                              <span className="text-[#9cdcfe]">complement</span>
                              <span className="text-[#d4d4d4]">)) {"{"}</span>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[#858585] w-8 select-none text-right mr-4 text-xs mt-1">
                              9
                            </span>
                            <div className="pl-8">
                              <span className="text-[#c586c0]">return</span>{" "}
                              <span className="text-[#d4d4d4]">[</span>
                              <span className="text-[#9cdcfe]">map</span>
                              <span className="text-[#d4d4d4]">.</span>
                              <span className="text-[#dcdcaa]">get</span>
                              <span className="text-[#d4d4d4]">(</span>
                              <span className="text-[#9cdcfe]">complement</span>
                              <span className="text-[#d4d4d4]">)!,</span>{" "}
                              <span className="text-[#9cdcfe]">i</span>
                              <span className="text-[#d4d4d4]">];</span>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[#858585] w-8 select-none text-right mr-4 text-xs mt-1">
                              10
                            </span>
                            <div className="pl-4">
                              <span className="text-[#d4d4d4]">{"}"}</span>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[#858585] w-8 select-none text-right mr-4 text-xs mt-1">
                              11
                            </span>
                            <div className="pl-4">
                              <span className="text-[#9cdcfe]">map</span>
                              <span className="text-[#d4d4d4]">.</span>
                              <span className="text-[#dcdcaa]">set</span>
                              <span className="text-[#d4d4d4]">(</span>
                              <span className="text-[#9cdcfe]">nums</span>
                              <span className="text-[#d4d4d4]">[</span>
                              <span className="text-[#9cdcfe]">i</span>
                              <span className="text-[#d4d4d4]">],</span>{" "}
                              <span className="text-[#9cdcfe]">i</span>
                              <span className="text-[#d4d4d4]">);</span>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[#858585] w-8 select-none text-right mr-4 text-xs mt-1">
                              12
                            </span>
                            <div className="pl-0">
                              <span className="text-[#d4d4d4]">{"}"}</span>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[#858585] w-8 select-none text-right mr-4 text-xs mt-1">
                              13
                            </span>
                            <div className="pl-0">
                              <span className="text-[#c586c0]">return</span>{" "}
                              <span className="text-[#d4d4d4]">[];</span>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <span className="text-[#858585] w-8 select-none text-right mr-4 text-xs mt-1">
                              14
                            </span>
                            <div className="pl-0">
                              <span className="text-[#d4d4d4]">{"}"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Terminal / Output */}
                      <div className="h-40 bg-[#1e1e1e] border-t border-white/5 flex flex-col">
                        <div className="flex items-center gap-4 px-4 py-2 border-b border-white/5 text-xs font-medium text-white/60">
                          <span className="text-white border-b border-white pb-2 -mb-2.5">
                            Terminal
                          </span>
                          <span className="cursor-pointer hover:text-white transition-colors">
                            Output
                          </span>
                          <span className="cursor-pointer hover:text-white transition-colors">
                            Problems
                          </span>
                          <span className="ml-auto flex items-center gap-2 text-green-400 text-[10px] md:text-xs">
                            <CheckCircle2 className="h-3 w-3" /> All Tests
                            Passed
                          </span>
                        </div>
                        <div className="p-4 font-mono text-[10px] md:text-xs text-white/80 overflow-y-auto">
                          <div className="flex gap-2">
                            <span className="text-green-400">➜</span>
                            <span>Running tests for two_sum.ts...</span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <span className="text-green-400">✔</span>
                            <span>
                              Test Case 1: [2,7,11,15], 9 - [0,1] (2ms)
                            </span>
                          </div>
                          <div className="flex gap-2 mt-1">
                            <span className="text-green-400">✔</span>
                            <span>Test Case 2: [3,2,4], 6 - [1,2] (1ms)</span>
                          </div>
                          <div className="flex gap-2 mt-1">
                            <span className="text-green-400">✔</span>
                            <span>Test Case 3: [3,3], 6 - [0,1] (1ms)</span>
                          </div>
                          <div className="mt-4 text-white/40">
                            Done in 0.45s.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Base */}
              <div className="relative z-10 w-full max-w-[1200px] mx-auto">
                <div className="mx-auto h-4 w-[75%] bg-[#1a1a1a] rounded-b-xl shadow-lg border-t border-black/50" />
                <div className="mx-auto h-[16px] w-[100%] bg-[#252525] rounded-b-xl shadow-2xl border-t border-black/20 -mt-1 flex justify-center">
                  <div className="w-[15%] h-full bg-[#333] rounded-b-[6px] border-t border-white/5" />
                </div>
              </div>

              {/* Glow behind editor */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] -z-10 opacity-40 rounded-full mix-blend-screen pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Features Grid - Bento Box Style */}
        <section
          id="features"
          className="container mx-auto px-4 py-32 max-w-7xl"
        >
          <div className="mb-20 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
              <Sparkles className="mr-2 h-3 w-3" />
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-5xl pb-[12px] font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Everything you need to excel.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete environment designed to help you master coding
              interviews and improve your algorithmic thinking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card */}
            <Card className="md:col-span-2 bg-muted/5 border-border/40 overflow-hidden relative group hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                  <Code2 className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">
                  Multi-Language Support
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Write code in your favorite language. We support JavaScript,
                  Python, Java, C++, and more with full syntax highlighting and
                  intellisense.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative min-h-[200px] flex items-end justify-end p-0 overflow-hidden">
                <div className="w-[90%] h-[90%] bg-background border-t border-l border-border/40 rounded-tl-xl shadow-2xl p-4 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-xs font-mono">
                      TypeScript
                    </span>
                    <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-mono">
                      Python
                    </span>
                    <span className="px-2 py-1 rounded bg-red-500/10 text-red-500 text-xs font-mono">
                      Java
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-2 w-1/2 bg-muted rounded animate-pulse delay-75" />
                    <div className="h-2 w-full bg-muted rounded animate-pulse delay-150" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tall Card - AI Assistant */}
            <Card className="md:row-span-2 bg-muted/5 border-border/40 overflow-hidden relative group hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                  <Bot className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">
                  AI Teaching Assistant
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Don't just get the answer. Get intelligent hints and breakdown
                  of concepts to help you learn.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-4 relative">
                <div className="space-y-4 relative z-10">
                  <div className="bg-background/80 backdrop-blur-sm p-3 rounded-2xl rounded-tl-none border border-border/40 text-sm shadow-sm">
                    <p className="text-muted-foreground text-xs mb-1">You</p>
                    <p className="text-foreground">
                      How do I optimize this O(n²) solution?
                    </p>
                  </div>
                  <div className="bg-purple-500/10 backdrop-blur-sm p-3 rounded-2xl rounded-tr-none border border-purple-500/20 text-sm ml-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="h-3 w-3 text-purple-500" />
                      <p className="text-purple-500 text-xs font-medium">
                        AI Assistant
                      </p>
                    </div>
                    <p className="text-foreground/90">
                      Consider using a{" "}
                      <span className="text-purple-400 font-mono">HashMap</span>{" "}
                      to store visited elements. This allows O(1) lookups,
                      reducing overall complexity to O(n).
                    </p>
                  </div>
                  <div className="bg-background/80 backdrop-blur-sm p-3 rounded-2xl rounded-tl-none border border-border/40 text-sm shadow-sm opacity-60">
                    <p className="text-muted-foreground text-xs mb-1">You</p>
                    <div className="h-2 w-24 bg-muted rounded animate-pulse" />
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />
              </CardContent>
            </Card>

            {/* Small Card - Instant Execution */}
            <Card className="bg-muted/5 border-border/40 overflow-hidden relative group hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 text-green-500 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6" />
                </div>
                <CardTitle>Instant Execution</CardTitle>
                <CardDescription>
                  Run code in isolated sandboxes with &lt;50ms latency.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 relative h-24 overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-full bg-background/50 border-t border-border/40 p-3 font-mono text-xs text-green-400">
                  <div className="flex items-center gap-2 mb-1 opacity-50">
                    <span>$</span>
                    <span className="text-foreground">run solution.ts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>&gt;</span>
                    <span>Tests passed: 15/15</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span>&gt;</span>
                    <span>Runtime: 42ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Small Card - Leaderboards */}
            <Card className="bg-muted/5 border-border/40 overflow-hidden relative group hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 text-orange-500 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="h-6 w-6" />
                </div>
                <CardTitle>Global Leaderboards</CardTitle>
                <CardDescription>
                  Compete in weekly contests and climb the global ranks.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-background/50 border border-border/40">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 font-bold">#1</span>
                      <div className="w-6 h-6 rounded-full bg-yellow-500/20" />
                      <span className="text-sm font-medium">Ram D.</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      2850 pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-background/50 border border-border/40 opacity-60">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-bold">
                        #2
                      </span>
                      <div className="w-6 h-6 rounded-full bg-muted" />
                      <span className="text-sm font-medium">Mark Z.</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      2720 pts
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wide Card - System Design */}
            <Card className="md:col-span-3 bg-muted/5 border-border/40 overflow-hidden relative group hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <CardHeader className="relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 text-pink-500 group-hover:scale-110 transition-transform duration-300">
                    <Layout className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">
                    System Design & Architecture
                  </CardTitle>
                  <CardDescription className="text-base mt-2 max-w-lg">
                    Master high-level architecture with our interactive
                    whiteboard. Practice designing scalable systems like
                    Netflix, Uber, or Twitter with real-time feedback.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 md:p-6 relative min-h-[200px] flex items-center justify-center">
                  {/* Abstract System Design Diagram */}
                  <div className="relative w-full max-w-md aspect-video bg-background/50 rounded-lg border border-border/40 p-4 shadow-sm overflow-hidden">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-2 border-blue-500/30 flex items-center justify-center bg-blue-500/10">
                      <span className="text-[10px] text-blue-500">LB</span>
                    </div>

                    {/* Connecting lines */}
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-border" />
                    <div className="absolute top-28 left-1/4 right-1/4 h-0.5 bg-border" />
                    <div className="absolute top-28 left-1/4 w-0.5 h-4 bg-border" />
                    <div className="absolute top-28 right-1/4 w-0.5 h-4 bg-border" />

                    <div className="absolute top-32 left-[20%] w-12 h-12 rounded bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                      <span className="text-[10px] text-green-500">App</span>
                    </div>
                    <div className="absolute top-32 right-[20%] w-12 h-12 rounded bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                      <span className="text-[10px] text-green-500">App</span>
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                      <span className="text-[10px] text-orange-500">
                        Database Cluster
                      </span>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="container mx-auto px-4 py-24 max-w-7xl border-t border-border/40"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Loved by developers
            </h2>
            <p className="text-lg text-muted-foreground">
              Here's what our community has to say about Grind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya Sharma",
                role: "CS Student",
                content:
                  "Grind was instrumental in my interview prep. The AI hints are a game changer - they help you learn without giving away the answer.",
                avatar: "PS",
              },
              {
                name: "Arjun Patel",
                role: "CS Student",
                content:
                  "The UI is incredibly clean and the editor experience is top-notch. It feels just like VS Code, which makes practicing so much more comfortable.",
                avatar: "AP",
              },
              {
                name: "Rohan Kumar",
                role: "CS Student",
                content:
                  "I've tried LeetCode and HackerRank, but Grind's curated problem sets and learning paths are superior. Highly recommend!",
                avatar: "RK",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="bg-muted/5 border-border/40">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-yellow-500 mt-2">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <Quote className="absolute top-0 left-0 h-8 w-8 text-muted-foreground/10 -translate-y-1/2 translate-x-2" />
                  <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="container mx-auto px-4 py-24 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Frequently asked questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Is Grind suitable for beginners?
              </AccordionTrigger>
              <AccordionContent>
                Yes! We have a dedicated "Beginner's Track" that starts with the
                basics of programming and gradually introduces algorithms and
                data structures.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                How does the AI assistant work?
              </AccordionTrigger>
              <AccordionContent>
                Our AI analyzes your code in real-time and provides contextual
                hints. It won't just give you the answer; instead, it guides you
                toward the solution, helping you build problem-solving skills.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I use Grind for free?</AccordionTrigger>
              <AccordionContent>
                Absolutely. Our Free tier gives you access to a curated list of
                problems and basic features. You can upgrade to Pro whenever you
                need more advanced tools.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                What programming languages are supported?
              </AccordionTrigger>
              <AccordionContent>
                We currently support JavaScript, TypeScript, Python, Java, C++,
                Go, and Rust. We're constantly adding support for more
                languages.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA Section - Clean & Direct */}
        <section className="container mx-auto px-4 py-24 max-w-5xl">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-muted/50 to-muted/10 border border-border/40 p-12 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg bg-primary/5 blur-3xl -z-10" />

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Ready to start your journey?
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Join thousands of developers mastering algorithms today. Start for
              free, no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-12 px-8 text-base rounded-full w-full sm:w-auto"
                onClick={() => navigate("/auth")}
              >
                Get Started for Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base rounded-full w-full sm:w-auto bg-background/50"
                onClick={() => navigate("/problems")}
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 bg-background py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                  <SquareChevronRight className="h-5 w-5" />
                </div>
                <span>Grind</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Master algorithms and build your future with the world's best
                coding platform.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <GitBranch className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="text-left">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide dark:text-foreground">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/problems")}
                  >
                    Problems
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/leaderboard")}
                  >
                    Leaderboard
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/contests")}
                  >
                    Contests
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/compiler")}
                  >
                    Compiler
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/grindai")}
                  >
                    Grind AI
                  </button>
                </li>
              </ul>
            </div>
            <div className="text-left">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide dark:text-foreground">
                Resources
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/community")}
                  >
                    Community
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/blog")}
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/faq")}
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/feedback")}
                  >
                    Feedback
                  </button>
                </li>
              </ul>
            </div>

            <div className="text-left">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide dark:text-foreground">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/about")}
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/terms-and-conditions")}
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/privacy-policy")}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/cancellation-policy")}
                  >
                    Cancellation & Refunds
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/shipping-policy")}
                  >
                    Shipping Policy
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground"
                    onClick={() => navigate("/contact-us")}
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border/40 text-sm text-muted-foreground">
            <p>© 2026 Grind Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="hover:text-foreground transition-colors">
                <Twitter className="" />
              </button>
              <button className="hover:text-foreground transition-colors">
                <Github />
              </button>
              <button className="hover:text-foreground transition-colors">
                <SiDiscord className="text-[25px]" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
