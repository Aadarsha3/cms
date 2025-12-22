import { useState } from "react";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch {
      toast({
        title: "Sign in failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // todo: remove mock functionality
  const quickLogin = async (role: "admin" | "staff" | "student") => {
    const emails = {
      admin: "admin@college.edu",
      staff: "staff@college.edu",
      student: "student@college.edu",
    };
    setEmail(emails[role]);
    setPassword("demo123");
    setIsLoading(true);
    try {
      await login(emails[role], "demo123");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold" data-testid="text-login-title">MetaHorizon</h1>
            <CardDescription>Sign in to access the management system</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* todo: remove mock functionality */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground text-center mb-3">
              Quick demo access:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin("admin")}
                disabled={isLoading}
                data-testid="button-demo-admin"
              >
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin("staff")}
                disabled={isLoading}
                data-testid="button-demo-staff"
              >
                Staff
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => quickLogin("student")}
                disabled={isLoading}
                data-testid="button-demo-student"
              >
                Student
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
