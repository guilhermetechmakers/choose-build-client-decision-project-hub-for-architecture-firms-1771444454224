import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export function UploadContentPage() {
  return (
    <div className="space-y-6 animate-fade-in-up max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Upload content</h1>
        <p className="text-muted-foreground">Drag-and-drop uploads, metadata, link to decisions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 hover:border-primary/30 transition-colors">
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Drag files here or click to browse</p>
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="Document title" />
          </div>
          <div className="space-y-2">
            <Label>Link to decision (optional)</Label>
            <Input placeholder="Select decision" />
          </div>
          <Button>Upload</Button>
        </CardContent>
      </Card>
    </div>
  );
}
