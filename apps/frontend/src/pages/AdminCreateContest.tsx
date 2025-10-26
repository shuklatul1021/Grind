import { useEffect, useMemo, useState } from 'react';
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

export default function AdminCreateContest() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const [problemsList, setProblemsList] = useState<{ id: string; title: string }[]>([]);
  const [problemsLoading, setProblemsLoading] = useState(false);
  const [problemsError, setProblemsError] = useState<string | null>(null);

  const [problemsPopupOpen, setProblemsPopupOpen] = useState(false);
  const [popupQuery, setPopupQuery] = useState("");
  const [tempSelected, setTempSelected] = useState<Record<string, boolean>>({});
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'weekly',
    difficulty: 'medium',
    description: '',
    startDate: '',
    endDate: '',
    status : 'upcoming'
  });

  function toIsoUtc(datetimeLocal: string): string {
    return new Date(datetimeLocal).toISOString();
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const difficulty = formData.difficulty.toUpperCase();
      const type = formData.type.toUpperCase()
      const status = formData.status.toUpperCase();
      const starttime = toIsoUtc(formData.startDate);
      const endtime = toIsoUtc(formData.endDate);
      const response = await fetch(`${BACKENDURL}/admin/set-contest`, {
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
          token : localStorage.getItem("adminToken") || ""
        },
        body: JSON.stringify({
          title : formData.title,
          description : formData.description,
          difficulty : difficulty,
          starttime : starttime,
          endtime : endtime,
          type : type,
          status : status,
          challengeids : selectedProblems
        })
      })
      if(response.ok){
        alert("Contest Created Successfully");
        navigate('/admin/dashboard');
      }else{
        alert("Error While Creating Contest")
      }
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

  useEffect(() => {
  if (!problemsPopupOpen) return;
  if (problemsList.length > 0) return;

  (async () => {
    try {
      setProblemsLoading(true);
      setProblemsError(null);
      const res = await fetch(`${BACKENDURL}/problems/getproblems`);
      if (!res.ok) throw new Error("Failed to fetch problems");
      const data = await res.json();
      const normalized = data.problems.map((d: any) => ({ id: d.id ?? d._id ?? String(d.id), title: d.title ?? d.name ?? d.slug ?? "Untitled" }));
      setProblemsList(normalized);
    } catch (err: any) {
      console.error(err);
      setProblemsError(err.message || "Error loading problems");
    } finally {
      setProblemsLoading(false);
    }
  })();
}, [problemsPopupOpen, problemsList.length]);

useEffect(() => {
  if (!problemsPopupOpen) return;
  setTempSelected(Object.fromEntries((selectedProblems ?? []).map((id) => [id, true])));
}, [problemsPopupOpen, selectedProblems]);

const filteredProblems = useMemo(() => {
  const q = popupQuery.trim().toLowerCase();
  if (!q) return problemsList;
  return problemsList.filter((p) => p.title.toLowerCase().includes(q));
}, [problemsList, popupQuery]);

function toggleTempSelect(id: string) {
  setTempSelected((s) => ({ ...s, [id]: !s[id] }));
}

function selectAllVisible() {
  setTempSelected((s) => {
    const next = { ...s };
    filteredProblems.forEach((p) => (next[p.id] = true));
    return next;
  });
}

function clearTempSelection() {
  setTempSelected({});
}

function applyPopupSelection() {
  const ids = Object.keys(tempSelected).filter((k) => tempSelected[k]);
  setSelectedProblems(ids);
  setProblemsPopupOpen(false);
}
console.log("Selected Problems: ", selectedProblems);

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
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
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

            </CardContent>
          </Card>

          <Card className="border-border/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contest Problems</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setProblemsPopupOpen(true)}
                >
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
                  {selectedProblems.map((problemId, index) => {
                    const problem = problemsList.find((p) => p.id === problemId);
                    return (
                      <div
                        key={problemId}
                        className="flex items-center justify-between rounded-md border border-border/40 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">
                            {problem ? problem.title : `Problem #${index + 1}`}
                          </span>
                          <span className="text-xs text-muted-foreground">#{problemId}</span>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedProblems((prev) => prev.filter((id) => id !== problemId))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {problemsPopupOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
              <div className="absolute inset-0 bg-black/40" onClick={() => setProblemsPopupOpen(false)} />
              <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded bg-black shadow-lg">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <h3 className="text-sm font-medium">Select Problems</h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        clearTempSelection();
                      }}
                      className="text-xs text-gray-600 hover:text-gray-800"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setProblemsPopupOpen(false)}
                      className="text-xs text-gray-600 hover:text-gray-800"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <input
                    type="search"
                    placeholder="Search problems..."
                    value={popupQuery}
                    onChange={(e) => setPopupQuery(e.target.value)}
                    className="mb-3 w-full rounded border px-3 py-2 text-sm"
                  />

                  <div className="max-h-64 overflow-auto">
                    {problemsLoading ? (
                      <div className="py-8 text-center text-sm text-gray-500">Loading problems...</div>
                    ) : problemsError ? (
                      <div className="py-8 text-center text-sm text-red-500">{problemsError}</div>
                    ) : filteredProblems.length === 0 ? (
                      <div className="py-8 text-center text-sm text-gray-500">No problems found</div>
                    ) : (
                      filteredProblems.map((p) => (
                        <label
                          key={p.id}
                          className="flex cursor-pointer items-center justify-between rounded px-2 py-2 hover:bg-gray-50 hover:text-black"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={!!tempSelected[p.id]}
                              onChange={() => toggleTempSelect(p.id)}
                              className="h-4 w-4"
                            />
                            <span className="text-sm">{p.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{p.id}</span>
                        </label>
                      ))
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <div className="text-xs text-gray-600">
                      {Object.keys(tempSelected).filter((k) => tempSelected[k]).length} selected
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={selectAllVisible}
                        className="rounded bg-gray-100 px-3 py-1 text-sm text-black"
                      >
                        Select Visible
                      </button>

                      <button
                        type="button"
                        onClick={applyPopupSelection}
                        className="rounded bg-primary px-3 py-1 text-sm text-black"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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