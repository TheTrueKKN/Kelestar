import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { DishIngredient } from "../interfaces/dishIngredient";
import { JoinedDishIngredient } from "../interfaces/joinedDishIngredient";

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