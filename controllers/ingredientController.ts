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

export async function getIngredientName(
  ingredientId: String 
){
  try {
    const { data, error, status } = await supabase
    .from("ingredient")
    .select('ingredient_name')
    .eq('id', ingredientId)

    if (error && status !== 406) throw error;

    return data

  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
    return null;
  }
}

export async function getIngredientCarbon(
  ingredientId: String 
){
  try {
    const { data, error, status } = await supabase
    .from("ingredient")
    .select('ingredient_footprint')
    .eq('id', ingredientId)
    .single()

    if (error && status !== 406) throw error;

    return data

  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
    return null;
  }
}