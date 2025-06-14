
import { Portfolio } from "@/hooks/useUserPortfolios";
import { toast } from "sonner";

// Define the types of scenarios available
export type ScenarioType = 
  | 'INFLATION_SPIKE'
  | 'INTEREST_RATE_HIKE'
  | 'RECESSION'
  | 'BULL_MARKET'
  | 'WAR_ENERGY_CRISIS';

// Define the asset categories for simulation
export type AssetCategory = 'stocks' | 'long_bonds' | 'intermediate_bonds' | 'gold' | 'commodities' | 'other';

// Define the impact of each scenario on asset categories (6-month estimated performance)
const scenarioImpacts: Record<ScenarioType, Record<AssetCategory, number>> = {
  RECESSION: { // e.g., 2008 Financial Crisis
    stocks: -0.22,
    long_bonds: 0.08,
    intermediate_bonds: 0.05,
    gold: 0.12,
    commodities: -0.15,
    other: -0.10,
  },
  INFLATION_SPIKE: { // e.g., 1970s
    stocks: -0.10,
    long_bonds: -0.15,
    intermediate_bonds: -0.08,
    gold: 0.18,
    commodities: 0.25,
    other: -0.05,
  },
  INTEREST_RATE_HIKE: { // e.g., 2022 Fed Hikes
    stocks: -0.12,
    long_bonds: -0.18,
    intermediate_bonds: -0.10,
    gold: 0.05,
    commodities: -0.05,
    other: -0.08,
  },
  BULL_MARKET: { // e.g., Late 2010s
    stocks: 0.25,
    long_bonds: -0.05,
    intermediate_bonds: -0.02,
    gold: -0.03,
    commodities: 0.10,
    other: 0.15,
  },
  WAR_ENERGY_CRISIS: { // e.g., 1973 Oil Crisis
    stocks: -0.18,
    long_bonds: 0.05,
    intermediate_bonds: 0.02,
    gold: 0.20,
    commodities: 0.45,
    other: -0.12,
  },
};

const recommendations: Record<ScenarioType, string> = {
    RECESSION: "Portfolio shows resilience, but consider increasing defensive assets like gold and long-term bonds to further hedge against a prolonged downturn. Reduce exposure to cyclical stocks.",
    INFLATION_SPIKE: "Commodities and gold are performing well as expected. Consider trimming some profits and reallocating to inflation-protected securities (TIPS) if not already held. Be cautious with bonds.",
    INTEREST_RATE_HIKE: "Bonds and growth-oriented stocks are under pressure. This is a good time to review for quality companies with strong balance sheets. Value stocks may outperform.",
    BULL_MARKET: "The portfolio is capturing market growth well. Ensure you're not overly concentrated in a few high-flying stocks. Stick to your target allocation and rebalance if necessary.",
    WAR_ENERGY_CRISIS: "Energy and commodities are driving performance. This highlights the importance of diversification. Monitor geopolitical risks closely and consider hedges like gold.",
};

// Helper to map asset symbols to categories
const getAssetCategory = (symbol: string): AssetCategory => {
  const upperSymbol = symbol.toUpperCase();
  if (['VTI', 'VOO', 'SPY', 'QQQ'].includes(upperSymbol)) return 'stocks';
  if (['TLT', 'VGLT'].includes(upperSymbol)) return 'long_bonds';
  if (['IEF', 'VGIT'].includes(upperSymbol)) return 'intermediate_bonds';
  if (['GLD', 'IAU'].includes(upperSymbol)) return 'gold';
  if (['DJP', 'DBC', 'GSG'].includes(upperSymbol)) return 'commodities';
  return 'other';
};

// Generates a 6-month performance trajectory for an asset
const generateTrajectory = (startValue: number, monthlyChange: number) => {
    const trajectory = [{ month: 'Start', value: startValue }];
    let currentValue = startValue;
    for (let i = 1; i <= 6; i++) {
        currentValue *= (1 + monthlyChange);
        trajectory.push({ month: `Month ${i}`, value: currentValue });
    }
    return trajectory;
};

export interface ScenarioResult {
    initialValue: number;
    finalValue: number;
    valueChange: number;
    percentChange: number;
    beforeAllocation: any[];
    afterAllocation: any[];
    portfolioTrajectory: { month: string, value: number }[];
    assetPerformance: { symbol: string, name: string, change: number }[];
    recommendation: string;
}

export const runScenario = (
    portfolio: Portfolio,
    scenario: ScenarioType
): Promise<ScenarioResult> => {
    return new Promise((resolve) => {
        setTimeout(() => { // Simulate API call latency
            const impacts = scenarioImpacts[scenario];
            const initialValue = portfolio.total_value;
            let finalValue = 0;

            const beforeAllocation = portfolio.assets.map(asset => ({
                name: asset.symbol,
                value: (asset.allocation / 100) * initialValue,
            }));

            const assetPerformance = portfolio.assets.map(asset => {
                const category = getAssetCategory(asset.symbol);
                const impact = impacts[category];
                const initialAssetValue = (asset.allocation / 100) * initialValue;
                const finalAssetValue = initialAssetValue * (1 + impact);
                finalValue += finalAssetValue;
                return {
                    symbol: asset.symbol,
                    name: asset.name,
                    change: impact * 100,
                    finalValue: finalAssetValue,
                };
            });
            
            const afterAllocation = assetPerformance.map(asset => ({
                name: asset.symbol,
                value: asset.finalValue,
            }));

            const valueChange = finalValue - initialValue;
            const percentChange = (valueChange / initialValue);

            // Generate portfolio trajectory
            const monthlyPercentChange = Math.pow(1 + percentChange, 1/6) - 1;
            const portfolioTrajectory = generateTrajectory(initialValue, monthlyPercentChange);

            assetPerformance.sort((a, b) => b.change - a.change);

            resolve({
                initialValue,
                finalValue,
                valueChange,
                percentChange,
                beforeAllocation,
                afterAllocation,
                portfolioTrajectory,
                assetPerformance,
                recommendation: recommendations[scenario],
            });
        }, 1500); // 1.5 second delay
    });
};

export const saveToLibrary = () => {
    toast.success("Scenario Insight Saved!", {
        description: "You can find your saved insights in your personal library.",
    });
};
