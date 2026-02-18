import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const mockInvoices = [
  { id: "1", date: "Feb 1, 2025", amount: 99, status: "Paid" },
  { id: "2", date: "Jan 1, 2025", amount: 99, status: "Paid" },
];

export function OrderHistoryPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold">Order history</h1>
        <p className="text-muted-foreground">Transactions and invoice downloads.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {mockInvoices.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium">{inv.date}</p>
                  <p className="text-sm text-muted-foreground">${inv.amount}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-success">{inv.status}</span>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
