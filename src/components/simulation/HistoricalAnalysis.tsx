
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserPortfolios, Portfolio } from "@/hooks/useUserPortfolios";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ScenarioResults } from './ScenarioResults';
import { runScenario, ScenarioType, ScenarioResult } from '@/services/scenarioAnalysisService';
import { Cpu, Landmark, Virus } from 'lucide-react';

const historicalScenarios: { id: ScenarioType; name: string; icon: React.ElementType }[] = [
  { id: 'DOTCOM_BUBBLE_2000', name: '2000 Dot-com Bubble', icon: Cpu },
  { id: 'FINANCIAL_CRISIS_2008', name: '2008 Financial Crisis', icon: Landmark },
  { id: 'COVID_CRASH_2020', name: '2020 COVID-19 Crash', icon: Virus },
];

export const HistoricalAnalysis = () => {
    const { user } = useAuth();
    const isLoggedIn = !!user;
    const { portfolios, isLoading: isPortfoliosLoading } = useUserPortfolios();
    
    const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(null);
    const [simulationResult, setSimulationResult] = useState<ScenarioResult | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const allWeatherDemoPortfolio: Portfolio = {
        id: 'demo-portfolio',
        user_id: 'demo-user',
        name: "All Weather Strategy",
        description: "Ray Dalio's risk-balanced portfolio",
        total_value: 50000,
        assets: [
            { symbol: "TLT", name: "Long-Term Treasury Bonds", allocation: 40 },
            { symbol: "VTI", name: "Total Stock Market", allocation: 30 },
            { symbol: "IEF", name: "Intermediate Treasury Bonds", allocation: 15 },
            { symbol: "GLD", name: "Gold ETF", allocation: 7.5 },
            { symbol: "DJP", name: "Commodities ETF", allocation: 7.5 },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // @ts-ignore
        isDemo: true
    };

    const activePortfolio =
        isLoggedIn && !isPortfoliosLoading && portfolios.length > 0
        ? portfolios[0]
        : allWeatherDemoPortfolio;

    const handleRunScenario = async () => {
        if (!selectedScenario || !activePortfolio) return;
        setIsRunning(true);
        setSimulationResult(null);
        const result = await runScenario(activePortfolio, selectedScenario);
        setSimulationResult(result);
        setIsRunning(false);
    };

    if (isLoggedIn && isPortfoliosLoading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <p className="font-medium">1. Select a Historical Crisis</p>
                <div className="flex flex-wrap gap-2">
                    {historicalScenarios.map(s => (
                        <Button 
                            key={s.id}
                            variant={selectedScenario === s.id ? "default" : "outline"}
                            onClick={() => setSelectedScenario(s.id)}
                            className="flex-grow md:flex-grow-0"
                        >
                            <s.icon className="h-4 w-4 mr-2" />
                            {s.name}
                        </Button>
                    ))}
                </div>
            </div>
            
            <div className="space-y-2">
                <p className="font-medium">2. Run Simulation</p>
                <Button 
                    onClick={handleRunScenario}
                    disabled={!selectedScenario || isRunning}
                    className="w-full md:w-auto"
                >
                    {isRunning ? (
                        <><LoadingSpinner className="mr-2 h-4 w-4" /> Running Simulation...</>
                    ) : 'Run Historical Analysis'}
                </Button>
            </div>

            <div className="mt-6">
                {isRunning && (
                    <div className="flex flex-col items-center justify-center h-96 space-y-4 text-muted-foreground">
                        <LoadingSpinner size="lg" />
                        <p>Analyzing historical data and simulating outcomes...</p>
                        <p className="text-sm">This may take a moment.</p>
                    </div>
                )}
                {simulationResult && <ScenarioResults result={simulationResult} />}
            </div>
        </div>
    );
};
