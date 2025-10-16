import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import { Textarea } from '@repo/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select';
import { 
  Code2, 
  Moon, 
  Sun, 
  LogOut, 
  Play, 
  RotateCcw, 
  Download,
  Copy,
  Check
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

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
    return a + b
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
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(DEFAULT_CODE[language as keyof typeof DEFAULT_CODE] || '');
    setOutput('');
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    
    // Simulate code execution (replace with actual API call)
    setTimeout(() => {
      setOutput(`Output for ${selectedLanguage}:\nHello, World!\n8\n\nExecution completed successfully.`);
      setIsRunning(false);
    }, 1500);
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE[selectedLanguage as keyof typeof DEFAULT_CODE] || '');
    setInput('');
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

  const currentLanguage = LANGUAGES.find((lang) => lang.value === selectedLanguage);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => navigate('/')}
          >
            <Code2 className="h-6 w-6"/>
            <span className="text-xl font-bold">Grind</span>
          </div>
          <div className='flex space-x-4'>
            <div>
              <Link to="/problems">Problems</Link> 
            </div>
            <div>
              <Link to="/contest">Contest</Link> 
            </div>
            <div className='underline'>
              <Link to="/compiler">Compiler</Link>
            </div>
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

      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Online Compiler</h1>
          <p className="text-muted-foreground">
            Write, run, and test your code in multiple programming languages
          </p>
        </div>

        <Card className="mb-6 border-border/40">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Code Editor</CardTitle>
              <div className="flex flex-wrap items-center gap-3">
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentLanguage && (
                  <Badge variant="outline" className="text-xs">
                    {currentLanguage.version}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={handleRunCode} 
                  disabled={isRunning}
                  className="flex-1 sm:flex-none"
                >
                  {isRunning ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Run Code
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="flex-1 sm:flex-none"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCopyCode}
                  className="flex-1 sm:flex-none"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDownload}
                  className="flex-1 sm:flex-none"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>

              <div className="rounded-md border border-border/40 bg-muted/30">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="min-h-[400px] font-mono text-sm resize-none border-0 bg-transparent focus-visible:ring-0"
                  placeholder="Write your code here..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Input</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[200px] font-mono text-sm resize-none"
                placeholder="Provide input for your program (optional)..."
              />
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[200px] rounded-md border border-border/40 bg-muted/30 p-4">
                {output ? (
                  <pre className="font-mono text-sm whitespace-pre-wrap">{output}</pre>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Output will appear here after running your code
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}