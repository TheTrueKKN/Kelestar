import { JoinedDishIngredient } from "./joinedDishIngredient";
import { CarbonRating } from "../enums/carbonRating";
import { Vendor } from "./vendor";

export interface Dish {
    id?: string;
    dish_name?: string;
    dish_price?:  number;
    dish_image_name?: string | null;
    dish_image_url?: string;
    dish_vendor_id?: string;
    dish_vendor?: Vendor;
    dish_total_carbon?: number;
    dish_ingredient?: JoinedDishIngredient[]
    dish_rating?: CarbonRating
  }