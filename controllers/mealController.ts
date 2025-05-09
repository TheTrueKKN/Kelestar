import { Alert } from "react-native";
import { Meal } from "../interfaces/meal";
import { supabase } from "../lib/supabase";
import { getCustomerByUser } from "./customerController";

export async function getMealListingByCustomer() {
  try {
    const currentCustomer = await getCustomerByUser();

    const { data, error, status } = await supabase
      .from("meal")
      .select("*, meal_dish: meal_dish_id(*)")
      .limit(1000)
      .eq("meal_customer_id", currentCustomer?.id)
      .order(`meal_datetime`, {ascending: false});

    data?.map((meal) => {meal.meal_datetime = new Date(meal.meal_datetime)});

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
