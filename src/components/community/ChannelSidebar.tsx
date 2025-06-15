
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Hash, ChevronDown } from "lucide-react";
import CreateChannelDialog from "./CreateChannelDialog";
import { JoinChannelDialog } from "./JoinChannelDialog";
import { ChannelInviteManager } from "./ChannelInviteManager";

interface Props {
  channels: any[];
  activeChannel: string;
  onChannelSelect: (id: string) => void;
  loadChannels: () => void;
}

export function ChannelSidebar({ channels, activeChannel, onChannelSelect, loadChannels }: Props) {
  const [showDM, setShowDM] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b flex items-center gap-2">
        <ChevronDown className="w-4 h-4" />
        <span className="font-bold text-md flex-1">Community</span>
      </div>

      {/* Main Buttons: Create Channel */}
      <div className="p-2 flex gap-2">
        <CreateChannelDialog onChannelCreated={loadChannels} />
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto px-1">
        <div>
          <h4 className="font-semibold text-xs mb-1">Channels</h4>
          {channels.map(channel => (
            <Button
              key={channel.id}
              variant={activeChannel === channel.id ? "secondary" : "ghost"}
              onClick={() => onChannelSelect(channel.id)}
              className={`w-full justify-start text-xs mb-0.5 ${channel.is_dm ? "opacity-70 italic" : ""}`}
            >
              {channel.is_dm ? <Mail className="w-3 h-3 mr-1" /> : <Hash className="w-3 h-3 mr-1" />}
              {channel.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Sidebar Bottom Section: Invites, Join, DMs */}
      <div className="p-2 border-t flex flex-col gap-2">
        <div>
          <h4 className="font-semibold text-xs mb-1">Channel Actions</h4>
          <ChannelInviteManager />
          <JoinChannelDialog onJoined={loadChannels} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDM((s) => !s)}
          className="mt-1"
        >
          <Mail className="w-4 h-4" />
          <span className="ml-2">Direct Messages</span>
        </Button>
      </div>
    </div>
  );
}

