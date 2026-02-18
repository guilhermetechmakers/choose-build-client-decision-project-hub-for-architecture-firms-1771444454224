import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FolderOpen,
  FileText,
  Upload,
  Search,
  Image as ImageIcon,
  Download,
  Link2,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockFolders = [
  { id: "1", name: "Drawings", count: 12 },
  { id: "2", name: "Specs", count: 5 },
  { id: "3", name: "Decisions", count: 8 },
];

const mockFiles = [
  {
    id: "1",
    name: "A-101 Floor Plan.pdf",
    size: "2.4 MB",
    updated: "Today",
    type: "application/pdf",
    version: 2,
    linkedDecisionId: "1",
    linkedDecisionTitle: "Kitchen finish options",
  },
  {
    id: "2",
    name: "A-102 Elevations.pdf",
    size: "1.8 MB",
    updated: "Yesterday",
    type: "application/pdf",
    version: 1,
    linkedDecisionId: undefined,
    linkedDecisionTitle: undefined,
  },
];

const mockVersions = [
  { id: "v1", label: "v2", date: "Today", size: "2.4 MB" },
  { id: "v2", label: "v1", date: "Yesterday", size: "2.1 MB" },
];

export function FilesPage() {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>("1");
  const [selectedFileId, setSelectedFileId] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedFile = mockFiles.find((f) => f.id === selectedFileId);
  const filteredFiles = mockFiles.filter(
    (f) =>
      !searchQuery.trim() ||
      f.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Files & Drawings</h1>
          <p className="text-muted-foreground">
            Project repository: browse folders, preview PDFs and images, view version history, and link to decisions.
          </p>
        </div>
        <Button className="transition-transform hover:scale-[1.02] hover:shadow-md">
          <Upload className="h-4 w-4 mr-2" aria-hidden />
          Upload
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          placeholder="Search files"
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search files"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Folders</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 pr-2">
              <ul className="space-y-1">
                {mockFolders.map((f) => (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedFolderId(f.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50",
                        selectedFolderId === f.id && "bg-primary/10 text-primary"
                      )}
                      aria-current={selectedFolderId === f.id ? "true" : undefined}
                    >
                      <FolderOpen className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="flex-1 truncate">{f.name}</span>
                      <span className="text-xs text-muted-foreground">{f.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Files</CardTitle>
            <p className="text-sm text-muted-foreground">
              Preview, metadata, permissions, link to decision.
            </p>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col">
            {filteredFiles.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mb-2 opacity-50" aria-hidden />
                <p className="text-sm">No files in this folder.</p>
                <Button variant="secondary" size="sm" className="mt-2">
                  <Upload className="h-4 w-4 mr-1" aria-hidden />
                  Upload file
                </Button>
              </div>
            ) : (
              <ScrollArea className="flex-1 pr-2">
                <ul className="space-y-1">
                  {filteredFiles.map((f) => (
                    <li key={f.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedFileId(f.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-all hover:shadow-sm hover:border-primary/20",
                          selectedFileId === f.id && "ring-2 ring-primary/30 border-primary/40 bg-primary/5"
                        )}
                        aria-current={selectedFileId === f.id ? "true" : undefined}
                      >
                        <FileText className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate text-sm">{f.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {f.size} · {f.updated}
                            {f.version > 1 && ` · v${f.version}`}
                          </p>
                        </div>
                        {f.linkedDecisionId && (
                          <Badge variant="secondary" className="shrink-0 text-xs">
                            Linked
                          </Badge>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 flex flex-col">
          <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base">Preview & details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Version history and quick-link to decisions.
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
            {selectedFile ? (
              <>
                <div className="rounded-xl border border-border bg-muted/30 aspect-video flex items-center justify-center min-h-[200px]">
                  {selectedFile.type?.startsWith("image/") ? (
                    <ImageIcon className="h-16 w-16 text-muted-foreground" aria-hidden />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <FileText className="h-16 w-16 mx-auto mb-2 opacity-50" aria-hidden />
                      <p className="text-sm">PDF preview (inline viewer can be added here)</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" className="transition-transform hover:scale-[1.02]">
                    <Download className="h-4 w-4 mr-1" aria-hidden />
                    Download
                  </Button>
                  <Button variant="secondary" size="sm" asChild className="transition-transform hover:scale-[1.02]">
                    <Link to={selectedFile.linkedDecisionId ? `/dashboard/decisions/${selectedFile.linkedDecisionId}` : "/dashboard/decisions"}>
                      <Link2 className="h-4 w-4 mr-1" aria-hidden />
                      {selectedFile.linkedDecisionId ? "View linked decision" : "Link to decision"}
                    </Link>
                  </Button>
                </div>
                {selectedFile.linkedDecisionTitle && (
                  <p className="text-sm text-muted-foreground">
                    Linked to: <Link to={`/dashboard/decisions/${selectedFile.linkedDecisionId}`} className="text-primary hover:underline">{selectedFile.linkedDecisionTitle}</Link>
                  </p>
                )}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-medium mb-2">
                    <History className="h-4 w-4" aria-hidden />
                    Version history
                  </h4>
                  <ScrollArea className="h-[120px] pr-2 rounded-lg border border-border">
                    <ul className="space-y-1 p-2">
                      {mockVersions.map((v) => (
                        <li
                          key={v.id}
                          className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
                        >
                          <span className="font-medium">{v.label}</span>
                          <span className="text-muted-foreground text-xs">{v.date} · {v.size}</span>
                          <Button variant="ghost" size="sm" className="h-7">
                            <Download className="h-3.5 w-3.5" aria-hidden />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mb-2 opacity-50" aria-hidden />
                <p className="text-sm">Select a file to preview and see version history.</p>
                <Button variant="secondary" size="sm" asChild className="mt-2">
                  <Link to="/dashboard/decisions">Open Decision Log</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
