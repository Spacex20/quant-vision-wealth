
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper to fetch latest portfolio data (simulate or extend as needed)
async function fetchPortfolio(userId: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const response = await fetch(`${supabaseUrl}/rest/v1/user_portfolios?user_id=eq.${userId}&select=*`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    }
  });
  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, message, period = "monthly" } = await req.json();

    if (!userId || !message) {
      return new Response(JSON.stringify({ error: "Missing userId or message." }), { status: 400, headers: corsHeaders });
    }

    // Fetch the user's portfolio data
    const portfolio = await fetchPortfolio(userId);

    if (!portfolio) {
      return new Response(JSON.stringify({ error: "No portfolio found for user." }), { status: 404, headers: corsHeaders });
    }

    // Prompt for OpenAI with portfolio details and user question
    const chatPrompt = [
      { role: "system", content: `You are a highly skilled portfolio advisor and investment AI. Based on the user's latest portfolio data, provide suggestions for asset allocation improvements and clear, jargon-free rebalancing advice. Focus on insights for the next ${period} review and include practical steps. Respond conversationally.` },
      { role: "user", content: `My portfolio: ${JSON.stringify(portfolio)}\n\n${message}` }
    ];

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: chatPrompt,
        max_tokens: 600,
        temperature: 0.3,
      }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      return new Response(JSON.stringify({ error: err }), { status: 500, headers: corsHeaders });
    }

    const aiData = await openaiRes.json();
    const content = aiData.choices?.[0]?.message?.content || "Sorry, no advice could be generated.";
    return new Response(JSON.stringify({ advisorResponse: content }), { headers: { ...corsHeaders, "Content-Type": "application/json" }});
  } catch (error) {
    console.error("portfolio-advisor error:", error);
    return new Response(JSON.stringify({ error: `${error}` }), { status: 500, headers: corsHeaders });
  }
});
