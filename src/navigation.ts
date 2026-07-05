import type { MealAnalysis } from './types';

export type RootStackParamList = {
  Tabs: undefined;
  Result: { analysis: MealAnalysis };
};

export type TabParamList = {
  Dashboard: undefined;
  Scan: undefined;
  Activity: undefined;
  History: undefined;
  Settings: undefined;
};
