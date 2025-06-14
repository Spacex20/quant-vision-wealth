
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";
import { OptimizationConstraints } from "@/services/portfolioOptimization";

interface ConstraintsConfigProps {
  constraints: OptimizationConstraints;
  onConstraintsChange: (constraints: OptimizationConstraints) => void;
}

export const ConstraintsConfig = ({
  constraints,
  onConstraintsChange
}: ConstraintsConfigProps) => {
  const updateConstraint = (key: keyof OptimizationConstraints, value: number | undefined) => {
    onConstraintsChange({
      ...constraints,
      [key]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Portfolio Constraints</span>
        </CardTitle>
        <CardDescription>Set limits and targets for optimization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Min Allocation per Asset</Label>
            <div className="mt-2">
              <Slider
                value={[constraints.minAllocation]}
                onValueChange={(value) => updateConstraint('minAllocation', value[0])}
                max={20}
                min={0}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span className="font-medium">{constraints.minAllocation}%</span>
                <span>20%</span>
              </div>
            </div>
          </div>

          <div>
            <Label>Max Allocation per Asset</Label>
            <div className="mt-2">
              <Slider
                value={[constraints.maxAllocation]}
                onValueChange={(value) => updateConstraint('maxAllocation', value[0])}
                max={100}
                min={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5%</span>
                <span className="font-medium">{constraints.maxAllocation}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label>Maximum Number of Assets</Label>
          <div className="mt-2">
            <Slider
              value={[constraints.maxAssets]}
              onValueChange={(value) => updateConstraint('maxAssets', value[0])}
              max={20}
              min={3}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>3</span>
              <span className="font-medium">{constraints.maxAssets}</span>
              <span>20</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={constraints.targetReturn !== undefined}
              onCheckedChange={(checked) => 
                updateConstraint('targetReturn', checked ? 0.08 : undefined)
              }
            />
            <Label>Set Target Return</Label>
          </div>
          
          {constraints.targetReturn !== undefined && (
            <div>
              <Label>Target Annual Return (%)</Label>
              <Input
                type="number"
                value={(constraints.targetReturn * 100).toFixed(1)}
                onChange={(e) => updateConstraint('targetReturn', parseFloat(e.target.value) / 100)}
                className="mt-1"
                step="0.1"
                min="0"
                max="30"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={constraints.maxRisk !== undefined}
              onCheckedChange={(checked) => 
                updateConstraint('maxRisk', checked ? 0.15 : undefined)
              }
            />
            <Label>Set Risk Limit</Label>
          </div>
          
          {constraints.maxRisk !== undefined && (
            <div>
              <Label>Maximum Risk (Volatility %)</Label>
              <Input
                type="number"
                value={(constraints.maxRisk * 100).toFixed(1)}
                onChange={(e) => updateConstraint('maxRisk', parseFloat(e.target.value) / 100)}
                className="mt-1"
                step="0.1"
                min="1"
                max="50"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
