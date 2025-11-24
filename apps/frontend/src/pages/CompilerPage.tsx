import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
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

export default function CompilerPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [layout, setLayout] = useState<'bottom' | 'right'>('bottom');

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(DEFAULT_CODE[language as keyof typeof DEFAULT_CODE] || '');
    setOutput('');
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    try {
      const response = await fetch(`${BACKENDURL}/compiler/run`, {
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
          "token" : localStorage.getItem("token") || ""
        },
        body : JSON.stringify({
          code,
          language : selectedLanguage
        })
      });
      const json  = await response.json();
      if(response.ok){
        setOutput(json.output || json.error || 'No output');
      }else{
        setOutput(json.error || 'Error executing code');
      }
    }catch(e){
      alert("Internal Server Error ")
    }
    setIsRunning(false);
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
               <div className="flex-1 h-full [&_.cm-editor]:h-full [&_.cm-scroller]:h-full">
                  <CodeEditor code={code} setCode={setCode} language={selectedLanguage} />
               </div>
            </CardContent>
          </Card>

          <Card className={`border-border/40 flex flex-col shadow-sm ${layout === 'right' ? 'w-1/2' : 'w-full h-[300px]'}`}>
            <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20">
              <CardTitle className="text-base">Output</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 bg-[#1e1e1e]">
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
        </div>
      </main>
    </div>
  );
}