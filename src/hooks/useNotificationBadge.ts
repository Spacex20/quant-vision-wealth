
import { useState, useEffect } from 'react';

export const useNotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock implementation - in a real app this would connect to actual notifications
  useEffect(() => {
    // Simulate some unread notifications
    setUnreadCount(3);
  }, []);

  return { unreadCount };
};
