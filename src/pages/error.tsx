import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">We’re sorry. Please try again or contact support.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button onClick={() => window.location.reload()}>Retry</Button>
          <Link to="/"><Button variant="secondary">Go home</Button></Link>
        </div>
      </div>
    </div>
  );
}
