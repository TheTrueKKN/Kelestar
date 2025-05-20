import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { DishIngredient } from "../interfaces/dishIngredient";
import { JoinedDishIngredient } from "../interfaces/joinedDishIngredient";
import { generateNutritionInfo } from "../components/GeminiAI";

export async function insertDishIngredient(
  dishId: string,
  dishIngredient: DishIngredient[]
): Promise<boolean> {
  try {
    // Step 1: Map ingredients with dish ID
    const ingredientsWithDishId = dishIngredient.map(({ ingredient, ...rest }) => ({
      ...rest,
      dish_id: dishId,
    }));

    const { data: insertedIngredients, error: insertError } = await supabase
      .from("dish_ingredient")
      .insert(ingredientsWithDishId)
      .select();

    if (insertError) {
      console.error("Error inserting dish ingredients:", insertError.message);
      throw insertError;
    }

    // Step 2: Prepare data for nutrition API
    const extractedData = dishIngredient.map(item => ({
      ingredient_name: item.ingredient?.ingredient_name ?? "",
      ingredient_amount: item.ingredient_amount?.toString() ?? "0"
    }));

    const dish_nutrient = await generateNutritionInfo(extractedData);
    console.log(`Generated nutrition: ${JSON.stringify(dish_nutrient)}`);

    if ("error" in dish_nutrient) {
      console.error("Error in generated nutrition data:", dish_nutrient.error);
      throw new Error("Failed to generate nutrition information");
    }

    // Step 3: Insert nutrition data into dish_nutrition
    const { data: nutritionData, error: nutrientError } = await supabase
      .from("dish_nutrition")
      .insert([
        {
          fats: dish_nutrient.fats,
          calories: dish_nutrient.calories,
          protein: dish_nutrient.protein,
          carbs: dish_nutrient.carbs,
        },
      ])
      .select();

    if (nutrientError || !nutritionData || nutritionData.length === 0) {
      console.error("Error inserting nutrition data:", nutrientError?.message);
      throw nutrientError ?? new Error("Failed to insert nutrition data");
    }

    // Step 4: Link nutrition data to dish
    const { error: updateDishError } = await supabase
      .from("dish")
      .update({
        dish_nutrition_id: nutritionData[0].id,
      })
      .eq("id", dishId);

    if (updateDishError) {
      console.error("Error updating dish with nutrition ID:", updateDishError.message);
      throw updateDishError;
    }

    return true;

  } catch (error) {
    if (error instanceof Error) {
      console.error("Insert dish ingredient failed:", error.message);
      Alert.alert("Error", error.message);
    }
    return false;
  }
}


export async function updateDishIngredient(
    dishId: string,
    dishIngredientList: JoinedDishIngredient[]
){
    try {
        console.log(`Current dish ingredient: ${JSON.stringify(dishIngredientList)}`)
       
        // 1. Removing all existing dish ingredients 
        const { error: deleteError } = await supabase
        .from('dish_ingredient')
        .delete()
        .eq('dish_id', dishId);

        if(deleteError){
            console.error("Error updating ingredients", deleteError)
            return false
        }

        // 2. Inserting new list
        const insertData = dishIngredientList.map(({ ingredient, ingredient_amount }) => ({
            dish_id: dishId,
            ingredient_id: ingredient.id,
            ingredient_amount
          }));

          //console.log(`Checking inserting data in dish ing list: ${JSON.stringify(insertData)}`)
        const { error: insertError } = await supabase
        .from('dish_ingredient')
        .insert(insertData)  
        
        if (insertError) {
            console.error("Error inserting new ingredients:", insertError);
            return false;
        }

        const extractedData = dishIngredientList.map(item => ({
            ingredient_name: item.ingredient!.ingredient_name!,
            ingredient_amount: item.ingredient_amount!.toString()
        }));

        const {data: dishNutrientKey} = await supabase
        .from("dish")
        .select("dish_nutrition_id")
        .eq('id', dishId)

        const dish_nutrient = await generateNutritionInfo(extractedData)
        // console.log(`Dish nutrition:${JSON.stringify(dish_nutrient)}`)

        // console.log(`Nutrition keyL ${JSON.stringify(dishNutrientKey)}`)
        
        if('error' in dish_nutrient){
            console.error("Error in generated nutrition data:", dish_nutrient.error);
        } else{
            const { data:nutritionData, error:nutrientError } = await supabase
        .from("dish_nutrition")
        .update([
            {
                fats: dish_nutrient.fats,
                calories: dish_nutrient.calories,
                protein: dish_nutrient.protein,
                carbs: dish_nutrient.carbs
            }
        ])
        .eq('id', dishNutrientKey![0].dish_nutrition_id)
        .select();
        }


        return true;
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
            return false;
            }
    }
}