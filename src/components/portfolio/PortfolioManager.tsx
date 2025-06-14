
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioList } from "./PortfolioList";
import { PortfolioComparison } from "./PortfolioComparison";
import { WatchlistManager } from "./WatchlistManager";
import { FolderOpen, BarChart3, Eye } from "lucide-react";

export const PortfolioManager = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Portfolio Management</h2>
        <p className="text-muted-foreground">
          Save, load, and compare multiple portfolios with custom watchlists
        </p>
      </div>

      <Tabs defaultValue="portfolios" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
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
        </TabsList>

        <TabsContent value="portfolios" className="space-y-6">
          <PortfolioList />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <PortfolioComparison />
        </TabsContent>

        <TabsContent value="watchlists" className="space-y-6">
          <WatchlistManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
