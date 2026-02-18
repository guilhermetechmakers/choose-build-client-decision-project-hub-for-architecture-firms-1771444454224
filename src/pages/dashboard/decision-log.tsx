import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Search, Image, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const mockDecisions = [
  { id: "1", title: "Kitchen finish options", status: "approved", costDelta: 1200, lastActivity: "2 hours ago", thumbnail: null },
  { id: "2", title: "Exterior material selection", status: "pending", costDelta: 0, lastActivity: "1 day ago", thumbnail: null },
  { id: "3", title: "Flooring type", status: "changes_requested", costDelta: -500, lastActivity: "3 hours ago", thumbnail: null },
];

export function DecisionLogPage() {
  const { decisionId } = useParams();
  const selected = mockDecisions.find((d) => d.id === decisionId);

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-4 animate-fade-in-up md:flex-row">
      {/* List */}
      <Card className="flex flex-1 flex-col overflow-hidden md:max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Decision Log</CardTitle>
          <Button size="sm" asChild><Link to="/dashboard/decisions/new">New</Link></Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search decisions" className="pl-9" />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm"><Filter className="h-4 w-4 mr-1" /> Filter</Button>
          </div>
          <ul className="flex-1 overflow-auto space-y-2 -mx-2 px-2">
            {mockDecisions.map((d) => (
              <li key={d.id}>
                <Link
                  to={`/dashboard/decisions/${d.id}`}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                    selected?.id === d.id && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
                    {d.thumbnail ? <Image className="h-6 w-6 text-muted-foreground" /> : <FileText className="h-6 w-6 text-muted-foreground" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{d.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {d.costDelta !== 0 && (
                        <span className="text-xs text-muted-foreground">{d.costDelta > 0 ? "+" : ""}${d.costDelta}</span>
                      )}
                      <span className="text-xs text-muted-foreground">{d.lastActivity}</span>
                    </div>
                  </div>
                  <Badge variant={d.status === "approved" ? "success" : d.status === "pending" ? "warning" : "destructive"}>{d.status}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Detail panel */}
      <Card className="flex flex-1 flex-col overflow-hidden">
        {selected ? (
          <>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>{selected.title}</CardTitle>
                <p className="text-sm text-muted-foreground">Version 1 · Published 2 days ago</p>
              </div>
              <Badge variant={selected.status === "approved" ? "success" : selected.status === "pending" ? "warning" : "destructive"}>{selected.status}</Badge>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <Tabs defaultValue="options" className="w-full">
                <TabsList>
                  <TabsTrigger value="options">Options</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="history">Version history</TabsTrigger>
                  <TabsTrigger value="audit">Audit log</TabsTrigger>
                </TabsList>
                <TabsContent value="options" className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">Comparison options with cost deltas and recommendation.</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="rounded-lg border border-border p-4">
                        <div className="h-24 rounded bg-muted mb-2" />
                        <p className="font-medium">Option {i}</p>
                        <p className="text-sm text-muted-foreground">${i === 1 ? 0 : 1200} cost delta</p>
                        {i === 1 && <Badge className="mt-2">Recommended</Badge>}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button>Approve</Button>
                    <Button variant="secondary">Request changes</Button>
                  </div>
                </TabsContent>
                <TabsContent value="comments">Comments tied to this decision.</TabsContent>
                <TabsContent value="history">Version history and published snapshots.</TabsContent>
                <TabsContent value="audit">Audit log for publish/approve events.</TabsContent>
              </Tabs>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex flex-1 items-center justify-center text-muted-foreground">
            Select a decision or create a new one.
          </CardContent>
        )}
      </Card>
    </div>
  );
}
