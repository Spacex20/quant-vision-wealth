
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const API = "https://sbjfoupfoefbzfkvkdol.functions.supabase.co/social-trading";

export function useTopTraders() {
  return useQuery({
    queryKey: ["social-top-traders"],
    queryFn: async () => {
      const r = await fetch(API + "/top-traders");
      return r.json();
    }
  });
}

export function usePopularStrategies() {
  return useQuery({
    queryKey: ["social-popular-strategies"],
    queryFn: async () => {
      const r = await fetch(API + "/popular-strategies");
      return r.json();
    }
  });
}

export function useCloneStrategy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ strategy_id, user_id, name, note } : { strategy_id: string, user_id: string, name?: string, note?: string }) => {
      const r = await fetch(API + "/strategy-clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategy_id, cloned_by: user_id, name, note })
      });
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social-popular-strategies"] });
      qc.invalidateQueries({ queryKey: ["user-feed"] });
    }
  });
}

export function useUserFeed(userId: string) {
  return useQuery({
    queryKey: ["user-feed", userId],
    queryFn: async () => {
      const r = await fetch(API + "/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
      });
      return r.json();
    },
    enabled: !!userId
  });
}

export function useFollowUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ follower_id, followed_id } : { follower_id: string, followed_id: string }) => {
      const r = await fetch(API + "/user-follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ follower_id, followed_id })
      });
      return r.json();
    },
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["social-top-traders"] }); 
      qc.invalidateQueries({ queryKey: ["user-feed"] }); 
    }
  });
}

export function useUnfollowUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ follower_id, followed_id } : { follower_id: string, followed_id: string }) => {
      const r = await fetch(API + "/user-unfollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ follower_id, followed_id })
      });
      return r.json();
    },
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["social-top-traders"] }); 
      qc.invalidateQueries({ queryKey: ["user-feed"] }); 
    }
  });
}
