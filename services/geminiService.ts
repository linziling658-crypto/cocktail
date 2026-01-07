
import { GoogleGenAI, Type } from "@google/genai";
import { Cocktail, MoodProfile, TastePreference } from "../types";

export const getCocktailRecommendations = async (
  temp: number,
  mood: MoodProfile,
  taste: TastePreference
): Promise<Cocktail[]> => {
  console.log("Service: Mixing recommendations...");
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING: Please configure the API_KEY in Vercel settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a legendary IBA mixologist. Recommend 3 cocktails for these conditions:
    - Environment: ${temp}°C
    - Mood: Joy ${mood.joy}%, Energy ${mood.energy}%, Calm ${mood.calm}%
    - Preference: ${taste.abv} alcohol, Sweetness ${taste.sweetness}/5, Sourness ${taste.sourness}/5.
    Return ONLY a raw JSON array of objects.`;

  try {
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

    const text = response.text;
    if (!text) throw new Error("Empty response from AI.");

    const cocktails = JSON.parse(text);
    return cocktails.map((c: any) => ({
      ...c,
      id: Math.random().toString(36).substr(2, 9),
      image: `https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop&sig=${encodeURIComponent(c.name)}`
    })).sort((a: any, b: any) => b.matchScore - a.matchScore);
  } catch (error: any) {
    console.error("Mixology Failure:", error);
    throw error;
  }
};
