import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { Dish } from "../interfaces/dish";
import { Base64Image } from "../interfaces/base64image";
import {
  updateBase64DishImage,
  uploadBase64ImageDishes,
  deleteDishImage,
} from "./fileController";

type InsertDishReturn = [number | null, boolean];

export async function insertDish(
    vendor_id: string,
    {dish_name, dish_price, dish_total_carbon}: Dish,
    {base64, uri}: Base64Image
): Promise<InsertDishReturn> {
    try {
        const dish: Dish = {
            dish_name: dish_name,
            dish_price: dish_price,
            dish_image_name: "",
            dish_vendor_id: vendor_id,
            dish_total_carbon:dish_total_carbon
        };

    if (base64) {
      const dish_image_name = await uploadBase64ImageDishes({
        base64: base64,
        uri: uri,
      });
      if (dish_image_name != null) {
        dish.dish_image_name = dish_image_name;
      }
    } else {
      throw new Error("Please provide a dish photo");
    }
    //console.log(`Current dish insert: ${JSON.stringify(dish)}`);
    const { data, error } = await supabase.from("dish").insert(dish).select();

    console.log(`Inserting new dish: ${JSON.stringify(error)}`);

    if (error) {
      throw error;
    }
    return [data?.[0]?.id ?? null, true]; //
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
    return [null, false];
  }
}

interface getDishesParams {
    vendor_id?: string;
    dish_name?: string;
}

export async function getDishes({vendor_id, dish_name}: getDishesParams) {
  try {
    // console.log(`Curr vendor id: ${vendor_id}`)
    let queryBuilder = supabase.from("dish").select("*");

    queryBuilder = vendor_id
      ? queryBuilder.eq("dish_vendor_id", vendor_id)
      : queryBuilder;

    queryBuilder = dish_name ?
    queryBuilder.ilike("dish_name", `%${dish_name}%`)
    : queryBuilder

    const { data, error, status } = await queryBuilder;
    // console.log(`Data: ${JSON.stringify(data)}, error: ${JSON.stringify(error)}, status: ${JSON.stringify(status)}`)
    return data as Dish[];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateDish(
    {id, dish_name, dish_price, dish_image_name, dish_total_carbon}: Dish,
    {base64, uri}: Base64Image
) {
    try {
       const dish: Dish = {
        id: id,
        dish_name: dish_name,
        dish_price: dish_price,
        dish_image_name:dish_image_name,
        dish_total_carbon: dish_total_carbon,
       };

    if (base64 && dish?.dish_image_name) {
      const dish_image_name = await updateBase64DishImage({
        fileName: dish?.dish_image_name,
        base64: base64,
        uri: uri,
      });
      if (dish_image_name != null) {
        dish.dish_image_name = dish_image_name;
      }
    }

    const { data, error } = await supabase
      .from("dish")
      .update(dish)
      .eq("id", dish.id);

    if (error) {
      throw error;
    }

    console.log(`Checking update data: ${JSON.stringify(data)}`);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return false;
    }
  }
}

export async function deleteDish({ id, dish_image_name }: Dish) {
  try {
    console.log(`Current dish id: ${id}`);
    const { data, error } = await supabase.from("dish").delete().eq("id", id);

    console.log(`Testing delete: ${JSON.stringify(data)}`);

    if (dish_image_name) {
      await deleteDishImage(dish_image_name);
    }
  } catch (error) {}
}
