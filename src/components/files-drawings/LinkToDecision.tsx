import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLinkFileToDecision } from "@/hooks/use-files";
import { useDecisionList } from "@/hooks/use-decisions";

export interface LinkToDecisionProps {
  fileId: string | null;
  /** Pre-selected decision id (e.g. from file metadata). */
  linkedDecisionId?: string | null;
  onLinked?: () => void;
  className?: string;
}

export function LinkToDecision({
  fileId,
  linkedDecisionId,
  onLinked,
  className,
}: LinkToDecisionProps) {
  const [decisionId, setDecisionId] = useState<string>(linkedDecisionId ?? "");
  const [milestoneId, setMilestoneId] = useState<string>("");
  const linkMutation = useLinkFileToDecision();
  const { data: decisionsData } = useDecisionList({ limit: 50 });
  const decisions = decisionsData?.items ?? [];

  const handleLink = () => {
    if (!fileId || !decisionId) return;
    linkMutation.mutate(
      { fileId, decisionId, milestoneId: milestoneId || undefined },
      { onSuccess: onLinked }
    );
  };

  if (!fileId) {
    return (
      <Card
        className={cn(
          "flex flex-col items-center justify-center min-h-[160px] text-muted-foreground transition-shadow duration-300",
          className
        )}
      >
        <CardContent className="flex flex-col items-center gap-2 pt-8">
          <Link2 className="h-10 w-10 opacity-50" aria-hidden />
          <p className="text-sm">Select a file to link to a decision or milestone.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "transition-shadow duration-300 hover:shadow-card-hover",
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          Link to decision
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Attach this file to a decision or milestone for context.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="link-decision">Decision</Label>
          <Select
            value={decisionId}
            onValueChange={setDecisionId}
            disabled={linkMutation.isPending}
          >
            <SelectTrigger id="link-decision" className="h-9">
              <SelectValue placeholder="Select decision" />
            </SelectTrigger>
            <SelectContent>
              {decisions.length === 0 ? (
                <SelectItem value="none" disabled>
                  No decisions found
                </SelectItem>
              ) : (
                decisions.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="link-milestone">Milestone (optional)</Label>
          <Select
            value={milestoneId || "none"}
            onValueChange={(v) => setMilestoneId(v === "none" ? "" : v)}
            disabled={linkMutation.isPending}
          >
            <SelectTrigger id="link-milestone" className="h-9">
              <SelectValue placeholder="Select milestone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="design">Design phase</SelectItem>
              <SelectItem value="approval">Approval</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleLink}
          disabled={!decisionId || linkMutation.isPending}
          className="w-full sm:w-auto transition-transform hover:scale-[1.02]"
        >
          {linkMutation.isPending ? (
            "Linking…"
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Attach to decision
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
