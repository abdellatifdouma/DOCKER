# NutriScan 🥗📸

Application mobile (iOS / Android) qui **scanne vos repas en photo**, estime les **calories et macronutriments** grâce à l'IA (vision Claude), et vous propose des **exercices adaptés** pour brûler ce que vous avez mangé — selon votre objectif : perte de poids, maintien, prise de poids ou prise de masse musculaire.

## Fonctionnalités

- 📸 **Scan de repas** : photographiez n'importe quelle assiette (ou choisissez une photo). L'IA identifie chaque aliment, estime les portions, les calories et les macros (protéines, glucides, lipides).
- 🎯 **Objectifs personnalisés** : calcul du métabolisme de base (formule Mifflin-St Jeor) et de la dépense journalière (TDEE) à partir de votre profil (sexe, âge, taille, poids, niveau d'activité). L'objectif calorique s'adapte : déficit pour la perte de poids, surplus pour la prise de poids / masse musculaire (avec objectif protéines renforcé).
- 🏃 **Suggestions d'exercices** : après chaque repas, l'app calcule combien de minutes de marche, course, vélo, corde à sauter, squats, etc. (formules MET) — ou combien de pas — sont nécessaires pour brûler ces calories.
- 👣 **Suivi de l'effort physique** : podomètre intégré (capteur de pas) + enregistrement rapide d'exercices, avec conversion automatique en calories brûlées.
- 🔔 **Notifications** : vous êtes notifié dès que votre objectif d'activité du jour est atteint.
- 📊 **Tableau de bord & historique** : calories restantes, protéines, activité, historique des repas par jour.

## Stack technique

- [Expo](https://expo.dev) / React Native + TypeScript
- Reconnaissance des repas : API Claude (modèle `claude-opus-4-8`, vision + sorties structurées JSON)
- Podomètre : `expo-sensors` · Notifications : `expo-notifications` · Stockage local : AsyncStorage

## Démarrage

```bash
npm install
npx expo start
```

Scannez le QR code avec l'application **Expo Go** (iOS/Android), ou lancez un émulateur (`a` pour Android, `i` pour iOS).

### Configuration de la clé API

L'analyse des photos utilise l'API Claude d'Anthropic :

1. Créez une clé API sur [platform.claude.com](https://platform.claude.com)
2. Dans l'app, ouvrez l'onglet **Réglages** et collez la clé (`sk-ant-...`)

> ⚠️ La clé est stockée localement sur l'appareil (usage personnel). Pour une application distribuée publiquement, faites transiter les appels par votre propre backend afin de ne jamais embarquer de clé API dans l'app.

## Structure du projet

```
App.tsx                      # Navigation (onglets + pile) et démarrage
src/
  context/AppContext.tsx     # État global : profil, repas, activité, objectifs
  navigation.ts              # Types de navigation
  screens/
    OnboardingScreen.tsx     # Profil initial (sexe, âge, taille, poids, objectif)
    DashboardScreen.tsx      # Tableau de bord du jour
    ScanScreen.tsx           # Prise de photo + analyse IA
    ResultScreen.tsx         # Détail calories/macros + exercices pour brûler
    ActivityScreen.tsx       # Podomètre, exercices rapides, objectif d'activité
    HistoryScreen.tsx        # Historique des repas par jour
    SettingsScreen.tsx       # Clé API, poids, objectif, niveau d'activité
  services/
    foodRecognition.ts       # Appel API Claude (vision + JSON structuré)
    notifications.ts         # Notification "objectif atteint"
    storage.ts               # Persistance AsyncStorage
  utils/nutrition.ts         # BMR/TDEE, formules MET, conversions pas ↔ kcal
```

## Notes sur les calculs

- **BMR** : Mifflin-St Jeor (`10×poids + 6,25×taille − 5×âge ± constante`)
- **TDEE** : BMR × facteur d'activité (1,2 → 1,9)
- **Objectifs** : perte −500 kcal/j · maintien ±0 · prise +300 · masse musculaire +250 avec 2 g de protéines/kg
- **Exercices** : `kcal/min = MET × 3,5 × poids / 200` (Compendium of Physical Activities)
- **Pas** : ≈ 0,035 kcal/pas pour 70 kg, proportionnel au poids

Les estimations caloriques issues de photos sont indicatives et ne remplacent pas un avis médical ou diététique professionnel.
