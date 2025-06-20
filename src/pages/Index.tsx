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
  Shield, 
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      {/* Analysis Widget */}
      <AnalysisWidget
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        selectedSymbol={selectedSymbol}
        onSymbolSelect={setSelectedSymbol}
      />
      
      {/* Hero Section with Enhanced Wall Street Background */}
      <div className="relative overflow-hidden">
        {/* Enhanced Wall Street Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/baf93fd5-edaa-4822-8ff5-bd9d7ee8b15a.png')`,
            filter: 'brightness(1.3) contrast(1.15) saturate(1.1)',
          }}
        />
        
        {/* Lighter gradient overlay for better text visibility while keeping image prominent */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-slate-50/20 to-blue-50/25" />
        
        {/* Financial data pattern overlay - very subtle */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-slate-800/95 to-blue-900/95 rounded-2xl backdrop-blur-md border-2 border-white/40 shadow-2xl">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-6xl font-bold text-slate-900 drop-shadow-lg">
                  QuantVerse
                </h1>
                <p className="text-xl text-slate-800 font-semibold drop-shadow-md">Wall Street Intelligence Platform</p>
              </div>
            </div>
            
            <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight drop-shadow-lg">
              Professional Financial Research
              <span className="block text-slate-800 drop-shadow-md">
                Powered by AI
              </span>
            </h2>
            <p className="text-xl text-slate-800 mb-10 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-sm">
              Generate institutional-quality research reports, analyze markets with Bloomberg-grade tools, 
              and connect with professional investors on Wall Street's most advanced AI platform.
            </p>

            <div className="flex justify-center gap-6 mb-12">
              {!user ? (
                <>
                  <Link to="/login">
                    <Button size="lg" className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold px-10 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 border-white/30 backdrop-blur-sm">
                      <Brain className="w-5 h-5 mr-2" />
                      Start Trading
                      <Zap className="w-4 h-4 ml-2 animate-pulse" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="px-10 py-4 text-lg border-2 border-slate-800 text-slate-900 hover:bg-slate-100/80 backdrop-blur-md shadow-xl font-semibold bg-white/40">
                    Watch Demo
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/research">
                    <Button size="lg" className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold px-10 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 border-white/30 backdrop-blur-sm">
                      <Brain className="w-5 h-5 mr-2" />
                      AI Research Lab
                      <Zap className="w-4 h-4 ml-2 animate-pulse" />
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-10 py-4 text-lg border-2 border-slate-800 text-slate-900 hover:bg-slate-100/80 backdrop-blur-md shadow-xl font-semibold bg-white/40"
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
                  className="bg-gradient-to-r from-slate-800 to-blue-900 hover:from-slate-900 hover:to-blue-800 text-white font-bold px-8 py-3 border-2 border-white/40 shadow-2xl transform hover:scale-105 transition-all duration-200 backdrop-blur-md"
                >
                  <Activity className="w-5 h-5 mr-2 animate-pulse" />
                  LIVE ANALYSIS LAB
                  <Zap className="w-4 h-4 ml-2 animate-pulse" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured AI Research Copilot Section */}
      <div className="relative bg-gradient-to-br from-white/95 to-slate-100/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Advanced AI Research Platform
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Generate institutional-quality research reports with Bloomberg-grade analysis, 
              real-time Wall Street data, and comprehensive risk assessment.
            </p>
          </div>

          <Card className="border-2 border-slate-300/50 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-slate-100/90 to-blue-100/90 border-b border-slate-300/50">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-gradient-to-br from-slate-800/95 to-blue-900/95 rounded-2xl border-2 border-white/30 shadow-xl">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-slate-800">AI Research Copilot</CardTitle>
                  <CardDescription className="text-xl text-slate-600">
                    Wall Street-grade analysis with CREATE framework
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-slate-800">Key Capabilities</h3>
                  <div className="space-y-4">
                    {[
                      { icon: <Globe className="w-6 h-6 text-blue-600" />, text: "Real-time market data integration" },
                      { icon: <Database className="w-6 h-6 text-emerald-600" />, text: "Statistical rigor with data validation" },
                      { icon: <FileText className="w-6 h-6 text-purple-600" />, text: "Professional PDF report generation" },
                      { icon: <Target className="w-6 h-6 text-amber-600" />, text: "Risk assessment and recommendations" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50/80 border border-slate-200/50 shadow-sm">
                        {item.icon}
                        <span className="text-slate-700 text-lg">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-slate-800">CREATE Framework</h3>
                  <div className="space-y-3">
                    {[
                      "Character: Expert analyst targeting",
                      "Request: Specific query breakdown", 
                      "Examples: Analogous case studies",
                      "Adjustments: Custom constraints",
                      "Type: Professional PDF format",
                      "Extras: Advanced metrics & analysis"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50/70 border border-slate-200/30">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span className="text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-slate-200/50">
                <div className="flex justify-center">
                  <Link to="/research">
                    <Button size="lg" className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold px-10 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200">
                      <Brain className="w-6 h-6 mr-3" />
                      Launch AI Research Platform
                      <Zap className="w-5 h-5 ml-3 animate-pulse" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative bg-gradient-to-br from-slate-100/95 to-blue-50/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Complete Wall Street Platform
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need for professional financial analysis and investment management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.slice(1).map((feature, index) => (
              <Card key={index} className="bg-white/90 border border-slate-200/50 hover:border-slate-400/50 transition-all duration-300 hover:shadow-2xl backdrop-blur-sm transform hover:scale-105 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-slate-100/90 to-blue-100/90 rounded-xl border border-slate-200/50 shadow-sm">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-slate-800">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-slate-600 text-base leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={feature.link}>
                    <Button variant="outline" className="w-full border-slate-400/50 text-slate-800 hover:bg-slate-100 backdrop-blur-sm shadow-sm font-semibold">
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
      <div className="relative bg-gradient-to-r from-slate-100/90 via-blue-100/90 to-slate-100/90 backdrop-blur-sm border-t border-slate-200/50">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-slate-800 mb-6">
            Ready to Transform Your Investment Research?
          </h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Join thousands of professional investors using AI-powered Wall Street analysis.
          </p>
          {!user ? (
            <Link to="/login">
              <Button size="lg" className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold px-10 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-200">
                <Building2 className="w-6 h-6 mr-3" />
                Start Free Trial
              </Button>
            </Link>
          ) : (
            <Link to="/research">
              <Button size="lg" className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white font-bold px-10 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-200">
                <Brain className="w-6 h-6 mr-3" />
                Generate Your First Report
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
