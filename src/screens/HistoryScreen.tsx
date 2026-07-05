import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Alert, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../theme';
import { MealEntry } from '../types';

function formatDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryScreen() {
  const { meals, deleteMeal } = useApp();

  const sections = useMemo(() => {
    const byDate = new Map<string, MealEntry[]>();
    for (const meal of meals) {
      const list = byDate.get(meal.date) ?? [];
      list.push(meal);
      byDate.set(meal.date, list);
    }
    return [...byDate.entries()]
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, data]) => ({
        title: formatDate(date),
        total: data.reduce((s, m) => s + m.analysis.totalCalories, 0),
        data,
      }));
  }, [meals]);

  const confirmDelete = (meal: MealEntry) => {
    Alert.alert('Supprimer ce repas ?', 'Cette action est définitive.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => void deleteMeal(meal.id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Historique</Text>
      {sections.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="restaurant-outline" size={56} color={colors.border} />
          <Text style={styles.emptyText}>
            Aucun repas scanné pour le moment.{'\n'}Rendez-vous dans l’onglet Scanner !
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionTotal}>{section.total} kcal</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.mealRow} onLongPress={() => confirmDelete(item)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mealName} numberOfLines={1}>
                  {item.analysis.foods.map((f) => f.name).join(', ') || 'Repas'}
                </Text>
                <Text style={styles.mealMeta}>
                  {formatTime(item.timestamp)} · P {item.analysis.totalProtein} g · G{' '}
                  {item.analysis.totalCarbs} g · L {item.analysis.totalFat} g
                </Text>
              </View>
              <Text style={styles.mealKcal}>{item.analysis.totalCalories} kcal</Text>
            </TouchableOpacity>
          )}
        />
      )}
      {sections.length > 0 && (
        <Text style={styles.hint}>Appui long sur un repas pour le supprimer</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  heading: { fontSize: 28, fontWeight: '700', color: colors.text, marginVertical: spacing.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyText: { color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: { fontWeight: '700', color: colors.text, textTransform: 'capitalize' },
  sectionTotal: { color: colors.accent, fontWeight: '700' },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  mealName: { fontWeight: '600', color: colors.text },
  mealMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  mealKcal: { fontWeight: '700', color: colors.primary, marginLeft: spacing.sm },
  hint: { color: colors.textMuted, fontSize: 12, textAlign: 'center', padding: spacing.xs },
});
