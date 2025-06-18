
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Bot, User, TrendingUp, AlertCircle, Lightbulb, Send, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "advisor";
  content: string;
  timestamp: Date;
  type?: "insight" | "warning" | "suggestion" | "analysis";
}

interface PortfolioContext {
  totalValue: number;
  riskLevel: number;
  timeHorizon: number;
  recentPerformance: number;
}

const QUICK_PROMPTS = [
  "Analyze my portfolio risk",
  "Suggest rebalancing strategies",
  "Compare my performance to benchmarks",
  "Recommend new asset classes",
  "Explain diversification benefits",
  "Plan for market volatility"
];

export const EnhancedPortfolioAdvisor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "advisor",
      content: "Hello! I'm your AI Portfolio Advisor. I can help you with portfolio analysis, rebalancing strategies, risk assessment, and investment insights. What would you like to discuss today?",
      timestamp: new Date(),
      type: "insight"
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock portfolio context - in real app, this would come from user's actual portfolio
  const portfolioContext: PortfolioContext = {
    totalValue: 125000,
    riskLevel: 6,
    timeHorizon: 15,
    recentPerformance: 8.4
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "warning": return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "suggestion": return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case "analysis": return <TrendingUp className="h-4 w-4 text-green-500" />;
      default: return <Bot className="h-4 w-4 text-purple-500" />;
    }
  };

  const generateContextualPrompt = (userMessage: string) => {
    return `
Portfolio Context:
- Total Value: $${portfolioContext.totalValue.toLocaleString()}
- Risk Tolerance: ${portfolioContext.riskLevel}/10
- Time Horizon: ${portfolioContext.timeHorizon} years
- Recent Performance: ${portfolioContext.recentPerformance}%

User Question: ${userMessage}

Please provide personalized advice based on this portfolio context. Focus on actionable insights and explain your reasoning clearly.
`;
  };

  const handleSend = async (messageText?: string) => {
    const messageContent = messageText || input.trim();
    if (!messageContent || !user?.id) return;
    
    setLoading(true);
    setInput("");

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate typing indicator
    setIsTyping(true);

    try {
      const contextualPrompt = generateContextualPrompt(messageContent);
      
      const res = await fetch(
        `${window.location.origin.replace(/\/$/, "")}/functions/v1/portfolio-advisor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            message: contextualPrompt,
            period: "monthly",
          }),
        }
      );
      
      const data = await res.json();
      
      setIsTyping(false);
      
      if (data.advisorResponse) {
        // Determine message type based on content
        let messageType: Message['type'] = "insight";
        const content = data.advisorResponse.toLowerCase();
        if (content.includes("risk") || content.includes("warning") || content.includes("caution")) {
          messageType = "warning";
        } else if (content.includes("suggest") || content.includes("recommend") || content.includes("consider")) {
          messageType = "suggestion";
        } else if (content.includes("analysis") || content.includes("performance") || content.includes("data")) {
          messageType = "analysis";
        }

        const advisorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "advisor",
          content: data.advisorResponse,
          timestamp: new Date(),
          type: messageType
        };
        setMessages(prev => [...prev, advisorMessage]);
      } else {
        toast({ 
          title: "Error", 
          description: data.error || "No response from advisor.", 
          variant: "destructive" 
        });
      }
    } catch (err) {
      setIsTyping(false);
      toast({ 
        title: "Error", 
        description: "Failed to contact advisor. Please try again.", 
        variant: "destructive" 
      });
    }

    setLoading(false);
  };

  const clearChat = () => {
    setMessages([{
      id: "welcome",
      role: "advisor",
      content: "Chat cleared! How can I assist you with your portfolio today?",
      timestamp: new Date(),
      type: "insight"
    }]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-purple-600" />
            AI Portfolio Advisor
            <Badge variant="secondary" className="ml-2">GPT-4 Powered</Badge>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={clearChat}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Portfolio Context Display */}
        <div className="p-4 bg-muted/50 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Portfolio Value</span>
              <div className="font-semibold">${portfolioContext.totalValue.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Risk Level</span>
              <div className="font-semibold">{portfolioContext.riskLevel}/10</div>
            </div>
            <div>
              <span className="text-muted-foreground">Time Horizon</span>
              <div className="font-semibold">{portfolioContext.timeHorizon} years</div>
            </div>
            <div>
              <span className="text-muted-foreground">Recent Performance</span>
              <div className="font-semibold text-green-600">+{portfolioContext.recentPerformance}%</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "advisor" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  {getMessageIcon(message.type)}
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2",
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                <div className="text-sm">{message.content}</div>
                <div className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
              
              {message.role === "user" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-purple-500" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-4 border-t bg-muted/30">
          <div className="mb-3">
            <span className="text-sm text-muted-foreground">Quick prompts:</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_PROMPTS.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-xs"
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask about portfolio optimization, risk analysis, rebalancing strategies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 min-h-[40px] max-h-[120px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button 
              onClick={() => handleSend()} 
              disabled={loading || !input.trim()}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
