
import { GoogleGenAI, Type } from "@google/genai";
import { Cocktail, MoodProfile, TastePreference } from "../types";

export const getCocktailRecommendations = async (
  temp: number,
  mood: MoodProfile,
  taste: TastePreference
): Promise<Cocktail[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Missing API_KEY. Please set it in Vercel Environment Variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a world-class mixologist. Recommend 3 cocktails based on:
    - Environment: ${temp}°C
    - Mood (Scale 0-100): Joy: ${mood.joy}, Energy: ${mood.energy}, Calm: ${mood.calm}
    - Taste Preference: Alcohol Level: ${taste.abv}, Sweetness(1-5): ${taste.sweetness}, Sourness(1-5): ${taste.sourness}
    
    CRITICAL: 
    1. References MUST be from the IBA (International Bartenders Association) official cocktail list (https://iba-world.com/).
    2. Rank them by matchScore (1-5).
    3. Provide abv percentage (e.g., "12%").
    4. Provide a flavorProfile (0-10 scale) for sweet, sour, bitter, and strength.
    
    Return the data as a JSON array.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            matchScore: { type: Type.INTEGER },
            matchReason: { type: Type.STRING },
            abv: { type: Type.STRING },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  amount: { type: Type.STRING }
                },
                required: ["name", "amount"]
              }
            },
            calories: { type: Type.NUMBER },
            instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            glassType: { type: Type.STRING },
            flavorProfile: {
              type: Type.OBJECT,
              properties: {
                sweet: { type: Type.NUMBER },
                sour: { type: Type.NUMBER },
                bitter: { type: Type.NUMBER },
                strength: { type: Type.NUMBER }
              }
            }
          },
          required: ["name", "description", "matchScore", "matchReason", "abv", "ingredients", "calories", "instructions", "glassType", "flavorProfile"]
        }
      }
    }
  });

  const cocktails = JSON.parse(response.text);
  return cocktails.map((c: any) => ({
    ...c,
    id: c.id || Math.random().toString(36).substr(2, 9),
    image: `https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop&sig=${c.name.replace(/\s/g, '')}`
  })).sort((a: Cocktail, b: Cocktail) => b.matchScore - a.matchScore);
};
