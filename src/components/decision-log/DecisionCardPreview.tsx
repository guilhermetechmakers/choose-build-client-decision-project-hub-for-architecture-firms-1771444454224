import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Decision, DecisionStatus } from "@/types";

export interface DecisionCardPreviewProps {
  decision: Decision;
  isSelected?: boolean;
  className?: string;
}

const statusVariant: Record<DecisionStatus, "success" | "warning" | "destructive" | "secondary"> = {
  approved: "success",
  pending: "warning",
  changes_requested: "destructive",
  draft: "secondary",
};

/** Pending | Approved | Rejected (changes_requested) per spec */
const statusLabel: Record<DecisionStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  changes_requested: "Rejected",
  draft: "Draft",
};

function formatLastActivity(value: string | undefined, fallback: string | undefined): string {
  if (!value) return fallback ?? "—";
  const trimmed = value.trim();
  if (!trimmed) return fallback ?? "—";
  const asDate = new Date(trimmed);
  if (!Number.isNaN(asDate.getTime())) {
    const now = Date.now();
    const diffMs = now - asDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return asDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }
  return trimmed;
}

export function DecisionCardPreview({
  decision,
  isSelected,
  className,
}: DecisionCardPreviewProps) {
  const statusVar = statusVariant[decision.status];
  const displayStatus = statusLabel[decision.status];
  const lastActivity = formatLastActivity(
    decision.lastActivityAt ?? decision.updatedAt,
    decision.updatedAt
  );

  return (
    <Link
      to={`/dashboard/decisions/${decision.id}`}
      className={cn("block transition-transform duration-200 hover:scale-[1.02] hover:shadow-md", className)}
      aria-label={`View decision: ${decision.title}`}
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-200 hover:shadow-card-hover",
          isSelected && "ring-2 ring-primary bg-primary/5 border-primary/30"
        )}
      >
        <CardContent className="p-0">
          <div className="flex items-stretch gap-3 p-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted border border-border overflow-hidden">
              {decision.thumbnailUrl ? (
                <img
                  src={decision.thumbnailUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                decision.options?.[0]?.imageUrl ? (
                  <img
                    src={decision.options[0].imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FileText className="h-6 w-6 text-muted-foreground" aria-hidden />
                )
              )}
            </div>
            <div className="min-w-0 flex-1 flex flex-col justify-center gap-1">
              <p className="font-medium truncate text-foreground">{decision.title}</p>
              {decision.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {decision.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {decision.costImpact != null && decision.costImpact !== 0 && (
                  <span className="text-xs text-muted-foreground">
                    {decision.costImpact > 0 ? "+" : ""}${decision.costImpact}
                  </span>
                )}
                <span className="text-xs text-muted-foreground" title={decision.updatedAt}>
                  {lastActivity}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center">
              <Badge variant={statusVar} className="capitalize">
                {displayStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
