import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, FileText } from "lucide-react";

export function BillingPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">Plan selection, payment form, invoice history, add-ons.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Current plan
            </CardTitle>
            <p className="text-sm text-muted-foreground">Professional · 5 seats</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$99<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
            <Link to="/dashboard/checkout"><Button variant="secondary" className="mt-4">Change plan</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Download past invoices and receipts.</p>
            <Link to="/dashboard/orders"><Button variant="secondary" className="mt-4">Order history</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
