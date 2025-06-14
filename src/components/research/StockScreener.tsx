import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, TrendingUp, TrendingDown } from "lucide-react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { marketDataService, CompanyFundamentals } from "@/services/marketDataService";

import { StockScreenerFilters, sectors } from "./StockScreenerFilters";
import { StockScreenerResultsTable } from "./StockScreenerResultsTable";
import { SavedScreeners } from "./SavedScreeners";
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Stock Screener</h2>
        <p className="text-muted-foreground">
          Find stocks that match your investment criteria.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-between items-end">
        <SavedScreeners onLoad={(c) => { setCriteria(() => c); return c; }} />
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
      
      <StockScreenerResultsTable data={results} />
    </div>
  );
};
