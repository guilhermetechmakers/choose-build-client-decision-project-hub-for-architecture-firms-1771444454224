import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export function EmailVerificationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <Card className="border-border shadow-card">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-center">Verify your email</CardTitle>
            <CardDescription className="text-center">
              We’ve sent a verification link to your email. Click the link to confirm your address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full"><Link to="/dashboard">Go to Dashboard</Link></Button>
            <p className="text-center text-sm text-muted-foreground">
              Didn’t receive the email?{" "}
              <button type="button" className="text-primary hover:underline">Resend</button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
