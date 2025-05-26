import { DishNutrition } from '../interfaces/dishNutrition';

const API_KEY = 'AIzaSyDv3YZNgEGJg3Vexbi6ovIzVniVMQ2xGro';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export const generateNutritionInfo = async (
  ingredients: { ingredient_name: string; ingredient_amount: string }[]
): Promise<DishNutrition | { error: string }> => {
  const formattedIngredients = ingredients
    .map((item) => `${item.ingredient_name} - ${item.ingredient_amount} grams`)
    .join("\n");

  const prompt = `
Estimate the total nutrition for the following ingredients and amounts. 
List the total estimated **Calories (kcal)**, **Carbs (g)**, **Protein (g)**, and **Fats (g)**. 
Return only the numeric values in a clear list or table format. No explanations needed

Ingredients:
${formattedIngredients}
`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  };

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Returned data:", JSON.stringify(data, null, 2));
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) return { error: "No nutrition data found." };

    const caloriesMatch = reply.match(/calories.*?(\d+(\.\d+)?)/i);
    const carbsMatch = reply.match(/carbs.*?(\d+(\.\d+)?)/i);
    const proteinMatch = reply.match(/protein.*?(\d+(\.\d+)?)/i);
    const fatsMatch = reply.match(/fats.*?(\d+(\.\d+)?)/i);

    const nutritionData: DishNutrition = {
      calories: caloriesMatch ? parseFloat(caloriesMatch[1]) : null,
      carbs: carbsMatch ? parseFloat(carbsMatch[1]) : null,
      protein: proteinMatch ? parseFloat(proteinMatch[1]) : null,
      fats: fatsMatch ? parseFloat(fatsMatch[1]) : null,
    };

    return nutritionData;

  } catch (error) {
    console.error("Gemini API error:", error);
    return { error: "Failed to get nutrition info." };
  }
};
