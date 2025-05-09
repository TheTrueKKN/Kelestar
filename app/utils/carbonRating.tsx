import { CarbonRating } from "../../enums/carbonRating";

export function getCarbonRating(footprint: number) {
  let rating = "";
  if (footprint > 5) {
    rating = CarbonRating.C;
  } else if (footprint > 2.5) {
    rating = CarbonRating.B;
  } else {
    rating = CarbonRating.A;
  }

  return rating;
}
