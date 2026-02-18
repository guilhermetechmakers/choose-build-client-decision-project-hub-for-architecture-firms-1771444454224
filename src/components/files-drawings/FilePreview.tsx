import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFile, useFileVersions } from "@/hooks/use-files";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ImageIcon, History } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilePreviewProps {
  fileId: string | null;
  /** Optional URL for preview (e.g. from storage). When not set, shows placeholder. */
  previewUrl?: string | null;
  /** MIME type or file extension to choose viewer (pdf vs image). */
  mimeType?: string;
  className?: string;
}

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)$/i;
const PDF_EXT = /\.pdf$/i;

export function FilePreview({
  fileId,
  previewUrl,
  mimeType,
  className,
}: FilePreviewProps) {
  const { data: file, isLoading: fileLoading, isError: fileError } = useFile(fileId);
  const { data: versions = [], isLoading: versionsLoading } = useFileVersions(fileId);

  const isPdf = !mimeType
    ? file?.title && PDF_EXT.test(file.title)
    : mimeType.toLowerCase().includes("pdf");
  const isImage = !mimeType
    ? file?.title && IMAGE_EXT.test(file.title)
    : mimeType.toLowerCase().startsWith("image/");

  if (!fileId) {
    return (
      <Card
        className={cn(
          "flex flex-col items-center justify-center min-h-[280px] text-muted-foreground transition-shadow duration-300",
          className
        )}
      >
        <CardContent className="flex flex-col items-center gap-2 pt-8">
          <FileText className="h-12 w-12 opacity-50" aria-hidden />
          <p className="text-sm">Select a file to preview</p>
        </CardContent>
      </Card>
    );
  }

  if (fileLoading || fileError) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[320px] w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow duration-300 hover:shadow-card-hover",
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base truncate">{file?.title ?? "File"}</CardTitle>
        {file?.description && (
          <p className="text-sm text-muted-foreground truncate">{file.description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              {isImage ? (
                <ImageIcon className="h-4 w-4" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Preview
            </TabsTrigger>
            <TabsTrigger value="versions" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Version history
            </TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-3">
            <div className="rounded-lg border border-border bg-muted/30 overflow-hidden min-h-[260px] flex items-center justify-center">
              {previewUrl ? (
                isPdf ? (
                  <iframe
                    title={`Preview: ${file?.title}`}
                    src={previewUrl}
                    className="w-full h-[360px] border-0"
                  />
                ) : isImage ? (
                  <img
                    src={previewUrl}
                    alt={file?.title ?? "Preview"}
                    className="max-w-full max-h-[360px] object-contain"
                  />
                ) : (
                  <object
                    data={previewUrl}
                    type={mimeType ?? "application/pdf"}
                    className="w-full h-[360px]"
                    aria-label={`Preview: ${file?.title}`}
                  >
                    <FallbackPreview type={isPdf ? "pdf" : "file"} />
                  </object>
                )
              ) : (
                <FallbackPreview type={isPdf ? "pdf" : isImage ? "image" : "file"} />
              )}
            </div>
            {/* Thumbnails strip when we have multiple pages or versions */}
            {versions.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                {versions.slice(0, 5).map((v) => (
                  <div
                    key={v.id}
                    className="shrink-0 w-16 h-16 rounded border border-border bg-muted flex items-center justify-center"
                  >
                    <span className="text-xs text-muted-foreground">v{v.version}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="versions" className="mt-3">
            {versionsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : versions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                No version history yet.
              </div>
            ) : (
              <ul className="space-y-2" role="list">
                {versions.map((v) => (
                  <li
                    key={v.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <span className="font-medium">Version {v.version}</span>
                    <span className="text-muted-foreground text-xs">
                      {v.sizeBytes != null
                        ? `${(v.sizeBytes / 1024).toFixed(1)} KB`
                        : ""}{" "}
                      · {new Date(v.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function FallbackPreview({ type }: { type: "pdf" | "image" | "file" }) {
  const labels = {
    pdf: "PDF preview not available",
    image: "Image preview not available",
    file: "Preview not available",
  };
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
      <FileText className="h-12 w-12 opacity-50" aria-hidden />
      <p className="text-sm">{labels[type]}</p>
      <p className="text-xs">Upload or open a file with a supported URL to preview.</p>
    </div>
  );
}
