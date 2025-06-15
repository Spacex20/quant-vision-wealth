import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Download, FileText } from "lucide-react";

interface SummaryReportProps {
  portfolio: any; // Portfolio type is flexible for now
  onDownloadJSON: () => void;
}

export function SummaryReport({ portfolio, onDownloadJSON }: SummaryReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { backgroundColor: "#fff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth() - 20;
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;
    pdf.text("Portfolio Summary Report", 10, 15);
    pdf.addImage(imgData, "PNG", 10, 20, pageWidth, imgHeight);
    pdf.save(`${portfolio.name || "portfolio"}-summary.pdf`);
  };

  // [Summary stats]
  const stats = [
    { label: "Value", value: `$${(portfolio.total_value || 0).toLocaleString()}` },
    { label: "Assets", value: (portfolio.assets?.length || 0).toString() },
    { label: "Updated", value: portfolio.updated_at ? new Date(portfolio.updated_at).toLocaleDateString() : "N/A" },
  ];
  
  return (
    <Collapsible defaultOpen>
      <div className="mb-2 flex items-center justify-between">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="text-base px-2">Summary Report</Button>
        </CollapsibleTrigger>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={downloadPDF}>
            <FileText className="w-4 h-4 mr-2" /> Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={onDownloadJSON}>
            <Download className="w-4 h-4 mr-2" /> Export JSON
          </Button>
        </div>
      </div>
      <CollapsibleContent>
        <div ref={reportRef}>
          <Card className="mb-2">
            <CardHeader>
              <CardTitle>{portfolio.name}</CardTitle>
              <CardDescription>{portfolio.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-3">
                {stats.map(s =>
                  <div key={s.label} className="flex flex-col items-center bg-secondary p-3 rounded-md min-w-[80px]">
                    <span className="font-bold text-lg text-foreground">{s.value}</span>
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="font-semibold">Top Holdings:</div>
                <ul className="text-sm ml-2">
                  {(portfolio.assets || []).slice(0, 5).map((a: any) => (
                    <li key={a.symbol}>{a.name} ({a.symbol}): {a.allocation}%</li>
                  ))}
                </ul>
              </div>
              {/* Could add chart screenshots here */}
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
