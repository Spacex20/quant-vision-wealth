
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Clock } from 'lucide-react';
import { unifiedMarketData, Market } from '@/services/unifiedMarketData';

interface MarketSelectorProps {
  onMarketChange?: (market: Market) => void;
}

export const MarketSelector = ({ onMarketChange }: MarketSelectorProps) => {
  const [selectedMarket, setSelectedMarket] = useState<Market>(unifiedMarketData.getCurrentMarket());

  const handleMarketChange = (market: Market) => {
    setSelectedMarket(market);
    unifiedMarketData.setMarket(market);
    onMarketChange?.(market);
  };

  const marketInfo = {
    IN: {
      name: 'India',
      flag: '🇮🇳',
      currency: 'INR',
      exchanges: 'NSE, BSE',
      timezone: 'IST',
      hours: '9:15 AM - 3:30 PM'
    },
    US: {
      name: 'United States',
      flag: '🇺🇸',
      currency: 'USD',
      exchanges: 'NYSE, NASDAQ',
      timezone: 'EST',
      hours: '9:30 AM - 4:00 PM'
    }
  };

  const currentMarketInfo = marketInfo[selectedMarket];

  return (
    <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center space-x-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Market:</span>
      </div>
      
      <Select value={selectedMarket} onValueChange={handleMarketChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="IN">
            <div className="flex items-center space-x-2">
              <span>🇮🇳</span>
              <span>India (NSE/BSE)</span>
            </div>
          </SelectItem>
          <SelectItem value="US">
            <div className="flex items-center space-x-2">
              <span>🇺🇸</span>
              <span>USA (NYSE/NASDAQ)</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Badge variant="outline">{currentMarketInfo.currency}</Badge>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>{currentMarketInfo.hours} {currentMarketInfo.timezone}</span>
        </div>
      </div>
    </div>
  );
};
