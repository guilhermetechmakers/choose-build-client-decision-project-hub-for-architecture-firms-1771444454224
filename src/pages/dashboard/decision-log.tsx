import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { DecisionList } from "@/components/decision-log/DecisionList";
import { DecisionDetailPanel } from "@/components/decision-log/DecisionDetailPanel";
import { RelatedItemsSidebar } from "@/components/decision-log/RelatedItemsSidebar";
import {
  useDecisionList,
  useDecision,
  useDecisionVersions,
  useDecisionAuditLog,
  useDecisionComments,
  useDecisionRelatedItems,
  useApproveDecision,
  useRequestChange,
  useAskQuestion,
  useDeleteDecision,
} from "@/hooks/use-decisions";
import type { ListDecisionsParams } from "@/api/decisions";

export function DecisionLogPage() {
  const { decisionId } = useParams<{ decisionId?: string }>();
  const [filters, setFilters] = useState<ListDecisionsParams>({
    sortBy: "updatedAt",
    sortOrder: "desc",
    page: 1,
    limit: 20,
  });

  const listQuery = useDecisionList(filters);
  const decisionQuery = useDecision(decisionId ?? null);
  const versionsQuery = useDecisionVersions(decisionId ?? null);
  const auditQuery = useDecisionAuditLog(decisionId ?? null);
  const commentsQuery = useDecisionComments(decisionId ?? null);
  const relatedQuery = useDecisionRelatedItems(decisionId ?? null);

  const approveMutation = useApproveDecision();
  const requestChangeMutation = useRequestChange();
  const askQuestionMutation = useAskQuestion();
  const deleteMutation = useDeleteDecision();

  const handleApprove = async (
    id: string,
    comment?: string,
    eSign?: boolean
  ) => {
    await approveMutation.mutateAsync({ decisionId: id, comment, eSign });
  };
  const handleRequestChange = async (id: string, comment: string) => {
    await requestChangeMutation.mutateAsync({ decisionId: id, comment });
  };
  const handleAskQuestion = async (id: string, body: string) => {
    await askQuestionMutation.mutateAsync({ decisionId: id, body });
  };
  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const decisions = listQuery.data?.items ?? [];
  const total = listQuery.data?.total ?? 0;
  const isLoadingList = listQuery.isLoading;
  const isErrorList = listQuery.isError;

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-4 animate-fade-in-up md:flex-row">
      <DecisionList
        decisions={decisions}
        isLoading={isLoadingList}
        selectedId={decisionId ?? null}
        filters={filters}
        onFiltersChange={setFilters}
        total={total}
        page={filters.page ?? 1}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        emptyMessage={
          isErrorList
            ? "Could not load decisions. Check your connection and try again."
            : "No decisions found. Create one to get started."
        }
      />

      {isErrorList && !decisionId && (
        <Card className="flex flex-1 flex-col overflow-hidden">
          <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
            <AlertTriangle className="h-12 w-12 text-destructive" aria-hidden />
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Could not load the decision log. You can still try creating a new decision.
            </p>
            <Button asChild variant="secondary">
              <Link to="/dashboard/decisions/new">New decision</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {decisionId && decisionQuery.isError && (
        <Card className="flex flex-1 flex-col overflow-hidden">
          <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
            <AlertTriangle className="h-12 w-12 text-destructive" aria-hidden />
            <p className="text-sm text-muted-foreground text-center">
              Could not load this decision.
            </p>
            <Button variant="secondary" onClick={() => decisionQuery.refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {decisionId && decisionQuery.data && (
        <>
          <DecisionDetailPanel
            decision={decisionQuery.data}
            versions={versionsQuery.data ?? []}
            auditEntries={auditQuery.data ?? []}
            comments={commentsQuery.data ?? []}
            isLoadingVersions={versionsQuery.isLoading}
            isLoadingAudit={auditQuery.isLoading}
            isLoadingComments={commentsQuery.isLoading}
            onApprove={handleApprove}
            onRequestChange={handleRequestChange}
            onAskQuestion={handleAskQuestion}
            onDelete={handleDelete}
            className="min-w-0"
          />
          <div className="hidden lg:block w-64 shrink-0">
            <RelatedItemsSidebar
              items={relatedQuery.data ?? []}
              isLoading={relatedQuery.isLoading}
            />
          </div>
        </>
      )}

      {!decisionId && !isErrorList && (
        <Card className="flex flex-1 flex-col overflow-hidden">
          <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
            <p className="text-muted-foreground">
              Select a decision from the list or create a new one.
            </p>
            <Button asChild>
              <Link to="/dashboard/decisions/new">New decision</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
