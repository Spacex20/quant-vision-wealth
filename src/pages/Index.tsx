
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
      icon: <Brain className="w-8 h-8 text-blue-400" />,
      title: "AI Research Copilot",
      description: "Generate comprehensive PDF reports with advanced financial analysis, real-time data integration, and statistical rigor.",
      highlights: ["Chain-of-thought reasoning", "Real-time market data", "Statistical validation", "PDF report generation"],
      link: "/research",
      featured: true
    },
    {
      icon: <Terminal className="w-6 h-6 text-emerald-400" />,
      title: "Bloomberg Terminal",
      description: "Professional-grade trading terminal with real-time market data, advanced charting, and portfolio management.",
      link: "/terminal"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
      title: "Strategy Library",
      description: "Access proven investment strategies with backtesting, optimization, and performance analytics.",
      link: "/strategies"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      title: "Investment Community",
      description: "Connect with professional investors, share insights, and collaborate on investment strategies.",
      link: "/community"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
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
        {/* Wall Street Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/28d28b0f-debf-4eed-82f2-28eb42a09799.png')`,
            filter: 'brightness(0.3) contrast(1.2)',
          }}
        />
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-gray-900/85 to-black/90" />
        
        {/* Financial data pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-blue-400/30">
                <Building2 className="w-12 h-12 text-blue-400" />
              </div>
              <div className="text-left">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  FinanceAI
                </h1>
                <p className="text-xl text-gray-300 font-medium">Wall Street Intelligence Platform</p>
              </div>
            </div>
            
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Professional Financial Research
              <span className="block text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text">
                Powered by AI
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              Generate institutional-quality research reports, analyze markets with Bloomberg-grade tools, 
              and connect with professional investors on Wall Street's most advanced AI platform.
            </p>

            <div className="flex justify-center gap-6 mb-12">
              {!user ? (
                <>
                  <Link to="/login">
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-10 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-200">
                      <Brain className="w-5 h-5 mr-2" />
                      Start Trading
                      <Zap className="w-4 h-4 ml-2 animate-pulse" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="px-10 py-4 text-lg border-2 border-blue-400/50 text-blue-400 hover:bg-blue-400/10 backdrop-blur-sm">
                    Watch Demo
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/research">
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-10 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-200">
                      <Brain className="w-5 h-5 mr-2" />
                      AI Research Lab
                      <Zap className="w-4 h-4 ml-2 animate-pulse" />
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-10 py-4 text-lg border-2 border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10 backdrop-blur-sm"
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
                  className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold px-8 py-3 border-2 border-amber-400/50 shadow-2xl transform hover:scale-105 transition-all duration-200 backdrop-blur-sm"
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
      <div className="relative bg-gradient-to-br from-slate-900/95 to-gray-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Advanced AI Research Platform
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Generate institutional-quality research reports with Bloomberg-grade analysis, 
              real-time Wall Street data, and comprehensive risk assessment.
            </p>
          </div>

          <Card className="border-2 border-blue-400/30 shadow-2xl bg-slate-800/50 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-slate-800/80 to-gray-800/80 border-b border-blue-400/30">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-400/30">
                  <Brain className="w-10 h-10 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-white">AI Research Copilot</CardTitle>
                  <CardDescription className="text-xl text-gray-300">
                    Wall Street-grade analysis with CREATE framework
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-white">Key Capabilities</h3>
                  <div className="space-y-4">
                    {[
                      { icon: <Globe className="w-6 h-6 text-blue-400" />, text: "Real-time market data integration" },
                      { icon: <Database className="w-6 h-6 text-emerald-400" />, text: "Statistical rigor with data validation" },
                      { icon: <FileText className="w-6 h-6 text-purple-400" />, text: "Professional PDF report generation" },
                      { icon: <Target className="w-6 h-6 text-amber-400" />, text: "Risk assessment and recommendations" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-slate-700/30 border border-gray-600/30">
                        {item.icon}
                        <span className="text-gray-200 text-lg">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-white">CREATE Framework</h3>
                  <div className="space-y-3">
                    {[
                      "Character: Expert analyst targeting",
                      "Request: Specific query breakdown", 
                      "Examples: Analogous case studies",
                      "Adjustments: Custom constraints",
                      "Type: Professional PDF format",
                      "Extras: Advanced metrics & analysis"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/20">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-600/30">
                <div className="flex justify-center">
                  <Link to="/research">
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-10 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-200">
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
      <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Complete Wall Street Platform
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need for professional financial analysis and investment management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.slice(1).map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border border-gray-600/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl backdrop-blur-sm transform hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-slate-700/50 to-gray-700/50 rounded-xl border border-gray-600/30">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={feature.link}>
                    <Button variant="outline" className="w-full border-blue-400/50 text-blue-400 hover:bg-blue-400/10 backdrop-blur-sm">
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
      <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-emerald-600/20 backdrop-blur-sm border-t border-blue-400/30">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Investment Research?
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Join thousands of professional investors using AI-powered Wall Street analysis.
          </p>
          {!user ? (
            <Link to="/login">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 font-bold px-10 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-200">
                <Building2 className="w-6 h-6 mr-3" />
                Start Free Trial
              </Button>
            </Link>
          ) : (
            <Link to="/research">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 font-bold px-10 py-4 text-lg shadow-2xl transform hover:scale-105 transition-all duration-200">
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
