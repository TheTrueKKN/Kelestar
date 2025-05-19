import { GenerateContentRequest, GoogleGenerativeAI, Part } from '@google/generative-ai';

const API_KEY = 'AIzaSyDv3YZNgEGJg3Vexbi6ovIzVniVMQ2xGro';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export const generateNutritionInfo = async (ingredientList: string) => {
  const prompt = `Given the following ingredients and their amounts:\n${ingredientList}\nEstimate the total Calories, Carbs, Protein, and Fats.`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    tools: [
      {
        functionDeclarations: [
          {
            name: "getNutritionInfo",
            description: "Returns estimated nutrition values.",
            parameters: {
              type: "object",
              properties: {
                Calories: { type: "number" },
                Carbs: { type: "number" },
                Protein: { type: "number" },
                Fats: { type: "number" }
              },
              required: ["Calories", "Carbs", "Protein", "Fats"]
            }
          }
        ]
      }
    ],
    toolConfig: {
      functionCallingConfig: {
        mode: "ANY" // Important: allows Gemini to choose and format function call correctly
      }
    }
  };

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Returned data:", JSON.stringify(data, null, 2));

    const result = data?.candidates?.[0]?.content?.parts?.[0]?.functionCall?.args;
    return result || { error: "Structured output not found." };

  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
};