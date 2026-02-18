import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, Plus } from "lucide-react";

const mockTemplates = [
  { id: "1", name: "Residential – Single family", type: "project", updated: "1 week ago" },
  { id: "2", name: "Commercial – Office", type: "project", updated: "2 weeks ago" },
  { id: "3", name: "Material selections", type: "decision_set", updated: "3 days ago" },
];

export function TemplatesPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Reusable project and decision templates; apply-template wizard.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New template</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockTemplates.map((t) => (
          <Card key={t.id} className="transition-shadow hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center gap-2">
              <LayoutTemplate className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">{t.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground capitalize">{t.type.replace("_", " ")}</p>
              <p className="text-xs text-muted-foreground mt-1">Updated {t.updated}</p>
              <Button variant="secondary" size="sm" className="mt-4">Use template</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
