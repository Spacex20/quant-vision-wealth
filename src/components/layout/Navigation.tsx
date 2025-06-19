
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { 
  Brain, 
  Terminal, 
  TrendingUp, 
  Users, 
  Settings, 
  LogOut, 
  User, 
  BarChart3,
  Zap
} from "lucide-react";

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">FinanceAI</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {/* Highlight the AI Research Copilot */}
                <Link to="/research">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200">
                    <Brain className="w-4 h-4 mr-2" />
                    AI Research Copilot
                    <Zap className="w-3 h-3 ml-1 animate-pulse" />
                  </Button>
                </Link>

                <Link to="/terminal">
                  <Button variant="ghost" className="flex items-center space-x-1">
                    <Terminal className="w-4 h-4" />
                    <span>Terminal</span>
                  </Button>
                </Link>

                <Link to="/strategies">
                  <Button variant="ghost" className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Strategies</span>
                  </Button>
                </Link>

                <Link to="/community">
                  <Button variant="ghost" className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>Community</span>
                  </Button>
                </Link>

                <Link to="/profile">
                  <Button variant="ghost" className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
