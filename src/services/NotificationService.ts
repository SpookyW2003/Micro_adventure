interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export interface AdventureNotification {
  id: string;
  title: string;
  message: string;
  type: 'welcome' | 'reminder' | 'achievement' | 'nearby' | 'weather';
  icon?: string;
  badge?: string;
  data?: any;
}

export class NotificationService {
  private static instance: NotificationService;
  
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Get current permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return { granted: false, denied: true, default: false };
    }

    const permission = Notification.permission;
    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default'
    };
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Notifications not supported in this browser');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Notification permission denied');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Show a simple notification
   */
  async showNotification(notification: AdventureNotification): Promise<boolean> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      console.warn('Cannot show notification: permission not granted');
      return false;
    }

    try {
      const notif = new Notification(notification.title, {
        body: notification.message,
        icon: notification.icon || '/favicon.ico',
        badge: notification.badge || '/favicon.ico',
        tag: notification.id,
        data: notification.data,
        requireInteraction: notification.type === 'reminder',
        silent: false,
      });

      // Auto-close after 5 seconds (except for reminders)
      if (notification.type !== 'reminder') {
        setTimeout(() => {
          notif.close();
        }, 5000);
      }

      // Handle clicks
      notif.onclick = (event) => {
        event.preventDefault();
        window.focus();
        notif.close();
        
        // Handle different notification types
        if (notification.data?.url) {
          window.location.href = notification.data.url;
        }
      };

      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  /**
   * Show welcome notification when user first visits the adventure map
   */
  async showWelcomeNotification(): Promise<void> {
    const notification: AdventureNotification = {
      id: 'welcome-adventure',
      title: '🗺️ Welcome to Adventure Map!',
      message: 'Discover amazing micro-adventures in your area. Enable location for personalized recommendations!',
      type: 'welcome',
      data: { url: '/adventure-map' }
    };

    await this.showNotification(notification);
  }

  /**
   * Show location-enabled notification
   */
  async showLocationEnabledNotification(): Promise<void> {
    const notification: AdventureNotification = {
      id: 'location-enabled',
      title: '📍 Location Enabled!',
      message: 'Great! We can now show you adventures near your location.',
      type: 'achievement'
    };

    await this.showNotification(notification);
  }

  /**
   * Show nearby adventure notification
   */
  async showNearbyAdventureNotification(adventureName: string, distance: number): Promise<void> {
    const notification: AdventureNotification = {
      id: 'nearby-adventure',
      title: '🎯 Adventure Nearby!',
      message: `"${adventureName}" is only ${distance.toFixed(1)}km away. Perfect for your next micro-adventure!`,
      type: 'nearby',
      data: { adventureName, distance }
    };

    await this.showNotification(notification);
  }

  /**
   * Show adventure started notification
   */
  async showAdventureStartedNotification(adventureName: string): Promise<void> {
    const notification: AdventureNotification = {
      id: 'adventure-started',
      title: '🚀 Adventure Started!',
      message: `Your "${adventureName}" adventure has begun. Have fun exploring!`,
      type: 'reminder'
    };

    await this.showNotification(notification);
  }

  /**
   * Show achievement notification
   */
  async showAchievementNotification(title: string, message: string): Promise<void> {
    const notification: AdventureNotification = {
      id: `achievement-${Date.now()}`,
      title: `🏆 ${title}`,
      message,
      type: 'achievement'
    };

    await this.showNotification(notification);
  }

  /**
   * Check if this is the user's first visit to the adventure map
   */
  isFirstVisit(): boolean {
    return !localStorage.getItem('adventure-map-visited');
  }

  /**
   * Mark that user has visited the adventure map
   */
  markVisited(): void {
    localStorage.setItem('adventure-map-visited', 'true');
    localStorage.setItem('adventure-map-first-visit', new Date().toISOString());
  }

  /**
   * Get user's adventure statistics
   */
  getAdventureStats(): {
    totalVisits: number;
    adventuresStarted: number;
    locationsVisited: number;
    lastVisit: string | null;
  } {
    const stats = localStorage.getItem('adventure-stats');
    if (stats) {
      return JSON.parse(stats);
    }
    
    return {
      totalVisits: 0,
      adventuresStarted: 0,
      locationsVisited: 0,
      lastVisit: null
    };
  }

  /**
   * Update adventure statistics
   */
  updateAdventureStats(update: {
    visit?: boolean;
    adventureStarted?: boolean;
    locationVisited?: boolean;
  }): void {
    const stats = this.getAdventureStats();
    
    if (update.visit) {
      stats.totalVisits += 1;
      stats.lastVisit = new Date().toISOString();
    }
    
    if (update.adventureStarted) {
      stats.adventuresStarted += 1;
    }
    
    if (update.locationVisited) {
      stats.locationsVisited += 1;
    }
    
    localStorage.setItem('adventure-stats', JSON.stringify(stats));
  }

  /**
   * Schedule daily adventure reminder (if supported)
   */
  async scheduleAdventureReminder(): Promise<void> {
    // This would typically use service workers for background notifications
    // For now, we'll just show a simple reminder setup notification
    const notification: AdventureNotification = {
      id: 'reminder-setup',
      title: '🔔 Reminders Enabled!',
      message: 'We\'ll remind you about new adventures and nearby discoveries.',
      type: 'reminder'
    };

    await this.showNotification(notification);
  }

  /**
   * Clear all notifications for this app
   */
  clearAllNotifications(): void {
    // This would clear service worker notifications in a real implementation
    console.log('Clearing all adventure notifications');
  }
}

export const notificationService = NotificationService.getInstance();
