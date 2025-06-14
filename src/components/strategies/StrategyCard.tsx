
import { useState } from 'react';
import { Strategy } from '@/data/strategies';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StrategyChart } from './StrategyChart';
import { TrendingUp, TrendingDown, Layers, Target, PieChart, Info, BookOpen } from 'lucide-react';

interface StrategyCardProps {
  strategy: Strategy;
}

const RiskBadge = ({ risk }: { risk: Strategy['riskProfile'] }) => {
  const color = {
    Low: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    High: 'bg-red-100 text-red-800 border-red-200',
  };
  return <Badge variant="outline" className={cn('font-semibold', color[risk])}>{risk} Risk</Badge>;
};

export const StrategyCard = ({ strategy }: StrategyCardProps) => {
  const [simulationAmount, setSimulationAmount] = useState('100000');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center space-x-3">
                    <strategy.icon className="h-7 w-7 text-primary" />
                    <span>{strategy.name}</span>
                </CardTitle>
                <CardDescription className="mt-2">{strategy.description}</CardDescription>
            </div>
            <RiskBadge risk={strategy.riskProfile} />
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="details">
            <AccordionTrigger className="font-semibold text-base">View Full Details</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 p-3 rounded-md bg-muted/50">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                    <div>
                        <p className="text-muted-foreground">Expected Return</p>
                        <p className="font-bold text-lg">{strategy.expectedReturn}%</p>
                    </div>
                </div>
                 <div className="flex items-center space-x-2 p-3 rounded-md bg-muted/50">
                    <TrendingDown className="h-6 w-6 text-red-500" />
                    <div>
                        <p className="text-muted-foreground">Volatility (Risk)</p>
                        <p className="font-bold text-lg">{strategy.volatility}%</p>
                    </div>
                </div>
                 <div className="flex items-center space-x-2 p-3 rounded-md bg-muted/50">
                    <Target className="h-6 w-6 text-blue-500" />
                    <div>
                        <p className="text-muted-foreground">Sharpe Ratio</p>
                        <p className="font-bold text-lg">{strategy.sharpeRatio}</p>
                    </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center"><Layers className="h-4 w-4 mr-2" />Asset Allocation</h3>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset Class</TableHead>
                                <TableHead>ETF/Example</TableHead>
                                <TableHead className="text-right">Weight</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {strategy.allocation.map(a => (
                                <TableRow key={a.asset}>
                                    <TableCell className="font-medium">{a.asset}</TableCell>
                                    <TableCell>{a.etf || 'N/A'}</TableCell>
                                    <TableCell className="text-right">{a.weight}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="space-y-4">
                     <h3 className="font-semibold flex items-center"><PieChart className="h-4 w-4 mr-2" />Sector Exposure</h3>
                     <div className="flex flex-wrap gap-2">
                        {strategy.sectorExposure.map(s => (
                            <Badge key={s.sector} variant="secondary">{s.sector} {s.weight}%</Badge>
                        ))}
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="font-semibold flex items-center"><BookOpen className="h-4 w-4 mr-2" />Implementation Notes</h3>
                 <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">{strategy.implementationNotes}</p>
              </div>

              <StrategyChart data={strategy.chartData} />

            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <Input 
            type="number" 
            value={simulationAmount}
            onChange={(e) => setSimulationAmount(e.target.value)}
            className="w-40"
            placeholder="₹1,00,000"
          />
          <Button disabled>Simulate Strategy</Button>
        </div>
        <div className="flex items-center space-x-2">
            <Button variant="outline" disabled>Edit & Save</Button>
            <Button variant="ghost" disabled>Export to Dashboard</Button>
        </div>
      </CardFooter>
    </Card>
  );
};
