import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, MessageCircle, RotateCcw, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DecisionStatus } from "@/types";

export interface ApprovalControlsProps {
  decisionId: string;
  status: DecisionStatus;
  onApprove: (decisionId: string, comment?: string, eSign?: boolean) => Promise<void>;
  onRequestChange: (decisionId: string, comment: string) => Promise<void>;
  onAskQuestion: (decisionId: string, body: string) => Promise<void>;
  eSignRequired?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ApprovalControls({
  decisionId,
  status,
  onApprove,
  onRequestChange,
  onAskQuestion,
  eSignRequired = false,
  disabled,
  className,
}: ApprovalControlsProps) {
  const [changeDialogOpen, setChangeDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [changeComment, setChangeComment] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [loading, setLoading] = useState<"approve" | "change" | "question" | null>(null);

  const isPending = status === "pending";
  const canAct = isPending && !disabled;

  const handleApprove = async () => {
    setLoading("approve");
    try {
      await onApprove(decisionId, undefined, eSignRequired);
    } finally {
      setLoading(null);
    }
  };

  const handleRequestChange = async () => {
    if (!changeComment.trim()) return;
    setLoading("change");
    try {
      await onRequestChange(decisionId, changeComment.trim());
      setChangeComment("");
      setChangeDialogOpen(false);
    } finally {
      setLoading(null);
    }
  };

  const handleAskQuestion = async () => {
    if (!questionBody.trim()) return;
    setLoading("question");
    try {
      await onAskQuestion(decisionId, questionBody.trim());
      setQuestionBody("");
      setQuestionDialogOpen(false);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button
        size="default"
        disabled={!canAct || loading !== null}
        onClick={handleApprove}
        className="transition-transform hover:scale-[1.02] hover:shadow-md"
        aria-label="Approve this decision"
      >
        {loading === "approve" ? (
          <span className="h-4 w-4 animate-pulse">...</span>
        ) : (
          <Check className="h-4 w-4 mr-2" aria-hidden />
        )}
        Approve
        {eSignRequired && (
          <PenLine className="h-4 w-4 ml-2 opacity-80" aria-label="E-sign required" />
        )}
      </Button>
      <Button
        variant="secondary"
        size="default"
        disabled={!canAct || loading !== null}
        onClick={() => setChangeDialogOpen(true)}
        className="transition-transform hover:scale-[1.02]"
        aria-label="Request changes"
      >
        <RotateCcw className="h-4 w-4 mr-2" aria-hidden />
        Request change
      </Button>
      <Button
        variant="secondary"
        size="default"
        disabled={!canAct || loading !== null}
        onClick={() => setQuestionDialogOpen(true)}
        className="transition-transform hover:scale-[1.02]"
        aria-label="Ask a question"
      >
        <MessageCircle className="h-4 w-4 mr-2" aria-hidden />
        Ask question
      </Button>

      <Dialog open={changeDialogOpen} onOpenChange={setChangeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request change</DialogTitle>
            <DialogDescription>
              Describe what needs to be changed. The team will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="change-comment">Comment (required)</Label>
            <Input
              id="change-comment"
              placeholder="What should be changed?"
              value={changeComment}
              onChange={(e) => setChangeComment(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setChangeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!changeComment.trim() || loading === "change"}
              onClick={handleRequestChange}
            >
              {loading === "change" ? "Sending…" : "Send request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ask a question</DialogTitle>
            <DialogDescription>
              Your message will be added to the comment thread for this decision.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="question-body">Question or comment</Label>
            <Input
              id="question-body"
              placeholder="Type your question..."
              value={questionBody}
              onChange={(e) => setQuestionBody(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setQuestionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!questionBody.trim() || loading === "question"}
              onClick={handleAskQuestion}
            >
              {loading === "question" ? "Sending…" : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
