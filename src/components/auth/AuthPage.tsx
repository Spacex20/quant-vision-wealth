
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SocialLoginButton } from "./SocialLoginButton";
import { useNavigate } from "react-router-dom";

export function AuthPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  // Remove phone-related state
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // Password complexity checker
  const isPasswordStrong = (password: string) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  // Signup Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (!isPasswordStrong(password)) {
      toast({
        title: "Error",
        description:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    // Remove phone from signUp call
    const { error } = await signUp(email, password, fullName, username);
    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description:
          "Registration successful! Loading your account...",
      });
      setTab("signin");
    }
  };

  // Signin Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password, rememberMe);
    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome!",
        description: "Logged in successfully. Redirecting...",
      });
      navigate("/", { replace: true });
    }
  };

  // Social login handlers - must return a Promise<any>
  const handleGoogleLogin = async () => {
    // TODO: Implement actual Google login via Supabase if needed
    return Promise.resolve();
  };
  const handleAppleLogin = async () => {
    // TODO: Implement actual Apple login via Supabase if needed
    return Promise.resolve();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 space-y-6">
        <div className="flex justify-center space-x-4">
          <button
            className={`px-4 py-2 rounded font-semibold ${
              tab === "signin"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("signin")}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold ${
              tab === "signup"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTab("signup")}
            type="button"
          >
            Sign Up
          </button>
        </div>
        {tab === "signin" ? (
          <form className="space-y-4" onSubmit={handleSignIn}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                autoComplete="username"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Label htmlFor="rememberMe">Remember me</Label>
              <span className="ml-auto text-right text-sm text-blue-600 cursor-pointer">
                Forgot password?
              </span>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <Separator />
            <div className="space-y-2">
              <SocialLoginButton provider="google" onLogin={handleGoogleLogin} icon={null} label="Continue with Google" />
              <SocialLoginButton provider="apple" onLogin={handleAppleLogin} icon={null} label="Continue with Apple" />
            </div>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="signup-username">Username</Label>
              <Input
                id="signup-username"
                type="text"
                value={username}
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value.replace(/\s+/g, '').toLowerCase())}
                required
              />
            </div>
            <div>
              <Label htmlFor="signup-fullname">Full Name</Label>
              <Input
                id="signup-fullname"
                type="text"
                value={fullName}
                autoComplete="name"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            {/* Phone input removed */}
            <div>
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className={`mt-1 text-xs font-medium ${isPasswordStrong(password) ? "text-green-600" : "text-red-600"}`}>
                Password must be 8+ chars and include upper/lowercase, number, special char
              </p>
            </div>
            <div>
              <Label htmlFor="signup-confirm-password">Confirm Password</Label>
              <Input
                id="signup-confirm-password"
                type="password"
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input id="tos" type="checkbox" required />
              <Label htmlFor="tos">I agree to the Terms of Service</Label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
