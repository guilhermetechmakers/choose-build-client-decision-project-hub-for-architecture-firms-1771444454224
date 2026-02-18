import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SSOButtonsGoogleMicrosoftSAMLProps {
  onGoogle?: () => void;
  onMicrosoft?: () => void;
  onSAML?: () => void;
  className?: string;
}

/** SSO Buttons: Google, Microsoft, SAML (enterprise) */
export function SSOButtonsGoogleMicrosoftSAML({
  onGoogle,
  onMicrosoft,
  onSAML,
  className,
}: SSOButtonsGoogleMicrosoftSAMLProps) {
  return (
    <div className={cn("space-y-2 animate-fade-in-up", className)}>
      <p className="text-center text-sm text-muted-foreground">Or continue with</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button
          type="button"
          variant="secondary"
          className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          onClick={onGoogle}
        >
          Google
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          onClick={onMicrosoft}
        >
          Microsoft
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          onClick={onSAML}
          title="Enterprise SSO (SAML)"
        >
          SAML
        </Button>
      </div>
      <p className="text-xs text-center text-muted-foreground">
        SAML for enterprise single sign-on
      </p>
    </div>
  );
}
