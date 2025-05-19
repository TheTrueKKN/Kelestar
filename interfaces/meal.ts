import { Dish } from "./dish";

export interface Meal {
    id?: string;
    meal_datetime?: Date;
    meal_dish_id?: string;
    meal_dish?: Dish;
    meal_customer_id?: string;
    updated_at?: Date;
}