
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "advisor";
  content: string;
}

export const PortfolioAdvisorChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "advisor",
      content: "Hi! I'm your AI Portfolio Advisor. Ask me for suggestions or rebalancing insights (monthly or quarterly).",
    }
  ]);
  const [input, setInput] = useState("");
  const [period, setPeriod] = useState<"monthly" | "quarterly">("monthly");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || !user?.id) return;
    setLoading(true);

    setMessages((msgs) => [...msgs, { role: "user", content: input }]);

    try {
      const res = await fetch(
        `${window.location.origin.replace(/\/$/, "")}/functions/v1/portfolio-advisor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            message: input,
            period,
          }),
        }
      );
      const data = await res.json();
      if (data.advisorResponse) {
        setMessages((msgs) => [
          ...msgs,
          { role: "advisor", content: data.advisorResponse },
        ]);
      } else {
        toast({ title: "Error", description: data.error || "No response from advisor.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to contact advisor.", variant: "destructive" });
    }

    setInput("");
    setLoading(false);
  };

  return (
    <Card className="max-w-xl mx-auto my-10">
      <CardHeader>
        <CardTitle>AI Portfolio Advisor Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="mr-3 font-medium">Timeframe for insights: </label>
          <select
            className="border rounded px-2 py-1"
            value={period}
            onChange={(e) =>
              setPeriod(e.target.value as "monthly" | "quarterly")
            }
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
        <div className="border rounded p-4 mb-4 h-60 overflow-y-auto bg-muted">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <span
                className={
                  msg.role === "advisor"
                    ? "inline-block px-2 py-1 rounded bg-blue-100 text-blue-900"
                    : "inline-block px-2 py-1 rounded bg-gray-200 text-gray-800"
                }
              >
                {msg.role === "advisor" ? "Advisor: " : "You: "}
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea
            className="flex-1 min-h-[40px]"
            placeholder="Type your question or request an insight..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? "Thinking..." : "Send"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
