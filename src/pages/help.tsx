import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle, Book, Mail } from "lucide-react";

export function HelpPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/"><Button variant="ghost">← Home</Button></Link>
          <Link to="/login"><Button variant="secondary">Sign in</Button></Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground mt-1">FAQs, guides, and contact.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" /> FAQs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium">How do I publish a decision?</p>
              <p className="text-sm text-muted-foreground">Go to Decision Log → New decision and complete the multi-step form (info, options, cost, audience), then Publish.</p>
            </div>
            <div>
              <p className="font-medium">How are approvals recorded?</p>
              <p className="text-sm text-muted-foreground">Each approval is timestamped and stored as an immutable audit record linked to the decision version.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" /> Guides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Onboarding and release notes available after sign-in.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label>Message</Label>
                <Input placeholder="Describe your issue or question" />
              </div>
              <Button type="submit">Send</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
