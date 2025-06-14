
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GripVertical, X } from "lucide-react";
import { Asset } from "@/services/portfolioOptimization";

interface AllocationSliderProps {
  asset: Asset;
  onAllocationChange: (symbol: string, allocation: number) => void;
  onRemoveAsset: (symbol: string) => void;
  isLocked?: boolean;
}

export const AllocationSlider = ({
  asset,
  onAllocationChange,
  onRemoveAsset,
  isLocked = false
}: AllocationSliderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleAllocationChange = (value: number[]) => {
    onAllocationChange(asset.symbol, value[0]);
  };

  return (
    <Card className={`transition-all duration-200 ${isDragging ? 'shadow-lg scale-105' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-medium">{asset.symbol}</span>
                <span className="text-sm text-muted-foreground ml-2">{asset.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{asset.allocation.toFixed(1)}%</Badge>
                {!isLocked && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveAsset(asset.symbol)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Slider
                value={[asset.allocation]}
                onValueChange={handleAllocationChange}
                max={asset.maxAllocation || 50}
                min={asset.minAllocation || 0}
                step={0.5}
                className="w-full"
                disabled={isLocked}
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: {asset.minAllocation || 0}%</span>
                <span>Max: {asset.maxAllocation || 50}%</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Expected Return:</span>
                  <span className="ml-1 font-medium">{(asset.expectedReturn * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Volatility:</span>
                  <span className="ml-1 font-medium">{(asset.volatility * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
