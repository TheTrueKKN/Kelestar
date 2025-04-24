import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { DishIngredient } from "../interfaces/dishIngredient";

export async function insertDishIngredient(
    dishId: number, 
    dishIngredient: DishIngredient[]
) {
    try {
    
    const ingredientsWithDishId = dishIngredient.map(ingredient => ({
        ...ingredient,
        dish_id: dishId, // assuming 'dish_id' is the column name in your table
    }));

    // console.log(`DATA in dish Ingredient list: ${JSON.stringify(ingredientsWithDishId)}`)    
    const {data, error} = await supabase
    .from("dish_ingredient")
    .insert(ingredientsWithDishId)
    .select()

    // console.log(`Inserting new dishingredient: ${JSON.stringify(data)}`);

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