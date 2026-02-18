import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">The page you’re looking for doesn’t exist or was moved.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link to="/"><Button>Go home</Button></Link>
          <Link to="/dashboard"><Button variant="secondary">Dashboard</Button></Link>
        </div>
      </div>
    </div>
  );
}
