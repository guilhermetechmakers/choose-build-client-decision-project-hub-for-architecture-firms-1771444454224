import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

export function EditContentPage() {
  return (
    <div className="space-y-6 animate-fade-in-up max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Edit content</h1>
        <p className="text-muted-foreground">File detail, replace file, permissions, change log.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> A-101 Floor Plan.pdf
          </CardTitle>
          <p className="text-sm text-muted-foreground">Version 2 · Updated today</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input defaultValue="A-101 Floor Plan" />
          </div>
          <Button variant="secondary">Replace file</Button>
          <Button variant="ghost">Permissions</Button>
          <div>
            <Label>Change log</Label>
            <p className="text-sm text-muted-foreground mt-1">Version history and audit trail.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
