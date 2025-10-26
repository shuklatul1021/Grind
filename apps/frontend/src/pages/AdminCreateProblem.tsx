import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import { Textarea } from '@repo/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select';
import { Code2, Moon, Sun, ArrowLeft, Save, Plus, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { BACKENDURL } from '../utils/urls';

interface TestCase {
  id: string;
  input: string;
  output: string;
  isHidden: boolean;
}

export default function AdminCreateProblem() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: '1', input: '', output: '', isHidden: false }
  ]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    difficulty: 'medium',
    description: '',
    startercode: '',
    inputFormat: '',
    outputFormat: '',
    explanation: '',
    tags: '',
    points: '100',
    acceptanceRate: '0'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uppercasedifficulty = formData.difficulty.toUpperCase();
      const newTagsArray = formData.tags.split(",");
      const resposne = await fetch(`${BACKENDURL}/admin/set-challenges` , {
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
          token : localStorage.getItem("adminToken") || ""
        },
        body : JSON.stringify({
          title : formData.title,
          slug : formData.slug,
          description : formData.description,
          difficulty : uppercasedifficulty,
          maxpoint : formData.points,
          tags : newTagsArray,
          startercode : formData.startercode,
          exampleinput : formData.inputFormat,
          exampleoutput : formData.outputFormat,
          explanation : formData.explanation,
          testcaseinput : testCases
        })
      })
      if(resposne.ok){
        alert("Added Successfully");
        navigate('/admin/dashboard');
      }else{
        alert("Error While Creating Problems")
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create problem');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: Date.now().toString(),
      input: '',
      output: '',
      isHidden: false
    };
    setTestCases(prev => [...prev, newTestCase]);
  };

  const removeTestCase = (id: string) => {
    if (testCases.length > 1) {
      setTestCases(prev => prev.filter(tc => tc.id !== id));
    }
  };

  const updateTestCase = (id: string, field: keyof TestCase, value: string | boolean) => {
    setTestCases(prev => prev.map(tc => 
      tc.id === id ? { ...tc, [field]: value } : tc
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Code2 className="h-6 w-6" />
              <span className="text-xl font-bold">Create Problem</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <main className="container px-4 py-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Problem Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Two Sum"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    placeholder="e.g., two-sum"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    placeholder="100"
                    value={formData.points}
                    onChange={(e) => handleChange('points', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., arrays, hash-table, two-pointers"
                  value={formData.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader>
              <CardTitle>Problem Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startercode">Starter Code *</Label>
                <Textarea
                  id="startercode"
                  placeholder="Describe the problem in detail..."
                  className="min-h-[150px] font-mono text-sm"
                  value={formData.startercode}
                  onChange={(e) => handleChange('startercode', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the problem in detail..."
                  className="min-h-[200px] font-mono text-sm"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inputFormat">Input Format</Label>
                <Textarea
                  id="inputFormat"
                  placeholder="Describe the input format..."
                  className="min-h-[100px] font-mono text-sm"
                  value={formData.inputFormat}
                  onChange={(e) => handleChange('inputFormat', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outputFormat">Output Format</Label>
                <Textarea
                  id="outputFormat"
                  placeholder="Describe the expected output format..."
                  className="min-h-[100px] font-mono text-sm"
                  value={formData.outputFormat}
                  onChange={(e) => handleChange('outputFormat', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation</Label>
                <Textarea
                  id="explanation"
                  placeholder="e.g., 1 <= nums.length <= 10^4"
                  className="min-h-[100px] font-mono text-sm"
                  value={formData.explanation}
                  onChange={(e) => handleChange('explanation', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Test Cases</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Test Case
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {testCases.map((testCase, index) => (
                  <div key={testCase.id} className="rounded-lg border border-border/40 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-semibold">Test Case #{index + 1}</h4>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`hidden-${testCase.id}`} className="text-sm text-muted-foreground">
                          Hidden
                        </Label>
                        <input
                          id={`hidden-${testCase.id}`}
                          type="checkbox"
                          checked={testCase.isHidden}
                          onChange={(e) => updateTestCase(testCase.id, 'isHidden', e.target.checked)}
                          className="h-4 w-4 rounded border-border"
                        />
                        {testCases.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTestCase(testCase.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`input-${testCase.id}`}>Input</Label>
                        <Textarea
                          id={`input-${testCase.id}`}
                          placeholder="Test case input..."
                          className="min-h-[100px] font-mono text-sm"
                          value={testCase.input}
                          onChange={(e) => updateTestCase(testCase.id, 'input', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`output-${testCase.id}`}>Expected Output</Label>
                        <Textarea
                          id={`output-${testCase.id}`}
                          placeholder="Expected output..."
                          className="min-h-[100px] font-mono text-sm"
                          value={testCase.output}
                          onChange={(e) => updateTestCase(testCase.id, 'output', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate('/admin/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Problem
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}