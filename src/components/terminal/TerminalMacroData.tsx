
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

export const TerminalMacroData = () => {
  const [macroData] = useState({
    fed_rate: 5.25,
    fed_rate_change: 0.25,
    inflation: 3.2,
    inflation_change: -0.1,
    unemployment: 3.7,
    unemployment_change: 0.1,
    gdp_growth: 2.4,
    gdp_change: 0.2,
    vix: 18.5,
    vix_change: -2.1,
    dollar_index: 103.2,
    dollar_change: 0.5,
    oil_price: 82.5,
    oil_change: 1.2,
    gold_price: 1950.0,
    gold_change: -15.0
  });

  const [currencies] = useState([
    { pair: "EUR/USD", rate: 1.0875, change: 0.0025 },
    { pair: "GBP/USD", rate: 1.2654, change: -0.0012 },
    { pair: "USD/JPY", rate: 148.25, change: 0.45 },
    { pair: "USD/CAD", rate: 1.3425, change: 0.0035 },
  ]);

  const [bondYields] = useState([
    { maturity: "2Y", yield: 4.85, change: 0.02 },
    { maturity: "5Y", yield: 4.45, change: 0.01 },
    { maturity: "10Y", yield: 4.25, change: -0.01 },
    { maturity: "30Y", yield: 4.35, change: -0.02 },
  ]);

  const formatChange = (change: number) => (change >= 0 ? "+" : "") + change.toFixed(2);
  const getChangeColor = (change: number) => change >= 0 ? "text-green-400" : "text-red-400";
  const getChangeIcon = (change: number) => 
    change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;

  return (
    <div className="space-y-4">
      {/* Macro overview */}
      <Card className="bg-gray-900 border-green-800">
        <CardHeader className="border-b border-green-800">
          <CardTitle className="text-yellow-400 font-mono flex items-center gap-2">
            <Globe className="w-5 h-5" />
            MACROECONOMIC DASHBOARD
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {/* Fed rate */}
            <div className="p-3 bg-black border border-green-600 rounded text-center">
              <div className="text-green-400 text-sm font-semibold">FED FUNDS RATE</div>
              <div className="text-2xl font-bold text-white">{macroData.fed_rate}%</div>
              <div className={`text-sm flex items-center justify-center gap-1 ${getChangeColor(macroData.fed_rate_change)}`}>
                {getChangeIcon(macroData.fed_rate_change)}
                {formatChange(macroData.fed_rate_change)}%
              </div>
            </div>

            {/* Inflation */}
            <div className="p-3 bg-black border border-yellow-600 rounded text-center">
              <div className="text-yellow-400 text-sm font-semibold">CPI INFLATION</div>
              <div className="text-2xl font-bold text-white">{macroData.inflation}%</div>
              <div className={`text-sm flex items-center justify-center gap-1 ${getChangeColor(macroData.inflation_change)}`}>
                {getChangeIcon(macroData.inflation_change)}
                {formatChange(macroData.inflation_change)}%
              </div>
            </div>

            {/* Unemployment */}
            <div className="p-3 bg-black border border-blue-600 rounded text-center">
              <div className="text-blue-400 text-sm font-semibold">UNEMPLOYMENT</div>
              <div className="text-2xl font-bold text-white">{macroData.unemployment}%</div>
              <div className={`text-sm flex items-center justify-center gap-1 ${getChangeColor(macroData.unemployment_change)}`}>
                {getChangeIcon(macroData.unemployment_change)}
                {formatChange(macroData.unemployment_change)}%
              </div>
            </div>

            {/* GDP Growth */}
            <div className="p-3 bg-black border border-purple-600 rounded text-center">
              <div className="text-purple-400 text-sm font-semibold">GDP GROWTH</div>
              <div className="text-2xl font-bold text-white">{macroData.gdp_growth}%</div>
              <div className={`text-sm flex items-center justify-center gap-1 ${getChangeColor(macroData.gdp_change)}`}>
                {getChangeIcon(macroData.gdp_change)}
                {formatChange(macroData.gdp_change)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market indicators and currencies */}
      <div className="grid grid-cols-3 gap-4">
        {/* Market fear/greed indicators */}
        <Card className="bg-gray-900 border-green-800">
          <CardHeader className="border-b border-green-800">
            <CardTitle className="text-yellow-400 font-mono text-sm">
              MARKET INDICATORS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* VIX */}
              <div className="p-3 bg-black border border-red-600 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-red-400 font-semibold">VIX (FEAR INDEX)</div>
                    <div className="text-2xl font-bold text-white">{macroData.vix}</div>
                  </div>
                  <div className={`text-sm ${getChangeColor(macroData.vix_change)}`}>
                    {formatChange(macroData.vix_change)}
                  </div>
                </div>
                <div className="mt-2">
                  <Badge 
                    className={macroData.vix < 20 ? "bg-green-700" : macroData.vix < 30 ? "bg-yellow-700" : "bg-red-700"}
                  >
                    {macroData.vix < 20 ? "LOW FEAR" : macroData.vix < 30 ? "MODERATE FEAR" : "HIGH FEAR"}
                  </Badge>
                </div>
              </div>

              {/* Dollar Index */}
              <div className="p-3 bg-black border border-green-600 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-green-400 font-semibold">DXY (DOLLAR INDEX)</div>
                    <div className="text-2xl font-bold text-white">{macroData.dollar_index}</div>
                  </div>
                  <div className={`text-sm ${getChangeColor(macroData.dollar_change)}`}>
                    {formatChange(macroData.dollar_change)}
                  </div>
                </div>
              </div>

              {/* Commodities */}
              <div className="space-y-2">
                <div className="p-2 bg-black border border-orange-600 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-orange-400 text-sm font-semibold">CRUDE OIL</div>
                      <div className="text-lg font-bold text-white">${macroData.oil_price}</div>
                    </div>
                    <div className={`text-sm ${getChangeColor(macroData.oil_change)}`}>
                      {formatChange(macroData.oil_change)}
                    </div>
                  </div>
                </div>
                <div className="p-2 bg-black border border-yellow-600 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-yellow-400 text-sm font-semibold">GOLD</div>
                      <div className="text-lg font-bold text-white">${macroData.gold_price}</div>
                    </div>
                    <div className={`text-sm ${getChangeColor(macroData.gold_change)}`}>
                      {formatChange(macroData.gold_change)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currencies */}
        <Card className="bg-gray-900 border-green-800">
          <CardHeader className="border-b border-green-800">
            <CardTitle className="text-yellow-400 font-mono text-sm">
              MAJOR CURRENCIES
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {currencies.map((currency) => (
                <div 
                  key={currency.pair}
                  className="p-3 bg-black border border-blue-600 rounded"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-blue-400 font-semibold">{currency.pair}</div>
                      <div className="text-lg font-bold text-white">{currency.rate.toFixed(4)}</div>
                    </div>
                    <div className={`text-sm ${getChangeColor(currency.change)}`}>
                      {formatChange(currency.change)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bond yields */}
        <Card className="bg-gray-900 border-green-800">
          <CardHeader className="border-b border-green-800">
            <CardTitle className="text-yellow-400 font-mono text-sm">
              US TREASURY YIELDS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {bondYields.map((bond) => (
                <div 
                  key={bond.maturity}
                  className="p-3 bg-black border border-purple-600 rounded"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-purple-400 font-semibold">{bond.maturity} TREASURY</div>
                      <div className="text-lg font-bold text-white">{bond.yield.toFixed(2)}%</div>
                    </div>
                    <div className={`text-sm ${getChangeColor(bond.change)}`}>
                      {formatChange(bond.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Yield curve status */}
            <div className="mt-4 p-3 bg-black border border-red-600 rounded">
              <div className="text-red-400 font-semibold text-center">YIELD CURVE STATUS</div>
              <div className="text-center mt-2">
                <Badge className="bg-red-700">
                  INVERTED
                </Badge>
              </div>
              <div className="text-xs text-red-400 text-center mt-1">
                2Y-10Y SPREAD: -0.60%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Economic calendar */}
      <Card className="bg-gray-900 border-green-800">
        <CardHeader className="border-b border-green-800">
          <CardTitle className="text-yellow-400 font-mono">
            ECONOMIC CALENDAR - TODAY
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-4 text-xs text-green-400 font-semibold border-b border-green-800 pb-2">
              <div>TIME</div>
              <div>EVENT</div>
              <div>IMPORTANCE</div>
              <div>FORECAST</div>
              <div>PREVIOUS</div>
            </div>
            
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-4 text-sm py-2 border-b border-gray-700">
                <div className="text-green-400">8:30 AM</div>
                <div className="text-white">Initial Jobless Claims</div>
                <div>
                  <Badge className="bg-yellow-700 text-xs">MEDIUM</Badge>
                </div>
                <div className="text-green-400">210K</div>
                <div className="text-white">215K</div>
              </div>
              
              <div className="grid grid-cols-5 gap-4 text-sm py-2 border-b border-gray-700">
                <div className="text-green-400">10:00 AM</div>
                <div className="text-white">Consumer Confidence</div>
                <div>
                  <Badge className="bg-red-700 text-xs">HIGH</Badge>
                </div>
                <div className="text-green-400">105.0</div>
                <div className="text-white">102.3</div>
              </div>
              
              <div className="grid grid-cols-5 gap-4 text-sm py-2 border-b border-gray-700">
                <div className="text-green-400">2:00 PM</div>
                <div className="text-white">FOMC Meeting Minutes</div>
                <div>
                  <Badge className="bg-red-700 text-xs">HIGH</Badge>
                </div>
                <div className="text-green-400">-</div>
                <div className="text-white">-</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
