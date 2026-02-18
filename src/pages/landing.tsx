import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList, FileCheck, MessageSquare, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: ClipboardList,
    title: "Decision Log",
    description: "Structured decision cards with options, cost deltas, and approval controls. Immutable versions and audit trails.",
  },
  {
    icon: MessageSquare,
    title: "Contextual Messaging",
    description: "Threads tied to decisions, files, and tasks. No more scattered email chains.",
  },
  {
    icon: FileCheck,
    title: "Timeline & Phases",
    description: "Single source of truth from kickoff to handover with decision checkpoints.",
  },
  {
    icon: LayoutTemplate,
    title: "Templates & Workflows",
    description: "Reusable project and decision templates to scale delivery.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <nav className="relative z-10 flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
          <span className="text-xl font-semibold text-primary">Choose & Build</span>
          <div className="flex items-center gap-4">
            <Link to="/help"><Button variant="ghost">Help</Button></Link>
            <Link to="/login"><Button variant="secondary">Sign in</Button></Link>
            <Link to="/signup"><Button>Get started</Button></Link>
          </div>
        </nav>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Project management and client decisions,{" "}
              <span className="text-primary">audit-ready</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              Centralize decisions, approvals, and deliverables from kickoff to handover. 
              Reduce scope creep and approval latency with a single source of truth.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/signup">
                <Button size="lg" className="min-w-[160px] shadow-md hover:shadow-lg transition-shadow">
                  Start free trial
                </Button>
              </Link>
              <Link to="/help">
                <Button size="lg" variant="secondary">See how it works</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features - Bento-style grid */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Built for architecture firms</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Decision-first UX, legal-grade versioning, and contextual messaging so nothing gets lost.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={cn(
                "rounded-lg border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/20",
                i === 0 && "md:col-span-2 md:grid md:grid-cols-2 md:gap-6"
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-4 md:px-8 border-t border-border bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to streamline decisions?</h2>
          <p className="mt-4 text-muted-foreground">Join architecture firms that ship on time with clear audit trails.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/signup"><Button size="lg">Get started</Button></Link>
            <Link to="/login"><Button size="lg" variant="secondary">Sign in</Button></Link>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 md:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">© Choose & Build</span>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground">Cookies</Link>
            <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
