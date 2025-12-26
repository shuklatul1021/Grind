import { useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/card";
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  ArrowLeft,
  Target,
  Users,
  Zap,
  Heart,
  SquareChevronRight,
} from "lucide-react";
import { useEffect } from "react";

export default function AboutUs() {
  const navigate = useNavigate();

  useEffect(()=>{
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Navigation Bar */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <SquareChevronRight className="h-6 w-6" />
            <span className="text-xl font-bold">Grind</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="mx-auto max-w-4xl text-center mb-20">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            About
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              {" "}
              Grind
            </span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            Empowering developers worldwide to master their coding skills
            through practice, dedication, and community.
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <Card className="border-border/40 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <CardTitle className="text-3xl mb-2">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                To create the ultimate platform for developers to sharpen their
                algorithmic thinking, prepare for technical interviews, and
                build the confidence needed to excel in their careers. We
                believe that consistent practice and quality problems are the
                keys to mastery.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What is Grind Section */}
        <div className="grid gap-8 md:grid-cols-2 mb-20 max-w-6xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">What is Grind?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Grind is a modern coding practice platform designed to help
              developers of all levels improve their problem-solving skills.
              Whether you're a beginner learning your first algorithms or an
              experienced engineer preparing for FAANG interviews, Grind
              provides the tools and environment you need to succeed.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform features carefully curated problems across multiple
              difficulty levels, instant code execution with detailed feedback,
              comprehensive test cases, and a clean, distraction-free interface
              that lets you focus on what matters most: writing great code.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Built with cutting-edge technologies and designed with developers
              in mind, Grind offers support for multiple programming languages,
              real-time compilation, and detailed submission history to track
              your progress over time.
            </p>
          </div>
          <div className="space-y-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardTitle>Quality Problems</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Every problem is handpicked and tested to ensure it provides
                  real learning value
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <CardTitle>Community Focused</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn from others, share your solutions, and grow together as
                  a community
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-purple-500" />
                  </div>
                  <CardTitle>Built with Passion</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Crafted by a developer, for developers, with attention to
                  every detail
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Founder Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet the Founder & CEO
          </h2>
          <Card className="border-border/40 bg-card/50 backdrop-blur overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center p-12">
                <div className="h-40 w-40 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                  <img
                    src="/ceo.jpg"
                    alt="Atul Shukla"
                    className="h-40 w-40 rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-3xl">Atul Shukla</CardTitle>
                  <CardDescription className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    Founder & CEO
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Atul Shukla is the visionary founder and CEO behind Grind.
                    As a passionate Full Stack Developer with a deep love for
                    algorithms and problem-solving, Atul single-handedly
                    architected, designed, and built the entire Grind platform
                    from the ground up.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    With expertise spanning modern web technologies including
                    React, Node.js, TypeScript, PostgreSQL, Redis, and Docker,
                    Atul brought his vision to life by creating a seamless,
                    performant, and beautiful platform that developers love to
                    use.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    His mission is simple: to help every developer unlock their
                    full potential through consistent practice, quality content,
                    and a supportive community. Grind is not just a product—it's
                    a testament to what passion and dedication can achieve.
                  </p>

                  <div className="flex gap-4 pt-6">
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href="https://github.com/shuklatul1021"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <Globe className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
        <hr/>
        {/* My Team Section */}
        <div className="max-w-4xl mx-auto mb-12 mt-6">
          <h2 className="text-3xl font-bold text-center mb-8">My Team</h2>
          <Card className="border-border/40 bg-card/50 backdrop-blur overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center p-8">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl ">
                  <img className="rounded-full" src="https://media.licdn.com/dms/image/v2/D4E03AQEQNvbSJSvJdg/profile-displayphoto-shrink_400_400/B4EZf5mdijH0Ag-/0/1752239301301?e=1766620800&v=beta&t=lcKRx_InW51tFCvUepBDhh0s5NnK4uqYrLXWUTWQ2po"/>
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl">Asmit Panday</CardTitle>
                  <CardDescription className="text-base font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Chief Marketing Officer
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    Asmit Panday leads the marketing initiatives at Grind,
                    bringing innovative strategies to connect with developers
                    and grow our community worldwide.
                  </p>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" size="icon" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="max-w-3xl mx-auto text-center">
          <Card className="border-border/40 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of developers who are leveling up their skills on
                Grind
              </p>
              <Button size="lg" onClick={() => navigate("/problems")}>
                Start Practicing Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border/40 bg-background/95 backdrop-blur mt-20">
        <div className="container px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <SquareChevronRight className="h-5 w-5" />
              <span className="font-semibold">Grind</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Grind. Built with ❤️ by Atul Shukla. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
