
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ServerMembers({ serverId, onChange }: { serverId: string, onChange: () => void }) {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    if (!serverId) return;
    async function fetchMembers() {
      const { data } = await supabase
        .from("investment_server_memberships")
        .select("id, role, joined_at, user_id, profiles:profiles(full_name, avatar_url)")
        .eq("server_id", serverId);
      setMembers(data || []);
    }
    fetchMembers();
  }, [serverId, onChange]);
  
  return (
    <div>
      <h4 className="font-bold text-xs mb-1">Members</h4>
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
        {members.map(member => (
          <div key={member.id} className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback>{member.profiles?.full_name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <span className="text-xs">{member.profiles?.full_name || "User"} ({member.role})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
