import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { DishIngredient } from "../interfaces/dishIngredient";
import { JoinedDishIngredient } from "../interfaces/joinedDishIngredient";
import { generateNutritionInfo } from "../components/GeminiAI";

export async function insertDishIngredient(
    dishId: string, 
    dishIngredient: DishIngredient[]
) {
    try {

    const ingredientsWithDishId = dishIngredient.map(({ ingredient, ...rest }) => ({
        ...rest,
        dish_id: dishId,
    }));

    //console.log(`DATA in dish Ingredient list: ${JSON.stringify(ingredientsWithDishId)}`)    
    const {data, error} = await supabase
    .from("dish_ingredient")
    .insert(ingredientsWithDishId)
    .select()

    //console.log(`Inserting new dishingredient: ${JSON.stringify(error)}`);

    const extractedData = dishIngredient.map(item => ({
        ingredient_name: item.ingredient!.ingredient_name!,
        ingredient_amount: item.ingredient_amount!.toString()
    }));

    const dish_nutrient = await generateNutritionInfo(extractedData)
    console.log(`Dish nutrition:${JSON.stringify(dish_nutrient)}`)

    const { data:nutritionData, error:nutrientError } = await supabase
    .from("dish_nutrition")
    .insert([
        {
            fats: dish_nutrient["Fats"],
            calories: dish_nutrient["Calories"],
            protein: dish_nutrient["Protein"],
            carbs: dish_nutrient["Carbs"]
        }
    ])
    .select();

    console.log(`Result from insert nutrition Data:${JSON.stringify(nutritionData)}, Error:${nutrientError}`)

    const { error: nutritionKeyError } = await supabase
    .from("dish")
    .update({
        dish_nutrition_id: nutritionData![0].id
    })
    .eq("id", dishId);

    if (error) {
        throw error
    }
    return true
    } catch (error) {
    if (error instanceof Error) {
        Alert.alert(error.message);
        return false;
        }
    }
}

export async function updateDishIngredient(
    dishId: string,
    dishIngredientList: JoinedDishIngredient[]
){
    try {

       
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

        return true;
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
            return false;
            }
    }
}