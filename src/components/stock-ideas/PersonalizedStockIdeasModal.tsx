
import React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Info } from "lucide-react";

interface Idea {
  symbol: string;
  reason: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const API_URL = "https://sbjfoupfoefbzfkvkdol.functions.supabase.co/stock-ideas";

export function PersonalizedStockIdeasModal({ open, onOpenChange }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [explanation, setExplanation] = useState<string>("");
  const [clusterSize, setClusterSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = async () => {
    if (!user) {
      toast.error("You need to be logged in to get personalized ideas.");
      return;
    }
    setLoading(true);
    setError(null);
    setIdeas([]);
    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiamZvdXBmb2VmYnpma3ZrZG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODk3MjAsImV4cCI6MjA2NTQ2NTcyMH0.n9aOp3f1QbQq-yRFmyO0FY9iOCsv4wX0AcZeH0Z0xNQ"
        },
        body: JSON.stringify({ user_id: user?.id }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || "Failed to get recommendations.");
      } else {
        setIdeas(data.ideas || []);
        setExplanation(data.explanation);
        setClusterSize(typeof data.cluster_size === "number" ? data.cluster_size : null);
      }
    } catch (e: any) {
      setError("An unexpected error occurred. Please try again!");
    }
    setLoading(false);
  };

  // Automatically refetch when modal opens, if necessary
  React.useEffect(() => {
    if (open && user) fetchIdeas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <span className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Personalized Stock Ideas
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="mb-3 text-muted-foreground text-sm">
          Get stock & ETF ideas tailored to your risk profile, using clustering of similar users.
        </div>
        {loading && (
          <div className="flex justify-center items-center h-28">
            <Loader2 className="animate-spin h-8 w-8 mr-2 text-primary" />
            Fetching your recommendations...
          </div>
        )}
        {!loading && error && (
          <div className="text-red-600 text-center py-4">{error}</div>
        )}
        {!loading && !error && (
          <div className="space-y-2">
            {ideas.length > 0 ? (
              <>
                <div className="mb-3">
                  <span className="font-semibold">Why you see these:</span>{" "}
                  <span className="text-sm text-muted-foreground">{explanation}</span>
                  {clusterSize !== null && (
                    <Badge className="ml-2">{clusterSize} similar users</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  {ideas.map((idea, i) => (
                    <div key={idea.symbol} className="bg-accent rounded p-3 border flex items-center gap-3">
                      <Badge variant="outline" className="text-base px-2 py-1">{idea.symbol}</Badge>
                      <span className="text-sm">{idea.reason}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-muted-foreground py-6 text-center">
                No personalized ideas yet. Try adjusting your portfolio or risk settings.
              </div>
            )}
          </div>
        )}
        {/* Button for manual refresh if needed */}
        <div className="flex items-center justify-end gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={fetchIdeas} disabled={loading || !user}>
            Refresh
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
