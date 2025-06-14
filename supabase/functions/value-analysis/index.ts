
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ValueAnalysisRequest {
  symbol: string;
  analysisType: 'dcf' | 'dividend' | 'graham' | 'ratios' | 'all';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { symbol, analysisType }: ValueAnalysisRequest = await req.json();
    
    console.log(`Performing ${analysisType} analysis for ${symbol}`);

    // Get market data
    const marketDataResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/market-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({ symbol })
    });

    const marketData = await marketDataResponse.json();
    if (!marketData.success) {
      throw new Error('Unable to get market data');
    }

    const currentPrice = marketData.data.price;
    
    // Mock financial data for demonstration
    const financials = {
      revenue: 100000000000 + Math.random() * 50000000000,
      netIncome: 20000000000 + Math.random() * 10000000000,
      freeCashFlow: 25000000000 + Math.random() * 10000000000,
      totalDebt: 50000000000 + Math.random() * 20000000000,
      cash: 30000000000 + Math.random() * 20000000000,
      sharesOutstanding: 5000000000 + Math.random() * 2000000000,
      bookValue: 15000000000 + Math.random() * 10000000000,
      dividendPerShare: Math.random() * 5,
      eps: 10 + Math.random() * 10,
      roe: 0.15 + Math.random() * 0.1,
      roa: 0.08 + Math.random() * 0.07,
      grossMargin: 0.35 + Math.random() * 0.2,
      operatingMargin: 0.25 + Math.random() * 0.15,
      netMargin: 0.20 + Math.random() * 0.1,
    };

    let analysis: any = {};

    // DCF Analysis
    if (analysisType === 'dcf' || analysisType === 'all') {
      const growthRate = 0.05 + Math.random() * 0.1; // 5-15%
      const discountRate = 0.08 + Math.random() * 0.04; // 8-12%
      const terminalGrowthRate = 0.02 + Math.random() * 0.02; // 2-4%
      
      let dcfValue = 0;
      let projectedFCF = financials.freeCashFlow;
      
      // 5-year projection
      for (let year = 1; year <= 5; year++) {
        projectedFCF *= (1 + growthRate);
        dcfValue += projectedFCF / Math.pow(1 + discountRate, year);
      }
      
      // Terminal value
      const terminalValue = (projectedFCF * (1 + terminalGrowthRate)) / (discountRate - terminalGrowthRate);
      dcfValue += terminalValue / Math.pow(1 + discountRate, 5);
      
      // Per share value
      const dcfPerShare = dcfValue / financials.sharesOutstanding;
      
      analysis.dcf = {
        intrinsicValue: dcfPerShare,
        currentPrice,
        upside: ((dcfPerShare - currentPrice) / currentPrice) * 100,
        assumptions: {
          growthRate: growthRate * 100,
          discountRate: discountRate * 100,
          terminalGrowthRate: terminalGrowthRate * 100
        },
        recommendation: dcfPerShare > currentPrice * 1.15 ? 'BUY' : 
                        dcfPerShare < currentPrice * 0.85 ? 'SELL' : 'HOLD'
      };
    }

    // Dividend Discount Model
    if (analysisType === 'dividend' || analysisType === 'all') {
      const dividendGrowthRate = 0.03 + Math.random() * 0.05; // 3-8%
      const requiredReturn = 0.08 + Math.random() * 0.04; // 8-12%
      
      const ddmValue = financials.dividendPerShare * (1 + dividendGrowthRate) / (requiredReturn - dividendGrowthRate);
      
      analysis.dividendDiscount = {
        intrinsicValue: ddmValue,
        currentPrice,
        upside: ((ddmValue - currentPrice) / currentPrice) * 100,
        dividendYield: (financials.dividendPerShare / currentPrice) * 100,
        assumptions: {
          dividendGrowthRate: dividendGrowthRate * 100,
          requiredReturn: requiredReturn * 100
        },
        recommendation: ddmValue > currentPrice * 1.1 ? 'BUY' : 
                        ddmValue < currentPrice * 0.9 ? 'SELL' : 'HOLD'
      };
    }

    // Benjamin Graham Formula
    if (analysisType === 'graham' || analysisType === 'all') {
      const grahamValue = Math.sqrt(22.5 * financials.eps * (financials.bookValue / financials.sharesOutstanding));
      
      analysis.graham = {
        intrinsicValue: grahamValue,
        currentPrice,
        upside: ((grahamValue - currentPrice) / currentPrice) * 100,
        eps: financials.eps,
        bookValuePerShare: financials.bookValue / financials.sharesOutstanding,
        recommendation: grahamValue > currentPrice * 1.2 ? 'BUY' : 
                        grahamValue < currentPrice * 0.8 ? 'SELL' : 'HOLD'
      };
    }

    // Value Ratios Analysis
    if (analysisType === 'ratios' || analysisType === 'all') {
      const pe = currentPrice / financials.eps;
      const pb = currentPrice / (financials.bookValue / financials.sharesOutstanding);
      const ps = (currentPrice * financials.sharesOutstanding) / financials.revenue;
      const peg = pe / (5 + Math.random() * 15); // Mock earnings growth
      const ev = (currentPrice * financials.sharesOutstanding) + financials.totalDebt - financials.cash;
      const evRevenue = ev / financials.revenue;
      const evEbitda = ev / (financials.netIncome * 1.5); // Mock EBITDA
      
      analysis.ratios = {
        pe,
        pb,
        ps,
        peg,
        evRevenue,
        evEbitda,
        roe: financials.roe * 100,
        roa: financials.roa * 100,
        debtToEquity: financials.totalDebt / (financials.bookValue),
        currentRatio: 1.5 + Math.random(),
        margins: {
          gross: financials.grossMargin * 100,
          operating: financials.operatingMargin * 100,
          net: financials.netMargin * 100
        },
        valuation: pe < 15 && pb < 2 ? 'Undervalued' : 
                  pe > 25 || pb > 4 ? 'Overvalued' : 'Fair Value'
      };
    }

    // Overall recommendation
    const recommendations = Object.values(analysis)
      .map((a: any) => a.recommendation)
      .filter(r => r);
    
    const buyCount = recommendations.filter(r => r === 'BUY').length;
    const sellCount = recommendations.filter(r => r === 'SELL').length;
    
    analysis.overall = {
      recommendation: buyCount > sellCount ? 'BUY' : 
                     sellCount > buyCount ? 'SELL' : 'HOLD',
      confidence: Math.max(buyCount, sellCount) / recommendations.length,
      summary: `Based on ${recommendations.length} valuation methods`
    };

    console.log(`Value analysis completed for ${symbol}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        symbol,
        analysis,
        timestamp: Date.now()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Value analysis error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
