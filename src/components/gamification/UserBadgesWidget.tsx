
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { BadgeCheck, BadgeDollarSign, BadgePercent, BadgeX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Mapping badge_type to icon and color
const badgeIcons: Record<string, React.ReactNode> = {
  "long_streak": <BadgePercent className="w-5 h-5 text-yellow-500" />,
  "first_trade": <BadgeDollarSign className="w-5 h-5 text-emerald-600" />,
  "community_builder": <BadgeCheck className="w-5 h-5 text-violet-600" />,
  "": <BadgeX className="w-5 h-5 text-gray-400" />,
};

export function UserBadgesWidget() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", user.id)
      .order("awarded_at", { ascending: false })
      .then(({ data }) => {
        setBadges(data ?? []);
        setLoading(false);
      });
  }, [user]);

  if (!user) return null;
  if (loading) return <Skeleton className="h-10 w-full rounded-md" />;
  if (badges.length === 0) return null;

  return (
    <div className="flex items-center flex-wrap gap-2 my-2">
      {badges.map((badge) => (
        <Badge variant="outline" key={badge.id || badge.badge_type} className="flex items-center gap-1 text-sm px-3 py-1 bg-white/80 shadow border-slate-300">
          {badgeIcons[badge.badge_type] || badgeIcons[""]} 
          <span>{badge.badge_type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
        </Badge>
      ))}
    </div>
  );
}
