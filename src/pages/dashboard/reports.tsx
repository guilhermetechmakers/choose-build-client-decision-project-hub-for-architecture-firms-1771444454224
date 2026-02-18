import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const kpiData = [
  { label: "Pending approvals", value: 3, trend: "up" },
  { label: "Avg. approval time", value: "2.5 days", trend: "down" },
  { label: "Decisions this month", value: 12, trend: "up" },
];

const chartData = [
  { name: "Week 1", pending: 4, approved: 8 },
  { name: "Week 2", pending: 3, approved: 10 },
  { name: "Week 3", pending: 5, approved: 7 },
  { name: "Week 4", pending: 3, approved: 9 },
];

export function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">KPI tiles, trend charts, export to CSV/PDF.</p>
        </div>
        <Button variant="secondary">Export</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {kpiData.map((k) => (
          <Card key={k.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{k.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{k.value}</div>
              <p className="text-xs text-muted-foreground">vs previous period</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval trends</CardTitle>
          <p className="text-sm text-muted-foreground">Pending vs approved by week</p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pending" fill="rgb(var(--warning))" name="Pending" radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" fill="rgb(var(--success))" name="Approved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
