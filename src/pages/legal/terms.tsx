import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/"><Button variant="ghost">← Home</Button></Link>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: February 2025</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>By using Choose & Build you agree to these terms.</p>
            <h2 className="text-lg font-semibold mt-6">Use of the service</h2>
            <p>You must use the service in compliance with applicable law and not misuse or abuse the platform or other users’ data.</p>
            <h2 className="text-lg font-semibold mt-6">Contact</h2>
            <p>Legal: <a href="mailto:legal@chooseandbuild.com" className="text-primary hover:underline">legal@chooseandbuild.com</a></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
