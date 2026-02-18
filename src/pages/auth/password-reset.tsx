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
  password: z.string().min(8, "At least 8 characters"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords must match", path: ["confirm"] });

type FormData = z.infer<typeof schema>;

export function PasswordResetPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 500));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground inline-block mb-6">← Back to sign in</Link>
        <Card className="border-border shadow-card">
          <CardHeader>
            <CardTitle>Set new password</CardTitle>
            <CardDescription>Choose a strong password. Consider using a mix of letters, numbers, and symbols.</CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitSuccessful ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Your password has been reset.</p>
                <Button asChild className="w-full"><Link to="/login">Sign in</Link></Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className={cn(errors.password && "border-destructive")}
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    className={cn(errors.confirm && "border-destructive")}
                    {...register("confirm")}
                  />
                  {errors.confirm && (
                    <p className="text-sm text-destructive">{errors.confirm.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Saving…" : "Reset password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
