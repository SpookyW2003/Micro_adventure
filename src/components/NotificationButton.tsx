import React from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationButtonProps {
  className?: string;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({ className = '' }) => {
  const {
    supported,
    permission,
    requestPermission,
    showWelcome,
    showAchievement
  } = useNotifications();

  const handleNotificationClick = async () => {
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (granted) {
        await showWelcome();
      }
    } else {
      // Show a demo achievement notification
      await showAchievement(
        'Notification Test',
        'Your push notifications are working perfectly! 🎉'
      );
    }
  };

  if (!supported) {
    return null;
  }

  return (
    <button
      onClick={handleNotificationClick}
      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        permission === 'granted'
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : permission === 'denied'
          ? 'bg-red-100 text-red-700 cursor-not-allowed'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      } ${className}`}
      disabled={permission === 'denied'}
      title={
        permission === 'granted'
          ? 'Test notifications'
          : permission === 'denied'
          ? 'Notifications blocked - enable in browser settings'
          : 'Enable push notifications'
      }
    >
      {permission === 'granted' ? (
        <Bell className="h-4 w-4" />
      ) : (
        <BellOff className="h-4 w-4" />
      )}
      <span>
        {permission === 'granted'
          ? 'Test Notification'
          : permission === 'denied'
          ? 'Notifications Blocked'
          : 'Enable Notifications'
        }
      </span>
    </button>
  );
};
