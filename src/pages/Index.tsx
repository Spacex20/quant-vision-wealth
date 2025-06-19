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
  Calculator
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
      icon: <Terminal className="w-6 h-6 text-green-600" />,
      title: "Bloomberg Terminal",
      description: "Professional-grade trading terminal with real-time market data, advanced charting, and portfolio management.",
      link: "/terminal"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      title: "Strategy Library",
      description: "Access proven investment strategies with backtesting, optimization, and performance analytics.",
      link: "/strategies"
    },
    {
      icon: <Users className="w-6 h-6 text-orange-600" />,
      title: "Investment Community",
      description: "Connect with professional investors, share insights, and collaborate on investment strategies.",
      link: "/community"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      {/* Analysis Widget */}
      <AnalysisWidget
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        selectedSymbol={selectedSymbol}
        onSymbolSelect={setSelectedSymbol}
      />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FinanceAI
                </h1>
                <p className="text-lg text-gray-600">Professional Investment Platform</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              AI-Powered Financial Research & Analysis
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Generate comprehensive research reports, analyze markets with professional tools, 
              and connect with investment professionals in one powerful platform.
            </p>

            <div className="flex justify-center gap-4 mb-8">
              {!user ? (
                <>
                  <Link to="/login">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3">
                      Get Started Free
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="px-8 py-3">
                    Watch Demo
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/research">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3">
                      <Brain className="w-5 h-5 mr-2" />
                      Start AI Research
                      <Zap className="w-4 h-4 ml-2 animate-pulse" />
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-8 py-3 border-blue-300 text-blue-600 hover:bg-blue-50"
                    onClick={() => setIsAnalysisOpen(true)}
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Open Analysis Lab
                  </Button>
                </>
              )}
            </div>

            {user && (
              <div className="flex justify-center">
                <Button 
                  onClick={() => setIsAnalysisOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold border border-yellow-400 shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  ANALYSIS LAB
                  <Zap className="w-3 h-3 ml-1 animate-pulse" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured AI Research Copilot Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Introducing AI Research Copilot
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate institutional-quality research reports with advanced AI analysis, 
            real-time data integration, and comprehensive risk assessment.
          </p>
        </div>

        <Card className="border-2 border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">AI Research Copilot</CardTitle>
                <CardDescription className="text-lg">
                  High-powered research analyst with CREATE framework
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Key Capabilities</h3>
                <div className="space-y-3">
                  {[
                    { icon: <Globe className="w-5 h-5 text-blue-600" />, text: "Real-time web data integration" },
                    { icon: <Database className="w-5 h-5 text-green-600" />, text: "Statistical rigor with data validation" },
                    { icon: <FileText className="w-5 h-5 text-purple-600" />, text: "Professional PDF report generation" },
                    { icon: <Target className="w-5 h-5 text-orange-600" />, text: "Risk assessment and recommendations" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">CREATE Framework</h3>
                <div className="space-y-2">
                  {[
                    "Character: Expert analyst targeting",
                    "Request: Specific query breakdown", 
                    "Examples: Analogous case studies",
                    "Adjustments: Custom constraints",
                    "Type: Professional PDF format",
                    "Extras: Advanced metrics & analysis"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-center">
                <Link to="/research">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3">
                    <Brain className="w-5 h-5 mr-2" />
                    Try AI Research Copilot
                    <Zap className="w-4 h-4 ml-2 animate-pulse" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Investment Platform
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need for professional financial analysis and investment management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.slice(1).map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  {feature.icon}
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={feature.link}>
                  <Button variant="outline" className="w-full">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Investment Research?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professional investors using AI-powered analysis.
          </p>
          {!user ? (
            <Link to="/login">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3">
                Start Free Trial
              </Button>
            </Link>
          ) : (
            <Link to="/research">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3">
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
