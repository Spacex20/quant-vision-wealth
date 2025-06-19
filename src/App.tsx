
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import { AuthPage } from "@/components/auth/AuthPage";
import Profile from "./pages/Profile";
import Strategies from "./pages/Strategies";
import InvestmentServers from "./pages/InvestmentServers";
import SystemsCheck from "./pages/SystemsCheck";
import Terminal from "./pages/Terminal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route path="/" element={<Index />} />
              <Route path="/terminal" element={
                <ProtectedRoute>
                  <Terminal />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/strategies" element={<Strategies />} />
              <Route path="/community" element={
                <ProtectedRoute>
                  <InvestmentServers />
                </ProtectedRoute>
              } />
              <Route path="/systems" element={<SystemsCheck />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
