import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

const mockUsers = [
  { id: "1", name: "Jane Smith", email: "jane@firm.com", role: "PM" },
  { id: "2", name: "John Doe", email: "john@firm.com", role: "Architect" },
];

export function UserManagementPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">User management</h1>
          <p className="text-muted-foreground">Invite users, assign roles, bulk actions.</p>
        </div>
        <Button><UserPlus className="h-4 w-4 mr-2" /> Invite user</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <p className="text-sm text-muted-foreground">Invite form and user table with role definitions.</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Input placeholder="Search users" className="max-w-xs" />
          </div>
          <ul className="space-y-2">
            {mockUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">{u.role}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
