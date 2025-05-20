import { Ingredient } from "./ingredient";

export interface DishIngredient {
    id?: string;
    dish_id?: string;
    ingredient_id?: string;
    ingredient_amount?: number;
    ingredient?: Ingredient;
  }