import Anthropic from '@anthropic-ai/sdk';

import { MealAnalysis } from '../types';

const MODEL = 'claude-opus-4-8';

const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    foods: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Nom de l’aliment en français' },
          quantity: { type: 'string', description: 'Portion estimée, ex: "150 g" ou "1 tasse"' },
          calories: { type: 'number', description: 'Calories estimées (kcal)' },
          protein: { type: 'number', description: 'Protéines en grammes' },
          carbs: { type: 'number', description: 'Glucides en grammes' },
          fat: { type: 'number', description: 'Lipides en grammes' },
        },
        required: ['name', 'quantity', 'calories', 'protein', 'carbs', 'fat'],
        additionalProperties: false,
      },
    },
    confidence: {
      type: 'string',
      enum: ['low', 'medium', 'high'],
      description: 'Confiance globale de l’estimation',
    },
    notes: {
      type: 'string',
      description: 'Remarques courtes en français (portions incertaines, aliments cachés...)',
    },
  },
  required: ['foods', 'confidence', 'notes'],
  additionalProperties: false,
} as const;

const PROMPT = `Analyse cette photo de repas. Identifie chaque aliment visible, estime la portion \
et donne les calories et macronutriments (protéines, glucides, lipides) pour chaque aliment. \
Sois réaliste sur les portions : base-toi sur la taille de l'assiette et les objets visibles. \
Si l'image ne contient pas de nourriture, retourne une liste "foods" vide et explique dans "notes".`;

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

export async function analyzeMealPhoto(
  apiKey: string,
  base64Image: string,
  mediaType: ImageMediaType = 'image/jpeg',
): Promise<MealAnalysis> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    output_config: {
      format: {
        type: 'json_schema',
        schema: ANALYSIS_SCHEMA as unknown as Record<string, unknown>,
      },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64Image },
          },
          { type: 'text', text: PROMPT },
        ],
      },
    ],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error('L’analyse a été refusée. Réessayez avec une autre photo.');
  }

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Réponse inattendue du service d’analyse.');
  }

  const parsed = JSON.parse(textBlock.text) as {
    foods: MealAnalysis['foods'];
    confidence: MealAnalysis['confidence'];
    notes: string;
  };

  const totals = parsed.foods.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      protein: acc.protein + f.protein,
      carbs: acc.carbs + f.carbs,
      fat: acc.fat + f.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return {
    foods: parsed.foods,
    totalCalories: Math.round(totals.calories),
    totalProtein: Math.round(totals.protein),
    totalCarbs: Math.round(totals.carbs),
    totalFat: Math.round(totals.fat),
    confidence: parsed.confidence,
    notes: parsed.notes,
  };
}
