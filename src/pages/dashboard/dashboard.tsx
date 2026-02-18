import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, FolderKanban, Calendar, ArrowRight } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockProjects = [
  { id: "1", name: "Riverside Residence", status: "active", pendingApprovals: 2, phase: "Schematic Design" },
  { id: "2", name: "Downtown Office", status: "active", pendingApprovals: 0, phase: "Construction Admin" },
  { id: "3", name: "Lake House", status: "on_hold", pendingApprovals: 1, phase: "DD" },
];

const mockActivity = [
  { time: "10:30", text: "Decision approved: Kitchen finishes – Riverside Residence" },
  { time: "09:15", text: "New decision published: Exterior materials – Downtown Office" },
  { time: "Yesterday", text: "Meeting scheduled: Riverside Residence – 2pm" },
];

const chartData = [
  { name: "Mon", approvals: 4 },
  { name: "Tue", approvals: 3 },
  { name: "Wed", approvals: 6 },
  { name: "Thu", approvals: 2 },
  { name: "Fri", approvals: 5 },
  { name: "Sat", approvals: 1 },
  { name: "Sun", approvals: 0 },
];

export function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your projects and pending approvals.</p>
        </div>
        <Link to="/dashboard/decisions/new">
          <Button>New decision</Button>
        </Link>
      </div>

      {/* KPI tiles */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending approvals</CardTitle>
            <ClipboardList className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Projects</CardTitle>
            <Link to="/dashboard/projects"><Button variant="ghost" size="sm">View all</Button></Link>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockProjects.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.phase}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.pendingApprovals > 0 && (
                      <Badge variant="warning">{p.pendingApprovals} pending</Badge>
                    )}
                    <Badge variant={p.status === "active" ? "default" : "secondary"}>{p.status}</Badge>
                    <Link to={`/dashboard/projects/${p.id}`}>
                      <Button variant="ghost" size="icon"><ArrowRight className="h-4 w-4" /></Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <p className="text-sm text-muted-foreground">Decisions and updates</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {mockActivity.map((a, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="shrink-0 text-muted-foreground">{a.time}</span>
                  <span>{a.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Approvals this week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Area type="monotone" dataKey="approvals" stroke="rgb(var(--primary))" fill="rgb(var(--primary) / 0.2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
