import { useEffect, useState, type JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import {
  Calendar,
  Clock,
  Trophy,
  ArrowLeft,
  SquareChevronRight, 
} from "lucide-react";
import { BACKENDURL } from "../utils/urls";
import { toast } from "../../../../packages/ui/src/hooks/use-toast";

type Problem = { id: string; title: string };

interface ProblemAndContestMapping {
  id: string;
  challengeId: string;
  contestId: string;
  challenge : {
    id : string;
    title : string;
    description : string;
    difficulty : string;
    slug : string;
    tags :  string[];
    maxpoint : number;
    starterCode : string;
    createdAt : string;
    updatedAt : string
  }
}

type ContestAPI = {
  id: string;
  title: string;
  description: string;
  startTime: string; 
  endTime: string; 
  duration?: string;
  participants: number;
  problems?: Problem[];
  prize?: string;
  status: "upcoming" | "ongoing" | "completed";
  difficulty: "easy" | "medium" | "hard";
  type?: string;
  contestTochallegemapping : ProblemAndContestMapping[];
};



function formatDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function getDifficultyColor(diff: ContestAPI["difficulty"]) {
  switch (diff) {
    case "easy":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "hard":
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
}
function getStatusBadge(status: ContestAPI["status"]) {
  switch (status) {
    case "upcoming":
      return (
        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          Upcoming
        </Badge>
      );
    case "ongoing":
      return (
        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
          Live Now
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">
          Completed
        </Badge>
      );
  }
}

export default function ContestPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [contest, setContest] = useState<ContestAPI | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BACKENDURL}/contest/getcontest/${id}`, {
          headers: { "Content-Type": "application/json", token: localStorage.getItem("token") || "" },
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `HTTP ${res.status}`);
        }
        const json = await res.json();
        if (!cancelled) setContest(json.contest ?? json);
      } catch (err) {
        toast({ title: "Error", description: "Failed to load contest", variant: "destructive" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          <div className="flex items-center gap-2">
            <SquareChevronRight className="h-6 w-6" />
            <h2 className="text-lg font-semibold">{contest?.title ?? "Contest"}</h2>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(contest?.status ?? "upcoming")}
                    <Badge className={getDifficultyColor(contest?.difficulty ?? "medium")}>
                      {contest?.difficulty ?? "—"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{contest?.type ?? ""}</div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{contest?.title ?? "Loading…"}</h3>
                <p className="mb-4 text-sm text-muted-foreground whitespace-pre-line">
                  {loading ? "Loading description…" : contest?.description ?? "No description"}
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <div>
                      <div className="text-xs">Start</div>
                      <div className="font-medium">{formatDate(contest?.startTime)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <div>
                      <div className="text-xs">End</div>
                      <div className="font-medium">{formatDate(contest?.endTime)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Problems</h4>
                  <div className="text-xs text-muted-foreground">{contest?.contestTochallegemapping?.length ?? 0} problems</div>
                </div>
              </CardHeader>

              <CardContent>
                {loading ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">Loading problems…</div>
                ) : contest?.contestTochallegemapping?.length ? (
                  <ul className="space-y-2">
                    {contest!.contestTochallegemapping!.map((p, idx) => (
                      <li key={p.id} className="flex items-center justify-between rounded px-3 py-2 hover:bg-gray-50">
                        <div>
                          <a href={`/problems/${p.id}`} className="text-sm font-medium text-blue-700 hover:underline">
                            {idx + 1}. {p.challenge.title}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={`/problem/${p.challenge.slug}`} className="rounded border px-2 py-1 text-xs">Open</a>
                          <a href={`/contest/${contest?.id}/submit/${p.id}`} className="rounded border px-2 py-1 text-xs">Submit</a>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">No problems</div>
                )}
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card className="border-border/40">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Participants</div>
                    <div className="text-lg font-semibold">{contest?.participants?.toLocaleString() ?? 0}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    variant={contest?.status === "ongoing" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => {
                      if (contest?.status === "upcoming") {
                        toast({ title: "Info", description: "Registration not implemented" });
                      } else if (contest?.status === "ongoing") {
                        window.location.href = `/contest/${contest?.id}/live`;
                      } else {
                        navigate(`/contest/${contest?.id}/results`);
                      }
                    }}
                  >
                    {(contest?.status)?.toLowerCase() === "upcoming" && "Register"}
                    {contest?.status?.toLowerCase() === "ongoing" && "Join Now"}
                    {contest?.status?.toLowerCase() === "completed" && "View Results"}
                  </Button>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  Type: {contest?.type?.toLowerCase() ?? "—"}
                </div>

              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}