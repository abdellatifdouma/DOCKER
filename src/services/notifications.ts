import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotifications(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('goals', {
      name: 'Objectifs',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const { status: requested } = await Notifications.requestPermissionsAsync();
  return requested === 'granted';
}

export async function notifyGoalReached(burnedKcal: number, goalKcal: number): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🎉 Objectif atteint !',
      body: `Bravo ! Vous avez brûlé ${burnedKcal} kcal aujourd’hui (objectif : ${goalKcal} kcal).`,
      sound: true,
    },
    trigger: null, // deliver immediately
  });
}
