
// Enum representing specific mood categories used in constants.tsx
export enum Mood {
  CHILL = 'CHILL',
  ENERGETIC = 'ENERGETIC',
  ROMANTIC = 'ROMANTIC',
  STRESSED = 'STRESSED',
  CELEBRATORY = 'CELEBRATORY',
  MELANCHOLY = 'MELANCHOLY'
}

export interface MoodProfile {
  joy: number; // 0-100
  energy: number; // 0-100
  calm: number; // 0-100
}

export interface TastePreference {
  abv: 'None' | 'Low' | 'Medium' | 'High';
  sweetness: number; // 1-5
  sourness: number; // 1-5
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Cocktail {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  calories: number;
  instructions: string[];
  image: string;
  tags: string[];
  glassType: string;
  matchScore: number;
  matchReason: string;
  abv: string; // e.g., "15%"
  flavorProfile: {
    sweet: number;
    sour: number;
    bitter: number;
    strength: number;
  };
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  city?: string;
}