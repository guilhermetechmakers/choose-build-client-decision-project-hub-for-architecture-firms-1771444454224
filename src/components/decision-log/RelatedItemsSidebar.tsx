import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileImage, CheckSquare, StickyNote, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RelatedItem } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export interface RelatedItemsSidebarProps {
  items: RelatedItem[];
  isLoading?: boolean;
  className?: string;
}

const iconByType = {
  drawing: FileImage,
  task: CheckSquare,
  meeting_note: StickyNote,
};

export function RelatedItemsSidebar({
  items,
  isLoading,
  className,
}: RelatedItemsSidebarProps) {
  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Related items</CardTitle>
        <p className="text-sm text-muted-foreground">
          Linked drawings, tasks, and meeting notes.
        </p>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <Link2 className="h-10 w-10 mb-2 opacity-50" aria-hidden />
            <p className="text-sm">No linked items.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => {
              const Icon = iconByType[item.type];
              const label =
                item.type === "drawing"
                  ? "Drawing"
                  : item.type === "task"
                    ? "Task"
                    : "Meeting note";
              const content = (
                <span className="flex items-center gap-2 rounded-lg border border-border p-2 transition-colors hover:bg-muted/50 hover:shadow-sm">
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {item.title}
                  </span>
                </span>
              );
              return (
                <li key={item.id}>
                  {item.url ? (
                    <Link to={item.url} className="block">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                  <span className="sr-only">{label}</span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
