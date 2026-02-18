import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";

const plans = [
  { id: "starter", name: "Starter", price: 49, seats: 3 },
  { id: "pro", name: "Professional", price: 99, seats: 10 },
  { id: "enterprise", name: "Enterprise", price: 249, seats: 50 },
];

export function CheckoutPage() {
  return (
    <div className="space-y-6 animate-fade-in-up max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">Plan selection and payment.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {plans.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-muted-foreground">Up to {p.seats} seats</p>
              </div>
              <p className="text-xl font-bold">${p.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <Button size="sm">Select</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Card number</Label>
            <Input placeholder="4242 4242 4242 4242" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expiry</Label>
              <Input placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <Label>CVC</Label>
              <Input placeholder="123" />
            </div>
          </div>
          <Button className="w-full">Subscribe</Button>
        </CardContent>
      </Card>
    </div>
  );
}
