
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

type StockResult = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  volume?: number;
};

type Props = {
  data: StockResult[];
};

type ColKey = keyof Omit<StockResult, "sector" | "name" | "symbol"> | "symbol" | "sector" | "name";

const columns: { key: ColKey; label: string }[] = [
  { key: "symbol", label: "Symbol" },
  { key: "name", label: "Name" },
  { key: "sector", label: "Sector" },
  { key: "price", label: "Price" },
  { key: "marketCap", label: "Market Cap (B)" },
  { key: "peRatio", label: "P/E Ratio" },
  { key: "dividendYield", label: "Div. Yield (%)" },
  { key: "volume", label: "Volume" },
];

function downloadCSV(rows: StockResult[]) {
  const header = columns.map(c => `"${c.label}"`).join(",");
  const outRows = rows.map(row =>
    columns.map(col => {
      let value = row[col.key];
      if (col.key === "marketCap") value = (value as number / 1e9).toFixed(2);
      if (col.key === "dividendYield") value = (value as number).toFixed(2);
      if (col.key === "price") value = (value as number).toFixed(2);
      return `"${value ?? ""}"`;
    }).join(",")
  );
  const csvContent = [header, ...outRows].join("\n");
  const filename = `stock-screener-results-${Date.now()}.csv`;
  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export function StockScreenerResultsTable({ data }: Props) {
  const [sortCol, setSortCol] = useState<ColKey>("symbol");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  if (!data.length) return <div className="text-muted-foreground text-center py-6">No matching stocks found.</div>;

  const sorted = [...data].sort((a, b) => {
    const va = a[sortCol] ?? "";
    const vb = b[sortCol] ?? "";
    if (typeof va === "number" && typeof vb === "number") {
      return sortDir === "asc" ? va - vb : vb - va;
    }
    return sortDir === "asc"
      ? String(va).localeCompare(String(vb))
      : String(vb).localeCompare(String(va));
  });

  return (
    <div className="relative mt-4 border rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 flex items-center gap-1"
        onClick={() => downloadCSV(sorted)}
      >
        <FileText className="w-4 h-4" />
        Export CSV
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead
                key={col.key}
                onClick={() => {
                  setSortCol(col.key);
                  setSortDir(dir => dir === "asc" ? "desc" : "asc");
                }}
                className="cursor-pointer hover:text-primary whitespace-nowrap"
              >
                {col.label}
                {sortCol === col.key && (
                  <span className="ml-1 text-xs">{sortDir === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map(r => (
            <TableRow key={r.symbol}>
              {columns.map(col => (
                <TableCell key={col.key}>
                  {col.key === "marketCap"
                    ? (r.marketCap / 1e9).toFixed(2)
                    : col.key === "dividendYield"
                    ? r.dividendYield?.toFixed(2)
                    : col.key === "price"
                    ? r.price?.toFixed(2)
                    : r[col.key as keyof StockResult]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

