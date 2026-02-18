import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

const mockMeetings = [
  { id: "1", title: "Riverside – Design review", date: "Feb 20, 2025", time: "2:00 PM" },
  { id: "2", title: "Downtown – CA check-in", date: "Feb 22, 2025", time: "10:00 AM" },
];

export function MeetingsPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meetings & Agendas</h1>
          <p className="text-muted-foreground">Agenda builder, notes template, export minutes.</p>
        </div>
        <Button>Schedule meeting</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming</CardTitle>
          <p className="text-sm text-muted-foreground">Agenda builder and notes linked to decisions/drawings.</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {mockMeetings.map((m) => (
              <li key={m.id} className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-muted/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{m.title}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" /> {m.date} · {m.time}
                  </p>
                </div>
                <Button variant="secondary" size="sm">Agenda</Button>
                <Button variant="secondary" size="sm">Notes</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
