
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioComparison } from "./PortfolioComparison";
import { WatchlistManager } from "./WatchlistManager";
import { FolderOpen, BarChart3, Eye, Trash2, Edit } from "lucide-react";
import { PortfolioAdvisorChat } from "./PortfolioAdvisorChat";
import { useUserPortfolios } from "@/hooks/useUserPortfolios";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { portfolioManager } from "@/services/portfolioManager";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "../common/LoadingSpinner";

export const PortfolioManager = () => {
  const { user } = useAuth();
  const { portfolios, isLoading, error } = useUserPortfolios();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the portfolio "${name}"?`)) {
      const success = await portfolioManager.deletePortfolio(id);
      if (success) {
        toast.success(`Portfolio "${name}" deleted.`);
        queryClient.invalidateQueries({ queryKey: ['user_portfolios', user?.id] });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Portfolio Management</h2>
        <p className="text-muted-foreground">
          Save, load, and compare multiple portfolios with custom watchlists
        </p>
      </div>

      <Tabs defaultValue="portfolios" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolios" className="flex items-center space-x-2">
            <FolderOpen className="h-4 w-4" />
            <span>My Portfolios</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Portfolio Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="watchlists" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Watchlists</span>
          </TabsTrigger>
          <TabsTrigger value="advisor" className="flex items-center space-x-2">
            <span role="img" aria-label="AI">🤖</span>
            <span>Advisor Chat</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolios" className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>My Saved Portfolios</CardTitle>
              <CardDescription>View and manage your saved investment portfolios.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && <LoadingSpinner />}
              {error && <Alert variant="destructive"><AlertDescription>Error loading portfolios: {error.message}</AlertDescription></Alert>}
              {!isLoading && !error && !user && <Alert><AlertDescription>Please log in to manage your portfolios.</AlertDescription></Alert>}
              {!isLoading && !error && user && portfolios.length === 0 && (
                <Alert><AlertDescription>You haven't saved any portfolios yet. Go to the Builder tab to create one!</AlertDescription></Alert>
              )}
              <div className="space-y-4">
                {user && portfolios.map(p => (
                  <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{p.name}</h3>
                      <p className="text-sm text-muted-foreground">{p.description || 'No description'}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        <span>Assets: {p.assets.length}</span> | <span>Value: ${p.total_value.toLocaleString()}</span> | <span>Last updated: {new Date(p.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button variant="outline" size="sm" onClick={() => toast.info("Editing portfolios is coming soon!")}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id, p.name)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <PortfolioComparison />
        </TabsContent>

        <TabsContent value="watchlists" className="space-y-6">
          <WatchlistManager />
        </TabsContent>

        <TabsContent value="advisor" className="space-y-6">
          <PortfolioAdvisorChat />
        </TabsContent>
      </Tabs>
    </div>
  );
};
