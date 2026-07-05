import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { notifyGoalReached } from '../services/notifications';
import * as storage from '../services/storage';
import { DailyActivity, DailyTargets, MealAnalysis, MealEntry, UserProfile } from '../types';
import { computeTargets, stepsToKcal, todayKey } from '../utils/nutrition';

interface AppContextValue {
  ready: boolean;
  profile: UserProfile | null;
  apiKey: string | null;
  meals: MealEntry[];
  todayMeals: MealEntry[];
  todayActivity: DailyActivity;
  targets: DailyTargets | null;
  consumedToday: number;
  burnedToday: number;
  setProfile: (p: UserProfile) => Promise<void>;
  setApiKey: (key: string) => Promise<void>;
  addMeal: (analysis: MealAnalysis, imageUri?: string) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  addSteps: (steps: number) => Promise<void>;
  addExerciseKcal: (kcal: number) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [todayActivity, setTodayActivity] = useState<DailyActivity>({
    date: todayKey(),
    steps: 0,
    exerciseKcal: 0,
    goalNotified: false,
  });

  useEffect(() => {
    (async () => {
      const [p, key, m, activity] = await Promise.all([
        storage.loadProfile(),
        storage.loadApiKey(),
        storage.loadMeals(),
        storage.loadActivity(todayKey()),
      ]);
      setProfileState(p);
      setApiKeyState(key);
      setMeals(m);
      setTodayActivity(activity);
      setReady(true);
    })();
  }, []);

  const targets = useMemo(() => (profile ? computeTargets(profile) : null), [profile]);

  const todayMeals = useMemo(
    () => meals.filter((m) => m.date === todayKey()),
    [meals],
  );

  const consumedToday = useMemo(
    () => todayMeals.reduce((sum, m) => sum + m.analysis.totalCalories, 0),
    [todayMeals],
  );

  const burnedToday = useMemo(() => {
    if (!profile) return 0;
    return stepsToKcal(todayActivity.steps, profile.weightKg) + todayActivity.exerciseKcal;
  }, [todayActivity, profile]);

  const setProfile = useCallback(async (p: UserProfile) => {
    setProfileState(p);
    await storage.saveProfile(p);
  }, []);

  const setApiKey = useCallback(async (key: string) => {
    setApiKeyState(key.trim());
    await storage.saveApiKey(key);
  }, []);

  const addMeal = useCallback(
    async (analysis: MealAnalysis, imageUri?: string) => {
      const entry: MealEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        date: todayKey(),
        timestamp: Date.now(),
        analysis,
        imageUri,
      };
      setMeals((prev) => {
        const next = [entry, ...prev];
        void storage.saveMeals(next);
        return next;
      });
    },
    [],
  );

  const deleteMeal = useCallback(async (id: string) => {
    setMeals((prev) => {
      const next = prev.filter((m) => m.id !== id);
      void storage.saveMeals(next);
      return next;
    });
  }, []);

  const updateActivity = useCallback(
    async (update: (a: DailyActivity) => DailyActivity) => {
      setTodayActivity((prev) => {
        const base = prev.date === todayKey() ? prev : {
          date: todayKey(),
          steps: 0,
          exerciseKcal: 0,
          goalNotified: false,
        };
        let next = update(base);

        if (profile && targets && !next.goalNotified) {
          const burned = stepsToKcal(next.steps, profile.weightKg) + next.exerciseKcal;
          if (burned >= targets.burnGoalKcal) {
            next = { ...next, goalNotified: true };
            void notifyGoalReached(burned, targets.burnGoalKcal);
          }
        }

        void storage.saveActivity(next);
        return next;
      });
    },
    [profile, targets],
  );

  const addSteps = useCallback(
    async (steps: number) => {
      await updateActivity((a) => ({ ...a, steps: a.steps + steps }));
    },
    [updateActivity],
  );

  const addExerciseKcal = useCallback(
    async (kcal: number) => {
      await updateActivity((a) => ({ ...a, exerciseKcal: a.exerciseKcal + kcal }));
    },
    [updateActivity],
  );

  const value: AppContextValue = {
    ready,
    profile,
    apiKey,
    meals,
    todayMeals,
    todayActivity,
    targets,
    consumedToday,
    burnedToday,
    setProfile,
    setApiKey,
    addMeal,
    deleteMeal,
    addSteps,
    addExerciseKcal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
