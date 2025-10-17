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

export default function AdminCreateContest() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    type: 'weekly',
    difficulty: 'intermediate',
    description: '',
    startDate: '',
    endDate: '',
    prize: '',
    maxParticipants: '',
    rules: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {

      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to create contest');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              <span className="text-xl font-bold">Create Contest</span>
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
              <CardTitle>Contest Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Contest Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Weekly Challenge #42"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Contest Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level *</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date & Time *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date & Time *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prize">Prize Amount</Label>
                  <Input
                    id="prize"
                    placeholder="e.g., $500"
                    value={formData.prize}
                    onChange={(e) => handleChange('prize', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    placeholder="Leave empty for unlimited"
                    value={formData.maxParticipants}
                    onChange={(e) => handleChange('maxParticipants', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the contest..."
                  className="min-h-[150px]"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">Contest Rules</Label>
                <Textarea
                  id="rules"
                  placeholder="Enter contest rules and guidelines..."
                  className="min-h-[150px]"
                  value={formData.rules}
                  onChange={(e) => handleChange('rules', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contest Problems</CardTitle>
                <Button type="button" variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Problems
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedProblems.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No problems added yet. Click "Add Problems" to select problems for this contest.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedProblems.map((problemId, index) => (
                    <div key={problemId} className="flex items-center justify-between rounded-md border border-border/40 p-3">
                      <span className="text-sm font-medium">Problem #{index + 1}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedProblems(prev => prev.filter(id => id !== problemId))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
                  Create Contest
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}