import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useApp } from '../context/AppContext';
import { analyzeMealPhoto } from '../services/foodRecognition';
import { colors, radius, spacing } from '../theme';
import type { RootStackParamList } from '../navigation';

export default function ScanScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { apiKey, addMeal } = useApp();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pick = async (fromCamera: boolean) => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      quality: 0.6,
      base64: true,
      allowsEditing: false,
    };

    let result: ImagePicker.ImagePickerResult;
    if (fromCamera) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission requise', 'Autorisez l’accès à la caméra pour scanner un repas.');
        return;
      }
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission requise', 'Autorisez l’accès aux photos.');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setImageUri(asset.uri);

    if (!asset.base64) {
      Alert.alert('Erreur', 'Impossible de lire l’image.');
      return;
    }

    if (!apiKey) {
      Alert.alert(
        'Clé API manquante',
        'Ajoutez votre clé API Anthropic dans l’onglet Réglages pour activer l’analyse.',
      );
      return;
    }

    setLoading(true);
    try {
      const analysis = await analyzeMealPhoto(apiKey, asset.base64);
      if (analysis.foods.length === 0) {
        Alert.alert('Aucun aliment détecté', analysis.notes || 'Réessayez avec une autre photo.');
        return;
      }
      await addMeal(analysis, asset.uri);
      navigation.navigate('Result', { analysis });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erreur inconnue';
      Alert.alert('Analyse impossible', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Scanner un repas</Text>
      <Text style={styles.subtitle}>
        Prenez votre assiette en photo : l’IA identifie les aliments et estime calories et
        macronutriments.
      </Text>

      <View style={styles.preview}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <Ionicons name="fast-food-outline" size={72} color={colors.border} />
        )}
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Analyse en cours…</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={() => pick(true)}
        disabled={loading}
      >
        <Ionicons name="camera" size={22} color="#fff" />
        <Text style={styles.buttonText}>Prendre une photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary, loading && styles.buttonDisabled]}
        onPress={() => pick(false)}
        disabled={loading}
      >
        <Ionicons name="images" size={22} color={colors.primary} />
        <Text style={[styles.buttonText, { color: colors.primary }]}>
          Choisir dans la galerie
        </Text>
      </TouchableOpacity>

      <Text style={styles.tip}>
        💡 Conseil : cadrez toute l’assiette, avec un couvert visible pour aider l’estimation des
        portions.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  heading: { fontSize: 28, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  subtitle: { color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.lg },
  preview: {
    height: 260,
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  previewImage: { width: '100%', height: '100%' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { color: '#fff', marginTop: spacing.sm, fontWeight: '600' },
  button: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  buttonSecondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  tip: { color: colors.textMuted, fontSize: 13, marginTop: spacing.md },
});
