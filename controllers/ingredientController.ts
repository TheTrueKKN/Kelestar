import { Alert } from "react-native";
import { Ingredient } from "../interfaces/ingredient";
import { supabase } from "../lib/supabase";

export async function getIngredientListing(): Promise<Ingredient[] | null> {
  try {
    const { data, error, status } = await supabase
      .from("ingredient")
      .select(`id, ingredient_name, ingredient_footprint`)
      .order(`ingredient_name`, {ascending: true})

    // console.log(data);

    if (error && status !== 406) throw error;

    return data as Ingredient[];
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
    return null;
  }
}