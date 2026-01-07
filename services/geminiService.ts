
import { GoogleGenAI, Type } from "@google/genai";
import { Cocktail, MoodProfile, TastePreference } from "../types";

export const getCocktailRecommendations = async (
  temp: number,
  mood: MoodProfile,
  taste: TastePreference
): Promise<Cocktail[]> => {
  console.log("Service: Starting recommendation with", { temp, mood, taste });
  
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "") {
    console.error("Service Error: API_KEY is empty or undefined");
    throw new Error("API_KEY_MISSING: 请在 Vercel 环境变量中配置 API_KEY，并重新部署项目。");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are a professional mixologist. Recommend 3 specific cocktails for these conditions:
    - Temperature: ${temp}°C
    - User Mood Profile (0-100): Joy(${mood.joy}), Energy(${mood.energy}), Calm(${mood.calm})
    - Preference: ${taste.abv} alcohol level, Sweetness level ${taste.sweetness}/5, Sourness level ${taste.sourness}/5.
    
    RULES:
    1. Respond ONLY with a JSON array of objects.
    2. Must be based on IBA standards.
    3. Include name, description, matchScore, matchReason, abv, ingredients, calories, instructions, glassType, and flavorProfile.`;

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

    let text = response.text;
    if (!text) throw new Error("AI_NO_RESPONSE: 模型没有返回任何内容");

    // 强力 JSON 提取
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const cleanedText = jsonMatch ? jsonMatch[0] : text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const cocktails = JSON.parse(cleanedText);
    return cocktails.map((c: any) => ({
      ...c,
      id: c.id || Math.random().toString(36).substr(2, 9),
      image: `https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop&sig=${encodeURIComponent(c.name)}`
    })).sort((a: any, b: any) => b.matchScore - a.matchScore);
  } catch (error: any) {
    console.error("Gemini Service Error details:", error);
    throw error;
  }
};
