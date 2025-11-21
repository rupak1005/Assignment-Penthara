import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { login, register } from "@/services/authService";
import type { AuthResponse } from "@/services/authService";
import { Sun, Moon } from "lucide-react";

interface LoginPageProps {
  onAuthSuccess: (data: AuthResponse) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess, theme, onToggleTheme }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const authData =
        mode === "login"
          ? await login(email, password)
          : await register(name, email, password);

      onAuthSuccess(authData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4"
        onClick={onToggleTheme}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </Button>
      <Card className="max-w-md w-full shadow-lg border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 p-2 rounded">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Log in"
                  : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-sm text-center">
            {mode === "login" ? (
              <p>
                Need an account?{" "}
                <button
                  className="text-primary underline"
                  onClick={() => setMode("register")}
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  className="text-primary underline"
                  onClick={() => setMode("login")}
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

