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
import { ActivityLevel, Goal } from '../types';
import { ACTIVITY_LABELS, GOAL_LABELS } from '../utils/nutrition';

export default function SettingsScreen() {
  const { profile, setProfile, apiKey, setApiKey, targets } = useApp();
  const [keyInput, setKeyInput] = useState(apiKey ?? '');
  const [weightInput, setWeightInput] = useState(profile ? String(profile.weightKg) : '');

  if (!profile) return null;

  const saveKey = async () => {
    if (!keyInput.trim().startsWith('sk-ant-')) {
      Alert.alert('Clé invalide', 'La clé API Anthropic commence par "sk-ant-".');
      return;
    }
    await setApiKey(keyInput);
    Alert.alert('Enregistré', 'Clé API sauvegardée.');
  };

  const saveWeight = async () => {
    const w = parseFloat(weightInput);
    if (!w || w < 30 || w > 300) {
      Alert.alert('Erreur', 'Poids invalide.');
      return;
    }
    await setProfile({ ...profile, weightKg: w });
    Alert.alert('Enregistré', 'Poids mis à jour — vos objectifs ont été recalculés.');
  };

  const setGoal = async (g: Goal) => {
    await setProfile({ ...profile, goal: g });
  };

  const setActivity = async (lvl: ActivityLevel) => {
    await setProfile({ ...profile, activityLevel: lvl });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Réglages</Text>

        <Text style={styles.sectionTitle}>Clé API Anthropic</Text>
        <Text style={styles.help}>
          Nécessaire pour l’analyse des photos. Créez une clé sur platform.claude.com.
        </Text>
        <TextInput
          style={styles.input}
          value={keyInput}
          onChangeText={setKeyInput}
          placeholder="sk-ant-..."
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={saveKey}>
          <Text style={styles.buttonText}>Enregistrer la clé</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Poids actuel (kg)</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            value={weightInput}
            onChangeText={setWeightInput}
            keyboardType="decimal-pad"
          />
          <TouchableOpacity style={[styles.button, styles.buttonInline]} onPress={saveWeight}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Objectif</Text>
        {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.option, profile.goal === g && styles.optionActive]}
            onPress={() => void setGoal(g)}
          >
            <Text style={[styles.optionText, profile.goal === g && styles.optionTextActive]}>
              {GOAL_LABELS[g]}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Niveau d’activité</Text>
        {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((lvl) => (
          <TouchableOpacity
            key={lvl}
            style={[styles.option, profile.activityLevel === lvl && styles.optionActive]}
            onPress={() => void setActivity(lvl)}
          >
            <Text
              style={[
                styles.optionText,
                profile.activityLevel === lvl && styles.optionTextActive,
              ]}
            >
              {ACTIVITY_LABELS[lvl]}
            </Text>
          </TouchableOpacity>
        ))}

        {targets && (
          <Text style={styles.summary}>
            Objectif quotidien : {targets.targetCalories} kcal · {targets.targetProtein} g de
            protéines · {targets.burnGoalKcal} kcal d’activité
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl * 2 },
  heading: { fontSize: 28, fontWeight: '700', color: colors.text, marginVertical: spacing.sm },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  help: { color: colors.textMuted, fontSize: 13, marginBottom: spacing.sm },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  row: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  buttonInline: { paddingHorizontal: spacing.lg },
  buttonText: { color: '#fff', fontWeight: '700' },
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
  summary: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
