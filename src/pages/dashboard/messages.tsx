import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

const mockThreads = [
  { id: "1", subject: "Kitchen finishes – Riverside", resource: "Decision", unread: 2, lastAt: "10:30" },
  { id: "2", subject: "Exterior materials", resource: "Decision", unread: 0, lastAt: "Yesterday" },
];

export function MessagesPage() {
  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-4 animate-fade-in-up md:flex-row">
      <Card className="flex w-full flex-col overflow-hidden md:max-w-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Threads</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full">
            <ul className="space-y-0">
              {mockThreads.map((t) => (
                <li key={t.id} className="border-b border-border p-3 hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{t.subject}</p>
                    {t.unread > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{t.unread}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{t.resource} · {t.lastAt}</p>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardHeader>
          <CardTitle>Contextual messaging</CardTitle>
          <p className="text-sm text-muted-foreground">Threads tied to decisions, files, tasks.</p>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto rounded-lg border border-border p-4">
            <p className="text-sm text-muted-foreground">Select a thread or start a new conversation linked to a decision or file.</p>
          </div>
          <div className="mt-4 flex gap-2">
            <Input placeholder="Type a message…" className="flex-1" />
            <Button size="icon"><Send className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
