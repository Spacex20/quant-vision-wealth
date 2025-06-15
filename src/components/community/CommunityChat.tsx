
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { EnhancedChatPanel } from './EnhancedChatPanel';
import { EmptyState } from '@/components/common/EmptyState';

interface Channel {
  id: string;
  name: string;
  description?: string;
  category: string;
  is_private: boolean;
}

export function CommunityChat() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [newChannelName, setNewChannelName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .eq('is_private', false)
        .order('category', { ascending: true })
        .order('position', { ascending: true });

      if (error) throw error;

      setChannels(data || []);
      
      // Auto-select first channel if available
      if (data && data.length > 0 && !selectedChannel) {
        setSelectedChannel(data[0]);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createChannel = async () => {
    if (!newChannelName.trim() || !user) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('channels')
        .insert({
          name: newChannelName.trim(),
          category: 'General',
          is_private: false
        })
        .select()
        .single();

      if (error) throw error;

      setChannels(prev => [...prev, data]);
      setNewChannelName('');
      setSelectedChannel(data);
    } catch (error) {
      console.error('Error creating channel:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        <Card className="animate-pulse">
          <CardContent className="p-4">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 animate-pulse">
          <CardContent className="p-4">
            <div className="h-full bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
      {/* Channel Sidebar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Create new channel */}
          {user && (
            <div className="space-y-2">
              <Input
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="Channel name..."
                className="text-sm"
                onKeyPress={(e) => e.key === 'Enter' && createChannel()}
              />
              <Button 
                onClick={createChannel}
                disabled={!newChannelName.trim() || isCreating}
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Channel
              </Button>
            </div>
          )}

          {/* Channel list */}
          <div className="space-y-1">
            {channels.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No channels yet</p>
              </div>
            ) : (
              channels.map((channel) => (
                <Button
                  key={channel.id}
                  variant={selectedChannel?.id === channel.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setSelectedChannel(channel)}
                >
                  <Hash className="w-4 h-4 mr-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{channel.name}</div>
                    {channel.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {channel.description}
                      </div>
                    )}
                  </div>
                  {channel.is_private && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Private
                    </Badge>
                  )}
                </Button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Panel */}
      <div className="lg:col-span-3">
        {selectedChannel ? (
          <EnhancedChatPanel 
            channelId={selectedChannel.id} 
            channelName={selectedChannel.name}
          />
        ) : (
          <Card className="h-full">
            <CardContent className="h-full flex items-center justify-center">
              <EmptyState
                icon={Hash}
                title="No Channel Selected"
                description="Select a channel from the sidebar to start chatting with the community."
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
