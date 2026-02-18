import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface FooterTermsPrivacyHelpProps {
  className?: string;
}

/** Footer: links to Terms, Privacy, Help */
export function FooterTermsPrivacyHelp({ className }: FooterTermsPrivacyHelpProps) {
  return (
    <footer
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground animate-fade-in",
        className
      )}
      role="contentinfo"
    >
      <Link
        to="/terms"
        className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
      >
        Terms
      </Link>
      <Link
        to="/privacy"
        className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
      >
        Privacy
      </Link>
      <Link
        to="/help"
        className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
      >
        Help
      </Link>
    </footer>
  );
}
