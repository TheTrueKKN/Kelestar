import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { Dish } from "../interfaces/dish";
import { Base64Image } from "../interfaces/base64image";
import {
  updateBase64DishImage,
  uploadBase64ImageDishes,
  deleteDishImage,
  getDishImage,
} from "./fileController";
import {
  getMealListingByDish,
} from "./mealController";

type InsertDishReturn = [string | null, boolean];

export async function getDishes({
  dish_vendor_id,
  dish_name,
  active
}: Dish) {
  try {
    // console.log(`Curr vendor id: ${vendor_id}`)

    let queryBuilder = supabase
      .from("dish")
      .select("*, dish_vendor: dish_vendor_id(vendor_name), dish_nutrition: dish_nutrition_id(*)")
      .limit(500);

    queryBuilder = dish_vendor_id
      ? queryBuilder.eq("dish_vendor_id", dish_vendor_id)
      : queryBuilder;

    queryBuilder = dish_name
      ? queryBuilder.ilike("dish_name", `%${dish_name}%`)
      : queryBuilder;

    queryBuilder = active
      ? queryBuilder.eq("active", true)
      : queryBuilder;

    //console.log("Running query with filters:", queryBuilder);
    const { data, error, status } = await queryBuilder;
    // console.log(`Data: ${JSON.stringify(data)}, error: ${JSON.stringify(error)}, status: ${JSON.stringify(status)}`)
    if (error && status !== 406) throw error;

    data?.map(async (dish: Dish) => {
      dish.dish_image_url = (await getDishImage(dish.dish_image_name!)) ?? "";
    });

    return data as Dish[];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function insertDish(
  vendor_id: string,
  { dish_name, dish_price, dish_total_carbon }: Dish,
  { base64, uri }: Base64Image
): Promise<InsertDishReturn> {
  try {
    const dish: Dish = {
      dish_name: dish_name,
      dish_price: dish_price,
      dish_image_name: "",
      dish_vendor_id: vendor_id,
      dish_total_carbon: dish_total_carbon,
      active: true,
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

    // console.log(`Inserting new dish: ${JSON.stringify(error)}`);

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

export async function updateDish(
  { id, dish_name, dish_price, dish_image_name, dish_total_carbon }: Dish,
  { base64, uri }: Base64Image
) {
  try {
    const dish: Dish = {
      id: id,
      dish_name: dish_name,
      dish_price: dish_price,
      dish_image_name: dish_image_name,
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

    // console.log(`Checking update data: ${JSON.stringify(data)}`);
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
    const meal = await getMealListingByDish({ meal_dish_id: id }, 1);

    console.log("meal", meal);

    let query;
    if (meal?.length && meal?.length > 0) {
      const dish: Dish = {
        active: false,
      };
      query = supabase.from("dish").update(dish).eq("id", id);
    } else {
      query = supabase.from("dish").delete().eq("id", id);

      if (dish_image_name) {
        await deleteDishImage(dish_image_name);
      }
    }

    console.log(`Current query:${JSON.stringify(query)}`)
    const { data, error, status } = await query;
    console.log(`Data: ${data}, error:${error}`)
    if (error && status !== 406) throw error;

    return true;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
      return false;
    }
  }
}

// export async function deleteDish({ id, dish_image_name }: Dish) {
//   try {
//     console.log(`Current dish id: ${id}`);
//     const { data, error } = await supabase.from("dish").delete().eq("id", id);

//     console.log(`Testing delete: ${JSON.stringify(data)}`);

//     if (dish_image_name) {
//       await deleteDishImage(dish_image_name);
//     }
//   } catch (error) {}
// }
