
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@radix-ui/react-avatar";

export function DashboardHeader() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center py-4 mb-2">
      <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
        Quantitative Investment Platform
      </div>
      <nav className="flex gap-2 items-center">
        {user ? (
          <>
            {/* Show profile name or avatar if available */}
            {profile?.full_name && (
              <span className="text-sm font-medium mr-2">{profile.full_name}</span>
            )}
            {profile?.avatar_url && (
              <Avatar>
                <img src={profile.avatar_url} alt="avatar" className="w-8 h-8 rounded-full" />
              </Avatar>
            )}
            <Button
              variant="outline"
              onClick={() => navigate("/profile")}
              className="mr-2"
            >
              My Investor Profile
            </Button>
            <Button onClick={signOut} variant="destructive">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/signup")}>Sign Up</Button>
          </>
        )}
      </nav>
    </header>
  );
}

