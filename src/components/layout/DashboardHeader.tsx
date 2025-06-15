
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@radix-ui/react-avatar";
import { LogIn, LogOut, Moon, Sun } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function DashboardHeader() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex flex-col-reverse sm:flex-row sm:justify-between items-center py-4 mb-2 w-full gap-2">
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Quantitative Investment Platform
      </div>
      <div className="flex gap-3 items-center">
        {/* Theme Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <Switch
                  checked={mounted ? theme === "dark" : false}
                  onCheckedChange={(checked: boolean) => setTheme(checked ? "dark" : "light")}
                  id="theme-toggle"
                  aria-label="Toggle dark mode"
                  className="mr-1"
                />
                {mounted && (
                  theme === "dark"
                    ? <Moon className="w-5 h-5 text-yellow-400" />
                    : <Sun className="w-5 h-5 text-blue-500" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {theme === "dark" ? "Dark mode" : "Light mode"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {user ? (
          <>
            {profile?.full_name && (
              <span className="text-sm font-medium mr-2">{profile.full_name}</span>
            )}
            {profile?.avatar_url && (
              <Avatar>
                <img
                  src={profile.avatar_url}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
              </Avatar>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={signOut}
                    className="mr-1"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Logout
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/login")}
                    aria-label="Login"
                  >
                    <LogIn className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Login
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/signup")}
                    aria-label="Sign Up"
                  >
                    <LogIn className="w-5 h-5 rotate-180" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Sign Up
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
    </header>
  );
}
