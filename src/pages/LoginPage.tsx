import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";

export function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(userId, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch {
      toast({
        title: "Sign in failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (role: "admin" | "staff" | "student") => {
    const emails = {
      admin: "admin@college.edu",
      staff: "staff@college.edu",
      student: "student@college.edu",
    };
    setUserId(emails[role]);
    setPassword("demo123");
    setIsLoading(true);
    try {
      await login(emails[role], "demo123");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E3F2FD] p-4 dark:bg-zinc-950">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* The "Big Box" Container */}
      <Card className="overflow-hidden shadow-2xl w-full max-w-5xl grid md:grid-cols-2 border-none ring-1 ring-gray-200 dark:ring-border">

        {/* Left Side - Image Box */}
        <div className="relative hidden md:flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-muted/20 border-r border-gray-100 dark:border-border">
          <div className="w-full max-w-sm dark:bg-card dark:p-6 dark:rounded-2xl dark:shadow-lg dark:ring-1 dark:ring-border">
            <img
              src="/login-illustration.png"
              alt="Campus Life"
              className="w-full h-auto object-contain dark:rounded-lg"
            />
          </div>
        </div>

        {/* Right Side - Login Form Box */}
        <div className="flex flex-col justify-center p-8 md:p-12 bg-white dark:bg-card">
          <div className="w-full max-w-sm mx-auto space-y-8">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="mb-2">
                <img
                  src="/logo.png"
                  alt="MetaHorizon College"
                  className="h-12 w-auto object-contain dark:brightness-0 dark:invert"
                />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId" className="sr-only">User ID</Label>
                <Input
                  id="userId"
                  className="h-11 bg-muted/50 border-input focus:bg-background focus:ring-ring focus:border-ring transition-all"
                  placeholder="User ID or Email"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="sr-only">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="h-11 bg-muted/50 border-input pr-10 focus:bg-background focus:ring-ring focus:border-ring transition-all"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end">
                  <a href="#" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                    Forgot Password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 transition-all shadow-lg shadow-black/5 dark:shadow-none"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="pt-6 border-t border-border">
              <p className="text-xs text-center text-muted-foreground font-medium uppercase tracking-wider mb-4">
                Quick Access
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => quickLogin("admin")}
                  className="w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all text-xs font-bold flex items-center justify-center"
                  title="Admin"
                >A</button>
                <button
                  onClick={() => quickLogin("staff")}
                  className="w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all text-xs font-bold flex items-center justify-center"
                  title="Staff"
                >S</button>
                <button
                  onClick={() => quickLogin("student")}
                  className="w-10 h-10 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all text-xs font-bold flex items-center justify-center"
                  title="Student"
                >St</button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
