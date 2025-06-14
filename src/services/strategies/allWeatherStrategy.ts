
export interface AllWeatherAsset {
  symbol: string;
  name: string;
  category: 'stocks' | 'long_bonds' | 'intermediate_bonds' | 'commodities' | 'tips';
  baseAllocation: number;
  currentAllocation?: number;
  volatility?: number;
  correlation?: number;
}

export interface EconomicEnvironment {
  growth: 'high' | 'low';
  inflation: 'high' | 'low';
  environment: string;
  assetPreferences: string[];
}

class AllWeatherStrategy {
  private baseAssets: AllWeatherAsset[] = [
    { symbol: 'VTI', name: 'Total Stock Market', category: 'stocks', baseAllocation: 30 },
    { symbol: 'TLT', name: 'Long-Term Treasury', category: 'long_bonds', baseAllocation: 40 },
    { symbol: 'IEF', name: 'Intermediate Treasury', category: 'intermediate_bonds', baseAllocation: 15 },
    { symbol: 'DJP', name: 'Commodities', category: 'commodities', baseAllocation: 7.5 },
    { symbol: 'TIPS', name: 'Inflation Protected Securities', category: 'tips', baseAllocation: 7.5 }
  ];

  private economicEnvironments: EconomicEnvironment[] = [
    {
      growth: 'high',
      inflation: 'low',
      environment: 'Growth + Low Inflation',
      assetPreferences: ['stocks', 'intermediate_bonds']
    },
    {
      growth: 'high',
      inflation: 'high',
      environment: 'Growth + High Inflation',
      assetPreferences: ['commodities', 'tips', 'stocks']
    },
    {
      growth: 'low',
      inflation: 'low',
      environment: 'Recession + Low Inflation',
      assetPreferences: ['long_bonds', 'intermediate_bonds']
    },
    {
      growth: 'low',
      inflation: 'high',
      environment: 'Recession + High Inflation',
      assetPreferences: ['tips', 'commodities']
    }
  ];

  generateAllocation(portfolioValue: number, environmentOverride?: EconomicEnvironment): any[] {
    console.log('All Weather Strategy: Generating allocation for portfolio value:', portfolioValue);
    
    let adjustedAssets = [...this.baseAssets];

    // Apply environment-based adjustments if specified
    if (environmentOverride) {
      adjustedAssets = this.adjustForEnvironment(adjustedAssets, environmentOverride);
    }

    // Apply volatility targeting (target ~12% portfolio volatility)
    adjustedAssets = this.applyVolatilityTargeting(adjustedAssets);

    // Normalize allocations to 100%
    const totalAllocation = adjustedAssets.reduce((sum, asset) => sum + asset.currentAllocation!, 0);
    
    return adjustedAssets.map(asset => ({
      symbol: asset.symbol,
      name: asset.name,
      allocation: (asset.currentAllocation! / totalAllocation) * 100,
      amount: (portfolioValue * asset.currentAllocation!) / totalAllocation,
      category: asset.category,
      strategy: 'All Weather'
    }));
  }

  private adjustForEnvironment(assets: AllWeatherAsset[], environment: EconomicEnvironment): AllWeatherAsset[] {
    return assets.map(asset => {
      let adjustment = 1.0;
      
      if (environment.assetPreferences.includes(asset.category)) {
        adjustment = 1.2; // 20% increase for preferred assets
      } else if (!environment.assetPreferences.includes(asset.category)) {
        adjustment = 0.9; // 10% decrease for non-preferred assets
      }

      return {
        ...asset,
        currentAllocation: asset.baseAllocation * adjustment
      };
    });
  }

  private applyVolatilityTargeting(assets: AllWeatherAsset[]): AllWeatherAsset[] {
    // Simplified volatility targeting - in practice, this would use historical volatility data
    const volatilityAdjustments = {
      stocks: 0.18,        // Higher volatility, lower weight
      long_bonds: 0.08,    // Lower volatility, higher weight
      intermediate_bonds: 0.05,
      commodities: 0.25,   // Highest volatility, lowest weight
      tips: 0.06
    };

    const targetVolatility = 0.12; // 12% target portfolio volatility

    return assets.map(asset => {
      const assetVol = volatilityAdjustments[asset.category];
      const volAdjustment = targetVolatility / assetVol;
      
      return {
        ...asset,
        volatility: assetVol,
        currentAllocation: (asset.currentAllocation || asset.baseAllocation) * Math.sqrt(volAdjustment)
      };
    });
  }

  getRebalancingSignals(currentAllocations: any[], targetAllocations: any[]): any[] {
    const signals: any[] = [];
    const threshold = 5; // 5% drift threshold

    currentAllocations.forEach(current => {
      const target = targetAllocations.find(t => t.symbol === current.symbol);
      if (target) {
        const drift = Math.abs(current.allocation - target.allocation);
        if (drift > threshold) {
          signals.push({
            symbol: current.symbol,
            action: current.allocation > target.allocation ? 'REDUCE' : 'INCREASE',
            currentAllocation: current.allocation,
            targetAllocation: target.allocation,
            drift: drift
          });
        }
      }
    });

    return signals;
  }

  analyzeEconomicEnvironment(): EconomicEnvironment {
    // In a real implementation, this would analyze current economic indicators
    // For now, return a default environment
    return this.economicEnvironments[0]; // Growth + Low Inflation
  }
}

export const allWeatherStrategy = new AllWeatherStrategy();
