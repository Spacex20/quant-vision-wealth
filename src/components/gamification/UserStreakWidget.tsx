
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { BadgePercent } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function UserStreakWidget() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<{ current_streak: number; best_streak: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("user_streaks")
      .select("current_streak, best_streak")
      .eq("user_id", user.id)
      .eq("streak_type", "login")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setStreak(data || { current_streak: 0, best_streak: 0 });
        setLoading(false);
      });
  }, [user]);

  if (!user) return null;
  if (loading) return <Skeleton className="h-12 w-full rounded-lg" />;

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-fuchsia-400/60 to-blue-200/60 shadow-sm border mb-2">
      <BadgePercent className="w-7 h-7 text-yellow-600" />
      <div>
        <div className="font-semibold text-lg">
          🔥 {streak?.current_streak ?? 0} day streak
          {streak && streak.current_streak > 0 && <span className="ml-2 text-xs text-gray-500">(Best: {streak.best_streak})</span>}
        </div>
        <div className="text-xs text-muted-foreground">Keep coming back daily for rewards!</div>
      </div>
    </div>
  );
}
