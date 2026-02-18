import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditLogEntry as AuditLogEntryType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export interface AuditLogProps {
  entries: AuditLogEntryType[];
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

export function AuditLog({ entries, isLoading, className }: AuditLogProps) {
  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Audit log</CardTitle>
        <p className="text-sm text-muted-foreground">
          Who changed what and when.
        </p>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <History className="h-10 w-10 mb-2 opacity-50" aria-hidden />
            <p className="text-sm">No activity recorded yet.</p>
          </div>
        ) : (
          <ScrollArea className="h-[280px] pr-4">
            <ul className="space-y-1 border-l-2 border-border pl-4">
              {entries.map((entry) => (
                <li key={entry.id} className="relative pb-4 last:pb-0">
                  <span
                    className="absolute -left-[9px] top-1.5 h-2 w-2 rounded-full bg-primary"
                    aria-hidden
                  />
                  <p className="text-sm font-medium text-foreground">
                    {entry.userName} — {entry.action}
                  </p>
                  {entry.details && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {entry.details}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(entry.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
