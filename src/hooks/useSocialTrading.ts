
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API = "https://sbjfoupfoefbzfkvkdol.functions.supabase.co/social-trading";

export function useTopTraders() {
  return useQuery({
    queryKey: ["social-top-traders"],
    queryFn: async () => {
      try {
        const r = await fetch(API + "/top-traders");
        if (!r.ok) throw new Error("Failed to fetch top traders");
        return r.json();
      } catch (error) {
        console.error("Error fetching top traders:", error);
        return [];
      }
    }
  });
}

export function usePopularStrategies() {
  return useQuery({
    queryKey: ["social-popular-strategies"],
    queryFn: async () => {
      try {
        const r = await fetch(API + "/popular-strategies");
        if (!r.ok) throw new Error("Failed to fetch popular strategies");
        return r.json();
      } catch (error) {
        console.error("Error fetching popular strategies:", error);
        return [];
      }
    }
  });
}

export function useCloneStrategy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ strategy_id, user_id, name, note } : { strategy_id: string, user_id: string, name?: string, note?: string }) => {
      try {
        const r = await fetch(API + "/strategy-clone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ strategy_id, cloned_by: user_id, name, note })
        });
        if (!r.ok) throw new Error("Failed to clone strategy");
        return r.json();
      } catch (error) {
        console.error("Error cloning strategy:", error);
        throw error;
      }
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
      if (!userId) return [];
      try {
        const r = await fetch(API + "/feed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId })
        });
        if (!r.ok) throw new Error("Failed to fetch user feed");
        return r.json();
      } catch (error) {
        console.error("Error fetching user feed:", error);
        return [];
      }
    },
    enabled: !!userId
  });
}

export function useFollowUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ follower_id, followed_id } : { follower_id: string, followed_id: string }) => {
      try {
        const r = await fetch(API + "/user-follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ follower_id, followed_id })
        });
        if (!r.ok) throw new Error("Failed to follow user");
        return r.json();
      } catch (error) {
        console.error("Error following user:", error);
        throw error;
      }
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
      try {
        const r = await fetch(API + "/user-unfollow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ follower_id, followed_id })
        });
        if (!r.ok) throw new Error("Failed to unfollow user");
        return r.json();
      } catch (error) {
        console.error("Error unfollowing user:", error);
        throw error;
      }
    },
    onSuccess: () => { 
      qc.invalidateQueries({ queryKey: ["social-top-traders"] }); 
      qc.invalidateQueries({ queryKey: ["user-feed"] }); 
    }
  });
}
