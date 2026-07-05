import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../theme';
import { GOAL_LABELS } from '../utils/nutrition';

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

export default function DashboardScreen() {
  const { profile, targets, consumedToday, burnedToday, todayMeals, todayActivity } = useApp();

  if (!profile || !targets) return null;

  const remaining = targets.targetCalories - consumedToday + burnedToday;
  const proteinToday = todayMeals.reduce((s, m) => s + m.analysis.totalProtein, 0);
  const overTarget = remaining < 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Aujourd’hui</Text>
      <Text style={styles.goalBadge}>{GOAL_LABELS[profile.goal]}</Text>

      <View style={styles.card}>
        <View style={styles.remainingRow}>
          <Text style={[styles.remainingValue, overTarget && { color: colors.danger }]}>
            {Math.abs(Math.round(remaining))}
          </Text>
          <Text style={styles.remainingUnit}>
            kcal {overTarget ? 'au-dessus de l’objectif' : 'restantes'}
          </Text>
        </View>
        <ProgressBar
          value={consumedToday}
          max={targets.targetCalories + burnedToday}
          color={overTarget ? colors.danger : colors.primaryLight}
        />
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Ionicons name="restaurant" size={18} color={colors.accent} />
            <Text style={styles.statValue}>{consumedToday}</Text>
            <Text style={styles.statLabel}>consommées</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="flame" size={18} color={colors.danger} />
            <Text style={styles.statValue}>{burnedToday}</Text>
            <Text style={styles.statLabel}>brûlées</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="flag" size={18} color={colors.primary} />
            <Text style={styles.statValue}>{targets.targetCalories}</Text>
            <Text style={styles.statLabel}>objectif</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Protéines</Text>
        <ProgressBar value={proteinToday} max={targets.targetProtein} color={colors.protein} />
        <Text style={styles.cardMeta}>
          {proteinToday} g / {targets.targetProtein} g
          {profile.goal === 'muscle' ? '  ·  essentiel pour la masse musculaire' : ''}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Activité physique</Text>
        <ProgressBar value={burnedToday} max={targets.burnGoalKcal} color={colors.success} />
        <Text style={styles.cardMeta}>
          {burnedToday} kcal / {targets.burnGoalKcal} kcal · {todayActivity.steps} pas
          {todayActivity.goalNotified ? '  ·  🎉 objectif atteint !' : ''}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Votre métabolisme</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Métabolisme de base (BMR)</Text>
          <Text style={styles.metaValue}>{targets.bmr} kcal</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Dépense journalière (TDEE)</Text>
          <Text style={styles.metaValue}>{targets.tdee} kcal</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Repas scannés aujourd’hui</Text>
          <Text style={styles.metaValue}>{todayMeals.length}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  heading: { fontSize: 28, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  goalBadge: { color: colors.primary, fontWeight: '600', marginBottom: spacing.md },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  cardMeta: { color: colors.textMuted, fontSize: 13, marginTop: spacing.sm },
  remainingRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: spacing.sm },
  remainingValue: { fontSize: 40, fontWeight: '800', color: colors.primary },
  remainingUnit: { fontSize: 14, color: colors.textMuted, marginLeft: spacing.sm },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EDF1ED',
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 5 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 2 },
  statLabel: { fontSize: 12, color: colors.textMuted },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  metaLabel: { color: colors.textMuted, fontSize: 14 },
  metaValue: { color: colors.text, fontWeight: '600', fontSize: 14 },
});
