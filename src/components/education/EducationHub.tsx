
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, Clock, TrendingUp } from "lucide-react";

export const EducationHub = () => {
  const courses = [
    {
      title: "Modern Portfolio Theory Fundamentals",
      description: "Learn the basics of risk-return optimization and efficient frontiers",
      duration: "45 min",
      level: "Beginner",
      topics: ["Markowitz Model", "Risk-Return Tradeoff", "Correlation Analysis"]
    },
    {
      title: "Value Investing Masterclass",
      description: "Deep dive into Warren Buffett's investment philosophy",
      duration: "2 hours",
      level: "Intermediate",
      topics: ["DCF Modeling", "Financial Statement Analysis", "Margin of Safety"]
    },
    {
      title: "Quantitative Factor Investing",
      description: "Systematic approaches to factor-based investing",
      duration: "90 min",
      level: "Advanced",
      topics: ["Factor Models", "Risk Attribution", "Performance Attribution"]
    }
  ];

  const concepts = [
    {
      term: "Sharpe Ratio",
      definition: "A measure of risk-adjusted return calculated as (return - risk-free rate) / volatility",
      example: "A Sharpe ratio of 1.5 means you get 1.5 units of return for each unit of risk taken"
    },
    {
      term: "Beta",
      definition: "A measure of how much a stock moves relative to the overall market",
      example: "A beta of 1.2 means the stock moves 20% more than the market on average"
    },
    {
      term: "Alpha",
      definition: "The excess return of an investment relative to the return of a benchmark index",
      example: "An alpha of 3% means the portfolio outperformed its benchmark by 3% annually"
    },
    {
      term: "Maximum Drawdown",
      definition: "The largest peak-to-trough decline in portfolio value over a specific period",
      example: "A 20% max drawdown means the portfolio fell 20% from its highest point"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Investment Education Hub</h2>
        <p className="text-muted-foreground">
          Learn advanced investing concepts with AI-powered explanations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Interactive Courses</span>
            </CardTitle>
            <CardDescription>Structured learning paths for all skill levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {courses.map((course) => (
              <div key={course.title} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{course.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {course.duration}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">{course.level}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {course.topics.map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
                <Button size="sm" className="w-full">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Course
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Key Concepts</span>
            </CardTitle>
            <CardDescription>Quick reference for important investment terms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {concepts.map((concept) => (
              <div key={concept.term} className="p-4 border rounded-lg space-y-2">
                <h4 className="font-medium text-blue-600">{concept.term}</h4>
                <p className="text-sm text-muted-foreground">{concept.definition}</p>
                <div className="p-2 bg-blue-50 rounded text-xs text-blue-800">
                  <strong>Example:</strong> {concept.example}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Investment Tutor</CardTitle>
          <CardDescription>Get personalized explanations and ask questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <strong>AI Insight:</strong> Based on your current portfolio allocation, you might benefit from learning about correlation analysis to understand how your assets interact during market stress.
              </p>
              <Button size="sm" variant="outline">
                Learn About Correlation
              </Button>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 mb-2">
                <strong>Recommended:</strong> Since you're using our DCF calculator frequently, consider learning about sensitivity analysis to understand how changes in assumptions affect valuations.
              </p>
              <Button size="sm" variant="outline">
                Explore Sensitivity Analysis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
