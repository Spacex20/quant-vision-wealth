
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";

export function ProfileOnboarding() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  // Controlled fields for all investment details
  const [risk, setRisk] = useState(profile?.risk_tolerance || "");
  const [exp, setExp] = useState(profile?.investment_experience || "");
  const [goals, setGoals] = useState((profile?.investment_goals || []).join(","));
  const [income, setIncome] = useState(profile?.annual_income_range || "");
  const [netWorth, setNetWorth] = useState(profile?.net_worth_range || "");
  const [horizon, setHorizon] = useState(profile?.time_horizon || "");
  const [sectors, setSectors] = useState((profile?.preferred_sectors || []).join(","));
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Save fields to profiles table
    const { error } = await (window as any).supabase
      .from("profiles")
      .update({
        risk_tolerance: risk,
        investment_experience: exp,
        investment_goals: goals
          .split(",")
          .map((g: string) => g.trim())
          .filter((g: string) => g),
        annual_income_range: income,
        net_worth_range: netWorth,
        time_horizon: horizon,
        preferred_sectors: sectors
          .split(",")
          .map((s: string) => s.trim())
          .filter((s: string) => s),
        onboarding_completed: true,
      })
      .eq("id", user?.id);

    setLoading(false);
    if (!error) {
      toast({ title: "Success", description: "Profile saved!" });
      refreshProfile();
      // Do NOT force window reload
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
        <form className="bg-white shadow rounded p-6 space-y-4 w-full max-w-lg" onSubmit={handleSave}>
          <h2 className="text-xl font-bold mb-2">Complete your investor profile</h2>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="font-semibold cursor-help">Risk Tolerance</label>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div>
                  How much risk can you take? <br />
                  <span className="text-xs text-muted-foreground">
                    (e.g. conservative, moderate, aggressive)
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
            <Input value={risk} onChange={e => setRisk(e.target.value)} required placeholder="conservative, moderate, aggressive"/>
          </div>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="font-semibold cursor-help">Investment Experience</label>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div>
                  Your investing experience level.<br />
                  <span className="text-xs text-muted-foreground">
                    (e.g. beginner, intermediate, advanced, expert)
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
            <Input value={exp} onChange={e => setExp(e.target.value)} required placeholder="beginner, intermediate, advanced, expert" />
          </div>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="font-semibold cursor-help">Investment Goals</label>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div>
                  What are your main objectives? <br />
                  <span className="text-xs text-muted-foreground">
                    Enter comma separated values. (e.g. retirement, growth, income)
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
            <Input value={goals} onChange={e => setGoals(e.target.value)} placeholder="Comma separated (e.g. retirement, growth)" />
          </div>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="font-semibold cursor-help">Annual Income Range</label>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div>
                  Your total annual income range.<br />
                  <span className="text-xs text-muted-foreground">e.g. $50,000-$100,000</span>
                </div>
              </TooltipContent>
            </Tooltip>
            <Input value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g. $50,000-$100,000" />
          </div>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="font-semibold cursor-help">Net Worth Range</label>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div>
                  Your approximate net worth.<br />
                  <span className="text-xs text-muted-foreground">e.g. $10,000-$100,000</span>
                </div>
              </TooltipContent>
            </Tooltip>
            <Input value={netWorth} onChange={e => setNetWorth(e.target.value)} placeholder="e.g. $10,000-$100,000" />
          </div>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="font-semibold cursor-help">Time Horizon</label>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div>
                  How long will you invest?<br />
                  <span className="text-xs text-muted-foreground">e.g. 3-5 years</span>
                </div>
              </TooltipContent>
            </Tooltip>
            <Input value={horizon} onChange={e => setHorizon(e.target.value)} placeholder="e.g. 3-5 years" />
          </div>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="font-semibold cursor-help">Preferred Sectors</label>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div>
                  Which sectors do you prefer?<br />
                  <span className="text-xs text-muted-foreground">
                    Enter comma separated values. (e.g. technology, healthcare)
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
            <Input value={sectors} onChange={e => setSectors(e.target.value)} placeholder="Comma separated" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Finish"}
          </Button>
        </form>
      </div>
    </TooltipProvider>
  );
}
