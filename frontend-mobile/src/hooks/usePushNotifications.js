import { useEffect, useRef } from 'react';
import * as Device        from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform }       from 'react-native';
import apiClient          from '../api/client';

// How notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  true,
  }),
});

const usePushNotifications = (isLoggedIn) => {
  const notificationListener = useRef();
  const responseListener     = useRef();

  useEffect(() => {
    if (!isLoggedIn) return;

    registerForPushNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('[Push] Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('[Push] Notification tapped:', data);
      // if (data.type === 'vaccination_reminder') navigate to vaccination screen
      // if (data.type === 'case_status_update')   navigate to case screen
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isLoggedIn]);
};

const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.warn('[Push] Push notifications require a physical device.');
    return;
  }

  // Android channel setup — no custom sound
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name:       'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('[Push] Push notification permission denied.');
    return;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: '7dfb4eff-ba09-4b06-b17e-e7bcee940bf4',
  });

  const pushToken = tokenData.data;
  console.log('[Push] Expo Push Token:', pushToken);

  try {
    await apiClient.patch('/users/push-token', { pushToken });
    console.log('[Push] Token saved to backend.');
  } catch (err) {
    console.error('[Push] Failed to save push token:', err.message);
  }
};

export default usePushNotifications;