import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select';
import {  
  Moon, 
  Sun, 
  LogOut, 
  Play, 
  RotateCcw, 
  Download,
  Copy,
  Check,
  Columns,
  Rows,
  SquareChevronRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { BACKENDURL } from '../utils/urls';
import CodeEditor from './CodeEditor';
import { Textarea } from '@repo/ui/textarea';
import { toast } from '../../../../packages/ui/src/hooks/use-toast';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', version: 'Node.js 18.x' },
  { value: 'python', label: 'Python', version: '3.11.x' },
  { value: 'java', label: 'Java', version: 'JDK 17' },
  { value: 'cpp', label: 'C++', version: 'GCC 11.x' },
  { value: 'c', label: 'C', version: 'GCC 11.x' },
  { value: 'typescript', label: 'TypeScript', version: '5.x' },
  { value: 'go', label: 'Go', version: '1.21.x' },
  { value: 'rust', label: 'Rust', version: '1.75.x' },
];

const DEFAULT_CODE = {
  javascript: `// JavaScript Code
console.log("Hello, World!");

function sum(a, b) {
  return a + b;
}

console.log(sum(5, 3));`,
  python: `# Python Code
print("Hello, World!")

def sum(a, b):
    return a + b

print(sum(5, 3))`,
  java: `// Java Code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println(sum(5, 3));
    }
    
    public static int sum(int a, int b) {
        return a + b;
    }
}`,
  cpp: `// C++ Code
#include <iostream>
using namespace std;

int sum(int a, int b) {
    return a + b;
}

int main() {
    cout << "Hello, World!" << endl;
    cout << sum(5, 3) << endl;
    return 0;
}`,
  c: `// C Code
#include <stdio.h>

int sum(int a, int b) {
    return a + b;
}

int main() {
    printf("Hello, World!\\n");
    printf("%d\\n", sum(5, 3));
    return 0;
}`,
  typescript: `// TypeScript Code
console.log("Hello, World!");

function sum(a: number, b: number): number {
  return a + b;
}

console.log(sum(5, 3));`,
  go: `// Go Code
package main

import "fmt"

func sum(a int, b int) int {
    return a + b;
}

func main() {
    fmt.Println("Hello, World!")
    fmt.Println(sum(5, 3))
}`,
  rust: `// Rust Code
fn sum(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    println!("Hello, World!");
    println!("{}", sum(5, 3));
}`,
};

function detectsInput(code: string, language: string): boolean {
  const inputPatterns: Record<string, RegExp[]> = {
    python: [/input\s*\(/],
    javascript: [/readline\s*\(/, /prompt\s*\(/],
    typescript: [/readline\s*\(/, /prompt\s*\(/],
    java: [/Scanner\s*\(/, /BufferedReader/, /\.nextLine\(/, /\.nextInt\(/, /\.next\(/],
    cpp: [/cin\s*>>/, /scanf\s*\(/, /getline\s*\(/],
    c: [/scanf\s*\(/, /gets\s*\(/, /fgets\s*\(/],
    go: [/fmt\.Scan/, /bufio\.NewReader/, /reader\.ReadString/],
    rust: [/std::io::stdin/, /read_line/]
  };

  const patterns = inputPatterns[language] || [];
  return patterns.some(pattern => pattern.test(code));
}

export default function CompilerPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [layout, setLayout] = useState<'bottom' | 'right'>('bottom');


  const [showInputModal, setShowInputModal] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [pendingExecution, setPendingExecution] = useState<{code: string, language: string} | null>(null);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(DEFAULT_CODE[language as keyof typeof DEFAULT_CODE] || '');
    setOutput('');
  };

  const handleRunCode = async () => {
    if (detectsInput(code, selectedLanguage)) {
      setPendingExecution({ code, language: selectedLanguage });
      setShowInputModal(true);
    } else {
      await executeCode(code, selectedLanguage, undefined);
    }
  };

  const executeCode = async (codeToRun: string, lang: string, input?: string) => {
    setIsRunning(true);
    setOutput('Running code...');
    try {
      const response = await fetch(`${BACKENDURL}/compiler/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({
          code: codeToRun,
          language: lang,
          input: input
        })
      });

      const data = await response.json();

      if (data.output != "") {
        setOutput(data.output);
      } else {
        setOutput(data.error);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Code execution failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false);
    }
  };

  const handleInputSubmit = () => {
    if (pendingExecution) {
      setShowInputModal(false);
      executeCode(pendingExecution.code, pendingExecution.language, userInput);
      setPendingExecution(null);
      setUserInput(''); 
    }
  };

  const handleInputCancel = () => {
    setShowInputModal(false);
    setPendingExecution(null);
    setUserInput('');
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE[selectedLanguage as keyof typeof DEFAULT_CODE] || '');
    setOutput('');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      typescript: 'ts',
      go: 'go',
      rust: 'rs',
    };
    const ext = extensions[selectedLanguage] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = () => {
    navigate('/');
  };

  const toggleLayout = () => {
    setLayout(prev => prev === 'bottom' ? 'right' : 'bottom');
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.value === selectedLanguage);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate('/')}
          >
            <SquareChevronRight className="h-6 w-6"/>
            <span className="text-xl font-bold">Grind</span>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              to="/problems" 
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Problems
            </Link>
            <Link 
              to="/contest" 
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Contest
            </Link>
            <Link 
              to="/compiler" 
              className="px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium transition-all hover:bg-blue-600 hover:text-white"
            >
              Compiler
            </Link>
            <Link 
              to="/grind-ai" 
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground transition-all hover:bg-muted"
            >
              Grind AI
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container flex-1 px-4 py-6 flex flex-col h-[calc(100vh-4rem)]">
        <div className="mb-6 flex-none">
          <h1 className="mb-1 text-2xl font-bold">Online Compiler</h1>
          <p className="text-sm text-muted-foreground">
            Write, run, and test your code in multiple programming languages
          </p>
        </div>

        <div className={`flex-1 flex gap-4 min-h-0 ${layout === 'right' ? 'flex-row' : 'flex-col'}`}>
          <Card className={`border-border/40 flex flex-col shadow-sm ${layout === 'right' ? 'w-1/2' : 'w-full flex-1'}`}>
            <CardHeader className="py-3 px-4 border-b border-border/40">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Code Editor</CardTitle>
                  {currentLanguage && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      {currentLanguage.version}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} className="text-xs">
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="h-4 w-px bg-border/60 mx-1" />

                  <Button 
                    onClick={handleRunCode} 
                    disabled={isRunning}
                    size="sm"
                    className="h-8 px-3"
                  >
                    {isRunning ? (
                      <>
                        <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Running
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-3 w-3" />
                        Run
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleLayout}
                    className="h-8 w-8"
                    title={layout === 'bottom' ? "Switch to side-by-side view" : "Switch to stacked view"}
                  >
                    {layout === 'bottom' ? <Columns className="h-4 w-4" /> : <Rows className="h-4 w-4" />}
                  </Button>
                  
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col relative h-full">
               <div className="absolute top-2 right-4 z-10 flex gap-1">
                  <Button 
                    variant="secondary" 
                    size="icon"
                    onClick={handleReset}
                    className="h-7 w-7 opacity-50 hover:opacity-100 transition-opacity"
                    title="Reset Code"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon"
                    onClick={handleCopyCode}
                    className="h-7 w-7 opacity-50 hover:opacity-100 transition-opacity"
                    title="Copy Code"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon"
                    onClick={handleDownload}
                    className="h-7 w-7 opacity-50 hover:opacity-100 transition-opacity"
                    title="Download Code"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
               </div>
               <div className="flex-1 h-full">
                  <CodeEditor code={code} setCode={setCode} language={selectedLanguage} />
               </div>
            </CardContent>
          </Card>

          <Card className={`border-border/40 flex flex-col shadow-sm ${layout === 'right' ? 'w-1/2' : 'w-full h-[300px]'}`}>
            <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20">
              <CardTitle className="text-base">Output</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 bg-[#1e1e1e] text-left">
              <div className="h-full w-full p-4 overflow-auto font-mono text-base text-gray-300">
                {output ? (
                  <pre className="whitespace-pre-wrap">{output}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground/40 italic">
                    Run your code to see output here
                  </div>
                )}
              </div>
            </CardContent>
          </Card>


          {showInputModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Input Required</CardTitle>
                  <CardDescription>
                    This program requires input. Please provide it below (one value per line if multiple inputs needed)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter your input here...&#10;Line 1&#10;Line 2&#10;Line 3"
                    className="min-h-[150px] font-mono"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={handleInputCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleInputSubmit}>
                      <Play className="h-4 w-4 mr-2" />
                      Run with Input
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}