
import { libraryStrategies } from '@/data/strategies';
import { StrategyCard } from './StrategyCard';

export const StrategyLibrary = () => {
  return (
    <div className="space-y-8">
       <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Strategy Library</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Explore, simulate, and customize institutional-grade investment strategies.
            </p>
        </div>
      <div className="space-y-6">
        {libraryStrategies.map(strategy => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>
    </div>
  );
};
