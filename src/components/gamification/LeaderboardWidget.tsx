
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Entry = {
  user_id: string;
  points: number;
  rank: number | null;
  profile?: { username?: string; full_name?: string; avatar_url?: string };
};

export function LeaderboardWidget() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top 10 users for leaderboard & join with profiles
    async function fetchLeaderboard() {
      setLoading(true);
      const { data: leaderRows } = await supabase
        .from("leaderboards")
        .select("user_id, points, rank")
        .order("points", { ascending: false })
        .limit(10);

      // Now fetch related profiles (best effort, some profiles may not have all fields)
      if (!leaderRows) {
        setEntries([]);
        setLoading(false);
        return;
      }

      const userIds = leaderRows.map(row => row.user_id);
      const { data: profilesRows } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .in("id", userIds);

      const profiles = profilesRows || [];
      setEntries(
        leaderRows.map((entry, idx) => ({
          ...entry,
          rank: entry.rank ?? idx + 1,
          profile: profiles.find(p => p.id === entry.user_id),
        }))
      );
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  if (loading) return <Skeleton className="h-[240px] w-full rounded-xl" />;

  if (!entries.length) return (
    <div className="p-4">No leaderboard data yet. Start earning points!</div>
  );

  return (
    <div className="rounded-xl border bg-white/80 shadow-sm p-4 w-full max-w-md mx-auto">
      <div className="font-semibold text-lg mb-2">🏆 Leaderboard</div>
      <ol className="">
        {entries.map((entry, i) => (
          <li className="flex gap-3 items-center py-1 border-b last:border-b-0" key={entry.user_id}>
            <span className={`font-bold w-6 text-right ${i === 0 ? "text-amber-500" : i === 1 ? "text-gray-600" : ""}`}>{entry.rank}</span>
            {entry.profile?.avatar_url ? (
              <img src={entry.profile.avatar_url} alt={entry.profile.username || "user"} className="w-8 h-8 rounded-full" />
            ) : (
              <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">{entry.profile?.username?.[0]?.toUpperCase() ?? "U"}</span>
            )}
            <span className="flex-1">
              {entry.profile?.username || entry.profile?.full_name || "User"}
            </span>
            <Badge variant="outline" className="font-mono bg-slate-100 shadow">{entry.points} pts</Badge>
          </li>
        ))}
      </ol>
    </div>
  );
}
