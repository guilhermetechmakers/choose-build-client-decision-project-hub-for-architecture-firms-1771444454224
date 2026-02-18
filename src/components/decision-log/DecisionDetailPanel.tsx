import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileText, Image as ImageIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Decision, DecisionOption, DecisionComment } from "@/types";
import { ApprovalControls } from "./ApprovalControls";
import { VersionHistory } from "./VersionHistory";
import { AuditLog } from "./AuditLog";
import type { DecisionVersion } from "@/types";
import type { AuditLogEntry } from "@/types";

export interface DecisionDetailPanelProps {
  decision: Decision;
  versions: DecisionVersion[];
  auditEntries: AuditLogEntry[];
  comments: DecisionComment[];
  isLoadingVersions?: boolean;
  isLoadingAudit?: boolean;
  isLoadingComments?: boolean;
  onApprove: (id: string, comment?: string, eSign?: boolean) => Promise<void>;
  onRequestChange: (id: string, comment: string) => Promise<void>;
  onAskQuestion: (id: string, body: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  className?: string;
}

function OptionCard({ option }: { option: DecisionOption }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-card-hover hover:border-primary/20",
        option.recommended && "ring-2 ring-primary/30 border-primary/40"
      )}
    >
      <div className="aspect-video w-full rounded-lg bg-muted mb-3 overflow-hidden flex items-center justify-center">
        {option.imageUrl ? (
          <img
            src={option.imageUrl}
            alt={option.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="h-12 w-12 text-muted-foreground" aria-hidden />
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{option.title}</p>
          {option.description && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {option.description}
            </p>
          )}
        </div>
        {option.recommended && (
          <Badge variant="default" className="shrink-0">
            Recommended
          </Badge>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2">
        {option.costDelta != null && (
          <span
            className={cn(
              "text-sm font-medium",
              option.costDelta > 0 && "text-destructive",
              option.costDelta < 0 && "text-success",
              option.costDelta === 0 && "text-muted-foreground"
            )}
          >
            {option.costDelta > 0 ? "+" : ""}${option.costDelta} cost delta
          </span>
        )}
        {option.pdfUrl && (
          <a
            href={option.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden />
            PDF
          </a>
        )}
      </div>
    </div>
  );
}

function CommentThread({ comments }: { comments: DecisionComment[] }) {
  const byParent = new Map<string, DecisionComment[]>();
  const roots: DecisionComment[] = [];
  for (const c of comments) {
    if (c.parentId) {
      const siblings = byParent.get(c.parentId) ?? [];
      siblings.push(c);
      byParent.set(c.parentId, siblings);
    } else {
      roots.push(c);
    }
  }
  roots.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  }

  return (
    <ScrollArea className="h-[240px] pr-4">
      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <FileText className="h-10 w-10 mb-2 opacity-50" aria-hidden />
          <p className="text-sm">No comments yet. Use “Ask question” to start a thread.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {roots.map((c) => (
            <li key={c.id} className="border-l-2 border-border pl-3">
              <p className="text-sm font-medium">{c.userName}</p>
              <p className="text-sm text-foreground mt-0.5">{c.body}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(c.createdAt)}
              </p>
              {byParent.get(c.id)?.length ? (
                <ul className="mt-2 ml-2 space-y-2">
                  {byParent.get(c.id)!.map((reply) => (
                    <li key={reply.id} className="text-sm border-l border-border pl-2">
                      <p className="font-medium">{reply.userName}</p>
                      <p className="text-foreground mt-0.5">{reply.body}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(reply.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </ScrollArea>
  );
}

export function DecisionDetailPanel({
  decision,
  versions,
  auditEntries,
  comments,
  isLoadingVersions,
  isLoadingAudit,
  isLoadingComments,
  onApprove,
  onRequestChange,
  onAskQuestion,
  onDelete,
  className,
}: DecisionDetailPanelProps) {
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const statusLabel =
    decision.status === "changes_requested" ? "Change requested" : decision.status;

  return (
    <Card className={cn("flex flex-1 flex-col overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-4">
        <div className="min-w-0">
          <CardTitle className="text-xl">{decision.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Version {decision.version}
            {decision.publishedAt && (
              <> · Published {new Date(decision.publishedAt).toLocaleDateString()}</>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant={
              decision.status === "approved"
                ? "success"
                : decision.status === "pending"
                  ? "warning"
                  : decision.status === "changes_requested"
                    ? "destructive"
                    : "secondary"
            }
            className="capitalize"
          >
            {statusLabel}
          </Badge>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
              aria-label="Delete decision"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete decision?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &quot;{decision.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async (e) => {
                e.preventDefault();
                setDeleting(true);
                try {
                  await onDelete?.(decision.id);
                  setDeleteOpen(false);
                  navigate("/dashboard/decisions");
                } finally {
                  setDeleting(false);
                }
              }}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <CardContent className="flex-1 overflow-hidden flex flex-col gap-4">
        <Tabs defaultValue="options" className="w-full flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="history">Version history</TabsTrigger>
            <TabsTrigger value="audit">Audit log</TabsTrigger>
          </TabsList>
          <TabsContent value="options" className="space-y-4 pt-4 flex-1 min-h-0">
            {decision.description && (
              <p className="text-sm text-muted-foreground">{decision.description}</p>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              {decision.options?.length
                ? decision.options.map((opt) => (
                    <OptionCard key={opt.id} option={opt} />
                  ))
                : (
                  <p className="text-sm text-muted-foreground col-span-2">
                    No options added yet.
                  </p>
                )}
            </div>
            <ApprovalControls
              decisionId={decision.id}
              status={decision.status}
              onApprove={onApprove}
              onRequestChange={onRequestChange}
              onAskQuestion={onAskQuestion}
            />
          </TabsContent>
          <TabsContent value="comments" className="pt-4 flex-1 min-h-0">
            {isLoadingComments ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-4 w-1/2 rounded bg-muted" />
              </div>
            ) : (
              <CommentThread comments={comments} />
            )}
          </TabsContent>
          <TabsContent value="history" className="pt-4 flex-1 min-h-0">
            <VersionHistory
              decisionId={decision.id}
              versions={versions}
              isLoading={isLoadingVersions}
            />
          </TabsContent>
          <TabsContent value="audit" className="pt-4 flex-1 min-h-0">
            <AuditLog entries={auditEntries} isLoading={isLoadingAudit} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
