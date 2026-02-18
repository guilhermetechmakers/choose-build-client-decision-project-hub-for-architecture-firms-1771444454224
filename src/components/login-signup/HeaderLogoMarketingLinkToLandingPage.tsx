import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface HeaderLogoMarketingLinkToLandingPageProps {
  className?: string;
}

/** Header: logo and marketing link to Landing Page */
export function HeaderLogoMarketingLinkToLandingPage({
  className,
}: HeaderLogoMarketingLinkToLandingPageProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between w-full animate-fade-in",
        className
      )}
      role="banner"
    >
      <Link
        to="/"
        className="text-xl font-semibold text-primary hover:text-primary/90 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
        aria-label="Choose & Build – Home"
      >
        Choose & Build
      </Link>
      <Link
        to="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1"
      >
        Back to home
      </Link>
    </header>
  );
}
