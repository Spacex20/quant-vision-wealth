
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const { pathname } = new URL(req.url);

  if (pathname.endsWith("/top-traders") && req.method === "GET") {
    // Only return curated traders, ordered by performance
    const { data: perf } = await supabase
      .from("performance_snapshots")
      .select("user_id,returns,sharpe_ratio,snapshot_at")
      .order("returns", { ascending: false })
      .limit(50);
    const { data: traders } = await supabase
      .from("profiles")
      .select("id,full_name,avatar_url,is_curated_trader,bio,social_links")
      .eq("is_curated_trader", true);

    // Enrich with latest perf
    const traderPerf = traders?.map(t => {
      const perfObj = perf?.find(p => p.user_id === t.id) || {};
      return {
        ...t,
        returns: perfObj.returns || 0,
        sharpe_ratio: perfObj.sharpe_ratio || 0,
        last_snapshot: perfObj.snapshot_at,
      };
    }) || [];
    traderPerf.sort((a, b) => Number(b.returns) - Number(a.returns));
    return new Response(JSON.stringify(traderPerf), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  if (pathname.endsWith("/popular-strategies") && req.method === "GET") {
    const { data } = await supabase
      .from("trading_strategies")
      .select("id,name,description,created_at,updated_at,clones_count,upvotes_count,returns,volatility,drawdown,sharpe_ratio,visibility,tags,user_id")
      .eq("visibility", "public")
      .order("clones_count", { ascending: false })
      .limit(50);
    return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  if (pathname.endsWith("/strategy-clone") && req.method === "POST") {
    const body = await req.json();
    // { strategy_id, by (user_id), name, note }
    const { strategy_id, cloned_by, name, note } = body;
    // Get original strategy
    const { data: orig, error: origErr } = await supabase
      .from("trading_strategies")
      .select("*")
      .eq("id", strategy_id)
      .single();
    if (origErr || !orig) return new Response(JSON.stringify({ error: "Strategy not found" }), { status: 404, headers: corsHeaders });
    // Insert into clones log
    await supabase.from("strategy_clones").insert([{
      strategy_id,
      cloned_by,
      original_owner: orig.user_id,
      name,
      note
    }]);
    // Increment clones_count
    await supabase.from("trading_strategies")
      .update({ clones_count: (orig.clones_count || 0) + 1 })
      .eq("id", strategy_id);
    // Optionally: Insert into user_portfolios or simulator
    // ... depends on frontend implementation
    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  }

  if (pathname.endsWith("/feed") && req.method === "POST") {
    // { user_id }
    const { user_id } = await req.json();
    // get recent activity for self and followed users
    const { data: following } = await supabase
      .from("followers")
      .select("followed_id")
      .eq("follower_id", user_id);
    const followedIds = (following || []).map(f => f.followed_id);
    const viewIds = [user_id, ...followedIds];
    const { data: feed } = await supabase
      .from("activity_feed")
      .select("*")
      .in("user_id", viewIds)
      .order("created_at", { ascending: false })
      .limit(55);
    return new Response(JSON.stringify(feed), { headers: corsHeaders });
  }

  if (pathname.endsWith("/user-follow") && req.method === "POST") {
    const { follower_id, followed_id } = await req.json();
    if (follower_id === followed_id) return new Response(JSON.stringify({ error: "Cannot follow yourself" }), { status: 400, headers: corsHeaders });
    // Try insert ignore duplicates
    await supabase.from("followers").upsert([{ follower_id, followed_id }]);
    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  }

  if (pathname.endsWith("/user-unfollow") && req.method === "POST") {
    const { follower_id, followed_id } = await req.json();
    await supabase.from("followers").delete().eq("follower_id", follower_id).eq("followed_id", followed_id);
    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  }

  return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: corsHeaders });
});
