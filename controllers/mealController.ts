import { Alert } from "react-native";
import { Meal } from "../interfaces/meal";
import { supabase } from "../lib/supabase";
import { getCustomerByUser } from "./customerController";
import { getDishImage } from "./fileController";

export async function getMealListingByCustomer(date?: Date) {
  try {
    const currentCustomer = await getCustomerByUser();

    let queryBuilder = supabase
      .from("meal")
      .select("*, meal_dish: meal_dish_id(*)")
      .limit(1000)
      .eq("meal_customer_id", currentCustomer?.id);

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0); // Start of day (00:00:00)

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999); // End of day (23:59:59.999)

      queryBuilder = queryBuilder
        .gte("meal_datetime", startOfDay.toISOString())
        .lte("meal_datetime", endOfDay.toISOString());
    }

    queryBuilder = queryBuilder.order(`meal_datetime`, { ascending: false });

    const { data, error, status } = await queryBuilder;

    data?.map(async (meal: Meal) => {
      meal.meal_datetime = new Date(meal.meal_datetime!);
      meal.meal_dish!.dish_image_url = await getDishImage(meal.meal_dish!.dish_image_name!) ?? "";
    });

    if (error && status !== 406) throw error;
    // console.log(`Data: ${JSON.stringify(data)}, error: ${JSON.stringify(error)}, status: ${JSON.stringify(status)}`)
    return data as Meal[];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getMealListingByDish({meal_dish_id}: Meal, count: number) {
  try {
    const { data, error, status } = await supabase
      .from("meal")
      .select("*")
      .limit(count)
      .eq("meal_dish_id", meal_dish_id);

    if (error && status !== 406) throw error;
    // console.log(`Data: ${JSON.stringify(data)}, error: ${JSON.stringify(error)}, status: ${JSON.stringify(status)}`)
    return data as Meal[];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function insertMeal({ meal_datetime, meal_dish_id }: Meal) {
  try {
    const currentCustomer = await getCustomerByUser();

    const meal: Meal = {
      meal_datetime: meal_datetime,
      meal_dish_id: meal_dish_id,
      meal_customer_id: currentCustomer?.id,
      updated_at: new Date(),
    };

    const { error } = await supabase.from("meal").insert(meal);

    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
