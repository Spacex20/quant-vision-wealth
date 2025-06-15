
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Utility to compute "distance" between users—for now, just absolute risk diff
function getUserSimilarity(userA, userB) {
  if (userA.risk_tolerance && userB.risk_tolerance) {
    return Math.abs(Number(userA.risk_tolerance) - Number(userB.risk_tolerance));
  }
  return 10; // fallback: not similar at all
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    let user_id: string | undefined;
    let bodyUserId: string | undefined;

    // Accept either Bearer auth or user_id in POST body
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Try decode JWT user_id (in production, verify JWT!)
      // For now user must POST user_id in body for demonstration
    }

    if (req.method === "POST") {
      const json = await req.json();
      bodyUserId = json.user_id;
    } else if (req.method === "GET") {
      user_id = url.searchParams.get("user_id") ?? undefined;
    }
    user_id = user_id || bodyUserId;

    if (!user_id) {
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Query this user's profile and portfolio
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    const fetchHeaders = {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    };

    // 1. Get requesting user's profile (risk level, etc)
    const { profile } = await (await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${user_id}&select=id,full_name,risk_tolerance,preferred_sectors`,
      { headers: fetchHeaders }
    )).json().then(resp => ({ profile: resp[0] }));

    if (!profile) {
      return new Response(JSON.stringify({ error: "User profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Get this user's most recent portfolio
    const { userPortfolio } = await (await fetch(
      `${supabaseUrl}/rest/v1/user_portfolios?user_id=eq.${user_id}&select=id,assets,total_value,created_at&order=created_at.desc&limit=1`,
      { headers: fetchHeaders }
    )).json().then(resp => ({ userPortfolio: resp[0] }));

    if (!userPortfolio) {
      return new Response(JSON.stringify({ error: "User portfolio not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Find all profiles similar to this user's risk tolerance (simple clustering)
    const allProfilesResp = await fetch(
      `${supabaseUrl}/rest/v1/profiles?select=id,full_name,risk_tolerance,preferred_sectors`,
      { headers: fetchHeaders }
    );
    const allProfiles: any[] = await allProfilesResp.json();

    // Find "close" users (risk tolerance diff <= 2)
    const similarUserIds = allProfiles.filter(
      (p) =>
        p.id !== user_id &&
        p.risk_tolerance &&
        Math.abs(Number(p.risk_tolerance) - Number(profile.risk_tolerance)) <= 2
    ).map((p) => p.id);

    // 4. Search those users' portfolios, aggregate top holdings
    let popularAssets: Record<string, number> = {};
    if (similarUserIds.length > 0) {
      const portfoliosResp = await fetch(
        `${supabaseUrl}/rest/v1/user_portfolios?user_id=in.(${similarUserIds
          .map((id) => `"${id}"`)
          .join(",")})&select=assets,total_value`,
        { headers: fetchHeaders }
      );
      const portfolios: any[] = await portfoliosResp.json();

      // Aggregate all assets (symbol counts)
      portfolios.forEach((pf) => {
        (pf.assets ?? []).forEach((a: any) => {
          if (!a?.symbol) return;
          popularAssets[a.symbol] = (popularAssets[a.symbol] || 0) + 1;
        });
      });
    }

    // Get top 5 assets not in current user's portfolio
    const currentSymbols = (userPortfolio.assets ?? []).map(a => a.symbol);
    const sortedAssets = Object.entries(popularAssets)
      .filter(([symbol]) => !currentSymbols.includes(symbol))
      .sort(([, aCount], [, bCount]) => bCount - aCount)
      .slice(0, 5)
      .map(([symbol, count]) => ({ symbol, popularity: count }));

    // 5. Return explainable ideas (why this was recommended)
    const explanations = sortedAssets.map((a, idx) => ({
      symbol: a.symbol,
      reason: `This stock/ETF is popular among users with similar risk tolerance (${profile.risk_tolerance}).`,
    }));

    return new Response(
      JSON.stringify({
        ideas: explanations,
        cluster_size: similarUserIds.length,
        explanation:
          similarUserIds.length > 0
            ? `Recommended based on clustering with ${similarUserIds.length} users who have similar risk profiles.`
            : "Not enough similar users found—recommendations may be generic.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[stock-ideas] error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
