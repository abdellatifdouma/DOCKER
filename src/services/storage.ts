import AsyncStorage from '@react-native-async-storage/async-storage';

import { DailyActivity, MealEntry, UserProfile } from '../types';

const KEYS = {
  profile: 'nutriscan/profile',
  meals: 'nutriscan/meals',
  activity: 'nutriscan/activity',
  apiKey: 'nutriscan/apiKey',
};

export async function loadProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(KEYS.profile);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

export async function loadMeals(): Promise<MealEntry[]> {
  const raw = await AsyncStorage.getItem(KEYS.meals);
  return raw ? (JSON.parse(raw) as MealEntry[]) : [];
}

export async function saveMeals(meals: MealEntry[]): Promise<void> {
  // Keep the 60 most recent days of history to bound storage size.
  const sorted = [...meals].sort((a, b) => b.timestamp - a.timestamp).slice(0, 500);
  await AsyncStorage.setItem(KEYS.meals, JSON.stringify(sorted));
}

export async function loadActivity(date: string): Promise<DailyActivity> {
  const raw = await AsyncStorage.getItem(`${KEYS.activity}/${date}`);
  return raw
    ? (JSON.parse(raw) as DailyActivity)
    : { date, steps: 0, exerciseKcal: 0, goalNotified: false };
}

export async function saveActivity(activity: DailyActivity): Promise<void> {
  await AsyncStorage.setItem(`${KEYS.activity}/${activity.date}`, JSON.stringify(activity));
}

export async function loadApiKey(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.apiKey);
}

export async function saveApiKey(key: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.apiKey, key.trim());
}
