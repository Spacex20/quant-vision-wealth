import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@radix-ui/react-avatar";
import { LogIn, LogOut } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function DashboardHeader() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center py-4 mb-2 w-full">
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Quantitative Investment Platform
      </div>
      <nav className="flex gap-2 items-center">
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
      </nav>
    </header>
  );
}
