import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const phases = [
  { id: "kickoff", name: "Kickoff", progress: 100 },
  { id: "concept", name: "Concept", progress: 100 },
  { id: "schematic", name: "Schematic", progress: 80 },
  { id: "dd", name: "DD", progress: 40 },
  { id: "permitting", name: "Permitting", progress: 0 },
  { id: "ca", name: "CA", progress: 0 },
  { id: "handover", name: "Handover", progress: 0 },
];

const milestones = [
  { id: "1", title: "Site visit complete", phase: "Kickoff", status: "done" },
  { id: "2", title: "Material selection", phase: "Schematic", status: "pending" },
  { id: "3", title: "Structural approval", phase: "DD", status: "upcoming" },
];

export function ProjectBoardPage() {
  const { projectId } = useParams();
  const projectName = projectId ? "Riverside Residence" : "All projects";

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Project timeline</h1>
          <p className="text-muted-foreground">{projectName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Gantt view</Button>
          <Button>Add milestone</Button>
        </div>
      </div>

      {/* Phase timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Phases</CardTitle>
          <p className="text-sm text-muted-foreground">Horizontal phase timeline with progress</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {phases.map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    "flex w-28 shrink-0 flex-col rounded-lg border p-3 transition-colors hover:border-primary/30",
                    p.progress > 0 ? "border-primary/20 bg-primary/5" : "border-border"
                  )}
                >
                  <span className="text-sm font-medium">{p.name}</span>
                  <Progress value={p.progress} className="mt-2 h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones / Decision checkpoints */}
      <Card>
        <CardHeader>
          <CardTitle>Milestones & decision checkpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {milestones.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{m.title}</p>
                  <p className="text-sm text-muted-foreground">{m.phase}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={m.status === "done" ? "success" : m.status === "pending" ? "warning" : "secondary"}>
                    {m.status}
                  </Badge>
                  <Link to="/dashboard/decisions">
                    <Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
