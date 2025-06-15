
import { Card, CardContent } from "@/components/ui/card";

export function ServerAboutPanel({ server }: { server: any }) {
  if (!server) return null;
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center gap-3 mb-2">
          {server.icon_url && (
            <img src={server.icon_url} alt="icon" className="w-8 h-8 rounded-full object-cover" />
          )}
          <div>
            <div className="font-bold text-lg">{server.name}</div>
            {server.category_tags && server.category_tags.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {server.category_tags.join(", ")}
              </div>
            )}
            <div className="text-xs text-muted-foreground italic">{server.visibility?.replace("-", " ")}</div>
          </div>
        </div>
        {server.description && (
          <div className="mb-2 text-sm">{server.description}</div>
        )}
        {server.rules && (
          <details className="mb-2">
            <summary className="cursor-pointer font-semibold text-xs text-blue-500">Rules</summary>
            <div className="text-xs whitespace-pre-line">{server.rules}</div>
          </details>
        )}
        {server.guidelines && (
          <details>
            <summary className="cursor-pointer font-semibold text-xs text-purple-500">Guidelines</summary>
            <div className="text-xs whitespace-pre-line">{server.guidelines}</div>
          </details>
        )}
      </CardContent>
    </Card>
  );
}
