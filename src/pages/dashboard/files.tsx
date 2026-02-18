import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderOpen, FileText, Upload, Search } from "lucide-react";

const mockFolders = [
  { id: "1", name: "Drawings", count: 12 },
  { id: "2", name: "Specs", count: 5 },
  { id: "3", name: "Decisions", count: 8 },
];

const mockFiles = [
  { id: "1", name: "A-101 Floor Plan.pdf", size: "2.4 MB", updated: "Today" },
  { id: "2", name: "A-102 Elevations.pdf", size: "1.8 MB", updated: "Yesterday" },
];

export function FilesPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Files & Drawings</h1>
          <p className="text-muted-foreground">Project assets with versions and link-to-decision.</p>
        </div>
        <Button><Upload className="h-4 w-4 mr-2" /> Upload</Button>
      </div>

      <div className="flex gap-4">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search files" className="pl-9" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {mockFolders.map((f) => (
                <li key={f.id} className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted/50">
                  <FolderOpen className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-1">{f.name}</span>
                  <span className="text-sm text-muted-foreground">{f.count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <p className="text-sm text-muted-foreground">Preview, metadata, permissions, link to decision.</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {mockFiles.map((f) => (
                <li key={f.id} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.size} · {f.updated}</p>
                  </div>
                  <Button variant="ghost" size="sm">Link to decision</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
