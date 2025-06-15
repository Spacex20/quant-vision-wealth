
import { useState, useCallback, useEffect } from 'react';
import { useRealTimeSubscription } from './useRealTimeSubscription';

interface Message {
  id: string;
  content: string;
  user_id: string;
  channel_id: string;
  created_at: string;
  profiles?: any;
}

export function useRealTimeMessages(channelId: string, initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleNewMessage = useCallback((payload: any) => {
    if (payload.eventType === 'INSERT' && payload.new) {
      const newMessage = payload.new as Message;
      if (newMessage.channel_id === channelId) {
        setMessages(prev => [...prev, newMessage]);
      }
    }
  }, [channelId]);

  useRealTimeSubscription({
    table: 'messages',
    event: 'INSERT',
    filter: `channel_id=eq.${channelId}`,
    onPayload: handleNewMessage,
    enabled: !!channelId
  });

  return { messages, setMessages };
}
