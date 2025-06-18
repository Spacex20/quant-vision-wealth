
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StrategyCard } from './StrategyCard';
import { Search, Filter, TrendingUp, Shield, Target, Zap, Globe, BookOpen } from 'lucide-react';
import { libraryStrategies, Strategy } from '@/data/strategies';

const STRATEGY_CATEGORIES = [
  { id: 'all', label: 'All Strategies', icon: Globe },
  { id: 'conservative', label: 'Conservative', icon: Shield },
  { id: 'growth', label: 'Growth', icon: TrendingUp },
  { id: 'balanced', label: 'Balanced', icon: Target },
  { id: 'aggressive', label: 'Aggressive', icon: Zap },
];

const RISK_LEVELS = ['All', 'Low', 'Medium', 'High'];
const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'return', label: 'Expected Return' },
  { value: 'risk', label: 'Risk Level' },
  { value: 'sharpe', label: 'Sharpe Ratio' },
];

interface StrategyFilters {
  category: string;
  riskLevel: string;
  search: string;
  sortBy: string;
}

export const ComprehensiveStrategyLibrary = () => {
  const [filters, setFilters] = useState<StrategyFilters>({
    category: 'all',
    riskLevel: 'All',
    search: '',
    sortBy: 'return'
  });

  const [activeView, setActiveView] = useState<'grid' | 'detailed'>('detailed');

  // Enhanced filtering and sorting logic
  const filteredAndSortedStrategies = useMemo(() => {
    let filtered = libraryStrategies.filter(strategy => {
      // Category filter
      if (filters.category !== 'all') {
        const categoryMatch = 
          (filters.category === 'conservative' && strategy.riskProfile === 'Low') ||
          (filters.category === 'balanced' && strategy.riskProfile === 'Medium') ||
          (filters.category === 'growth' && (strategy.expectedReturn >= 10 && strategy.riskProfile !== 'High')) ||
          (filters.category === 'aggressive' && strategy.riskProfile === 'High');
        
        if (!categoryMatch) return false;
      }

      // Risk level filter
      if (filters.riskLevel !== 'All' && strategy.riskProfile !== filters.riskLevel) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          strategy.name.toLowerCase().includes(searchLower) ||
          strategy.description.toLowerCase().includes(searchLower) ||
          strategy.allocation.some(asset => 
            asset.asset.toLowerCase().includes(searchLower)
          )
        );
      }

      return true;
    });

    // Sort strategies
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'return':
          return b.expectedReturn - a.expectedReturn;
        case 'risk':
          const riskOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
          return riskOrder[a.riskProfile] - riskOrder[b.riskProfile];
        case 'sharpe':
          return b.sharpeRatio - a.sharpeRatio;
        default:
          return 0;
      }
    });

    return filtered;
  }, [filters]);

  const updateFilter = (key: keyof StrategyFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStrategyStats = () => {
    const totalStrategies = libraryStrategies.length;
    const avgReturn = libraryStrategies.reduce((sum, s) => sum + s.expectedReturn, 0) / totalStrategies;
    const avgSharpe = libraryStrategies.reduce((sum, s) => sum + s.sharpeRatio, 0) / totalStrategies;
    
    return { totalStrategies, avgReturn, avgSharpe };
  };

  const stats = getStrategyStats();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Comprehensive Strategy Library</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore, analyze, and implement institutional-grade quantitative investment strategies.
          Each strategy includes detailed backtesting, risk metrics, and implementation guides.
        </p>
        
        {/* Stats Overview */}
        <div className="flex justify-center gap-8 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalStrategies}</div>
            <div className="text-sm text-muted-foreground">Total Strategies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.avgReturn.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Avg. Expected Return</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.avgSharpe.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Avg. Sharpe Ratio</div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Strategies</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, description..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STRATEGY_CATEGORIES.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <category.icon className="h-4 w-4" />
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Risk Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Risk Level</label>
              <Select value={filters.riskLevel} onValueChange={(value) => updateFilter('riskLevel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RISK_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.category !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('category', 'all')}>
                Category: {STRATEGY_CATEGORIES.find(c => c.id === filters.category)?.label} ×
              </Badge>
            )}
            {filters.riskLevel !== 'All' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('riskLevel', 'All')}>
                Risk: {filters.riskLevel} ×
              </Badge>
            )}
            {filters.search && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('search', '')}>
                Search: "{filters.search}" ×
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">
          {filteredAndSortedStrategies.length} of {libraryStrategies.length} strategies
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeView === 'detailed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('detailed')}
          >
            Detailed View
          </Button>
          <Button
            variant={activeView === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveView('grid')}
          >
            Grid View
          </Button>
        </div>
      </div>

      {/* Strategy Display */}
      {filteredAndSortedStrategies.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <Search className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-medium">No strategies found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms to find relevant strategies.
            </p>
            <Button onClick={() => setFilters({ category: 'all', riskLevel: 'All', search: '', sortBy: 'return' })}>
              Clear All Filters
            </Button>
          </div>
        </Card>
      ) : (
        <div className={activeView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-8'}>
          {filteredAndSortedStrategies.map(strategy => (
            <div key={strategy.id} className={activeView === 'grid' ? '' : 'w-full'}>
              <StrategyCard strategy={strategy} />
            </div>
          ))}
        </div>
      )}

      {/* Educational Footer */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Build Your Investment Knowledge</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Each strategy in our library comes with educational content, risk analysis, and implementation guides
            to help you understand the underlying principles and make informed investment decisions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-sm px-4 py-2">Historical Backtesting</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">Risk Analysis</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">Implementation Guides</Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">Performance Metrics</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
