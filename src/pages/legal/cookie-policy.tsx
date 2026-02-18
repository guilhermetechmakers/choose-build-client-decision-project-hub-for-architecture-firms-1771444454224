import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/"><Button variant="ghost">← Home</Button></Link>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Cookie Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: February 2025</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>We use cookies and similar technologies for authentication, preferences, and analytics.</p>
            <h2 className="text-lg font-semibold mt-6">Essential cookies</h2>
            <p>Required for sign-in and security; cannot be disabled.</p>
            <h2 className="text-lg font-semibold mt-6">Preferences & analytics</h2>
            <p>You can manage consent via settings or your browser.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
