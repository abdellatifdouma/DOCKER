import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useApp } from '../context/AppContext';
import { colors, radius, spacing } from '../theme';
import { ActivityLevel, Goal, Sex } from '../types';
import { ACTIVITY_LABELS, GOAL_LABELS } from '../utils/nutrition';

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: 'male', label: 'Homme' },
  { value: 'female', label: 'Femme' },
];

export default function OnboardingScreen() {
  const { setProfile, profile } = useApp();
  const [sex, setSex] = useState<Sex>(profile?.sex ?? 'male');
  const [age, setAge] = useState(profile ? String(profile.age) : '');
  const [height, setHeight] = useState(profile ? String(profile.heightCm) : '');
  const [weight, setWeight] = useState(profile ? String(profile.weightKg) : '');
  const [activity, setActivity] = useState<ActivityLevel>(profile?.activityLevel ?? 'light');
  const [goal, setGoal] = useState<Goal>(profile?.goal ?? 'maintain');

  const submit = async () => {
    const ageN = parseInt(age, 10);
    const heightN = parseFloat(height);
    const weightN = parseFloat(weight);
    if (!ageN || ageN < 10 || ageN > 100) {
      Alert.alert('Erreur', 'Veuillez saisir un âge valide (10-100).');
      return;
    }
    if (!heightN || heightN < 100 || heightN > 250) {
      Alert.alert('Erreur', 'Veuillez saisir une taille valide en cm (100-250).');
      return;
    }
    if (!weightN || weightN < 30 || weightN > 300) {
      Alert.alert('Erreur', 'Veuillez saisir un poids valide en kg (30-300).');
      return;
    }
    await setProfile({
      sex,
      age: ageN,
      heightCm: heightN,
      weightKg: weightN,
      activityLevel: activity,
      goal,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Bienvenue sur NutriScan 🥗</Text>
        <Text style={styles.subtitle}>
          Quelques informations pour calculer vos besoins caloriques personnalisés.
        </Text>

        <Text style={styles.label}>Sexe</Text>
        <View style={styles.row}>
          {SEX_OPTIONS.map((o) => (
            <TouchableOpacity
              key={o.value}
              style={[styles.chip, sex === o.value && styles.chipActive]}
              onPress={() => setSex(o.value)}
            >
              <Text style={[styles.chipText, sex === o.value && styles.chipTextActive]}>
                {o.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Âge (années)</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={age}
          onChangeText={setAge}
          placeholder="30"
        />

        <Text style={styles.label}>Taille (cm)</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={height}
          onChangeText={setHeight}
          placeholder="175"
        />

        <Text style={styles.label}>Poids (kg)</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={setWeight}
          placeholder="72"
        />

        <Text style={styles.label}>Niveau d’activité</Text>
        {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((lvl) => (
          <TouchableOpacity
            key={lvl}
            style={[styles.option, activity === lvl && styles.optionActive]}
            onPress={() => setActivity(lvl)}
          >
            <Text style={[styles.optionText, activity === lvl && styles.optionTextActive]}>
              {ACTIVITY_LABELS[lvl]}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.label}>Objectif</Text>
        {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.option, goal === g && styles.optionActive]}
            onPress={() => setGoal(g)}
          >
            <Text style={[styles.optionText, goal === g && styles.optionTextActive]}>
              {GOAL_LABELS[g]}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.submit} onPress={submit}>
          <Text style={styles.submitText}>Commencer</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  title: { fontSize: 26, fontWeight: '700', color: colors.text, marginTop: spacing.xl },
  subtitle: { fontSize: 15, color: colors.textMuted, marginTop: spacing.sm },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', gap: spacing.sm },
  chip: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  option: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  optionActive: { borderColor: colors.primary, backgroundColor: '#E8F5E9' },
  optionText: { color: colors.text },
  optionTextActive: { color: colors.primary, fontWeight: '600' },
  submit: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  submitText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
