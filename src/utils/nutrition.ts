import { ActivityLevel, DailyTargets, ExerciseSuggestion, Goal, UserProfile } from '../types';

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sédentaire (peu ou pas d’exercice)',
  light: 'Légèrement actif (1-3 jours/sem.)',
  moderate: 'Modérément actif (3-5 jours/sem.)',
  active: 'Actif (6-7 jours/sem.)',
  very_active: 'Très actif (travail physique)',
};

export const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Perte de poids',
  maintain: 'Maintien du poids',
  gain: 'Prise de poids',
  muscle: 'Prise de masse musculaire',
};

/** Basal metabolic rate — Mifflin-St Jeor equation. */
export function computeBmr(p: UserProfile): number {
  const base = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age;
  return Math.round(p.sex === 'male' ? base + 5 : base - 161);
}

export function computeTargets(p: UserProfile): DailyTargets {
  const bmr = computeBmr(p);
  const tdee = Math.round(bmr * ACTIVITY_FACTORS[p.activityLevel]);

  let targetCalories = tdee;
  let proteinPerKg = 0.9;
  let burnGoalKcal = 200;

  switch (p.goal) {
    case 'lose':
      targetCalories = tdee - 500;
      proteinPerKg = 1.6; // preserve lean mass in a deficit
      burnGoalKcal = 300;
      break;
    case 'maintain':
      targetCalories = tdee;
      proteinPerKg = 1.2;
      burnGoalKcal = 200;
      break;
    case 'gain':
      targetCalories = tdee + 300;
      proteinPerKg = 1.4;
      burnGoalKcal = 150;
      break;
    case 'muscle':
      targetCalories = tdee + 250;
      proteinPerKg = 2.0;
      burnGoalKcal = 250; // resistance-focused activity
      break;
  }

  return {
    bmr,
    tdee,
    targetCalories: Math.max(1200, Math.round(targetCalories)),
    targetProtein: Math.round(proteinPerKg * p.weightKg),
    burnGoalKcal,
  };
}

interface ExerciseDef {
  name: string;
  icon: string;
  met: number;
}

/** Easy, equipment-free activities with their MET values (Compendium of Physical Activities). */
const EXERCISES: ExerciseDef[] = [
  { name: 'Marche (5 km/h)', icon: 'walk', met: 3.5 },
  { name: 'Marche rapide (6,5 km/h)', icon: 'walk', met: 4.3 },
  { name: 'Vélo tranquille', icon: 'bicycle', met: 6.0 },
  { name: 'Montée d’escaliers', icon: 'trending-up', met: 8.0 },
  { name: 'Course à pied (8 km/h)', icon: 'fitness', met: 8.3 },
  { name: 'Corde à sauter', icon: 'pulse', met: 11.0 },
  { name: 'Squats / renforcement', icon: 'barbell', met: 5.0 },
  { name: 'Danse', icon: 'musical-notes', met: 5.5 },
  { name: 'Ménage actif', icon: 'home', met: 3.3 },
];

/** kcal burned per minute for a given MET and body weight. */
export function kcalPerMinute(met: number, weightKg: number): number {
  return (met * 3.5 * weightKg) / 200;
}

/**
 * For a calorie amount, return how many minutes of each easy exercise
 * are needed to burn it.
 */
export function exercisesToBurn(kcal: number, weightKg: number): ExerciseSuggestion[] {
  return EXERCISES.map((e) => {
    const perMin = kcalPerMinute(e.met, weightKg);
    return {
      name: e.name,
      icon: e.icon,
      met: e.met,
      kcalPerMin: Math.round(perMin * 10) / 10,
      minutes: Math.max(1, Math.round(kcal / perMin)),
    };
  }).sort((a, b) => a.minutes - b.minutes);
}

/** Approximate kcal burned from steps, scaled by body weight (~0.035 kcal/step at 70 kg). */
export function stepsToKcal(steps: number, weightKg: number): number {
  return Math.round(steps * 0.0005 * weightKg);
}

/** Approximate steps needed to burn a calorie amount. */
export function kcalToSteps(kcal: number, weightKg: number): number {
  return Math.round(kcal / (0.0005 * weightKg));
}

export function todayKey(): string {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}
