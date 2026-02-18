import { useState } from "react";
import { Button } from "@/components/ui/button";
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

/** Textarea with min height for comment/question inputs */
function CommentInput({
  id,
  value,
  onChange,
  placeholder,
  label,
  "aria-label": ariaLabel,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
  "aria-label"?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        rows={3}
        aria-label={ariaLabel ?? label}
      />
    </div>
  );
}

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
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [changeComment, setChangeComment] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [approveComment, setApproveComment] = useState("");
  const [loading, setLoading] = useState<"approve" | "change" | "question" | null>(null);

  const isPending = status === "pending";
  const canAct = isPending && !disabled;

  const handleApprove = async (comment?: string) => {
    setLoading("approve");
    try {
      await onApprove(decisionId, comment || undefined, eSignRequired);
      setApproveComment("");
      setApproveDialogOpen(false);
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
        onClick={() => (eSignRequired ? setApproveDialogOpen(true) : handleApprove())}
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
      {!eSignRequired && (
        <Button
          size="default"
          variant="secondary"
          disabled={!canAct || loading !== null}
          onClick={() => setApproveDialogOpen(true)}
          className="transition-transform hover:scale-[1.02]"
          aria-label="Approve with comment"
        >
          Approve with comment
        </Button>
      )}
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
          <div className="py-2">
            <CommentInput
              id="change-comment"
              label="Comment (required)"
              placeholder="What should be changed?"
              value={changeComment}
              onChange={setChangeComment}
              aria-label="Comment for change request"
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
          <div className="py-2">
            <CommentInput
              id="question-body"
              label="Question or comment"
              placeholder="Type your question..."
              value={questionBody}
              onChange={setQuestionBody}
              aria-label="Question or comment"
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

      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve decision</DialogTitle>
            <DialogDescription>
              {eSignRequired
                ? "E-signature is required for this approval. Add an optional comment below."
                : "Add an optional comment to this approval."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <CommentInput
              id="approve-comment"
              label="Comment (optional)"
              placeholder="Optional note..."
              value={approveComment}
              onChange={setApproveComment}
              aria-label="Optional approval comment"
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={loading === "approve"}
              onClick={() => handleApprove(approveComment.trim() || undefined)}
            >
              {loading === "approve" ? "Approving…" : eSignRequired ? "Approve & E-sign" : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
