import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DecisionVersion } from "@/types";
import { getVersionDownloadUrl } from "@/api/decisions";
import { Skeleton } from "@/components/ui/skeleton";

export interface VersionHistoryProps {
  decisionId: string;
  versions: DecisionVersion[];
  isLoading?: boolean;
  className?: string;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function VersionHistory({
  decisionId,
  versions,
  isLoading,
  className,
}: VersionHistoryProps) {
  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Version history</CardTitle>
        <p className="text-sm text-muted-foreground">
          Timestamped snapshots. Download a specific version below.
        </p>
      </CardHeader>
      <CardContent>
        {versions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <FileText className="h-10 w-10 mb-2 opacity-50" aria-hidden />
            <p className="text-sm">No published versions yet.</p>
          </div>
        ) : (
          <ScrollArea className="h-[240px] pr-4">
            <ul className="space-y-2">
              {versions.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm">Version {v.version}</p>
                    <p className="text-xs text-muted-foreground">
                      Published {formatDate(v.publishedAt)}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    asChild
                    className="shrink-0"
                  >
                    <a
                      href={getVersionDownloadUrl(decisionId, v.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Download version ${v.version}`}
                    >
                      <Download className="h-4 w-4 mr-1" aria-hidden />
                      Download
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
