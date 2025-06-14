
export interface Asset {
  symbol: string;
  name: string;
  allocation: number;
  expectedReturn: number;
  volatility: number;
  minAllocation?: number;
  maxAllocation?: number;
}

export interface OptimizationConstraints {
  minAllocation: number;
  maxAllocation: number;
  maxAssets: number;
  targetReturn?: number;
  maxRisk?: number;
}

export interface OptimizationResult {
  assets: Asset[];
  expectedReturn: number;
  expectedRisk: number;
  sharpeRatio: number;
  isOptimal: boolean;
  suggestions: string[];
}

export const portfolioOptimization = {
  optimizePortfolio(assets: Asset[], constraints: OptimizationConstraints): OptimizationResult {
    // Simplified mean-variance optimization
    let optimizedAssets = [...assets];
    const suggestions: string[] = [];
    
    // Apply constraints
    optimizedAssets = optimizedAssets.map(asset => ({
      ...asset,
      allocation: Math.max(
        constraints.minAllocation,
        Math.min(constraints.maxAllocation, asset.allocation)
      )
    }));

    // Normalize allocations to sum to 100%
    const totalAllocation = optimizedAssets.reduce((sum, asset) => sum + asset.allocation, 0);
    if (totalAllocation !== 100) {
      optimizedAssets = optimizedAssets.map(asset => ({
        ...asset,
        allocation: (asset.allocation / totalAllocation) * 100
      }));
    }

    // Calculate portfolio metrics
    const expectedReturn = optimizedAssets.reduce(
      (sum, asset) => sum + (asset.allocation / 100) * asset.expectedReturn,
      0
    );

    const expectedRisk = Math.sqrt(
      optimizedAssets.reduce(
        (sum, asset) => sum + Math.pow((asset.allocation / 100) * asset.volatility, 2),
        0
      )
    );

    const sharpeRatio = expectedReturn / expectedRisk;

    // Generate suggestions
    if (expectedRisk > 0.15) {
      suggestions.push("Consider reducing allocation to high-volatility assets");
    }
    if (sharpeRatio < 1.0) {
      suggestions.push("Portfolio could benefit from higher-return assets");
    }
    if (optimizedAssets.length > 8) {
      suggestions.push("Consider consolidating to fewer assets for better management");
    }

    return {
      assets: optimizedAssets,
      expectedReturn,
      expectedRisk,
      sharpeRatio,
      isOptimal: sharpeRatio > 1.2 && expectedRisk < 0.12,
      suggestions
    };
  },

  suggestRebalancing(currentAssets: Asset[], targetAssets: Asset[]): string[] {
    const suggestions: string[] = [];
    
    currentAssets.forEach(current => {
      const target = targetAssets.find(t => t.symbol === current.symbol);
      if (target) {
        const diff = Math.abs(current.allocation - target.allocation);
        if (diff > 5) {
          const action = current.allocation > target.allocation ? "reduce" : "increase";
          suggestions.push(`${action} ${current.symbol} by ${diff.toFixed(1)}%`);
        }
      }
    });

    return suggestions;
  }
};
