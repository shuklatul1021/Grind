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
  SiGo,
  SiRust,
  SiRuby,
  SiPhp,
  SiR,
  SiDart,
  SiScala,
  SiPerl,
  SiElixir,
  SiClojure,
  SiLua,
  SiAssemblyscript,
  SiFsharp,
  SiOcaml,
  SiReact,
  SiNextdotjs,
  SiDocker,
  SiDiscord,
} from "react-icons/si";
import {
  Zap,
  Trophy,
  Moon,
  Sun,
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
  Github,
  Twitter,
  BookOpen,
  GraduationCap,
  Briefcase,
  Target,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuthentication } from "../hooks/useAuthentication";
import { useEffect, useState, useRef, type ReactNode } from "react";
import ShinyText from "../components/react-bits/ShinyText";
import { motion } from "framer-motion";

function FadeInCard({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SlideInText({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FloatingElement({
  children,
  delay = 0,
  duration = 4,
  yOffset = 15,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}) {
  return (
    <motion.div
      animate={{ y: [0, -yOffset, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AnimatedCounter({
  end,
  suffix = "",
  label,
}: {
  end: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, end]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
        {count.toLocaleString()}
        {suffix}
      </div>
      <p className="text-sm text-muted-foreground mt-2 font-medium">{label}</p>
    </div>
  );
}

function LogoMarquee() {
  const logos = [
    { icon: <SiJavascript className="h-5 w-5" />, name: "JavaScript" },
    { icon: <SiTypescript className="h-5 w-5" />, name: "TypeScript" },
    { icon: <SiPython className="h-5 w-5" />, name: "Python" },
    { icon: <SiCplusplus className="h-5 w-5" />, name: "C++" },
    { icon: <SiGo className="h-5 w-5" />, name: "Go" },
    { icon: <SiRust className="h-5 w-5" />, name: "Rust" },
    { icon: <SiRuby className="h-5 w-5" />, name: "Ruby" },
    { icon: <SiPhp className="h-5 w-5" />, name: "PHP" },
    { icon: <SiR className="h-5 w-5" />, name: "R" },
    { icon: <SiDart className="h-5 w-5" />, name: "Dart" },
    { icon: <SiScala className="h-5 w-5" />, name: "Scala" },
    { icon: <SiPerl className="h-5 w-5" />, name: "Perl" },
    { icon: <SiElixir className="h-5 w-5" />, name: "Elixir" },
    { icon: <SiClojure className="h-5 w-5" />, name: "Clojure" },
    { icon: <SiLua className="h-5 w-5" />, name: "Lua" },
    { icon: <SiAssemblyscript className="h-5 w-5" />, name: "Assembly" },
    { icon: <SiFsharp className="h-5 w-5" />, name: "F#" },
    { icon: <SiOcaml className="h-5 w-5" />, name: "OCaml" },
    { icon: <SiReact className="h-5 w-5" />, name: "React" },
    { icon: <SiNextdotjs className="h-5 w-5" />, name: "Next.js" },
    { icon: <SiDocker className="h-5 w-5" />, name: "Docker" },
  ];
  const doubled = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden py-8 border-y border-border/30">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((logo, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 mx-8 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors duration-300"
          >
            {logo.icon}
            <span className="text-sm font-medium tracking-wide">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      {/* ── Background Grid + Glow ── */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-background">
        <div className="absolute h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-foreground/5 opacity-30 blur-[100px]" />
        <div className="absolute right-1/4 top-1/3 -z-10 h-[200px] w-[200px] rounded-full bg-foreground/3 opacity-20 blur-[80px]" />
      </div>

      {/* ── Navbar ── */}
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
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background">
              <div className="h-8 w-8 overflow-hidden rounded-lg border border-border/60 bg-background p-0.5 shadow-sm">
                <img
                  src="/new_logo.jpg"
                  alt="Grind logo"
                  className="h-full w-full rounded-md object-cover"
                />
              </div>
            </div>
            <span>Grind</span>
          </div>

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
                  variant="ghost"
                  onClick={() => navigate("/auth")}
                  className="rounded-full px-4 hidden md:inline-flex"
                >
                  Log in
                </Button>
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
        {/* ═════════ HERO ═════════ */}
        <section className="container mx-auto px-4 mb-32 max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-8 mb-16">
            {/* Live Badge */}
            <div className="inline-flex items-center rounded-full border border-border/50 bg-muted/30 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              Grind is now live — start coding today
            </div>

            {/* Headline — Bolt style: muted + bold contrast */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.1] animate-in fade-in slide-in-from-bottom-5 duration-700">
              <span className="text-muted-foreground">Practice coding.</span>
              <br />
              <ShinyText
                text="Master interviews."
                className="pb-[4px]"
                speed={2}
                delay={0}
                color="#b5b5b5"
                shineColor="#ffffff"
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={false}
              />
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/50">
                Ship your career.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
              The most advanced platform to practice algorithms, compete in
              contests, and prepare for technical interviews — all in one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 animate-in fade-in slide-in-from-bottom-7 duration-1000">
              <Button
                size="lg"
                className="h-12 px-8 text-base rounded-full bg-foreground text-background hover:bg-foreground/90 border-0 shadow-lg shadow-foreground/10"
                onClick={() => navigate("/auth")}
              >
                Start Coding <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base rounded-full bg-background/50 backdrop-blur-sm"
                onClick={() => navigate("/problems")}
              >
                <Search className="mr-2 h-4 w-4" /> Explore Problems
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex -space-x-2">
                {["#555", "#444", "#666", "#777"].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: c }}
                  >
                    {["P", "A", "R", "S"][i]}
                  </div>
                ))}
              </div>
              <span>
                Trusted by <strong className="text-foreground">10,000+</strong>{" "}
                developers
              </span>
            </div>
          </div>

          {/* ── Hero Visual — IDE Mockup ── */}
          <div className="relative mx-auto mt-20 max-w-[1024px] animate-in fade-in zoom-in-95 duration-1000 delay-200">
            <FloatingElement duration={5} yOffset={25}>
              {/* Outer glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-foreground/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

              <div className="relative rounded-2xl border border-border/30 bg-card/80 backdrop-blur-xl p-6 md:p-10 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
                    Meet the{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                      Grind Editor
                    </span>
                  </h2>
                  <p className="text-muted-foreground">
                    A professional-grade code editor, right in your browser.
                  </p>
                </div>

                {/* Editor Preview */}
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-inner transform perspective-[2000px] rotate-x-[1deg] rotate-y-[-1deg]">
                  <img
                    src="/code-editor-image.png"
                    alt="Grind code editor preview"
                    className="block w-full h-auto object-cover"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </div>
            </FloatingElement>
          </div>
        </section>

        {/* ═════════ LOGO MARQUEE ═════════ */}
        <LogoMarquee />

        {/* ═════════ STATS — Bolt "98%" Style ═════════ */}
        <section className="container mx-auto px-4 py-28 max-w-7xl overflow-hidden">
          <div className="text-center mb-16">
            <SlideInText delay={0}>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                <span className="text-muted-foreground">
                  Empowering developers with
                </span>
                <br />
                <span className="text-foreground">
                  the most powerful coding platform
                </span>
              </h2>
            </SlideInText>
            <SlideInText delay={0.1}>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Grind does the heavy lifting for you, so you can focus on
                learning instead of fighting setups.
              </p>
            </SlideInText>
          </div>

          {/* Bento Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Big stat card */}
            <FadeInCard delay={0.2} className="h-full">
              <FloatingElement
                delay={0}
                duration={6}
                yOffset={10}
                className="h-full"
              >
                <Card className="h-full bg-muted/5 border-border/30 overflow-hidden relative group hover:border-border/60 transition-all duration-500 hover:-translate-y-1">
                  <CardContent className="p-10 text-center h-full flex flex-col justify-center">
                    <div className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40 mb-4 transition-transform duration-500 group-hover:scale-105">
                      500+
                    </div>
                    <p className="text-lg text-muted-foreground font-medium transition-colors duration-300 group-hover:text-foreground">
                      curated problems
                    </p>
                    <p className="text-sm text-muted-foreground/60 mt-2 max-w-sm mx-auto group-hover:text-muted-foreground transition-colors duration-300">
                      From easy warmups to FAANG-level challenges, covering
                      every data structure and algorithm pattern.
                    </p>
                  </CardContent>
                </Card>
              </FloatingElement>
            </FadeInCard>

            {/* Build big card */}
            <FadeInCard delay={0.4} className="h-full">
              <FloatingElement
                delay={1}
                duration={7}
                yOffset={12}
                className="h-full"
              >
                <Card className="h-full bg-muted/5 border-border/30 overflow-hidden relative group hover:border-border/60 transition-all duration-500 hover:-translate-y-1">
                  <CardHeader className="pb-2 transition-colors duration-300 group-hover:text-foreground">
                    <CardTitle className="text-xl">
                      Build skills without breaking flow
                    </CardTitle>
                    <CardDescription className="text-base">
                      Grind handles{" "}
                      <strong className="text-foreground">complexity</strong> so
                      you stay focused. Our intelligent problem recommendations
                      adapt to your level in real-time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 flex items-center justify-center flex-1">
                    <div className="grid grid-cols-3 gap-3 w-full">
                      {["Easy", "Medium", "Hard"].map((d, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="rounded-lg bg-background/50 border border-border/30 p-4 text-center transition-all duration-300 group-hover:bg-muted/10 cursor-default"
                        >
                          <div className="text-2xl font-bold text-foreground">
                            {[150, 250, 100][i]}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {d}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </FloatingElement>
            </FadeInCard>
          </div>
        </section>

        <section
          id="features"
          className="container mx-auto px-4 py-28 max-w-7xl border-t border-border/30 overflow-hidden"
        >
          <div className="mb-16 text-center">
            <SlideInText delay={0}>
              <div className="inline-flex items-center rounded-full border border-border/40 bg-muted/20 px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
                <Sparkles className="mr-2 h-3 w-3" />
                Powerful Features
              </div>
            </SlideInText>
            <SlideInText delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                <span className="text-muted-foreground">
                  Everything you need to
                </span>{" "}
                <span className="text-foreground">excel.</span>
              </h2>
            </SlideInText>
            <SlideInText delay={0.2}>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A complete environment designed to help you master coding
                interviews and sharpen algorithmic thinking.
              </p>
            </SlideInText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Large card: Multi-Language */}
            <FadeInCard delay={0.3} className="md:col-span-2 h-full">
              <Card className="h-full bg-muted/5 border-border/30 overflow-hidden relative group hover:border-border/60 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4 text-foreground group-hover:scale-110 transition-transform duration-500 group-hover:bg-white/20">
                    <Code2 className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl transition-colors duration-300 group-hover:text-foreground">
                    Multi-Language Support
                  </CardTitle>
                  <CardDescription className="text-base mt-2 group-hover:text-muted-foreground transition-colors duration-300">
                    Write code in your favorite language. We support JavaScript,
                    Python, Java, C++, and more with full syntax highlighting
                    and intellisense.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative min-h-[200px] flex items-end justify-end p-0 overflow-hidden mt-auto">
                  <div className="w-[90%] h-[90%] bg-background border-t border-l border-border/40 rounded-tl-xl shadow-2xl p-4 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500">
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-1 rounded bg-muted text-foreground text-xs font-mono">
                        TypeScript
                      </span>
                      <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-mono">
                        Python
                      </span>
                      <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-mono">
                        Java
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-3/4 bg-muted rounded animate-pulse" />
                      <div className="h-2 w-1/2 bg-muted rounded animate-pulse" />
                      <div className="h-2 w-full bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInCard>

            {/* Tall card: AI */}
            <FadeInCard delay={0.4} className="md:row-span-2 h-full">
              <Card className="h-full bg-muted/5 border-border/30 overflow-hidden relative group hover:border-border/60 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-1 flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4 text-foreground group-hover:scale-110 transition-transform duration-500 group-hover:bg-white/20">
                    <Bot className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl transition-colors duration-300 group-hover:text-foreground">
                    AI Teaching Assistant
                  </CardTitle>
                  <CardDescription className="text-base mt-2 group-hover:text-muted-foreground transition-colors duration-300">
                    Don't just get the answer. Get intelligent hints and concept
                    breakdowns to help you learn.
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-4 relative flex-1">
                  <div className="space-y-4 relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                    <div className="bg-background/80 backdrop-blur-sm p-3 rounded-2xl rounded-tl-none border border-border/40 text-sm shadow-sm group-hover:border-border/80 transition-colors">
                      <p className="text-muted-foreground text-xs mb-1">You</p>
                      <p className="text-foreground">
                        How do I optimize this O(n²) solution?
                      </p>
                    </div>
                    <div className="bg-muted/50 backdrop-blur-sm p-3 rounded-2xl rounded-tr-none border border-border/40 text-sm ml-4 shadow-sm group-hover:border-border/80 transition-colors delay-75">
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="h-3 w-3 text-muted-foreground" />
                        <p className="text-muted-foreground text-xs font-medium">
                          AI Assistant
                        </p>
                      </div>
                      <p className="text-foreground/90">
                        Consider using a{" "}
                        <span className="text-foreground font-mono font-semibold">
                          HashMap
                        </span>{" "}
                        to store visited elements.
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-1/2 right-0 w-32 h-32 bg-foreground/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-foreground/20 transition-colors duration-500" />
                </CardContent>
              </Card>
            </FadeInCard>

            {/* Instant Execution */}
            <FadeInCard delay={0.5} className="h-full">
              <Card className="h-full bg-muted/5 border-border/30 overflow-hidden relative group hover:border-border/60 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4 text-foreground group-hover:scale-110 transition-transform duration-500 group-hover:bg-white/20">
                    <Zap className="h-6 w-6" />
                  </div>
                  <CardTitle className="transition-colors duration-300 group-hover:text-foreground">
                    Instant Execution
                  </CardTitle>
                  <CardDescription className="group-hover:text-muted-foreground transition-colors duration-300">
                    Run code in isolated sandboxes with &lt;50ms latency.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 relative h-28 overflow-hidden mt-auto">
                  <div className="absolute inset-x-0 bottom-0 h-full bg-background/50 border-t border-border/40 p-3 font-mono text-xs text-muted-foreground transition-transform duration-500 group-hover:translate-y-1">
                    <div className="flex items-center gap-2 mb-1 opacity-50">
                      <span>$</span>
                      <span className="text-foreground">run solution.ts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>&gt;</span>
                      <span className="text-green-500/80 group-hover:text-green-500 transition-colors">
                        Tests passed: 15/15
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span>&gt;</span>
                      <span className="group-hover:text-white transition-colors">
                        Runtime: 42ms
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInCard>

            {/* Leaderboards */}
            <FadeInCard delay={0.6} className="h-full">
              <Card className="h-full bg-muted/5 border-border/30 overflow-hidden relative group hover:border-border/60 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4 text-foreground group-hover:scale-110 transition-transform duration-500 group-hover:bg-white/20">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <CardTitle className="transition-colors duration-300 group-hover:text-foreground">
                    Global Leaderboards
                  </CardTitle>
                  <CardDescription className="group-hover:text-muted-foreground transition-colors duration-300">
                    Compete in weekly contests and climb the ranks.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 h-full flex flex-col justify-end">
                  <div className="space-y-2 transition-transform duration-500 group-hover:-translate-y-1">
                    <div className="flex items-center justify-between p-2 rounded bg-background/50 border border-border/40 group-hover:border-border/60 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-bold">#1</span>
                        <div className="w-6 h-6 rounded-full bg-foreground/20 group-hover:bg-foreground/40 transition-colors" />
                        <span className="text-sm font-medium">Ram D.</span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        2850 pts
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInCard>

            {/* Wide card: System Design */}
            <FadeInCard delay={0.7} className="md:col-span-3 h-full">
              <Card className="h-full md:col-span-3 bg-muted/5 border-border/30 overflow-hidden relative group hover:border-border/60 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-white/[0.01] to-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="grid md:grid-cols-2 gap-6 items-center h-full">
                  <CardHeader className="relative z-10 h-full flex flex-col justify-center">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4 text-foreground group-hover:scale-110 transition-transform duration-500 group-hover:bg-white/20">
                      <Layout className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl transition-colors duration-300 group-hover:text-foreground">
                      System Design & Architecture
                    </CardTitle>
                    <CardDescription className="text-base mt-2 max-w-lg group-hover:text-muted-foreground transition-colors duration-300">
                      Master high-level architecture with our interactive
                      whiteboard. Practice designing scalable systems like
                      Netflix, Uber, or Twitter.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 md:p-6 relative min-h-[200px] md:min-h-[250px] flex items-center justify-center">
                    <div className="relative w-full max-w-md aspect-[16/10] bg-background/50 rounded-lg border border-border/40 p-4 shadow-sm overflow-hidden group-hover:scale-[1.03] transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20 z-0" />
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors duration-500 z-10">
                        <span className="text-[10px] text-white/70">LB</span>
                      </div>
                      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-border group-hover:bg-foreground/30 transition-colors duration-500" />
                      <div className="absolute top-28 left-1/4 right-1/4 h-0.5 bg-border group-hover:bg-foreground/30 transition-colors duration-500" />
                      <div className="absolute top-28 left-1/4 w-0.5 h-4 bg-border group-hover:bg-foreground/30 transition-colors duration-500" />
                      <div className="absolute top-28 right-1/4 w-0.5 h-4 bg-border group-hover:bg-foreground/30 transition-colors duration-500" />
                      <div className="absolute top-32 left-[15%] w-16 h-12 rounded bg-white/5 border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-500 z-10">
                        <span className="text-[10px] text-white/70">App 1</span>
                      </div>
                      <div className="absolute top-32 right-[15%] w-16 h-12 rounded bg-white/5 border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-500 z-10">
                        <span className="text-[10px] text-white/70">App 2</span>
                      </div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-12 rounded-xl bg-white/5 border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-500 z-10">
                        <span className="text-[10px] text-white/70">
                          Database Cluster
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </FadeInCard>
          </div>
        </section>

        {/* ═════════ "WHATEVER YOUR ROLE" — Bolt Superpowers Section ═════════ */}
        <section className="container mx-auto px-4 py-28 max-w-7xl border-t border-border/30 overflow-hidden">
          <div className="text-center mb-16">
            <SlideInText delay={0}>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                <span className="text-muted-foreground">
                  Whatever your level
                </span>
                <br />
                <span className="text-foreground">
                  Grind gives you superpowers
                </span>
              </h2>
            </SlideInText>
            <SlideInText delay={0.1}>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                From first-year students to senior engineers, Grind adapts to
                the way you learn — turning every session into progress.
              </p>
            </SlideInText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Students */}
            <FadeInCard delay={0.2}>
              <Card className="bg-muted/5 border-border/30 overflow-hidden group hover:border-border/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                <CardHeader className="transition-transform duration-500 group-hover:translate-x-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-foreground group-hover:bg-white/20 transition-colors duration-300 group-hover:scale-110">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl">
                      Students & Beginners
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base group-hover:text-muted-foreground transition-colors duration-300">
                    Learn by doing. Start from the basics and build up to
                    advanced topics with our guided learning paths and AI tutor.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Structured learning paths from basics to advanced",
                      "AI hints that teach, not just solve",
                      "Progress tracking and streak system",
                      "Beginner-friendly problem sets",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 text-sm text-muted-foreground transition-transform duration-300"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-foreground/60 flex-shrink-0 group-hover:text-green-500 transition-colors" />
                        <span className="group-hover:text-foreground transition-colors">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeInCard>

            {/* Professionals */}
            <FadeInCard delay={0.4}>
              <Card className="bg-muted/5 border-border/30 overflow-hidden group hover:border-border/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
                <CardHeader className="transition-transform duration-500 group-hover:translate-x-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-foreground group-hover:bg-white/20 transition-colors duration-300 group-hover:scale-110">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl">
                      Professionals & Job Seekers
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base group-hover:text-muted-foreground transition-colors duration-300">
                    Crack FAANG interviews with precision. Practice
                    company-specific problems and compete in timed contests.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Company-tagged problem collections",
                      "Mock interview simulations",
                      "Weekly ranked contests",
                      "Performance analytics and weakspot detection",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 text-sm text-muted-foreground transition-transform duration-300"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-foreground/60 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
                        <span className="group-hover:text-foreground transition-colors">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeInCard>
          </div>
        </section>

        {/* ═════════ LIVE COUNTERS ═════════ */}
        <section className="container mx-auto px-4 py-24 max-w-5xl overflow-hidden">
          <FadeInCard delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <AnimatedCounter end={500} suffix="+" label="Problems" />
              <AnimatedCounter end={10000} suffix="+" label="Developers" />
              <AnimatedCounter end={50} suffix="ms" label="Avg. Execution" />
              <AnimatedCounter end={98} suffix="%" label="Satisfaction" />
            </div>
          </FadeInCard>
        </section>

        {/* ═════════ HOW IT WORKS ═════════ */}
        <section className="container mx-auto px-4 py-28 max-w-7xl border-t border-border/30 overflow-hidden">
          <div className="text-center mb-16">
            <SlideInText delay={0}>
              <div className="inline-flex items-center rounded-full border border-border/40 bg-muted/20 px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
                <Target className="mr-2 h-3 w-3" />
                How It Works
              </div>
            </SlideInText>
            <SlideInText delay={0.1}>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                <span className="text-muted-foreground">Start solving in</span>{" "}
                <span className="text-foreground">3 simple steps</span>
              </h2>
            </SlideInText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <BookOpen className="h-6 w-6" />,
                title: "Pick a Problem",
                desc: "Browse 500+ problems organized by topic, difficulty, and company tags. Find exactly what you need.",
              },
              {
                step: "02",
                icon: <Code2 className="h-6 w-6" />,
                title: "Write & Run Code",
                desc: "Use our pro editor with syntax highlighting, auto-complete, and instant test execution in 7+ languages.",
              },
              {
                step: "03",
                icon: <TrendingUp className="h-6 w-6" />,
                title: "Learn & Improve",
                desc: "Get AI-powered hints, review editorial solutions, and track progress with detailed analytics.",
              },
            ].map((item, i) => (
              <FadeInCard key={i} delay={i * 0.2}>
                <div className="relative group">
                  <div className="text-6xl font-bold text-muted/30 absolute -top-8 left-0 transition-all duration-500 group-hover:text-muted/60 group-hover:-translate-y-2 group-hover:scale-110 z-0">
                    {item.step}
                  </div>
                  <div className="relative bg-muted/5 border border-border/30 rounded-xl p-8 pt-10 hover:border-border/60 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-2 z-10 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-white/10 text-foreground group-hover:bg-white/20 transition-colors duration-500 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-foreground transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </FadeInCard>
            ))}
          </div>
        </section>

        {/* ═════════ THE ENGINE (Antigravity Style) ═════════ */}
        <section className="container mx-auto px-4 py-32 max-w-7xl overflow-hidden border-t border-border/30 relative">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-foreground/[0.02] blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div className="relative z-10 lg:pr-10">
              <SlideInText delay={0}>
                <div className="inline-flex items-center rounded-full border border-border/40 bg-muted/20 px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
                  <Zap className="mr-2 h-3 w-3" />
                  The Engine
                </div>
              </SlideInText>
              <SlideInText delay={0.1}>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                  <span className="text-muted-foreground">Engineered for</span>
                  <br />
                  <span className="text-foreground">
                    Millisecond Precision.
                  </span>
                </h2>
              </SlideInText>
              <SlideInText delay={0.2}>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Under the hood, Grind uses a proprietary distributed test
                  runner. Your code is executed in secure, isolated sandboxes —
                  giving you instant, secure, and reliable feedback as if you
                  were running it locally.
                </p>
              </SlideInText>

              <FadeInCard delay={0.3}>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      icon: <Zap className="h-4 w-4" />,
                      text: "Sub-50ms execution latency for 10+ languages",
                    },
                    {
                      icon: <Search className="h-4 w-4" />,
                      text: "Real-time AST parsing for immediate AI feedback",
                    },
                    {
                      icon: <Code2 className="h-4 w-4" />,
                      text: "Isolated memory profiling per test case",
                    },
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 group cursor-default"
                    >
                      <div className="h-10 w-10 shrink-0 rounded-xl border border-border/40 bg-muted/10 flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-500 group-hover:scale-110 shadow-sm">
                        {feature.icon}
                      </div>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </FadeInCard>
            </div>

            {/* Right: The Orbital/Antigravity Visual */}
            <div className="relative min-h-[500px] flex items-center justify-center mt-10 lg:mt-0">
              {/* Central Core */}
              <FadeInCard delay={0.4} className="relative z-20">
                <FloatingElement duration={6} yOffset={15}>
                  <div className="w-32 h-32 rounded-3xl border border-border/50 bg-background/80 shadow-2xl shadow-foreground/10 backdrop-blur-xl flex items-center justify-center flex-col gap-3 group hover:border-foreground/50 transition-colors">
                    <div className="w-14 h-14 rounded-xl bg-foreground text-background flex items-center justify-center overflow-hidden border border-border/30">
                      <img
                        src="/new_logo.jpg"
                        alt="Grind"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-foreground">
                      CORE ENGINE
                    </span>
                  </div>
                </FloatingElement>
              </FadeInCard>

              {/* Orbiting Nodes (Absolute positioned around the center) */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Node 1: Worker */}
                <FloatingElement
                  delay={0}
                  duration={5}
                  yOffset={25}
                  className="absolute top-[15%] left-[15%] md:left-[25%] lg:left-[20%]"
                >
                  <div className="px-4 py-2 rounded-full border border-border/40 bg-background/50 backdrop-blur-md shadow-lg flex items-center gap-2">
                    <SiDocker className="h-4 w-4 text-foreground/70" />
                    <span className="text-xs font-mono text-muted-foreground">
                      Sandbox Worker
                    </span>
                  </div>
                </FloatingElement>

                {/* Node 2: AI */}
                <FloatingElement
                  delay={1}
                  duration={7}
                  yOffset={20}
                  className="absolute top-[25%] right-[5%] md:right-[20%] lg:right-[10%]"
                >
                  <div className="px-4 py-2 rounded-full border border-border/40 bg-background/50 backdrop-blur-md shadow-lg flex items-center gap-2">
                    <Bot className="h-4 w-4 text-foreground/70" />
                    <span className="text-xs font-mono text-muted-foreground">
                      AI Mentor
                    </span>
                  </div>
                </FloatingElement>

                {/* Node 3: Language */}
                <FloatingElement
                  delay={0.5}
                  duration={4}
                  yOffset={30}
                  className="absolute bottom-[25%] left-[5%] md:left-[20%] lg:left-[10%]"
                >
                  <div className="px-4 py-2 rounded-full border border-border/40 bg-background/50 backdrop-blur-md shadow-lg flex items-center gap-2">
                    <SiPython className="h-4 w-4 text-foreground/70" />
                    <span className="text-xs font-mono text-muted-foreground">
                      AST Parser
                    </span>
                  </div>
                </FloatingElement>

                {/* Node 4: DB */}
                <FloatingElement
                  delay={1.5}
                  duration={6}
                  yOffset={15}
                  className="absolute bottom-[15%] right-[15%] md:right-[25%] lg:right-[25%]"
                >
                  <div className="px-4 py-2 rounded-full border border-border/40 bg-background/50 backdrop-blur-md shadow-lg flex items-center gap-2">
                    <Layout className="h-4 w-4 text-foreground/70" />
                    <span className="text-xs font-mono text-muted-foreground">
                      Telemetry
                    </span>
                  </div>
                </FloatingElement>

                {/* Connecting SVG Lines */}
                <svg
                  className="absolute inset-0 w-full h-full -z-10 opacity-30"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="50%"
                    y1="50%"
                    x2="30%"
                    y2="20%"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="animate-pulse"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="80%"
                    y2="30%"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="20%"
                    y2="70%"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="animate-pulse"
                    style={{ animationDelay: "1s" }}
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="70%"
                    y2="80%"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="animate-pulse"
                    style={{ animationDelay: "1.5s" }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════ ANALYTICS / IMMERSIVE HEATMAP (Antigravity Style) ═════════ */}
        <section className="container mx-auto px-4 py-32 max-w-7xl overflow-hidden border-t border-border/30 relative">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-foreground/[0.02] blur-[150px] rounded-full pointer-events-none -z-10" />

          <div className="text-center mb-16 relative z-10">
            <SlideInText delay={0}>
              <div className="inline-flex items-center rounded-full border border-border/40 bg-muted/20 px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
                <TrendingUp className="mr-2 h-3 w-3" />
                Data-Driven Growth
              </div>
            </SlideInText>
            <SlideInText delay={0.1}>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                <span className="text-muted-foreground">Visualize your</span>{" "}
                <span className="text-foreground">Progress.</span>
              </h2>
            </SlideInText>
            <SlideInText delay={0.2}>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stop guessing. Our deep analytics engine tracks every
                submission, highlighting your weakest algorithmic patterns so
                you know exactly what to practice next.
              </p>
            </SlideInText>
          </div>

          <div className="relative mx-auto max-w-5xl">
            {/* Main Visual: Floating 3D Heatmap */}
            <FadeInCard
              delay={0.3}
              className="relative z-10 w-full perspective-[2000px]"
            >
              <FloatingElement duration={8} yOffset={10}>
                <div className="transform rotate-x-[5deg] rotate-y-[-2deg] bg-muted/5 border border-border/40 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-xl">
                  {/* Pseudo Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        Consistency Streak
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        1,240 submissions in the last year
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Less
                      </span>
                      {[0.05, 0.2, 0.4, 0.6, 0.8].map((opacity, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-sm bg-foreground transition-all duration-300"
                          style={{ opacity }}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground">
                        More
                      </span>
                    </div>
                  </div>

                  {/* Heatmap Grid Generation */}
                  <div className="flex gap-1.5 md:gap-2 overflow-x-hidden">
                    {[...Array(24)].map((_, colIndex) => (
                      <div
                        key={colIndex}
                        className="flex flex-col gap-1.5 md:gap-2"
                      >
                        {[...Array(7)].map((_, rowIndex) => {
                          // Procedural generation of heat map densities to make it look realistic
                          const isActive = Math.random() > 0.4;
                          let opacity = 0.05; // base muted
                          if (isActive) {
                            const intensity = Math.random();
                            opacity =
                              intensity > 0.8
                                ? 0.9
                                : intensity > 0.5
                                  ? 0.6
                                  : 0.3;
                          }
                          // Add a glowing trail near the end to signify recent heavy activity
                          if (colIndex > 18 && rowIndex > 2) {
                            opacity = Math.random() > 0.2 ? 0.8 : 0.4;
                          }

                          return (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.4,
                                delay: 0.3 + colIndex * 0.02 + rowIndex * 0.01,
                              }}
                              key={`${colIndex}-${rowIndex}`}
                              className="w-3 h-3 md:w-4 md:h-4 w-full h-full rounded-sm bg-foreground hover:scale-150 hover:z-10 transition-all duration-200 cursor-pointer"
                              style={{ opacity }}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </FloatingElement>
            </FadeInCard>

            {/* Floating Stat Cards (Orbiting the heatmap) */}
            <FloatingElement
              delay={0.5}
              duration={6}
              yOffset={20}
              className="absolute -top-10 -left-4 md:-left-12 z-20 hidden md:block"
            >
              <div className="bg-background/80 border border-border/50 backdrop-blur-xl p-4 rounded-2xl shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-green-500/30 flex items-center justify-center p-1">
                  <div className="w-full h-full rounded-full bg-green-500/20 text-green-500 flex items-center justify-center font-bold text-sm">
                    42
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                    Current Streak
                  </p>
                  <p className="text-lg font-bold text-foreground">42 Days</p>
                </div>
              </div>
            </FloatingElement>

            <FloatingElement
              delay={1.2}
              duration={7}
              yOffset={15}
              className="absolute -bottom-8 md:-bottom-12 -right-4 md:-right-8 z-20 hidden sm:block"
            >
              <div className="bg-background/80 border border-border/50 backdrop-blur-xl p-4 rounded-2xl shadow-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                    Global Rank
                  </p>
                  <p className="text-lg font-bold text-foreground">Top 2%</p>
                </div>
              </div>
            </FloatingElement>

            <FloatingElement
              delay={2}
              duration={5}
              yOffset={25}
              className="absolute top-1/2 -right-4 md:-right-16 z-20 hidden lg:block"
            >
              <div className="bg-background/80 border border-border/50 backdrop-blur-xl p-4 rounded-2xl shadow-xl">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Strongest Pattern
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 bg-blue-500 rounded-full" />
                  <span className="text-sm font-semibold text-foreground">
                    Dynamic Prog.
                  </span>
                </div>
              </div>
            </FloatingElement>
          </div>
        </section>

        {/* ═════════ TESTIMONIALS ═════════ */}
        <section
          id="testimonials"
          className="container mx-auto px-4 py-28 max-w-7xl border-t border-border/30 overflow-hidden"
        >
          <div className="text-center mb-16">
            <SlideInText delay={0}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Loved by developers
              </h2>
            </SlideInText>
            <SlideInText delay={0.1}>
              <p className="text-lg text-muted-foreground">
                Here's what our community has to say about Grind.
              </p>
            </SlideInText>
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
                  "The UI is incredibly clean and the editor experience is top-notch. It feels just like VS Code, which makes practicing so comfortable.",
                avatar: "AP",
              },
              {
                name: "Rohan Kumar",
                role: "CS Student",
                content:
                  "I've tried LeetCode and HackerRank, but Grind's curated problem sets and learning paths are superior. Highly recommend!",
                avatar: "RK",
              },
            ].map((t, i) => (
              <FadeInCard key={i} delay={i * 0.2}>
                <Card className="bg-muted/5 border-border/30 hover:border-border/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/5 h-full flex flex-col group cursor-default">
                  <CardHeader className="transition-transform duration-500 group-hover:translate-x-1">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-foreground text-sm group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-semibold group-hover:text-foreground transition-colors">
                          {t.name}
                        </div>
                        <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                          {t.role}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-foreground/50 mt-2 transition-transform duration-500 group-hover:scale-105 origin-left">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 fill-current group-hover:text-yellow-500/80 transition-colors"
                          style={{ transitionDelay: `${j * 50}ms` }}
                        />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="relative flex-1">
                    <Quote className="absolute top-0 left-0 h-8 w-8 text-muted-foreground/10 -translate-y-1/2 translate-x-2 group-hover:scale-125 group-hover:text-muted-foreground/20 transition-all duration-500 group-hover:-rotate-12 origin-center" />
                    <p className="text-muted-foreground text-sm leading-relaxed relative z-10 group-hover:text-muted-foreground/90 transition-colors mt-2">
                      "{t.content}"
                    </p>
                  </CardContent>
                </Card>
              </FadeInCard>
            ))}
          </div>
        </section>

        {/* ═════════ FAQ ═════════ */}
        <section
          id="faq"
          className="container mx-auto px-4 py-24 max-w-3xl overflow-hidden"
        >
          <div className="text-center mb-16">
            <SlideInText delay={0}>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Frequently asked questions
              </h2>
            </SlideInText>
          </div>

          <FadeInCard delay={0.2}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="group">
                <AccordionTrigger className="hover:no-underline hover:text-foreground transition-colors group-hover:pl-2 duration-300">
                  Is Grind suitable for beginners?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pl-2 border-l-2 border-primary/20 ml-2 mt-2 group-data-[state=open]:animate-in group-data-[state=open]:fade-in duration-500">
                  Yes! We have a dedicated "Beginner's Track" that starts with
                  the basics of programming and gradually introduces algorithms
                  and data structures.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="group">
                <AccordionTrigger className="hover:no-underline hover:text-foreground transition-colors group-hover:pl-2 duration-300">
                  How does the AI assistant work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pl-2 border-l-2 border-primary/20 ml-2 mt-2 group-data-[state=open]:animate-in group-data-[state=open]:fade-in duration-500">
                  Our AI analyzes your code in real-time and provides contextual
                  hints. It won't just give you the answer; instead, it guides
                  you toward the solution.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="group">
                <AccordionTrigger className="hover:no-underline hover:text-foreground transition-colors group-hover:pl-2 duration-300">
                  Can I use Grind for free?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pl-2 border-l-2 border-primary/20 ml-2 mt-2 group-data-[state=open]:animate-in group-data-[state=open]:fade-in duration-500">
                  Absolutely. Our Free tier gives you access to a curated list
                  of problems and basic features. Upgrade to Pro for advanced
                  tools.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="group">
                <AccordionTrigger className="hover:no-underline hover:text-foreground transition-colors group-hover:pl-2 duration-300">
                  What programming languages are supported?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pl-2 border-l-2 border-primary/20 ml-2 mt-2 group-data-[state=open]:animate-in group-data-[state=open]:fade-in duration-500">
                  We currently support JavaScript, TypeScript, Python, Java,
                  C++, Go, and Rust. We're constantly adding more.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </FadeInCard>
        </section>

        {/* ═════════ CTA — Bolt "Ready to build" Style ═════════ */}
        <section className="container mx-auto px-4 py-28 max-w-5xl overflow-hidden">
          <FadeInCard delay={0}>
            <div className="relative rounded-3xl overflow-hidden border border-border/30 p-12 md:p-20 text-center hover:border-border/50 transition-colors duration-500 group group-hover:shadow-2xl">
              {/* Background effects */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-foreground/5 blur-[120px] pointer-events-none group-hover:bg-foreground/10 transition-colors duration-700" />
              <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-foreground/[0.03] blur-[100px] pointer-events-none group-hover:bg-foreground/[0.06] transition-colors duration-700" />
              <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-muted/5 -z-10 transition-all duration-700 group-hover:scale-105" />

              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                <span className="text-muted-foreground">Ready to start</span>
                <br />
                <span className="text-foreground">something amazing?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 relative z-10 group-hover:text-muted-foreground/80 transition-colors">
                Try it out and start building for free. No credit card required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base rounded-full w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 border-0 shadow-lg shadow-foreground/10 hover:shadow-foreground/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                  onClick={() => navigate("/auth")}
                >
                  Get Started for Free{" "}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base rounded-full w-full sm:w-auto bg-background/50 hover:bg-foreground/5 transition-all duration-300 hover:-translate-y-1"
                  onClick={() => navigate("/pricing")}
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </FadeInCard>
        </section>
      </main>

      {/* ═════════ FOOTER ═════════ */}
      <footer className="border-t border-border/40 bg-background py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                  <div className="h-8 w-8 overflow-hidden rounded-lg border border-border/60 bg-background p-0.5 shadow-sm">
                    <img
                      src="/new_logo.jpg"
                      alt="Grind logo"
                      className="h-full w-full rounded-md object-cover"
                    />
                  </div>
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
                    className="hover:text-foreground transition-colors"
                    onClick={() => navigate("/problems")}
                  >
                    Problems
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground transition-colors"
                    onClick={() => navigate("/contest")}
                  >
                    Contests
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground transition-colors"
                    onClick={() => navigate("/compiler")}
                  >
                    Compiler
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground transition-colors"
                    onClick={() => navigate("/grind-ai")}
                  >
                    Grind AI
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground transition-colors"
                    onClick={() => navigate("/pricing")}
                  >
                    Pricing
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
                    className="hover:text-foreground transition-colors"
                    onClick={() => navigate("/about")}
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground transition-colors"
                    onClick={() => navigate("/contact-us")}
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="hover:text-foreground transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-left">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide dark:text-foreground">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    className="hover:text-foreground transition-colors"
                    onClick={() => navigate("/terms-and-conditions")}
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground transition-colors"
                    onClick={() => navigate("/privacy-policy")}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground transition-colors"
                    onClick={() => navigate("/cancellation-policy")}
                  >
                    Cancellation & Refunds
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-foreground transition-colors"
                    onClick={() => navigate("/shipping-policy")}
                  >
                    Shipping Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border/40 text-sm text-muted-foreground">
            <p>© 2026 Grind Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="hover:text-foreground transition-colors">
                <Twitter />
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

      {/* Marquee animation style */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
