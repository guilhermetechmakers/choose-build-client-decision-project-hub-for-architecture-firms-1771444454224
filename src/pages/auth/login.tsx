import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 500));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/10 to-accent/10 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-foreground">Choose & Build</h2>
          <p className="mt-2 text-muted-foreground">
            Centralized project management and client decisions for architecture firms.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <Link to="/" className="text-lg font-semibold text-primary">Choose & Build</Link>
            <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground">Sign up</Link>
          </div>
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@firm.com"
                    autoComplete="email"
                    className={cn(errors.email && "border-destructive")}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/password-reset" className="text-xs text-muted-foreground hover:text-primary">Forgot password?</Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className={cn(errors.password && "border-destructive")}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in…" : "Sign in"}
                </Button>
              </form>
              <div className="mt-4">
                <p className="text-center text-sm text-muted-foreground">Or continue with</p>
                <div className="mt-2 flex gap-2">
                  <Button type="button" variant="secondary" className="flex-1">Google</Button>
                  <Button type="button" variant="secondary" className="flex-1">Microsoft</Button>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Have an invite? <Link to="/login" className="text-primary hover:underline">Use invite token</Link>
              </p>
            </CardContent>
          </Card>
          <footer className="mt-8 text-center text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            {" · "}
            <Link to="/terms" className="hover:underline">Terms</Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
