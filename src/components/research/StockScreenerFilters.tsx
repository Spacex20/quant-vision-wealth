import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScreenerCriteria } from "./useStockScreener";

export const sectors = [
  'Technology', 'Healthcare', 'Financial Services', 'Consumer Cyclical',
  'Communication Services', 'Industrials', 'Consumer Defensive', 'Energy',
  'Utilities', 'Real Estate', 'Basic Materials'
];

type Props = {
  criteria: ScreenerCriteria;
  setCriteria: (fn: (prev: ScreenerCriteria) => ScreenerCriteria) => void;
};

export function StockScreenerFilters({ criteria, setCriteria }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label>Sector</Label>
        <Select
          value={criteria.sector ?? "all"}
          onValueChange={v =>
            setCriteria(prev => ({
              ...prev,
              sector: v === "all" ? undefined : v
            }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All sectors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sectors</SelectItem>
            {sectors.map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Market Cap Min (B)</Label>
          <Input
            type="number"
            min={0}
            value={criteria.minMarketCap ?? ""}
            onChange={e => setCriteria(p => ({ ...p, minMarketCap: +e.target.value }))}
          />
        </div>
        <div>
          <Label>Market Cap Max (B)</Label>
          <Input
            type="number"
            min={0}
            value={criteria.maxMarketCap ?? ""}
            onChange={e => setCriteria(p => ({ ...p, maxMarketCap: +e.target.value }))}
          />
        </div>
        <div>
          <Label>P/E Min</Label>
          <Input
            type="number"
            min={0}
            value={criteria.minPE ?? ""}
            onChange={e => setCriteria(p => ({ ...p, minPE: +e.target.value }))}
          />
        </div>
        <div>
          <Label>P/E Max</Label>
          <Input
            type="number"
            min={0}
            value={criteria.maxPE ?? ""}
            onChange={e => setCriteria(p => ({ ...p, maxPE: +e.target.value }))}
          />
        </div>
        <div>
          <Label>Dividend Yld Min (%)</Label>
          <Input
            type="number"
            min={0}
            value={criteria.minDividendYield ?? ""}
            onChange={e => setCriteria(p => ({ ...p, minDividendYield: +e.target.value }))}
          />
        </div>
        <div>
          <Label>Dividend Yld Max (%)</Label>
          <Input
            type="number"
            min={0}
            value={criteria.maxDividendYield ?? ""}
            onChange={e => setCriteria(p => ({ ...p, maxDividendYield: +e.target.value }))}
          />
        </div>
        <div>
          <Label>Price Min</Label>
          <Input
            type="number"
            min={0}
            value={criteria.minPrice ?? ""}
            onChange={e => setCriteria(p => ({ ...p, minPrice: +e.target.value }))}
          />
        </div>
        <div>
          <Label>Price Max</Label>
          <Input
            type="number"
            min={0}
            value={criteria.maxPrice ?? ""}
            onChange={e => setCriteria(p => ({ ...p, maxPrice: +e.target.value }))}
          />
        </div>
        <div>
          <Label>Volume Min</Label>
          <Input
            type="number"
            min={0}
            value={criteria.minVolume ?? ""}
            onChange={e => setCriteria(p => ({ ...p, minVolume: +e.target.value }))}
          />
        </div>
        <div>
          <Label>Volume Max</Label>
          <Input
            type="number"
            min={0}
            value={criteria.maxVolume ?? ""}
            onChange={e => setCriteria(p => ({ ...p, maxVolume: +e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
}
