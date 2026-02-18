import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SignupCTAFirmSignupFlowProps {
  className?: string;
}

/** Signup CTA: firm sign-up flow with company name, admin contact */
export function SignupCTAFirmSignupFlow({ className }: SignupCTAFirmSignupFlowProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/20 animate-fade-in-up",
        className
      )}
    >
      <p className="text-sm font-medium text-foreground">New to Choose & Build?</p>
      <p className="text-sm text-muted-foreground mt-1">
        Create a firm account with your company name and admin contact to get started.
      </p>
      <Link to="/signup" className="mt-4 block">
        <Button
          variant="secondary"
          className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          Firm sign up
        </Button>
      </Link>
    </div>
  );
}
