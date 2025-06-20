
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/layout/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { 
  Brain, 
  Terminal, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Zap,
  FileText,
  Globe,
  Database,
  Target,
  CheckCircle,
  Calculator,
  Building2,
  Activity
} from "lucide-react";
import { useState } from "react";
import { AnalysisWidget } from "@/components/analytics/AnalysisWidget";

export default function Index() {
  const { user } = useAuth();
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: "AI Research Copilot",
      description: "Generate comprehensive PDF reports with advanced financial analysis, real-time data integration, and statistical rigor.",
      highlights: ["Chain-of-thought reasoning", "Real-time market data", "Statistical validation", "PDF report generation"],
      link: "/research",
      featured: true
    },
    {
      icon: <Terminal className="w-6 h-6 text-emerald-600" />,
      title: "Bloomberg Terminal",
      description: "Professional-grade trading terminal with real-time market data, advanced charting, and portfolio management.",
      link: "/terminal"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
      title: "Strategy Library",
      description: "Access proven investment strategies with backtesting, optimization, and performance analytics.",
      link: "/strategies"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      title: "Investment Community",
      description: "Connect with professional investors, share insights, and collaborate on investment strategies.",
      link: "/community"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />
      
      {/* Analysis Widget */}
      <AnalysisWidget
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        selectedSymbol={selectedSymbol}
        onSymbolSelect={setSelectedSymbol}
      />
      
      {/* Hero Section with Wall Street Background */}
      <div className="relative overflow-hidden">
        {/* Wall Street Background Image - Normal brightness */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/baf93fd5-edaa-4822-8ff5-bd9d7ee8b15a.png')`,
          }}
        />
        
        {/* Lighter overlay for better text visibility */}
        <div className="absolute inset-0 bg-white/40" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-slate-900/90 rounded-xl backdrop-blur-sm border border-white/20 shadow-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-slate-900">
                  QuantVerse
                </h1>
                <p className="text-lg text-slate-800 font-semibold">Financial Intelligence Platform</p>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
              Professional Financial Research
              <span className="block text-slate-800">
                Powered by AI
              </span>
            </h2>
            <p className="text-lg text-slate-800 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
              Generate institutional-quality research reports, analyze markets with Bloomberg-grade tools, 
              and connect with professional investors on Wall Street's most advanced AI platform.
            </p>

            <div className="flex justify-center gap-4 mb-10">
              {!user ? (
                <>
                  <Link to="/login">
                    <Button size="lg" className="bg-slate-900 hover:bg-black text-white font-bold px-8 py-3 text-base shadow-xl transform hover:scale-105 transition-all duration-200">
                      <Brain className="w-5 h-5 mr-2" />
                      Start Trading
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="px-8 py-3 text-base border-2 border-slate-800 text-slate-900 hover:bg-slate-100 bg-white/60 backdrop-blur-sm shadow-lg font-semibold">
                    Watch Demo
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/research">
                    <Button size="lg" className="bg-slate-900 hover:bg-black text-white font-bold px-8 py-3 text-base shadow-xl transform hover:scale-105 transition-all duration-200">
                      <Brain className="w-5 h-5 mr-2" />
                      AI Research Lab
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-8 py-3 text-base border-2 border-slate-800 text-slate-900 hover:bg-slate-100 bg-white/60 backdrop-blur-sm shadow-lg font-semibold"
                    onClick={() => setIsAnalysisOpen(true)}
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Analysis Terminal
                  </Button>
                </>
              )}
            </div>

            {user && (
              <div className="flex justify-center">
                <Button 
                  onClick={() => setIsAnalysisOpen(true)}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-6 py-2 shadow-xl transform hover:scale-105 transition-all duration-200 backdrop-blur-sm"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  LIVE ANALYSIS LAB
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured AI Research Copilot Section */}
      <div className="relative bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Advanced AI Research Platform
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Generate institutional-quality research reports with Bloomberg-grade analysis, 
              real-time Wall Street data, and comprehensive risk assessment.
            </p>
          </div>

          <Card className="border border-slate-300 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-slate-50/90 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 rounded-xl border border-white/20 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-slate-800">AI Research Copilot</CardTitle>
                  <CardDescription className="text-lg text-slate-600">
                    Wall Street-grade analysis with CREATE framework
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800">Key Capabilities</h3>
                  <div className="space-y-3">
                    {[
                      { icon: <Globe className="w-5 h-5 text-blue-600" />, text: "Real-time market data integration" },
                      { icon: <Database className="w-5 h-5 text-emerald-600" />, text: "Statistical rigor with data validation" },
                      { icon: <FileText className="w-5 h-5 text-purple-600" />, text: "Professional PDF report generation" },
                      { icon: <Target className="w-5 h-5 text-amber-600" />, text: "Risk assessment and recommendations" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-sm">
                        {item.icon}
                        <span className="text-slate-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800">CREATE Framework</h3>
                  <div className="space-y-2">
                    {[
                      "Character: Expert analyst targeting",
                      "Request: Specific query breakdown", 
                      "Examples: Analogous case studies",
                      "Adjustments: Custom constraints",
                      "Type: Professional PDF format",
                      "Extras: Advanced metrics & analysis"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-slate-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-slate-200">
                <div className="flex justify-center">
                  <Link to="/research">
                    <Button size="lg" className="bg-slate-900 hover:bg-black text-white font-bold px-8 py-3 text-base shadow-lg transform hover:scale-105 transition-all duration-200">
                      <Brain className="w-5 h-5 mr-2" />
                      Launch AI Research Platform
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative bg-slate-100/95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Complete Wall Street Platform
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need for professional financial analysis and investment management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.slice(1).map((feature, index) => (
              <Card key={index} className="bg-white/90 border border-slate-200 hover:border-slate-400 transition-all duration-300 hover:shadow-lg backdrop-blur-sm transform hover:scale-105 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-slate-100 rounded-lg border border-slate-200 shadow-sm">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg text-slate-800">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-slate-600 text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={feature.link}>
                    <Button variant="outline" className="w-full border-slate-400 text-slate-800 hover:bg-slate-100 backdrop-blur-sm shadow-sm font-semibold">
                      Explore Platform
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-slate-50 backdrop-blur-sm border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Ready to Transform Your Investment Research?
          </h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Join thousands of professional investors using AI-powered Wall Street analysis.
          </p>
          {!user ? (
            <Link to="/login">
              <Button size="lg" className="bg-slate-900 hover:bg-black text-white font-bold px-8 py-3 text-base shadow-lg transform hover:scale-105 transition-all duration-200">
                <Building2 className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
          ) : (
            <Link to="/research">
              <Button size="lg" className="bg-slate-900 hover:bg-black text-white font-bold px-8 py-3 text-base shadow-lg transform hover:scale-105 transition-all duration-200">
                <Brain className="w-5 h-5 mr-2" />
                Generate Your First Report
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
