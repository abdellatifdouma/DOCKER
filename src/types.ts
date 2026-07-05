export type Sex = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type Goal = 'lose' | 'maintain' | 'gain' | 'muscle';

export interface UserProfile {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealAnalysis {
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  confidence: 'low' | 'medium' | 'high';
  notes: string;
}

export interface MealEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  analysis: MealAnalysis;
  imageUri?: string;
}

export interface ExerciseSuggestion {
  name: string;
  icon: string;
  met: number;
  minutes: number;
  kcalPerMin: number;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  steps: number;
  exerciseKcal: number; // kcal burned via manually logged exercises
  goalNotified: boolean;
}

export interface DailyTargets {
  bmr: number;
  tdee: number;
  targetCalories: number;
  targetProtein: number;
  burnGoalKcal: number; // daily activity goal in kcal
}
