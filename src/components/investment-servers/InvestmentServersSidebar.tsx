import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, LogIn } from "lucide-react";
import { CreateInvestmentServerDialog } from "./dialogs/CreateInvestmentServerDialog";
import { JoinPublicServerDialog } from "./dialogs/JoinPublicServerDialog";

interface Props {
  servers: any[];
  activeServerId: string;
  setActiveServerId: (id: string) => void;
  onRefresh: () => void;
}

export function InvestmentServersSidebar({ servers, activeServerId, setActiveServerId, onRefresh }: any) {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b flex items-center gap-2">
        <span className="font-bold text-md flex-1">Investment Servers</span>
        <Button variant="ghost" size="icon" onClick={() => setShowCreate(true)}><Plus /></Button>
      </div>
      {/* User's servers */}
      <div className="flex-1 px-2 pt-2 overflow-y-auto">
        <h4 className="font-semibold text-xs mb-2">Your Servers</h4>
        {servers.length ? (
          servers.map((server: any) => (
            <Button
              key={server.id}
              variant={activeServerId === server.id ? "secondary" : "ghost"}
              onClick={() => setActiveServerId(server.id)}
              className="w-full justify-start text-xs mb-1"
            >
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{ background: server.color || "#bbb" }}
              />
              {server.icon_url && (
                <img src={server.icon_url} alt="icon" className="inline-block w-4 h-4 mr-2 rounded-full object-cover" />
              )}
              {server.name}{" "}
              {Array.isArray(server.category_tags) && server.category_tags.length > 0 && (
                <span className="ml-2 text-muted-foreground text-[10px]">
                  [{server.category_tags.slice(0,2).join(", ")}{server.category_tags.length>2 ? "…" : ""}]
                </span>
              )}
            </Button>
          ))
        ) : (
          <div className="text-xs text-muted-foreground my-4">You haven't joined any servers yet.</div>
        )}
      </div>
      {/* Actions */}
      <div className="p-2 border-t flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => setShowJoin(true)}>
          <LogIn className="w-4 h-4 mr-1" /> Join Server
        </Button>
        <Button variant="default" size="icon" onClick={() => setShowCreate(true)}>
          <Plus />
        </Button>
      </div>
      {/* Dialogs */}
      <CreateInvestmentServerDialog open={showCreate} setOpen={setShowCreate} onCreated={onRefresh} />
      <JoinPublicServerDialog open={showJoin} setOpen={setShowJoin} onJoined={onRefresh} />
    </div>
  );
}
