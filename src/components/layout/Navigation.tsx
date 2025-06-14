
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PieChart, TrendingUp, Calculator, BookOpen, BarChart } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: "overview", label: "Overview", icon: PieChart },
    { id: "builder", label: "Builder", icon: TrendingUp },
    { id: "value-tools", label: "Value Tools", icon: Calculator },
    { id: "simulator", label: "Simulator", icon: BarChart },
    { id: "education", label: "Education", icon: BookOpen },
  ];

  return (
    <Card className="p-4 mb-6">
      <div className="flex space-x-2 overflow-x-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "outline"}
            onClick={() => onTabChange(item.id)}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};
