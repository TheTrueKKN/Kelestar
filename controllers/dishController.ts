import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { Dish } from "../interfaces/dish";
import { Base64Image } from "../interfaces/base64image";
import { uploadBase64ImageDishes } from "./fileController";

type InsertDishReturn = [number | null, boolean];

export async function insertDish(
    vendor_id: string,
    {dish_name, dish_price}: Dish,
    {base64, uri}: Base64Image
): Promise<InsertDishReturn> {
    try {
        const dish: Dish = {
            dish_name: dish_name,
            dish_price: dish_price,
            dish_image_name: "",
            dish_vendor_id: vendor_id
        };

        if (base64) {
            const dish_image_name = await uploadBase64ImageDishes({
            base64: base64,
            uri: uri,
        });
        if (dish_image_name != null) {
            dish.dish_image_name = dish_image_name;
        }
    }
    else {
        throw new Error("Please provide a dish photo")
    }
    console.log(`Current dish insert: ${JSON.stringify(dish)}`);
    const {data, error} = await supabase
    .from("dish")
    .insert(dish)
    .select()

    console.log(`Inserting new dish: ${JSON.stringify(data)}`);

    if (error) {
        throw error;
      }
      return [data?.[0]?.id ?? null, true];

    } catch (error) {
    if (error instanceof Error) {
        Alert.alert(error.message);
        
        }
        return [null, false];
    }
}


export async function getDishes(
    vendor_id: string
){
    try{
        console.log(`Curr vendor id: ${vendor_id}`)
        const { data, error, status} = await supabase
        .from("dish")
        .select('*')
        // .eq("dish_vendor_id", vendor_id)
        console.log(`Data: ${JSON.stringify(data)}, error: ${JSON.stringify(error)}, status: ${JSON.stringify(status)}`)
        return data
    } catch (error) {

    }
}