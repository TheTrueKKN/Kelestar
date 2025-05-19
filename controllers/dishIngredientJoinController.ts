import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { JoinedDishIngredient } from "../interfaces/joinedDishIngredient";

export async function joinDishIngredient(
    dishId:string
){
    try {
        const { data, error } = await supabase
        .from('dish_ingredient')
        .select(`
            ingredient:ingredient_id (
            *
            ),
            ingredient_amount
        `)
        .eq('dish_id', dishId); 

        
        // console.log(`Checking joined data: ${JSON.stringify(data)}`)

        if (error) throw error;

        const cleanedData = (data ?? []).map((item) => ({
            ingredient: Array.isArray(item.ingredient) ? item.ingredient[0] : item.ingredient,
            ingredient_amount: item.ingredient_amount,
        }));

    return cleanedData as JoinedDishIngredient[];
    } catch (error) {
        if (error instanceof Error) {
            Alert.alert(error.message);
            return false;
        }
    }
}