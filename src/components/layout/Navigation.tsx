
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, User, LogOut, Settings, Database, Moon, Sun } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useNotificationBadge } from "@/hooks/useNotificationBadge";
import { useTheme } from "next-themes";

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { unreadCount } = useNotificationBadge();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigationItems = [
    { name: "Systems Check", href: "/systems-check" },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                QuantVerse
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? "border-indigo-500 text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* Theme Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={mounted ? theme === "dark" : false}
                      onCheckedChange={(checked: boolean) => setTheme(checked ? "dark" : "light")}
                      id="theme-toggle"
                      aria-label="Toggle dark mode"
                      className="data-[state=checked]:bg-indigo-600"
                    />
                    {mounted && (
                      theme === "dark"
                        ? <Moon className="w-4 h-4 text-indigo-400" />
                        : <Sun className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {user ? (
              <>
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt="@user" />
                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/systems-check" className="cursor-pointer text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Database className="mr-2 h-4 w-4" />
                          <span>Systems Check</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/auth">
                  <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                  location.pathname === item.href
                    ? "bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 text-indigo-700 dark:text-indigo-300"
                    : "border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Theme Toggle */}
            <div className="pl-3 pr-4 py-2 flex items-center justify-between">
              <span className="text-base font-medium text-gray-500 dark:text-gray-300">Dark Mode</span>
              <div className="flex items-center gap-2">
                <Switch
                  checked={mounted ? theme === "dark" : false}
                  onCheckedChange={(checked: boolean) => setTheme(checked ? "dark" : "light")}
                  className="data-[state=checked]:bg-indigo-600"
                />
                {mounted && (
                  theme === "dark"
                    ? <Moon className="w-4 h-4 text-indigo-400" />
                    : <Sun className="w-4 h-4 text-yellow-500" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
