import { GenerateContentRequest, GoogleGenerativeAI, Part } from '@google/generative-ai';

const API_KEY = 'AIzaSyDv3YZNgEGJg3Vexbi6ovIzVniVMQ2xGro';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export const generateNutritionInfo = async (
  ingredients: { ingredient_name: string; ingredient_amount: string }[]
) => {
  // Format the ingredients into a readable list
  const formattedIngredients = ingredients
    .map(
      (item) => `${item.ingredient_name} - ${item.ingredient_amount} grams`
    )
    .join("\n");

  const prompt = `Given the following ingredients and their respective amounts:\n${formattedIngredients}\nEstimate the total Calories, Carbs, Protein, and Fats. Return only these four values.`;
  console.log(`Prompt message: ${prompt}`)
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
        mode: "ANY"
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

    const nutrition = data?.candidates?.[0]?.content?.parts?.[0]?.functionCall?.args;

    return nutrition || { error: "No structured output received." };

  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
};