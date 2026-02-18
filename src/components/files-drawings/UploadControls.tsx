import { useCallback, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadFile } from "@/hooks/use-files";

export interface UploadControlsProps {
  folderId?: string | null;
  onUploadComplete?: () => void;
  className?: string;
}

export interface FileWithMeta {
  file: File;
  title?: string;
  sheetNumber?: string;
  discipline?: string;
}

export function UploadControls({
  folderId,
  onUploadComplete,
  className,
}: UploadControlsProps) {
  const [dragActive, setDragActive] = useState(false);
  const [queue, setQueue] = useState<FileWithMeta[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [metadata, setMetadata] = useState({
    sheetNumber: "",
    discipline: "",
  });
  const uploadQueueRef = useRef<FileWithMeta[]>([]);
  const upload = useUploadFile();

  const processNextInQueue = useCallback(() => {
    if (uploadQueueRef.current.length === 0) {
      setProgress(null);
      setQueue([]);
      onUploadComplete?.();
      return;
    }
    const first = uploadQueueRef.current[0];
    upload.mutate(
      {
        payload: {
          file: first.file,
          title: first.title ?? first.file.name,
          folderId: folderId ?? undefined,
          sheetNumber: first.sheetNumber,
          discipline: first.discipline,
        },
        onProgress: (p) => setProgress(p),
      },
      {
        onSettled: () => {
          setProgress(null);
          uploadQueueRef.current = uploadQueueRef.current.slice(1);
          setQueue((q) => q.slice(1));
          processNextInQueue();
        },
      }
    );
  }, [folderId, onUploadComplete, upload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length) {
        setQueue((q) => [
          ...q,
          ...files.map((file) => ({
            file,
            sheetNumber: metadata.sheetNumber || undefined,
            discipline: metadata.discipline || undefined,
          })),
        ]);
      }
    },
    [metadata.discipline, metadata.sheetNumber]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (files.length) {
        setQueue((q) => [
          ...q,
          ...files.map((file) => ({
            file,
            sheetNumber: metadata.sheetNumber || undefined,
            discipline: metadata.discipline || undefined,
          })),
        ]);
      }
      e.target.value = "";
    },
    [metadata.discipline, metadata.sheetNumber]
  );

  const removeFromQueue = (index: number) => {
    setQueue((q) => q.filter((_, i) => i !== index));
  };

  const uploadAll = () => {
    if (queue.length === 0) return;
    uploadQueueRef.current = [...queue];
    processNextInQueue();
  };

  const updateQueueMeta = (index: number, key: keyof FileWithMeta, value: string) => {
    setQueue((q) =>
      q.map((item, i) => (i === index ? { ...item, [key]: value || undefined } : item))
    );
  };

  return (
    <Card
      className={cn(
        "transition-shadow duration-300 hover:shadow-card-hover",
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Drag-and-drop or select files. Add sheet number and discipline for drawings.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors duration-200",
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
          )}
        >
          <input
            type="file"
            multiple
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
            onChange={handleChange}
            aria-label="Choose files to upload"
          />
          <Upload className="h-10 w-10 text-muted-foreground mb-2" aria-hidden />
          <p className="text-sm font-medium text-foreground">
            Drop files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, images, drawings. Bulk upload supported.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sheet-number">Sheet number (optional)</Label>
            <Input
              id="sheet-number"
              placeholder="e.g. A-101"
              value={metadata.sheetNumber}
              onChange={(e) => setMetadata((m) => ({ ...m, sheetNumber: e.target.value }))}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discipline">Discipline (optional)</Label>
            <Input
              id="discipline"
              placeholder="e.g. Architectural, Structural"
              value={metadata.discipline}
              onChange={(e) => setMetadata((m) => ({ ...m, discipline: e.target.value }))}
              className="h-9"
            />
          </div>
        </div>

        {progress != null && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Uploading… {progress}%</p>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {queue.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Queue ({queue.length})</p>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {queue.map((item, i) => (
                <li
                  key={`${item.file.name}-${i}`}
                  className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
                >
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">
                    <span className="truncate">{item.file.name}</span>
                    <Input
                      placeholder="Sheet #"
                      value={item.sheetNumber ?? ""}
                      onChange={(e) => updateQueueMeta(i, "sheetNumber", e.target.value)}
                      className="h-7 w-24 text-xs"
                    />
                    <Input
                      placeholder="Discipline"
                      value={item.discipline ?? ""}
                      onChange={(e) => updateQueueMeta(i, "discipline", e.target.value)}
                      className="h-7 w-28 text-xs"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => removeFromQueue(i)}
                    aria-label={`Remove ${item.file.name} from queue`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              onClick={uploadAll}
              disabled={upload.isPending || progress != null}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload {queue.length} file{queue.length !== 1 ? "s" : ""}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
