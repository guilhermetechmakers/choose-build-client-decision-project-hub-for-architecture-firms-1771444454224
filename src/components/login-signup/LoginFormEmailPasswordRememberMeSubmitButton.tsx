import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof schema>;

export interface LoginFormEmailPasswordRememberMeSubmitButtonProps {
  onSubmit: (data: LoginFormValues) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

/** Login Form: email, password, remember me, submit button */
export function LoginFormEmailPasswordRememberMeSubmitButton({
  onSubmit,
  isSubmitting = false,
  className,
}: LoginFormEmailPasswordRememberMeSubmitButtonProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { remember: false },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-4 animate-fade-in-up", className)}
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@firm.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          className={cn(
            "transition-colors duration-200 focus-visible:ring-2",
            errors.email && "border-destructive focus-visible:ring-destructive/20"
          )}
          {...register("email")}
        />
        {errors.email && (
          <p id="login-email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <Link
            to="/password-reset"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "login-password-error" : undefined}
          className={cn(
            "transition-colors duration-200",
            errors.password && "border-destructive"
          )}
          {...register("password")}
        />
        {errors.password && (
          <p id="login-password-error" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="login-remember"
          className="h-4 w-4 rounded border-input text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-describedby="login-remember-desc"
          {...register("remember")}
        />
        <Label
          htmlFor="login-remember"
          id="login-remember-desc"
          className="text-sm font-normal cursor-pointer"
        >
          Remember me
        </Label>
      </div>
      <Button
        type="submit"
        className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
