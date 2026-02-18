import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HeaderLogoMarketingLinkToLandingPage,
  LoginFormEmailPasswordRememberMeSubmitButton,
  SSOButtonsGoogleMicrosoftSAML,
  SignupCTAFirmSignupFlow,
  ClientInviteFlowLink,
  FooterTermsPrivacyHelp,
} from "@/components/login-signup";
import type { LoginFormValues } from "@/components/login-signup";
import { login } from "@/api/auth";
import { cn } from "@/lib/utils";

export function LoginSignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inviteMode = searchParams.get("invite") === "1" || !!searchParams.get("token");

  useEffect(() => {
    document.title = "Sign in | Choose & Build";
  }, []);

  const handleLoginSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const session = await login({
        email: data.email,
        password: data.password,
        remember: data.remember,
      });
      if (session?.accessToken) {
        localStorage.setItem("accessToken", session.accessToken);
        toast.success("Signed in successfully.");
        navigate("/dashboard", { replace: true });
        return;
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Sign-in failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSSO = (_provider: "google" | "microsoft" | "saml") => {
    toast.info("SSO is configured via your auth provider. Redirect not implemented in this build.");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: gradient hero */}
      <div
        className={cn(
          "hidden md:flex md:w-1/2 items-center justify-center p-12 relative overflow-hidden",
          "bg-gradient-to-br from-primary/15 via-primary/5 to-accent/15",
          "animate-fade-in"
        )}
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"
          aria-hidden
        />
        <div className="relative z-10 max-w-md text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Project management and client decisions,{" "}
            <span className="text-primary">audit-ready</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Centralize decisions, approvals, and deliverables from kickoff to handover.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 bg-background">
        <div className="w-full max-w-md">
          <HeaderLogoMarketingLinkToLandingPage className="mb-6" />

          <Card className="border-border shadow-card transition-shadow duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Enter your credentials to access your account. Use SSO or invite link if provided.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <LoginFormEmailPasswordRememberMeSubmitButton
                onSubmit={handleLoginSubmit}
                isSubmitting={isSubmitting}
              />
              <SSOButtonsGoogleMicrosoftSAML
                onGoogle={() => handleSSO("google")}
                onMicrosoft={() => handleSSO("microsoft")}
                onSAML={() => handleSSO("saml")}
              />
              <ClientInviteFlowLink invitePath={inviteMode ? "/login-/-signup?invite=1" : "/login-/-signup?invite=1"} />
            </CardContent>
          </Card>

          <SignupCTAFirmSignupFlow className="mt-6" />

          <FooterTermsPrivacyHelp className="mt-8" />
        </div>
      </div>
    </div>
  );
}

export default LoginSignupPage;
