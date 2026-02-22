import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationsContext = createContext();

const STORAGE_KEYS = {
  NOTIFICATIONS_ENABLED: 'flappyfish_notifications_enabled',
  PUSH_TOKEN: 'flappyfish_push_token',
  LAST_SCHEDULED: 'flappyfish_last_scheduled',
  LAST_PLAY_TIME: 'flappyfish_last_play_time',
};

// Notification IDs for cancellation
const NOTIFICATION_IDS = {
  STREAK_REMINDER: 'streak_reminder',
  DAILY_CHALLENGE: 'daily_challenge',
  STREAK_WARNING: 'streak_warning',
  COME_BACK_48H: 'come_back_48h',
  COME_BACK_72H: 'come_back_72h',
  COME_BACK_WEEK: 'come_back_week',
};

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationsProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  // Initialize on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const enabled = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
        setNotificationsEnabled(enabled === 'true');
      } catch (error) {
        console.error('[Notifications] Load settings error:', error);
      }
    };

    const registerForPush = async () => {
      if (!Device.isDevice) {
        console.log('[Notifications] Must use physical device for push notifications');
        return null;
      }

      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        setPermissionStatus(existingStatus);

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
          setPermissionStatus(status);
        }

        if (finalStatus !== 'granted') {
          console.log('[Notifications] Permission not granted');
          return null;
        }

        // Get Expo push token
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: 'flappy-fish',
        });
        
        const token = tokenData.data;
        setExpoPushToken(token);
        await AsyncStorage.setItem(STORAGE_KEYS.PUSH_TOKEN, token);
        
        console.log('[Notifications] Push token:', token);

        // Configure notification channel for Android
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Flappy Fish',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#f1c40f',
          });
          
          await Notifications.setNotificationChannelAsync('streak', {
            name: 'Streak Reminders',
            importance: Notifications.AndroidImportance.HIGH,
            description: 'Reminders to keep your daily streak',
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#e74c3c',
          });
        }

        return token;
      } catch (error) {
        console.error('[Notifications] Registration error:', error);
        return null;
      }
    };

    loadSettings();
    registerForPush();
    
    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('[Notifications] Received:', notification);
    });

    // Listen for notification responses (when user taps)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('[Notifications] Tapped:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Request permission (can be called manually)
  const requestPermission = useCallback(async () => {
    if (!Device.isDevice) {
      console.log('[Notifications] Must use physical device for push notifications');
      return null;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      setPermissionStatus(existingStatus);

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        setPermissionStatus(status);
      }

      if (finalStatus !== 'granted') {
        console.log('[Notifications] Permission not granted');
        return null;
      }

      // Get Expo push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'flappy-fish',
      });
      
      const token = tokenData.data;
      setExpoPushToken(token);
      await AsyncStorage.setItem(STORAGE_KEYS.PUSH_TOKEN, token);
      
      console.log('[Notifications] Push token:', token);

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Flappy Fish',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#f1c40f',
        });
        
        await Notifications.setNotificationChannelAsync('streak', {
          name: 'Streak Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          description: 'Reminders to keep your daily streak',
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#e74c3c',
        });
      }

      return token;
    } catch (error) {
      console.error('[Notifications] Registration error:', error);
      return null;
    }
  }, []);

  // Cancel all scheduled notifications
  const cancelAllNotifications = useCallback(async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('[Notifications] All notifications cancelled');
    } catch (error) {
      console.error('[Notifications] Cancel error:', error);
    }
  }, []);

  // Schedule streak reminder notification
  const scheduleStreakReminder = useCallback(async (streakCount = 0) => {
    if (!notificationsEnabled) return;
    
    try {
      // Cancel existing streak reminders first
      await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.STREAK_REMINDER);
      
      // Schedule for 8 PM local time
      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(20, 0, 0, 0); // 8 PM
      
      // If it's already past 8 PM, schedule for tomorrow
      if (now > scheduledTime) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const trigger = {
        hour: 20,
        minute: 0,
        repeats: true,
      };

      const messages = [
        `🔥 Don't lose your ${streakCount > 0 ? streakCount + ' day' : ''} streak! Play now and claim your rewards!`,
        `🐠 Your fish misses you! Come back and keep swimming!`,
        `🎁 Daily rewards are waiting for you! Tap to claim!`,
        `⚡ Your streak is on the line! Quick game before bed?`,
      ];

      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_IDS.STREAK_REMINDER,
        content: {
          title: '🔥 Flappy Fish Streak Reminder',
          body: messages[Math.floor(Math.random() * messages.length)],
          data: { type: 'streak_reminder' },
          sound: true,
          badge: 1,
        },
        trigger,
      });

      console.log('[Notifications] Streak reminder scheduled for 8 PM');
    } catch (error) {
      console.error('[Notifications] Schedule streak reminder error:', error);
    }
  }, [notificationsEnabled]);

  // Schedule streak warning (shows at 10 PM if not played today)
  const scheduleStreakWarning = useCallback(async (currentStreak, hasPlayedToday) => {
    if (!notificationsEnabled || hasPlayedToday) return;
    
    try {
      await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.STREAK_WARNING);
      
      const trigger = {
        hour: 22,
        minute: 0,
        repeats: false, // One-time warning
      };

      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_IDS.STREAK_WARNING,
        content: {
          title: '⚠️ Streak About to End!',
          body: `Your ${currentStreak} day streak will reset at midnight! Play now to save it! 🏃‍♂️`,
          data: { type: 'streak_warning', urgent: true },
          sound: true,
          badge: 1,
          priority: 'high',
        },
        trigger,
      });

      console.log('[Notifications] Streak warning scheduled for 10 PM');
    } catch (error) {
      console.error('[Notifications] Schedule streak warning error:', error);
    }
  }, [notificationsEnabled]);

  // Schedule daily challenge reminder
  const scheduleDailyChallengeReminder = useCallback(async (completedCount, totalCount) => {
    if (!notificationsEnabled || completedCount >= totalCount) return;
    
    try {
      await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.DAILY_CHALLENGE);
      
      const trigger = {
        hour: 18,
        minute: 0,
        repeats: true,
      };

      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_IDS.DAILY_CHALLENGE,
        content: {
          title: '🎯 Daily Challenges Waiting!',
          body: `You've completed ${completedCount}/${totalCount} challenges today. Finish them all for bonus coins!`,
          data: { type: 'daily_challenge' },
          sound: true,
        },
        trigger,
      });

      console.log('[Notifications] Daily challenge reminder scheduled');
    } catch (error) {
      console.error('[Notifications] Schedule challenge reminder error:', error);
    }
  }, [notificationsEnabled]);

  // Send immediate notification (for testing)
  const sendTestNotification = useCallback(async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🐠 Test Notification',
        body: 'If you see this, notifications are working! 🎉',
        data: { type: 'test' },
        sound: true,
      },
      trigger: { seconds: 2 },
    });
  }, []);

  // Cancel streak warning when user plays
  const cancelStreakWarning = useCallback(async () => {
    try {
      await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.STREAK_WARNING);
    } catch (error) {
      console.error('[Notifications] Cancel warning error:', error);
    }
  }, []);

  // Schedule "Come Back" re-engagement notifications
  const scheduleComeBackNotifications = useCallback(async () => {
    if (!notificationsEnabled) return;
    
    try {
      // Cancel existing come back notifications first
      await Promise.all([
        Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.COME_BACK_48H),
        Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.COME_BACK_72H),
        Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.COME_BACK_WEEK),
      ]);

      // Save last play time
      const now = new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_PLAY_TIME, now);

      // 48 hours (2 days) notification
      const messages48h = [
        "🐟 Your fish misses you! Come back for a quick swim!",
        "🌊 The ocean is lonely without you! Play now?",
        "🎮 Haven't seen you in a while! Ready for another round?",
        "💙 Miss swimming through pipes? We miss you too!",
      ];

      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_IDS.COME_BACK_48H,
        content: {
          title: '🐠 We Miss You!',
          body: messages48h[Math.floor(Math.random() * messages48h.length)],
          data: { type: 'come_back', days: 2 },
          sound: true,
        },
        trigger: { seconds: 48 * 60 * 60 }, // 48 hours
      });

      // 72 hours (3 days) notification with bonus offer
      const messages72h = [
        "🎁 Come back now and get bonus coins waiting for you!",
        "⭐ Special reward inside! Don't miss out!",
        "🔥 Your streak reset, but you can start fresh! Play now!",
      ];

      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_IDS.COME_BACK_72H,
        content: {
          title: '🎁 Bonus Coins Waiting!',
          body: messages72h[Math.floor(Math.random() * messages72h.length)],
          data: { type: 'come_back', days: 3, hasBonus: true },
          sound: true,
        },
        trigger: { seconds: 72 * 60 * 60 }, // 72 hours
      });

      // 1 week notification - last attempt
      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_IDS.COME_BACK_WEEK,
        content: {
          title: '🐠 Flappy Fish Misses You!',
          body: "It's been a while! New challenges and rewards await. Tap to play! 🎮",
          data: { type: 'come_back', days: 7 },
          sound: true,
        },
        trigger: { seconds: 7 * 24 * 60 * 60 }, // 7 days
      });

      console.log('[Notifications] Come back notifications scheduled (48h, 72h, 7d)');
    } catch (error) {
      console.error('[Notifications] Schedule come back error:', error);
    }
  }, [notificationsEnabled]);

  // Cancel all come back notifications (called when user plays)
  const cancelComeBackNotifications = useCallback(async () => {
    try {
      await Promise.all([
        Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.COME_BACK_48H),
        Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.COME_BACK_72H),
        Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.COME_BACK_WEEK),
      ]);
      console.log('[Notifications] Come back notifications cancelled');
    } catch (error) {
      console.error('[Notifications] Cancel come back error:', error);
    }
  }, []);

  // Called when user starts a game - reschedule come back notifications
  const onGameStart = useCallback(async () => {
    // Cancel existing come back notifications
    await cancelComeBackNotifications();
    // Cancel streak warning since player is playing
    await cancelStreakWarning();
    // Reschedule come back notifications from now
    await scheduleComeBackNotifications();
    
    console.log('[Notifications] Game start - notifications updated');
  }, [cancelComeBackNotifications, cancelStreakWarning, scheduleComeBackNotifications]);

  // Called when user opens the app - check and reschedule if needed
  const onAppOpen = useCallback(async () => {
    if (!notificationsEnabled) return;
    
    try {
      const lastPlayTime = await AsyncStorage.getItem(STORAGE_KEYS.LAST_PLAY_TIME);
      
      if (!lastPlayTime) {
        // First time user - schedule come back notifications
        await scheduleComeBackNotifications();
        return;
      }

      const lastPlay = new Date(lastPlayTime);
      const now = new Date();
      const hoursSinceLastPlay = (now - lastPlay) / (1000 * 60 * 60);

      // If user hasn't played in 24+ hours, make sure come back notifications are scheduled
      if (hoursSinceLastPlay > 24) {
        // Check if notifications are already scheduled
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        const hasComeBack = scheduled.some(n => 
          n.identifier === NOTIFICATION_IDS.COME_BACK_48H ||
          n.identifier === NOTIFICATION_IDS.COME_BACK_72H ||
          n.identifier === NOTIFICATION_IDS.COME_BACK_WEEK
        );
        
        if (!hasComeBack) {
          await scheduleComeBackNotifications();
        }
      }
    } catch (error) {
      console.error('[Notifications] App open check error:', error);
    }
  }, [notificationsEnabled, scheduleComeBackNotifications]);

  // Enable/disable notifications
  const toggleNotifications = useCallback(async (enabled) => {
    setNotificationsEnabled(enabled);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, enabled.toString());
    
    if (enabled) {
      // Request permission if not granted
      if (permissionStatus !== 'granted') {
        await requestPermission();
      }
      // Schedule come back notifications
      await scheduleComeBackNotifications();
    } else {
      // Cancel all scheduled notifications
      await cancelAllNotifications();
    }
    
    console.log('[Notifications] Enabled:', enabled);
  }, [permissionStatus, requestPermission, cancelAllNotifications, scheduleComeBackNotifications]);

  // Get all scheduled notifications (for debugging)
  const getScheduledNotifications = useCallback(async () => {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log('[Notifications] Scheduled:', scheduled);
    return scheduled;
  }, []);

  // Update notifications when streak changes
  const updateStreakNotifications = useCallback(async (currentStreak, hasPlayedToday, streakClaimedToday) => {
    if (!notificationsEnabled) return;
    
    // Always schedule the daily reminder
    await scheduleStreakReminder(currentStreak);
    
    // If player hasn't played today, schedule warning
    if (!hasPlayedToday && !streakClaimedToday && currentStreak > 0) {
      await scheduleStreakWarning(currentStreak, false);
    } else {
      // Player has played, cancel warning
      await cancelStreakWarning();
    }
  }, [notificationsEnabled, scheduleStreakReminder, scheduleStreakWarning, cancelStreakWarning]);

  const value = {
    // State
    expoPushToken,
    notificationsEnabled,
    permissionStatus,
    
    // Actions
    toggleNotifications,
    scheduleStreakReminder,
    scheduleStreakWarning,
    scheduleDailyChallengeReminder,
    updateStreakNotifications,
    cancelStreakWarning,
    cancelAllNotifications,
    sendTestNotification,
    getScheduledNotifications,
    
    // Come back / Re-engagement
    scheduleComeBackNotifications,
    cancelComeBackNotifications,
    onGameStart,
    onAppOpen,
    
    // Permission
    requestPermission,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
};
