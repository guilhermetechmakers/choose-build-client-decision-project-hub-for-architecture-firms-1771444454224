import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/"><Button variant="ghost">← Home</Button></Link>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: February 2025</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>Choose & Build (“we”) collects and uses data as described in this policy to provide and improve our services.</p>
            <h2 className="text-lg font-semibold mt-6">Data we collect</h2>
            <p>Account data (name, email, firm), project and decision data you create, and usage data necessary to operate the service.</p>
            <h2 className="text-lg font-semibold mt-6">How we use it</h2>
            <p>To deliver the platform, support you, and improve our product. We do not sell your data.</p>
            <h2 className="text-lg font-semibold mt-6">Contact</h2>
            <p>For privacy requests or questions: <a href="mailto:privacy@chooseandbuild.com" className="text-primary hover:underline">privacy@chooseandbuild.com</a></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
