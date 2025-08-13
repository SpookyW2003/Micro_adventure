import { useState, useEffect, useCallback } from 'react';
import { notificationService, AdventureNotification } from '../services/NotificationService';

export interface NotificationState {
  supported: boolean;
  permission: 'granted' | 'denied' | 'default';
  isFirstVisit: boolean;
}

export interface NotificationActions {
  requestPermission: () => Promise<boolean>;
  showWelcome: () => Promise<void>;
  showLocationEnabled: () => Promise<void>;
  showNearbyAdventure: (name: string, distance: number) => Promise<void>;
  showAdventureStarted: (name: string) => Promise<void>;
  showAchievement: (title: string, message: string) => Promise<void>;
  scheduleReminder: () => Promise<void>;
  markVisited: () => void;
  updateStats: (update: { visit?: boolean; adventureStarted?: boolean; locationVisited?: boolean }) => void;
}

export function useNotifications(): NotificationState & NotificationActions {
  const [state, setState] = useState<NotificationState>({
    supported: notificationService.isSupported(),
    permission: 'default',
    isFirstVisit: notificationService.isFirstVisit()
  });

  useEffect(() => {
    const permissionStatus = notificationService.getPermissionStatus();
    let permission: 'granted' | 'denied' | 'default' = 'default';
    
    if (permissionStatus.granted) permission = 'granted';
    else if (permissionStatus.denied) permission = 'denied';
    
    setState(prev => ({
      ...prev,
      permission
    }));
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await notificationService.requestPermission();
    setState(prev => ({
      ...prev,
      permission: granted ? 'granted' : 'denied'
    }));
    return granted;
  }, []);

  const showWelcome = useCallback(async (): Promise<void> => {
    await notificationService.showWelcomeNotification();
  }, []);

  const showLocationEnabled = useCallback(async (): Promise<void> => {
    await notificationService.showLocationEnabledNotification();
  }, []);

  const showNearbyAdventure = useCallback(async (name: string, distance: number): Promise<void> => {
    await notificationService.showNearbyAdventureNotification(name, distance);
  }, []);

  const showAdventureStarted = useCallback(async (name: string): Promise<void> => {
    await notificationService.showAdventureStartedNotification(name);
  }, []);

  const showAchievement = useCallback(async (title: string, message: string): Promise<void> => {
    await notificationService.showAchievementNotification(title, message);
  }, []);

  const scheduleReminder = useCallback(async (): Promise<void> => {
    await notificationService.scheduleAdventureReminder();
  }, []);

  const markVisited = useCallback((): void => {
    notificationService.markVisited();
    setState(prev => ({
      ...prev,
      isFirstVisit: false
    }));
  }, []);

  const updateStats = useCallback((update: { visit?: boolean; adventureStarted?: boolean; locationVisited?: boolean }): void => {
    notificationService.updateAdventureStats(update);
  }, []);

  return {
    ...state,
    requestPermission,
    showWelcome,
    showLocationEnabled,
    showNearbyAdventure,
    showAdventureStarted,
    showAchievement,
    scheduleReminder,
    markVisited,
    updateStats
  };
}
