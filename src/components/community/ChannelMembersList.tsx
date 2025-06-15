
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Profile {
  full_name: string;
  avatar_url: string;
}

interface Member {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile?: Profile;
}

export function ChannelMembersList({ channelId }: { channelId: string }) {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!channelId) return;
    setLoading(true);
    supabase
      .from("channel_memberships")
      .select(`
        id, channel_id, user_id, joined_at, role,
        profile:profiles(full_name, avatar_url)
      `)
      .eq("channel_id", channelId)
      .then(({ data }) => {
        // Defensive: filter out "profile" errors and ensure "profile" shape
        const safeMembers: Member[] = (data || []).map((m: any) => ({
          ...m,
          profile: m.profile && m.profile.full_name ? m.profile : undefined
        }));
        setMembers(safeMembers);
      })
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, [channelId]);

  const handleRemove = async (member: Member) => {
    if (!user || member.role === "admin") return; // Don't remove admin
    await supabase.from("channel_memberships").delete().eq("id", member.id);
    setMembers(members => members.filter(m => m.id !== member.id));
    toast({ title: "Removed", description: "User removed from channel." });
  };

  return (
    <div className="p-2">
      <h4 className="font-bold text-xs mb-2">Members</h4>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {members.map(member => (
            <li key={member.id} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                {member.profile?.avatar_url ? (
                  <img src={member.profile.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <span className="text-center text-xs">{member.profile?.full_name?.charAt(0) || "U"}</span>
                )}
              </div>
              <span className="flex-1 text-xs">
                {member.profile?.full_name || "User"} ({member.role})
              </span>
              {user?.id !== member.user_id && (
                <Button size="sm" variant="outline" onClick={() => handleRemove(member)}>
                  Remove
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
