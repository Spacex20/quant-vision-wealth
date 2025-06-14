
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, TrendingUp, TrendingDown, Calculator } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { marketDataService, CompanyFundamentals } from "@/services/marketDataService";

import { StockScreenerFilters, sectors } from "./StockScreenerFilters";
import { StockScreenerResultsTable } from "./StockScreenerResultsTable";
import { SavedScreeners } from "./SavedScreeners";
import { ValueInvestingAnalysis } from "./ValueInvestingAnalysis";
import { useStockScreener } from "./useStockScreener";

interface ScreenerCriteria {
  sector?: string;
  minMarketCap: number;
  maxMarketCap: number;
  minPE: number;
  maxPE: number;
  minROE: number;
  maxROE: number;
  minDividendYield: number;
  maxDividendYield: number;
  minProfitMargin: number;
  maxProfitMargin: number;
}

export const StockScreener = () => {
  const {
    criteria, setCriteria, results, loading, runScreener, clearFilters, setResults,
  } = useStockScreener();

  // Ensure results have the fields expected by StockResult
  const stockResults = results.map((r: any) => ({
    symbol: r.symbol,
    name: r.name,
    sector: r.sector,
    price: r.price ?? 0,
    marketCap: r.marketCap ?? 0,
    peRatio: r.peRatio ?? 0,
    dividendYield: r.dividendYield ?? 0,
    volume: r.volume,
  }));

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Advanced Stock Research</h2>
        <p className="text-muted-foreground">
          Comprehensive screening and value investing analysis tools
        </p>
      </div>

      <Tabs defaultValue="screener" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="screener">Stock Screener</TabsTrigger>
          <TabsTrigger value="value-analysis">Value Investing Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="screener" className="space-y-6">
          <div className="flex flex-wrap gap-4 justify-between items-end">
            <SavedScreeners
              onLoad={(c) => { setCriteria(() => c); return c; }}
              getCurrentCriteria={() => criteria}
            />
            <Button onClick={clearFilters} variant="outline">Clear All</Button>
          </div>

          <form
            className="space-y-5"
            onSubmit={e => {
              e.preventDefault();
              runScreener();
            }}
          >
            <StockScreenerFilters criteria={criteria} setCriteria={setCriteria} />
            <Button type="submit" className="mt-4" disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4 mr-2" />}
              Run Screen
            </Button>
          </form>

          <StockScreenerResultsTable data={stockResults} />
        </TabsContent>

        <TabsContent value="value-analysis" className="space-y-6">
          <ValueInvestingAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};
