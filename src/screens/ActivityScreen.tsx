import { Ionicons } from '@expo/vector-icons';
import { Pedometer } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../theme';
import { exercisesToBurn, kcalPerMinute, stepsToKcal } from '../utils/nutrition';

const QUICK_EXERCISES = [
  { name: 'Marche 15 min', met: 3.5, minutes: 15, icon: 'walk' },
  { name: 'Marche rapide 15 min', met: 4.3, minutes: 15, icon: 'walk' },
  { name: 'Course 15 min', met: 8.3, minutes: 15, icon: 'fitness' },
  { name: 'Vélo 20 min', met: 6.0, minutes: 20, icon: 'bicycle' },
  { name: 'Renforcement 15 min', met: 5.0, minutes: 15, icon: 'barbell' },
  { name: 'Corde à sauter 10 min', met: 11.0, minutes: 10, icon: 'pulse' },
] as const;

export default function ActivityScreen() {
  const {
    profile,
    targets,
    todayActivity,
    burnedToday,
    consumedToday,
    addSteps,
    addExerciseKcal,
  } = useApp();
  const [tracking, setTracking] = useState(false);
  const [pedometerAvailable, setPedometerAvailable] = useState<boolean | null>(null);
  const subscription = useRef<{ remove: () => void } | null>(null);
  const lastCount = useRef(0);

  useEffect(() => {
    Pedometer.isAvailableAsync().then(setPedometerAvailable).catch(() => {
      setPedometerAvailable(false);
    });
    return () => {
      subscription.current?.remove();
    };
  }, []);

  const toggleTracking = async () => {
    if (tracking) {
      subscription.current?.remove();
      subscription.current = null;
      setTracking(false);
      return;
    }
    const perm = await Pedometer.requestPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission requise', 'Autorisez le suivi d’activité pour compter vos pas.');
      return;
    }
    lastCount.current = 0;
    subscription.current = Pedometer.watchStepCount((result) => {
      const delta = result.steps - lastCount.current;
      lastCount.current = result.steps;
      if (delta > 0) void addSteps(delta);
    });
    setTracking(true);
  };

  if (!profile || !targets) return null;

  const stepsKcal = stepsToKcal(todayActivity.steps, profile.weightKg);
  const remainingBurn = Math.max(0, targets.burnGoalKcal - burnedToday);
  const surplus = Math.max(0, consumedToday - targets.targetCalories);
  const goalReached = burnedToday >= targets.burnGoalKcal;
  const suggestions = remainingBurn > 0 ? exercisesToBurn(remainingBurn, profile.weightKg).slice(0, 4) : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Activité</Text>

      <View style={[styles.card, goalReached && styles.cardSuccess]}>
        <Text style={styles.bigValue}>
          {burnedToday} <Text style={styles.bigUnit}>/ {targets.burnGoalKcal} kcal</Text>
        </Text>
        <Text style={styles.cardMeta}>
          {goalReached
            ? '🎉 Objectif du jour atteint, bravo !'
            : `Encore ${remainingBurn} kcal pour atteindre votre objectif du jour`}
        </Text>
        {surplus > 0 && (
          <Text style={styles.warning}>
            ⚠️ Vous avez mangé {surplus} kcal au-dessus de votre objectif — pensez à bouger un peu
            plus.
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.cardTitle}>Podomètre</Text>
            <Text style={styles.cardMeta}>
              {todayActivity.steps.toLocaleString('fr-FR')} pas · {stepsKcal} kcal
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.trackButton, tracking && styles.trackButtonActive]}
            onPress={toggleTracking}
            disabled={pedometerAvailable === false}
          >
            <Ionicons name={tracking ? 'pause' : 'play'} size={18} color="#fff" />
            <Text style={styles.trackButtonText}>{tracking ? 'Pause' : 'Suivre'}</Text>
          </TouchableOpacity>
        </View>
        {pedometerAvailable === false && (
          <Text style={styles.warning}>
            Podomètre indisponible sur cet appareil — enregistrez vos exercices manuellement
            ci-dessous.
          </Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Enregistrer un exercice</Text>
      <View style={styles.grid}>
        {QUICK_EXERCISES.map((e) => {
          const kcal = Math.round(kcalPerMinute(e.met, profile.weightKg) * e.minutes);
          return (
            <TouchableOpacity
              key={e.name}
              style={styles.exerciseTile}
              onPress={() => {
                void addExerciseKcal(kcal);
                Alert.alert('Enregistré 💪', `${e.name} : +${kcal} kcal brûlées.`);
              }}
            >
              <Ionicons name={e.icon as never} size={24} color={colors.primary} />
              <Text style={styles.tileName}>{e.name}</Text>
              <Text style={styles.tileKcal}>+{kcal} kcal</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {suggestions.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Suggestions pour finir l’objectif</Text>
          {suggestions.map((s) => (
            <View key={s.name} style={styles.suggestionRow}>
              <Ionicons name={s.icon as never} size={20} color={colors.primary} />
              <Text style={styles.suggestionText}>
                {s.name} · <Text style={{ fontWeight: '700' }}>{s.minutes} min</Text>
              </Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  heading: { fontSize: 28, fontWeight: '700', color: colors.text, marginVertical: spacing.sm },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardSuccess: { borderColor: colors.success, backgroundColor: '#E8F5E9' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  cardMeta: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  bigValue: { fontSize: 34, fontWeight: '800', color: colors.primary },
  bigUnit: { fontSize: 16, fontWeight: '500', color: colors.textMuted },
  warning: { color: colors.danger, fontSize: 13, marginTop: spacing.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  trackButtonActive: { backgroundColor: colors.accent },
  trackButtonText: { color: '#fff', fontWeight: '700' },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  exerciseTile: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  tileName: { fontWeight: '600', color: colors.text, textAlign: 'center', fontSize: 13 },
  tileKcal: { color: colors.accent, fontWeight: '700', fontSize: 13 },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  suggestionText: { color: colors.text },
});
