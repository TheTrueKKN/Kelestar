import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { Dish } from "../interfaces/dish";

export async function joinVendorDishIng(
    vendorId: string
){
    try {
        const { data, error } = await supabase
            .from('dish')
            .select(`
                *,
                dish_ingredient (
                ingredient_amount,
                ingredient:ingredient_id (
                id, 
                ingredient_name,
                ingredient_footprint
                )
            )
        `)
        .eq('dish_vendor_id', vendorId)
        .eq('active', true);

  if (error) {
    console.error('Error fetching dishes:', error);
    return [];
  }

  //console.log(`Fetching vendor dishes: ${JSON.stringify(data)}`)
  return data as Dish
    } catch (error) {
        
    }
}