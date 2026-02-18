import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface ClientInviteFlowLinkProps {
  className?: string;
  /** If set, link goes to invite page with token pre-filled (e.g. from query). */
  invitePath?: string;
}

/** Client Invite Flow Link: enter invite token or link */
export function ClientInviteFlowLink({
  className,
  invitePath = "/login-/-signup?invite=1",
}: ClientInviteFlowLinkProps) {
  return (
    <div
      className={cn(
        "text-center animate-fade-in-up",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        Have an invite?{" "}
        <Link
          to={invitePath}
          className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
        >
          Enter invite token or link
        </Link>
      </p>
    </div>
  );
}
