import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useApp } from '../context/AppContext';
import type { RootStackParamList } from '../navigation';
import { colors, radius, spacing } from '../theme';
import { exercisesToBurn, kcalToSteps } from '../utils/nutrition';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

const CONFIDENCE_LABELS = { low: 'faible', medium: 'moyenne', high: 'élevée' } as const;

export default function ResultScreen({ route, navigation }: Props) {
  const { analysis } = route.params;
  const { profile } = useApp();

  const weightKg = profile?.weightKg ?? 70;
  const suggestions = useMemo(
    () => exercisesToBurn(analysis.totalCalories, weightKg),
    [analysis.totalCalories, weightKg],
  );
  const steps = kcalToSteps(analysis.totalCalories, weightKg);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.totalCard}>
        <Text style={styles.totalValue}>{analysis.totalCalories}</Text>
        <Text style={styles.totalUnit}>kcal estimées</Text>
        <View style={styles.macroRow}>
          <View style={styles.macro}>
            <Text style={[styles.macroValue, { color: colors.protein }]}>
              {analysis.totalProtein} g
            </Text>
            <Text style={styles.macroLabel}>Protéines</Text>
          </View>
          <View style={styles.macro}>
            <Text style={[styles.macroValue, { color: colors.carbs }]}>
              {analysis.totalCarbs} g
            </Text>
            <Text style={styles.macroLabel}>Glucides</Text>
          </View>
          <View style={styles.macro}>
            <Text style={[styles.macroValue, { color: colors.fat }]}>{analysis.totalFat} g</Text>
            <Text style={styles.macroLabel}>Lipides</Text>
          </View>
        </View>
        <Text style={styles.confidence}>
          Confiance de l’estimation : {CONFIDENCE_LABELS[analysis.confidence]}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Aliments détectés</Text>
      {analysis.foods.map((f, i) => (
        <View key={`${f.name}-${i}`} style={styles.foodRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.foodName}>{f.name}</Text>
            <Text style={styles.foodQty}>{f.quantity}</Text>
          </View>
          <Text style={styles.foodKcal}>{Math.round(f.calories)} kcal</Text>
        </View>
      ))}

      {analysis.notes ? <Text style={styles.notes}>ℹ️ {analysis.notes}</Text> : null}

      <Text style={styles.sectionTitle}>Pour brûler ce repas 🔥</Text>
      <View style={styles.stepsCard}>
        <Ionicons name="footsteps" size={22} color={colors.primary} />
        <Text style={styles.stepsText}>
          Environ <Text style={styles.stepsBold}>{steps.toLocaleString('fr-FR')} pas</Text> de
          marche
        </Text>
      </View>
      {suggestions.map((s) => (
        <View key={s.name} style={styles.exerciseRow}>
          <Ionicons name={s.icon as never} size={22} color={colors.primary} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.exerciseName}>{s.name}</Text>
            <Text style={styles.exerciseMeta}>≈ {s.kcalPerMin} kcal/min</Text>
          </View>
          <Text style={styles.exerciseMinutes}>{s.minutes} min</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.done} onPress={() => navigation.goBack()}>
        <Text style={styles.doneText}>Terminé</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl * 2 },
  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  totalValue: { fontSize: 48, fontWeight: '800', color: '#fff' },
  totalUnit: { color: '#C8E6C9', fontSize: 14 },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'stretch',
    marginTop: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  macro: { alignItems: 'center' },
  macroValue: { fontSize: 17, fontWeight: '700', color: '#fff' },
  macroLabel: { color: '#C8E6C9', fontSize: 12 },
  confidence: { color: '#C8E6C9', fontSize: 12, marginTop: spacing.md },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  foodName: { fontWeight: '600', color: colors.text },
  foodQty: { color: colors.textMuted, fontSize: 13 },
  foodKcal: { fontWeight: '700', color: colors.accent },
  notes: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
  stepsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#E8F5E9',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  stepsText: { color: colors.text },
  stepsBold: { fontWeight: '700', color: colors.primary },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  exerciseName: { fontWeight: '600', color: colors.text },
  exerciseMeta: { color: colors.textMuted, fontSize: 12 },
  exerciseMinutes: { fontWeight: '700', color: colors.primary, fontSize: 16 },
  done: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  doneText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
